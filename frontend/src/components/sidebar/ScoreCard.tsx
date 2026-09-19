import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { AnimatedCounter } from '../ui/AnimatedCounter';

export const ScoreCard: React.FC = () => {
  const { inspection, loading, category, radiusMeters } = useAnalyticsStore();

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
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`bg-[#0E1017] border border-[#222735] rounded-2xl p-5 relative overflow-hidden transition-all duration-300 ${rimGlow}`}>
      {/* Subtle radial corner illumination */}
      <div
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            Spatial Intelligence Rating
          </span>
          <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5 mt-0.5 tracking-tight">
            MakonScore™ Ko'rsatkichi
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </h2>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badgeBg} flex items-center gap-1.5 shadow-sm`}>
          <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: color }} />
          <span>{status}</span>
        </div>
      </div>

      <div className="flex items-center gap-5 relative z-10">
        {/* Animated Circular Gauge */}
        <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            {/* Track */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="stroke-[#191D2B]"
              strokeWidth="9"
              fill="transparent"
            />
            {/* Dynamic Value Stroke */}
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
            <span className="text-3xl font-black tracking-tight text-white font-mono">
              {loading ? (
                <span className="animate-pulse">--</span>
              ) : (
                <AnimatedCounter value={score} decimals={1} />
              )}
            </span>
            <span className="text-[9px] text-gray-400 font-bold tracking-wider uppercase -mt-0.5">/ 100</span>
          </div>
        </div>

        {/* Verdict and Metadata */}
        <div className="flex-1 space-y-2.5">
          <div className="text-xs leading-relaxed">
            {score >= 80 ? (
              <div className="flex items-start gap-1.5 text-emerald-300">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                <span>Tanlangan toifada biznes ochish uchun optimal nuqta. Yuqori oqim kafolatlangan.</span>
              </div>
            ) : score >= 50 ? (
              <div className="flex items-start gap-1.5 text-cyan-300">
                <TrendingUp className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyan-400" />
                <span>O'rtacha barqaror talab. Raqobat bosimi va differentsiatsiyaga e'tibor qarating.</span>
              </div>
            ) : (
              <div className="flex items-start gap-1.5 text-rose-300">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                <span>Yuqori riskli zona. Piyodalar oqimi sust yoki toifadosh raqobat juda zich.</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-[#222735] flex items-center justify-between text-[11px] text-gray-400">
            <span>Toifa: <strong className="text-white capitalize">{category}</strong></span>
            <span>Doira: <strong className="text-white font-mono">{radiusMeters}m</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
