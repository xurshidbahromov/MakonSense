import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Building2, MapPin, Target, Activity } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { Magnet } from '../ui/Magnet';
import { UzbekistanDottedMap } from './UzbekistanDottedMap';

const DEFAULT_COORDS = { lat: 41.3123, lng: 69.2797 };

const STATS = [
  { value: '524k+', label: "Indekslangan bino", icon: Building2 },
  { value: '14', label: "O'zbekiston hududi", icon: MapPin },
  { value: '94.2%', label: 'Qaror aniqligi', icon: Target },
  { value: '150k+', label: 'Fazoviy nuqtalar', icon: Activity },
];

export const LandingHero: React.FC = () => {
  const { setCurrentView, setSelectedCoords } = useAnalyticsStore();

  const handleLaunch = () => {
    setSelectedCoords({
      latitude: DEFAULT_COORDS.lat,
      longitude: DEFAULT_COORDS.lng,
    });
    setCurrentView('app');
  };

  return (
    <section
      id="hero"
      className="min-h-[100svh] flex flex-col justify-center pt-36 sm:pt-40 pb-16 select-none overflow-hidden scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col items-center">

        {/* 1. Top pill badge (Centered) */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mb-6 text-center"
        >
          <span className="inline-flex items-center font-mono text-[11px] tracking-[0.16em] uppercase text-neutral-600 dark:text-neutral-400 bg-white/60 dark:bg-white/[0.05] backdrop-blur-md border border-black/[0.08] dark:border-white/15 rounded-full px-4 py-1.5 shadow-none">
            O'ZBEKISTON · 14 HUDUD · FAZOVIY INTELLEKT
          </span>
        </motion.div>

        {/* 2. Large Editorial Headline (Centered) */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-[clamp(2.5rem,5.6vw,4.8rem)] font-bold tracking-[-0.025em] leading-[1.08] text-center max-w-4xl mx-auto"
        >
          <span className="text-[#111111] dark:text-[#FDFDFD]">
            Ma'lumotlarga Asoslangan
          </span>
          <br />
          <span className="text-[#0E9F6E]">
            Lokatsiya Qarorlari.
          </span>
        </motion.h1>

        {/* 3. Subtitle (Centered) */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-center leading-relaxed font-normal tracking-[-0.01em]"
        >
          MakonSense 524,000+ O'zbekiston binosi va hududiy oqim ma'lumotlari asosida yangi shoxobcha uchun eng daromadli lokatsiyani soniyalarda aniqlaydi.
        </motion.p>

        {/* 4. Action Buttons (Centered) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4"
        >
          <Magnet magnetStrength={3}>
            <button
              onClick={() => handleLaunch()}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#111111] dark:bg-[#FDFDFD] text-[#FDFDFD] dark:text-[#111111] text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition-all duration-150 shadow-sm cursor-pointer"
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
            className="inline-flex items-center gap-1.5 px-6 py-3.5 rounded-full text-sm font-medium border border-black/[0.08] dark:border-white/15 text-neutral-700 dark:text-neutral-300 hover:text-[#111111] dark:hover:text-[#FDFDFD] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors duration-150 cursor-pointer"
          >
            Jonli demo ko'rish
          </button>
        </motion.div>

        {/* 5. Full Seamless Dotted Uzbekistan Map (No Borders / No Boxes) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="w-full -mt-2 sm:-mt-4 overflow-visible"
        >
          <UzbekistanDottedMap />
        </motion.div>

        {/* 6. Stats & Trust Band below the map (Centered) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-6 sm:mt-8 pt-6 border-t border-black/[0.05] dark:border-white/[0.06] w-full max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-[#FDFDFD] tracking-[-0.025em] tabular-nums">
                  {s.value}
                </div>
                <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default LandingHero;
