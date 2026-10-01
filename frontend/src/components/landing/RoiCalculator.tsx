import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

export const RoiCalculator: React.FC = () => {
  const { setCurrentView } = useAnalyticsStore();
  const [investment, setInvestment] = useState<number>(45000);

  const himoyalangan = Math.round(investment * 0.85);
  const himoyaPercent = 85;

  const formatUSD = (n: number) =>
    '$' + n.toLocaleString('en-US');

  const sliderPercent = ((investment - 15000) / 135000) * 100;

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
              className="w-full h-[4px] appearance-none rounded-full cursor-pointer mb-3 accent-[#0E9F6E]"
              style={{
                background: `linear-gradient(to right, #0E9F6E ${sliderPercent}%, rgba(160, 160, 160, 0.22) ${sliderPercent}%)`,
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
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    investment === preset.value
                      ? 'bg-[#111111] text-white dark:bg-[#FDFDFD] dark:text-[#111111] shadow-sm'
                      : 'bg-black/[0.04] dark:bg-white/[0.06] text-neutral-500 hover:text-[#111111] dark:hover:text-white'
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
            className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#111111] hover:bg-neutral-800 text-white dark:bg-[#FDFDFD] dark:hover:bg-neutral-200 dark:text-[#111111] text-sm font-semibold cursor-pointer transition-all duration-200 shadow-sm active:scale-[0.98]"
          >
            <span>Bepul hisoblashni boshlash</span>
            <ArrowRight className="w-4 h-4 text-white/80 group-hover:text-white dark:text-[#111111]/80 dark:group-hover:text-[#111111] transition-transform duration-200 ease-out group-hover:translate-x-1" />
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
