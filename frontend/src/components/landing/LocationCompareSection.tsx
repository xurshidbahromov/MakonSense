import React, { useState } from 'react';
import {
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Train,
  Users,
  ShieldAlert,
  ShieldCheck,
  DollarSign,
} from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

interface CompareLocation {
  id: string;
  name: string;
  district: string;
  category: string;
  lat: number;
  lon: number;
  score: number;
  status: string;
  footTraffic: string;
  metroDist: string;
  competitors: number;
  competitorStatus: string;
  households: string;
  monthlyRevenue: string;
  paybackMonths: string;
  advantages: string[];
}

const COMPARISON_PAIRS = [
  {
    title: 'Markaz vs Turar-joy massivi (HoReCa / Kafe)',
    locA: {
      id: 'center',
      name: 'Amir Temur Xiyoboni',
      district: 'Toshkent markazi (Yunusobod / Mirobod)',
      category: 'HoReCa & Kafe',
      lat: 41.3123,
      lon: 69.2797,
      score: 94.0,
      status: 'A-GRADE (TAVSIYA ETILADI)',
      footTraffic: '18,400+ yo‘lovchi / kun',
      metroDist: '42 metr (Amir Temur bekati)',
      competitors: 2,
      competitorStatus: 'Past raqobat (350m erkin bufer)',
      households: '1,820 xonadon (Yuqori daromad)',
      monthlyRevenue: '$22,000 – $28,000 / oy',
      paybackMonths: '7 – 9 oy',
      advantages: [
        'Ertalabki va kechki pik oqim maksimum darajada',
        'Yaqin 500 metrda 14 ta yirik ofis markazi',
        'Kross-trafik: talabalar va shahar mehmonlari',
      ],
    },
    locB: {
      id: 'chilonzor',
      name: 'Chilonzor 9-Mavze',
      district: 'Katta turar-joy massivi (Toshkent)',
      category: 'HoReCa & Kafe',
      lat: 41.2728,
      lon: 69.2062,
      score: 78.5,
      status: 'O‘RTACHA SALOHIYAT',
      footTraffic: '9,200+ yo‘lovchi / kun',
      metroDist: '380 metr (Chilonzor bekati)',
      competitors: 5,
      competitorStatus: 'Yuqori to‘yinganlik (Narx urushlari)',
      households: '3,800 xonadon (O‘rta daromad)',
      monthlyRevenue: '$12,000 – $15,500 / oy',
      paybackMonths: '14 – 16 oy',
      advantages: [
        'Kechki soatlarda doimiy oilaviy mijozlar',
        'Ijara narxi markazga nisbatan 40% arzonroq',
        'Lekin toifadosh kafelar soni haddan tashqari ko‘p',
      ],
    },
    verdict:
      'Qahvaxona va fast-food uchun Amir Temur lokatsiyasi +63% yuqori daromad va 2 baravar tezroq o‘zini qoplash muddatini ta’minlaydi. Chilonzor esa dorixona va oziq-ovqat do‘koni uchun ko‘proq mos keladi.',
  },
  {
    title: 'Savdo Xablari (Retail & Supermarket)',
    locA: {
      id: 'tashkentcity',
      name: 'Tashkent City Boulevard',
      district: 'Shayxontohur, Biznes kvartali',
      category: 'Chakana Savdo (Retail)',
      lat: 41.3142,
      lon: 69.2483,
      score: 92.5,
      status: 'PREMIUM SAVDO ZONASI',
      footTraffic: '21,500+ tashrif / kun',
      metroDist: '340 metr (Paxtakor bekati)',
      competitors: 3,
      competitorStatus: 'Premium brendlar klasteri',
      households: '4,200 xonadon + 18k ofis',
      monthlyRevenue: '$38,000 – $55,000 / oy',
      paybackMonths: '9 – 11 oy',
      advantages: [
        'Maksimal xarid quvvati (Class A / Premium)',
        'Tashkent City Mall gravitatsion magniti',
        'Dam olish kunlarida sayyohlar va oilalar oqimi',
      ],
    },
    locB: {
      id: 'samarqand_darvoza',
      name: 'Samarqand Darvoza Atrofi',
      district: 'Shayxontohur, Tarixiy savdo xabi',
      category: 'Chakana Savdo (Retail)',
      lat: 41.3185,
      lon: 69.2275,
      score: 86.0,
      status: 'YUQORI SAVDO GAVJUMLIGI',
      footTraffic: '17,800+ tashrif / kun',
      metroDist: '850 metr (Chorsu bekati)',
      competitors: 7,
      competitorStatus: 'Kuchli narx raqobati',
      households: '3,400 xonadon (O‘rta qatlam)',
      monthlyRevenue: '$28,000 – $39,000 / oy',
      paybackMonths: '11 – 13 oy',
      advantages: [
        'An’anaviy xaridorlar oqimi o‘ta barqaror',
        'Korzinka va Makro kabi anchorlar faol',
        'Lekin transport to‘xtash joyi (parkovka) tanqisligi bor',
      ],
    },
    verdict:
      'Yuqori marjali premium mahsulotlar uchun Tashkent City ideal. Ommaviy chakana savdo va arzon narx segmenti uchun Samarqand Darvoza barqaror aylanma kafolatlaydi.',
  },
  {
    title: 'Viloyatlar Xabi: Samarqand vs Farg‘ona',
    locA: {
      id: 'samarqand_univ',
      name: 'Universitet Xiyoboni, Samarqand',
      district: 'Samarqand shahri, Ta’lim & Sayyohlik markazi',
      category: 'HoReCa & Qandolat',
      lat: 39.6542,
      lon: 66.9597,
      score: 91.0,
      status: 'A-GRADE VILOYAT XABI',
      footTraffic: '15,200+ yo‘lovchi / kun',
      metroDist: 'Markaziy avtobus arteriyasi (80m)',
      competitors: 2,
      competitorStatus: 'Monopol sharoit (erkin talab)',
      households: '2,900 xonadon + 14,000 talaba',
      monthlyRevenue: '$18,000 – $24,500 / oy',
      paybackMonths: '7 – 8 oy',
      advantages: [
        'Talabalar va xorijiy sayyohlar kross-oqimi',
        'Kechki soatlarda shahar yoshlarining asosiy sayrgohi',
        'Samarqand markazida premium kafelar tanqisligi',
      ],
    },
    locB: {
      id: 'fargona_markaz',
      name: 'Sayilgoh Ko‘chasi, Farg‘ona',
      district: 'Farg‘ona shahri, Savdo piyodalar xabi',
      category: 'HoReCa & Qandolat',
      lat: 40.3864,
      lon: 71.7864,
      score: 84.5,
      status: 'YUQORI SALOHIYATLI HUDUD',
      footTraffic: '12,400+ yo‘lovchi / kun',
      metroDist: 'Markaziy vokzal (450m)',
      competitors: 3,
      competitorStatus: 'Mahalliy kafelar klasteri',
      households: '3,100 xonadon (O‘rta qatlam)',
      monthlyRevenue: '$14,000 – $19,000 / oy',
      paybackMonths: '9 – 11 oy',
      advantages: [
        'Viloyatning eng gavjum savdo arteriyasi',
        'Ijara narxi poytaxtga nisbatan 60% arzonroq',
        'Yuqori rentabellik va past boshlang‘ich xarajatlar',
      ],
    },
    verdict:
      'Samarqand Universitet xiyoboni talabalar va sayyohlar hisobiga doimiy yuqori chek beradi. Farg‘ona esa past ijara xarajati bilan investitsiyani tezroq oqlash imkonini taqdim etadi.',
  },
];

