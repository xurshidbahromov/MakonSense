import React from 'react';
import { Compass, FileText, MapPin, Sparkles, Navigation } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

const PRESETS = [
  { name: 'Amir Temur', lat: 41.3120, lon: 69.2800 },
  { name: 'Tashkent City', lat: 41.3142, lon: 69.2483 },
  { name: 'Oybek / Mirobod', lat: 41.2981, lon: 69.2783 },
  { name: 'Chilonzor', lat: 41.2728, lon: 69.2062 },
  { name: 'Chorsu', lat: 41.3275, lon: 69.2359 },
];

export const Header: React.FC = () => {
  const { selectedCoords, setSelectedCoords, generateAuditReport } = useAnalyticsStore();

  return (
    <header className="h-16 border-b border-[#222735] bg-[#090A0F]/90 backdrop-blur-md px-5 flex items-center justify-between z-30 relative select-none">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-blue-500/20 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-950/40">
          <Compass className="w-5 h-5 text-emerald-400 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-white">MakonSense</span>
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              Toshkent MVP
            </span>
          </div>
          <p className="text-[11px] text-gray-400 font-medium hidden sm:block">
            Spatial Intelligence for Urban Decisions
          </p>
        </div>
      </div>

      {/* Preset Hubs */}
      <div className="hidden md:flex items-center gap-1.5 bg-[#13151D] p-1 rounded-xl border border-[#222735]">
        <div className="px-2.5 py-1 text-[11px] text-gray-400 flex items-center gap-1">
          <Navigation className="w-3 h-3 text-cyan-400" />
          <span>Tezkor lokatsiyalar:</span>
        </div>
        {PRESETS.map((p) => {
          const isActive =
            Math.abs(selectedCoords.latitude - p.lat) < 0.002 &&
            Math.abs(selectedCoords.longitude - p.lon) < 0.002;
          return (
            <button
              key={p.name}
              onClick={() => setSelectedCoords({ latitude: p.lat, longitude: p.lon })}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-gray-300 hover:bg-[#1A1E2C] hover:text-white'
              }`}
            >
              {p.name}
            </button>
          );
        })}
      </div>

      {/* Current Coordinate & Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Active Coordinate Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#13151D] border border-[#222735] text-xs font-mono text-gray-300">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {selectedCoords.latitude.toFixed(4)}° N, {selectedCoords.longitude.toFixed(4)}° E
          </span>
        </div>

        {/* Audit PDF Export Button */}
        <button
          onClick={() => generateAuditReport()}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-semibold text-xs transition-all shadow-md shadow-emerald-950/50 hover:shadow-emerald-900/40 active:scale-95"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Avtomatik PDF Audit</span>
          <Sparkles className="w-3 h-3 opacity-75" />
        </button>
      </div>
    </header>
  );
};
