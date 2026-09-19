import React, { useState } from 'react';
import {
  Layers,
  Hexagon,
  MapPin,
  Train,
  CircleDot,
  Moon,
  Globe,
  Boxes,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

export const LayerControl: React.FC = () => {
  const {
    activeLayers,
    toggleLayer,
    basemapMode,
    setBasemapMode,
    pitchMode,
    togglePitchMode,
  } = useAnalyticsStore();

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-20 bg-[#0D0F17]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl space-y-2.5 select-none w-64 transition-all duration-300">
      {/* HUD Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-bold text-white tracking-tight">Xarita Qatlamlari</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={togglePitchMode}
            title={pitchMode === '3d' ? "2D tekis ko'rinishga o'tish" : "3D fazoviy ko'rinishga o'tish"}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all active:scale-95 ${
              pitchMode === '3d'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
            }`}
          >
            <Boxes className="w-3 h-3" />
            <span>{pitchMode.toUpperCase()}</span>
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="space-y-2.5 animate-in fade-in duration-150">
          {/* Basemap Switcher (Tungi vs Sputnik) */}
          <div className="grid grid-cols-2 gap-1.5 bg-[#151824]/90 p-1 rounded-xl border border-white/[0.06]">
            <button
              onClick={() => setBasemapMode('dark')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] ${
                basemapMode === 'dark'
                  ? 'bg-emerald-500 text-black shadow-md font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Tungi</span>
            </button>
            <button
              onClick={() => setBasemapMode('satellite')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] ${
                basemapMode === 'satellite'
                  ? 'bg-emerald-500 text-black shadow-md font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Sputnik</span>
            </button>
          </div>

          {/* Spatial Layer Toggles */}
          <div className="space-y-1 text-xs pt-1">
            {/* H3 Hexagons */}
            <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-white/5 cursor-pointer transition-all group">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-medium text-gray-300 group-hover:text-white">
                  H3 Geksagonal To'r
                </span>
              </div>
              <input
                type="checkbox"
                checked={activeLayers.hexagons}
                onChange={() => toggleLayer('hexagons')}
                className="w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
              />
            </label>

            {/* POIs & Competitors */}
            <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-white/5 cursor-pointer transition-all group">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-medium text-gray-300 group-hover:text-white">
                  POI va Raqobatchilar
                </span>
              </div>
              <input
                type="checkbox"
                checked={activeLayers.pois}
                onChange={() => toggleLayer('pois')}
                className="w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
              />
            </label>

            {/* Metro & Transit */}
            <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-white/5 cursor-pointer transition-all group">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-medium text-gray-300 group-hover:text-white">
                  Metro Bekatlari
                </span>
              </div>
              <input
                type="checkbox"
                checked={activeLayers.transit}
                onChange={() => toggleLayer('transit')}
                className="w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
              />
            </label>

            {/* Radar Buffer */}
            <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-white/5 cursor-pointer transition-all group">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-medium text-gray-300 group-hover:text-white">
                  Tahlil Doirasi (Radius)
                </span>
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
      )}
    </div>
  );
};

export default LayerControl;
