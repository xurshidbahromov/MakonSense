import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, MapPin, Sparkles, Compass, TrendingUp, Users, Building2 } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { Magnet } from '../ui/Magnet';

interface HeroLocationPreset {
  id: string;
  name: string;
  shortName: string;
  coords: { lat: number; lng: number };
  score: number;
  grade: string;
  traffic: string;
  metro: string;
  competitors: string;
  revenue: string;
  recommendation: string;
  bars: { h: string; peak: boolean; time: string; count: string }[];
}

const PRESETS: HeroLocationPreset[] = [
  {
    id: 'temur',
    name: 'Amir Temur Xiyoboni, Toshkent',
    shortName: 'Amir Temur',
    coords: { lat: 41.3123, lng: 69.2797 },
    score: 94.0,
    grade: 'A-Grade Lokatsiya',
    traffic: '18,400+ / kun',
    metro: '42 metr',
    competitors: '2 ta (erkin bozor)',
    revenue: '$24,000 / oy',
    recommendation: 'Yuqori piyoda oqimi — HoReCa va Retail uchun eng qulay nuqta',
    bars: [
      { h: '35%', peak: false, time: '08:00', count: '1,200/s' },
      { h: '55%', peak: false, time: '11:00', count: '2,400/s' },
      { h: '88%', peak: true, time: '14:00', count: '3,800/s' },
      { h: '100%', peak: true, time: '18:00', count: '4,500/s' },
      { h: '75%', peak: false, time: '20:00', count: '3,100/s' },
      { h: '45%', peak: false, time: '22:00', count: '1,800/s' },
      { h: '25%', peak: false, time: '00:00', count: '600/s' },
    ],
  },
  {
    id: 'city',
    name: 'Tashkent City Mall hududi',
    shortName: 'Tashkent City',
    coords: { lat: 41.3150, lng: 69.2520 },
    score: 91.8,
    grade: 'A-Grade Premium',
    traffic: '15,200+ / kun',
    metro: '180 metr',
    competitors: '5 ta (yuqori segment)',
    revenue: '$38,000 / oy',
    recommendation: 'Aholi xarid quvvati yuqori — premium xizmatlar va brendlar uchun',
    bars: [
      { h: '20%', peak: false, time: '08:00', count: '800/s' },
      { h: '45%', peak: false, time: '11:00', count: '1,900/s' },
      { h: '70%', peak: false, time: '14:00', count: '2,900/s' },
      { h: '95%', peak: true, time: '18:00', count: '4,200/s' },
      { h: '100%', peak: true, time: '20:00', count: '4,400/s' },
      { h: '60%', peak: false, time: '22:00', count: '2,600/s' },
      { h: '30%', peak: false, time: '00:00', count: '900/s' },
    ],
  },
  {
    id: 'chilonzor',
    name: 'Chilonzor 9-Mavze, Katta Ko‘cha',
    shortName: 'Chilonzor 9',
    coords: { lat: 41.2720, lng: 69.2040 },
    score: 64.2,
    grade: 'C-Grade O‘rta',
    traffic: '6,400+ / kun',
    metro: '1.2 km',
    competitors: '8 ta (to‘yingan bozor)',
    revenue: '$9,500 / oy',
    recommendation: 'Raqobat zichligi yuqori — differensiatsiya strategiyasi zarur',
    bars: [
      { h: '40%', peak: false, time: '08:00', count: '1,100/s' },
      { h: '35%', peak: false, time: '11:00', count: '900/s' },
      { h: '50%', peak: false, time: '14:00', count: '1,400/s' },
      { h: '80%', peak: true, time: '18:00', count: '2,300/s' },
      { h: '65%', peak: false, time: '20:00', count: '1,700/s' },
      { h: '35%', peak: false, time: '22:00', count: '800/s' },
      { h: '15%', peak: false, time: '00:00', count: '300/s' },
    ],
  },
];

const STATS = [
  { value: '524k+', label: "Indekslangan bino" },
  { value: '14', label: "O'zbekiston hududi" },
  { value: '94.2%', label: 'Qaror aniqligi' },
];

