import React, { useState } from 'react';
import { ArrowRight, ArrowUp } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

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
    <footer className="border-t border-black/[0.06] dark:border-white/[0.06] select-none">

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

      {/* Thin divider */}
      <div className="border-t border-black/[0.05] dark:border-white/[0.05]" />

      {/* Links grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_2fr] gap-10">
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#A4A9A5] mb-5">
                {group.title}
              </p>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#A4A9A5] hover:text-[#111111] dark:hover:text-[#FDFDFD] transition-colors duration-150"
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
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/brand/logo_icon.png"
                alt="MakonSense"
                className="w-7 h-7 dark:hidden"
              />
              <img
                src="/brand/logo_icon_white.png"
                alt="MakonSense"
                className="w-7 h-7 hidden dark:block"
              />
              <span className="font-bold text-[#111111] dark:text-[#FDFDFD]">
                MakonSense
              </span>
            </div>
            <p className="text-sm text-[#A4A9A5] leading-relaxed max-w-xs">
              O'zbekiston uchun fazoviy intellekt va joylashuv tahlili platformasi.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/50 dark:bg-white/[0.05] backdrop-blur-md border border-white/70 dark:border-white/15 text-xs font-mono text-[#0E9F6E] shadow-none dark:shadow-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0E9F6E] animate-pulse" />
              Ochiq beta · Bepul
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* CREATIVE FULL-WIDTH BRAND MONUMENT BANNER (PadiSave style) */}
      {/* Deep signature emerald, interactive reactive glow, full-bleed wordmark */}
      {/* ========================================================= */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden bg-[#0A2E20] dark:bg-[#061C14] border-t border-[#134934] dark:border-[#0E3827] text-white pt-10 sm:pt-14 pb-0 transition-colors duration-500 group select-none"
      >
        {/* Interactive Mouse Reactive Light Beam */}
        {mousePos.active && (
          <div
            className="pointer-events-none absolute -inset-px transition-opacity duration-300"
            style={{
              background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(14, 159, 110, 0.28), transparent 70%)`,
            }}
          />
        )}

        {/* Top Copyright & Metadata Row */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-emerald-100/75">
            <p className="font-normal tracking-wide">
              © 2026 MakonSense. Barcha huquqlar himoyalangan.
            </p>

            <div className="flex items-center gap-6">
              <span className="hidden sm:inline-flex items-center gap-2 font-mono text-[11px] text-emerald-300/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E9F6E] animate-pulse" />
                O'zbekiston · 14 hudud · 524,476+ bino
              </span>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-200/60 hover:text-white transition-colors duration-200 cursor-pointer group/btn"
              >
                <span>Yuqoriga</span>
                <ArrowUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Full-width Giant Wordmark Logo */}
        <div className="relative z-10 w-full overflow-hidden select-none pointer-events-none mt-8 sm:mt-12 lg:mt-16 flex items-end justify-center px-4 sm:px-6 md:px-8 -mb-1 sm:-mb-2 lg:-mb-4">
          {/* Subtle Ambient Floor Glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-32 bg-[#0E9F6E]/18 blur-3xl pointer-events-none" />

          {/* Actual Brand Logo Graphic filling full width */}
          <img
            src="/brand/logo_text_white.png"
            alt="MakonSense"
            className="w-full h-auto object-contain select-none pointer-events-none transition-all duration-700 ease-out opacity-25 group-hover:opacity-40"
            style={{
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 15%, rgba(0,0,0,0.18) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 15%, rgba(0,0,0,0.18) 100%)',
            }}
          />
        </div>
      </div>

    </footer>
  );
};

export default LandingFooter;
