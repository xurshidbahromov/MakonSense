import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  MapPin,
  FileText,
  Clock,
  Zap,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  BarChart3,
} from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

export const ProblemSolution: React.FC = () => {
  const { setCurrentView, generateAuditReport } = useAnalyticsStore();

  return (
    <section id="benefits" className="py-24 sm:py-36 select-none border-t border-[#0C4137]/[0.08] bg-[#F7F9F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-4xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#E6FBF6] border border-[#06D6A0]/30 text-[#0C4137] text-xs font-mono font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-[#06D6A0]" />
            <span>FAZOVIY GEOMARKETINGNING KUCHI</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-[#0C4137] tracking-tight leading-[1.08]">
            Subyektiv taxminlarga emas, <br />
            <span className="text-neutral-400 font-normal">Toshkent shahrining aniq raqamlariga ishoning.</span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-neutral-600 max-w-2xl leading-relaxed">
            Yangi shoxobcha ochish — oylab ko‘chalarda odamlarni sanash degani emas. MakonSense 150,000+ shahar obyektlarini bir zumda tahlil qilib, xatarlardan asraydi.
          </p>
        </div>

        {/* Enterprise Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Bento Card 1 (Large 7 Cols): Before vs After Comparison */}
          <div className="lg:col-span-7 rounded-[20px] bg-white border border-[#0C4137]/[0.1] p-7 sm:p-9 shadow-[0_12px_40px_rgba(12,65,55,0.05)] flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#0C4137]/[0.06]">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                  Lokatsiya Tanlash Metodikasi
                </span>
                <span className="px-2.5 py-1 rounded-[6px] bg-[#E6FBF6] text-[#0C4137] border border-[#06D6A0]/30 text-xs font-bold">
                  94.2% Qaror Aniqligi
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                {/* Old Way */}
                <div className="p-5 rounded-[14px] bg-[#FDF2F2] border border-rose-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase font-mono">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Eski, Noaniq Usul</span>
                  </div>
                  <ul className="space-y-2 text-xs text-neutral-600">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span>3–4 haftalik ko‘cha kuzatuvi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span>Ijara beruvchining yolg‘on va’dalari</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span>45% yangi nuqtalar 1-yilda yopiladi</span>
                    </li>
                  </ul>
                </div>

                {/* MakonSense Way */}
                <div className="p-5 rounded-[14px] bg-[#E6FBF6] border border-[#06D6A0]/40 space-y-3 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0C4137] uppercase font-mono">
                    <Zap className="w-4 h-4 text-[#06D6A0]" />
                    <span>MakonSense Intellekti</span>
                  </div>
                  <ul className="space-y-2 text-xs text-[#0C4137] font-medium">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#06D6A0] flex-shrink-0" />
                      <span>5 soniyalik PostGIS & H3 tahlili</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#06D6A0] flex-shrink-0" />
                      <span>48 ta metro va 2,400+ raqobatchi xaritasi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#06D6A0] flex-shrink-0" />
                      <span>Bank va investorlar uchun rasmiy xulosa</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#0C4137]/[0.06] flex items-center justify-between text-xs text-neutral-500">
              <span>Toshkent shahri uchun yagona xolis tahlil</span>
              <button
                onClick={() => setCurrentView('app')}
                className="font-bold text-[#0C4137] hover:text-[#06D6A0] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Xaritada o‘zingiz sinab ko‘ring</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#06D6A0]" />
              </button>
            </div>
          </div>

          {/* Bento Card 2 (5 Cols): Kannibalizatsiya va Raqobat Xavfsizligi */}
          <div className="lg:col-span-5 rounded-[20px] bg-white border border-[#0C4137]/[0.1] p-7 sm:p-9 shadow-[0_12px_40px_rgba(12,65,55,0.05)] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-[12px] bg-[#E6FBF6] border border-[#06D6A0]/30 flex items-center justify-center text-[#0C4137]">
                <ShieldCheck className="w-6 h-6 text-[#06D6A0]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0C4137] tracking-tight">
                Raqobat va Kannibalizatsiya Himoyasi
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                400m va 800m radiusdagi toifadosh tarmoqlar avtomatik filtrlanadi. O‘z tarmoq filialingiz boshqa filialingiz mijozlarini tortib ketmasligi kafolatlanadi.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-[#0C4137]/[0.06] flex items-center justify-between">
              <div>
                <div className="text-2xl font-black text-[#0C4137] font-mono">0%</div>
                <div className="text-[11px] text-neutral-400 uppercase font-mono">Ichki to‘qnashuv xavfi</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-[#06D6A0] font-mono">350m+</div>
                <div className="text-[11px] text-neutral-400 uppercase font-mono">Monopol xavfsiz bufer</div>
              </div>
            </div>
          </div>

          {/* Bento Card 3 (5 Cols): 5 Bo'limli PDF Audit Hujjati */}
          <div className="lg:col-span-5 rounded-[20px] bg-white border border-[#0C4137]/[0.1] p-7 sm:p-9 shadow-[0_12px_40px_rgba(12,65,55,0.05)] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-[12px] bg-[#E6FBF6] border border-[#06D6A0]/30 flex items-center justify-center text-[#0C4137]">
                <FileText className="w-6 h-6 text-[#06D6A0]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0C4137] tracking-tight">
                Bank va Investorlar uchun Rasmiy Audit
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                1 klikda professional 5 sahifali PDF hisobot generatsiya qilinadi. Unda SWOT tahlili, piyodalar grafigi va rentabellik bahosi mavjud.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#0C4137]/[0.06]">
              <button
                onClick={() => generateAuditReport()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-[10px] bg-[#F7F9F8] hover:bg-[#E6FBF6] border border-[#0C4137]/[0.1] text-xs font-bold text-[#0C4137] transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#06D6A0]" />
                <span>PDF Audit Namunasi (Ko‘rish)</span>
              </button>
            </div>
          </div>

          {/* Bento Card 4 (Large 7 Cols): Toshkent Shahri Infratuzilmasi */}
          <div className="lg:col-span-7 rounded-[20px] bg-white border border-[#0C4137]/[0.1] p-7 sm:p-9 shadow-[0_12px_40px_rgba(12,65,55,0.05)] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#0C4137]/[0.06]">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-400 font-semibold">
                  <Compass className="w-4 h-4 text-[#06D6A0]" />
                  <span>Toshkent Shahri Fazoviy Qamrovi</span>
                </div>
                <span className="text-xs font-bold text-[#06D6A0] font-mono">12 Tuman</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#0C4137] tracking-tight">
                48 ta metro bekati va 150,000+ shahar binolari
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-[10px] bg-[#F7F9F8] border border-[#0C4137]/[0.06] text-center">
                  <div className="text-xl font-black text-[#0C4137] font-mono">48</div>
                  <div className="text-[10px] text-neutral-500 font-medium">Metro Bekati</div>
                </div>
                <div className="p-3 rounded-[10px] bg-[#F7F9F8] border border-[#0C4137]/[0.06] text-center">
                  <div className="text-xl font-black text-[#0C4137] font-mono">150k+</div>
                  <div className="text-[10px] text-neutral-500 font-medium">Shahar Binolari</div>
                </div>
                <div className="p-3 rounded-[10px] bg-[#F7F9F8] border border-[#0C4137]/[0.06] text-center">
                  <div className="text-xl font-black text-[#0C4137] font-mono">2,400+</div>
                  <div className="text-[10px] text-neutral-500 font-medium">POI Obyektlar</div>
                </div>
                <div className="p-3 rounded-[10px] bg-[#E6FBF6] border border-[#06D6A0]/30 text-center">
                  <div className="text-xl font-black text-[#0C4137] font-mono">100%</div>
                  <div className="text-[10px] text-[#0C4137] font-bold">Xolis Baholash</div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-[#0C4137]/[0.06] flex items-center justify-between text-xs text-neutral-500">
              <span>Yunusobod, Chilonzor, Mirobod, Sergeli va barcha tumanlar</span>
              <span className="text-[#06D6A0] font-semibold">Doimiy yangilanishda</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
