import React from 'react';
import { Compass, FileText, Sparkles, MapPin } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { SearchBar } from '../ui/SearchBar';

export const Header: React.FC = () => {
  const { selectedCoords, generateAuditReport } = useAnalyticsStore();

  return (
    <header className="h-16 border-b border-[#222735] bg-[#06070B]/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between z-30 relative select-none">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-blue-500/20 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-950/40">
          <Compass className="w-5 h-5 text-emerald-400 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">MakonSense</span>
            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              v1.0 Pro
            </span>
          </div>
          <p className="text-[10px] text-gray-400 font-medium hidden md:block">
            Spatial Intelligence for Urban Decisions
          </p>
        </div>
      </div>

      {/* Central Search Bar with Autocomplete */}
      <div className="flex-1 max-w-sm sm:max-w-md mx-4 hidden sm:block">
        <SearchBar />
      </div>

      {/* Action Buttons & Current Coords */}
      <div className="flex items-center gap-3">
        {/* Active Coordinate Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#13151D] border border-[#222735] text-xs font-mono text-gray-300">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {selectedCoords.latitude.toFixed(4)}° N, {selectedCoords.longitude.toFixed(4)}° E
          </span>
        </div>

        {/* Audit PDF Export Button */}
        <button
          onClick={() => generateAuditReport()}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs transition-all shadow-md shadow-emerald-950/50 hover:shadow-emerald-900/40 active:scale-[0.98]"
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
