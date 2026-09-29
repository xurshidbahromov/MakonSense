import React from 'react';
import { Compass, FileText, Sparkles, MapPin, ArrowLeft } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { SearchBar } from '../ui/SearchBar';

export const Header: React.FC = () => {
  const { selectedCoords, generateAuditReport, setCurrentView } = useAnalyticsStore();

  return (
    <header className="h-16 border-b border-white/[0.08] bg-[#06070B]/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between z-30 relative select-none">
      {/* Brand Identity & Back to Landing */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentView('landing')}
          title="Bosh sahifaga qaytish"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-semibold transition-all active:scale-95 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">Bosh sahifa</span>
        </button>

        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => setCurrentView('landing')}
        >
          <div className="w-8 h-8 rounded-lg bg-white p-0.5 border border-white/20 flex items-center justify-center shadow-lg shadow-emerald-950/30 overflow-hidden">
            <img src="/brand/1.png" alt="MakonSense Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">MakonSense</span>
              <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                PRO
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Central Search Bar with Autocomplete */}
      <div className="flex-1 max-w-sm sm:max-w-md mx-3 hidden sm:block">
        <SearchBar />
      </div>

      {/* Action Buttons & Current Coords */}
      <div className="flex items-center gap-2.5">
        {/* Active Coordinate Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#13151D] border border-white/[0.08] text-xs font-mono text-gray-300">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {selectedCoords.latitude.toFixed(4)}° N, {selectedCoords.longitude.toFixed(4)}° E
          </span>
        </div>

        {/* Audit PDF Export Button */}
        <button
          onClick={() => generateAuditReport()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs transition-all shadow-md shadow-emerald-950/50 hover:shadow-emerald-900/40 active:scale-[0.98]"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Avtomatik PDF Audit</span>
          <span className="sm:hidden">Audit</span>
          <Sparkles className="w-3 h-3 opacity-75" />
        </button>
      </div>
    </header>
  );
};

export default Header;
