import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

interface IndustryCase {
  id: string;
  label: string;
  location: string;
  district: string;
  score: number;
  footTraffic: string;
  competitors: string;
  revenue: string;
  peakHours: string;
  bars: { hour: string; pct: number; peak?: boolean }[];
}

const INDUSTRIES: IndustryCase[] = [
  {
    id: 'cafe',
    label: 'HoReCa',
    location: 'Amir Temur Xiyoboni',
    district: 'Yunusobod / Mirobod',
    score: 94.0,
    footTraffic: '18,400+',
    competitors: '2 ta (350m erkin)',
    revenue: '$22,000 – $28,000',
    peakHours: '12:30–14:00 & 18:00–21:00',
    bars: [
      { hour: '09', pct: 38 },
      { hour: '12', pct: 82, peak: true },
      { hour: '15', pct: 54 },
      { hour: '18', pct: 96, peak: true },
      { hour: '21', pct: 68 },
    ],
  },
  {
    id: 'retail',
    label: 'Retail',
    location: 'Chorsu Bozori yaqini',
    district: 'Eski Shahar',
    score: 88.2,
    footTraffic: '24,600+',
    competitors: '5 ta (200m+)',
    revenue: '$31,000 – $45,000',
    peakHours: '10:00–13:00 & 16:00–19:00',
    bars: [
      { hour: '09', pct: 55 },
      { hour: '12', pct: 94, peak: true },
      { hour: '15', pct: 72 },
      { hour: '18', pct: 88, peak: true },
      { hour: '21', pct: 45 },
    ],
  },
  {
    id: 'pharmacy',
    label: 'Dorixona',
    location: 'Yunusobod 5-mavze',
    district: 'Yunusobod',
    score: 79.4,
    footTraffic: '9,800+',
    competitors: '1 ta (700m)',
    revenue: '$12,000 – $18,000',
    peakHours: '09:00–12:00 & 17:00–19:00',
    bars: [
      { hour: '09', pct: 76, peak: true },
      { hour: '12', pct: 58 },
      { hour: '15', pct: 42 },
      { hour: '18', pct: 70, peak: true },
      { hour: '21', pct: 30 },
    ],
  },
  {
    id: 'realty',
    label: "Ko'chmas Mulk",
    location: 'Tashkent City',
    district: 'Mirzo Ulugbek',
    score: 91.7,
    footTraffic: '15,200+',
    competitors: '3 ta (500m+)',
    revenue: '$35,000 – $55,000',
    peakHours: '11:00–14:00 & 17:00–20:00',
    bars: [
      { hour: '09', pct: 44 },
      { hour: '12', pct: 88, peak: true },
      { hour: '15', pct: 65 },
      { hour: '18', pct: 80, peak: true },
      { hour: '21', pct: 38 },
    ],
  },
];

const METRICS = [
  { key: 'footTraffic', label: 'Kunlik trafik' },
  { key: 'competitors', label: 'Raqobatchilar' },
  { key: 'revenue', label: 'Oylik daromad prognozi' },
  { key: 'peakHours', label: 'Pik soatlar' },
] as const;

export const IndustrySolutions: React.FC = () => {
  const { setCurrentView } = useAnalyticsStore();
  const [activeId, setActiveId] = useState('cafe');

  const active = INDUSTRIES.find((i) => i.id === activeId)!;

  return (
    <section
      id="industries"
      className="py-24 sm:py-36 border-t border-black/[0.05] dark:border-white/[0.05] select-none"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Label + Headline */}
        <span className="font-mono text-xs tracking-[0.18em] uppercase text-[#A4A9A5]">
          Soha echimlari
        </span>
        <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-[-0.03em] leading-[1.12] text-[#111111] dark:text-[#FDFDFD]">
          Har qanday soha{' '}
          <span className="text-[#A4A9A5] font-normal">uchun.</span>
        </h2>

        {/* Tabs */}
        <div className="mt-12 flex gap-0 border-b border-black/[0.06] dark:border-white/[0.06]">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind.id}
              onClick={() => setActiveId(ind.id)}
              className={`relative px-5 py-3 text-sm font-semibold transition-colors duration-150 ${
                ind.id === activeId
                  ? 'text-[#111111] dark:text-[#FDFDFD]'
                  : 'text-[#A4A9A5] hover:text-[#111111] dark:hover:text-[#FDFDFD]'
              }`}
            >
              {ind.label}
              {ind.id === activeId && (
                <motion.div
                  layoutId="industry-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0E9F6E]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-12 p-8 sm:p-12 rounded-3xl bg-white/45 dark:bg-[#161616]/45 backdrop-blur-2xl backdrop-saturate-[180%] border-2 border-white/80 dark:border-white/20 shadow-none dark:shadow-none grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16"
        >
          {/* Left: metrics */}
          <div>
            {/* Location + Score */}
            <div className="flex items-start justify-between gap-4 pb-8 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div>
                <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#A4A9A5] mb-1">
                  {active.district}
                </p>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-[#FDFDFD]">
                  {active.location}
                </h3>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-4xl font-bold text-[#0E9F6E] tracking-[-0.03em] leading-none tabular-nums">
                  {active.score}
                </div>
                <p className="text-xs font-mono text-[#A4A9A5] mt-1">MakonScore</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
              {METRICS.map((m) => (
                <div key={m.key} className="py-4 flex items-center justify-between gap-4">
                  <span className="text-sm text-[#A4A9A5]">{m.label}</span>
                  <span className="text-sm font-semibold text-[#111111] dark:text-[#FDFDFD] text-right">
                    {active[m.key]}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10">
              <button
                onClick={() => setCurrentView('app')}
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#111111] hover:bg-neutral-800 text-white dark:bg-[#FDFDFD] dark:hover:bg-neutral-200 dark:text-[#111111] text-sm font-semibold cursor-pointer transition-all duration-200 shadow-sm active:scale-[0.98]"
              >
                <span>O'z lokatsiyamni tekshirish</span>
                <ArrowRight className="w-4 h-4 text-white/80 group-hover:text-white dark:text-[#111111]/80 dark:group-hover:text-[#111111] transition-transform duration-200 ease-out group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right: bar chart */}
          <div>
            <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#A4A9A5] mb-6">
              Soatlik trafik grafigi
            </p>
            <div className="flex items-end gap-3 h-40">
              {active.bars.map((bar) => (
                <div key={bar.hour} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className={`w-full rounded-t-sm transition-all duration-500 ${bar.peak ? 'bg-[#0E9F6E]' : 'bg-[#A4A9A5]/30 dark:bg-white/10'}`}
                    style={{ height: `${bar.pct}%` }}
                  />
                  <span className="text-[10px] font-mono text-[#A4A9A5]">{bar.hour}:00</span>
                </div>
              ))}
            </div>

            {/* Peak indicator */}
            <div className="mt-6 flex items-center gap-3">
              <span className="w-3 h-3 rounded-sm bg-[#0E9F6E] flex-shrink-0" />
              <span className="text-xs text-[#A4A9A5]">Pik soatlar: {active.peakHours}</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default IndustrySolutions;
