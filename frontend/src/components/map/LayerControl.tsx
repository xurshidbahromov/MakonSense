import React from 'react';
import { Layers, Hexagon, MapPin, Train, CircleDot, Moon, Globe } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

export const LayerControl: React.FC = () => {
  const { activeLayers, toggleLayer, basemapMode, setBasemapMode } = useAnalyticsStore();

  return (
    <div className="absolute top-4 right-4 z-20 bg-[#0D0F17]/95 backdrop-blur-xl border border-[#222735] rounded-2xl p-3.5 shadow-2xl space-y-3 select-none w-60">
      {/* Basemap Style Switcher (Dark vs Satellite) */}
      <div className="space-y-1.5 pb-2.5 border-b border-[#222735]">
        <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Xarita Asosi
          </span>
          <span className="text-[9px] text-emerald-400 font-mono">100% Toza</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 bg-[#161925] p-1 rounded-xl border border-[#222735]">
          <button
            onClick={() => setBasemapMode('dark')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              basemapMode === 'dark'
                ? 'bg-emerald-500 text-black shadow-sm font-bold'
                : 'text-gray-400 hover:text-white hover:bg-[#1F2435]'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Tungi</span>
          </button>
          <button
            onClick={() => setBasemapMode('satellite')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              basemapMode === 'satellite'
                ? 'bg-emerald-500 text-black shadow-sm font-bold'
                : 'text-gray-400 hover:text-white hover:bg-[#1F2435]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Sputnik</span>
          </button>
        </div>
      </div>

      {/* Layer Toggles */}
      <div className="space-y-1 text-xs">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
          Fazoviy Qatlamlar
        </div>

        {/* H3 Hexagons */}
        <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#161925] cursor-pointer transition-all">
          <div className="flex items-center gap-2 text-gray-300">
            <Hexagon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-medium">H3 Geksagonal To'r</span>
          </div>
          <input
            type="checkbox"
            checked={activeLayers.hexagons}
            onChange={() => toggleLayer('hexagons')}
            className="w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
          />
        </label>

        {/* POIs */}
        <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#161925] cursor-pointer transition-all">
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-medium">POI & Raqobatchilar</span>
          </div>
          <input
            type="checkbox"
            checked={activeLayers.pois}
            onChange={() => toggleLayer('pois')}
            className="w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
          />
        </label>

        {/* Transit */}
        <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#161925] cursor-pointer transition-all">
          <div className="flex items-center gap-2 text-gray-300">
            <Train className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] font-medium">Metro va Bekatlar</span>
          </div>
          <input
            type="checkbox"
            checked={activeLayers.transit}
            onChange={() => toggleLayer('transit')}
            className="w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
          />
        </label>

        {/* Scan Radius */}
        <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#161925] cursor-pointer transition-all">
          <div className="flex items-center gap-2 text-gray-300">
            <CircleDot className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-medium">Tahlil Doirasi</span>
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
