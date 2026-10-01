import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Users,
  TrendingUp,
  Compass,
  Store,
  Sparkles,
  Coffee,
  ShoppingBag,
  Pill,
  Building2,
} from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

interface IndustryCase {
  id: string;
  label: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  location: string;
  district: string;
  score: number;
  scoreVerdict: string;
  footTraffic: string;
  trafficSub: string;
  competitors: string;
  competitorsSub: string;
  revenue: string;
  revenueSub: string;
  format: string;
  formatSub: string;
  peakHours: string;
  bars: { hour: string; pct: number; peak?: boolean }[];
}

const INDUSTRIES: IndustryCase[] = [
  {
    id: 'cafe',
    label: 'HoReCa',
    badge: 'Kafe & Restoranlar',
    icon: Coffee,
    location: 'Amir Temur Xiyoboni',
    district: 'Yunusobod / Mirobod tumani',
    score: 94.0,
    scoreVerdict: 'Yuqori salohiyatli zona',
    footTraffic: '18,400+',
    trafficSub: 'Piyodalar tranziti / kun',
    competitors: '2 ta',
    competitorsSub: '350m radiusda erkin bozor',
    revenue: '$22,000 – $28,000',
    revenueSub: 'Kutilayotgan oylik aylanma',
    format: 'Specialty Coffee & Lounge',
    formatSub: 'Optimal biznes modeli',
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
    badge: 'Supermarket & Savdo',
    icon: ShoppingBag,
    location: 'Chorsu Bozori yaqini',
    district: 'Eski Shahar / Shayxontohur',
    score: 88.2,
    scoreVerdict: 'Katta savdo aylanmasi',
    footTraffic: '24,600+',
    trafficSub: 'Yuqori xarid quvvati / kun',
    competitors: '5 ta',
    competitorsSub: '200m+ masofadagi do‘konlar',
    revenue: '$31,000 – $45,000',
    revenueSub: 'Kutilayotgan oylik aylanma',
    format: 'Express Minimarket / Retail',
    formatSub: 'Optimal biznes modeli',
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
    badge: 'Dorixona & Tibbiyot',
    icon: Pill,
    location: 'Yunusobod 5-mavze',
    district: 'Yunusobod tumani',
    score: 79.4,
    scoreVerdict: 'Monopol radius mavjud',
    footTraffic: '9,800+',
    trafficSub: 'Aholi va bemorlar oqimi',
    competitors: '1 ta',
    competitorsSub: '700m radiusda raqobatsiz',
    revenue: '$12,000 – $18,000',
    revenueSub: 'Kutilayotgan oylik aylanma',
    format: '24/7 Navbatchi dorixona',
    formatSub: 'Optimal biznes modeli',
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
    badge: 'Tijoriy Ofis & Rieltorlik',
    icon: Building2,
    location: 'Tashkent City',
    district: 'Shayxontohur / Mirobod',
    score: 91.7,
    scoreVerdict: 'Yuqori ROI & barqaror ijara',
    footTraffic: '15,200+',
    trafficSub: 'Biznes va ishbilarmon oqim',
    competitors: '3 ta',
    competitorsSub: '500m+ masofada A-klass ofis',
    revenue: '$35,000 – $55,000',
    revenueSub: 'Kutilayotgan ijara / daromad',
    format: 'A-Class Coworking & Ofis',
    formatSub: 'Optimal biznes modeli',
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

export const IndustrySolutions: React.FC = () => {
  const { setCurrentView } = useAnalyticsStore();
  const [activeId, setActiveId] = useState('cafe');

  const active = INDUSTRIES.find((i) => i.id === activeId)!;

  return (
    <section
      id="solutions"
      className="py-24 sm:py-36 border-t border-black/[0.05] dark:border-white/[0.05] select-none scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section Heading & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0E9F6E]" />
              <span className="font-mono text-xs tracking-[0.18em] uppercase text-[#A4A9A5]">
                Soha Yechimlari
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-[-0.03em] leading-[1.12] text-[#111111] dark:text-[#FDFDFD]">
              Har qanday soha{' '}
              <span className="text-[#A4A9A5] font-normal">uchun aniq tahlil.</span>
            </h2>
          </div>

          {/* Segmented Liquid Switcher Tabs */}
          <div className="inline-flex p-1.5 rounded-full bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl">
            {INDUSTRIES.map((ind) => {
              const isSelected = ind.id === activeId;
              const Icon = ind.icon;
              return (
                <button
                  key={ind.id}
                  onClick={() => setActiveId(ind.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-colors duration-200 cursor-pointer ${
                    isSelected
                      ? 'text-[#111111] dark:text-[#FDFDFD]'
                      : 'text-neutral-500 hover:text-[#111111] dark:text-neutral-400 dark:hover:text-white'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="industry-pill-tab"
                      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                      className="absolute inset-0 rounded-full bg-white dark:bg-white/[0.12] border border-black/[0.05] dark:border-white/10 shadow-sm"
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{ind.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Showcase Dashboard Card */}
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="rounded-3xl bg-white/45 dark:bg-[#161616]/45 backdrop-blur-2xl backdrop-saturate-[180%] border-2 border-white/80 dark:border-white/20 p-6 sm:p-10 shadow-none dark:shadow-none"
        >
          {/* Card Top Bar: Location metadata & MakonScore showcase */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-8 border-b border-black/[0.05] dark:border-white/[0.06]">
            <div>
              <div className="inline-flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#0E9F6E] bg-[#0E9F6E]/10 px-2.5 py-0.5 rounded-full font-semibold">
                  {active.badge}
                </span>
                <span className="font-mono text-[11px] text-[#A4A9A5]">
                  • {active.district}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] dark:text-[#FDFDFD]">
                {active.location}
              </h3>
            </div>

            {/* MakonScore Highlight Badge */}
            <div className="flex items-center gap-4 bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.08] px-5 py-3 rounded-2xl flex-shrink-0">
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5 text-3xl sm:text-4xl font-extrabold text-[#0E9F6E] tracking-tight tabular-nums leading-none">
                  {active.score}
                  <span className="text-xs font-mono font-normal text-neutral-400 dark:text-neutral-400">/ 100</span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-400 mt-1">
                  MakonScore
                </p>
              </div>
              <div className="w-[1px] h-8 bg-black/[0.08] dark:bg-white/[0.1]" />
              <div className="text-left">
                <span className="inline-flex items-center gap-1.5 font-medium text-xs text-[#111111] dark:text-[#FDFDFD]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E9F6E] animate-pulse" />
                  {active.scoreVerdict}
                </span>
                <p className="text-[11px] text-[#A4A9A5] mt-0.5">Fazoviy AI bahosi</p>
              </div>
            </div>
          </div>

          {/* Card Middle: 2-Column Balanced Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 items-stretch">
            {/* Left Column: 4 Stat Cards Grid (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Stat 1: Foot Traffic */}
              <div className="p-5 rounded-2xl bg-black/[0.015] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.06] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Kunlik oqim</span>
                  <div className="w-7 h-7 rounded-lg bg-[#0E9F6E]/10 flex items-center justify-center text-[#0E9F6E]">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#111111] dark:text-[#FDFDFD] tracking-tight tabular-nums">
                    {active.footTraffic}
                  </div>
                  <p className="text-[11.5px] text-[#A4A9A5] mt-1">{active.trafficSub}</p>
                </div>
              </div>

              {/* Stat 2: Competitors */}
              <div className="p-5 rounded-2xl bg-black/[0.015] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.06] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Raqobat muhiti</span>
                  <div className="w-7 h-7 rounded-lg bg-[#0E9F6E]/10 flex items-center justify-center text-[#0E9F6E]">
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#111111] dark:text-[#FDFDFD] tracking-tight tabular-nums">
                    {active.competitors}
                  </div>
                  <p className="text-[11.5px] text-[#A4A9A5] mt-1">{active.competitorsSub}</p>
                </div>
              </div>

              {/* Stat 3: Projected Revenue */}
              <div className="p-5 rounded-2xl bg-black/[0.015] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.06] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Prognoz aylanma</span>
                  <div className="w-7 h-7 rounded-lg bg-[#0E9F6E]/10 flex items-center justify-center text-[#0E9F6E]">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#0E9F6E] tracking-tight tabular-nums">
                    {active.revenue}
                  </div>
                  <p className="text-[11.5px] text-[#A4A9A5] mt-1">{active.revenueSub}</p>
                </div>
              </div>

              {/* Stat 4: Recommended Format */}
              <div className="p-5 rounded-2xl bg-black/[0.015] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.06] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Optimal format</span>
                  <div className="w-7 h-7 rounded-lg bg-[#0E9F6E]/10 flex items-center justify-center text-[#0E9F6E]">
                    <Store className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-[#111111] dark:text-[#FDFDFD] tracking-tight leading-snug">
                    {active.format}
                  </div>
                  <p className="text-[11.5px] text-[#A4A9A5] mt-1">{active.formatSub}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Live Hourly Traffic Dynamics Chart (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.08] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#A4A9A5] font-semibold whitespace-nowrap">
                    Soatlik trafik
                  </p>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-[#0E9F6E] bg-[#0E9F6E]/10 px-2.5 py-1 rounded-full font-medium whitespace-nowrap flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0E9F6E] animate-pulse" />
                    Jonli
                  </span>
                </div>

                {/* Animated Bar Chart */}
                <div className="h-40 flex items-end gap-3 pt-2 pb-1">
                  {active.bars.map((bar) => (
                    <div key={bar.hour} className="flex flex-col items-center justify-end h-full flex-1 gap-2 group">
                      <span className="text-[10px] font-mono font-medium text-[#111111]/70 dark:text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-150 tabular-nums">
                        {bar.pct}%
                      </span>

                      {/* Bar track and animated fill */}
                      <div className="w-full h-full max-h-[110px] bg-black/[0.04] dark:bg-white/[0.05] rounded-t-md flex items-end overflow-hidden p-0.5">
                        <motion.div
                          key={`${activeId}-${bar.hour}`}
                          initial={{ height: 0 }}
                          animate={{ height: `${bar.pct}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          className={`w-full rounded-t-sm transition-colors duration-200 ${
                            bar.peak
                              ? 'bg-[#0E9F6E]'
                              : 'bg-[#A4A9A5]/40 hover:bg-[#A4A9A5]/60 dark:bg-white/20 dark:hover:bg-white/35'
                          }`}
                        />
                      </div>

                      <span className={`text-[11px] font-mono ${bar.peak ? 'text-[#0E9F6E] font-bold' : 'text-[#A4A9A5]'}`}>
                        {bar.hour}:00
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Peak indicator highlight */}
              <div className="mt-5 pt-3.5 border-t border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0E9F6E] flex-shrink-0 animate-pulse" />
                  <span className="text-neutral-500 dark:text-neutral-400 font-normal">Pik soatlar:</span>
                </div>
                <span className="font-mono text-xs font-semibold text-[#111111] dark:text-[#FDFDFD]">
                  {active.peakHours}
                </span>
              </div>
            </div>
          </div>

          {/* Card Footer: Action Bar */}
          <div className="pt-6 border-t border-black/[0.05] dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <Sparkles className="w-4 h-4 text-[#0E9F6E] flex-shrink-0" />
              <span>150,000+ real fazoviy tahlil nuqtasi va sun’iy intellekt modeli asosida hisoblangan.</span>
            </div>

            <button
              onClick={() => setCurrentView('app')}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#111111] hover:bg-neutral-800 text-white dark:bg-[#FDFDFD] dark:hover:bg-neutral-200 dark:text-[#111111] text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-200 shadow-sm active:scale-[0.98] flex-shrink-0"
            >
              <span>O'z lokatsiyamni tekshirish</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/80 group-hover:text-white dark:text-[#111111]/80 dark:group-hover:text-[#111111] transition-transform duration-200 ease-out group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default IndustrySolutions;
