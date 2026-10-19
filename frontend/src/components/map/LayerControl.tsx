import React, { useState } from 'react';
import {
  Layers,
  Sun,
  Moon,
  Globe,
  Boxes,
  ChevronDown,
  ChevronUp,
  GitCompare,
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
    showComparePinOnMap,
    setShowComparePinOnMap,
  } = useAnalyticsStore();

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute top-3.5 right-3.5 z-20 bg-white/95 dark:bg-[#161618]/95 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-3 shadow-xl space-y-2.5 select-none w-64 transition-all duration-200">
      {/* HUD Header */}
      <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.07]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#0E9F6E]/10 border border-[#0E9F6E]/25 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5 text-[#0E9F6E]" />
          </div>
          <span className="text-[11px] font-semibold text-[#111111] dark:text-[#FDFDFD] tracking-tight">
            Xarita Qatlamlari
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={togglePitchMode}
            title={pitchMode === '3d' ? "2D tekis ko'rinish" : "3D izometrik ko'rinish"}
            className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
              pitchMode === '3d'
                ? 'bg-[#111111] text-white dark:bg-white dark:text-[#111111]'
                : 'bg-black/[0.05] dark:bg-white/[0.07] text-[#6E7470] dark:text-[#9CA3AF]'
            }`}
          >
            <Boxes className="w-3 h-3 text-[#0E9F6E]" />
            <span>{pitchMode.toUpperCase()}</span>
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-[#7A807C] hover:text-[#111111] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="space-y-2.5">
          {/* Basemap Switcher */}
          <div className="grid grid-cols-3 gap-1 bg-black/[0.04] dark:bg-white/[0.05] p-1 rounded-xl border border-black/[0.05] dark:border-white/[0.06]">
            <button
              onClick={() => setBasemapMode('light')}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                basemapMode === 'light'
                  ? 'bg-white dark:bg-[#27272A] text-[#111111] dark:text-white shadow-sm'
                  : 'text-[#6E7470] dark:text-[#9CA3AF] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              <Sun className="w-3 h-3 text-[#0E9F6E]" />
              <span>Yorug‘</span>
            </button>
            <button
              onClick={() => setBasemapMode('satellite')}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                basemapMode === 'satellite'
                  ? 'bg-white dark:bg-[#27272A] text-[#111111] dark:text-white shadow-sm'
                  : 'text-[#6E7470] dark:text-[#9CA3AF] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3 text-[#0E9F6E]" />
              <span>Sputnik</span>
            </button>
            <button
              onClick={() => setBasemapMode('dark')}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                basemapMode === 'dark'
                  ? 'bg-white dark:bg-[#27272A] text-[#111111] dark:text-white shadow-sm'
                  : 'text-[#6E7470] dark:text-[#9CA3AF] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              <Moon className="w-3 h-3 text-[#0E9F6E]" />
              <span>Tungi</span>
            </button>
          </div>

          {/* Spatial Layer Toggles */}
          <div className="space-y-1 text-xs pt-0.5">
            {[
              {
                key: 'hexagons' as const,
                label: 'H3 Geksagonal Klaster',
                dotClass: 'bg-[#0E9F6E]',
              },
              {
                key: 'pois' as const,
                label: 'POI va Raqobatchilar',
                dotClass: 'bg-amber-500',
              },
              {
                key: 'transit' as const,
                label: 'Metro va Tranzit Hablar',
                dotClass: 'bg-emerald-500 ring-2 ring-emerald-500/30',
              },
              {
                key: 'scanRadius' as const,
                label: 'Tahlil Doirasi (Radius)',
                dotClass: 'border-2 border-[#0E9F6E] bg-transparent',
              },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.04] cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.dotClass}`} />
                  <span className="text-[11px] font-medium text-[#525854] dark:text-[#D1D5DB] group-hover:text-[#111111] dark:group-hover:text-white">
                    {item.label}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={activeLayers[item.key]}
                  onChange={() => toggleLayer(item.key)}
                  className="w-3.5 h-3.5 accent-[#0E9F6E] rounded cursor-pointer"
                />
              </label>
            ))}

            {/* A/B Comparison Pin Toggle */}
            <label className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.04] cursor-pointer transition-all group border-t border-black/[0.05] dark:border-white/[0.06] pt-2 mt-1">
              <div className="flex items-center gap-2">
                <GitCompare className="w-3 h-3 text-indigo-500" />
                <span className="text-[11px] font-medium text-[#525854] dark:text-[#D1D5DB] group-hover:text-[#111111] dark:group-hover:text-white">
                  A/B Solishtirish (B nuqta)
                </span>
              </div>
              <input
                type="checkbox"
                checked={showComparePinOnMap}
                onChange={(e) => setShowComparePinOnMap(e.target.checked)}
                className="w-3.5 h-3.5 accent-indigo-500 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayerControl;
