import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { X, Check, ArrowRight } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

const PROBLEMS = [
  'Oylab ko\'chalarni kuzatib, odamlarni qo\'lda sanash',
  'Sub\'yektiv taxmin va "sezgi" asosida qaror qabul qilish',
  'Konsultantlarga yuzlab dollar to\'lash',
  'Raqobatchilarni noto\'g\'ri baholash — ko\'rish doirasi cheklangan',
  'Noto\'g\'ri lokatsiyadan yillik zararlar',
];

const SOLUTIONS = [
  'Soniyalarda 150,000+ ma\'lumot nuqtasi avtomatik tahlil',
  'MakonScore algoritmi: ob\'yektiv, takrorlanadigan, aniq',
  'O\'zingiz boshqaring — bir marta to\'lov, cheksiz tahlil',
  'Raqobat xaritasi: har birining masofasi va bozor bo\'shlig\'i',
  'Himoyalangan investitsiya — 94.2% qaror aniqligi',
];

const STATS = [
  { value: '94.2%', label: 'Qaror aniqligi' },
  { value: '4 hafta', label: 'Tejalgan tadqiqot vaqti' },
  { value: '500k+', label: 'Indekslanagan O\'zbekiston binosi' },
];

export const ProblemSolution: React.FC = () => {
  const { setCurrentView } = useAnalyticsStore();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="benefits"
      ref={ref}
      className="py-24 sm:py-36 bg-[#FDFDFD] dark:bg-[#111111] select-none"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 sm:mb-20"
        >
          <span className="font-mono text-xs tracking-[0.18em] uppercase text-[#A4A9A5] dark:text-[#A4A9A5]">
            Nima o'zgardi
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-[-0.03em] leading-[1.12] text-[#111111] dark:text-[#FDFDFD]">
            Subyektiv taxminlarga emas,{' '}
            <span className="text-[#A4A9A5] font-normal">
              aniq raqamlarga ishoning.
            </span>
          </h2>
        </motion.div>

        {/* Problem / Solution split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Problems */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="lg:pr-16 pb-12 lg:pb-0 lg:border-r border-black/[0.06] dark:border-white/[0.06]"
          >
            <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#A4A9A5] mb-8">
              Avvalgi usul
            </p>
            <ul className="space-y-5">
              {PROBLEMS.map((p, i) => (
                <li key={i} className="flex items-start gap-3.5">
                  <X size={15} className="mt-1 text-[#A4A9A5] flex-shrink-0" />
                  <span className="text-[16px] leading-snug text-[#A4A9A5] dark:text-[#A4A9A5]">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Solutions */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="lg:pl-16 pt-12 lg:pt-0"
          >
            <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#0E9F6E] mb-8">
              MakonSense bilan
            </p>
            <ul className="space-y-5">
              {SOLUTIONS.map((s, i) => (
                <li key={i} className="flex items-start gap-3.5">
                  <Check size={15} strokeWidth={2.5} className="mt-1 text-[#0E9F6E] flex-shrink-0" />
                  <span className="text-[16px] leading-snug text-[#111111] dark:text-[#FDFDFD] font-medium">
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Stats band */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.35 }}
          className="mt-20 pt-16 border-t border-black/[0.06] dark:border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-0"
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              className={`text-center sm:text-left ${i > 0 ? 'sm:border-l border-black/[0.06] dark:border-white/[0.06] sm:pl-12' : ''}`}
            >
              <div className="text-3xl sm:text-4xl font-bold text-[#0E9F6E] tracking-[-0.03em] tabular-nums">
                {s.value}
              </div>
              <div className="mt-2 text-sm text-[#A4A9A5] font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

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
            <span>Hozir sinab ko'ring — bepul</span>
            <ArrowRight className="w-4 h-4 text-white/80 group-hover:text-white dark:text-[#111111]/80 dark:group-hover:text-[#111111] transition-transform duration-200 ease-out group-hover:translate-x-1" />
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default ProblemSolution;
