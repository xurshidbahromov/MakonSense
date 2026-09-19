import React from 'react';
import { Layers, Hexagon, MapPin, Train, CircleDot } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

export const LayerControl: React.FC = () => {
  const { activeLayers, toggleLayer } = useAnalyticsStore();

  return (
    <div className="absolute top-4 right-4 z-20 bg-[#13151D]/90 backdrop-blur-md border border-[#222735] rounded-xl p-3 shadow-2xl space-y-2 select-none w-56">
      <div className="flex items-center gap-2 pb-2 border-b border-[#222735] text-xs font-bold text-gray-300">
        <Layers className="w-3.5 h-3.5 text-emerald-400" />
        <span>Xarita Qatlamlari</span>
      </div>

      <div className="space-y-1.5 text-xs">
        {/* H3 Hexagons */}
        <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#1A1E2C] cursor-pointer transition-all">
          <div className="flex items-center gap-2 text-gray-300">
            <Hexagon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px]">H3 Geksagonal To'r</span>
          </div>
          <input
            type="checkbox"
            checked={activeLayers.hexagons}
            onChange={() => toggleLayer('hexagons')}
            className="w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
          />
        </label>

        {/* POIs */}
        <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#1A1E2C] cursor-pointer transition-all">
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px]">POI & Raqobatchilar</span>
          </div>
          <input
            type="checkbox"
            checked={activeLayers.pois}
            onChange={() => toggleLayer('pois')}
            className="w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
          />
        </label>

        {/* Transit */}
        <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#1A1E2C] cursor-pointer transition-all">
          <div className="flex items-center gap-2 text-gray-300">
            <Train className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px]">Metro va Bekatlar</span>
          </div>
          <input
            type="checkbox"
            checked={activeLayers.transit}
            onChange={() => toggleLayer('transit')}
            className="w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
          />
        </label>

        {/* Scan Radius */}
        <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#1A1E2C] cursor-pointer transition-all">
          <div className="flex items-center gap-2 text-gray-300">
            <CircleDot className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px]">Tahlil Doirasi</span>
          </div>
          <input
            type="checkbox"
            checked={activeLayers.scanRadius}
            onChange={() => toggleLayer('scanRadius')}
            className="w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};
