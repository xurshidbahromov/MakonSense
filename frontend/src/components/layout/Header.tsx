import React from 'react';
import { FileText, Sparkles, MapPin, ArrowLeft } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { SearchBar } from '../ui/SearchBar';

export const Header: React.FC = () => {
  const { selectedCoords, generateAuditReport, setCurrentView } = useAnalyticsStore();

  return (
    <header className="h-16 border-b border-[#0C4137]/[0.08] bg-white/90 backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between z-30 relative select-none">
      {/* Brand Identity & Back to Landing */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentView('landing')}
          title="Bosh sahifaga qaytish"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200/80 border border-[#0C4137]/[0.08] text-[#0C4137] text-xs font-semibold transition-all duration-150 ease-out active:scale-[0.96] group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#06D6A0] group-hover:-translate-x-0.5 transition-transform duration-150" />
          <span className="hidden sm:inline">Bosh sahifa</span>
        </button>

        <div
          className="flex items-center gap-2.5 cursor-pointer group select-none"
          onClick={() => setCurrentView('landing')}
        >
          <img
            src="/brand/logo_icon.png"
            alt="MakonSense Logo"
            className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-[0_2px_8px_rgba(6,214,160,0.3)]"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base tracking-tight text-[#0C4137]">MakonSense</span>
              <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-[#E6FBF6] text-[#0C4137] border border-[#06D6A0]/30 font-mono font-bold">
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
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F8FAF9] border border-[#0C4137]/[0.08] text-xs font-mono text-neutral-600">
          <MapPin className="w-3.5 h-3.5 text-[#06D6A0]" />
          <span>
            {selectedCoords.latitude.toFixed(4)}° N, {selectedCoords.longitude.toFixed(4)}° E
          </span>
        </div>

        {/* Audit PDF Export Button */}
        <button
          onClick={() => generateAuditReport()}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0C4137] hover:bg-[#072822] text-white font-semibold text-xs transition-all duration-150 ease-out shadow-sm active:scale-[0.96]"
        >
          <FileText className="w-3.5 h-3.5 text-[#06D6A0]" />
          <span className="hidden sm:inline">Avtomatik PDF Audit</span>
          <span className="sm:hidden">Audit</span>
          <Sparkles className="w-3 h-3 text-[#06D6A0]" />
        </button>
      </div>
    </header>
  );
};

export default Header;
