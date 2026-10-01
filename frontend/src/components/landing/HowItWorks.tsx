import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

const STEPS = [
  {
    step: '01',
    tag: 'Tanlash',
    title: "Xaritadan nuqta belgilang",
    description:
      "Toshkentning istalgan ko'chasi, metro bekati yoki bo'sh turgan binoni xaritadan bosing yoki qidiruv orqali toping.",
  },
  {
    step: '02',
    tag: 'Parametrlar',
    title: "Toifa va radiusni tanlang",
    description:
      "Ochmoqchi bo'lgan sohangiz (Kafe, Dorixona, Supermarket, Ta'lim, Retail) va tahlil radiusini (300m → 1km) belgilang.",
  },
  {
    step: '03',
    tag: 'Natija',
    title: "MakonScore va PDF Audit",
    description:
      "Bir necha soniyada 0–100 gacha integrallashgan MakonScore, raqobatchilar masofasi, 24 soatlik piyodalar trafigi va professional audit oling.",
  },
];

export const HowItWorks: React.FC = () => {
  const { setCurrentView } = useAnalyticsStore();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="py-24 sm:py-36 bg-[#FDFDFD] dark:bg-[#111111] border-t border-black/[0.05] dark:border-white/[0.05] select-none"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Label + Headline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono text-xs tracking-[0.18em] uppercase text-[#A4A9A5]">
            Jarayon
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-[-0.03em] leading-[1.12] text-[#111111] dark:text-[#FDFDFD]">
            3 qadam.{' '}
            <span className="text-[#A4A9A5] font-normal">To'liq ekspertiza.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#A4A9A5] max-w-xl leading-relaxed">
            Murakkab GIS dasturlar va oylik tadqiqotlar shart emas.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="mt-16 space-y-0">
          {STEPS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.12 + idx * 0.1 }}
              className="border-t border-black/[0.06] dark:border-white/[0.06] py-10 grid grid-cols-1 lg:grid-cols-[180px_1fr_auto] gap-6 lg:gap-12 items-start"
            >
              {/* Step number */}
              <div className="flex items-center gap-4 lg:block">
                <span className="text-5xl lg:text-7xl font-bold text-[#111111]/[0.08] dark:text-white/[0.08] leading-none tracking-tight select-none">
                  {item.step}
                </span>
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#0E9F6E] bg-[#0E9F6E]/[0.1] px-2 py-0.5 rounded-sm">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-[#FDFDFD] leading-snug mb-3">
                  {item.title}
                </h3>
                <p className="text-[15px] sm:text-[15.5px] text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-lg">
                  {item.description}
                </p>
              </div>

              {/* Index indicator */}
              <div className="hidden lg:flex items-center justify-end">
                <span className="text-xs font-mono text-[#A4A9A5]">
                  {idx + 1} / {STEPS.length}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Last border */}
          <div className="border-t border-black/[0.06] dark:border-white/[0.06]" />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.5 }}
          className="mt-14"
        >
          <button
            onClick={() => setCurrentView('app')}
            className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#111111] hover:bg-neutral-800 text-white dark:bg-[#FDFDFD] dark:hover:bg-neutral-200 dark:text-[#111111] text-sm font-semibold cursor-pointer transition-all duration-200 shadow-sm active:scale-[0.98]"
          >
            <span>Hozir boshlang</span>
            <ArrowRight className="w-4 h-4 text-white/80 group-hover:text-white dark:text-[#111111]/80 dark:group-hover:text-[#111111] transition-transform duration-200 ease-out group-hover:translate-x-1" />
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default HowItWorks;
