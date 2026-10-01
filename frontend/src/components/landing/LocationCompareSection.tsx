import React, { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

interface CompareLocation {
  name: string;
  district: string;
  score: number;
  grade: string;
  footTraffic: string;
  metroDist: string;
  competitors: string;
  revenue: string;
  payback: string;
  isWinner: boolean;
}

const LOC_A: CompareLocation = {
  name: 'Amir Temur Xiyoboni',
  district: 'Yunusobod / Mirobod',
  score: 94.0,
  grade: 'A-Grade',
  footTraffic: '18,400+ / kun',
  metroDist: '42 metr',
  competitors: '2 ta (350m+ erkin)',
  revenue: '$22,000 – $28,000 / oy',
  payback: '7 – 9 oy',
  isWinner: true,
};

const LOC_B: CompareLocation = {
  name: 'Chilonzor 9-Mavze',
  district: 'Chilonzor tumani',
  score: 62.3,
  grade: 'C-Grade',
  footTraffic: '6,200+ / kun',
  metroDist: '1.2 km',
  competitors: '7 ta (150m ichida)',
  revenue: '$8,000 – $12,000 / oy',
  payback: '18 – 26 oy',
  isWinner: false,
};

const ROWS: { label: string; keyA: keyof CompareLocation; keyB: keyof CompareLocation }[] = [
  { label: 'Kunlik piyodalar', keyA: 'footTraffic', keyB: 'footTraffic' },
  { label: 'Metro masofasi', keyA: 'metroDist', keyB: 'metroDist' },
  { label: 'Raqobatchilar', keyA: 'competitors', keyB: 'competitors' },
  { label: 'Daromad prognozi', keyA: 'revenue', keyB: 'revenue' },
  { label: 'Investitsiya qaytimi', keyA: 'payback', keyB: 'payback' },
];

export const LocationCompareSection: React.FC = () => {
  const { setCurrentView, setSelectedCoords } = useAnalyticsStore();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const handleLaunch = () => {
    setSelectedCoords({ latitude: 41.3123, longitude: 69.2797 });
    setCurrentView('app');
  };

  return (
    <section
      id="compare"
      ref={ref}
      className="py-24 sm:py-36 border-t border-black/[0.05] dark:border-white/[0.05] select-none"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Label + Headline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="font-mono text-xs tracking-[0.18em] uppercase text-[#A4A9A5]">
            A/B Taqqoslash
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-[-0.03em] leading-[1.12] text-[#111111] dark:text-[#FDFDFD]">
            Ikki lokatsiya.{' '}
            <span className="text-[#A4A9A5] font-normal">Bitta to'g'ri tanlov.</span>
          </h2>
          <p className="mt-5 text-base text-[#A4A9A5] max-w-xl leading-relaxed">
            MakonSense raqamlar bilan ko'rsatadi: qaysi joy ko'proq daromad keltiradi.
          </p>
        </motion.div>

        {/* Comparison grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-black/[0.08] dark:border-white/15 bg-white/45 dark:bg-[#161616]/45 backdrop-blur-2xl backdrop-saturate-[180%] rounded-3xl overflow-hidden shadow-none dark:shadow-none"
        >
          {[LOC_A, LOC_B].map((loc, colIdx) => (
            <div
              key={colIdx}
              className={`p-8 sm:p-10 ${
                colIdx === 0
                  ? 'border-b lg:border-b-0 lg:border-r border-black/[0.06] dark:border-white/10 bg-white/40 dark:bg-white/[0.03]'
                  : 'bg-white/20 dark:bg-white/[0.015]'
              }`}
            >
              {/* Location header */}
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-black/[0.05] dark:border-white/[0.05]">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-mono text-[10px] tracking-[0.14em] uppercase px-2 py-0.5 rounded-sm ${
                      loc.isWinner
                        ? 'bg-[#0E9F6E]/10 text-[#0E9F6E]'
                        : 'bg-[#A4A9A5]/10 text-[#A4A9A5]'
                    }`}>
                      {loc.grade}
                    </span>
                    {loc.isWinner && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.12em] uppercase text-[#0E9F6E]">
                        <Check size={11} strokeWidth={2.5} />
                        Tavsiya etiladi
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-[#111111] dark:text-[#FDFDFD]">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-[#A4A9A5] mt-0.5">{loc.district}</p>
                </div>
                {/* Score */}
                <div className="text-right flex-shrink-0">
                  <div className={`text-3xl font-bold tracking-[-0.03em] tabular-nums ${
                    loc.isWinner ? 'text-[#0E9F6E]' : 'text-[#A4A9A5]'
                  }`}>
                    {loc.score}
                  </div>
                  <p className="text-[10px] font-mono text-[#A4A9A5] mt-0.5">/ 100</p>
                </div>
              </div>

              {/* Score bar */}
              <div className="mt-5 mb-6">
                <div className="h-[2px] bg-black/[0.05] dark:bg-white/[0.05] rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${loc.isWinner ? 'bg-[#0E9F6E]' : 'bg-[#A4A9A5]'}`}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${loc.score}%` } : { width: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 + colIdx * 0.1, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-3">
                {ROWS.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4 py-2 border-b border-black/[0.03] dark:border-white/[0.03]">
                    <span className="text-xs text-[#A4A9A5]">{row.label}</span>
                    <span className={`text-sm font-semibold text-right ${
                      loc.isWinner ? 'text-[#111111] dark:text-[#FDFDFD]' : 'text-[#A4A9A5]'
                    }`}>
                      {String(loc[row.keyA])}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.4 }}
          className="mt-12 flex items-center gap-4"
        >
          <button
            onClick={handleLaunch}
            className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#111111] hover:bg-neutral-800 text-white dark:bg-[#FDFDFD] dark:hover:bg-neutral-200 dark:text-[#111111] text-sm font-semibold cursor-pointer transition-all duration-200 shadow-sm active:scale-[0.98]"
          >
            <span>O'z lokatsiyamni solishtirish</span>
            <ArrowRight className="w-4 h-4 text-white/80 group-hover:text-white dark:text-[#111111]/80 dark:group-hover:text-[#111111] transition-transform duration-200 ease-out group-hover:translate-x-1" />
          </button>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Bepul · Ro'yxatdan o'tish shart emas</p>
        </motion.div>

      </div>
    </section>
  );
};

export default LocationCompareSection;
