import React, { useState } from 'react';
import { GitCompare, MapPin, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

interface BenchmarkLocation {
  name: string;
  lat: number;
  lon: number;
  score: number;
  metroDist: number;
  competitors: number;
  households: number;
}

const PRESET_BENCHMARKS: BenchmarkLocation[] = [
  { name: 'Chilonzor 9-Mavze', lat: 41.2728, lon: 69.2062, score: 79.5, metroDist: 80, competitors: 4, households: 3800 },
  { name: 'Yunusobod 4-Mavze', lat: 41.3562, lon: 69.2891, score: 74.5, metroDist: 410, competitors: 1, households: 2900 },
  { name: 'Oybek / Mirobod', lat: 41.2981, lon: 69.2783, score: 84.0, metroDist: 120, competitors: 3, households: 2400 },
  { name: 'Tashkent City', lat: 41.3142, lon: 69.2483, score: 92.0, metroDist: 380, competitors: 2, households: 4200 },
];

export const CompareLocations: React.FC = () => {
  const { inspection, selectedCoords } = useAnalyticsStore();
  const [selectedBenchmark, setSelectedBenchmark] = useState<BenchmarkLocation>(PRESET_BENCHMARKS[0]);

  const locAScore = inspection?.makon_score || 83.5;
  const locAMetro = inspection?.context?.nearest_metro?.distance_meters || 260;
  const locAComp = inspection?.context?.direct_competitors_count || 3;
  const locAHouse = inspection?.context?.estimated_households || 1820;

  const diffScore = locAScore - selectedBenchmark.score;

  return (
    <div className="space-y-4 select-none">
      <div className="bg-[#1A1E2C]/80 border border-[#222735] rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <GitCompare className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">A/B Lokatsiya Solishtiruvi</span>
            <div className="text-xs font-bold text-white">Ikki muqobil nuqta taqqoslanishi</div>
          </div>
        </div>
      </div>

      {/* Benchmark Selector */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-gray-400">Taqqoslash uchun muqobil nuqta (Lokatsiya B):</label>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_BENCHMARKS.map((bm) => {
            const isSelected = selectedBenchmark.name === bm.name;
            return (
              <button
                key={bm.name}
                onClick={() => setSelectedBenchmark(bm)}
                className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                  isSelected
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-[#161925] text-gray-400 border border-[#222735] hover:text-white'
                }`}
              >
                <div className="truncate font-semibold">{bm.name}</div>
                <div className="text-[10px] text-gray-500 font-mono mt-0.5">Score: {bm.score}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="bg-[#161925] border border-[#222735] rounded-xl overflow-hidden text-xs">
        <div className="grid grid-cols-3 bg-[#11131A] p-3 border-b border-[#222735] font-semibold text-gray-400 text-[11px]">
          <div>Ko'rsatkich</div>
          <div className="text-center text-emerald-400">Lokatsiya A (Faol)</div>
          <div className="text-center text-purple-400">Lokatsiya B ({selectedBenchmark.name.split(' ')[0]})</div>
        </div>

        {/* Row 1: Score */}
        <div className="grid grid-cols-3 p-3 border-b border-[#222735]/50 items-center">
          <div className="text-gray-300 font-medium">MakonScore™</div>
          <div className="text-center font-mono font-bold text-emerald-400">{locAScore.toFixed(1)}</div>
          <div className="text-center font-mono font-bold text-purple-400">{selectedBenchmark.score.toFixed(1)}</div>
        </div>

        {/* Row 2: Metro */}
        <div className="grid grid-cols-3 p-3 border-b border-[#222735]/50 items-center">
          <div className="text-gray-300 font-medium">Metro Masofasi</div>
          <div className="text-center font-mono text-gray-200">{locAMetro.toFixed(0)}m</div>
          <div className="text-center font-mono text-gray-200">{selectedBenchmark.metroDist}m</div>
        </div>

        {/* Row 3: Competitors */}
        <div className="grid grid-cols-3 p-3 border-b border-[#222735]/50 items-center">
          <div className="text-gray-300 font-medium">Raqobatchilar</div>
          <div className="text-center font-mono text-amber-400">{locAComp} ta</div>
          <div className="text-center font-mono text-amber-400">{selectedBenchmark.competitors} ta</div>
        </div>

        {/* Row 4: Households */}
        <div className="grid grid-cols-3 p-3 items-center">
          <div className="text-gray-300 font-medium">Xonadonlar Qamrovi</div>
          <div className="text-center font-mono text-gray-200">~{locAHouse.toLocaleString()}</div>
          <div className="text-center font-mono text-gray-200">~{selectedBenchmark.households.toLocaleString()}</div>
        </div>
      </div>

      {/* Delta Callout */}
      <div className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
        diffScore >= 0
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
      }`}>
        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        <span>
          {diffScore >= 0
            ? `Tanlangan Lokatsiya A ${selectedBenchmark.name} ga nisbatan +${diffScore.toFixed(1)} ball yuqoriroq salohiyatga ega.`
            : `Lokatsiya B umumiy reyting bo'yicha +${Math.abs(diffScore).toFixed(1)} ball ustunlikka ega.`}
        </span>
      </div>
    </div>
  );
};
