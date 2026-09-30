import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { GeoJsonLayer, ScatterplotLayer, PolygonLayer } from '@deck.gl/layers';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { LayerControl } from './LayerControl';
import { HexFeature } from '../../types';
import { haversineDistance } from '../../utils/clientSpatialEngine';
import { Train, ShoppingBag, MapPin, Sparkles, Navigation, Layers } from 'lucide-react';

// 1. OpenFreeMap Positron Light: Clean Minimal Light Vector Style (No Watermark, Complete Tashkent)
const OPENFREEMAP_LIGHT_STYLE = 'https://tiles.openfreemap.org/styles/positron';

// 2. OpenFreeMap Dark: Native Dark Vector Style
const OPENFREEMAP_DARK_STYLE = 'https://tiles.openfreemap.org/styles/dark';

// 3. ESRI World Satellite Imagery: High-Resolution Satellite Photography
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

export const MapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const deckOverlayRef = useRef<MapboxOverlay | null>(null);

  const {
    selectedCoords,
    setSelectedCoords,
    activeLayers,
    radiusMeters,
    category,
    basemapMode,
    pitchMode,
  } = useAnalyticsStore();

  const [hexagons, setHexagons] = useState<HexFeature[]>([]);
  const [pois, setPois] = useState<any[]>([]);
  const [transit, setTransit] = useState<any[]>([]);
  const [hoverInfo, setHoverInfo] = useState<{
    x: number;
    y: number;
    object: any;
    type: 'hex' | 'poi' | 'transit';
    distanceMeters?: number;
  } | null>(null);

  // 1. Fetch live GeoJSON datasets from PostGIS
  useEffect(() => {
    fetch('/api/v1/spatial/hexagons')
      .then((res) => (res.ok ? res.json() : { features: [] }))
      .then((data) => setHexagons(data.features || []))
      .catch(() => {});

    fetch('/api/v1/poi/geojson')
      .then((res) => (res.ok ? res.json() : { features: [] }))
      .then((data) => setPois(data.features || []))
      .catch(() => {});

    fetch('/api/v1/poi/transit/geojson')
      .then((res) => (res.ok ? res.json() : { features: [] }))
      .then((data) => setTransit(data.features || []))
      .catch(() => {});
  }, []);

  // 2. Initialize MapLibre GL Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialStyle = getBasemapStyle(basemapMode);

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: [selectedCoords.longitude, selectedCoords.latitude],
      zoom: 13.5,
      pitch: pitchMode === '3d' ? 42 : 0,
      bearing: pitchMode === '3d' ? -15 : 0,
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
      setSelectedCoords({
        latitude: e.lngLat.lat,
        longitude: e.lngLat.lng,
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 3. Basemap Style Switch (Light Positron vs Dark Vector vs Satellite)
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(getBasemapStyle(basemapMode));
  }, [basemapMode]);

  // 4. Perspective Mode Switch (2D Orthographic vs 3D Isometric)
  useEffect(() => {
    if (!mapRef.current) return;
    const targetPitch = pitchMode === '3d' ? 42 : 0;
    const targetBearing = pitchMode === '3d' ? -15 : 0;
    mapRef.current.easeTo({
      pitch: targetPitch,
      bearing: targetBearing,
      duration: 700,
      easing: (t) => t * (2 - t),
    });
  }, [pitchMode]);

  // 5. Smooth Camera Fly-to when Target Coordinates Change
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [selectedCoords.longitude, selectedCoords.latitude],
      speed: 1.2,
      curve: 1.4,
      essential: true,
    });
  }, [selectedCoords.latitude, selectedCoords.longitude]);

  // 6. Deck.gl Precision Spatial Layers Overhaul
  useEffect(() => {
    if (!deckOverlayRef.current) return;

    const layers: any[] = [];

    // Layer A: H3 Hexagons Heatmap
    if (activeLayers.hexagons && hexagons.length > 0) {
      layers.push(
        new PolygonLayer({
          id: 'hexagons-layer',
          data: hexagons,
          getPolygon: (d: HexFeature) => d.coordinates[0],
          getFillColor: (d: HexFeature) => {
            if (d.tier === 'high') return [6, 214, 160, 50];   // Emerald 20% fill
            if (d.tier === 'medium') return [12, 65, 55, 30];  // Brunswick 12% fill
            return [239, 68, 68, 25];                          // Rose 10% fill
          },
          getLineColor: [12, 65, 55, 50],
          getLineWidth: 1,
          lineWidthUnits: 'pixels',
          pickable: true,
          autoHighlight: true,
          highlightColor: [6, 214, 160, 80],
          onHover: (info: any) => {
            if (info.object) {
              setHoverInfo({ x: info.x, y: info.y, object: info.object, type: 'hex' });
            } else {
              setHoverInfo(null);
            }
          },
          onClick: (info: any) => {
            if (info.object && info.object.center) {
              setSelectedCoords({
                latitude: info.object.center[1],
                longitude: info.object.center[0],
              });
            }
          },
        })
      );
    }

    // Layer B: Inspection Radar Field (Radius Buffer)
    if (activeLayers.scanRadius) {
      const circleData = createCircleGeoJSON(selectedCoords.latitude, selectedCoords.longitude, radiusMeters);
      layers.push(
        new GeoJsonLayer({
          id: 'scan-radius-layer',
          data: circleData,
          filled: true,
          getFillColor: [6, 214, 160, 16], // Translucent emerald radar fill
          stroked: true,
          getLineColor: [6, 214, 160, 200], // Crisp glowing emerald border
          getLineWidth: 1.5,
          lineWidthUnits: 'pixels',
        })
      );
    }

    // Layer C: Transit Stops (Metro Stations)
    if (activeLayers.transit && transit.length > 0) {
      // Outer subtle halo ring
      layers.push(
        new ScatterplotLayer({
          id: 'transit-halo-layer',
          data: transit,
          getPosition: (d: any) => d.geometry.coordinates,
          radiusUnits: 'pixels',
          getRadius: 13,
          radiusMinPixels: 9,
          radiusMaxPixels: 16,
          getFillColor: [6, 214, 160, 35],
          stroked: true,
          getLineColor: [6, 214, 160, 120],
          getLineWidth: 1,
          lineWidthUnits: 'pixels',
          pickable: false,
        })
      );

      // Core crisp pin
      layers.push(
        new ScatterplotLayer({
          id: 'transit-layer',
          data: transit,
          getPosition: (d: any) => d.geometry.coordinates,
          radiusUnits: 'pixels',
          getRadius: 6.5,
          radiusMinPixels: 5,
          radiusMaxPixels: 9,
          getFillColor: [12, 65, 55, 245],
          stroked: true,
          getLineColor: [6, 214, 160, 255],
          getLineWidth: 2,
          lineWidthUnits: 'pixels',
          pickable: true,
          onHover: (info: any) => {
            if (info.object) {
              const coords = info.object.geometry?.coordinates;
              const dist = coords
                ? haversineDistance(selectedCoords.latitude, selectedCoords.longitude, coords[1], coords[0])
                : undefined;
              setHoverInfo({ x: info.x, y: info.y, object: info.object, type: 'transit', distanceMeters: dist });
            } else {
              setHoverInfo(null);
            }
          },
        })
      );
    }

    // Layer D: POIs & Competitors
    if (activeLayers.pois && pois.length > 0) {
      layers.push(
        new ScatterplotLayer({
          id: 'poi-layer',
          data: pois,
          getPosition: (d: any) => d.geometry.coordinates,
          radiusUnits: 'pixels',
          getRadius: (d: any) => {
            const isCompetitor = d.properties?.category === category;
            return isCompetitor ? 6.5 : 4.5;
          },
          radiusMinPixels: 4,
          radiusMaxPixels: 9,
          getFillColor: (d: any) => {
            const isCompetitor = d.properties?.category === category;
            if (isCompetitor) return [245, 158, 11, 230]; // Amber for competitors
            if (d.properties?.category === 'supermarket') return [16, 185, 129, 200];
            return [99, 102, 241, 180];
          },
          stroked: true,
          getLineColor: [255, 255, 255, 220],
          getLineWidth: 1.5,
          lineWidthUnits: 'pixels',
          pickable: true,
          onHover: (info: any) => {
            if (info.object) {
              const coords = info.object.geometry?.coordinates;
              const dist = coords
                ? haversineDistance(selectedCoords.latitude, selectedCoords.longitude, coords[1], coords[0])
                : undefined;
              setHoverInfo({ x: info.x, y: info.y, object: info.object, type: 'poi', distanceMeters: dist });
            } else {
              setHoverInfo(null);
            }
          },
        })
      );
    }

    // Layer E: Selected Target Marker Pin (Tactile concentric indicator)
    layers.push(
      new ScatterplotLayer({
        id: 'selected-point-outer-pulse',
        data: [{ position: [selectedCoords.longitude, selectedCoords.latitude] }],
        getPosition: (d: any) => d.position,
        radiusUnits: 'pixels',
        getRadius: 16,
        radiusMinPixels: 12,
        radiusMaxPixels: 22,
        getFillColor: [6, 214, 160, 45],
        stroked: true,
        getLineColor: [6, 214, 160, 200],
        getLineWidth: 1.5,
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
        getFillColor: [12, 65, 55, 255],
        stroked: true,
        getLineColor: [6, 214, 160, 255],
        getLineWidth: 2.5,
        lineWidthUnits: 'pixels',
      })
    );

    deckOverlayRef.current.setProps({ layers });
  }, [hexagons, pois, transit, selectedCoords, radiusMeters, activeLayers, category]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#FBFBFD]">
      {/* MapLibre Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating HUD Layer Control */}
      <LayerControl />

      {/* Floating Glass Hover Tooltip */}
      {hoverInfo && hoverInfo.object && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-3 bg-white/95 backdrop-blur-xl border border-[#0C4137]/[0.1] px-3.5 py-2.5 rounded-xl shadow-xl text-xs text-[#0C4137] max-w-xs space-y-1 animate-in fade-in zoom-in-95 duration-150"
          style={{ left: hoverInfo.x, top: hoverInfo.y }}
        >
          {hoverInfo.type === 'transit' ? (
            <div>
              <div className="flex items-center gap-1.5 font-bold text-[#0C4137]">
                <Train className="w-3.5 h-3.5 text-[#06D6A0]" />
                <span>{hoverInfo.object.properties?.name}</span>
              </div>
              <div className="text-[10px] text-neutral-500">
                {hoverInfo.object.properties?.line_name || 'Toshkent Metropoliteni'}
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-600 font-mono mt-1 pt-1 border-t border-[#0C4137]/[0.08]">
                <span>Tranzit salohiyati: <strong className="text-[#06D6A0]">{hoverInfo.object.properties?.passenger_flow_score}/100</strong></span>
                {hoverInfo.distanceMeters !== undefined && (
                  <span className="text-[#0C4137] font-bold ml-2">~{Math.round(hoverInfo.distanceMeters)}m</span>
                )}
              </div>
            </div>
          ) : hoverInfo.type === 'poi' ? (
            <div>
              <div className="flex items-center gap-1.5 font-bold text-[#0C4137]">
                <ShoppingBag className="w-3.5 h-3.5 text-[#06D6A0]" />
                <span className="truncate">{hoverInfo.object.properties?.name}</span>
              </div>
              <div className="text-[10px] text-neutral-500 capitalize flex items-center gap-2">
                <span>Toifa: {hoverInfo.object.properties?.category}</span>
                {hoverInfo.object.properties?.brand && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-50 border border-amber-200 font-mono text-[9px] text-amber-700">
                    {hoverInfo.object.properties?.brand}
                  </span>
                )}
              </div>
              {hoverInfo.distanceMeters !== undefined && (
                <div className="text-[10px] text-neutral-600 font-mono mt-1 pt-1 border-t border-[#0C4137]/[0.08] flex items-center justify-between">
                  <span>Masofa:</span>
                  <span className="text-[#0C4137] font-bold">~{Math.round(hoverInfo.distanceMeters)} metr</span>
                </div>
              )}
            </div>
          ) : hoverInfo.type === 'hex' ? (
            <div>
              <div className="font-bold text-[#0C4137] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#06D6A0]" />
                <span>H3 Fazoviy Klaster</span>
              </div>
              <div className="text-[10px] text-neutral-600 font-mono mt-0.5">
                MakonScore Salohiyati: <strong className="text-[#06D6A0]">{hoverInfo.object.score}/100</strong>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Floating Status & Instruction Chip */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-xl border border-[#0C4137]/[0.1] px-3.5 py-2 rounded-xl text-xs text-[#0C4137] flex items-center gap-2.5 shadow-lg pointer-events-none">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06D6A0] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#06D6A0]" />
        </span>
        <span className="font-semibold">
          Xaritadagi istalgan nuqtani bosing yoki yuqoridan qidiring — MakonScore soniyalarda hisoblanadi
        </span>
      </div>
    </div>
  );
};

export default MapView;
