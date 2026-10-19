import React, { useState } from 'react';
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
  MapPin,
  Bookmark,
  Check,
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
  const {
    inspection,
    loading,
    category,
    setCategory,
    radiusMeters,
    setRadiusMeters,
    selectedCoords,
    savedLocations,
    saveCurrentLocation,
  } = useAnalyticsStore();

  const [justSaved, setJustSaved] = useState(false);

  const score = inspection?.makon_score ?? 0;
  const status = inspection?.status ?? 'TAHLIL QILINMOQDA';
  const fin = inspection?.context?.financials;

  const isAlreadySaved = savedLocations.some(
    (item) =>
      Math.abs(item.coordinates.latitude - selectedCoords.latitude) < 0.0004 &&
      Math.abs(item.coordinates.longitude - selectedCoords.longitude) < 0.0004 &&
      item.category === category
  );

  let color = '#0E9F6E'; // Silky Emerald
  let badgeClass =
    'bg-[#0E9F6E]/10 text-[#0E9F6E] border-[#0E9F6E]/30 dark:bg-[#0E9F6E]/15 dark:text-[#10B981]';

  if (score < 55) {
    color = '#E11D48';
    badgeClass =
      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25';
  } else if (score < 80) {
    color = '#F59E0B';
    badgeClass =
      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25';
  }

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const revMinK = fin ? Math.round(fin.monthly_revenue_min_usd / 1000) : 16;
  const revMaxK = fin ? Math.round(fin.monthly_revenue_max_usd / 1000) : 23;

  const handleSave = () => {
    saveCurrentLocation();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1600);
  };

  return (
    <div className="relative space-y-3">
      {/* Top Row: Location Identity + Bookmark + Status Pill */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#7A807C] dark:text-[#9CA3AF]">
            <MapPin className="w-3 h-3 text-[#0E9F6E] shrink-0" />
            <span className="truncate">
              {inspection?.context?.district_name || 'Toshkent sh.'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <h2 className="text-sm font-bold text-[#111111] dark:text-[#FDFDFD] truncate tracking-tight select-text">
              {inspection?.context?.location_label || 'Markaziy Nuqta'}
            </h2>
            <button
              type="button"
              onClick={handleSave}
              aria-label={isAlreadySaved ? 'Manzil saqlangan' : 'Manzilni saqlash'}
              title={isAlreadySaved ? 'Manzil saqlangan' : 'Manzilni saqlash'}
              className={`press-scale p-1 rounded-md border cursor-pointer shrink-0 select-none ${
                isAlreadySaved || justSaved
                  ? 'bg-[#0E9F6E]/15 border-[#0E9F6E]/40 text-[#0E9F6E]'
                  : 'bg-black/[0.03] dark:bg-white/[0.05] border-black/[0.06] dark:border-white/[0.08] text-[#7A807C] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              {justSaved ? (
                <Check className="w-3 h-3" />
              ) : (
                <Bookmark className="w-3 h-3" fill={isAlreadySaved ? 'currentColor' : 'none'} />
              )}
            </button>
          </div>
        </div>

        <div
          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${badgeClass} flex items-center gap-1.5 whitespace-nowrap shrink-0 select-none`}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
          <span>{status}</span>
        </div>
      </div>

      {/* Middle Row: Circular Score Gauge + Verdict & Live Financial Strip */}
      <div className="flex items-center gap-3.5 pb-3 border-b border-black/[0.06] dark:border-white/[0.07]">
        {/* Circular Activity Ring */}
        <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center select-none">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 108 108" aria-hidden="true">
            <circle
              cx="54"
              cy="54"
              r={radius}
              className="stroke-black/[0.07] dark:stroke-white/[0.08]"
              strokeWidth="7"
              fill="transparent"
            />
            <circle
              cx="54"
              cy="54"
              r={radius}
              stroke={color}
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 500ms cubic-bezier(0.22, 1, 0.36, 1), stroke 300ms ease' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold tracking-tight text-[#111111] dark:text-[#FDFDFD] font-mono tabular-nums leading-none">
              {loading ? (
                <span className="animate-pulse">--</span>
              ) : (
                <AnimatedCounter value={score} decimals={1} />
              )}
            </span>
            <span className="text-[8px] text-[#7A807C] dark:text-[#9CA3AF] font-mono font-semibold uppercase mt-0.5">
              MakonScore
            </span>
          </div>
        </div>

        {/* Verdict + 3-Metric Financial Strip */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="text-[11px] leading-snug">
            {score >= 80 ? (
              <div className="flex items-start gap-1.5 text-[#111111] dark:text-[#E5E7EB] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#0E9F6E]" />
                <span>Yuqori rentabelli nuqta — kuchli tranzit va faol talab.</span>
              </div>
            ) : score >= 55 ? (
              <div className="flex items-start gap-1.5 text-[#111111] dark:text-[#E5E7EB] font-medium">
                <TrendingUp className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-500" />
                <span>Barqaror salohiyat — assortiment va narx ustunligi muhim.</span>
              </div>
            ) : (
              <div className="flex items-start gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-rose-500" />
                <span>Ehtiyotkorlik talab etiladi — oqim past yoki raqobat zich.</span>
              </div>
            )}
          </div>

          {/* 3-Column Financial KPI Mini-Grid */}
          <div className="grid grid-cols-3 gap-1.5 pt-0.5 select-text">
            <div className="bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.06] rounded-lg px-2 py-1.5">
              <div className="text-[9px] text-[#7A807C] dark:text-[#9CA3AF] truncate select-none">Kunlik oqim</div>
              <div className="text-[11px] font-mono tabular-nums font-bold text-[#111111] dark:text-[#FDFDFD]">
                {(fin?.daily_foot_traffic || 12400).toLocaleString()}
              </div>
            </div>
            <div className="bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.06] rounded-lg px-2 py-1.5">
              <div className="text-[9px] text-[#7A807C] dark:text-[#9CA3AF] truncate select-none">Oylik tushum</div>
              <div className="text-[11px] font-mono tabular-nums font-bold text-[#0E9F6E]">
                ${revMinK}k–${revMaxK}k
              </div>
            </div>
            <div className="bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.06] rounded-lg px-2 py-1.5">
              <div className="text-[9px] text-[#7A807C] dark:text-[#9CA3AF] truncate select-none">Qoplash (ROI)</div>
              <div className="text-[11px] font-mono tabular-nums font-bold text-[#111111] dark:text-[#FDFDFD]">
                ~{fin?.payback_months || 11.2} oy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Category Pills & Radius Segmented Controls */}
      <div className="space-y-2 select-none">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar" role="group" aria-label="Biznes toifasi">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setCategory(cat.id)}
                className={`press-scale flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#111111] text-white dark:bg-[#FDFDFD] dark:text-[#111111] shadow-sm'
                    : 'bg-black/[0.03] dark:bg-white/[0.04] text-[#525854] dark:text-[#9CA3AF] border border-black/[0.06] dark:border-white/[0.07] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                <span className={isSelected ? 'text-[#0E9F6E]' : 'text-[#7A807C]'}>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-mono font-semibold text-[#7A807C] dark:text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#0E9F6E]" />
            <span>Izoxrona Radiusi:</span>
          </span>
          <div
            className="flex items-center gap-1 bg-black/[0.04] dark:bg-white/[0.05] p-0.5 rounded-full border border-black/[0.06] dark:border-white/[0.07]"
            role="group"
            aria-label="Izoxrona radiusi"
          >
            {RADII.map((r) => {
              const isSelected = radiusMeters === r;
              return (
                <button
                  key={r}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setRadiusMeters(r)}
                  className={`press-scale px-2.5 py-0.5 rounded-full text-[11px] font-mono tabular-nums font-bold cursor-pointer ${
                    isSelected
                      ? 'bg-[#111111] text-white dark:bg-white dark:text-[#111111] shadow-sm'
                      : 'text-[#6E7470] dark:text-[#9CA3AF] hover:text-[#111111] dark:hover:text-white'
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
