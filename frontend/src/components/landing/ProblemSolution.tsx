import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { X, Check, ArrowRight, ShieldCheck, Clock, Building2 } from 'lucide-react';
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
  {
    icon: Building2,
    tag: 'Qamrov',
    value: '500,000+',
    label: 'Indekslangan bino',
    subtext: 'O\'zbekiston bo\'ylab 14 ta hudud',
  },
  {
    icon: Clock,
    tag: 'Tezlik',
    value: '4 hafta',
    label: 'Tejalgan vaqt',
    subtext: 'Qo\'lda kuzatish va sanash o\'rniga',
  },
  {
    icon: ShieldCheck,
    tag: 'Aniqlik',
    value: '94.2%',
    label: 'Qaror aniqligi',
    subtext: 'Fazoviy AI va tahlil modeli',
  },
];

export const ProblemSolution: React.FC = () => {
  const { setCurrentView } = useAnalyticsStore();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="benefits"
      ref={ref}
      className="py-24 sm:py-36 select-none"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problems */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="p-8 sm:p-10 rounded-3xl bg-white/45 dark:bg-[#161616]/45 backdrop-blur-2xl backdrop-saturate-[180%] border-2 border-white/80 dark:border-white/[0.05] shadow-none dark:shadow-none"
          >
            <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#A4A9A5] mb-8">
              Avvalgi usul
            </p>
            <ul className="space-y-5">
              {PROBLEMS.map((p, i) => (
                <li key={i} className="flex items-start gap-3.5">
                  <X size={15} className="mt-1 text-[#A4A9A5] flex-shrink-0" />
                  <span className="text-[15.5px] leading-snug text-neutral-500 dark:text-neutral-400">
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
            className="p-8 sm:p-10 rounded-3xl bg-white/45 dark:bg-[#161616]/45 backdrop-blur-2xl backdrop-saturate-[180%] border-2 border-white/80 dark:border-white/[0.05] shadow-none dark:shadow-none"
          >
            <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#0E9F6E] mb-8 font-semibold">
              MakonSense bilan
            </p>
            <ul className="space-y-5">
              {SOLUTIONS.map((s, i) => (
                <li key={i} className="flex items-start gap-3.5">
                  <Check size={15} strokeWidth={2.5} className="mt-1 text-[#0E9F6E] flex-shrink-0" />
                  <span className="text-[15.5px] leading-snug text-[#111111] dark:text-[#FDFDFD] font-medium">
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
          className="mt-12 rounded-3xl bg-white/45 dark:bg-[#161616]/45 backdrop-blur-2xl backdrop-saturate-[180%] border-2 border-white/80 dark:border-white/[0.05] overflow-hidden shadow-none dark:shadow-none"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/[0.07] dark:divide-white/10">
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="p-8 sm:p-10 flex flex-col items-center text-center justify-center transition-colors duration-200 hover:bg-black/[0.015] dark:hover:bg-white/[0.02]"
                >
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E9F6E]/[0.08] text-[#0E9F6E] mb-4">
                    <Icon size={13} strokeWidth={2.2} />
                    <span className="font-mono text-[10.5px] uppercase tracking-wider font-semibold">
                      {s.tag}
                    </span>
                  </div>

                  <div className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#111111] dark:text-[#FDFDFD] tracking-[-0.03em] tabular-nums leading-none mb-2.5">
                    {s.value}
                  </div>

                  <div className="text-[15px] font-semibold text-[#111111] dark:text-[#FDFDFD]">
                    {s.label}
                  </div>

                  <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                    {s.subtext}
                  </div>
                </div>
              );
            })}
          </div>
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
