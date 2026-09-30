import React, { useState } from 'react';
import { Coffee, ShoppingCart, Pill, Building2, ArrowRight, TrendingUp, Users, ShieldCheck, DollarSign, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

interface UseCaseItem {
  id: string;
  name: string;
  categoryLabel: string;
  icon: React.ReactNode;
  location: string;
  score: number;
  grade: string;
  monthlyRevenue: string;
  footTraffic: string;
  averageCheck: string;
  competition: string;
  peakHours: string;
  hourlyTraffic: { hour: string; height: string; active?: boolean }[];
  summary: string;
  advantages: string[];
}

const USE_CASES: UseCaseItem[] = [
  {
    id: 'cafe',
    name: 'HoReCa & Qahvaxona',
    categoryLabel: 'HoReCa, Kafe & Fast-food',
    icon: <Coffee className="w-4 h-4 text-[#06D6A0]" />,
    location: 'Amir Temur Xiyoboni, Markaz',
    score: 94.0,
    grade: 'A-Grade Lokatsiya',
    monthlyRevenue: '$18,500 – $26,000',
    footTraffic: '18,400+ yo‘lovchi / kun',
    averageCheck: '52,000 so‘m',
    competition: '2 ta nuqta (Masofa: 350m)',
    peakHours: '12:30–14:00 va 18:00–21:00',
    hourlyTraffic: [
      { hour: '09:00', height: '40%' },
      { hour: '12:00', height: '85%', active: true },
      { hour: '15:00', height: '55%' },
      { hour: '18:00', height: '95%', active: true },
      { hour: '21:00', height: '70%' },
    ],
    summary:
      'Metro va yirik ofis markazlari tutashuvi hisobiga ertalabki kofe va kechki ovqatlanish uchun Toshkentdagi eng yuqori konversiyali nuqta.',
    advantages: [
      'Amir Temur metro bekatiga piyoda 2 daqiqa',
      'Yaqin 500 metrda 14 ta yirik biznes markaz',
      'Kross-trafik: talabalar va shahar mehmonlari oqimi',
    ],
  },
  {
    id: 'supermarket',
    name: 'Supermarket & Chakana Savdo',
    categoryLabel: 'Oziq-ovqat va Do‘konlar',
    icon: <ShoppingCart className="w-4 h-4 text-[#06D6A0]" />,
    location: 'Chilonzor 9-Mavze, Aholi Massivi',
    score: 88.0,
    grade: 'Yuqori Xarid Talabi',
    monthlyRevenue: '$35,000 – $52,000',
    footTraffic: '14,200+ xaridor / kun',
    averageCheck: '78,000 so‘m',
    competition: '1 ta Havas (420m uzoqda)',
    peakHours: '17:30–20:30 (Kechki qaytish)',
    hourlyTraffic: [
      { hour: '09:00', height: '30%' },
      { hour: '12:00', height: '45%' },
      { hour: '15:00', height: '50%' },
      { hour: '18:00', height: '98%', active: true },
      { hour: '21:00', height: '65%' },
    ],
    summary:
      'Zich ko‘p qavatli xonadonlar massivi ichida joylashgan. Aholi har kuni ishdan qaytishda oziq-ovqat xarid qiluvchi tabiiy piyoda koridori.',
    advantages: [
      '3,800 ta xonadon bevosita 500m radiusda',
      'Korzinka va Makro kabi gigantlardan xavfsiz bufer',
      'Chilonzor metro bekatidan uyga piyoda qaytish marshruti',
    ],
  },
  {
    id: 'pharmacy',
    name: 'Dorixona & Optika',
    categoryLabel: 'Farmatsevtika & Tibbiyot',
    icon: <Pill className="w-4 h-4 text-[#06D6A0]" />,
    location: 'Oybek / Mirobod, Tibbiyot Xabi',
    score: 91.5,
    grade: 'Yuqori Retsept Oqimi',
    monthlyRevenue: '$22,000 – $34,000',
    footTraffic: '16,100+ yo‘lovchi / kun',
    averageCheck: '64,000 so‘m',
    competition: 'Monopol radius: 260 metr',
    peakHours: '10:00–12:30 va 17:00–19:30',
    hourlyTraffic: [
      { hour: '09:00', height: '60%' },
      { hour: '12:00', height: '80%', active: true },
      { hour: '15:00', height: '70%' },
      { hour: '18:00', height: '90%', active: true },
      { hour: '21:00', height: '50%' },
    ],
    summary:
      'Shifoxona, oilaviy poliklinika va markaziy metro tutashuvida joylashgan bo‘lib, 24/7 navbatchi dorixona formati uchun eng ideal lokatsiya.',
    advantages: [
      '300m radiusda 2 ta markaziy tibbiyot muassasasi',
      'Oybek va Ming O‘rik metro bekatlari kesishmasi',
      'Kechki va tungi soatlarda barqaror sotuv kafolati',
    ],
  },
  {
    id: 'realestate',
    name: 'Tijoriy Ko‘chmas Mulk',
    categoryLabel: 'Developerlar & Street Retail',
    icon: <Building2 className="w-4 h-4 text-[#06D6A0]" />,
    location: 'Tashkent City Boulevard',
    score: 93.5,
    grade: 'Premium Tijoriy Zona',
    monthlyRevenue: '$40,000 – $65,000',
    footTraffic: '22,000+ tashrif / kun',
    averageCheck: '120,000 so‘m',
    competition: 'Flagman shoxobchalar',
    peakHours: '14:00–22:00 (Dam olish kunlari)',
    hourlyTraffic: [
      { hour: '09:00', height: '40%' },
      { hour: '12:00', height: '70%' },
      { hour: '15:00', height: '85%' },
      { hour: '18:00', height: '100%', active: true },
      { hour: '21:00', height: '90%', active: true },
    ],
    summary:
      'Yangi zamonaviy majmualarning birinchi qavatlari uchun street-retail auditi. Kvadrat metr narxini investor va ijarachilarga xolis asoslab bering.',
    advantages: [
      '4,200 ta xonadon + 18,000 nafar ofis xodimlari',
      'Tashkent City Mall savdo markazining kuchli gravitatsiyasi',
      'Franchayzing va flagman do‘konlar uchun nufuzli manzil',
    ],
  },
];

export const IndustrySolutions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('cafe');
  const { setCurrentView } = useAnalyticsStore();

  const current = USE_CASES.find((u) => u.id === activeTab) || USE_CASES[0];

  return (
    <section id="solutions" className="py-20 sm:py-32 select-none border-t border-[#0C4137]/[0.08] bg-[#FBFBFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Pure Business Geomarketing */}
        <div className="max-w-4xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#E6FBF6] border border-[#06D6A0]/30 text-[#0C4137] text-xs font-mono font-semibold mb-4">
            <span className="text-[#06D6A0]">●</span>
            <span>SOHAVIY BIZNES MODELLAR</span>
          </div>

          <h2 className="text-[clamp(1.8rem,4vw,3.8rem)] font-bold leading-[1.08] tracking-tight text-[#0C4137]">
            Bitta platforma.{' '}
            <span className="text-neutral-400 font-normal">Har bir biznes sohasi uchun individual tahlil.</span>
          </h2>

          <p className="mt-4 text-[16px] sm:text-[18px] text-neutral-600 max-w-2xl leading-relaxed">
            Qahvaxonaning talabi supermarketnikidan, dorixonanikidan yoki kiyim do‘koninikidan tubdan farq qiladi. MakonSense har bir soha parametrlarini alohida mezonlar bilan o‘lchaydi.
          </p>
        </div>

        {/* Segmented Industry Tab Bar */}
        <div className="inline-flex max-w-full flex-wrap gap-2 rounded-[14px] bg-[#F4F6F5] p-1.5 border border-[#0C4137]/[0.06]">
          {USE_CASES.map((item) => {
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] sm:text-[14px] font-semibold transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                  isSelected
                    ? 'bg-[#0C4137] text-white shadow-sm'
                    : 'text-neutral-600 hover:text-[#0C4137] hover:bg-black/[0.03]'
                }`}
              >
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Executive Commercial Simulation Dashboard */}
        <div className="mt-8 rounded-[18px] border border-[#0C4137]/[0.1] bg-white p-6 sm:p-10 shadow-[0_16px_50px_rgba(12,65,55,0.06)] space-y-8">
          {/* Dashboard Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#0C4137]/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-[#E6FBF6] border border-[#06D6A0]/30 flex items-center justify-center">
                {current.icon}
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
                  {current.categoryLabel}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#06D6A0]" />
                  <span className="text-base sm:text-lg font-bold text-[#0C4137]">{current.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-[8px] bg-[#E6FBF6] border border-[#06D6A0]/30 text-right">
                <div className="text-[10px] font-mono text-neutral-400 uppercase font-semibold">MakonScore Indeksi</div>
                <div className="text-lg font-extrabold text-[#0C4137] font-mono">
                  {current.score} <span className="text-xs text-[#06D6A0]">/ 100</span>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-[8px] bg-[#0C4137] text-white text-xs font-semibold">
                {current.grade}
              </div>
            </div>
          </div>

          {/* 4 Commercial Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4.5 rounded-[12px] bg-[#F7F9F8] border border-[#0C4137]/[0.08] space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
                <DollarSign className="w-4 h-4 text-[#06D6A0]" />
                <span>Oylik Savdo Potensiali</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#0C4137] font-mono pt-1">
                {current.monthlyRevenue}
              </div>
              <div className="text-[11px] text-[#06D6A0] font-semibold">Rentabellik: Yuqori</div>
            </div>

            <div className="p-4.5 rounded-[12px] bg-[#F7F9F8] border border-[#0C4137]/[0.08] space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
                <Users className="w-4 h-4 text-[#06D6A0]" />
                <span>Piyodalar Oqimi</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#0C4137] font-mono pt-1">
                {current.footTraffic}
              </div>
              <div className="text-[11px] text-neutral-500">Pik: {current.peakHours}</div>
            </div>

            <div className="p-4.5 rounded-[12px] bg-[#F7F9F8] border border-[#0C4137]/[0.08] space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
                <TrendingUp className="w-4 h-4 text-[#06D6A0]" />
                <span>O‘rtacha Xarid Cheki</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#0C4137] font-mono pt-1">
                {current.averageCheck}
              </div>
              <div className="text-[11px] text-neutral-500">Toshkent o‘rtacha qiymati</div>
            </div>

            <div className="p-4.5 rounded-[12px] bg-[#F7F9F8] border border-[#0C4137]/[0.08] space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
                <ShieldCheck className="w-4 h-4 text-[#06D6A0]" />
                <span>Raqobat Zichligi</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#0C4137] font-mono pt-1">
                {current.competition}
              </div>
              <div className="text-[11px] text-[#06D6A0] font-semibold">Monopol bufer mavjud</div>
            </div>
          </div>

          {/* Two-Column Detail: Peak Traffic Bar Chart & Strategic Advantages */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            {/* Left: Peak Hours Activity Mini-Chart */}
            <div className="lg:col-span-5 p-5 rounded-[14px] bg-[#F7F9F8] border border-[#0C4137]/[0.08] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#0C4137] mb-4">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#06D6A0]" />
                    Kunlik Trafik Dinamikasi (Soatlar kesimida)
                  </span>
                  <span className="text-[10px] font-mono text-[#06D6A0] font-bold">PIK: {current.peakHours}</span>
                </div>

                <div className="h-28 flex items-end justify-between gap-3 pt-4 px-2">
                  {current.hourlyTraffic.map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div
                        style={{ height: bar.height }}
                        className={`w-full rounded-t-[4px] transition-all duration-300 ${
                          bar.active ? 'bg-[#06D6A0]' : 'bg-[#0C4137]/20 hover:bg-[#0C4137]/40'
                        }`}
                      />
                      <span className="text-[10px] font-mono text-neutral-400">{bar.hour}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-neutral-500 mt-4 leading-normal">
                {current.summary}
              </p>
            </div>

            {/* Right: Key Strategic Advantages */}
            <div className="lg:col-span-7 p-5 rounded-[14px] bg-[#F7F9F8] border border-[#0C4137]/[0.08] flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-[#0C4137] mb-3 uppercase tracking-wider font-mono">
                  Hududning Kuchli Tomonlari (SWOT)
                </div>
                <ul className="space-y-2.5">
                  {current.advantages.map((adv, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-[#06D6A0] flex-shrink-0 mt-0.5" />
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-[#0C4137]/[0.06] flex items-center justify-between">
                <span className="text-xs text-neutral-500">
                  O‘zingizning lokatsiyangiz bo‘yicha hisoblamoqchimisiz?
                </span>
                <button
                  onClick={() => setCurrentView('app')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#0C4137] hover:bg-[#072822] text-white text-xs font-semibold transition-all active:scale-[0.98] group cursor-pointer"
                >
                  <span>Xaritada Hisoblash</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#06D6A0] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustrySolutions;
