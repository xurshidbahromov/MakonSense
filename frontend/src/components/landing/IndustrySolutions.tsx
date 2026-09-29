import React from 'react';
import { Coffee, ShoppingCart, Pill, Building2, Check, ArrowRight } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

const INDUSTRIES = [
  {
    icon: <Coffee className="w-6 h-6 text-amber-400" />,
    title: 'HoReCa & Qahvaxonalar',
    subtitle: 'Kafe, fast-food, novvoyxona va restoranlar',
    benefits: [
      'Tushlik (12:00-14:00) va kechki (18:00-21:00) piyodalar oqimi tahlili',
      'Universitet, biznes markazlari va metro bekatlari yaqinligi',
      'Yondosh Safia, Dodo, Evos kabi tarmoqlar bosimini hisoblash',
    ],
    badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
  },
  {
    icon: <ShoppingCart className="w-6 h-6 text-emerald-400" />,
    title: 'Chakana Savdo & Retail',
    subtitle: 'Supermarketlar, mini-marketlar va do‘konlar',
    benefits: [
      '500m radiusdagi aniq xonadonlar soni va oilalar zichligi',
      'Korzinka, Makro, Havas tarmoqlaridan xavfsiz masofa filtri',
      'Kechki ishdan qaytuvchi oqim koridorida joylashish imkoni',
    ],
    badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
  },
  {
    icon: <Pill className="w-6 h-6 text-cyan-400" />,
    title: 'Dorixonalar & Optika',
    subtitle: 'Farmatsevtika va tibbiy xizmat tarmoqlari',
    benefits: [
      'Shifoxona, poliklinika va markaziy bekatlar tutashuvi',
      'Grand Pharm, OXYmed, 999 farm bilan masofa balansi',
      '24/7 rejimda ishlovchi yuqori konversiyali nuqtalarni aniqlash',
    ],
    badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
  },
  {
    icon: <Building2 className="w-6 h-6 text-purple-400" />,
    title: 'Developerlar & Ko‘chmas Mulk',
    subtitle: 'TJM birinchi qavatlari (Street Retail) va tijoriy maydonlar',
    benefits: [
      'Yangi majmualardagi tijoriy kvadrat metr qiymatini asoslash',
      'Ijarachilarga (Anchor brendlar) ilmiy spatial audit taqdim etish',
      'Hududning 3-5 yillik urbanistik o‘sish salohiyatini modellashtirish',
    ],
    badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/25',
  },
];

export const IndustrySolutions: React.FC = () => {
  const { setCurrentView } = useAnalyticsStore();

  return (
    <section id="solutions" className="py-20 sm:py-28 relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 font-mono">
            Sohalar Bo‘yicha Yechimlar
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Har bir biznes sohasi uchun individual fazoviy tahlil
          </h2>
          <p className="text-sm sm:text-base text-gray-400">
            Kafening talabi supermarketnikidan, dorixonaning talabi esa kiyim do‘koninikidan tubdan farq qiladi. MakonSense algoritmlari soha xususiyatini inobatga oladi.
          </p>
        </div>

        {/* 4 Industry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {INDUSTRIES.map((ind, idx) => (
            <div
              key={idx}
              className="bg-[#0C0E17]/85 border border-white/[0.08] hover:border-white/20 rounded-3xl p-7 sm:p-8 space-y-6 transition-all duration-300 shadow-xl relative group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl border ${ind.badgeColor}`}>
                    {ind.icon}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-gray-400">
                    Soha #{idx + 1}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {ind.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">{ind.subtitle}</p>
                </div>

                <ul className="space-y-2.5 pt-2">
                  {ind.benefits.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-white/[0.06]">
                <button
                  onClick={() => setCurrentView('app')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all duration-200"
                >
                  <span>Ushbu soha bo'yicha tahlilni boshlash</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustrySolutions;
