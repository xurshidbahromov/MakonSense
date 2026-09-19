import React, { useState } from 'react';
import { Layers, Train, Magnet, Users, ShieldAlert, Footprints, Activity, GitCompare } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { CompetitorsRadar } from './CompetitorsRadar';
import { FootTrafficDynamics } from './FootTrafficDynamics';
import { CompareLocations } from './CompareLocations';

type TabKey = 'factors' | 'competitors' | 'traffic' | 'compare';

export const MetricsBreakdown: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('factors');
  const { inspection } = useAnalyticsStore();

  const factors = inspection?.factors;
  const context = inspection?.context;

  const tScore = factors?.transit_score ?? 0;
  const aScore = factors?.anchor_score ?? 0;
  const cScore = factors?.competition_score ?? 0;
  const rScore = factors?.residential_density_score ?? 0;

  return (
    <div className="bg-[#0D1019]/90 border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Tab Navigation Pill Header */}
      <div className="flex items-center gap-1 bg-[#131622] p-1 rounded-xl border border-white/[0.06]">
        <button
          onClick={() => setActiveTab('factors')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] ${
            activeTab === 'factors'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="truncate">Omillar</span>
        </button>

        <button
          onClick={() => setActiveTab('competitors')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] ${
            activeTab === 'competitors'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="truncate">Raqobat</span>
        </button>

        <button
          onClick={() => setActiveTab('traffic')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] ${
            activeTab === 'traffic'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span className="truncate">Trafik</span>
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] ${
            activeTab === 'compare'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5" />
          <span className="truncate">A/B</span>
        </button>
      </div>

      {/* Tab Content 1: 4 Key Factors */}
      {activeTab === 'factors' && (
        <div className="space-y-3">
          {/* 1. Transit Factor */}
          <div className="bg-[#161925] border border-[#222735] rounded-xl p-3.5 space-y-2 hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Train className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white">Tranzit & Piyodalar (T)</span>
                  <span className="text-[10px] text-cyan-400 ml-2 font-mono font-medium">Vazn: 30%</span>
                </div>
              </div>
              <span className="font-mono font-bold text-cyan-400">{tScore.toFixed(1)} / 100</span>
            </div>
            <div className="w-full bg-[#10121A] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${tScore}%` }}
              />
            </div>
            {context?.nearest_metro && (
              <div className="text-[11px] text-gray-400 flex items-center justify-between pt-0.5">
                <span>Yaqin metro: <strong className="text-gray-200">{context.nearest_metro.name}</strong></span>
                <span className="font-mono text-cyan-300">{context.nearest_metro.distance_meters.toFixed(0)}m</span>
              </div>
            )}
          </div>

          {/* 2. Anchor Magnets */}
          <div className="bg-[#161925] border border-[#222735] rounded-xl p-3.5 space-y-2 hover:border-emerald-500/40 transition-all">
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
            <div className="w-full bg-[#10121A] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${aScore}%` }}
              />
            </div>
            {context?.major_anchors && context.major_anchors.length > 0 ? (
              <div className="space-y-1 pt-0.5">
                {context.major_anchors.slice(0, 2).map((a, idx) => (
                  <div key={idx} className="text-[11px] text-gray-400 flex items-center justify-between">
                    <span className="truncate max-w-[210px] text-gray-300">{a.name}</span>
                    <span className="font-mono text-emerald-400 text-[10px]">{a.distance_meters.toFixed(0)}m</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-gray-500">800m radiusda yirik anchorlar aniqlanmadi.</p>
            )}
          </div>

          {/* 3. Competition Density */}
          <div className="bg-[#161925] border border-[#222735] rounded-xl p-3.5 space-y-2 hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white">Raqobat Bosimi (C)</span>
                  <span className="text-[10px] text-amber-400 ml-2 font-mono font-medium">Ayiruvchi: -25%</span>
                </div>
              </div>
              <span className="font-mono font-bold text-amber-400">{cScore.toFixed(1)} / 100</span>
            </div>
            <div className="w-full bg-[#10121A] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${cScore}%` }}
              />
            </div>
            <div className="text-[11px] text-gray-400 flex items-center justify-between pt-0.5">
              <span>Raqobatchilar: <strong className="text-white">{context?.direct_competitors_count ?? 0} ta</strong> (400m)</span>
              {context?.nearest_competitor_meters && (
                <span>Eng yaqini: <strong className="font-mono text-amber-300">{context.nearest_competitor_meters.toFixed(0)}m</strong></span>
              )}
            </div>
          </div>

          {/* 4. Residential Density */}
          <div className="bg-[#161925] border border-[#222735] rounded-xl p-3.5 space-y-2 hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white">Turar-joy va Aholi (R)</span>
                  <span className="text-[10px] text-purple-400 ml-2 font-mono font-medium">Vazn: 20%</span>
                </div>
              </div>
              <span className="font-mono font-bold text-purple-400">{rScore.toFixed(1)} / 100</span>
            </div>
            <div className="w-full bg-[#10121A] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${rScore}%` }}
              />
            </div>
            <div className="text-[11px] text-gray-400 flex items-center justify-between pt-0.5">
              <span>Aholi qamrovi:</span>
              <span className="font-mono font-semibold text-purple-300">
                ~{(context?.estimated_households ?? 0).toLocaleString()} ta xonadon
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Competitors Radar */}
      {activeTab === 'competitors' && <CompetitorsRadar />}

      {/* Tab Content 3: Foot Traffic Dynamics */}
      {activeTab === 'traffic' && <FootTrafficDynamics />}

      {/* Tab Content 4: Compare Locations */}
      {activeTab === 'compare' && <CompareLocations />}
    </div>
  );
};
