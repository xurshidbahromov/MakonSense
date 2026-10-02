import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowDownRight, ArrowRight } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

const STAGES = [
  {
    num: '01',
    label: 'Piyodalar Tranziti',
    stat: '18,400+',
    statUnit: 'kunlik oqim',
    description:
      'Izoxrona xaritalar orqali metro va avtobusdan piyoda yetib borish doirasidagi real piyodalar oqimini ko\'rasiz. 5 va 10 daqiqalik zonalar aniq hisoblanadi.',
    detail: 'Amir Temur metro bekatidan 42 metr masofada',
  },
  {
    num: '02',
    label: 'Raqobat Tahlili',
    stat: '2 ta',
    statUnit: 'raqobatchi (350m erkin bufer)',
    description:
      'Barcha raqobatchilar xaritada ko\'rsatiladi: masofasi, toifasi va ta\'sir radiusi. Bozor bo\'shlig\'i va yuqori konversiyali "kamchil zona" darhol aniqlanadi.',
    detail: 'Yaqin 500m da 14 ta yirik ofis markazi mavjud',
  },
  {
    num: '03',
    label: 'Daromad Prognozi',
    stat: '94.0',
    statUnit: 'MakonScore / 100',
    description:
      'Barcha omillar integrallashib MakonScore beradi. Oylik daromad oralig\'i va investitsiyani qoplash muddati — barchasi avtomatik hisoblanadi.',
    detail: '$22,000 – $28,000 / oy prognoz daromadi',
  },
];

export const ScrollExperience: React.FC = () => {
  const { setCurrentView } = useAnalyticsStore();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      id="features"
      ref={ref}
      className="py-24 sm:py-36 border-t border-black/[0.05] dark:border-white/[0.05] select-none"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 sm:mb-20"
        >
          <span className="font-mono text-xs tracking-[0.18em] uppercase text-[#A4A9A5]">
            Fazoviy Razvedka
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-[-0.03em] leading-[1.12] text-[#111111] dark:text-[#FDFDFD]">
            Uch qatlam tahlil.{' '}
            <span className="text-[#A4A9A5] font-normal">Bir hisobot.</span>
          </h2>
        </motion.div>

        {/* Stages in Glass Panel */}
        <div className="rounded-3xl bg-white/45 dark:bg-[#161616]/45 backdrop-blur-2xl backdrop-saturate-[180%] border-2 border-white/80 dark:border-white/[0.05] p-6 sm:p-10 divide-y divide-black/[0.05] dark:divide-white/[0.07] shadow-none dark:shadow-none">
          {STAGES.map((stage, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + idx * 0.12 }}
              className="py-8 first:pt-2 last:pb-2 grid grid-cols-1 lg:grid-cols-[100px_1fr_280px] gap-6 lg:gap-12 items-start"
            >
              {/* Ghost number */}
              <div className="hidden lg:block">
                <span className="text-6xl font-bold text-[#111111]/[0.08] dark:text-white/[0.08] leading-none tracking-tight select-none">
                  {stage.num}
                </span>
              </div>

              {/* Main content */}
              <div>
                <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#0E9F6E] mb-3">
                  {stage.label}
                </p>
                <p className="text-[15.5px] sm:text-[16px] leading-relaxed text-neutral-600 dark:text-neutral-300 max-w-lg">
                  {stage.description}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                  <ArrowDownRight size={13} className="text-[#0E9F6E] flex-shrink-0" />
                  <span>{stage.detail}</span>
                </div>
              </div>

              {/* Stat */}
              <div className="lg:text-right">
                <div className="text-3xl sm:text-4xl font-bold text-[#111111] dark:text-[#FDFDFD] tracking-[-0.03em] leading-none tabular-nums">
                  {stage.stat}
                </div>
                <p className="mt-2 text-xs font-mono text-[#A4A9A5]">
                  {stage.statUnit}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.55 }}
          className="mt-14"
        >
          <button
            onClick={() => setCurrentView('app')}
            className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#111111] hover:bg-neutral-800 text-white dark:bg-[#FDFDFD] dark:hover:bg-neutral-200 dark:text-[#111111] text-sm font-semibold cursor-pointer transition-all duration-200 shadow-sm active:scale-[0.98]"
          >
            <span>Tahlilni boshlash</span>
            <ArrowRight className="w-4 h-4 text-white/80 group-hover:text-white dark:text-[#111111]/80 dark:group-hover:text-[#111111] transition-transform duration-200 ease-out group-hover:translate-x-1" />
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default ScrollExperience;