export const LocationCompareSection: React.FC = () => {
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);
  const { setCurrentView, setSelectedCoords } = useAnalyticsStore();

  const currentPair = COMPARISON_PAIRS[selectedPairIndex];
  const { locA, locB, verdict } = currentPair;

  return (
    <section id="compare" className="py-24 sm:py-36 select-none border-t border-[#0C4137]/[0.08] bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-4xl mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#E6FBF6] border border-[#06D6A0]/30 text-[#0C4137] text-xs font-mono font-semibold mb-4">
            <Scale className="w-3.5 h-3.5 text-[#06D6A0]" />
            <span>INTERAKTIV A/B LOKATSIYA TAQQOSLASH</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-[52px] font-black text-[#0C4137] tracking-tight leading-[1.08]">
            Ikkita manzilni yonma-yon solishtiring.{' '}
            <span className="text-neutral-400 font-normal">Qaysi biri ko‘proq foyda keltiradi?</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-2xl leading-relaxed">
            Ikkita muqobil bino orasida ikkilanyapsizmi? MakonSense har ikkala nuqtaning tranziti, aholisi va raqobatini xolis solishtirib beradi.
          </p>

          {/* Scenario Selector Pills */}
          <div className="flex items-center gap-2 mt-8 flex-wrap">
            {COMPARISON_PAIRS.map((pair, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPairIndex(idx)}
                className={`px-4 py-2 rounded-[10px] text-xs sm:text-sm font-semibold transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                  selectedPairIndex === idx
                    ? 'bg-[#0C4137] text-white shadow-sm'
                    : 'bg-[#F7F9F8] text-neutral-600 hover:text-[#0C4137] border border-[#0C4137]/[0.08]'
                }`}
              >
                {pair.title}
              </button>
            ))}
          </div>
        </div>

        {/* Side-by-Side Comparison Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative">
          {/* Card A: Winner / Prime Location */}
          <div className="lg:col-span-6 rounded-[22px] bg-[#F7F9F8] border-2 border-[#06D6A0]/50 p-6 sm:p-9 shadow-[0_16px_50px_rgba(6,214,160,0.08)] flex flex-col justify-between space-y-6 relative overflow-hidden">
            {/* Top Badge */}
            <div className="flex items-center justify-between pb-4 border-b border-[#0C4137]/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#06D6A0]" />
                <span className="text-xs font-mono font-bold text-[#0C4137] uppercase">Lokatsiya A (Asosiy)</span>
              </div>
              <span className="px-3 py-1 rounded-[6px] bg-[#E6FBF6] text-[#0C4137] border border-[#06D6A0]/40 text-xs font-black">
                {locA.status}
              </span>
            </div>

            {/* Location Title & Score */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#0C4137] tracking-tight">{locA.name}</h3>
                <p className="text-xs text-neutral-500 mt-1">{locA.district} • {locA.category}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl sm:text-4xl font-black text-[#0C4137] font-mono leading-none">
                  {locA.score}
                </div>
                <div className="text-[10px] text-[#06D6A0] font-bold uppercase mt-1">MakonScore / 100</div>
              </div>
            </div>

            {/* Key Comparison Metrics */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-[12px] bg-white border border-[#0C4137]/[0.06] flex items-center justify-between">
                <span className="text-xs text-neutral-500 flex items-center gap-2">
                  <Train className="w-4 h-4 text-[#06D6A0]" />
                  Piyodalar Oqimi:
                </span>
                <span className="text-xs font-bold text-[#0C4137] font-mono">{locA.footTraffic}</span>
              </div>

              <div className="p-3.5 rounded-[12px] bg-white border border-[#0C4137]/[0.06] flex items-center justify-between">
                <span className="text-xs text-neutral-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#06D6A0]" />
                  Raqobat Bosimi:
                </span>
                <span className="text-xs font-bold text-[#06D6A0] font-mono">{locA.competitorStatus}</span>
              </div>

              <div className="p-3.5 rounded-[12px] bg-white border border-[#0C4137]/[0.06] flex items-center justify-between">
                <span className="text-xs text-neutral-500 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#06D6A0]" />
                  Aholi Qamrovi:
                </span>
                <span className="text-xs font-bold text-[#0C4137] font-mono">{locA.households}</span>
              </div>

              <div className="p-3.5 rounded-[12px] bg-[#E6FBF6] border border-[#06D6A0]/30 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0C4137] flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#06D6A0]" />
                  Oylik Tushum Prognozi:
                </span>
                <span className="text-xs font-black text-[#0C4137] font-mono">{locA.monthlyRevenue}</span>
              </div>
            </div>

            {/* Strategic Bullets */}
            <div className="pt-2">
              <div className="text-xs font-bold text-[#0C4137] uppercase font-mono mb-2.5">
                Asosiy Afzalliklari:
              </div>
              <ul className="space-y-2">
                {locA.advantages.map((adv, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#06D6A0] flex-shrink-0 mt-0.5" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action */}
            <div className="pt-4 border-t border-[#0C4137]/[0.08]">
              <button
                onClick={() => {
                  setSelectedCoords({ latitude: locA.lat, longitude: locA.lon });
                  setCurrentView('app');
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-[10px] bg-[#0C4137] hover:bg-[#072822] text-white text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Lokatsiya A ni Xaritada Ochish</span>
                <ArrowRight className="w-4 h-4 text-[#06D6A0]" />
              </button>
            </div>
          </div>

          {/* Card B: Alternative Location */}
          <div className="lg:col-span-6 rounded-[22px] bg-[#F7F9F8] border border-[#0C4137]/[0.1] p-6 sm:p-9 shadow-[0_12px_40px_rgba(12,65,55,0.04)] flex flex-col justify-between space-y-6 relative overflow-hidden">
            {/* Top Badge */}
            <div className="flex items-center justify-between pb-4 border-b border-[#0C4137]/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
                <span className="text-xs font-mono font-bold text-neutral-500 uppercase">Lokatsiya B (Muqobil)</span>
              </div>
              <span className="px-3 py-1 rounded-[6px] bg-white text-neutral-600 border border-[#0C4137]/[0.1] text-xs font-bold">
                {locB.status}
              </span>
            </div>

            {/* Location Title & Score */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#0C4137] tracking-tight">{locB.name}</h3>
                <p className="text-xs text-neutral-500 mt-1">{locB.district} • {locB.category}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl sm:text-4xl font-black text-neutral-700 font-mono leading-none">
                  {locB.score}
                </div>
                <div className="text-[10px] text-neutral-400 font-bold uppercase mt-1">MakonScore / 100</div>
              </div>
            </div>

            {/* Key Comparison Metrics */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-[12px] bg-white border border-[#0C4137]/[0.06] flex items-center justify-between">
                <span className="text-xs text-neutral-500 flex items-center gap-2">
                  <Train className="w-4 h-4 text-neutral-400" />
                  Piyodalar Oqimi:
                </span>
                <span className="text-xs font-bold text-[#0C4137] font-mono">{locB.footTraffic}</span>
              </div>

              <div className="p-3.5 rounded-[12px] bg-white border border-[#0C4137]/[0.06] flex items-center justify-between">
                <span className="text-xs text-neutral-500 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Raqobat Bosimi:
                </span>
                <span className="text-xs font-bold text-amber-600 font-mono">{locB.competitorStatus}</span>
              </div>

              <div className="p-3.5 rounded-[12px] bg-white border border-[#0C4137]/[0.06] flex items-center justify-between">
                <span className="text-xs text-neutral-500 flex items-center gap-2">
                  <Users className="w-4 h-4 text-neutral-400" />
                  Aholi Qamrovi:
                </span>
                <span className="text-xs font-bold text-[#0C4137] font-mono">{locB.households}</span>
              </div>

              <div className="p-3.5 rounded-[12px] bg-white border border-[#0C4137]/[0.06] flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-600 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-neutral-400" />
                  Oylik Tushum Prognozi:
                </span>
                <span className="text-xs font-bold text-[#0C4137] font-mono">{locB.monthlyRevenue}</span>
              </div>
            </div>

            {/* Strategic Bullets */}
            <div className="pt-2">
              <div className="text-xs font-bold text-neutral-600 uppercase font-mono mb-2.5">
                Kuzatilgan Xususiyatlar:
              </div>
              <ul className="space-y-2">
                {locB.advantages.map((adv, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-neutral-600">
                    <span className="text-neutral-400 font-bold">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action */}
            <div className="pt-4 border-t border-[#0C4137]/[0.08]">
              <button
                onClick={() => {
                  setSelectedCoords({ latitude: locB.lat, longitude: locB.lon });
                  setCurrentView('app');
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-[10px] bg-white hover:bg-neutral-100 border border-[#0C4137]/[0.15] text-xs font-bold text-[#0C4137] transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Lokatsiya B ni Xaritada Ochish</span>
                <ArrowRight className="w-4 h-4 text-[#0C4137]" />
              </button>
            </div>
          </div>
        </div>

        {/* AI Synthesis Verdict Banner */}
        <div className="mt-8 p-6 sm:p-7 rounded-[18px] bg-[#E6FBF6] border border-[#06D6A0]/40 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-[10px] bg-[#0C4137] text-[#06D6A0] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-[#0C4137] uppercase tracking-wider">
                MakonSense A/B Xulosasi
              </div>
              <p className="text-xs sm:text-sm text-[#0C4137] font-medium leading-relaxed mt-1">
                {verdict}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('app')}
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-[#0C4137] hover:bg-[#072822] text-white text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            <span>O‘z Joyingizni Solishtiring</span>
            <ArrowRight className="w-4 h-4 text-[#06D6A0]" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default LocationCompareSection;
