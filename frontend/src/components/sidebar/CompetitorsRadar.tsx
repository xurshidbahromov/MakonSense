import React from 'react';
import { ShieldAlert, Footprints, CheckCircle, Navigation, Eye, Crosshair } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

export const CompetitorsRadar: React.FC = () => {
  const {
    inspection,
    category,
    radiusMeters,
    setHighlightedPoiCoords,
    setSelectedCoords,
  } = useAnalyticsStore();
  const competitors = inspection?.context?.competitors || [];
  const count = inspection?.context?.direct_competitors_count || 0;

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
      {/* Risk Summary Banner */}
      <div className="bg-black/[0.025] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.07] rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/25">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-[#7A807C] dark:text-[#9CA3AF] tracking-wider">
              Kannibalizatsiya Indeksi
            </span>
            <div className="text-xs font-bold text-[#111111] dark:text-[#FDFDFD]">
              {count === 0
                ? 'Erkin Bozor (Monopol Ustunlik)'
                : count >= 3
                ? "Kuchli Bozor To'yinganligi"
                : "Mo'tadil Raqobat Muhiti"}
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-mono tabular-nums font-bold text-amber-500">{count}</span>
          <span className="text-[10px] text-[#7A807C] dark:text-[#9CA3AF] block -mt-1 font-medium">
            ta raqobatchi
          </span>
        </div>
      </div>

      {/* Competitors List */}
      <div className="space-y-2">
        <div className="text-[11px] font-medium text-[#525854] dark:text-[#9CA3AF] flex items-center justify-between">
          <span>
            <span className="tabular-nums">{radiusMeters}m</span> radiusdagi toifadosh obyektlar ({category}):
          </span>
          <span className="text-[10px] font-mono text-[#7A807C]">Xaritada ko‘rish</span>
        </div>

        {competitors.length === 0 ? (
          <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-dashed border-black/[0.12] dark:border-white/[0.12] rounded-xl p-5 text-center space-y-1.5">
            <CheckCircle className="w-5 h-5 text-[#0E9F6E] mx-auto" />
            <div className="text-xs font-bold text-[#111111] dark:text-[#FDFDFD]">
              To‘g‘ridan-to‘g‘ri raqobatchi aniqlanmadi
            </div>
            <p className="text-[11px] text-[#7A807C] dark:text-[#9CA3AF] leading-relaxed">
              {radiusMeters}m radiusda tanlangan toifadagi raqobatchilar yo‘q. Birinchi o‘yinchi (First-mover) ustunligi mavjud.
            </p>
          </div>
        ) : (
          competitors.map((item, idx) => {
            const urgency = getUrgencyBadge(item.distance_meters);
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
                className="bg-white dark:bg-[#161618] border border-black/[0.07] dark:border-white/[0.08] hover:border-[#0E9F6E]/50 rounded-xl p-3 flex items-center justify-between transition-colors cursor-pointer group"
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
        <strong className="text-[#0E9F6E] font-semibold block mb-0.5">
          Strategik Differentsiatsiya ({category.toUpperCase()}):
        </strong>
        {strategyByCat[category] || strategyByCat.cafe}
      </div>
    </div>
  );
};

export default CompetitorsRadar;
