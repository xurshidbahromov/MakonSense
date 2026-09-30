import React, { useState } from 'react';
import {
  Layers,
  Hexagon,
  MapPin,
  Train,
  CircleDot,
  Sun,
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
    <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-2xl border border-[#0C4137]/[0.1] rounded-2xl p-3 shadow-xl space-y-2.5 select-none w-64 transition-all duration-300">
      {/* HUD Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#0C4137]/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#E6FBF6] border border-[#06D6A0]/30 flex items-center justify-center text-[#0C4137]">
            <Layers className="w-3.5 h-3.5 text-[#06D6A0]" />
          </div>
          <span className="text-[11px] font-bold text-[#0C4137] tracking-tight">Xarita Qatlamlari</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={togglePitchMode}
            title={pitchMode === '3d' ? "2D tekis ko'rinishga o'tish" : "3D fazoviy ko'rinishga o'tish"}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all active:scale-95 ${
              pitchMode === '3d'
                ? 'bg-[#0C4137] text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-600 border border-[#0C4137]/[0.08] hover:text-[#0C4137]'
            }`}
          >
            <Boxes className="w-3 h-3 text-[#06D6A0]" />
            <span>{pitchMode.toUpperCase()}</span>
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg text-neutral-400 hover:text-[#0C4137] hover:bg-neutral-100 transition-all"
          >
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="space-y-2.5 animate-in fade-in duration-150">
          {/* Basemap Switcher: Yorug' / Sputnik / Tungi */}
          <div className="grid grid-cols-3 gap-1 bg-[#F4F7F6] p-1 rounded-xl border border-[#0C4137]/[0.08]">
            <button
              onClick={() => setBasemapMode('light')}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all active:scale-[0.98] ${
                basemapMode === 'light'
                  ? 'bg-[#0C4137] text-white shadow-sm font-bold'
                  : 'text-neutral-500 hover:text-[#0C4137]'
              }`}
            >
              <Sun className="w-3 h-3 text-[#06D6A0]" />
              <span>Yorug‘</span>
            </button>
            <button
              onClick={() => setBasemapMode('satellite')}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all active:scale-[0.98] ${
                basemapMode === 'satellite'
                  ? 'bg-[#0C4137] text-white shadow-sm font-bold'
                  : 'text-neutral-500 hover:text-[#0C4137]'
              }`}
            >
              <Globe className="w-3 h-3 text-[#06D6A0]" />
              <span>Sputnik</span>
            </button>
            <button
              onClick={() => setBasemapMode('dark')}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all active:scale-[0.98] ${
                basemapMode === 'dark'
                  ? 'bg-[#0C4137] text-white shadow-sm font-bold'
                  : 'text-neutral-500 hover:text-[#0C4137]'
              }`}
            >
              <Moon className="w-3 h-3 text-[#06D6A0]" />
              <span>Tungi</span>
            </button>
          </div>

          {/* Spatial Layer Toggles */}
          <div className="space-y-1 text-xs pt-1">
            {/* H3 Hexagons */}
            <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#F2FDFB] cursor-pointer transition-all group">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#06D6A0] group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-neutral-600 group-hover:text-[#0C4137]">
                  H3 Geksagonal To‘r
                </span>
              </div>
              <input
                type="checkbox"
                checked={activeLayers.hexagons}
                onChange={() => toggleLayer('hexagons')}
                className="w-3.5 h-3.5 accent-[#06D6A0] rounded cursor-pointer"
              />
            </label>

            {/* POIs & Competitors */}
            <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#F2FDFB] cursor-pointer transition-all group">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-neutral-600 group-hover:text-[#0C4137]">
                  POI va Raqobatchilar
                </span>
              </div>
              <input
                type="checkbox"
                checked={activeLayers.pois}
                onChange={() => toggleLayer('pois')}
                className="w-3.5 h-3.5 accent-[#06D6A0] rounded cursor-pointer"
              />
            </label>

            {/* Metro & Transit */}
            <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#F2FDFB] cursor-pointer transition-all group">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0C4137] group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-neutral-600 group-hover:text-[#0C4137]">
                  Metro Bekatlari
                </span>
              </div>
              <input
                type="checkbox"
                checked={activeLayers.transit}
                onChange={() => toggleLayer('transit')}
                className="w-3.5 h-3.5 accent-[#06D6A0] rounded cursor-pointer"
              />
            </label>

            {/* Radar Buffer */}
            <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#F2FDFB] cursor-pointer transition-all group">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#06D6A0] group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-neutral-600 group-hover:text-[#0C4137]">
                  Tahlil Doirasi (Radius)
                </span>
              </div>
              <input
                type="checkbox"
                checked={activeLayers.scanRadius}
                onChange={() => toggleLayer('scanRadius')}
                className="w-3.5 h-3.5 accent-[#06D6A0] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayerControl;
