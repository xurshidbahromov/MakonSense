import React from 'react';
import {
  GitCompare,
  CheckCircle2,
  Crosshair,
  ArrowLeftRight,
  Trophy,
} from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

const BENCHMARK_HUBS = [
  { name: 'Tashkent City IBC', lat: 41.3145, lon: 69.2485 },
  { name: 'Chilonzor Savdo Markazi', lat: 41.2728, lon: 69.2062 },
  { name: 'Chorsu Bozori', lat: 41.3271, lon: 69.2346 },
  { name: 'Oybek / Mirabad', lat: 41.2981, lon: 69.2783 },
  { name: 'Yunusobod Mega Planet', lat: 41.3654, lon: 69.2907 },
  { name: 'Buyuk Ipak Yo‘li', lat: 41.3262, lon: 69.3347 },
];

export const CompareLocations: React.FC = () => {
  const {
    inspection,
    compareCoords,
    compareInspection,
    setCompareCoords,
    isPickingCompareOnMap,
    setIsPickingCompareOnMap,
    swapCompareLocations,
  } = useAnalyticsStore();

  const locA = inspection;
  const locB = compareInspection;

  const scoreA = locA.makon_score;
  const scoreB = locB.makon_score;
  const diffScore = scoreA - scoreB;

  const finA = locA.context.financials;
  const finB = locB.context.financials;

  const labelA = locA.context.location_label?.split(' (')[0] || 'Nuqta A';
  const labelB = locB.context.location_label?.split(' (')[0] || 'Nuqta B';

  return (
    <div className="space-y-3.5 select-none">
      {/* Header + Interactive Map Pick & Swap Buttons */}
      <div className="bg-black/[0.025] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.07] rounded-xl p-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/25 shrink-0">
            <GitCompare className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-mono font-bold text-[#7A807C] dark:text-[#9CA3AF] tracking-wider block">
              Jonli A/B Taqqoslash
            </span>
            <div className="text-xs font-bold text-[#111111] dark:text-[#FDFDFD] truncate">
              {labelA} vs {labelB}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={swapCompareLocations}
            title="A va B nuqtalarni o'zaro almashtirish"
            className="p-1.5 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-[#111111] dark:text-white transition-all cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsPickingCompareOnMap(!isPickingCompareOnMap)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              isPickingCompareOnMap
                ? 'bg-indigo-600 text-white shadow-sm animate-pulse'
                : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{isPickingCompareOnMap ? 'Xaritani bosing...' : 'Xaritadan B tanlash'}</span>
          </button>
        </div>
      </div>

      {/* Quick Preset Benchmark Picker */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-mono uppercase tracking-wider text-[#7A807C] dark:text-[#9CA3AF] font-semibold">
          Yoki tayyor etalon hududni tanlang (Lokatsiya B):
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {BENCHMARK_HUBS.map((bm) => {
            const isSelected =
              Math.abs(compareCoords.latitude - bm.lat) < 0.002 &&
              Math.abs(compareCoords.longitude - bm.lon) < 0.002;
            return (
              <button
                key={bm.name}
                onClick={() => setCompareCoords({ latitude: bm.lat, longitude: bm.lon })}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-left truncate transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'bg-white dark:bg-[#161618] text-[#525854] dark:text-[#D1D5DB] border border-black/[0.07] dark:border-white/[0.08] hover:border-indigo-500/50'
                }`}
              >
                {bm.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Head-to-Head Comparison Matrix */}
      <div className="bg-white dark:bg-[#161618] border border-black/[0.07] dark:border-white/[0.08] rounded-xl overflow-hidden text-xs">
        <div className="grid grid-cols-3 bg-black/[0.03] dark:bg-white/[0.04] px-3 py-2.5 border-b border-black/[0.06] dark:border-white/[0.07] font-semibold text-[11px]">
          <div className="text-[#7A807C] dark:text-[#9CA3AF]">Mezon</div>
          <div className="text-center text-[#0E9F6E] truncate px-1">A: {labelA}</div>
          <div className="text-center text-indigo-500 truncate px-1">B: {labelB}</div>
        </div>

        {/* Row 1: MakonScore */}
        <div className="grid grid-cols-3 px-3 py-2.5 border-b border-black/[0.05] dark:border-white/[0.05] items-center">
          <div className="text-[#525854] dark:text-[#D1D5DB] font-medium">MakonScore™</div>
          <div className="text-center font-mono font-bold text-[#0E9F6E] flex items-center justify-center gap-1">
            <span>{scoreA.toFixed(1)}</span>
            {scoreA >= scoreB && <Trophy className="w-3 h-3 text-[#0E9F6E]" />}
          </div>
          <div className="text-center font-mono font-bold text-indigo-500 flex items-center justify-center gap-1">
            <span>{scoreB.toFixed(1)}</span>
            {scoreB > scoreA && <Trophy className="w-3 h-3 text-indigo-500" />}
          </div>
        </div>

        {/* Row 2: Daily Foot Traffic */}
        <div className="grid grid-cols-3 px-3 py-2.5 border-b border-black/[0.05] dark:border-white/[0.05] items-center">
          <div className="text-[#525854] dark:text-[#D1D5DB] font-medium">Kunlik Oqim</div>
          <div className="text-center font-mono font-semibold text-[#111111] dark:text-[#FDFDFD]">
            ~{(finA?.daily_foot_traffic || 12400).toLocaleString()}
          </div>
          <div className="text-center font-mono font-semibold text-[#111111] dark:text-[#FDFDFD]">
            ~{(finB?.daily_foot_traffic || 11200).toLocaleString()}
          </div>
        </div>

        {/* Row 3: Monthly Revenue Forecast */}
        <div className="grid grid-cols-3 px-3 py-2.5 border-b border-black/[0.05] dark:border-white/[0.05] items-center">
          <div className="text-[#525854] dark:text-[#D1D5DB] font-medium">Oylik Tushum</div>
          <div className="text-center font-mono font-bold text-[#0E9F6E]">
            ${Math.round((finA?.monthly_revenue_min_usd || 16000) / 1000)}k–$
            {Math.round((finA?.monthly_revenue_max_usd || 22000) / 1000)}k
          </div>
          <div className="text-center font-mono font-bold text-indigo-500">
            ${Math.round((finB?.monthly_revenue_min_usd || 14000) / 1000)}k–$
            {Math.round((finB?.monthly_revenue_max_usd || 19000) / 1000)}k
          </div>
        </div>

        {/* Row 4: Payback Period */}
        <div className="grid grid-cols-3 px-3 py-2.5 border-b border-black/[0.05] dark:border-white/[0.05] items-center">
          <div className="text-[#525854] dark:text-[#D1D5DB] font-medium">Qoplash (ROI)</div>
          <div className="text-center font-mono font-semibold text-[#111111] dark:text-[#FDFDFD]">
            ~{finA?.payback_months || 10.5} oy
          </div>
          <div className="text-center font-mono font-semibold text-[#111111] dark:text-[#FDFDFD]">
            ~{finB?.payback_months || 12.0} oy
          </div>
        </div>

        {/* Row 5: Nearest Metro */}
        <div className="grid grid-cols-3 px-3 py-2.5 border-b border-black/[0.05] dark:border-white/[0.05] items-center">
          <div className="text-[#525854] dark:text-[#D1D5DB] font-medium">Metro Masofasi</div>
          <div className="text-center font-mono text-[#111111] dark:text-[#FDFDFD] font-semibold">
            {locA.context.nearest_metro ? `${locA.context.nearest_metro.distance_meters}m` : '>800m'}
          </div>
          <div className="text-center font-mono text-[#111111] dark:text-[#FDFDFD] font-semibold">
            {locB.context.nearest_metro ? `${locB.context.nearest_metro.distance_meters}m` : '>800m'}
          </div>
        </div>

        {/* Row 6: Direct Competitors */}
        <div className="grid grid-cols-3 px-3 py-2.5 items-center">
          <div className="text-[#525854] dark:text-[#D1D5DB] font-medium">Raqobatchilar</div>
          <div className="text-center font-mono text-amber-500 font-bold">
            {locA.context.direct_competitors_count} ta
          </div>
          <div className="text-center font-mono text-amber-500 font-bold">
            {locB.context.direct_competitors_count} ta
          </div>
        </div>
      </div>

      {/* Verdict Callout */}
      <div
        className={`p-3 rounded-xl border flex items-start gap-2.5 text-[11px] leading-relaxed ${
          diffScore >= 0
            ? 'bg-[#0E9F6E]/10 border-[#0E9F6E]/30 text-[#111111] dark:text-[#E5E7EB]'
            : 'bg-indigo-500/10 border-indigo-500/30 text-[#111111] dark:text-[#E5E7EB]'
        }`}
      >
        <CheckCircle2
          className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
            diffScore >= 0 ? 'text-[#0E9F6E]' : 'text-indigo-500'
          }`}
        />
        <span>
          {diffScore >= 0 ? (
            <>
              <strong className="text-[#0E9F6E]">Lokatsiya A ({labelA})</strong> muqobil nuqtaga nisbatan{' '}
              <strong>+{diffScore.toFixed(1)} ball</strong> yuqori salohiyatga ega.
            </>
          ) : (
            <>
              <strong className="text-indigo-500">Lokatsiya B ({labelB})</strong> joriy nuqtaga nisbatan{' '}
              <strong>+{Math.abs(diffScore).toFixed(1)} ball</strong> ustunroq ko‘rsatkich qayd etdi.
            </>
          )}
        </span>
      </div>
    </div>
  );
};

export default CompareLocations;
