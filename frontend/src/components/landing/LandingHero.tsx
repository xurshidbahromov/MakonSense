import React, { useState } from 'react';
import {
  MapPin,
  ArrowRight,
  AlertTriangle,
  Train,
  Users,
  Compass,
  FileText,
  ChevronRight,
  Sparkles,
  Check,
} from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { AnimatedCounter } from '../ui/AnimatedCounter';

interface HeroDemoPoint {
  id: string;
  name: string;
  district: string;
  lat: number;
  lon: number;
  score: number;
  status: string;
  transitScore: number;
  nearestMetro: string;
  metroDist: number;
  competitors: number;
  households: number;
}

const HERO_DEMOS: HeroDemoPoint[] = [
  {
    id: 'center',
    name: 'Amir Temur Xiyoboni',
    district: 'Yunusobod / Mirobod markazi',
    lat: 41.3123,
    lon: 69.2797,
    score: 83.5,
    status: 'YUQORI SALOHIYAT',
    transitScore: 92.5,
    nearestMetro: 'Amir Temur bekati',
    metroDist: 42,
    competitors: 2,
    households: 1820,
  },
  {
    id: 'chilonzor',
    name: 'Chilonzor 9-Mavze',
    district: 'Aholi zich turar-joy hududi',
    lat: 41.2728,
    lon: 69.2062,
    score: 79.0,
    status: "O'RTACHA SALOHIYAT",
    transitScore: 88.0,
    nearestMetro: 'Chilonzor bekati',
    metroDist: 85,
    competitors: 4,
    households: 3800,
  },
  {
    id: 'tashkentcity',
    name: 'Tashkent City Boulevard',
    district: 'Premium biznes va turizm xabi',
    lat: 41.3142,
    lon: 69.2483,
    score: 91.5,
    status: 'YUQORI SALOHIYAT',
    transitScore: 89.0,
    nearestMetro: 'Paxtakor / Navoiy',
    metroDist: 340,
    competitors: 3,
    households: 4200,
  },
];

const LOCAL_BRANDS = [
  { name: 'Korzinka', category: 'Supermarket tarmog‘i' },
  { name: 'Payme', category: 'To‘lov tizimi' },
  { name: 'Click', category: 'Fintex ekotizimi' },
  { name: 'Safia Cafe', category: 'HoReCa qandolat' },
  { name: 'Uzum Market', category: 'E-commerce & Logistika' },
  { name: 'Yandex Go', category: 'Shahar harakati' },
];

