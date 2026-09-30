import React, { useState } from 'react';
import { GitCompare, CheckCircle2 } from 'lucide-react';
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
  const { inspection } = useAnalyticsStore();
  const [selectedBenchmark, setSelectedBenchmark] = useState<BenchmarkLocation>(PRESET_BENCHMARKS[0]);

  const locAScore = inspection?.makon_score || 83.5;
  const locAMetro = inspection?.context?.nearest_metro?.distance_meters || 260;
  const locAComp = inspection?.context?.direct_competitors_count || 3;
  const locAHouse = inspection?.context?.estimated_households || 1820;

  const diffScore = locAScore - selectedBenchmark.score;

  return (
    <div className="space-y-4 select-none">
      <div className="bg-[#F8FAF9] border border-[#0C4137]/[0.08] rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#E6FBF6] text-[#0C4137] border border-[#06D6A0]/30">
            <GitCompare className="w-4 h-4 text-[#06D6A0]" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">A/B Lokatsiya Solishtiruvi</span>
            <div className="text-xs font-bold text-[#0C4137]">Ikki muqobil nuqta taqqoslanishi</div>
          </div>
        </div>
      </div>

      {/* Benchmark Selector */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-neutral-500">Taqqoslash uchun muqobil nuqta (Lokatsiya B):</label>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_BENCHMARKS.map((bm) => {
            const isSelected = selectedBenchmark.name === bm.name;
            return (
              <button
                key={bm.name}
                onClick={() => setSelectedBenchmark(bm)}
                className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                  isSelected
                    ? 'bg-[#E6FBF6] text-[#0C4137] border border-[#06D6A0]/50 shadow-sm'
                    : 'bg-white text-neutral-600 border border-[#0C4137]/[0.08] hover:text-[#0C4137]'
                }`}
              >
                <div className="truncate font-bold">{bm.name}</div>
                <div className="text-[10px] text-neutral-500 font-mono mt-0.5">Score: {bm.score}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="bg-white border border-[#0C4137]/[0.08] rounded-xl overflow-hidden text-xs shadow-sm">
        <div className="grid grid-cols-3 bg-[#F8FAF9] p-3 border-b border-[#0C4137]/[0.08] font-bold text-[#0C4137] text-[11px]">
          <div>Ko'rsatkich</div>
          <div className="text-center text-[#06D6A0]">Lokatsiya A (Faol)</div>
          <div className="text-center text-indigo-600">Lokatsiya B ({selectedBenchmark.name.split(' ')[0]})</div>
        </div>

        {/* Row 1: Score */}
        <div className="grid grid-cols-3 p-3 border-b border-[#0C4137]/[0.06] items-center">
          <div className="text-neutral-600 font-medium">MakonScore™</div>
          <div className="text-center font-mono font-bold text-[#06D6A0]">{locAScore.toFixed(1)}</div>
          <div className="text-center font-mono font-bold text-indigo-600">{selectedBenchmark.score.toFixed(1)}</div>
        </div>

        {/* Row 2: Metro */}
        <div className="grid grid-cols-3 p-3 border-b border-[#0C4137]/[0.06] items-center">
          <div className="text-neutral-600 font-medium">Metro Masofasi</div>
          <div className="text-center font-mono text-[#0C4137] font-semibold">{locAMetro.toFixed(0)}m</div>
          <div className="text-center font-mono text-[#0C4137] font-semibold">{selectedBenchmark.metroDist}m</div>
        </div>

        {/* Row 3: Competitors */}
        <div className="grid grid-cols-3 p-3 border-b border-[#0C4137]/[0.06] items-center">
          <div className="text-neutral-600 font-medium">Raqobatchilar</div>
          <div className="text-center font-mono text-amber-600 font-bold">{locAComp} ta</div>
          <div className="text-center font-mono text-amber-600 font-bold">{selectedBenchmark.competitors} ta</div>
        </div>

        {/* Row 4: Households */}
        <div className="grid grid-cols-3 p-3 items-center">
          <div className="text-neutral-600 font-medium">Xonadonlar Qamrovi</div>
          <div className="text-center font-mono text-[#0C4137] font-semibold">~{locAHouse.toLocaleString()}</div>
          <div className="text-center font-mono text-[#0C4137] font-semibold">~{selectedBenchmark.households.toLocaleString()}</div>
        </div>
      </div>

      {/* Delta Callout */}
      <div className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
        diffScore >= 0
          ? 'bg-[#E6FBF6] border-[#06D6A0]/40 text-[#0C4137]'
          : 'bg-amber-50 border-amber-200 text-amber-800'
      }`}>
        <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#06D6A0]" />
        <span>
          {diffScore >= 0
            ? `Tanlangan Lokatsiya A ${selectedBenchmark.name} ga nisbatan +${diffScore.toFixed(1)} ball yuqoriroq salohiyatga ega.`
            : `Lokatsiya B umumiy reyting bo'yicha +${Math.abs(diffScore).toFixed(1)} ball ustunlikka ega.`}
        </span>
      </div>
    </div>
  );
};

export default CompareLocations;
