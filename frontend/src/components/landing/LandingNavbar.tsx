import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

export const LandingNavbar: React.FC = () => {
  const { setCurrentView } = useAnalyticsStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-[#0C4137]/[0.08] shadow-[0_4px_24px_rgba(12,65,55,0.03)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Eyebrow */}
        <div
          className="flex items-center gap-3 cursor-pointer group select-none"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img
            src="/brand/logo_icon.png"
            alt="MakonSense Logo"
            className="h-8 w-auto object-contain transition-transform duration-150 group-hover:scale-105"
          />
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg sm:text-xl tracking-tight text-[#0C4137]">
              MakonSense
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E6FBF6] text-[#0C4137] border border-[#06D6A0]/30 font-semibold hidden sm:inline-block">
              Toshkent
            </span>
          </div>
        </div>

        {/* Navigation Anchor Links */}
        <nav className="hidden md:flex items-center gap-7 text-[14px] font-medium text-neutral-600">
          <a href="#features" className="hover:text-[#0C4137] transition-colors">
            Fazoviy Radar
          </a>
          <a href="#compare" className="hover:text-[#0C4137] transition-colors">
            A/B Taqqoslash
          </a>
          <a href="#solutions" className="hover:text-[#0C4137] transition-colors">
            Sohalar
          </a>
          <a href="#benefits" className="hover:text-[#0C4137] transition-colors">
            Afzalliklar
          </a>
          <a href="#calculator" className="hover:text-[#0C4137] transition-colors">
            Moliya (ROI)
          </a>
          <a href="#faq" className="hover:text-[#0C4137] transition-colors">
            Savol-Javob
          </a>
        </nav>

        {/* Action Button: JPRQ Style Pill Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('app')}
            className="inline-flex items-center gap-2 px-4.5 py-2 rounded-[10px] bg-[#0C4137] hover:bg-[#072822] text-white text-[13px] sm:text-[14px] font-semibold transition-all duration-150 active:scale-[0.98] shadow-sm group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#06D6A0] animate-pulse" />
            <span>Platformaga Kirish</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150 text-[#06D6A0]" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default LandingNavbar;
