import React, { useState } from 'react';
import { Activity, Clock, Flame, Calendar, TrendingUp } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

const HOURLY_FLOW = [
  { hour: '07:00', flow: 25 },
  { hour: '08:00', flow: 68 },
  { hour: '09:00', flow: 84 },
  { hour: '10:00', flow: 60 },
  { hour: '11:00', flow: 55 },
  { hour: '12:00', flow: 92 },
  { hour: '13:00', flow: 96 },
  { hour: '14:00', flow: 78 },
  { hour: '15:00', flow: 62 },
  { hour: '16:00', flow: 68 },
  { hour: '17:00', flow: 82 },
  { hour: '18:00', flow: 98 },
  { hour: '19:00', flow: 95 },
  { hour: '20:00', flow: 88 },
  { hour: '21:00', flow: 65 },
  { hour: '22:00', flow: 42 },
];

export const FootTrafficDynamics: React.FC = () => {
  const { inspection } = useAnalyticsStore();
  const [selectedHour, setSelectedHour] = useState<string>('18:00');
  const transitScore = inspection?.factors?.transit_score || 70;

  // Scale flow slightly according to transit score
  const scale = transitScore / 80;

  return (
    <div className="space-y-4 select-none">
      {/* Header Metric */}
      <div className="bg-[#1A1E2C]/80 border border-[#222735] rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Kunlik Piyodalar Grafigi</span>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Hafta davomida barqaror oqim</span>
              <TrendingUp className="w-3 h-3 text-emerald-400" />
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-gray-400 block">Kechki pik oqim:</span>
          <span className="text-sm font-mono font-bold text-emerald-400">18:00 - 20:30</span>
        </div>
      </div>

      {/* Hourly Flow Bar Chart */}
      <div className="bg-[#161925] border border-[#222735] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Soatlik Oqim Kuchayishi (24h)
          </span>
          <span className="text-[10px] font-mono text-cyan-400">
            {selectedHour}da {Math.min(100, Math.round((HOURLY_FLOW.find(h => h.hour === selectedHour)?.flow || 80) * scale))}% quvvat
          </span>
        </div>

        {/* Bar chart container */}
        <div className="h-28 flex items-end justify-between gap-1 pt-4 pb-1">
          {HOURLY_FLOW.map((item) => {
            const adjustedFlow = Math.min(100, Math.round(item.flow * scale));
            const isSelected = selectedHour === item.hour;
            const isPeak = adjustedFlow >= 85;

            return (
              <div
                key={item.hour}
                onClick={() => setSelectedHour(item.hour)}
                className="flex-1 flex flex-col items-center gap-1 group cursor-pointer h-full justify-end"
              >
                <div
                  className={`w-full rounded-t transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-t from-emerald-500 to-teal-300 shadow-lg shadow-emerald-500/30'
                      : isPeak
                      ? 'bg-gradient-to-t from-cyan-600 to-cyan-400 opacity-80 group-hover:opacity-100'
                      : 'bg-[#222735] group-hover:bg-[#2E3547]'
                  }`}
                  style={{ height: `${adjustedFlow}%` }}
                />
                <span className="text-[8px] font-mono text-gray-500 group-hover:text-gray-300 transform -rotate-45 origin-left hidden sm:block">
                  {item.hour.substring(0, 2)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Key Time Windows */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#222735]">
          <div className="bg-[#13151D] p-2.5 rounded-lg border border-[#222735] flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-gray-400 font-medium block">Tushlik To'lqini:</span>
              <span className="text-xs font-bold text-white font-mono">12:00 — 14:00</span>
            </div>
          </div>
          <div className="bg-[#13151D] p-2.5 rounded-lg border border-[#222735] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-gray-400 font-medium block">Dam olish kunlari:</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">+24% Oqim</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