export const LandingHero: React.FC = () => {
  const { setCurrentView, setSelectedCoords, generateAuditReport } = useAnalyticsStore();
  const [activeDemo, setActiveDemo] = useState<HeroDemoPoint>(HERO_DEMOS[0]);

  const handleLaunchToPoint = (demo: HeroDemoPoint) => {
    setSelectedCoords({ latitude: demo.lat, longitude: demo.lon });
    setCurrentView('app');
  };

  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (activeDemo.score / 100) * circumference;

  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-40 md:pb-24 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Refined Business Eyebrow & Two-Tone Hero Headline */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] bg-[#E6FBF6] border border-[#06D6A0]/30 text-[#0C4137] text-xs font-mono font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#06D6A0] animate-pulse" />
            <span>TOSHKENT BO‘YICHA BIZNES LOKATSIYA VA GEOMARKETING TIZIMI</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-semibold leading-[1.08] tracking-tight">
            <span className="text-[#0C4137]">Joy tanlashda xato qilmang.</span>
            <br />
            <span className="text-neutral-400">Toshkentni fazoviy ma’lumot bilan o‘rganing.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-[17px] sm:text-[19px] leading-[1.4] text-neutral-500 font-normal">
            Har yili noto‘g‘ri lokatsiya sababli yangi shoxobchalarning <strong className="text-[#0C4137] font-semibold">45% i birinchi yilda yopiladi</strong>. MakonSense shahar tranziti, raqobat va aholi qatlamlarini bitta xolis MakonScore indeksiga aylantiradi.
          </p>

          {/* JPRQ-Style Action Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => setCurrentView('app')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 font-semibold transition-all duration-150 whitespace-nowrap active:scale-[0.98] bg-[#0C4137] text-white hover:bg-[#072822] px-6 py-3 text-[15px] rounded-[10px] shadow-sm group cursor-pointer"
            >
              <span>Xaritada Hisoblab Ko‘rish</span>
              <ArrowRight className="w-4 h-4 text-[#06D6A0] group-hover:translate-x-0.5 transition-transform duration-150" />
            </button>

            <button
              onClick={() => generateAuditReport()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold rounded-[10px] transition-all duration-150 whitespace-nowrap active:scale-[0.98] px-5 py-3 text-[15px] bg-transparent text-[#0C4137] hover:bg-neutral-100/80 border border-[#0C4137]/[0.15] cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#06D6A0]" />
              <span>PDF Audit Namunasi</span>
            </button>
          </div>
        </div>

        {/* Executive Spatial Command Deck (Grand Enterprise Showcase) */}
        <div className="mx-auto mt-14 sm:mt-20 max-w-[1140px]">
          <div className="rounded-[24px] border border-[#0C4137]/[0.12] bg-[#F7F9F8] p-2.5 sm:p-4 shadow-[0_30px_90px_rgba(12,65,55,0.08)]">
            <div className="rounded-[18px] border border-[#0C4137]/[0.08] bg-white overflow-hidden p-6 sm:p-9 space-y-7">
              {/* Command Deck Header Strip */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#0C4137]/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[10px] bg-[#E6FBF6] border border-[#06D6A0]/30 flex items-center justify-center text-[#0C4137]">
                    <Compass className="w-5 h-5 text-[#06D6A0]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                      Toshkent Shahri • Fazoviy Intellekt Dasturi
                    </div>
                    <div className="text-base font-bold text-[#0C4137]">
                      Real Vaqt Rejimida Lokatsiya Skaneri
                    </div>
                  </div>
                </div>

                {/* Location Selection Preset Tabs */}
                <div className="flex items-center gap-1.5 bg-[#F4F6F5] p-1.5 rounded-[12px] border border-[#0C4137]/[0.06] overflow-x-auto">
                  {HERO_DEMOS.map((demo) => {
                    const isSelected = activeDemo.id === demo.id;
                    return (
                      <button
                        key={demo.id}
                        onClick={() => setActiveDemo(demo)}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-xs transition-all duration-150 active:scale-[0.98] cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? 'bg-[#0C4137] text-white shadow-sm font-semibold'
                            : 'text-neutral-600 hover:text-[#0C4137] hover:bg-white'
                        }`}
                      >
                        <span>{demo.name.split(' ')[0]}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-[4px] ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-black/[0.05] text-neutral-500'
                        }`}>
                          {demo.score}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Command Deck Main Stage: Split Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: MakonScore Gauge & Sub-Score Diagnostics (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Grand Score Display */}
                  <div className="p-6 rounded-[16px] bg-[#F7F9F8] border border-[#0C4137]/[0.08] flex items-center gap-6">
                    <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r={radius} className="stroke-neutral-200" strokeWidth="9" fill="transparent" />
                        <circle
                          cx="60"
                          cy="60"
                          r={radius}
                          stroke="#06D6A0"
                          strokeWidth="9"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-700 ease-out"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-black font-mono text-[#0C4137] leading-none">
                          <AnimatedCounter value={activeDemo.score} decimals={1} />
                        </span>
                        <span className="text-[10px] text-neutral-400 font-semibold uppercase mt-1">/ 100 ball</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="text-[11px] font-bold px-2.5 py-0.5 rounded-[6px] bg-[#E6FBF6] text-[#0C4137] border border-[#06D6A0]/30 inline-block">
                        {activeDemo.status}
                      </div>
                      <div className="text-base font-bold text-[#0C4137] truncate">{activeDemo.name}</div>
                      <div className="text-xs text-neutral-500">{activeDemo.district}</div>
                    </div>
                  </div>

                  {/* 3 Key Diagnostic Sub-metrics */}
                  <div className="space-y-2.5">
                    <div className="p-3.5 rounded-[12px] bg-[#F7F9F8] border border-[#0C4137]/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Train className="w-4 h-4 text-[#06D6A0]" />
                        <span className="text-xs font-semibold text-[#0C4137]">Piyodalar Tranziti:</span>
                      </div>
                      <span className="text-xs font-bold font-mono text-[#0C4137]">
                        {activeDemo.nearestMetro} ({activeDemo.metroDist}m)
                      </span>
                    </div>

                    <div className="p-3.5 rounded-[12px] bg-[#F7F9F8] border border-[#0C4137]/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-semibold text-[#0C4137]">Toifadosh Raqobatchilar:</span>
                      </div>
                      <span className="text-xs font-bold font-mono text-[#0C4137]">
                        {activeDemo.competitors} ta nuqta (400m radiusda)
                      </span>
                    </div>

                    <div className="p-3.5 rounded-[12px] bg-[#F7F9F8] border border-[#0C4137]/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Users className="w-4 h-4 text-[#06D6A0]" />
                        <span className="text-xs font-semibold text-[#0C4137]">Doimiy Aholi Xonadonlari:</span>
                      </div>
                      <span className="text-xs font-bold font-mono text-[#0C4137]">
                        ~{activeDemo.households.toLocaleString()} ta xonadon
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Interactive 3D Spatial Radar Map Stage (7 cols) */}
                <div className="lg:col-span-7 h-[340px] sm:h-[390px] rounded-[16px] bg-[#F7F9F8] border border-[#0C4137]/[0.08] relative overflow-hidden flex items-center justify-center">
                  <svg className="w-full h-full absolute inset-0" viewBox="0 0 600 390" preserveAspectRatio="none">
                    <defs>
                      <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#06D6A0" stopOpacity="0.45" />
                        <stop offset="65%" stopColor="#06D6A0" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#06D6A0" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Street Corridor Network */}
                    <g opacity="0.12">
                      <line x1="50" y1="195" x2="550" y2="195" stroke="#0C4137" strokeWidth="3" />
                      <line x1="300" y1="30" x2="300" y2="360" stroke="#0C4137" strokeWidth="3" />
                      <line x1="120" y1="50" x2="480" y2="340" stroke="#0C4137" strokeWidth="2" />
                      <line x1="480" y1="50" x2="120" y2="340" stroke="#0C4137" strokeWidth="2" />
                    </g>

                    {/* Concentric Isochrone Pulse Rings */}
                    <circle cx="300" cy="195" r="140" fill="none" stroke="#06D6A0" strokeWidth="1.5" strokeDasharray="6,4" strokeOpacity="0.35" />
                    <circle cx="300" cy="195" r="85" fill="none" stroke="#06D6A0" strokeWidth="2" strokeDasharray="4,3" strokeOpacity="0.6" />
                    <circle cx="300" cy="195" r="50" fill="url(#heroGlow)" />

                    {/* Transit Metro Line */}
                    <path d="M 80 100 C 200 130, 290 220, 520 230" stroke="#06D6A0" strokeWidth="4" fill="none" />
                    <circle cx="190" cy="135" r="6" fill="#06D6A0" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx="430" cy="225" r="6" fill="#06D6A0" stroke="#FFFFFF" strokeWidth="2" />

                    {/* Candidate Center Beacon */}
                    <circle cx="300" cy="195" r="14" fill="#0C4137" stroke="#06D6A0" strokeWidth="4" />

                    {/* Surrounding Competitor Markers */}
                    <circle cx="410" cy="140" r="7" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx="210" cy="260" r="7" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
                  </svg>

                  {/* Floating Badges on Map */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="px-3 py-1.5 rounded-[8px] bg-white border border-[#0C4137]/[0.1] shadow-sm flex items-center gap-2 text-xs font-bold text-[#0C4137]">
                      <MapPin className="w-3.5 h-3.5 text-[#06D6A0]" />
                      <span>{activeDemo.name}</span>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 z-10">
                    <div className="px-3 py-1.5 rounded-[8px] bg-white border border-[#0C4137]/[0.1] shadow-sm flex items-center gap-2 text-xs font-mono font-medium text-neutral-500">
                      <span>{activeDemo.lat.toFixed(4)}°, {activeDemo.lon.toFixed(4)}°</span>
                    </div>
                  </div>

                  {/* Bottom Map Floating Action */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between p-3.5 rounded-[12px] bg-white border border-[#0C4137]/[0.1] shadow-md">
                    <div className="text-xs text-neutral-600 font-medium">
                      Ushbu lokatsiyaning to‘liq 3D qatlamlarini ko‘ring
                    </div>
                    <button
                      onClick={() => handleLaunchToPoint(activeDemo)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-[#0C4137] hover:bg-[#072822] text-white text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <span>3D Xaritani Ochish</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#06D6A0]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* JPRQ-Style Social Proof Logo Grid */}
        <div className="pt-16 pb-4 md:pt-24 md:pb-6 text-center">
          <p className="text-[20px] font-semibold text-[#0C4137]">
            Toshkent bo‘ylab 150,000+ bino va savdo obyektlari tahlili
          </p>
          <p className="mt-2 text-[15px] font-medium text-neutral-400">
            Shahar infratuzilmasi va yetakchi toifalar kesimida
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 max-w-4xl mx-auto">
            {LOCAL_BRANDS.map((b, i) => (
              <div
                key={i}
                className="rounded-[10px] border border-[#0C4137]/[0.08] bg-[#F7F9F8] p-3.5 flex flex-col items-center justify-center hover:border-[#06D6A0]/40 transition-colors"
              >
                <div className="text-sm font-bold text-[#0C4137]">{b.name}</div>
                <div className="text-[10px] text-neutral-400 font-mono mt-0.5 truncate max-w-full">
                  {b.category}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
