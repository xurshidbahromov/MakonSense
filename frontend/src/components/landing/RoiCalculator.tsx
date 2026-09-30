import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, ArrowRight, Clock, Check } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

export const RoiCalculator: React.FC = () => {
  const { setCurrentView } = useAnalyticsStore();
  const [investment, setInvestment] = useState<number>(45000);

  const potentialLoss = Math.round(investment * 0.85);
  const timeSavedWeeks = 4;

  return (
    <section id="calculator" className="py-20 sm:py-32 select-none border-t border-[#0C4137]/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Refined Section Header */}
        <div className="max-w-4xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#E6FBF6] border border-[#06D6A0]/30 text-[#0C4137] text-xs font-mono font-semibold mb-4">
            <span className="text-[#06D6A0]">●</span>
            <span>MOLIYAVIY HIMOYALANISH (ROI)</span>
          </div>

          <h2 className="text-[clamp(1.8rem,4vw,3.8rem)] font-semibold leading-[1.08] tracking-tight">
            <span className="text-[#0C4137]">Sarmoyangizni himoyalang.</span>{' '}
            <span className="text-neutral-400">Har bir xato minglab dollarga tushishi mumkin.</span>
          </h2>

          <p className="mt-4 text-[17px] text-neutral-500 max-w-2xl leading-relaxed">
            Rejalashtirgan investitsiyangizni belgilang va MakonSense xatarlarning qanday oldini olishini ko‘ring.
          </p>
        </div>

        {/* JPRQ-Style Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4 sm:gap-6">
          {/* Left Panel: Interactive Slider & Comparison */}
          <div className="rounded-[14px] border border-[#0C4137]/[0.08] bg-[#F7F9F8] p-6 sm:p-9 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-[15px] font-semibold text-[#0C4137]">
                  Yangi nuqta ochish uchun umumiy byudjet:
                </label>
                <div className="text-4xl sm:text-5xl font-extrabold font-mono text-[#0C4137]">
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
                className="w-full h-2.5 bg-neutral-200 rounded-full appearance-none cursor-pointer accent-[#0C4137] transition-all"
              />

              <div className="flex justify-between text-xs font-mono text-neutral-400">
                <span>$15,000 (Kichik kafe)</span>
                <span>$75,000 (Do‘kon)</span>
                <span>$150,000+ (Yirik restoran)</span>
              </div>
            </div>

            {/* Comparison Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white border border-rose-200 rounded-[10px] p-5 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Xato Lokatsiya Zarari</span>
                </div>
                <div className="text-3xl font-mono font-extrabold text-rose-600">
                  -${potentialLoss.toLocaleString()}
                </div>
                <p className="text-xs text-neutral-500 pt-1 leading-snug">
                  Ta’mirlash, ijara depoziti va yopilishdagi qaytarilmas xarajatlar.
                </p>
              </div>

              <div className="bg-white border border-[#06D6A0]/40 rounded-[10px] p-5 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0C4137]">
                  <ShieldCheck className="w-4 h-4 text-[#06D6A0]" />
                  <span>Himoyalangan Sarmoya</span>
                </div>
                <div className="text-3xl font-mono font-extrabold text-[#0C4137]">
                  +${investment.toLocaleString()}
                </div>
                <p className="text-xs text-neutral-500 pt-1 leading-snug">
                  Aniq fazoviy tahlil orqali kafolatlangan va xavfsiz joy tanlash.
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Value Proof List */}
          <div className="rounded-[14px] border border-[#0C4137]/[0.08] bg-[#F7F9F8] p-6 sm:p-9 flex flex-col justify-between">
            <div>
              <div className="inline-block text-[11px] font-mono px-2.5 py-0.5 rounded-[6px] bg-[#E6FBF6] text-[#0C4137] border border-[#06D6A0]/30 font-semibold mb-3">
                MakonSense Himoyasi
              </div>

              <h3 className="text-[22px] font-semibold text-[#0C4137] tracking-tight">
                Birinchi haftadan tejang
              </h3>

              <p className="mt-2 text-[15px] text-neutral-500 leading-relaxed">
                Joy tanlashga ketadigan 3–4 haftalik ko‘cha kuzatuvini bir necha soniyaga qisqartiring.
              </p>

              <div className="my-6 h-px bg-[#0C4137]/[0.06]" />

              <ul className="space-y-3.5 text-[14px] text-[#0C4137]">
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#E6FBF6] text-[#0C4137] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#06D6A0]" />
                  </span>
                  <span>48 ta metro bekati va yo‘lovchilar soni</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#E6FBF6] text-[#0C4137] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#06D6A0]" />
                  </span>
                  <span>400m radiusdagi raqobatchilar filtri</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#E6FBF6] text-[#0C4137] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#06D6A0]" />
                  </span>
                  <span>Aholi xonadonlari va yangi massivlar</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#E6FBF6] text-[#0C4137] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#06D6A0]" />
                  </span>
                  <span>Avtomatik rasmiy 5 bo‘limli PDF audit</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <button
                onClick={() => setCurrentView('app')}
                className="w-full inline-flex items-center justify-center gap-2 font-semibold rounded-[10px] transition-all duration-150 whitespace-nowrap active:scale-[0.98] px-5 py-3 text-[15px] bg-[#0C4137] text-white hover:bg-[#072822] shadow-sm cursor-pointer"
              >
                <span>Hisoblashni Boshlash</span>
                <ArrowRight className="w-4 h-4 text-[#06D6A0]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoiCalculator;
