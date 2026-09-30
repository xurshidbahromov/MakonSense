import React, { useState } from 'react';
import { Layers, Train, Magnet, Users, ShieldAlert, Activity, GitCompare } from 'lucide-react';
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
    <div className="bg-white border border-[#0C4137]/[0.08] rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm select-none">
      {/* Apple HIG Segmented Control Tabs */}
      <div className="flex items-center gap-1 bg-[#F4F7F6] p-0.5 rounded-full border border-[#0C4137]/[0.08]">
        <button
          onClick={() => setActiveTab('factors')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-full text-xs font-semibold transition-all duration-150 ease-out active:scale-[0.96] ${
            activeTab === 'factors'
              ? 'bg-[#0C4137] text-white shadow-sm'
              : 'text-neutral-500 hover:text-[#0C4137]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="truncate">Omillar</span>
        </button>

        <button
          onClick={() => setActiveTab('competitors')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-full text-xs font-semibold transition-all duration-150 ease-out active:scale-[0.96] ${
            activeTab === 'competitors'
              ? 'bg-[#0C4137] text-white shadow-sm'
              : 'text-neutral-500 hover:text-[#0C4137]'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="truncate">Raqobat</span>
        </button>

        <button
          onClick={() => setActiveTab('traffic')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-full text-xs font-semibold transition-all duration-150 ease-out active:scale-[0.96] ${
            activeTab === 'traffic'
              ? 'bg-[#0C4137] text-white shadow-sm'
              : 'text-neutral-500 hover:text-[#0C4137]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span className="truncate">Trafik</span>
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-full text-xs font-semibold transition-all duration-150 ease-out active:scale-[0.96] ${
            activeTab === 'compare'
              ? 'bg-[#0C4137] text-white shadow-sm'
              : 'text-neutral-500 hover:text-[#0C4137]'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5" />
          <span className="truncate">A/B</span>
        </button>
      </div>

      {/* Tab Content 1: 4 Key Factors */}
      {activeTab === 'factors' && (
        <div className="space-y-3">
          {/* 1. Transit Factor (Emerald) */}
          <div className="bg-[#F8FAF9] border border-[#0C4137]/[0.08] hover:border-[#06D6A0]/50 rounded-xl p-3.5 space-y-2 transition-all">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#E6FBF6] text-[#0C4137]">
                  <Train className="w-4 h-4 text-[#06D6A0]" />
                </div>
                <div>
                  <span className="font-bold text-[#0C4137]">Tranzit & Piyodalar (T)</span>
                  <span className="text-[10px] text-neutral-400 ml-2 font-mono font-medium">Vazn: 30%</span>
                </div>
              </div>
              <span className="font-mono font-bold text-[#0C4137]">{tScore.toFixed(1)} / 100</span>
            </div>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#06D6A0] h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${tScore}%` }}
              />
            </div>
            {context?.nearest_metro && (
              <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-0.5">
                <span>Yaqin metro: <strong className="text-[#0C4137]">{context.nearest_metro.name}</strong></span>
                <span className="font-mono font-bold text-[#0C4137]">{context.nearest_metro.distance_meters.toFixed(0)}m</span>
              </div>
            )}
          </div>

          {/* 2. Anchor Magnets */}
          <div className="bg-[#F8FAF9] border border-[#0C4137]/[0.08] hover:border-[#06D6A0]/50 rounded-xl p-3.5 space-y-2 transition-all">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#E6FBF6] text-[#0C4137]">
                  <Magnet className="w-4 h-4 text-[#06D6A0]" />
                </div>
                <div>
                  <span className="font-bold text-[#0C4137]">Tortish Markazlari (Anchors - A)</span>
                  <span className="text-[10px] text-neutral-400 ml-2 font-mono font-medium">Vazn: 25%</span>
                </div>
              </div>
              <span className="font-mono font-bold text-[#0C4137]">{aScore.toFixed(1)} / 100</span>
            </div>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#05B385] h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${aScore}%` }}
              />
            </div>
            {context?.major_anchors && context.major_anchors.length > 0 ? (
              <div className="space-y-1 pt-0.5">
                {context.major_anchors.slice(0, 2).map((a, idx) => (
                  <div key={idx} className="text-[11px] text-neutral-500 flex items-center justify-between">
                    <span className="truncate max-w-[210px] text-[#0C4137] font-medium">{a.name}</span>
                    <span className="font-mono text-[#05B385] font-bold text-[10px]">{a.distance_meters.toFixed(0)}m</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-neutral-400">800m radiusda yirik anchorlar aniqlanmadi.</p>
            )}
          </div>

          {/* 3. Competition Density (Penalty) */}
          <div className="bg-[#F8FAF9] border border-[#0C4137]/[0.08] hover:border-amber-400/50 rounded-xl p-3.5 space-y-2 transition-all">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#0C4137]">Raqobat Bosimi (C)</span>
                  <span className="text-[10px] text-amber-600 ml-2 font-mono font-bold">Ayiruvchi: -25%</span>
                </div>
              </div>
              <span className="font-mono font-bold text-amber-600">{cScore.toFixed(1)} / 100</span>
            </div>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${cScore}%` }}
              />
            </div>
            <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-0.5">
              <span>Raqobatchilar: <strong className="text-[#0C4137]">{context?.direct_competitors_count ?? 0} ta</strong> (400m)</span>
              {context?.nearest_competitor_meters && (
                <span>Eng yaqini: <strong className="font-mono text-amber-600 font-bold">{context.nearest_competitor_meters.toFixed(0)}m</strong></span>
              )}
            </div>
          </div>

          {/* 4. Residential Density */}
          <div className="bg-[#F8FAF9] border border-[#0C4137]/[0.08] hover:border-[#06D6A0]/50 rounded-xl p-3.5 space-y-2 transition-all">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#E6FBF6] text-[#0C4137]">
                  <Users className="w-4 h-4 text-[#06D6A0]" />
                </div>
                <div>
                  <span className="font-bold text-[#0C4137]">Turar-joy va Aholi (R)</span>
                  <span className="text-[10px] text-neutral-400 ml-2 font-mono font-medium">Vazn: 20%</span>
                </div>
              </div>
              <span className="font-mono font-bold text-[#0C4137]">{rScore.toFixed(1)} / 100</span>
            </div>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0C4137] h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${rScore}%` }}
              />
            </div>
            <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-0.5">
              <span>Aholi qamrovi:</span>
              <span className="font-mono font-bold text-[#0C4137]">
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

export default MetricsBreakdown;
