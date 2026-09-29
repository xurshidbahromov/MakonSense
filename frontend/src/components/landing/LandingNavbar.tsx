import React, { useState, useEffect } from 'react';
import { Compass, ArrowRight, Layers, HelpCircle, Calculator, Target, Sparkles } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

export const LandingNavbar: React.FC = () => {
  const { setCurrentView } = useAnalyticsStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#06070B]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-white p-1 border border-white/20 flex items-center justify-center shadow-lg shadow-emerald-950/30 overflow-hidden">
            <img src="/brand/1.png" alt="MakonSense Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-sans">
                MakonSense
              </span>
              <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-bold">
                Toshkent
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium hidden sm:block">
              Spatial Intelligence Platform
            </p>
          </div>
        </div>

        {/* Navigation Anchor Links */}
        <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-gray-300">
          <a href="#problem-solution" className="hover:text-emerald-400 transition-colors">
            Nega MakonSense?
          </a>
          <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
            Qanday ishlaydi?
          </a>
          <a href="#solutions" className="hover:text-emerald-400 transition-colors">
            Sohalar
          </a>
          <a href="#calculator" className="hover:text-emerald-400 transition-colors">
            ROI Kalkulyator
          </a>
          <a href="#faq" className="hover:text-emerald-400 transition-colors">
            Ko'p so'raladiganlar
          </a>
        </div>

        {/* Action Button: Launch Platform */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('app')}
            className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold text-xs sm:text-sm transition-all duration-200 shadow-lg shadow-emerald-950/60 hover:shadow-emerald-900/50 active:scale-[0.97] group"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platformaga Kirish</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
