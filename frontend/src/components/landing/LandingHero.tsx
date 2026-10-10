import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { Magnet } from '../ui/Magnet';
import { MorphAnchor } from './MorphObject';

const DEFAULT_COORDS = { lat: 41.3123, lng: 69.2797 };

const STATS = [
  { value: '524k+', label: "Indekslangan bino" },
  { value: '14', label: "O'zbekiston hududi" },
  { value: '94.2%', label: 'Qaror aniqligi' },
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
      className="min-h-[100svh] flex flex-col justify-center pt-24 pb-16 select-none overflow-hidden scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">

        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mb-10"
        >
          <span className="inline-flex items-center font-mono text-[11px] tracking-[0.16em] uppercase text-neutral-500 dark:text-neutral-400 bg-white/50 dark:bg-white/[0.05] backdrop-blur-xl border border-black/[0.08] dark:border-white/20 rounded-full px-4 py-1.5 shadow-none dark:shadow-none">
            O'ZBEKISTON · 14 HUDUD · FAZOVIY INTELLEKT
          </span>
        </motion.div>

        {/* Main layout: headline left, creative radar mockup right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_560px] xl:grid-cols-[1fr_620px] gap-12 lg:gap-16 items-center">

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

          {/* Right: grand atmospheric anchor slot for the 3D globe hologram (2/4 width) */}
          <div className="relative hidden lg:flex items-center justify-center">
            <MorphAnchor shape="globe" className="w-[580px] h-[580px] lg:w-[640px] lg:h-[640px] xl:w-[680px] xl:h-[680px]" />
            <div className="absolute -bottom-4 left-0 right-0 flex justify-center pointer-events-none">
              <span className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">
                41.31° N · 69.28° E · TOSHKENT
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default LandingHero;
