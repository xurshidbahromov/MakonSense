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

  let color = '#06D6A0'; // Radiant Emerald
  let badgeBg = 'bg-[#E6FBF6] text-[#0C4137] border-[#06D6A0]/40';

  if (score < 50) {
    color = '#E11D48'; // Rose Red
    badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (score < 80) {
    color = '#05B385'; // Deep Mint
    badgeBg = 'bg-[#E6FBF6] text-[#0C4137] border-[#06D6A0]/30';
  }

  // Circular gauge calculations
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative space-y-3.5 select-none">
      {/* Header: Title and Status Pill */}
      <div className="flex items-center justify-between relative z-10">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase font-mono">
            Spatial Intelligence Rating
          </span>
          <h2 className="text-sm font-bold text-[#0C4137] flex items-center gap-1.5 mt-0.5 tracking-tight">
            MakonScore™ Ko‘rsatkichi
            <Sparkles className="w-3.5 h-3.5 text-[#06D6A0]" />
          </h2>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-[11px] font-bold border ${badgeBg} flex items-center gap-1.5 shadow-sm whitespace-nowrap flex-shrink-0`}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
          <span>{status}</span>
        </div>
      </div>

      {/* Score Hero: Animated Circular Activity Ring + Summary */}
      <div className="flex items-center gap-4 relative z-10 pb-3 border-b border-[#0C4137]/[0.08]">
        {/* Animated Circular Activity Ring */}
        <div className="relative w-22 h-22 sm:w-24 sm:h-24 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="stroke-neutral-200"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke={color}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center select-none">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C4137] font-mono leading-none">
              {loading ? (
                <span className="animate-pulse">--</span>
              ) : (
                <AnimatedCounter value={score} decimals={1} />
              )}
            </span>
            <span className="text-[9px] text-neutral-400 font-bold tracking-wider uppercase mt-1">/ 100</span>
          </div>
        </div>

        {/* Verdict & Catchment Metadata */}
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="text-xs leading-relaxed">
            {score >= 80 ? (
              <div className="flex items-start gap-1.5 text-[#0C4137] font-semibold">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#06D6A0]" />
                <span>Tanlangan toifada biznes ochish uchun optimal nuqta. Yuqori oqim.</span>
              </div>
            ) : score >= 50 ? (
              <div className="flex items-start gap-1.5 text-[#0C4137] font-semibold">
                <TrendingUp className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#05B385]" />
                <span>O‘rtacha barqaror talab. Raqobat bosimiga e’tibor qarating.</span>
              </div>
            ) : (
              <div className="flex items-start gap-1.5 text-rose-700 font-semibold">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
                <span>Yuqori riskli zona. Piyodalar oqimi sust yoki raqobat zich.</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
            <span>Aholi qamrovi: <strong className="text-[#0C4137] font-semibold">~{(inspection?.context?.estimated_households || 1820).toLocaleString()} ta</strong></span>
            <span>Raqobatchi: <strong className="text-amber-600 font-mono font-bold">{inspection?.context?.direct_competitors_count || 0} ta</strong></span>
          </div>
        </div>
      </div>

      {/* Interactive Controls: Category Pills & Radius Segmented Controls */}
      <div className="space-y-2.5 relative z-10">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ease-out active:scale-[0.96] ${
                  isSelected
                    ? 'bg-[#0C4137] text-white shadow-sm'
                    : 'bg-white text-neutral-600 border border-[#0C4137]/[0.08] hover:text-[#0C4137] hover:border-[#06D6A0]/40'
                }`}
              >
                <span className={isSelected ? 'text-[#06D6A0]' : 'text-neutral-500'}>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Radius Segmented Buttons */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">Tahlil Radiusi:</span>
          <div className="flex items-center gap-1 bg-[#F4F7F6] p-0.5 rounded-full border border-[#0C4137]/[0.08]">
            {RADII.map((r) => {
              const isSelected = radiusMeters === r;
              return (
                <button
                  key={r}
                  onClick={() => setRadiusMeters(r)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all duration-150 ease-out active:scale-[0.96] ${
                    isSelected
                      ? 'bg-[#0C4137] text-white shadow-sm'
                      : 'text-neutral-500 hover:text-[#0C4137]'
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
