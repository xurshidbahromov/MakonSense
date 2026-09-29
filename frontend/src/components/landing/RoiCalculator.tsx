import React, { useState } from 'react';
import { Calculator, DollarSign, ShieldAlert, ShieldCheck, ArrowRight, Clock, Percent } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

export const RoiCalculator: React.FC = () => {
  const { setCurrentView } = useAnalyticsStore();
  const [investment, setInvestment] = useState<number>(45000);

  // Estimates based on commercial retail benchmarks in Tashkent
  const potentialLoss = Math.round(investment * 0.85); // 85% of capital lost on bad site closure
  const timeSavedWeeks = 4; // Average weeks spent scouting manually

  return (
    <section id="calculator" className="py-20 sm:py-28 relative border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 font-mono">
            Moliyaviy Xavf Kalkulyatori
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Noto'g'ri lokatsiya sizga qanchaga tushishi mumkin?
          </h2>
          <p className="text-sm sm:text-base text-gray-400">
            Rejalashtirgan investitsiyangizni belgilang va MakonSense xatarlarni qanday oldini olishini hisoblab ko'ring.
          </p>
        </div>

        {/* Interactive Calculator Box */}
        <div className="bg-[#0B0D15]/90 border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-8">
          {/* Subtle Ambient Light */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Slider Area */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs sm:text-sm font-semibold text-gray-300">
                Yangi nuqta ochish uchun mo'ljallangan umumiy byudjet (AQSH dollari):
              </label>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                ${investment.toLocaleString()}
              </div>
            </div>

            <input
              type="range"
              min={15000}
              max={150000}
              step={5000}
              value={investment}
              onChange={(e) => setInvestment(Number(e.target.value))}
              className="w-full h-2.5 bg-[#1B1E2C] rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />

            <div className="flex justify-between text-[11px] font-mono text-gray-400">
              <span>$15,000 (Kichik kiosk/kafe)</span>
              <span>$75,000 (O'rtacha do'kon)</span>
              <span>$150,000+ (Yirik restoran/supermarket)</span>
            </div>
          </div>

          {/* Result Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Card 1: Xato nuqtadagi ehtimoliy zarar */}
            <div className="bg-[#141117] border border-rose-500/25 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>Ehtimoliy Xato Zarari</span>
              </div>
              <div className="text-2xl font-black font-mono text-rose-400">
                -${potentialLoss.toLocaleString()}
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Ijara depoziti, ta'mirlash va do'kon yopilishidagi qaytmas xarajatlar.
              </p>
            </div>

            {/* Card 2: Tejab qolinadigan sarmoya */}
            <div className="bg-[#0C1517] border border-emerald-500/30 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Himoyalangan Mablag'</span>
              </div>
              <div className="text-2xl font-black font-mono text-emerald-400">
                +${investment.toLocaleString()}
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Aniq spatial tahlil orqali kafolatlangan va maqsadli joy tanlash.
              </p>
            </div>

            {/* Card 3: Tejalgan vaqt va tezlik */}
            <div className="bg-[#121422] border border-cyan-500/25 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                <Clock className="w-4 h-4" />
                <span>Tejalgan Vaqt</span>
              </div>
              <div className="text-2xl font-black font-mono text-cyan-400">
                ~{timeSavedWeeks} hafta
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Haftalab shahar aylanib odam sanash o'rniga bir zumda ilmiy natija.
              </p>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-300">
              <strong className="text-white">Xulosa:</strong> Sarmoyangizni xavf ostiga qo'yishdan oldin uning salohiyatini tekshirib oling.
            </div>
            <button
              onClick={() => setCurrentView('app')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 hover:from-emerald-400 hover:to-teal-300 active:scale-[0.98] transition-all"
            >
              <span>Ushbu Sarmoyani Xaritada Himoyalash</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoiCalculator;
