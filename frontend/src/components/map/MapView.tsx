import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { GeoJsonLayer, ScatterplotLayer, PolygonLayer } from '@deck.gl/layers';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { LayerControl } from './LayerControl';
import { HexFeature } from '../../types';

// CARTO Dark Matter vector/raster style for MapLibre
const DARK_MAP_STYLE = {
  version: 8,
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
    },
  },
  layers: [
    {
      id: 'carto-dark-layer',
      type: 'raster',
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

// Helper: Generate geodesic circle coordinates for scan radius
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

  const { selectedCoords, setSelectedCoords, radiusMeters, activeLayers, category } = useAnalyticsStore();

  const [hexagons, setHexagons] = useState<HexFeature[]>([]);
  const [pois, setPois] = useState<any[]>([]);
  const [transit, setTransit] = useState<any[]>([]);

  // 1. Fetch Map Data (Hexagons, POIs, Transit)
  useEffect(() => {
    // Hexagons
    fetch('/api/v1/analytics/hexagons')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setHexagons(data))
      .catch(() => {});

    // POIs
    fetch('/api/v1/poi/geojson')
      .then((res) => (res.ok ? res.json() : { features: [] }))
      .then((data) => setPois(data.features || []))
      .catch(() => {});

    // Transit
    fetch('/api/v1/poi/transit/geojson')
      .then((res) => (res.ok ? res.json() : { features: [] }))
      .then((data) => setTransit(data.features || []))
      .catch(() => {});
  }, []);

  // 2. Initialize MapLibre GL Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: DARK_MAP_STYLE as any,
      center: [selectedCoords.longitude, selectedCoords.latitude],
      zoom: 13.5,
      pitch: 35,
      bearing: 0,
      attributionControl: false,
    });

    // Navigation Controls
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');

    // Deck.gl Overlay
    const deckOverlay = new MapboxOverlay({
      interleaved: false,
      layers: [],
    });
    map.addControl(deckOverlay as any);
    deckOverlayRef.current = deckOverlay;

    // Click to Inspect Listener
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

  // 3. Smooth fly-to when selectedCoords changes
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [selectedCoords.longitude, selectedCoords.latitude],
      speed: 1.2,
      curve: 1.4,
      essential: true,
    });
  }, [selectedCoords.latitude, selectedCoords.longitude]);

  // 4. Update Deck.gl Layers
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
          getFillColor: [16, 185, 129, 25],
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
          getLineColor: [255, 255, 255, 200],
          getLineWidth: 2,
          lineWidthUnits: 'pixels',
          pickable: true,
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
        })
      );
    }

    // Layer E: Selected Target Marker Pin
    layers.push(
      new ScatterplotLayer({
        id: 'selected-point-marker',
        data: [{ position: [selectedCoords.longitude, selectedCoords.latitude] }],
        getPosition: (d: any) => d.position,
        getRadius: 35,
        getFillColor: [16, 185, 129, 255],
        getLineColor: [255, 255, 255, 255],
        getLineWidth: 3,
        lineWidthUnits: 'pixels',
      })
    );

    deckOverlayRef.current.setProps({ layers });
  }, [hexagons, pois, transit, selectedCoords, radiusMeters, activeLayers, category]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#090A0F]">
      <div ref={mapContainerRef} className="w-full h-full" />
      <LayerControl />

      {/* Interactive Helper Banner */}
      <div className="absolute bottom-4 left-4 z-20 bg-[#13151D]/90 backdrop-blur-md border border-[#222735] px-3 py-2 rounded-xl text-xs text-gray-300 flex items-center gap-2 shadow-xl pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Xaritadagi istalgan nuqtani tanlang — MakonScore soniyalarda hisoblanadi</span>
      </div>
    </div>
  );
};
