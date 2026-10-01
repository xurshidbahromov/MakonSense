import React from 'react';
import { ArrowRight } from 'lucide-react';
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

  const handleLaunch = () => {
    setSelectedCoords({ latitude: 41.3123, longitude: 69.2797 });
    setCurrentView('app');
  };

  return (
    <footer className="bg-[#FDFDFD] dark:bg-[#111111] border-t border-black/[0.06] dark:border-white/[0.06] select-none">

      {/* Final CTA band */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
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
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#111111] dark:bg-[#FDFDFD] text-[#FDFDFD] dark:text-[#111111] text-base font-semibold hover:opacity-80 active:scale-[0.97] transition-all duration-150"
            >
              Hisoblashni boshlash
              <ArrowRight size={16} />
            </button>
            <p className="mt-3 text-xs text-[#A4A9A5]">
              500,000+ O'zbekiston binosi indekslanган · 14 hudud
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
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E9F6E]/10 text-xs font-mono text-[#0E9F6E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0E9F6E] animate-pulse" />
              Ochiq beta · Bepul
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-black/[0.05] dark:border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#A4A9A5]">
            © 2024 MakonSense. Barcha huquqlar himoyalangan.
          </p>
          <p className="text-xs text-[#A4A9A5]">
            O'zbekiston · 14 hudud · 524,476+ bino
          </p>
        </div>
      </div>

    </footer>
  );
};

export default LandingFooter;
