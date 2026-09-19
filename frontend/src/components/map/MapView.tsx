import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { GeoJsonLayer, ScatterplotLayer, PolygonLayer } from '@deck.gl/layers';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { LayerControl } from './LayerControl';
import { HexFeature } from '../../types';
import { Train, ShoppingBag, MapPin, Sparkles } from 'lucide-react';

// 1. ESRI World Dark Gray Canvas: High-performance, clean, dark, 100% WATERMARK FREE
const ESRI_DARK_STYLE = {
  version: 8,
  sources: {
    'esri-dark-base': {
      type: 'raster',
      tiles: [
        'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution: '&copy; Esri, HERE, Garmin, OpenStreetMap contributors',
    },
    'esri-dark-labels': {
      type: 'raster',
      tiles: [
        'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
    },
  },
  layers: [
    {
      id: 'esri-dark-base-layer',
      type: 'raster',
      source: 'esri-dark-base',
      minzoom: 0,
      maxzoom: 20,
    },
    {
      id: 'esri-dark-labels-layer',
      type: 'raster',
      source: 'esri-dark-labels',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

// 2. ESRI World Satellite Imagery: High-resolution satellite photography
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
    'esri-satellite-labels': {
      type: 'raster',
      tiles: [
        'https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
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
    {
      id: 'esri-satellite-labels-layer',
      type: 'raster',
      source: 'esri-satellite-labels',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
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

interface HoverInfo {
  x: number;
  y: number;
  object?: any;
  type?: 'poi' | 'transit' | 'hex';
}

export const MapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const deckOverlayRef = useRef<MapboxOverlay | null>(null);

  const { selectedCoords, setSelectedCoords, radiusMeters, activeLayers, category, basemapMode } = useAnalyticsStore();

  const [hexagons, setHexagons] = useState<HexFeature[]>([]);
  const [pois, setPois] = useState<any[]>([]);
  const [transit, setTransit] = useState<any[]>([]);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);

  // 1. Fetch Map Data
  useEffect(() => {
    fetch('/api/v1/analytics/hexagons')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setHexagons(data))
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

    const initialStyle = basemapMode === 'satellite' ? ESRI_SATELLITE_STYLE : ESRI_DARK_STYLE;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: initialStyle as any,
      center: [selectedCoords.longitude, selectedCoords.latitude],
      zoom: 13.5,
      pitch: 35,
      bearing: 0,
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

  // 3. Handle Basemap Mode switch (Dark vs Satellite)
  useEffect(() => {
    if (!mapRef.current) return;
    const targetStyle = basemapMode === 'satellite' ? ESRI_SATELLITE_STYLE : ESRI_DARK_STYLE;
    mapRef.current.setStyle(targetStyle as any);
  }, [basemapMode]);

  // 4. Smooth fly-to when selectedCoords changes
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [selectedCoords.longitude, selectedCoords.latitude],
      speed: 1.2,
      curve: 1.4,
      essential: true,
    });
  }, [selectedCoords.latitude, selectedCoords.longitude]);

  // 5. Update Deck.gl Layers
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
            if (d.tier === 'high') return [16, 185, 129, 90];    // Emerald
            if (d.tier === 'medium') return [6, 182, 212, 80];   // Cyan
            return [239, 68, 68, 70];                            // Rose
          },
          getLineColor: [34, 39, 53, 180],
          getLineWidth: 1.5,
          lineWidthUnits: 'pixels',
          pickable: true,
          autoHighlight: true,
          highlightColor: [255, 255, 255, 80],
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

    // Layer B: Inspection Radius Buffer
    if (activeLayers.scanRadius) {
      const circleData = createCircleGeoJSON(selectedCoords.latitude, selectedCoords.longitude, radiusMeters);
      layers.push(
        new GeoJsonLayer({
          id: 'scan-radius-layer',
          data: circleData,
          filled: true,
          getFillColor: [16, 185, 129, 20],
          stroked: true,
          getLineColor: [16, 185, 129, 220],
          getLineWidth: 2,
          lineWidthUnits: 'pixels',
        })
      );
    }

    // Layer C: Transit Stops (Metro)
    if (activeLayers.transit && transit.length > 0) {
      layers.push(
        new ScatterplotLayer({
          id: 'transit-layer',
          data: transit,
          getPosition: (d: any) => d.geometry.coordinates,
          getRadius: 55,
          getFillColor: [6, 182, 212, 230], // Cyan
          getLineColor: [255, 255, 255, 220],
          getLineWidth: 2,
          lineWidthUnits: 'pixels',
          pickable: true,
          onHover: (info: any) => {
            if (info.object) {
              setHoverInfo({ x: info.x, y: info.y, object: info.object, type: 'transit' });
            } else {
              setHoverInfo(null);
            }
          },
        })
      );
    }

    // Layer D: POIs & Direct Competitors
    if (activeLayers.pois && pois.length > 0) {
      layers.push(
        new ScatterplotLayer({
          id: 'poi-layer',
          data: pois,
          getPosition: (d: any) => d.geometry.coordinates,
          getRadius: 45,
          getFillColor: (d: any) => {
            const cat = d.properties.category?.toLowerCase();
            if (cat === category.toLowerCase()) return [245, 158, 11, 230]; // Direct competitor (Amber)
            if (['mall', 'bazaar', 'university'].includes(cat)) return [16, 185, 129, 230]; // Anchor (Emerald)
            return [99, 102, 241, 200]; // General (Indigo)
          },
          getLineColor: [255, 255, 255, 180],
          getLineWidth: 1.5,
          lineWidthUnits: 'pixels',
          pickable: true,
          onHover: (info: any) => {
            if (info.object) {
              setHoverInfo({ x: info.x, y: info.y, object: info.object, type: 'poi' });
            } else {
              setHoverInfo(null);
            }
          },
        })
      );
    }

    // Layer E: Selected Target Marker Pin (Concentric Circles)
    layers.push(
      new ScatterplotLayer({
        id: 'selected-point-outer',
        data: [{ position: [selectedCoords.longitude, selectedCoords.latitude] }],
        getPosition: (d: any) => d.position,
        getRadius: 70,
        getFillColor: [16, 185, 129, 45],
        stroked: true,
        getLineColor: [16, 185, 129, 180],
        getLineWidth: 2,
        lineWidthUnits: 'pixels',
      })
    );

    layers.push(
      new ScatterplotLayer({
        id: 'selected-point-marker',
        data: [{ position: [selectedCoords.longitude, selectedCoords.latitude] }],
        getPosition: (d: any) => d.position,
        getRadius: 28,
        getFillColor: [16, 185, 129, 255],
        getLineColor: [255, 255, 255, 255],
        getLineWidth: 3,
        lineWidthUnits: 'pixels',
      })
    );

    deckOverlayRef.current.setProps({ layers });
  }, [hexagons, pois, transit, selectedCoords, radiusMeters, activeLayers, category]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#06070B]">
      <div ref={mapContainerRef} className="w-full h-full" />
      <LayerControl />

      {/* Floating Hover Tooltip */}
      {hoverInfo && hoverInfo.object && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-3 bg-[#0D0F17]/95 backdrop-blur-md border border-[#222735] px-3 py-2 rounded-xl shadow-2xl text-xs text-white max-w-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150"
          style={{ left: hoverInfo.x, top: hoverInfo.y }}
        >
          {hoverInfo.type === 'transit' ? (
            <div>
              <div className="flex items-center gap-1.5 font-bold text-cyan-400">
                <Train className="w-3.5 h-3.5" />
                <span>{hoverInfo.object.properties?.name}</span>
              </div>
              <div className="text-[10px] text-gray-400 font-medium">
                {hoverInfo.object.properties?.line_name || 'Toshkent Metropoliteni'}
              </div>
              <div className="text-[10px] text-gray-300 font-mono mt-0.5">
                Oqim ko'rsatkichi: <strong className="text-cyan-300">{hoverInfo.object.properties?.passenger_flow_score}/100</strong>
              </div>
            </div>
          ) : hoverInfo.type === 'poi' ? (
            <div>
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{hoverInfo.object.properties?.name}</span>
              </div>
              <div className="text-[10px] text-gray-400 capitalize">
                Toifa: {hoverInfo.object.properties?.category}
                {hoverInfo.object.properties?.brand && ` • ${hoverInfo.object.properties?.brand}`}
              </div>
            </div>
          ) : hoverInfo.type === 'hex' ? (
            <div>
              <div className="font-bold text-white flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>H3 Geksagonal Hudud</span>
              </div>
              <div className="text-[10px] text-gray-300 font-mono">
                MakonScore Salohiyati: <strong className="text-emerald-400">{hoverInfo.object.score}/100</strong>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Interactive Helper Banner */}
      <div className="absolute bottom-4 left-4 z-20 bg-[#0D0F17]/90 backdrop-blur-md border border-[#222735] px-3.5 py-2 rounded-xl text-xs text-gray-300 flex items-center gap-2 shadow-xl pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Xaritadagi istalgan joyni bosing yoki yuqoridan qidiring — MakonScore soniyalarda hisoblanadi</span>
      </div>
    </div>
  );
};
