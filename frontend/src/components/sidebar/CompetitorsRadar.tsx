import React, { useMemo } from 'react';
import {
  ShieldAlert,
  Footprints,
  CheckCircle,
  Navigation,
  Eye,
  Crosshair,
  PieChart,
  Compass,
  ArrowUpRight,
} from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import {
  calculateHuffMarketShare,
  scanLocalWhiteSpaceVectors,
} from '../../utils/spatialIntelligenceModels';

export const CompetitorsRadar: React.FC = () => {
  const {
    inspection,
    category,
    radiusMeters,
    selectedCoords,
    setHighlightedPoiCoords,
    setSelectedCoords,
  } = useAnalyticsStore();

  const competitors = inspection?.context?.competitors || [];
  const count = inspection?.context?.direct_competitors_count || 0;

  // 1. Huff Retail Gravity Model (Market Share & Cannibalization)
  const huffModel = useMemo(
    () => calculateHuffMarketShare(inspection),
    [inspection]
  );

  // 2. Micro-Grid White-Space ("Bo'sh Bozor") Scanner within 240m–440m
  const whiteSpaceZones = useMemo(
    () =>
      scanLocalWhiteSpaceVectors(
        selectedCoords,
        inspection.makon_score,
        category,
        radiusMeters
      ),
    [
      selectedCoords.latitude,
      selectedCoords.longitude,
      inspection.makon_score,
      category,
      radiusMeters,
    ]
  );

  const getWalkingMinutes = (meters: number) => {
    const mins = Math.max(1, Math.round(meters / 80));
    return `~${mins} daq`;
  };

  const getUrgencyBadge = (meters: number) => {
    if (meters < 130) {
      return {
        label: 'Kritik Yaqinlik',
        color:
          'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/25',
      };
    }
    if (meters < 280) {
      return {
        label: "O'rtacha Bosim",
        color:
          'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/25',
      };
    }
    return {
      label: "Mo'tadil Masofa",
      color: 'text-[#0E9F6E] bg-[#0E9F6E]/10 border-[#0E9F6E]/25',
    };
  };

  const strategyByCat: Record<string, string> = {
    cafe: "Kafe va HoReCa uchun: ertalabki kofe-setlar, tezkor takeaway darchasi va qulay o'tirish zonasi orqali yaqin raqobatchilardan oqimni tortib olish mumkin.",
    pharmacy: "Dorixona uchun: 24/7 navbatchi ish rejimi, onlayn buyurtma-yetkazib berish va kengaytirilgan dori-darmon assortimenti asosiy ustunlik beradi.",
    supermarket: "Supermarket uchun: yangi pishiriqlar (bakery), tayyor ovqat burchagi va kechki ekspress kassa navbatlarini qisqartirish konversiyani 18–25% ga oshiradi.",
    retail: "Chakana savdo uchun: vitrina yoritilishi, muddatli to'lov (BNPL / Nasiya) integratsiyasi va omnichannel (Instagram/Telegram) savdo muhim.",
    school: "Ta'lim markazi uchun: bepul sinov darsi, ota-onalar uchun kutish hududi va metro/bekatdan xavfsiz piyoda yo'lak asosiy tanlov omili hisoblanadi.",
  };

  return (
    <div className="space-y-3">
      {/* 1. Huff Gravity Model & Market Share Banner */}
      <div className="spatial-glass-subcard rounded-2xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#0E9F6E]/10 text-[#0E9F6E] border border-[#0E9F6E]/25">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-[#7A807C] dark:text-[#9CA3AF] tracking-wider block">
                Huff Gravitatsiya Modeli
              </span>
              <div className="text-xs font-bold text-[#111111] dark:text-[#FDFDFD]">
                {huffModel.saturationLabel}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-base font-mono tabular-nums font-bold text-[#0E9F6E]">
              {huffModel.marketSharePercent}%
            </span>
            <span className="text-[9px] text-[#7A807C] dark:text-[#9CA3AF] block -mt-0.5 font-medium">
              bozor ulushi
            </span>
          </div>
        </div>

        {/* Dual Share Bar: Proposed Point vs Existing Competitors */}
        <div className="space-y-1">
          <div className="w-full h-2 rounded-full bg-amber-500/25 overflow-hidden flex">
            <div
              className="bg-[#0E9F6E] h-full rounded-l-full transition-all duration-500"
              style={{ width: `${huffModel.marketSharePercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#6E7470] dark:text-[#9CA3AF] font-mono tabular-nums">
            <span className="text-[#0E9F6E] font-semibold">
              Sizning ulushingiz: ~{huffModel.marketSharePercent}%
            </span>
            <span className="text-amber-600 dark:text-amber-400">
              Kannibalizatsiya xavfi: {huffModel.cannibalizationRiskPercent}% ({count} ta raqobatchi)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Micro-Grid "Bo'sh Bozor" (White-Space) Optimizer */}
      {whiteSpaceZones.length > 0 && (
        <div className="spatial-glass-subcard rounded-2xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#0E9F6E] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Yaqin Atrofdagi "Bo‘sh Bozor" Radari (240–440m)</span>
            </span>
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {whiteSpaceZones.slice(0, 2).map((ws) => (
              <button
                key={ws.id}
                type="button"
                onClick={() => setSelectedCoords(ws.coordinates)}
                className="press-scale w-full text-left px-2.5 py-2 rounded-xl bg-white/50 dark:bg-white/[0.04] hover:bg-[#0E9F6E]/10 border border-black/[0.05] dark:border-white/[0.07] hover:border-[#0E9F6E]/40 flex items-center justify-between gap-2 transition-colors cursor-pointer group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#111111] dark:text-[#FDFDFD] group-hover:text-[#0E9F6E]">
                    <span>
                      {ws.directionLabel}ga {ws.distanceMeters}m
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/[0.04] dark:bg-white/[0.07] text-[#6E7470] dark:text-[#9CA3AF]">
                      {ws.competitorsCount} raqobatchi
                    </span>
                  </div>
                  <div className="text-[10px] text-[#7A807C] dark:text-[#9CA3AF] truncate">
                    {ws.reason}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="font-mono tabular-nums text-xs font-bold text-[#0E9F6E]">
                    {ws.score.toFixed(1)}
                  </span>
                  {ws.scoreDelta > 0 && (
                    <span className="text-[10px] font-mono tabular-nums font-bold px-1.5 py-0.5 rounded bg-[#0E9F6E]/15 text-[#0E9F6E]">
                      +{ws.scoreDelta}
                    </span>
                  )}
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#7A807C] group-hover:text-[#0E9F6E]" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Discovered Real Competitors List */}
      <div className="space-y-2">
        <div className="text-[11px] font-medium text-[#525854] dark:text-[#9CA3AF] flex items-center justify-between">
          <span>
            <span className="tabular-nums">{radiusMeters}m</span> radiusdagi real raqobatchilar ({count} ta):
          </span>
          <span className="text-[10px] font-mono text-[#7A807C]">Xaritada ko‘rish</span>
        </div>

        {competitors.length === 0 ? (
          <div className="spatial-glass-subcard border-dashed rounded-2xl p-5 text-center space-y-1.5">
            <CheckCircle className="w-5 h-5 text-[#0E9F6E] mx-auto" />
            <div className="text-xs font-bold text-[#111111] dark:text-[#FDFDFD]">
              To‘g‘ridan-to‘g‘ri raqobatchi aniqlanmadi
            </div>
            <p className="text-[11px] text-[#7A807C] dark:text-[#9CA3AF] leading-relaxed">
              {radiusMeters}m radiusda tanlangan toifadagi raqobatchilar yo‘q. Birinchi o‘yinchi (First-mover) ustunligi mavjud (~92% bozor ulushi).
            </p>
          </div>
        ) : (
          competitors.map((item, idx) => {
            const urgency = getUrgencyBadge(item.distance_meters);
            const huffComp = huffModel.competitorWeights[idx];
            return (
              <div
                key={idx}
                onClick={() => {
                  if (item.lat && item.lon) {
                    setHighlightedPoiCoords({
                      latitude: item.lat,
                      longitude: item.lon,
                      name: item.name,
                    });
                  }
                }}
                className="spatial-glass-subcard hover:border-[#0E9F6E]/50 rounded-2xl p-3 flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="space-y-1 min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#111111] dark:text-[#FDFDFD] group-hover:text-[#0E9F6E] transition-colors truncate select-text">
                      {item.name}
                    </span>
                    {item.brand && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono border border-amber-500/25 shrink-0">
                        {item.brand}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#7A807C] dark:text-[#9CA3AF]">
                    <span className="flex items-center gap-1 font-mono tabular-nums font-semibold text-[#111111] dark:text-[#E5E7EB]">
                      <Navigation className="w-2.5 h-2.5 text-[#0E9F6E]" />
                      {item.distance_meters.toFixed(0)}m
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 tabular-nums">
                      <Footprints className="w-2.5 h-2.5 text-[#0E9F6E]" />
                      {getWalkingMinutes(item.distance_meters)}
                    </span>
                    {huffComp && (
                      <>
                        <span>•</span>
                        <span className="font-mono tabular-nums text-amber-600 dark:text-amber-400 font-semibold">
                          ~{huffComp.estimatedSharePercent}% ulush
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 select-none">
                  <div
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${urgency.color} whitespace-nowrap`}
                  >
                    {urgency.label}
                  </div>
                  {item.lat && item.lon && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCoords({ latitude: item.lat!, longitude: item.lon! });
                      }}
                      aria-label="Shu nuqtani markaz sifatida tahlil qilish"
                      title="Shu nuqtani markaz sifatida tahlil qilish"
                      className="press-scale p-1.5 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] hover:bg-[#0E9F6E]/15 text-[#7A807C] hover:text-[#0E9F6E] transition-colors cursor-pointer"
                    >
                      <Crosshair className="w-3 h-3" />
                    </button>
                  )}
                  <Eye className="w-3.5 h-3.5 text-[#7A807C] group-hover:text-[#0E9F6E] transition-colors" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Category-Specific Differentiation Strategy */}
      <div className="bg-[#0E9F6E]/[0.07] dark:bg-[#0E9F6E]/[0.1] border-l-2 border-[#0E9F6E] p-3 text-[11px] text-[#111111] dark:text-[#E5E7EB] leading-relaxed rounded-r-xl select-text">
        <strong className="text-[#0E9F6E] font-semibold block mb-0.5 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Strategik Differentsiatsiya ({category.toUpperCase()}):</span>
        </strong>
        {strategyByCat[category] || strategyByCat.cafe}
      </div>
    </div>
  );
};

export default CompetitorsRadar;
