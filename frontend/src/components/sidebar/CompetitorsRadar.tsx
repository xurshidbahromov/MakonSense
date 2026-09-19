import React from 'react';
import { ShieldAlert, Footprints, AlertCircle, CheckCircle, Navigation } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

export const CompetitorsRadar: React.FC = () => {
  const { inspection, category } = useAnalyticsStore();
  const competitors = inspection?.context?.competitors || [];
  const count = inspection?.context?.direct_competitors_count || 0;

  // Compute walking minutes (approx 80m per minute)
  const getWalkingMinutes = (meters: number) => {
    const mins = Math.max(1, Math.round(meters / 80));
    return `~${mins} daqiqa`;
  };

  const getUrgencyBadge = (meters: number) => {
    if (meters < 120) {
      return { label: "Kritik Yaqinlik", color: "text-rose-400 bg-rose-500/10 border-rose-500/30" };
    }
    if (meters < 250) {
      return { label: "O'rtacha Bosim", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
    }
    return { label: "Mo''tadil Masofa", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" };
  };

  return (
    <div className="space-y-3 select-none">
      {/* Risk Summary Banner */}
      <div className="bg-[#1A1E2C]/80 border border-[#222735] rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Kannibalizatsiya Xavfi</span>
            <div className="text-xs font-bold text-white">
              {count === 0 ? "Nol Raqobat (Erkin Bozor)" : count >= 3 ? "Kuchli Bozor To'yinganligi" : "Mo''tadil Raqobat Muhiti"}
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-mono font-black text-amber-400">{count}</span>
          <span className="text-[10px] text-gray-400 block -mt-1">ta nuqta</span>
        </div>
      </div>

      {/* Competitors List */}
      <div className="space-y-2">
        <div className="text-[11px] font-semibold text-gray-400 flex items-center justify-between">
          <span>400m radiusdagi toifadosh ob'yektlar ({category}):</span>
          <span className="text-[10px] text-gray-500">Piyoda yurish vaqti</span>
        </div>

        {competitors.length === 0 ? (
          <div className="bg-[#161925]/50 border border-dashed border-[#222735] rounded-xl p-5 text-center space-y-1">
            <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto" />
            <div className="text-xs font-semibold text-gray-200">To'g'ridan-to'g'ri raqobatchi yo'q</div>
            <p className="text-[11px] text-gray-400">
              400m radiusda tanlangan toifadagi raqobatchilar aniqlanmadi. Monopol ustunlik mavjud.
            </p>
          </div>
        ) : (
          competitors.map((item, idx) => {
            const urgency = getUrgencyBadge(item.distance_meters);
            return (
              <div
                key={idx}
                className="bg-[#161925] border border-[#222735] hover:border-amber-500/30 rounded-xl p-3 flex items-center justify-between transition-all"
              >
                <div className="space-y-1 min-w-0 flex-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate">{item.name}</span>
                    {item.brand && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono border border-amber-500/20">
                        {item.brand}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Navigation className="w-2.5 h-2.5 text-cyan-400" />
                      {item.distance_meters.toFixed(0)}m
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Footprints className="w-2.5 h-2.5 text-emerald-400" />
                      {getWalkingMinutes(item.distance_meters)}
                    </span>
                  </div>
                </div>

                <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${urgency.color} whitespace-nowrap`}>
                  {urgency.label}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Differentiation Strategy Hint */}
      <div className="bg-gradient-to-r from-amber-500/5 to-transparent border-l-2 border-amber-500 p-2.5 text-[11px] text-gray-300 leading-relaxed rounded-r-lg">
        <strong className="text-amber-400">Strategik Tavsiya:</strong> Agar 200 metr ichida raqobatchi bo'lsa, qulayroq ish tartibi (24/7), o'zgacha assortiment yoki tezkor xizmat orqali bozor ulushini egallash mumkin.
      </div>
    </div>
  );
};