export const LandingHero: React.FC = () => {
  const { setCurrentView, setSelectedCoords } = useAnalyticsStore();
  const [activePreset, setActivePreset] = useState<HeroLocationPreset>(PRESETS[0]);
  const [hoveredBar, setHoveredBar] = useState<{ time: string; count: string } | null>(null);

  const handleLaunch = (coords?: { lat: number; lng: number }) => {
    setSelectedCoords({
      latitude: coords?.lat ?? activePreset.coords.lat,
      longitude: coords?.lng ?? activePreset.coords.lng,
    });
    setCurrentView('app');
  };

  return (
    <section
      id="hero"
      className="min-h-[100svh] flex flex-col justify-center pt-24 pb-16 bg-[#FDFDFD] dark:bg-[#111111] select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">

        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mb-10"
        >
          <span className="inline-flex items-center font-mono text-[11px] tracking-[0.16em] uppercase text-[#A4A9A5] border border-black/[0.08] dark:border-white/[0.08] rounded-full px-4 py-1.5">
            O'ZBEKISTON · 14 HUDUD · FAZOVIY INTELLEKT
          </span>
        </motion.div>

        {/* Main layout: headline left, creative radar mockup right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-12 lg:gap-16 items-center">

          {/* Left: headline + sub + CTAs */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-[clamp(2.5rem,5.8vw,4.8rem)] font-bold tracking-[-0.015em] leading-[1.08]"
            >
              <span className="text-[#111111] dark:text-[#FDFDFD]">
                Ma'lumotlarga
              </span>
              <br />
              <span className="text-[#111111] dark:text-[#FDFDFD]">
                Asoslangan
              </span>
              <br />
              <span className="text-[#0E9F6E]">
                Lokatsiya Qarorlari.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-base sm:text-[17px] text-neutral-600 dark:text-neutral-400 max-w-lg leading-[1.65] font-normal tracking-[-0.01em]"
            >
              MakonSense 524,000+ O'zbekiston binosi va hududiy oqim ma'lumotlari asosida yangi shoxobcha uchun eng daromadli lokatsiyani soniyalarda aniqlaydi.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Magnet magnetStrength={3}>
                <button
                  onClick={() => handleLaunch()}
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#111111] dark:bg-[#FDFDFD] text-[#FDFDFD] dark:text-[#111111] text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-all duration-150 shadow-sm cursor-pointer"
                >
                  <span>Bepul sinab ko'rish</span>
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-200 ease-out group-hover:translate-x-1"
                  />
                </button>
              </Magnet>

              <button
                onClick={() => handleLaunch()}
                className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-full text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-[#111111] dark:hover:text-[#FDFDFD] transition-colors duration-150 cursor-pointer"
              >
                Jonli demo ko'rish
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-12 pt-8 border-t border-black/[0.06] dark:border-white/[0.06] grid grid-cols-3 gap-0"
            >
              {STATS.map((s, i) => (
                <div
                  key={i}
                  className={`${i > 0 ? 'pl-6 sm:pl-10 border-l border-black/[0.06] dark:border-white/[0.06]' : ''}`}
                >
                  <div className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-[#FDFDFD] tracking-[-0.025em] tabular-nums">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 font-normal leading-snug">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Creative Live Radar & Spatial Analytics Card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.25, ease: [0.2, 0, 0, 1] }}
            className="relative"
          >
            {/* Ambient Backlight Glow (Very subtle) */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-[#0E9F6E]/10 via-transparent to-black/5 dark:to-white/5 blur-xl -z-10 pointer-events-none" />

            <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white/95 dark:bg-[#181818]/95 backdrop-blur-xl overflow-hidden shadow-[0_24px_50px_-15px_rgba(0,0,0,0.06)] dark:shadow-[0_24px_50px_-15px_rgba(0,0,0,0.6)]">

              {/* Card Top: Location Selector Pills */}
              <div className="px-5 pt-4 pb-3 border-b border-black/[0.05] dark:border-white/[0.05] bg-black/[0.015] dark:bg-white/[0.015]">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
                    <Compass size={13} className="text-[#0E9F6E]" />
                    <span>FAZOVIY RADAR</span>
                  </div>
                  <span className="font-mono text-[10px] text-neutral-400">
                    {activePreset.coords.lat.toFixed(4)}° N, {activePreset.coords.lng.toFixed(4)}° E
                  </span>
                </div>

                {/* Switchable Location Chips */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.05]">
                  {PRESETS.map((p) => {
                    const isSelected = p.id === activePreset.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setActivePreset(p)}
                        className={`relative flex-1 py-1.5 px-2.5 text-xs font-medium rounded-lg transition-all duration-150 text-center truncate cursor-pointer ${
                          isSelected
                            ? 'text-[#111111] dark:text-[#FDFDFD] font-semibold'
                            : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="hero-preset-indicator"
                            className="absolute inset-0 bg-white dark:bg-[#252525] rounded-lg shadow-sm"
                            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center justify-center gap-1.5">
                          {p.shortName}
                          <span
                            className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                              p.score >= 90
                                ? 'bg-[#0E9F6E]/15 text-[#0E9F6E]'
                                : 'bg-neutral-200 dark:bg-white/10 text-neutral-600 dark:text-neutral-300'
                            }`}
                          >
                            {p.score}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Info Body with AnimatePresence on location change */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePreset.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 pt-5 pb-5"
                >
                  {/* Location Title & MakonScore Ring */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                        <MapPin size={12} className="text-[#0E9F6E] flex-shrink-0" />
                        <span className="font-mono text-[11px] truncate max-w-[240px]">
                          {activePreset.name}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-5xl font-bold text-[#111111] dark:text-[#FDFDFD] tracking-[-0.03em] tabular-nums">
                          {activePreset.score.toFixed(1)}
                        </div>
                        <span className="font-mono text-xs text-neutral-400">/ 100</span>
                      </div>
                      <span
                        className={`inline-block mt-1.5 text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase tracking-wide ${
                          activePreset.score >= 90
                            ? 'text-[#0E9F6E] bg-[#0E9F6E]/10'
                            : 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                        }`}
                      >
                        {activePreset.grade}
                      </span>
                    </div>

                    {/* Animated Radial SVG Progress Ring */}
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <svg viewBox="0 0 60 60" className="w-full h-full -rotate-90">
                        <circle
                          cx="30"
                          cy="30"
                          r="24"
                          fill="none"
                          stroke="currentColor"
                          className="text-black/[0.06] dark:text-white/[0.08]"
                          strokeWidth="4"
                        />
                        <motion.circle
                          cx="30"
                          cy="30"
                          r="24"
                          fill="none"
                          stroke={activePreset.score >= 90 ? '#0E9F6E' : '#D97706'}
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 24}
                          initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
                          animate={{
                            strokeDashoffset:
                              2 * Math.PI * 24 * (1 - activePreset.score / 100),
                          }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[#111111] dark:text-[#FDFDFD]">
                        {Math.round(activePreset.score)}%
                      </span>
                    </div>
                  </div>

                  {/* 4 Interactive Key Spatial Metrics */}
                  <div className="grid grid-cols-2 gap-2.5 mb-5">
                    <div className="p-3 rounded-xl bg-black/[0.025] dark:bg-white/[0.03] border border-black/[0.03] dark:border-white/[0.04]">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                        <Users size={11} className="text-[#0E9F6E]" />
                        <span>Kunlik trafik</span>
                      </div>
                      <p className="text-[13.5px] font-bold text-[#111111] dark:text-[#FDFDFD] tabular-nums">
                        {activePreset.traffic}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/[0.025] dark:bg-white/[0.03] border border-black/[0.03] dark:border-white/[0.04]">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                        <Building2 size={11} className="text-[#0E9F6E]" />
                        <span>Metro masofasi</span>
                      </div>
                      <p className="text-[13.5px] font-bold text-[#111111] dark:text-[#FDFDFD] tabular-nums">
                        {activePreset.metro}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/[0.025] dark:bg-white/[0.03] border border-black/[0.03] dark:border-white/[0.04]">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                        <Compass size={11} className="text-[#0E9F6E]" />
                        <span>Raqobatchilar</span>
                      </div>
                      <p className="text-[13.5px] font-bold text-[#111111] dark:text-[#FDFDFD] tabular-nums">
                        {activePreset.competitors}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/[0.025] dark:bg-white/[0.03] border border-black/[0.03] dark:border-white/[0.04]">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                        <TrendingUp size={11} className="text-[#0E9F6E]" />
                        <span>Prognoz</span>
                      </div>
                      <p className="text-[13.5px] font-bold text-[#0E9F6E] tabular-nums">
                        {activePreset.revenue}
                      </p>
                    </div>
                  </div>

                  {/* 24-Hour Traffic Chart with interactive hover tooltips */}
                  <div className="pt-3 border-t border-black/[0.04] dark:border-white/[0.04]">
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-2">
                      <span>24 soatlik oqim ritmi</span>
                      <span className="text-[#0E9F6E] font-semibold">
                        {hoveredBar ? `${hoveredBar.time}: ${hoveredBar.count}` : 'Ustunga olib boring'}
                      </span>
                    </div>

                    <div className="flex items-end gap-1.5 h-16 pt-2">
                      {activePreset.bars.map((bar, i) => (
                        <div
                          key={i}
                          onMouseEnter={() => setHoveredBar({ time: bar.time, count: bar.count })}
                          onMouseLeave={() => setHoveredBar(null)}
                          className="flex-1 h-full flex flex-col justify-end group cursor-pointer"
                        >
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: bar.h }}
                            transition={{ duration: 0.4, delay: i * 0.04 }}
                            className={`w-full rounded-t-sm transition-all duration-150 ${
                              bar.peak
                                ? 'bg-[#0E9F6E] group-hover:bg-[#0E9F6E]/80'
                                : 'bg-neutral-300 dark:bg-white/15 group-hover:bg-neutral-400 dark:group-hover:bg-white/30'
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Recommendation Summary */}
                  <div className="mt-4 p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.025] border border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between gap-3">
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug line-clamp-1">
                      💡 {activePreset.recommendation}
                    </p>
                    <button
                      onClick={() => handleLaunch(activePreset.coords)}
                      className="text-[11px] font-semibold text-[#0E9F6E] hover:underline whitespace-nowrap flex items-center gap-1 cursor-pointer flex-shrink-0"
                    >
                      Audit
                      <ArrowRight size={11} />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>

            {/* Floating Live Badge */}
            <div className="absolute -bottom-3 -right-2 sm:-right-4 flex items-center gap-2 bg-[#FDFDFD] dark:bg-[#202020] border border-black/[0.08] dark:border-white/[0.08] rounded-full px-3.5 py-1.5 shadow-md">
              <Sparkles size={12} className="text-[#0E9F6E]" />
              <span className="text-[11px] font-semibold text-[#111111] dark:text-[#FDFDFD]">
                AI Tahlil tayyor
              </span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default LandingHero;
