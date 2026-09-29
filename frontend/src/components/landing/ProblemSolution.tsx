import React from 'react';
import { XCircle, CheckCircle2, TrendingDown, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ProblemSolution: React.FC = () => {
  return (
    <section id="problem-solution" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 font-mono">
            Muammo va Ilmiy Yechim
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Ko'r-ko'rona joy tanlash va sarmoyani yo'qotish davri tugadi.
          </h2>
          <p className="text-sm sm:text-base text-gray-400">
            Toshkentda chakana savdo va xizmat ko'rsatish bozorida muvaffaqiyat — subyektiv sezgilarga emas, aniq fazoviy ma'lumotlarga tayanadi.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: The Old Way (Pain & Risk) */}
          <div className="bg-[#120F16]/90 border border-rose-500/20 rounded-3xl p-7 sm:p-9 space-y-6 relative overflow-hidden shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-rose-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">An'anaviy Usul (Subyektiv Taxmin)</h3>
                    <p className="text-xs text-rose-400/80">Katta moliyaviy xatarlar va tavakkalchilik</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/25">
                  Yuqori Xavf
                </span>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Ko'z bilan baholash:</strong> "Odam ko'p ekan" deb joy ijaraga olinadi, ammo o'tib ketuvchilar sizning maqsadli auditoriyangiz emasligi keyin ma'lum bo'ladi.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Yashirin raqobat bosimi:</strong> 200–300 metr naridagi toifadosh kuchli tarmoqli o'yinchilar sizning savdongizni tortib ketadi (kannibalizatsiya).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Katta moliyaviy zarar:</strong> Ta'mirlash, ijara depoziti va uskunalar uchun <strong>$30,000 dan $100,000 gacha</strong> sarmoya havoga uchadi.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Yopilish statistikasi:</strong> Yangi savdo va xizmat ko'rsatish shoxobchalarining 45% i birinchi 6–12 oyda faoliyatini to'xtatishga majbur bo'ladi.
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-white/[0.06] text-xs text-rose-300/80 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Natija: Sarflangan asab, yo'qotilgan vaqt va qaytmas millionlab dollar zarar.</span>
            </div>
          </div>

          {/* Card 2: The MakonSense Way (Scientific Spatial Intelligence) */}
          <div className="bg-[#0C1518]/90 border border-emerald-500/30 rounded-3xl p-7 sm:p-9 space-y-6 relative overflow-hidden shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">MakonSense Usuli (Fazoviy Intellekt)</h3>
                    <p className="text-xs text-emerald-400">Ilmiy algoritmlar va PostGIS tahlili</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Kafolatlangan Aniqlik
                </span>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Piyodalar va Tranzit Oqimi (30%):</strong> Metro bekatlari va piyodalar magistralining aniq matematik tortish kuchi hisoblanadi.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Yirik Tortish Markazlari (25%):</strong> Savdo markazlari (Mall), bozorlar, universitet va maktablar oqimi hisobga olinadi.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Raqobat Bosimi Filtr (-25%):</strong> 400 metr radiusdagi bevosita raqobatchilar masofasi va zichligi avtomatik jarima sifatida hisoblanadi.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Aholi Qamrovi (20%):</strong> Atrofdagi zamonaviy turar-joy massivlari va xonadonlar potensiali to'liq modellashtiriladi.
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-white/[0.06] text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Natija: 0 dan 100 gacha shaffof MakonScore reytingi va xavfsiz investitsiya qarori.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
