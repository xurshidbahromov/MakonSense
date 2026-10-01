import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { Magnet } from '../ui/Magnet';

const STATS = [
  { value: '524k+', label: "Indekslanган bino" },
  { value: '14', label: "O'zbekiston hududi" },
  { value: '94.2%', label: 'Qaror aniqligi' },
];

// Mini mockup data
const MOCK_BARS = [
  { h: '35%', peak: false },
  { h: '62%', peak: false },
  { h: '88%', peak: true },
  { h: '100%', peak: true },
  { h: '74%', peak: false },
  { h: '50%', peak: false },
  { h: '40%', peak: false },
];

export const LandingHero: React.FC = () => {
  const { setCurrentView, setSelectedCoords } = useAnalyticsStore();

  const handleLaunch = () => {
    setSelectedCoords({ latitude: 41.3123, longitude: 69.2797 });
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
          <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase text-[#A4A9A5] border border-black/[0.08] dark:border-white/[0.08] rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0E9F6E] animate-pulse" />
            O'ZBEKISTON · 14 HUDUD · FAZOVIY INTELLEKT
          </span>
        </motion.div>

        {/* Main layout: headline left, mockup right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 lg:gap-20 items-center">

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
                  onClick={handleLaunch}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#111111] dark:bg-[#FDFDFD] text-[#FDFDFD] dark:text-[#111111] text-sm font-medium hover:opacity-85 active:scale-[0.97] transition-all duration-150"
                >
                  Bepul sinab ko'rish
                  <ArrowRight size={15} />
                </button>
              </Magnet>

              <button
                onClick={handleLaunch}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-sm font-medium text-[#111111] dark:text-[#FDFDFD] hover:text-[#0E9F6E] transition-colors duration-150"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E9F6E]" />
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

          {/* Right: product mockup */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.25, ease: [0.2, 0, 0, 1] }}
            className="relative"
          >
            <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#1A1A1A] overflow-hidden">

              {/* Mockup header bar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-black/[0.05] dark:border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-[#0E9F6E]" />
                  <span className="text-xs font-mono text-[#A4A9A5]">Amir Temur Xiyoboni, Toshkent</span>
                </div>
                <span className="text-[10px] font-mono text-[#0E9F6E] bg-[#0E9F6E]/10 px-2 py-0.5 rounded-full">
                  JONLI
                </span>
              </div>

              {/* Score block */}
              <div className="px-5 pt-6 pb-4">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-[10px] font-mono text-[#A4A9A5] uppercase tracking-widest mb-1">
                      MakonScore
                    </p>
                    <div className="text-5xl font-bold text-[#111111] dark:text-[#FDFDFD] leading-none tracking-[-0.03em] tabular-nums">
                      94.0
                    </div>
                    <span className="inline-block mt-2 text-[10px] font-mono text-[#0E9F6E] bg-[#0E9F6E]/10 px-2 py-0.5 rounded-sm uppercase tracking-wide">
                      A-Grade Lokatsiya
                    </span>
                  </div>

                  {/* Radial indicator (CSS-only) */}
                  <div className="relative w-16 h-16">
                    <svg viewBox="0 0 60 60" className="w-full h-full -rotate-90">
                      <circle cx="30" cy="30" r="24" fill="none" stroke="#111111" strokeOpacity="0.05" strokeWidth="4" />
                      <circle
                        cx="30" cy="30" r="24"
                        fill="none"
                        stroke="#0E9F6E"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 24 * 0.94} ${2 * Math.PI * 24}`}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#0E9F6E]">
                      94%
                    </span>
                  </div>
                </div>

                {/* Mini metrics */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { l: 'Kunlik trafik', v: '18,400+' },
                    { l: 'Metro masofasi', v: '42m' },
                    { l: 'Raqobatchilar', v: '2 ta' },
                    { l: 'Daromad prognozi', v: '$24,000/oy' },
                  ].map((m) => (
                    <div key={m.l} className="p-3 rounded-lg bg-[#F9F9F9] dark:bg-white/[0.03]">
                      <p className="text-[9px] font-mono text-[#A4A9A5] uppercase tracking-wider mb-1">{m.l}</p>
                      <p className="text-sm font-bold text-[#111111] dark:text-[#FDFDFD]">{m.v}</p>
                    </div>
                  ))}
                </div>

                {/* Mini bar chart */}
                <div>
                  <p className="text-[9px] font-mono text-[#A4A9A5] uppercase tracking-wider mb-2">
                    24 soatlik trafik
                  </p>
                  <div className="flex items-end gap-1.5 h-14">
                    {MOCK_BARS.map((bar, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-t-sm ${bar.peak ? 'bg-[#0E9F6E]' : 'bg-[#A4A9A5]/20 dark:bg-white/10'}`}
                        style={{ height: bar.h }}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Floating tag */}
            <div className="absolute -bottom-3 -right-3 sm:-right-5 flex items-center gap-2 bg-[#FDFDFD] dark:bg-[#1A1A1A] border border-black/[0.06] dark:border-white/[0.06] rounded-full px-4 py-2 shadow-sm">
              <Sparkles size={12} className="text-[#0E9F6E]" />
              <span className="text-xs font-semibold text-[#111111] dark:text-[#FDFDFD]">
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
