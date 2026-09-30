import React, { useState, useEffect, useRef } from 'react';
import {
  Train,
  ShoppingBag,
  ShieldAlert,
  Users,
  Sparkles,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Compass,
  CheckCircle2,
  TrendingUp,
  Layers,
  ChevronRight,
  Target,
  BarChart3,
  Building,
  Radio,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

interface StoryStage {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ReactNode;
  metricLabel: string;
  metricValue: string;
  metricDetail: string;
  description: string;
  insight: string;
}

const STAGES: StoryStage[] = [
  {
    id: 'transit',
    stepNumber: '01',
    title: 'Metro va Tranzit Oqimi',
    subtitle: '5 va 10 daqiqalik piyoda yetib borish izoxronalari',
    badge: 'Piyodalar Oqimi',
    icon: <Train className="w-4 h-4 text-[#06D6A0]" />,
    metricLabel: 'Kunlik Tranzit Oqimi',
    metricValue: '18,400+',
    metricDetail: 'yo‘lovchi / kun (stansiya atrofida)',
    description:
      'Toshkent metrosining 48 ta bekati va asosiy yo‘lovchi arteriyalari orqali tabiiy piyodalar oqimi real vaqtda xaritalanadi.',
    insight: 'Amir Temur bekatiga piyoda 2 daqiqa. Pik soatlar: 08:30–09:45 va 17:30–19:45.',
  },
  {
    id: 'anchors',
    stepNumber: '02',
    title: 'Savdo Tortish Markazlari (Retail Anchors)',
    subtitle: 'Yirik mollarning xaridorlarni jalb qilish kuchi',
    badge: 'Savdo Gravitatsiyasi',
    icon: <ShoppingBag className="w-4 h-4 text-[#06D6A0]" />,
    metricLabel: 'Gravitatsiya Kuchi',
    metricValue: '91.2%',
    metricDetail: '800m radiusda 4 ta yirik magnit markaz',
    description:
      'Tashkent City Mall, Samarqand Darvoza va yirik supermarketlar butun tuman xaridorlarini o‘ziga tortib, sizga tayyor oqim beradi.',
    insight: 'Eng yaqin yirik savdo markazi 280 metrda. Dam olish kunlarida xaridorlar oqimi +42% ga oshadi.',
  },
  {
    id: 'competition',
    stepNumber: '03',
    title: 'Raqobat Bosimi va Erkin Bo‘shliq',
    subtitle: 'To‘yinganlik tahlili va monopol imkoniyatlar',
    badge: 'Raqobat Radari',
    icon: <ShieldAlert className="w-4 h-4 text-[#06D6A0]" />,
    metricLabel: 'To‘yinganlik Indeksi',
    metricValue: '24% (Xavfsiz)',
    metricDetail: 'To‘qnashuv xavfi past — erkin bozor',
    description:
      '360° radar barcha toifadosh tarmoqlarni aniqlaydi. Qizil xavf zonalari va yashil erkin «Oltin nuqtalar» ajratib beriladi.',
    insight: '400m radiusda faqat 2 ta raqobatchi mavjud. Kannibalizatsiya xavfi: 0%.',
  },
  {
    id: 'demographics',
    stepNumber: '04',
    title: 'Aholi Massivlari va Xarid Quvvati',
    subtitle: 'Uber H3 fazoviy geksagonlarida xonadonlar auditi',
    badge: 'Auditoriya Qamrovi',
    icon: <Users className="w-4 h-4 text-[#06D6A0]" />,
    metricLabel: 'Radiusdagi Xonadonlar',
    metricValue: '3,850 ta',
    metricDetail: '14,200+ nafar doimiy istiqomat qiluvchi',
    description:
      'Yangi turar-joy majmualari (novostroykalar), aholi soni va oilalarning o‘rtacha daromad darajasi bitta qatlamda jamlanadi.',
    insight: 'Tashkent City va Mirobod Avenue premium xonadonlari. Xarid quvvati: Class A & B.',
  },
  {
    id: 'score',
    stepNumber: '05',
    title: 'Kompleks MakonScore™ AI Xulosasi',
    subtitle: '0 dan 100 gacha xolis sun’iy intellekt qarori',
    badge: 'Yakuniy Hukm',
    icon: <Sparkles className="w-4 h-4 text-[#06D6A0]" />,
    metricLabel: 'Umumiy MakonScore',
    metricValue: '94.0 / 100',
    metricDetail: '«A» toifadagi yuqori daromadli lokatsiya',
    description:
      'Barcha fazoviy qatlamlar tahlili asosida yakuniy investitsiya tavsiyasi, oylik tushum prognozi va qaytish muddati belgilanadi.',
    insight: 'Kutilayotgan oylik aylanma: $18,500 – $26,000. Investitsiya o‘zini qoplash muddati: 7–9 oy.',
  },
];

export const ScrollExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const { setCurrentView, setSelectedCoords } = useAnalyticsStore();

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight - window.innerHeight;

      if (containerHeight <= 0) return;

      // Calculate progress between 0 and 1
      const currentProgress = Math.min(1, Math.max(0, -rect.top / containerHeight));
      setScrollProgress(currentProgress);

      // Determine active stage based on progress
      const stageIdx = Math.min(
        STAGES.length - 1,
        Math.floor(currentProgress * STAGES.length)
      );
      setActiveStageIndex(stageIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeStage = STAGES[activeStageIndex];

  // Helper to jump to a stage smoothly
  const scrollToStage = (index: number) => {
    setActiveStageIndex(index);
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const containerHeight = containerRef.current.offsetHeight - window.innerHeight;
    const targetScrollY = containerTop + (index / (STAGES.length - 1)) * containerHeight;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (activeStageIndex > 0) {
      scrollToStage(activeStageIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeStageIndex < STAGES.length - 1) {
      scrollToStage(activeStageIndex + 1);
    }
  };

  return (
    <section
      id="features"
      ref={containerRef}
      className="relative bg-[#FBFBFD] border-t border-[#0C4137]/[0.08]"
      style={{ height: '300vh' }}
    >
      {/* Sticky Chassis (Locks neatly below fixed navbar) */}
      <div className="sticky top-16 sm:top-20 h-[calc(100vh-4.5rem)] sm:h-[calc(100vh-5.5rem)] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-4 select-none">
        {/* Header Strip: Eyebrow + Interactive Stage Tabs + Hairline Progress */}
        <div className="space-y-3 flex-shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#E6FBF6] border border-[#06D6A0]/30 text-[#0C4137] text-xs font-mono font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#06D6A0] animate-pulse" />
                <span>INTERAKTIV FAZOVIY RADAR TIZIMI</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-[#0C4137] tracking-tight mt-1">
                Shahar qatlamlarini tekshiring.{' '}
                <span className="text-neutral-400 font-normal">Har bir parametrni jonli o‘rganing.</span>
              </h2>
            </div>

            {/* Quick Interactive Progress Indicator Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-[#F4F6F5] p-1.5 rounded-[12px] border border-[#0C4137]/[0.08] overflow-x-auto max-w-full">
              {STAGES.map((stage, idx) => {
                const isActive = activeStageIndex === idx;
                return (
                  <button
                    key={stage.id}
                    onClick={() => scrollToStage(idx)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-[8px] text-xs font-medium transition-all duration-150 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#0C4137] text-white shadow-sm font-semibold'
                        : 'text-neutral-600 hover:text-[#0C4137] hover:bg-white'
                    }`}
                  >
                    <span className="font-mono text-[11px] opacity-75">{stage.stepNumber}</span>
                    <span>{stage.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Continuous Hairline Progress Bar */}
          <div className="w-full h-1 bg-[#0C4137]/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#06D6A0] transition-all duration-75 ease-out shadow-[0_0_8px_rgba(6,214,160,0.5)]"
              style={{ width: `${Math.max(5, scrollProgress * 100)}%` }}
            />
          </div>
        </div>

        {/* Centerpiece: The Grand Spatial Command Console (Split 12 cols) */}
        <div className="my-auto w-full rounded-[20px] bg-white border border-[#0C4137]/[0.1] shadow-[0_20px_60px_rgba(12,65,55,0.06)] p-4 sm:p-6 overflow-hidden flex flex-col justify-between flex-1 max-h-[calc(100vh-14rem)]">
          {/* Top Bar inside Console */}
          <div className="flex items-center justify-between pb-3 border-b border-[#0C4137]/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-[#E6FBF6] border border-[#06D6A0]/30 flex items-center justify-center text-[#0C4137]">
                {activeStage.icon}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
                  Qatlam {activeStage.stepNumber} / 05 • {activeStage.badge}
                </span>
                <span className="text-sm sm:text-base font-bold text-[#0C4137]">
                  {activeStage.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[#F7F9F8] border border-[#0C4137]/[0.08] text-xs font-mono text-[#0C4137]">
                <MapPin className="w-3.5 h-3.5 text-[#06D6A0]" />
                <span>Amir Temur (41.3123° N, 69.2797° E)</span>
              </div>
              <div className="px-3 py-1 rounded-[6px] bg-[#E6FBF6] border border-[#06D6A0]/30 text-xs font-bold text-[#0C4137]">
                {activeStage.metricValue}
              </div>
            </div>
          </div>

          {/* Console Body: Split Left Specs & Right High-Tech Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center my-auto py-2 flex-1 overflow-hidden">
            {/* Left Specs Panel (5 cols) */}
            <div className="lg:col-span-5 space-y-3.5 text-left">
              {/* Metric Card */}
              <div className="p-4 sm:p-5 rounded-[14px] bg-[#F7F9F8] border border-[#0C4137]/[0.08]">
                <div className="text-[11px] font-mono uppercase text-neutral-400 font-semibold">
                  {activeStage.metricLabel}
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#0C4137] mt-1">
                  {activeStage.metricValue}
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  {activeStage.metricDetail}
                </div>
              </div>

              {/* Strategic Insight */}
              <div className="p-3.5 rounded-[12px] bg-[#E6FBF6] border border-[#06D6A0]/40 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0C4137]">
                  <CheckCircle2 className="w-4 h-4 text-[#06D6A0] flex-shrink-0" />
                  <span>Strategik Xulosa:</span>
                </div>
                <p className="text-xs text-[#0C4137] font-medium leading-relaxed">
                  {activeStage.insight}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed hidden sm:block">
                {activeStage.description}
              </p>

              {/* Nav & Action Controls */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handlePrev}
                  disabled={activeStageIndex === 0}
                  className="p-2 rounded-[8px] border border-[#0C4137]/[0.1] bg-white text-[#0C4137] hover:bg-neutral-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  title="Oldingi qatlam"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={activeStageIndex === STAGES.length - 1}
                  className="p-2 rounded-[8px] border border-[#0C4137]/[0.1] bg-white text-[#0C4137] hover:bg-neutral-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  title="Keyingi qatlam"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedCoords({ latitude: 41.3123, longitude: 69.2797 });
                    setCurrentView('app');
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#0C4137] hover:bg-[#072822] text-white text-xs sm:text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span>3D Xaritada Ko‘rish</span>
                  <ArrowRight className="w-4 h-4 text-[#06D6A0]" />
                </button>
              </div>
            </div>

            {/* Right High-Tech Spatial Radar Stage (7 cols) */}
            <div className="lg:col-span-7 h-[260px] sm:h-[340px] rounded-[16px] bg-[#F7F9F8] border border-[#0C4137]/[0.08] relative overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full absolute inset-0" viewBox="0 0 700 400" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <radialGradient id="stageGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#06D6A0" stopOpacity="0.45" />
                    <stop offset="70%" stopColor="#06D6A0" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#06D6A0" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="dangerHalo" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                  </radialGradient>
                  <pattern id="h3Grid" width="40" height="34.64" patternUnits="userSpaceOnUse">
                    <path
                      d="M20,0 L40,11.55 L40,34.64 L20,46.19 L0,34.64 L0,11.55 Z"
                      fill="none"
                      stroke="#0C4137"
                      strokeWidth="0.7"
                      strokeOpacity="0.12"
                    />
                  </pattern>
                </defs>

                {/* Base Urban Radial Coordinates */}
                <g opacity="0.15">
                  <circle cx="350" cy="200" r="70" stroke="#0C4137" strokeWidth="1.5" fill="none" />
                  <circle cx="350" cy="200" r="140" stroke="#0C4137" strokeWidth="1.2" strokeDasharray="4,4" fill="none" />
                  <circle cx="350" cy="200" r="220" stroke="#0C4137" strokeWidth="1" strokeDasharray="6,6" fill="none" />
                  <line x1="40" y1="200" x2="660" y2="200" stroke="#0C4137" strokeWidth="2" />
                  <line x1="350" y1="20" x2="350" y2="380" stroke="#0C4137" strokeWidth="2" />
                  <line x1="120" y1="50" x2="580" y2="350" stroke="#0C4137" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="580" y1="50" x2="120" y2="350" stroke="#0C4137" strokeWidth="1" strokeDasharray="3,3" />
                </g>

                {/* Sweeping Radar Arm */}
                <g className="origin-center animate-[spin_8s_linear_infinite]" style={{ transformOrigin: '350px 200px' }}>
                  <line x1="350" y1="200" x2="350" y2="20" stroke="#06D6A0" strokeWidth="2" strokeOpacity="0.8" />
                  <polygon points="350,200 390,20 350,20" fill="#06D6A0" fillOpacity="0.12" />
                </g>

                {/* STAGE 1: Transit & Foot Traffic Isochrones */}
                {activeStageIndex === 0 && (
                  <g className="transition-all duration-300">
                    {/* Metro Red Line */}
                    <path d="M 90 90 C 230 130, 370 240, 620 250" stroke="#EF4444" strokeWidth="4" strokeDasharray="8,5" fill="none" />
                    {/* Metro Chilanzar Line */}
                    <path d="M 180 370 C 280 280, 370 160, 520 40" stroke="#06D6A0" strokeWidth="4" fill="none" />

                    {/* 10-minute Walking Isochrone */}
                    <circle cx="350" cy="200" r="160" fill="none" stroke="#06D6A0" strokeWidth="1.8" strokeDasharray="6,4" strokeOpacity="0.4" />
                    {/* 5-minute Walking Isochrone */}
                    <circle cx="350" cy="200" r="95" fill="none" stroke="#06D6A0" strokeWidth="2" strokeDasharray="4,3" strokeOpacity="0.7" />
                    {/* Inner Heat Glow */}
                    <circle cx="350" cy="200" r="55" fill="url(#stageGlow)" />
                    {/* Candidate Center Beacon */}
                    <circle cx="350" cy="200" r="14" fill="#0C4137" stroke="#06D6A0" strokeWidth="4" />

                    {/* Station Pins */}
                    <circle cx="240" cy="140" r="8" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2.5" />
                    <circle cx="490" cy="230" r="8" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2.5" />
                    <circle cx="420" cy="110" r="8" fill="#06D6A0" stroke="#FFFFFF" strokeWidth="2.5" />

                    <text x="255" y="145" fontSize="11" fontWeight="bold" fill="#0C4137">Amir Temur bekati (42m)</text>
                    <text x="435" y="115" fontSize="11" fontWeight="bold" fill="#0C4137">Yunus Rajabiy (180m)</text>
                    <text x="350" y="285" textAnchor="middle" fontSize="11" fontWeight="600" fill="#06D6A0">
                      5 daqiqalik qamrov: 18,400+ yo‘lovchi/kun
                    </text>
                  </g>
                )}

                {/* STAGE 2: Commercial Anchors & Gravitational Beams */}
                {activeStageIndex === 1 && (
                  <g className="transition-all duration-300">
                    {/* Gravitational Attraction Arcs */}
                    <path d="M 350 200 Q 460 110 500 100" stroke="#06D6A0" strokeWidth="2.5" strokeDasharray="6,4" fill="none" />
                    <path d="M 350 200 Q 230 110 190 120" stroke="#06D6A0" strokeWidth="2" strokeDasharray="6,4" fill="none" />
                    <path d="M 350 200 Q 500 290 540 280" stroke="#06D6A0" strokeWidth="2" strokeDasharray="6,4" fill="none" />

                    {/* Mall 1: Tashkent City Mall */}
                    <circle cx="500" cy="100" r="32" fill="#06D6A0" fillOpacity="0.2" stroke="#06D6A0" strokeWidth="2" />
                    <circle cx="500" cy="100" r="12" fill="#0C4137" />
                    <text x="520" y="105" fontSize="11" fontWeight="bold" fill="#0C4137">Tashkent City Mall (280m)</text>

                    {/* Mall 2: Oloy Bozori */}
                    <circle cx="190" cy="120" r="28" fill="#06D6A0" fillOpacity="0.18" stroke="#06D6A0" strokeWidth="2" />
                    <circle cx="190" cy="120" r="10" fill="#0C4137" />
                    <text x="95" y="125" fontSize="11" fontWeight="bold" fill="#0C4137">Oloy Bozori (420m)</text>

                    {/* Mall 3: Korzinka */}
                    <circle cx="540" cy="280" r="24" fill="#06D6A0" fillOpacity="0.18" stroke="#06D6A0" strokeWidth="2" />
                    <circle cx="540" cy="280" r="9" fill="#0C4137" />
                    <text x="560" y="285" fontSize="11" fontWeight="bold" fill="#0C4137">Korzinka (310m)</text>

                    {/* Candidate Center */}
                    <circle cx="350" cy="200" r="16" fill="#06D6A0" stroke="#0C4137" strokeWidth="4" />
                    <text x="350" y="240" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0C4137">
                      Savdo Gravitatsiyasi (+42% xaridor oqimi)
                    </text>
                  </g>
                )}

                {/* STAGE 3: Competitor Saturation & Safe Oasis */}
                {activeStageIndex === 2 && (
                  <g className="transition-all duration-300">
                    {/* Safe Zone Perimeter */}
                    <circle cx="350" cy="200" r="140" fill="#E6FBF6" fillOpacity="0.75" stroke="#06D6A0" strokeWidth="2" strokeDasharray="5,4" />

                    {/* Competitor Threat Halos */}
                    <circle cx="510" cy="130" r="32" fill="url(#dangerHalo)" />
                    <circle cx="510" cy="130" r="9" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
                    <text x="530" y="135" fontSize="10" fontWeight="bold" fill="#EF4444">Raqobatchi #1 (350m)</text>

                    <circle cx="180" cy="270" r="32" fill="url(#dangerHalo)" />
                    <circle cx="180" cy="270" r="9" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
                    <text x="200" y="275" fontSize="10" fontWeight="bold" fill="#EF4444">Raqobatchi #2 (420m)</text>

                    {/* Monopol Bo'shliq */}
                    <circle cx="350" cy="200" r="48" fill="#06D6A0" fillOpacity="0.25" stroke="#06D6A0" strokeWidth="2.5" />
                    <circle cx="350" cy="200" r="14" fill="#0C4137" stroke="#06D6A0" strokeWidth="3" />
                    <text x="350" y="195" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0C4137">
                      Monopol Bo‘shliq («Oltin Nuqta»)
                    </text>
                    <text x="350" y="215" textAnchor="middle" fontSize="9" fontWeight="600" fill="#06D6A0">
                      Raqobat bosimi: 0% • Xavfsiz masofa: 350m
                    </text>
                  </g>
                )}

                {/* STAGE 4: Demographics & H3 Hexagons */}
                {activeStageIndex === 3 && (
                  <g className="transition-all duration-300">
                    <rect width="100%" height="100%" fill="url(#h3Grid)" opacity="0.9" />

                    {/* Residential Clusters */}
                    <rect x="110" y="80" width="120" height="75" rx="10" fill="#0C4137" fillOpacity="0.08" stroke="#0C4137" strokeWidth="1.5" />
                    <text x="125" y="115" fontSize="10" fontWeight="bold" fill="#0C4137">TJM Mirzo Ulug‘bek</text>
                    <text x="125" y="132" fontSize="9" fill="#0C4137" opacity="0.7">1,820 xonadon</text>

                    <rect x="460" y="60" width="145" height="90" rx="10" fill="#06D6A0" fillOpacity="0.22" stroke="#06D6A0" strokeWidth="2" />
                    <text x="475" y="100" fontSize="11" fontWeight="bold" fill="#0C4137">Tashkent City (Class A)</text>
                    <text x="475" y="118" fontSize="9" fill="#0C4137">4,200 xonadon + 18,000 ofis</text>

                    <rect x="410" y="240" width="150" height="85" rx="10" fill="#06D6A0" fillOpacity="0.18" stroke="#06D6A0" strokeWidth="2" />
                    <text x="425" y="280" fontSize="11" fontWeight="bold" fill="#0C4137">Mirobod Avenue</text>
                    <text x="425" y="298" fontSize="9" fill="#0C4137">Yuqori xarid quvvati</text>

                    <circle cx="350" cy="200" r="14" fill="#06D6A0" stroke="#0C4137" strokeWidth="4" />
                  </g>
                )}

                {/* STAGE 5: Synthesis & Ultimate MakonScore 94.0 */}
                {activeStageIndex === 4 && (
                  <g className="transition-all duration-300">
                    <rect width="100%" height="100%" fill="url(#h3Grid)" opacity="0.35" />
                    <circle cx="350" cy="200" r="160" fill="none" stroke="#06D6A0" strokeWidth="1.5" strokeOpacity="0.3" />
                    <circle cx="350" cy="200" r="105" fill="none" stroke="#06D6A0" strokeWidth="2" strokeOpacity="0.5" />
                    <circle cx="350" cy="200" r="65" fill="#E6FBF6" fillOpacity="0.9" stroke="#06D6A0" strokeWidth="3" />
                    <circle cx="350" cy="200" r="18" fill="#0C4137" stroke="#06D6A0" strokeWidth="4" />

                    <text x="350" y="206" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#FFFFFF">94</text>
                    <text x="350" y="290" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0C4137">
                      MakonScore: 94.0 / 100 • A-Grade Lokatsiya
                    </text>
                    <text x="350" y="310" textAnchor="middle" fontSize="10" fontWeight="600" fill="#06D6A0">
                      Oylik aylanma: $18,500 – $26,000 • Qoplanish: 7–9 oy
                    </text>
                  </g>
                )}
              </svg>

              {/* Live Status Overlay in Radar */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-[6px] bg-white/90 backdrop-blur-sm border border-[#0C4137]/[0.08] text-[10px] font-mono text-[#0C4137] flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06D6A0] animate-pulse" />
                <span>RADAR STATUSI: FAOL</span>
              </div>

              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-[6px] bg-white/90 backdrop-blur-sm border border-[#0C4137]/[0.08] text-[10px] font-mono text-neutral-500 shadow-xs">
                Radius: 800m • Zoom: 15.4
              </div>
            </div>
          </div>

          {/* Bottom Bar: Pinned Quick Status */}
          <div className="flex items-center justify-between pt-2 border-t border-[#0C4137]/[0.08] text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#06D6A0]" />
              <span>Bosqich {activeStage.stepNumber} / 05: {activeStage.subtitle}</span>
            </div>
            <span className="hidden sm:inline">Quyi skroll yoki tugmalar orqali o‘ting ↓</span>
          </div>
        </div>

        {/* Footer Sub-Cue */}
        <div className="text-center text-[11px] font-mono text-neutral-400 py-1 flex-shrink-0">
          Toshkent bo‘yicha PostGIS va Uber H3 fazoviy qatlamlari
        </div>
      </div>
    </section>
  );
};

export default ScrollExperience;
