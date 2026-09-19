import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck, Coffee, Pill, ShoppingCart, GraduationCap, ShoppingBag } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { BusinessCategory } from '../../types';

const CATEGORIES: { id: BusinessCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'cafe', label: 'Kafe', icon: <Coffee className="w-3.5 h-3.5" /> },
  { id: 'pharmacy', label: 'Dorixona', icon: <Pill className="w-3.5 h-3.5" /> },
  { id: 'supermarket', label: 'Supermarket', icon: <ShoppingCart className="w-3.5 h-3.5" /> },
  { id: 'school', label: "Ta'lim", icon: <GraduationCap className="w-3.5 h-3.5" /> },
  { id: 'retail', label: 'Chakana', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
];

const RADII = [300, 500, 800, 1000];

export const ScoreCard: React.FC = () => {
  const { inspection, loading, category, setCategory, radiusMeters, setRadiusMeters } = useAnalyticsStore();

  const score = inspection?.makon_score ?? 0;
  const status = inspection?.status ?? 'TAHLIL QILINMOQDA';

  // Dynamic status colors
  let color = '#10B981';
  let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let rimGlow = 'rim-glow-emerald';

  if (score < 50) {
    color = '#EF4444';
    badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    rimGlow = '';
  } else if (score < 80) {
    color = '#06B6D4';
    badgeBg = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    rimGlow = 'rim-glow-cyan';
  }

  // Circular gauge calculations
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`bg-[#0E1017] border border-[#222735] rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all duration-300 ${rimGlow} shadow-xl`}>
      {/* Subtle radial corner illumination */}
      <div
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: color }}
      />

      {/* Header with Title and Status */}
      <div className="flex items-center justify-between mb-3.5 relative z-10">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            Spatial Intelligence Rating
          </span>
          <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5 mt-0.5 tracking-tight">
            MakonScore™ Ko'rsatkichi
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </h2>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${badgeBg} flex items-center gap-1.5 shadow-sm whitespace-nowrap flex-shrink-0`}>
          <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: color }} />
          <span>{status}</span>
        </div>
      </div>

      {/* Main Gauge + Verdict */}
      <div className="flex items-center gap-4 relative z-10 pb-3 border-b border-[#222735]">
        {/* Animated Circular Gauge */}
        <div className="relative w-24 h-24 sm:w-26 sm:h-26 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="stroke-[#191D2B]"
              strokeWidth="9"
              fill="transparent"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke={color}
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center select-none">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
              {loading ? (
                <span className="animate-pulse">--</span>
              ) : (
                <AnimatedCounter value={score} decimals={1} />
              )}
            </span>
            <span className="text-[8px] text-gray-400 font-bold tracking-wider uppercase -mt-0.5">/ 100</span>
          </div>
        </div>

        {/* Verdict and Metadata */}
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="text-xs leading-relaxed">
            {score >= 80 ? (
              <div className="flex items-start gap-1.5 text-emerald-300 font-medium">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                <span>Tanlangan toifada biznes ochish uchun optimal nuqta. Yuqori oqim.</span>
              </div>
            ) : score >= 50 ? (
              <div className="flex items-start gap-1.5 text-cyan-300 font-medium">
                <TrendingUp className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyan-400" />
                <span>O'rtacha barqaror talab. Raqobat bosimiga e'tibor qarating.</span>
              </div>
            ) : (
              <div className="flex items-start gap-1.5 text-rose-300 font-medium">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                <span>Yuqori riskli zona. Piyodalar oqimi sust yoki raqobat zich.</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
            <span>Aholi qamrovi: <strong className="text-gray-200">~{(inspection?.context?.estimated_households || 1820).toLocaleString()} ta</strong></span>
            <span>Raqobatchi: <strong className="text-amber-400 font-mono">{inspection?.context?.direct_competitors_count || 0} ta</strong></span>
          </div>
        </div>
      </div>

      {/* Integrated Quick Filter Strips */}
      <div className="pt-3 space-y-2.5 relative z-10">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all active:scale-[0.97] ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm shadow-emerald-950'
                    : 'bg-[#161925] text-gray-400 border border-[#222735] hover:text-white hover:border-[#2E3547]'
                }`}
              >
                <span className={isSelected ? 'text-emerald-400' : 'text-gray-500'}>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Radius Pills */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tahlil Radiusi:</span>
          <div className="flex items-center gap-1">
            {RADII.map((r) => {
              const isSelected = radiusMeters === r;
              return (
                <button
                  key={r}
                  onClick={() => setRadiusMeters(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-black shadow-sm'
                      : 'bg-[#161925] text-gray-400 border border-[#222735] hover:text-white'
                  }`}
                >
                  {r}m
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
