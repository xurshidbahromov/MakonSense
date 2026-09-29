import React from 'react';
import { Compass, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

export const LandingFooter: React.FC = () => {
  const { setCurrentView } = useAnalyticsStore();

  return (
    <footer className="border-t border-white/[0.08] bg-[#05060A] relative overflow-hidden">
      {/* Final Grand CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-[#111422] to-[#0A0C14] border border-white/10 shadow-2xl overflow-hidden text-center space-y-6">
          {/* Radial ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>0 ms Bepul Skanerlash</span>
          </span>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight max-w-2xl mx-auto">
            Toshkentdagi birinchi tahlilingizni bugunoq bepul boshlang.
          </h2>

          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Bir marta xato joylashuvdan asralgan mablag' — biznesingizning kelgusi 5 yillik barqarorligini ta'minlaydi.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setCurrentView('app')}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black text-sm sm:text-base shadow-xl shadow-emerald-950/60 transition-all duration-200 active:scale-[0.98] group"
            >
              <MapPin className="w-4 h-4" />
              <span>Interaktiv Xaritani Ochish</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Footer Bottom Metadata */}
        <div className="pt-16 pb-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-gray-400 border-t border-white/[0.06] mt-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white p-0.5 border border-white/20 flex items-center justify-center shadow-md overflow-hidden">
              <img src="/brand/1.png" alt="MakonSense" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-extrabold text-white text-sm">MakonSense</span>
              <span className="text-[10px] text-gray-500 block">Spatial Intelligence for Urban Decisions</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-400">
            <a href="#problem-solution" className="hover:text-white transition-colors">Nega MakonSense?</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Qanday ishlaydi?</a>
            <a href="#solutions" className="hover:text-white transition-colors">Sohalar</a>
            <a href="#calculator" className="hover:text-white transition-colors">ROI</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="text-gray-500 text-[11px] text-center sm:text-right">
            © 2026 MakonSense. Barcha huquqlar himoyalangan.<br />
            Toshkent, O'zbekiston.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
