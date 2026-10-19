import React, { useState } from 'react';
import { Activity, Clock, Flame, Users, DollarSign } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

export const FootTrafficDynamics: React.FC = () => {
  const { inspection, category } = useAnalyticsStore();
  const [dayMode, setDayMode] = useState<'weekday' | 'weekend'>('weekday');
  const [selectedSlotIdx, setSelectedSlotIdx] = useState<number>(4); // default 19:00 peak

  const slots = inspection?.context?.hourly_traffic || [];
  const fin = inspection?.context?.financials;

  const maxFlow = Math.max(
    1,
    ...slots.map((s) => (dayMode === 'weekday' ? s.weekday_flow : s.weekend_flow))
  );

  const activeSlot = slots[selectedSlotIdx] || slots[0];
  const activeFlow = activeSlot
    ? dayMode === 'weekday'
      ? activeSlot.weekday_flow
      : activeSlot.weekend_flow
    : 2400;

  return (
    <div className="space-y-3.5">
      {/* Header Banner + Weekday/Weekend Switcher */}
      <div className="spatial-glass-subcard rounded-2xl p-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#0E9F6E]/10 text-[#0E9F6E] border border-[#0E9F6E]/25">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-[#7A807C] dark:text-[#9CA3AF] tracking-wider">
              Piyodalar Dinamikasi ({category.toUpperCase()})
            </span>
            <div className="text-xs font-bold text-[#111111] dark:text-[#FDFDFD] tabular-nums">
              Kunlik ~{(fin?.daily_foot_traffic || 14200).toLocaleString()} piyoda
            </div>
          </div>
        </div>

        {/* Day Type Toggle — Concentric radius: outer rounded-lg (8px) - p-0.5 (2px) = inner rounded-[6px] */}
        <div
          role="group"
          aria-label="Kun turi"
          className="flex items-center bg-black/[0.05] dark:bg-white/[0.06] p-0.5 rounded-lg border border-black/[0.05] dark:border-white/[0.06] text-[10px] font-semibold select-none"
        >
          <button
            type="button"
            aria-pressed={dayMode === 'weekday'}
            onClick={() => setDayMode('weekday')}
            className={`press-scale px-2 py-1 rounded-[6px] cursor-pointer ${
              dayMode === 'weekday'
                ? 'bg-white dark:bg-[#27272A] text-[#111111] dark:text-white shadow-sm'
                : 'text-[#6E7470] dark:text-[#9CA3AF]'
            }`}
          >
            Ish kuni
          </button>
          <button
            type="button"
            aria-pressed={dayMode === 'weekend'}
            onClick={() => setDayMode('weekend')}
            className={`press-scale px-2 py-1 rounded-[6px] cursor-pointer ${
              dayMode === 'weekend'
                ? 'bg-white dark:bg-[#27272A] text-[#111111] dark:text-white shadow-sm'
                : 'text-[#6E7470] dark:text-[#9CA3AF]'
            }`}
          >
            Dam olish
          </button>
        </div>
      </div>

      {/* Interactive Hourly Bar Chart */}
      <div className="spatial-glass-subcard rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#111111] dark:text-[#FDFDFD] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#0E9F6E]" />
            <span>Soatlik Oqim va Konversiya</span>
          </span>
          {activeSlot && (
            <span className="text-[11px] font-mono tabular-nums text-[#0E9F6E] font-bold">
              {activeSlot.hour} · ~{activeFlow.toLocaleString()} kishi
            </span>
          )}
        </div>

        {/* Bars */}
        <div className="h-28 flex items-end justify-between gap-2 pt-3 pb-1 px-1 select-none">
          {slots.map((slot, idx) => {
            const val = dayMode === 'weekday' ? slot.weekday_flow : slot.weekend_flow;
            const heightPct = Math.max(14, Math.round((val / maxFlow) * 100));
            const isSelected = idx === selectedSlotIdx;
            const isPeak = heightPct >= 85;

            return (
              <button
                key={slot.hour}
                type="button"
                aria-label={`${slot.hour}: ${val.toLocaleString()} piyoda`}
                onClick={() => setSelectedSlotIdx(idx)}
                className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer h-full justify-end"
              >
                <span className="text-[9px] font-mono tabular-nums text-[#7A807C] dark:text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity">
                  {(val / 1000).toFixed(1)}k
                </span>
                <div
                  className={`w-full rounded-t-md ${
                    isSelected
                      ? 'bg-[#111111] dark:bg-white shadow-sm'
                      : isPeak
                      ? 'bg-[#0E9F6E]'
                      : 'bg-black/[0.12] dark:bg-white/[0.14] group-hover:bg-[#0E9F6E]/60'
                  }`}
                  style={{
                    height: `${heightPct}%`,
                    transition: 'height 320ms cubic-bezier(0.22, 1, 0.36, 1), background-color 150ms ease',
                  }}
                />
                <span
                  className={`text-[10px] font-mono tabular-nums ${
                    isSelected
                      ? 'font-bold text-[#111111] dark:text-white'
                      : 'text-[#7A807C] dark:text-[#9CA3AF]'
                  }`}
                >
                  {slot.hour}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Slot Detail Strip */}
        {activeSlot && (
          <div className="bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.06] rounded-xl p-2.5 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2 min-w-0">
              <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-[#525854] dark:text-[#D1D5DB] truncate font-medium">
                {activeSlot.label}
              </span>
            </div>
            <span className="font-mono tabular-nums font-bold text-[#0E9F6E] shrink-0 ml-2">
              Konversiya: {activeSlot.conversion_rate}%
            </span>
          </div>
        )}
      </div>

      {/* Customer Funnel & Unit Economics Summary */}
      {fin && (
        <div className="grid grid-cols-2 gap-2.5 select-text">
          <div className="spatial-glass-subcard rounded-2xl p-3 flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#0E9F6E]/10 text-[#0E9F6E]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#7A807C] dark:text-[#9CA3AF] block select-none">
                Kutilayotgan mijozlar
              </span>
              <span className="text-xs font-mono tabular-nums font-bold text-[#111111] dark:text-[#FDFDFD]">
                ~{fin.estimated_customers_daily} xarid / kun
              </span>
            </div>
          </div>

          <div className="spatial-glass-subcard rounded-2xl p-3 flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#7A807C] dark:text-[#9CA3AF] block select-none">
                O‘rtacha chek & Ijara
              </span>
              <span className="text-xs font-mono tabular-nums font-bold text-[#111111] dark:text-[#FDFDFD]">
                ${fin.avg_check_usd} · ${fin.estimated_rent_sqm_usd}/m²
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FootTrafficDynamics;
