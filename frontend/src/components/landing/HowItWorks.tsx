import React from 'react';
import { MapPin, SlidersHorizontal, BarChart3, ArrowRight } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

const STEPS = [
  {
    step: '01',
    title: 'Xaritadan nuqtani belgilang',
    description:
      'Toshkentning istalgan tumanidagi ko‘chani, metro bekatini yoki bo‘sh turgan binoni xaritadan bosing yoki qidiruv orqali toping.',
    tag: 'Tanlash',
  },
  {
    step: '02',
    title: 'Biznes toifasi va radiusni tanlang',
    description:
      'Ochmoqchi bo‘lgan sohangizni (Kafe, Dorixona, Supermarket, Ta’lim, Chakana) va tahlil radiusini (300m, 500m, 800m, 1km) belgilang.',
    tag: 'Parametrlar',
  },
  {
    step: '03',
    title: 'MakonScore va SWOT auditini oling',
    description:
      'Bir necha soniyada 0 dan 100 gacha integrallashgan MakonScore, raqobatchilar masofasi, 24 soatlik piyodalar trafigi va rasmiy audit oling.',
    tag: 'Natija',
  },
];

export const HowItWorks: React.FC = () => {
  const { setCurrentView } = useAnalyticsStore();

  return (
    <section id="how-it-works" className="py-20 sm:py-32 select-none border-t border-[#0C4137]/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#E6FBF6] border border-[#06D6A0]/30 text-[#0C4137] text-xs font-mono font-semibold mb-4">
            <span className="text-[#06D6A0]">●</span>
            <span>3 BOSQICHLI ISHLASH TARTIBI</span>
          </div>

          <h2 className="text-[clamp(1.8rem,4vw,3.8rem)] font-semibold leading-[1.08] tracking-tight">
            <span className="text-[#0C4137]">3 ta oddiy qadam.</span>{' '}
            <span className="text-neutral-400">To‘liq fazoviy ekspertiza.</span>
          </h2>

          <p className="mt-4 text-[17px] text-neutral-500 max-w-2xl leading-relaxed">
            Murakkab GIS dasturlari va oylik tadqiqotlar shart emas. MakonSense barchasini soniyalarda avtomatlashtiradi.
          </p>
        </div>

        {/* 3 Step Cards Grid — JPRQ Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {STEPS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-[14px] border border-[#0C4137]/[0.08] bg-[#F7F9F8] p-7 sm:p-8 flex flex-col justify-between hover:border-[#06D6A0]/40 hover:bg-white transition-all duration-150"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[#0C4137]/[0.06]">
                  <span className="text-3xl font-extrabold font-mono text-[#0C4137]">
                    {item.step}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-[6px] bg-[#E6FBF6] text-[#0C4137] border border-[#06D6A0]/30 font-semibold">
                    {item.tag}
                  </span>
                </div>

                <div className="pt-6">
                  <h3 className="text-[19px] font-semibold text-[#0C4137] tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] text-neutral-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-12">
          <button
            onClick={() => setCurrentView('app')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] bg-[#0C4137] hover:bg-[#072822] text-white text-[15px] font-semibold transition-all duration-150 active:scale-[0.98] shadow-sm group cursor-pointer"
          >
            <span>Hozir o‘zingiz sinab ko‘ring</span>
            <ArrowRight className="w-4 h-4 text-[#06D6A0] group-hover:translate-x-0.5 transition-transform duration-150" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
