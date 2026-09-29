import React from 'react';
import { MapPin, SlidersHorizontal, BarChart3, ArrowRight } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

const STEPS = [
  {
    step: '01',
    title: 'Xaritadan nuqtani belgilang',
    description:
      "Toshkentning istalgan tumanidagi ko'chani, metro bekatini yoki bo'sh turgan binoni xaritadan bosing yoki qidiruv orqali toping.",
    icon: <MapPin className="w-6 h-6 text-cyan-400" />,
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
  },
  {
    step: '02',
    title: 'Biznes toifasi va radiusni tanlang',
    description:
      "Ochmoqchi bo'lgan sohangizni (Kafe, Dorixona, Supermarket, Ta'lim, Chakana) va tahlil radiusini (300m, 500m, 800m, 1km) belgilang.",
    icon: <SlidersHorizontal className="w-6 h-6 text-emerald-400" />,
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
  },
  {
    step: '03',
    title: 'MakonScore va SWOT auditini oling',
    description:
      "Bir necha soniyada 0 dan 100 gacha integrallashgan MakonScore, raqobatchilar masofasi, 24 soatlik piyodalar trafigi va rasmiy audit oling.",
    icon: <BarChart3 className="w-6 h-6 text-purple-400" />,
    badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
  },
];

export const HowItWorks: React.FC = () => {
  const { setCurrentView } = useAnalyticsStore();

  return (
    <section id="how-it-works" className="py-20 sm:py-28 relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 font-mono">
            Qadam-baqadam Ish Jarayoni
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            3 ta oddiy qadamda to'liq fazoviy ekspertiza
          </h2>
          <p className="text-sm sm:text-base text-gray-400">
            Murakkab GIS dasturlari va oylik tadqiqotlar shart emas. MakonSense barchasini soniyalarda avtomatlashtiradi.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {STEPS.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#0C0E17]/85 border border-white/[0.08] hover:border-white/20 rounded-3xl p-7 sm:p-8 space-y-6 transition-all duration-300 shadow-xl relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black font-mono text-gray-500 group-hover:text-emerald-400 transition-colors">
                  {item.step}
                </span>
                <div className={`p-3 rounded-2xl border ${item.badgeColor}`}>
                  {item.icon}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Bar */}
        <div className="mt-14 text-center">
          <button
            onClick={() => setCurrentView('app')}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 text-sm font-bold text-white transition-all duration-200 active:scale-[0.98] group"
          >
            <span>Hozir o'zingiz sinab ko'ring</span>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
