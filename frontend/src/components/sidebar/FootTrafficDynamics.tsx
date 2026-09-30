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
      <div className="bg-[#F8FAF9] border border-[#0C4137]/[0.08] rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#E6FBF6] text-[#0C4137] border border-[#06D6A0]/30">
            <Activity className="w-4 h-4 text-[#06D6A0]" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Kunlik Piyodalar Grafigi</span>
            <div className="text-xs font-bold text-[#0C4137] flex items-center gap-1.5">
              <span>Hafta davomida barqaror oqim</span>
              <TrendingUp className="w-3 h-3 text-[#06D6A0]" />
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-neutral-400 block font-medium">Kechki pik oqim:</span>
          <span className="text-sm font-mono font-bold text-[#0C4137]">18:00 - 20:30</span>
        </div>
      </div>

      {/* Hourly Flow Bar Chart */}
      <div className="bg-white border border-[#0C4137]/[0.08] rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#0C4137] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#06D6A0]" />
            Soatlik Oqim Kuchayishi (24h)
          </span>
          <span className="text-[10px] font-mono text-[#06D6A0] font-bold">
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
                      ? 'bg-[#0C4137] shadow-sm'
                      : isPeak
                      ? 'bg-[#06D6A0]'
                      : 'bg-neutral-200 group-hover:bg-neutral-300'
                  }`}
                  style={{ height: `${adjustedFlow}%` }}
                />
                <span className="text-[8px] font-mono text-neutral-400 group-hover:text-[#0C4137] transform -rotate-45 origin-left hidden sm:block">
                  {item.hour.substring(0, 2)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Key Time Windows */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#0C4137]/[0.06]">
          <div className="bg-[#F8FAF9] p-2.5 rounded-lg border border-[#0C4137]/[0.06] flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-neutral-500 font-medium block">Tushlik To'lqini:</span>
              <span className="text-xs font-bold text-[#0C4137] font-mono">12:00 — 14:00</span>
            </div>
          </div>
          <div className="bg-[#F8FAF9] p-2.5 rounded-lg border border-[#0C4137]/[0.06] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#06D6A0] flex-shrink-0" />
            <div>
              <span className="text-[10px] text-neutral-500 font-medium block">Dam olish kunlari:</span>
              <span className="text-xs font-bold text-[#06D6A0] font-mono">+24% Oqim</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FootTrafficDynamics;
