import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

export const RoiCalculator: React.FC = () => {
  const { setCurrentView } = useAnalyticsStore();
  const [investment, setInvestment] = useState<number>(45000);

  const himoyalangan = Math.round(investment * 0.85);
  const himoyaPercent = 85;

  const formatUSD = (n: number) =>
    '$' + n.toLocaleString('en-US');

  return (
    <section
      id="calculator"
      className="py-24 sm:py-36 bg-[#FDFDFD] dark:bg-[#111111] border-t border-black/[0.05] dark:border-white/[0.05] select-none"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Label */}
        <span className="font-mono text-xs tracking-[0.18em] uppercase text-[#A4A9A5]">
          ROI Kalkulyator
        </span>

        {/* Headline */}
        <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-[-0.03em] leading-[1.12] text-[#111111] dark:text-[#FDFDFD]">
          Sarmoyangizni{' '}
          <span className="text-[#A4A9A5] font-normal">hisoblang.</span>
        </h2>

        <p className="mt-5 text-base sm:text-lg text-[#A4A9A5] max-w-2xl leading-relaxed">
          Rejalashtirgan investitsiyangizni belgilang — MakonSense himoyalaydigan summa darhol ko'rinadi.
        </p>

        {/* Content */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-0">

          {/* Left: Slider */}
          <div className="lg:pr-20 pb-12 lg:pb-0">
            <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#A4A9A5] mb-6">
              Investitsiya miqdori
            </p>

            {/* Big value */}
            <div className="text-4xl sm:text-6xl font-bold tracking-[-0.035em] text-[#111111] dark:text-[#FDFDFD] mb-8 tabular-nums">
              {formatUSD(investment)}
            </div>

            {/* Range */}
            <input
              type="range"
              min={15000}
              max={150000}
              step={5000}
              value={investment}
              onChange={(e) => setInvestment(Number(e.target.value))}
              className="w-full h-[3px] appearance-none rounded-full cursor-pointer mb-3"
              style={{
                background: `linear-gradient(to right, #0E9F6E ${((investment - 15000) / 135000) * 100}%, #E5E7EB ${((investment - 15000) / 135000) * 100}%)`,
              }}
            />

            <div className="flex justify-between text-xs font-mono text-[#A4A9A5] mt-2">
              <span>$15,000</span>
              <span>$150,000+</span>
            </div>

            {/* Range labels */}
            <div className="mt-6 flex gap-3 flex-wrap">
              {[
                { label: 'Kichik kafe', value: 25000 },
                { label: "Do'kon", value: 75000 },
                { label: 'Restoran', value: 120000 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setInvestment(preset.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                    investment === preset.value
                      ? 'bg-[#0E9F6E] text-[#111111] font-bold shadow-sm'
                      : 'bg-[#111111]/[0.04] dark:bg-white/[0.08] text-[#A4A9A5] hover:text-[#111111] dark:hover:text-[#FDFDFD]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:pl-20 lg:border-l border-black/[0.06] dark:border-white/[0.06]">
            <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#0E9F6E] mb-6">
              MakonSense himoyasi
            </p>

            {/* Protected amount */}
            <div>
              <div className="text-4xl sm:text-6xl font-bold tracking-[-0.035em] text-[#0E9F6E] mb-2 tabular-nums">
                {formatUSD(himoyalangan)}
              </div>
              <p className="text-sm text-[#A4A9A5]">
                noto'g'ri lokatsiya yo'qotishidan himoyalangan kapital
              </p>
            </div>

            {/* Progress bar */}
            <div className="mt-8">
              <div className="flex justify-between text-xs font-mono text-[#A4A9A5] mb-2">
                <span>Himoya darajasi</span>
                <span>{himoyaPercent}%</span>
              </div>
              <div className="h-[3px] bg-[#111111]/[0.06] dark:bg-white/[0.08] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#0E9F6E] rounded-full"
                  animate={{ width: `${himoyaPercent}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Time saved */}
            <div className="mt-10 pt-10 border-t border-black/[0.06] dark:border-white/[0.06]">
              <div className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-[#111111] dark:text-[#FDFDFD] mb-2 tabular-nums">
                4 hafta
              </div>
              <p className="text-sm text-[#A4A9A5]">
                qo'lda tadqiqot o'rniga avtomatik tahlil
              </p>
            </div>
          </div>
        </div>

        {/* Trust pills + CTA */}
        <div className="mt-16 pt-12 border-t border-black/[0.05] dark:border-white/[0.05] flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <button
            onClick={() => setCurrentView('app')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111111] dark:bg-[#FDFDFD] text-[#FDFDFD] dark:text-[#111111] text-sm font-semibold hover:opacity-80 active:scale-[0.97] transition-all duration-150"
          >
            Bepul hisoblashni boshlash
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="flex items-center gap-6 text-xs text-[#A4A9A5]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0E9F6E]" />
              Karta raqami shart emas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0E9F6E]" />
              Bepul ochiq beta
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default RoiCalculator;
