import React, { useMemo, useState } from 'react';
import {
  Layers,
  Train,
  Magnet,
  Users,
  ShieldAlert,
  Activity,
  GitCompare,
  Compass,
  Calculator,
  Sparkles,
  ArrowUpRight,
  Eye,
} from 'lucide-react';
import { useAnalyticsStore, SidebarTabKey } from '../../store/useAnalyticsStore';
import { CompetitorsRadar } from './CompetitorsRadar';
import { FootTrafficDynamics } from './FootTrafficDynamics';
import { CompareLocations } from './CompareLocations';
import { scanTopHotspots } from '../../utils/clientSpatialEngine';

export const MetricsBreakdown: React.FC = () => {
  const {
    inspection,
    category,
    radiusMeters,
    activeSidebarTab,
    setActiveSidebarTab,
    setSelectedCoords,
    setCompareCoords,
    setHighlightedPoiCoords,
  } = useAnalyticsStore();

  const [customAreaSqm, setCustomAreaSqm] = useState<number>(85);
  const [regionFilter, setRegionFilter] = useState<'all' | 'tashkent' | 'regions'>('all');

  const factors = inspection?.factors;
  const context = inspection?.context;
  const fin = context?.financials;

  const tScore = factors?.transit_score ?? 0;
  const aScore = factors?.anchor_score ?? 0;
  const cScore = factors?.competition_score ?? 0;
  const rScore = factors?.residential_density_score ?? 0;

  const hotspots = useMemo(
    () => scanTopHotspots(category, radiusMeters),
    [category, radiusMeters]
  );

  const filteredHotspots = useMemo(() => {
    if (regionFilter === 'tashkent') {
      return hotspots.filter((h) => h.region.includes('Toshkent')).slice(0, 7);
    }
    if (regionFilter === 'regions') {
      return hotspots.filter((h) => !h.region.includes('Toshkent')).slice(0, 7);
    }
    return hotspots.slice(0, 8);
  }, [hotspots, regionFilter]);

  const rentPerSqm = fin?.estimated_rent_sqm_usd || 22;
  const customMonthlyRent = Math.round(customAreaSqm * rentPerSqm);
  const avgMonthlyRev = fin
    ? Math.round((fin.monthly_revenue_min_usd + fin.monthly_revenue_max_usd) / 2)
    : 21000;
  const rentToRevRatio = Math.min(45, Math.max(4, Math.round((customMonthlyRent / avgMonthlyRev) * 100)));

  const tabs: { id: SidebarTabKey; label: string; icon: React.ReactNode }[] = [
    { id: 'factors', label: 'Omillar', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'competitors', label: 'Raqobat', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
    { id: 'traffic', label: 'Trafik', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'compare', label: 'A/B', icon: <GitCompare className="w-3.5 h-3.5" /> },
    { id: 'hotspots', label: 'Top AI', icon: <Compass className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-white dark:bg-[#141416] border border-black/[0.07] dark:border-white/[0.08] rounded-2xl p-3.5 sm:p-4 space-y-4 shadow-sm">
      {/* 5-Tab Segmented Navigation — Concentric radius: outer rounded-xl (12px) - p-1 (4px) = inner rounded-[8px] */}
      <div
        role="tablist"
        aria-label="Fazoviy tahlil bo'limlari"
        className="grid grid-cols-5 gap-1 bg-black/[0.04] dark:bg-white/[0.05] p-1 rounded-xl border border-black/[0.05] dark:border-white/[0.06] select-none"
      >
        {tabs.map((tab) => {
          const isActive = activeSidebarTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveSidebarTab(tab.id)}
              className={`press-scale flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-[8px] text-[11px] font-semibold cursor-pointer ${
                isActive
                  ? 'bg-[#111111] text-white dark:bg-white dark:text-[#111111] shadow-sm'
                  : 'text-[#6E7470] dark:text-[#9CA3AF] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              <span className={isActive ? 'text-[#0E9F6E]' : ''}>{tab.icon}</span>
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: 4 Key Spatial Factors + Live Rent & ROI Simulator */}
      {activeSidebarTab === 'factors' && (
        <div className="space-y-2.5">
          {/* 1. Transit Factor */}
          <div className="bg-black/[0.02] dark:bg-white/[0.025] border border-black/[0.06] dark:border-white/[0.07] hover:border-[#0E9F6E]/40 rounded-xl p-3 space-y-2 transition-colors">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#0E9F6E]/10 text-[#0E9F6E]">
                  <Train className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-[#111111] dark:text-[#FDFDFD]">
                    Tranzit va Piyodalar (T)
                  </span>
                  <span className="text-[10px] text-[#7A807C] ml-1.5 font-mono tabular-nums">30%</span>
                </div>
              </div>
              <span className="font-mono tabular-nums font-bold text-[#111111] dark:text-[#FDFDFD]">
                {tScore.toFixed(1)} / 100
              </span>
            </div>
            <div className="w-full bg-black/[0.08] dark:bg-white/[0.09] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0E9F6E] h-full rounded-full"
                style={{
                  width: `${tScore}%`,
                  transition: 'width 500ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            </div>
            {context?.nearest_metro && (
              <button
                type="button"
                onClick={() => {
                  if (context.nearest_metro?.lat && context.nearest_metro?.lon) {
                    setHighlightedPoiCoords({
                      latitude: context.nearest_metro.lat,
                      longitude: context.nearest_metro.lon,
                      name: context.nearest_metro.name,
                    });
                  }
                }}
                className="w-full text-[11px] text-[#525854] dark:text-[#9CA3AF] flex items-center justify-between pt-0.5 cursor-pointer hover:text-[#0E9F6E] transition-colors text-left"
              >
                <span className="flex items-center gap-1 truncate">
                  <span>Yaqin bekat:</span>
                  <strong className="text-[#111111] dark:text-[#E5E7EB] font-semibold">
                    {context.nearest_metro.name}
                  </strong>
                </span>
                <span className="font-mono tabular-nums font-bold text-[#0E9F6E] flex items-center gap-1 shrink-0">
                  {context.nearest_metro.distance_meters.toFixed(0)}m
                  <Eye className="w-3 h-3" />
                </span>
              </button>
            )}
          </div>

          {/* 2. Anchor Magnets */}
          <div className="bg-black/[0.02] dark:bg-white/[0.025] border border-black/[0.06] dark:border-white/[0.07] hover:border-[#0E9F6E]/40 rounded-xl p-3 space-y-2 transition-colors">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                  <Magnet className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-[#111111] dark:text-[#FDFDFD]">
                    Tortish Markazlari (A)
                  </span>
                  <span className="text-[10px] text-[#7A807C] ml-1.5 font-mono tabular-nums">25%</span>
                </div>
              </div>
              <span className="font-mono tabular-nums font-bold text-[#111111] dark:text-[#FDFDFD]">
                {aScore.toFixed(1)} / 100
              </span>
            </div>
            <div className="w-full bg-black/[0.08] dark:bg-white/[0.09] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full"
                style={{
                  width: `${aScore}%`,
                  transition: 'width 500ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            </div>
            {context?.major_anchors && context.major_anchors.length > 0 ? (
              <div className="space-y-1 pt-0.5">
                {context.major_anchors.slice(0, 2).map((a, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (a.lat && a.lon) {
                        setHighlightedPoiCoords({
                          latitude: a.lat,
                          longitude: a.lon,
                          name: a.name,
                        });
                      }
                    }}
                    className="w-full text-[11px] text-[#525854] dark:text-[#9CA3AF] flex items-center justify-between cursor-pointer hover:text-indigo-500 transition-colors text-left"
                  >
                    <span className="truncate max-w-[230px] text-[#111111] dark:text-[#E5E7EB] font-medium">
                      {a.name}
                    </span>
                    <span className="font-mono tabular-nums text-indigo-500 font-bold text-[10px] flex items-center gap-1">
                      {a.distance_meters.toFixed(0)}m
                      <Eye className="w-2.5 h-2.5" />
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-[#7A807C]">
                Yaqin radiusda yirik savdo/universitet magnitlari kam.
              </p>
            )}
          </div>

          {/* 3. Competition Density */}
          <div className="bg-black/[0.02] dark:bg-white/[0.025] border border-black/[0.06] dark:border-white/[0.07] hover:border-amber-500/40 rounded-xl p-3 space-y-2 transition-colors">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-[#111111] dark:text-[#FDFDFD]">
                    Raqobat Bosimi (C)
                  </span>
                  <span className="text-[10px] text-amber-500 ml-1.5 font-mono tabular-nums font-semibold">
                    -22%
                  </span>
                </div>
              </div>
              <span className="font-mono tabular-nums font-bold text-amber-500">{cScore.toFixed(1)} / 100</span>
            </div>
            <div className="w-full bg-black/[0.08] dark:bg-white/[0.09] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{
                  width: `${cScore}%`,
                  transition: 'width 500ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            </div>
            <div className="text-[11px] text-[#525854] dark:text-[#9CA3AF] flex items-center justify-between pt-0.5">
              <span>
                Toifadoshlar:{' '}
                <strong className="text-[#111111] dark:text-[#E5E7EB] tabular-nums">
                  {context?.direct_competitors_count ?? 0} ta
                </strong>{' '}
                ({radiusMeters}m)
              </span>
              {context?.nearest_competitor_meters && (
                <span>
                  Eng yaqini:{' '}
                  <strong className="font-mono tabular-nums text-amber-500 font-bold">
                    {context.nearest_competitor_meters.toFixed(0)}m
                  </strong>
                </span>
              )}
            </div>
          </div>

          {/* 4. Residential Density */}
          <div className="bg-black/[0.02] dark:bg-white/[0.025] border border-black/[0.06] dark:border-white/[0.07] hover:border-[#0E9F6E]/40 rounded-xl p-3 space-y-2 transition-colors">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#0E9F6E]/10 text-[#0E9F6E]">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-[#111111] dark:text-[#FDFDFD]">
                    Turar-joy va Aholi (R)
                  </span>
                  <span className="text-[10px] text-[#7A807C] ml-1.5 font-mono tabular-nums">23%</span>
                </div>
              </div>
              <span className="font-mono tabular-nums font-bold text-[#111111] dark:text-[#FDFDFD]">
                {rScore.toFixed(1)} / 100
              </span>
            </div>
            <div className="w-full bg-black/[0.08] dark:bg-white/[0.09] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#111111] dark:bg-[#FDFDFD] h-full rounded-full"
                style={{
                  width: `${rScore}%`,
                  transition: 'width 500ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            </div>
            <div className="text-[11px] text-[#525854] dark:text-[#9CA3AF] flex items-center justify-between pt-0.5">
              <span>Doimiy rezidentlar:</span>
              <span className="font-mono tabular-nums font-bold text-[#111111] dark:text-[#E5E7EB]">
                ~{(context?.estimated_households ?? 0).toLocaleString()} xonadon
              </span>
            </div>
          </div>

          {/* 5. Interactive Commercial Space & Rent Simulator */}
          <div className="bg-[#0E9F6E]/[0.05] dark:bg-[#0E9F6E]/[0.08] border border-[#0E9F6E]/25 rounded-xl p-3 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor="rent-area-slider"
                className="font-semibold text-[#111111] dark:text-[#FDFDFD] flex items-center gap-1.5 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5 text-[#0E9F6E]" />
                <span>Ijara va Maydon Kalkulyatori</span>
              </label>
              <span className="font-mono tabular-nums text-[11px] font-bold text-[#0E9F6E]">
                {customAreaSqm} m² · ~${rentPerSqm}/m²
              </span>
            </div>

            <input
              id="rent-area-slider"
              type="range"
              min={30}
              max={350}
              step={5}
              value={customAreaSqm}
              aria-label="Savdo maydoni kvadrat metrda"
              onChange={(e) => setCustomAreaSqm(Number(e.target.value))}
              className="w-full accent-[#0E9F6E] h-1.5 bg-black/10 dark:bg-white/15 rounded-lg cursor-pointer"
            />

            <div className="grid grid-cols-3 gap-2 pt-0.5 text-[11px] select-text">
              <div>
                <span className="text-[9px] text-[#7A807C] dark:text-[#9CA3AF] block select-none">
                  Oylik ijara
                </span>
                <span className="font-mono tabular-nums font-bold text-[#111111] dark:text-[#FDFDFD]">
                  ${customMonthlyRent.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-[#7A807C] dark:text-[#9CA3AF] block select-none">
                  Ijara / Tushum
                </span>
                <span
                  className={`font-mono tabular-nums font-bold ${
                    rentToRevRatio <= 15 ? 'text-[#0E9F6E]' : 'text-amber-500'
                  }`}
                >
                  {rentToRevRatio}% (Optimal &lt;15%)
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-[#7A807C] dark:text-[#9CA3AF] block select-none">
                  Yillik ROI
                </span>
                <span className="font-mono tabular-nums font-bold text-[#0E9F6E]">
                  ~{fin?.roi_annual_percent || 96}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Competitors Radar */}
      {activeSidebarTab === 'competitors' && <CompetitorsRadar />}

      {/* TAB 3: Foot Traffic Dynamics */}
      {activeSidebarTab === 'traffic' && <FootTrafficDynamics />}

      {/* TAB 4: A/B Location Compare */}
      {activeSidebarTab === 'compare' && <CompareLocations />}

      {/* TAB 5: AI Top Hotspots Scanner */}
      {activeSidebarTab === 'hotspots' && (
        <div className="space-y-3">
          <div className="bg-black/[0.025] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.07] rounded-xl p-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#0E9F6E]/10 text-[#0E9F6E] border border-[#0E9F6E]/25">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-[#7A807C] dark:text-[#9CA3AF] tracking-wider block">
                  AI Optimal Joylashuv Qidiruvi
                </span>
                <div className="text-xs font-bold text-[#111111] dark:text-[#FDFDFD]">
                  {category.toUpperCase()} uchun eng yuqori balli nuqtalar
                </div>
              </div>
            </div>
          </div>

          {/* Region Filter Pills */}
          <div className="flex items-center gap-1.5 select-none">
            {[
              { id: 'all', label: 'Barcha hududlar' },
              { id: 'tashkent', label: 'Toshkent sh.' },
              { id: 'regions', label: 'Viloyat markazlari' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setRegionFilter(f.id as any)}
                className={`press-scale px-2.5 py-1 rounded-full text-[10px] font-semibold cursor-pointer ${
                  regionFilter === f.id
                    ? 'bg-[#111111] text-white dark:bg-white dark:text-[#111111]'
                    : 'bg-black/[0.04] dark:bg-white/[0.05] text-[#6E7470] dark:text-[#9CA3AF]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Ranked Hotspots List */}
          <div className="space-y-2">
            {filteredHotspots.map((spot, idx) => (
              <div
                key={spot.id}
                onClick={() => setSelectedCoords(spot.coordinates)}
                className="bg-white dark:bg-[#161618] border border-black/[0.07] dark:border-white/[0.08] hover:border-[#0E9F6E]/60 rounded-xl p-3 transition-colors cursor-pointer group space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-[#0E9F6E]/15 text-[#0E9F6E] font-mono tabular-nums text-[10px] font-bold flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#111111] dark:text-[#FDFDFD] group-hover:text-[#0E9F6E] transition-colors truncate">
                        {spot.name}
                      </div>
                      <div className="text-[10px] text-[#7A807C] dark:text-[#9CA3AF] truncate">
                        {spot.district} · {spot.region}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-md bg-[#0E9F6E]/15 text-[#0E9F6E] font-mono tabular-nums text-xs font-bold">
                      {spot.score.toFixed(1)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCompareCoords(spot.coordinates);
                        setActiveSidebarTab('compare');
                      }}
                      title="B nuqta sifatida taqqoslash"
                      className="press-scale px-1.5 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 text-[9px] font-mono font-semibold cursor-pointer"
                    >
                      A/B
                    </button>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#7A807C] group-hover:text-[#0E9F6E]" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-black/[0.04] dark:border-white/[0.05] text-[#525854] dark:text-[#9CA3AF]">
                  <span className="truncate">{spot.highlightReason}</span>
                  <span className="font-mono tabular-nums font-semibold text-[#0E9F6E] shrink-0 ml-2">
                    {spot.monthlyRevenueRange}/oy
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricsBreakdown;
