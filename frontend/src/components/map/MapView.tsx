import React, { useEffect, useRef, useState, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { GeoJsonLayer, ScatterplotLayer, PolygonLayer } from '@deck.gl/layers';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { LayerControl } from './LayerControl';
import { HexFeature } from '../../types';
import {
  haversineDistance,
  generateLocalHexagons,
  getClientPoisGeoJSON,
  getClientTransitGeoJSON,
} from '../../utils/clientSpatialEngine';
import {
  Train,
  ShoppingBag,
  Sparkles,
  LocateFixed,
  GitCompare,
  X,
  ArrowLeftRight,
  Undo2,
} from 'lucide-react';

const OPENFREEMAP_LIGHT_STYLE = 'https://tiles.openfreemap.org/styles/positron';
const OPENFREEMAP_DARK_STYLE = 'https://tiles.openfreemap.org/styles/dark';

const ESRI_SATELLITE_STYLE = {
  version: 8,
  sources: {
    'esri-satellite': {
      type: 'raster',
      tiles: [
        'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution: '&copy; Esri, Maxar, Earthstar Geographics',
    },
  },
  layers: [
    {
      id: 'esri-satellite-layer',
      type: 'raster',
      source: 'esri-satellite',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

const getBasemapStyle = (mode: 'light' | 'dark' | 'satellite') => {
  if (mode === 'satellite') return ESRI_SATELLITE_STYLE as any;
  if (mode === 'dark') return OPENFREEMAP_DARK_STYLE;
  return OPENFREEMAP_LIGHT_STYLE;
};

function createCircleGeoJSON(centerLat: number, centerLon: number, radiusMeters: number, points = 64) {
  const coords: [number, number][] = [];
  const km = radiusMeters / 1000;
  const distanceLat = km / 110.574;
  const distanceLon = km / (111.32 * Math.cos((centerLat * Math.PI) / 180));

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceLon * Math.cos(theta);
    const y = distanceLat * Math.sin(theta);
    coords.push([centerLon + x, centerLat + y]);
  }
  coords.push(coords[0]);

  return {
    type: 'Feature' as const,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [coords],
    },
    properties: {},
  };
}

const QUICK_JUMP_HUBS = [
  { label: 'Amir Temur', lat: 41.3120, lon: 69.2800 },
  { label: 'Tashkent City', lat: 41.3145, lon: 69.2485 },
  { label: 'Chorsu', lat: 41.3271, lon: 69.2346 },
  { label: 'Chilonzor', lat: 41.2728, lon: 69.2062 },
  { label: 'Samarqand', lat: 39.6542, lon: 66.9758 },
  { label: 'Buxoro', lat: 39.7732, lon: 64.4215 },
];

export const MapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const deckOverlayRef = useRef<MapboxOverlay | null>(null);

  const {
    selectedCoords,
    setSelectedCoords,
    recentHistory,
    goBackLocation,
    activeLayers,
    radiusMeters,
    category,
    basemapMode,
    pitchMode,
    compareCoords,
    setCompareCoords,
    isPickingCompareOnMap,
    setIsPickingCompareOnMap,
    showComparePinOnMap,
    swapCompareLocations,
    highlightedPoiCoords,
    setHighlightedPoiCoords,
  } = useAnalyticsStore();

  const isPickingCompareRef = useRef(isPickingCompareOnMap);
  useEffect(() => {
    isPickingCompareRef.current = isPickingCompareOnMap;
  }, [isPickingCompareOnMap]);

  // Allow cancelling map pick mode via Escape key
  useEffect(() => {
    if (!isPickingCompareOnMap) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPickingCompareOnMap(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isPickingCompareOnMap, setIsPickingCompareOnMap]);

  const [pois, setPois] = useState<any[]>(() => getClientPoisGeoJSON());
  const [transit, setTransit] = useState<any[]>(() => getClientTransitGeoJSON());
  const [hoverInfo, setHoverInfo] = useState<{
    x: number;
    y: number;
    object: any;
    type: 'hex' | 'poi' | 'transit';
    distanceMeters?: number;
  } | null>(null);

  const hexagons = useMemo<HexFeature[]>(
    () => generateLocalHexagons(selectedCoords, category, radiusMeters),
    [selectedCoords.latitude, selectedCoords.longitude, category, radiusMeters]
  );

  useEffect(() => {
    fetch('/api/v1/poi/geojson')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.features?.length > 0) setPois(data.features);
      })
      .catch(() => {});

    fetch('/api/v1/poi/transit/geojson')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.features?.length > 0) setTransit(data.features);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialStyle = getBasemapStyle(basemapMode);

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: [selectedCoords.longitude, selectedCoords.latitude],
      zoom: 13.6,
      pitch: pitchMode === '3d' ? 42 : 0,
      bearing: pitchMode === '3d' ? -12 : 0,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');

    const deckOverlay = new MapboxOverlay({
      interleaved: false,
      layers: [],
    });
    map.addControl(deckOverlay as any);
    deckOverlayRef.current = deckOverlay;

    map.on('click', (e) => {
      if (isPickingCompareRef.current) {
        setCompareCoords({
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng,
        });
      } else {
        setSelectedCoords({
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng,
        });
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(getBasemapStyle(basemapMode));
  }, [basemapMode]);

  useEffect(() => {
    if (!mapRef.current) return;
    const targetPitch = pitchMode === '3d' ? 42 : 0;
    const targetBearing = pitchMode === '3d' ? -12 : 0;
    mapRef.current.easeTo({
      pitch: targetPitch,
      bearing: targetBearing,
      duration: 600,
      easing: (t) => t * (2 - t),
    });
  }, [pitchMode]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [selectedCoords.longitude, selectedCoords.latitude],
      speed: 1.25,
      curve: 1.35,
      essential: true,
    });
  }, [selectedCoords.latitude, selectedCoords.longitude]);

  useEffect(() => {
    if (!mapRef.current || !highlightedPoiCoords) return;
    mapRef.current.easeTo({
      center: [highlightedPoiCoords.longitude, highlightedPoiCoords.latitude],
      zoom: Math.max(mapRef.current.getZoom(), 14.8),
      duration: 500,
    });
  }, [highlightedPoiCoords]);

  useEffect(() => {
    if (!deckOverlayRef.current) return;

    const layers: any[] = [];

    if (activeLayers.hexagons && hexagons.length > 0) {
      layers.push(
        new PolygonLayer({
          id: 'hexagons-layer',
          data: hexagons,
          getPolygon: (d: HexFeature) => d.coordinates[0],
          getFillColor: (d: HexFeature) => {
            if (d.tier === 'high') return [14, 159, 110, 42];
            if (d.tier === 'medium') return [245, 158, 11, 28];
            return [239, 68, 68, 24];
          },
          getLineColor: (d: HexFeature) => {
            if (d.tier === 'high') return [14, 159, 110, 95];
            if (d.tier === 'medium') return [245, 158, 11, 75];
            return [239, 68, 68, 65];
          },
          getLineWidth: 1,
          lineWidthUnits: 'pixels',
          pickable: true,
          autoHighlight: true,
          highlightColor: [14, 159, 110, 85],
          onHover: (info: any) => {
            if (info.object) {
              setHoverInfo({ x: info.x, y: info.y, object: info.object, type: 'hex' });
            } else {
              setHoverInfo(null);
            }
          },
          onClick: (info: any) => {
            if (info.object && info.object.center) {
              if (isPickingCompareRef.current) {
                setCompareCoords({
                  latitude: info.object.center[1],
                  longitude: info.object.center[0],
                });
              } else {
                setSelectedCoords({
                  latitude: info.object.center[1],
                  longitude: info.object.center[0],
                });
              }
              return true;
            }
            return false;
          },
        })
      );
    }

    if (activeLayers.scanRadius) {
      const circleData = createCircleGeoJSON(
        selectedCoords.latitude,
        selectedCoords.longitude,
        radiusMeters
      );
      layers.push(
        new GeoJsonLayer({
          id: 'scan-radius-layer',
          data: circleData,
          filled: true,
          getFillColor: [14, 159, 110, 22],
          stroked: true,
          getLineColor: [14, 159, 110, 210],
          getLineWidth: 1.75,
          lineWidthUnits: 'pixels',
        })
      );
    }

    if (showComparePinOnMap && compareCoords) {
      const compareCircleData = createCircleGeoJSON(
        compareCoords.latitude,
        compareCoords.longitude,
        radiusMeters
      );
      layers.push(
        new GeoJsonLayer({
          id: 'compare-radius-layer',
          data: compareCircleData,
          filled: true,
          getFillColor: [99, 102, 241, 22],
          stroked: true,
          getLineColor: [99, 102, 241, 210],
          getLineWidth: 1.75,
          lineWidthUnits: 'pixels',
        })
      );

      const lineGeoJSON = {
        type: 'Feature' as const,
        geometry: {
          type: 'LineString' as const,
          coordinates: [
            [selectedCoords.longitude, selectedCoords.latitude],
            [compareCoords.longitude, compareCoords.latitude],
          ],
        },
        properties: {},
      };
      layers.push(
        new GeoJsonLayer({
          id: 'compare-connection-line',
          data: lineGeoJSON,
          stroked: true,
          getLineColor: [99, 102, 241, 180],
          getLineWidth: 2,
          lineWidthUnits: 'pixels',
        })
      );
    }

    if (activeLayers.transit && transit.length > 0) {
      layers.push(
        new ScatterplotLayer({
          id: 'transit-halo-layer',
          data: transit,
          getPosition: (d: any) => d.geometry.coordinates,
          radiusUnits: 'pixels',
          getRadius: 13,
          radiusMinPixels: 9,
          radiusMaxPixels: 16,
          getFillColor: [14, 159, 110, 38],
          stroked: true,
          getLineColor: [14, 159, 110, 130],
          getLineWidth: 1,
          lineWidthUnits: 'pixels',
          pickable: false,
        })
      );

      layers.push(
        new ScatterplotLayer({
          id: 'transit-layer',
          data: transit,
          getPosition: (d: any) => d.geometry.coordinates,
          radiusUnits: 'pixels',
          getRadius: 6.5,
          radiusMinPixels: 5,
          radiusMaxPixels: 9,
          getFillColor: [17, 17, 17, 240],
          stroked: true,
          getLineColor: [14, 159, 110, 255],
          getLineWidth: 2,
          lineWidthUnits: 'pixels',
          pickable: true,
          onHover: (info: any) => {
            if (info.object) {
              const coords = info.object.geometry?.coordinates;
              const dist = coords
                ? haversineDistance(
                    selectedCoords.latitude,
                    selectedCoords.longitude,
                    coords[1],
                    coords[0]
                  )
                : undefined;
              setHoverInfo({
                x: info.x,
                y: info.y,
                object: info.object,
                type: 'transit',
                distanceMeters: dist,
              });
            } else {
              setHoverInfo(null);
            }
          },
        })
      );
    }

    if (activeLayers.pois && pois.length > 0) {
      layers.push(
        new ScatterplotLayer({
          id: 'poi-layer',
          data: pois,
          getPosition: (d: any) => d.geometry.coordinates,
          radiusUnits: 'pixels',
          getRadius: (d: any) => {
            const isCompetitor = d.properties?.category === category;
            return isCompetitor ? 7 : 5;
          },
          radiusMinPixels: 4,
          radiusMaxPixels: 9,
          getFillColor: (d: any) => {
            const isCompetitor = d.properties?.category === category;
            if (isCompetitor) return [245, 158, 11, 240];
            if (['mall', 'bazaar', 'university'].includes(d.properties?.category)) {
              return [99, 102, 241, 215];
            }
            return [107, 114, 128, 185];
          },
          stroked: true,
          getLineColor: [255, 255, 255, 230],
          getLineWidth: 1.5,
          lineWidthUnits: 'pixels',
          pickable: true,
          onHover: (info: any) => {
            if (info.object) {
              const coords = info.object.geometry?.coordinates;
              const dist = coords
                ? haversineDistance(
                    selectedCoords.latitude,
                    selectedCoords.longitude,
                    coords[1],
                    coords[0]
                  )
                : undefined;
              setHoverInfo({
                x: info.x,
                y: info.y,
                object: info.object,
                type: 'poi',
                distanceMeters: dist,
              });
            } else {
              setHoverInfo(null);
            }
          },
        })
      );
    }

    if (highlightedPoiCoords) {
      layers.push(
        new ScatterplotLayer({
          id: 'highlighted-poi-ring',
          data: [{ position: [highlightedPoiCoords.longitude, highlightedPoiCoords.latitude] }],
          getPosition: (d: any) => d.position,
          radiusUnits: 'pixels',
          getRadius: 19,
          getFillColor: [245, 158, 11, 45],
          stroked: true,
          getLineColor: [245, 158, 11, 255],
          getLineWidth: 2.5,
          lineWidthUnits: 'pixels',
        })
      );
    }

    if (showComparePinOnMap && compareCoords) {
      layers.push(
        new ScatterplotLayer({
          id: 'compare-point-outer',
          data: [{ position: [compareCoords.longitude, compareCoords.latitude] }],
          getPosition: (d: any) => d.position,
          radiusUnits: 'pixels',
          getRadius: 15,
          getFillColor: [99, 102, 241, 55],
          stroked: true,
          getLineColor: [99, 102, 241, 220],
          getLineWidth: 1.5,
          lineWidthUnits: 'pixels',
        })
      );

      layers.push(
        new ScatterplotLayer({
          id: 'compare-point-core',
          data: [{ position: [compareCoords.longitude, compareCoords.latitude] }],
          getPosition: (d: any) => d.position,
          radiusUnits: 'pixels',
          getRadius: 6.5,
          getFillColor: [79, 70, 229, 255],
          stroked: true,
          getLineColor: [255, 255, 255, 255],
          getLineWidth: 2,
          lineWidthUnits: 'pixels',
        })
      );
    }

    layers.push(
      new ScatterplotLayer({
        id: 'selected-point-outer-pulse',
        data: [{ position: [selectedCoords.longitude, selectedCoords.latitude] }],
        getPosition: (d: any) => d.position,
        radiusUnits: 'pixels',
        getRadius: 16,
        radiusMinPixels: 12,
        radiusMaxPixels: 22,
        getFillColor: [14, 159, 110, 50],
        stroked: true,
        getLineColor: [14, 159, 110, 220],
        getLineWidth: 1.75,
        lineWidthUnits: 'pixels',
      })
    );

    layers.push(
      new ScatterplotLayer({
        id: 'selected-point-core',
        data: [{ position: [selectedCoords.longitude, selectedCoords.latitude] }],
        getPosition: (d: any) => d.position,
        radiusUnits: 'pixels',
        getRadius: 6.5,
        radiusMinPixels: 5,
        radiusMaxPixels: 9,
        getFillColor: [17, 17, 17, 255],
        stroked: true,
        getLineColor: [14, 159, 110, 255],
        getLineWidth: 2.5,
        lineWidthUnits: 'pixels',
      })
    );

    deckOverlayRef.current.setProps({ layers });
  }, [
    hexagons,
    pois,
    transit,
    selectedCoords,
    compareCoords,
    showComparePinOnMap,
    highlightedPoiCoords,
    radiusMeters,
    activeLayers,
    category,
  ]);

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSelectedCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      () => {
        setSelectedCoords({ latitude: 41.3120, longitude: 69.2800 });
      }
    );
  };

  const abDistanceMeters = useMemo(() => {
    if (!showComparePinOnMap || !compareCoords) return null;
    return Math.round(
      haversineDistance(
        selectedCoords.latitude,
        selectedCoords.longitude,
        compareCoords.latitude,
        compareCoords.longitude
      )
    );
  }, [selectedCoords, compareCoords, showComparePinOnMap]);

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-[#FDFDFD] dark:bg-[#111111] select-none ${
        isPickingCompareOnMap ? 'cursor-crosshair' : ''
      }`}
    >
      {/* MapLibre Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top-Left Quick City/Hub Jumper Bar + GPS Locate + Undo Button */}
      <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5 max-w-[calc(100%-290px)] overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={handleGeolocate}
          title="Mening joylashuvim (GPS)"
          aria-label="Mening joylashuvimni aniqlash (GPS)"
          className="press-scale flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/95 dark:bg-[#161618]/95 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.1] shadow-md text-[11px] font-semibold text-[#111111] dark:text-[#FDFDFD] hover:border-[#0E9F6E] shrink-0 cursor-pointer"
        >
          <LocateFixed className="w-3.5 h-3.5 text-[#0E9F6E]" aria-hidden="true" />
          <span className="hidden xl:inline">GPS</span>
        </button>

        {recentHistory.length > 0 && (
          <button
            type="button"
            onClick={goBackLocation}
            title="Oldingi ko'rilgan nuqtaga qaytish"
            aria-label="Oldingi nuqtaga qaytish"
            className="press-scale flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/95 dark:bg-[#161618]/95 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.1] shadow-md text-[11px] font-semibold text-[#111111] dark:text-[#FDFDFD] hover:border-[#0E9F6E] shrink-0 cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5 text-[#0E9F6E]" aria-hidden="true" />
            <span className="hidden xl:inline">Orqaga</span>
          </button>
        )}

        <div className="hidden lg:flex items-center gap-1 bg-white/90 dark:bg-[#161618]/90 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.1] p-1 rounded-xl shadow-md">
          {QUICK_JUMP_HUBS.map((hub) => {
            const isActive =
              Math.abs(selectedCoords.latitude - hub.lat) < 0.004 &&
              Math.abs(selectedCoords.longitude - hub.lon) < 0.004;
            return (
              <button
                key={hub.label}
                type="button"
                onClick={() => setSelectedCoords({ latitude: hub.lat, longitude: hub.lon })}
                className={`press-scale px-2.5 py-1 rounded-[8px] text-[10px] font-medium whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-white dark:bg-white dark:text-[#111111] font-semibold'
                    : 'text-[#525854] dark:text-[#9CA3AF] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                {hub.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Mode Banner when Picking Location B on Map (Origin-aware, no infinite bounce) */}
      {isPickingCompareOnMap && (
        <div
          role="status"
          className="popover-origin-tc absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-semibold"
        >
          <GitCompare className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Solishtirish uchun xaritadan B nuqtani bosing (Esc — bekor qilish)</span>
          <button
            type="button"
            aria-label="Xaritadan B nuqta tanlashni bekor qilish"
            onClick={() => setIsPickingCompareOnMap(false)}
            className="press-scale p-0.5 rounded-full bg-white/20 hover:bg-white/30 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating HUD Layer Control */}
      <LayerControl />

      {/* Floating Glass Hover Tooltip */}
      {hoverInfo && hoverInfo.object && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-3 bg-white/95 dark:bg-[#161618]/95 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.1] px-3.5 py-2.5 rounded-xl shadow-2xl text-xs text-[#111111] dark:text-[#FDFDFD] max-w-xs space-y-1"
          style={{ left: hoverInfo.x, top: hoverInfo.y }}
        >
          {hoverInfo.type === 'transit' ? (
            <div>
              <div className="flex items-center gap-1.5 font-semibold">
                <Train className="w-3.5 h-3.5 text-[#0E9F6E]" />
                <span>{hoverInfo.object.properties?.name}</span>
              </div>
              <div className="text-[10px] text-[#7A807C] dark:text-[#9CA3AF]">
                {hoverInfo.object.properties?.line_name || 'Tranzit bekati'}
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#525854] dark:text-[#D1D5DB] font-mono tabular-nums mt-1 pt-1 border-t border-black/[0.06] dark:border-white/[0.07]">
                <span>
                  Oqim indeksi:{' '}
                  <strong className="text-[#0E9F6E]">
                    {hoverInfo.object.properties?.passenger_flow_score}/100
                  </strong>
                </span>
                {hoverInfo.distanceMeters !== undefined && (
                  <span className="font-bold ml-2">~{Math.round(hoverInfo.distanceMeters)}m</span>
                )}
              </div>
            </div>
          ) : hoverInfo.type === 'poi' ? (
            <div>
              <div className="flex items-center gap-1.5 font-semibold">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
                <span className="truncate">{hoverInfo.object.properties?.name}</span>
              </div>
              <div className="text-[10px] text-[#7A807C] dark:text-[#9CA3AF] capitalize flex items-center gap-2 mt-0.5">
                <span>Toifa: {hoverInfo.object.properties?.category}</span>
                {hoverInfo.object.properties?.brand && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/25 font-mono text-[9px] text-amber-600 dark:text-amber-400">
                    {hoverInfo.object.properties?.brand}
                  </span>
                )}
              </div>
              {hoverInfo.distanceMeters !== undefined && (
                <div className="text-[10px] text-[#525854] dark:text-[#D1D5DB] font-mono tabular-nums mt-1 pt-1 border-t border-black/[0.06] dark:border-white/[0.07] flex items-center justify-between">
                  <span>A nuqtadan masofa:</span>
                  <span className="font-bold">~{Math.round(hoverInfo.distanceMeters)} metr</span>
                </div>
              )}
            </div>
          ) : hoverInfo.type === 'hex' ? (
            <div>
              <div className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0E9F6E]" />
                <span>{hoverInfo.object.label || 'H3 Fazoviy Klaster'}</span>
              </div>
              <div className="text-[10px] text-[#525854] dark:text-[#D1D5DB] font-mono tabular-nums mt-0.5">
                Klaster MakonScore:{' '}
                <strong className="text-[#0E9F6E]">{hoverInfo.object.score}/100</strong>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Bottom Left Status & A/B Distance HUD */}
      <div className="absolute bottom-3.5 left-3.5 z-20 flex flex-wrap items-center gap-2">
        <div className="bg-white/95 dark:bg-[#161618]/95 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.1] px-3 py-1.5 rounded-xl text-[11px] text-[#111111] dark:text-[#FDFDFD] flex items-center gap-2 shadow-lg pointer-events-none">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0E9F6E] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0E9F6E]" />
          </span>
          <span className="font-medium">
            Xaritadagi istalgan nuqtani bosing — MakonScore va ROI darhol yangilanadi
          </span>
        </div>

        {showComparePinOnMap && abDistanceMeters !== null && (
          <div className="bg-indigo-600/95 backdrop-blur-xl text-white px-3 py-1.5 rounded-xl text-[11px] font-mono tabular-nums flex items-center gap-2 shadow-lg">
            <span>
              A ↔ B masofa:{' '}
              <strong>
                {abDistanceMeters >= 1000
                  ? `${(abDistanceMeters / 1000).toFixed(2)} km`
                  : `${abDistanceMeters} m`}
              </strong>
            </span>
            <button
              type="button"
              onClick={swapCompareLocations}
              title="A va B nuqtalarni almashtirish"
              aria-label="A va B nuqtalarni almashtirish"
              className="press-scale p-0.5 rounded bg-white/15 hover:bg-white/25 cursor-pointer"
            >
              <ArrowLeftRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {highlightedPoiCoords && (
          <div className="bg-amber-500/95 backdrop-blur-xl text-white px-3 py-1.5 rounded-xl text-[11px] font-medium flex items-center gap-2 shadow-lg">
            <span>Tanlangan obyekt: {highlightedPoiCoords.name}</span>
            <button
              type="button"
              aria-label="Obyekt fokusini yopish"
              onClick={() => setHighlightedPoiCoords(null)}
              className="press-scale p-0.5 rounded bg-white/20 hover:bg-white/30 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
