import React from 'react';
import { Train, Magnet, Users, Building, ShieldAlert, ChevronRight } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

export const MetricsBreakdown: React.FC = () => {
  const { inspection } = useAnalyticsStore();

  const factors = inspection?.factors;
  const context = inspection?.context;

  const tScore = factors?.transit_score ?? 0;
  const aScore = factors?.anchor_score ?? 0;
  const cScore = factors?.competition_score ?? 0;
  const rScore = factors?.residential_density_score ?? 0;

  return (
    <div className="bg-[#13151D] border border-[#222735] rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Building className="w-4 h-4 text-cyan-400" />
          Fazoviy Omillar Tahlili
        </h3>
        <span className="text-[10px] text-gray-400 font-mono">Formula w_t / w_a / w_c / w_r</span>
      </div>

      {/* 1. Transit Factor */}
      <div className="bg-[#1A1E2C]/70 border border-[#222735] rounded-xl p-3.5 space-y-2 hover:border-cyan-500/30 transition-all">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Train className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white">Tranzit va Piyodalar Oqimi (T)</span>
              <span className="text-[10px] text-cyan-400 ml-2 font-mono font-medium">Vazn: 30%</span>
            </div>
          </div>
          <span className="font-mono font-bold text-cyan-400">{tScore.toFixed(1)} / 100</span>
        </div>
        <div className="w-full bg-[#11131A] h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${tScore}%` }}
          />
        </div>
        {context?.nearest_metro && (
          <div className="text-[11px] text-gray-400 flex items-center justify-between pt-1">
            <span>Yaqin metro: <strong className="text-gray-200">{context.nearest_metro.name}</strong></span>
            <span className="font-mono text-cyan-300">{context.nearest_metro.distance_meters.toFixed(0)}m</span>
          </div>
        )}
      </div>

      {/* 2. Anchor Magnets */}
      <div className="bg-[#1A1E2C]/70 border border-[#222735] rounded-xl p-3.5 space-y-2 hover:border-emerald-500/30 transition-all">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Magnet className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white">Tortish Markazlari (Anchors - A)</span>
              <span className="text-[10px] text-emerald-400 ml-2 font-mono font-medium">Vazn: 25%</span>
            </div>
          </div>
          <span className="font-mono font-bold text-emerald-400">{aScore.toFixed(1)} / 100</span>
        </div>
        <div className="w-full bg-[#11131A] h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${aScore}%` }}
          />
        </div>
        {context?.major_anchors && context.major_anchors.length > 0 ? (
          <div className="space-y-1 pt-1">
            {context.major_anchors.slice(0, 2).map((a, idx) => (
              <div key={idx} className="text-[11px] text-gray-400 flex items-center justify-between">
                <span className="truncate max-w-[200px] text-gray-300">{a.name}</span>
                <span className="font-mono text-emerald-400 text-[10px]">{a.distance_meters.toFixed(0)}m</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-gray-500">800m radiusda yirik anchorlar aniqlanmadi.</p>
        )}
      </div>

      {/* 3. Competition Density (Subtractive Factor) */}
      <div className="bg-[#1A1E2C]/70 border border-[#222735] rounded-xl p-3.5 space-y-2 hover:border-amber-500/30 transition-all">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white">Raqobat Zichligi (C)</span>
              <span className="text-[10px] text-amber-400 ml-2 font-mono font-medium">Ayiruvchi: -25%</span>
            </div>
          </div>
          <span className="font-mono font-bold text-amber-400">{cScore.toFixed(1)} / 100</span>
        </div>
        <div className="w-full bg-[#11131A] h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${cScore}%` }}
          />
        </div>
        <div className="text-[11px] text-gray-400 flex items-center justify-between pt-1">
          <span>Raqobatchilar: <strong className="text-white">{context?.direct_competitors_count ?? 0} ta</strong> (400m radius)</span>
          {context?.nearest_competitor_meters && (
            <span>Eng yaqini: <strong className="font-mono text-amber-300">{context.nearest_competitor_meters.toFixed(0)}m</strong></span>
          )}
        </div>
      </div>

      {/* 4. Residential Density */}
      <div className="bg-[#1A1E2C]/70 border border-[#222735] rounded-xl p-3.5 space-y-2 hover:border-purple-500/30 transition-all">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white">Aholi va Turar-joy Qamrovi (R)</span>
              <span className="text-[10px] text-purple-400 ml-2 font-mono font-medium">Vazn: 20%</span>
            </div>
          </div>
          <span className="font-mono font-bold text-purple-400">{rScore.toFixed(1)} / 100</span>
        </div>
        <div className="w-full bg-[#11131A] h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${rScore}%` }}
          />
        </div>
        <div className="text-[11px] text-gray-400 flex items-center justify-between pt-1">
          <span>Hisoblangan xonadonlar:</span>
          <span className="font-mono font-semibold text-purple-300">
            ~{(context?.estimated_households ?? 0).toLocaleString()} ta xonadon
          </span>
        </div>
      </div>
    </div>
  );
};
