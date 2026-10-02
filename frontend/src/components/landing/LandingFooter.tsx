import React, { useState } from 'react';
import { ArrowRight, ArrowUp } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { MakonSenseWordmark } from '../brand/MakonSenseWordmark';

const FOOTER_LINKS = [
  {
    title: 'Mahsulot',
    links: ['MakonScore', 'PDF Audit', 'A/B Taqqoslash', 'API'],
  },
  {
    title: 'Hududlar',
    links: ['Toshkent', 'Samarqand', "Farg'ona", 'Buxoro'],
  },
  {
    title: 'Kompaniya',
    links: ['Haqimizda', 'Aloqa', 'Maxfiylik', 'Shartlar'],
  },
];

export const LandingFooter: React.FC = () => {
  const { setCurrentView, setSelectedCoords } = useAnalyticsStore();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });

  const handleLaunch = () => {
    setSelectedCoords({ latitude: 41.3123, longitude: 69.2797 });
    setCurrentView('app');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, active: false }));
  };

  return (
    <footer className="select-none">

      {/* Final CTA Card */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16">
        <div className="p-8 sm:p-14 rounded-3xl bg-white/45 dark:bg-[#161616]/45 backdrop-blur-2xl backdrop-saturate-[180%] border-2 border-white/80 dark:border-white/20 shadow-none dark:shadow-none grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="font-mono text-xs tracking-[0.18em] uppercase text-[#A4A9A5]">
              Bepul boshlang
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-[-0.03em] leading-[1.12] text-[#111111] dark:text-[#FDFDFD]">
              Manzilingiz qanchalik{' '}
              <span className="text-[#0E9F6E]">daromadli?</span>
            </h2>
            <p className="mt-5 text-base text-[#A4A9A5] max-w-md leading-relaxed">
              Bir zumda bepul tekshiring — karta raqami va ro'yxatdan o'tish shart emas.
            </p>
          </div>

          <div className="lg:text-right">
            <button
              onClick={handleLaunch}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#111111] hover:bg-neutral-800 text-white dark:bg-[#FDFDFD] dark:hover:bg-neutral-200 dark:text-[#111111] text-base font-semibold cursor-pointer transition-all duration-200 shadow-sm active:scale-[0.98]"
            >
              <span>Hisoblashni boshlash</span>
              <ArrowRight size={16} className="transition-transform duration-200 ease-out group-hover:translate-x-1" />
            </button>
            <p className="mt-3 text-xs text-[#A4A9A5]">
              500,000+ O'zbekiston binosi indekslangan · 14 hudud
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* UNIFIED CREATIVE FOOTER UNIVERSE (Links + Wordmark merged) */}
      {/* Upward fading emerald background · Interactive mouse glow */}
      {/* ========================================================= */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden pt-14 sm:pt-20 pb-0 select-none group transition-colors duration-500"
      >
        {/* Light Mode Continuous Eased Gradient (Balanced pine-obsidian tone) */}
        <div
          className="dark:hidden absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(11,25,18,0.06) 10%, rgba(11,25,18,0.25) 24%, rgba(11,25,18,0.55) 42%, rgba(11,25,18,0.82) 62%, rgba(11,25,18,0.95) 80%, rgba(11,25,18,1) 100%)',
          }}
        />

        {/* Dark Mode Continuous Eased Gradient (Deep obsidian-forest) */}
        <div
          className="hidden dark:block absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(8,18,13,0.06) 10%, rgba(8,18,13,0.25) 24%, rgba(8,18,13,0.55) 42%, rgba(8,18,13,0.82) 62%, rgba(8,18,13,0.95) 80%, rgba(8,18,13,1) 100%)',
          }}
        />

        {/* Interactive Mouse Reactive Spotlight Glow (Balanced 0.09 emerald sheen) */}
        {mousePos.active && (
          <div
            className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
            style={{
              background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, rgba(14, 159, 110, 0.09), transparent 68%)`,
            }}
          />
        )}

        {/* Links Grid */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_2fr] gap-10">
            {FOOTER_LINKS.map((group) => (
              <div key={group.title}>
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/90 font-semibold mb-5">
                  {group.title}
                </p>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-neutral-300 hover:text-white transition-colors duration-150"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Brand column */}
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <img
                  src="/brand/logo_icon_white.png"
                  alt="MakonSense"
                  className="w-7 h-7 object-contain"
                />
                <span className="font-bold text-white text-base tracking-tight">
                  MakonSense
                </span>
              </div>
              <p className="text-sm text-neutral-300/85 leading-relaxed max-w-xs font-normal">
                O'zbekiston uchun fazoviy intellekt va joylashuv tahlili platformasi.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono text-white/90 shadow-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E9F6E] animate-pulse" />
                Ochiq beta · Bepul
              </div>
            </div>
          </div>

          {/* Metadata & Back to top Row */}
          <div className="mt-12 sm:mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-400">
            <p className="font-normal tracking-wide">
              © 2026 MakonSense. Barcha huquqlar himoyalangan.
            </p>

            <div className="flex items-center gap-6">
              <span className="hidden sm:inline-flex items-center gap-2 font-mono text-[11px] text-neutral-300/90">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E9F6E] animate-pulse" />
                O'zbekiston · 14 hudud · 524,476+ bino
              </span>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer group/btn"
              >
                <span>Yuqoriga</span>
                <ArrowUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Full-width Giant Vector Wordmark Logo (Compact & elegant height) */}
        <div className="relative z-20 w-full overflow-hidden select-none pointer-events-none mt-6 sm:mt-8 lg:mt-10 flex items-end justify-center px-4 sm:px-6 md:px-8 -mb-1 sm:-mb-2 lg:-mb-3">
          {/* Subtle Ambient Floor Glow strictly under logo */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-12 bg-[#0E9F6E]/[0.05] blur-3xl pointer-events-none" />

          {/* Mathematical SVG Vector Wordmark (Infinite DPI, stable constant opacity) */}
          <MakonSenseWordmark
            className="w-full h-auto select-none pointer-events-none opacity-25"
          />
        </div>
      </div>

    </footer>
  );
};

export default LandingFooter;
