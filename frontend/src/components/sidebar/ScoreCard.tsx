import React from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Coffee,
  Pill,
  ShoppingCart,
  GraduationCap,
  ShoppingBag,
} from 'lucide-react';
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

  // Dynamic theme colors
  let color = '#10B981';
  let badgeBg = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
  let gaugeShadow = 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.35))';

  if (score < 50) {
    color = '#EF4444';
    badgeBg = 'bg-rose-500/10 text-rose-300 border-rose-500/30';
    gaugeShadow = 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.35))';
  } else if (score < 80) {
    color = '#06B6D4';
    badgeBg = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
    gaugeShadow = 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.35))';
  }

  // Circular gauge calculations
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative space-y-3.5">
      {/* Subtle corner light fold */}
      <div
        className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-15 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: color }}
      />

      {/* Header: Title and Status Pill */}
      <div className="flex items-center justify-between relative z-10">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            Spatial Intelligence Rating
          </span>
          <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5 mt-0.5 tracking-tight">
            MakonScore™ Ko'rsatkichi
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </h2>
        </div>
        <div
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${badgeBg} flex items-center gap-1.5 shadow-sm whitespace-nowrap flex-shrink-0 backdrop-blur-md`}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: color }} />
          <span>{status}</span>
        </div>
      </div>

      {/* Score Hero: Animated Circular Gauge + Summary */}
      <div className="flex items-center gap-4 relative z-10 pb-3 border-b border-white/[0.08]">
        {/* Animated Circular Gauge */}
        <div
          className="relative w-22 h-22 sm:w-24 sm:h-24 flex-shrink-0 flex items-center justify-center transition-all duration-500"
          style={{ filter: gaugeShadow }}
        >
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="stroke-white/[0.08]"
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
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono leading-none">
              {loading ? (
                <span className="animate-pulse">--</span>
              ) : (
                <AnimatedCounter value={score} decimals={1} />
              )}
            </span>
            <span className="text-[8px] text-gray-400 font-bold tracking-wider uppercase mt-1">/ 100</span>
          </div>
        </div>

        {/* Verdict & Catchment Metadata */}
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

      {/* Interactive Controls: Category Pills & Radius Slider */}
      <div className="space-y-2.5 relative z-10">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-[0.97] ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm shadow-emerald-950/40'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                <span className={isSelected ? 'text-emerald-400' : 'text-gray-400'}>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Radius Segmented Buttons */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tahlil Radiusi:</span>
          <div className="flex items-center gap-1 bg-[#13151F] p-0.5 rounded-xl border border-white/[0.08]">
            {RADII.map((r) => {
              const isSelected = radiusMeters === r;
              return (
                <button
                  key={r}
                  onClick={() => setRadiusMeters(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all duration-150 active:scale-[0.97] ${
                    isSelected
                      ? 'bg-emerald-500 text-black shadow-sm font-black'
                      : 'text-gray-400 hover:text-white'
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

export default ScoreCard;
