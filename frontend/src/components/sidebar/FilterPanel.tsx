import React from 'react';
import { Coffee, Pill, ShoppingCart, GraduationCap, ShoppingBag, Sliders, RefreshCw } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { BusinessCategory } from '../../types';

const CATEGORIES: { id: BusinessCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'cafe', label: 'Kafe & Fastfood', icon: <Coffee className="w-4 h-4" /> },
  { id: 'pharmacy', label: 'Dorixona', icon: <Pill className="w-4 h-4" /> },
  { id: 'supermarket', label: 'Supermarket', icon: <ShoppingCart className="w-4 h-4" /> },
  { id: 'school', label: "Ta'lim Markazi", icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'retail', label: 'Chakana Savdo', icon: <ShoppingBag className="w-4 h-4" /> },
];

const RADII = [300, 500, 800, 1000];

export const FilterPanel: React.FC = () => {
  const { category, setCategory, radiusMeters, setRadiusMeters, inspectPoint, loading } = useAnalyticsStore();

  return (
    <div className="bg-[#13151D] border border-[#222735] rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-emerald-400" />
          Tahlil Parametrlari
        </h3>
        <button
          onClick={() => inspectPoint()}
          disabled={loading}
          className="p-1.5 rounded-lg bg-[#1A1E2C] text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all active:scale-95"
          title="Qayta hisoblash"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>

      {/* Category Pills */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-gray-400">Biznes Toifasi:</label>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm shadow-emerald-950'
                    : 'bg-[#1A1E2C]/80 text-gray-400 border border-transparent hover:border-[#2E3547] hover:text-white'
                }`}
              >
                <span className={isSelected ? 'text-emerald-400' : 'text-gray-500'}>{cat.icon}</span>
                <span className="truncate">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Radius Pills */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-gray-400">Tahlil Doirasi Radiusi:</span>
          <span className="font-mono font-bold text-emerald-400">{radiusMeters} metr</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {RADII.map((r) => {
            const isSelected = radiusMeters === r;
            return (
              <button
                key={r}
                onClick={() => setRadiusMeters(r)}
                className={`py-1.5 rounded-lg text-xs font-mono font-medium transition-all text-center ${
                  isSelected
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'bg-[#1A1E2C] text-gray-400 border border-[#222735] hover:text-white'
                }`}
              >
                {r}m
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
