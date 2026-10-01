import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  MapPin,
  TrendingUp,
  Search,
  Bell,
  CheckCircle2,
  Calendar,
  Layers,
  Compass,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Building,
  Users,
  Store,
  FileText,
  Radio,
  Clock,
  ShieldAlert,
  Train,
} from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { ShinyText } from '../ui/ShinyText';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Magnet } from '../ui/Magnet';

const HOURLY_DATA: Record<string, { label: string; count: string; detail: string }> = {
  '08': { label: '08:30 – Ertalabki Tranzit', count: '16,800+', detail: 'Metro va asosiy yo‘lovchi arteriyalari piki' },
  '12': { label: '12:30 – Tushlik & HoReCa', count: '14,200+', detail: 'Ofis xodimlari va biznes tushlik oqimi' },
  '16': { label: '16:00 – Kunduzgi Savdo', count: '11,500+', detail: 'Do‘konlar va xarid markazlari qamrovi' },
  '18': { label: '18:00 – Kechki Maksimum', count: '18,400+', detail: 'Eng yuqori konversiyali xarid va dam olish oqimi' },
  '20': { label: '20:00 – Oilaviy & Kechki Taom', count: '13,100+', detail: 'Turar-joy va ko‘ngilochar zonalar gavjumligi' },
  '22': { label: '22:00 – Kechki Tranzit', count: '6,400+', detail: 'Tungi dorixonalar va yengil tamaddi' },
};

const MONTHLY_BARS = [
  { month: 'Yan', height: '35%', val: '74.2' },
  { month: 'Fev', height: '52%', val: '79.5' },
  { month: 'Mart', height: '44%', val: '76.8' },
  { month: 'Apr', height: '68%', val: '86.4' },
  { month: 'May', height: '95%', val: '94.0', isPeak: true },
  { month: 'Iyun', height: '70%', val: '87.1' },
  { month: 'Iyul', height: '62%', val: '83.9' },
  { month: 'Avg', height: '58%', val: '81.4' },
  { month: 'Sen', height: '78%', val: '89.2' },
  { month: 'Okt', height: '84%', val: '91.8' },
];

export const LandingHero: React.FC = () => {
  const { setCurrentView, setSelectedCoords, generateAuditReport } = useAnalyticsStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'radar' | 'analytics'>('dashboard');
  const [selectedHour, setSelectedHour] = useState<string>('18');
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  const currentHourInfo = HOURLY_DATA[selectedHour] || HOURLY_DATA['18'];

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28 select-none">
      {/* Soothing, Eye-Pleasing Sky & Soft Cloud Canvas Background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        {/* Serene soft-sky gradient (Gentle on the eyes, never harsh) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#D6E7F8] via-[#EDF4FC] via-70% to-[#FFFFFF]" />

        {/* Ethereal, softly diffused atmospheric clouds with gentle breathing float */}
        <div className="absolute -top-16 -left-20 w-[450px] sm:w-[680px] h-[360px] sm:h-[480px] bg-white/70 rounded-full blur-[110px] transform -rotate-12 animate-cloud-slow" />
        <div className="absolute top-2 -right-16 w-[480px] sm:w-[720px] h-[380px] sm:h-[500px] bg-white/75 rounded-full blur-[120px] transform rotate-12 animate-cloud-reverse" />
        <div className="absolute top-44 left-1/2 -translate-x-1/2 w-[750px] sm:w-[1150px] h-[360px] sm:h-[460px] bg-white/60 rounded-full blur-[90px] animate-cloud-slow" />

        {/* Soft mist transition to bottom content */}
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Centered Typography (Calm, Confident, Prestigious) */}
        <div className="mx-auto max-w-4xl text-center space-y-5">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/80 border border-black/[0.06] shadow-xs text-xs font-mono font-semibold">
            <ShinyText text="O‘ZBEKISTONNING 14 TA HUDUDI BO‘YICHA FAZOVIY INTELLEKT" speed={5} />
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-bold text-[#0C4137] tracking-[-0.035em] leading-[1.08]">
            Ma’lumotlarga Asoslangan <br />
            <span className="text-[#0C4137]">Sun’iy Intellektli Qarorlar</span>
          </h1>

          <p className="mx-auto max-w-2xl text-[16px] sm:text-[18px] leading-[1.48] text-neutral-600 font-normal">
            Katta hajmdagi ma’lumotlarni osonlik bilan tahlil qiling, yangi trendlarni kashf eting va butun O‘zbekiston bo‘ylab eng daromadli lokatsiyalarni bir necha daqiqada tanlang.
          </p>

          {/* Dual Action Buttons (Glassy, Tactile, Calibrated Contrast) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            {/* Primary Pill Button (Deep Brunswick Green with Magnet) */}
            <Magnet magnetStrength={5}>
              <button
                onClick={() => setCurrentView('app')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#0C4137] hover:bg-[#072822] text-white text-[15px] font-semibold transition-all duration-200 shadow-xs hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Bepul sinab ko‘rish</span>
                <ArrowRight className="w-4 h-4 text-[#06D6A0]" />
              </button>
            </Magnet>

            {/* Secondary Frosted Glass Pill Button with Live Pulse Dot */}
            <Magnet magnetStrength={5}>
              <button
                onClick={() => {
                  setSelectedCoords({ latitude: 41.3123, longitude: 69.2797 });
                  setCurrentView('app');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white/80 hover:bg-white text-[#0C4137] text-[15px] font-semibold transition-all duration-200 border border-[#0C4137]/[0.12] shadow-xs hover:shadow-sm backdrop-blur-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#06D6A0] animate-pulse" />
                <span>Jonli demoni ko‘rish</span>
              </button>
            </Magnet>
          </div>
        </div>

        {/* Grand 3D-Perspective Device Showcase (Rejoin Layout Match) */}
        <div className="relative mt-14 sm:mt-20 max-w-[1180px] mx-auto">
          {/* Overlapping perspective stage */}
          <div className="relative flex items-center justify-center perspective-[1200px]">
            {/* 1. Left Mobile Companion Mockup (Overlapping & Tilted) */}
            <div className="hidden lg:block absolute -left-12 bottom-6 w-[260px] h-[480px] rounded-[36px] bg-white border-[6px] border-white/95 shadow-[0_30px_70px_rgba(12,65,55,0.12)] z-20 overflow-hidden transform -rotate-[7deg] translate-y-4 hover:translate-y-2 transition-all duration-300">
              {/* Mobile Notch & Speaker */}
              <div className="h-6 w-full bg-[#F8FAFC] border-b border-black/[0.04] flex items-center justify-center">
                <div className="w-16 h-2.5 rounded-full bg-black/[0.08]" />
              </div>

              {/* Mobile Screen Interior */}
              <div className="p-4 space-y-4 bg-[#F8FAFC] h-full text-left">
                {/* Mobile Header */}
                <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
                  <div className="flex items-center gap-2">
                    <img src="/brand/logo_icon.png" alt="Logo" className="w-5 h-5 object-contain" />
                    <span className="font-bold text-xs text-[#0C4137]">MakonSense</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E6FBF6] text-[#0C4137] font-bold border border-[#06D6A0]/30">
                    14 Viloyat
                  </span>
                </div>

                {/* Mobile Score Card */}
                <div className="p-3.5 rounded-[16px] bg-white border border-black/[0.06] shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 font-semibold uppercase">
                    <span>Toshkent / Samarqand</span>
                    <span className="text-emerald-600 font-bold">Faol</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black font-mono text-[#0C4137]">94.0</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-[#E6FBF6] px-2 py-0.5 rounded-full border border-[#06D6A0]/30">
                      +18.2% o‘sish
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#06D6A0] h-full rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>

                {/* Mobile Navigation List */}
                <div className="space-y-2">
                  <div
                    onClick={() => setActiveTab('radar')}
                    className={`flex items-center justify-between p-2.5 rounded-[12px] border text-xs font-semibold cursor-pointer transition-all ${
                      activeTab === 'radar'
                        ? 'bg-[#E6FBF6] border-[#06D6A0]/40 text-[#0C4137]'
                        : 'bg-white border-black/[0.04] text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#06D6A0]" />
                      <span>Shahar Radari</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </div>

                  <div
                    onClick={() => setActiveTab('analytics')}
                    className={`flex items-center justify-between p-2.5 rounded-[12px] border text-xs font-semibold cursor-pointer transition-all ${
                      activeTab === 'analytics'
                        ? 'bg-[#E6FBF6] border-[#06D6A0]/40 text-[#0C4137]'
                        : 'bg-white border-black/[0.04] text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#0C4137]" />
                      <span>Fazoviy Tahlil</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </div>

                  <div
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex items-center justify-between p-2.5 rounded-[12px] border text-xs font-semibold cursor-pointer transition-all ${
                      activeTab === 'dashboard'
                        ? 'bg-[#E6FBF6] border-[#06D6A0]/40 text-[#0C4137]'
                        : 'bg-white border-black/[0.04] text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#06D6A0]" />
                      <span>Umumiy Dashboard</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Main Large Tablet / Dashboard Chassis (Exact Centerpiece) */}
            <div className="w-full rounded-[30px] sm:rounded-[40px] border-[8px] sm:border-[12px] border-white/95 bg-white shadow-[0_30px_90px_-15px_rgba(12,65,55,0.14),0_15px_40px_rgba(0,0,0,0.04)] overflow-hidden z-10 transition-transform duration-500 hover:rotate-x-[2deg]">
              {/* Dashboard Internal Window */}
              <div className="bg-[#F8FAFC] flex flex-col min-h-[520px] sm:min-h-[580px]">
                {/* Top App Header Bar */}
                <div className="bg-white px-5 sm:px-7 py-3.5 border-b border-black/[0.06] flex items-center justify-between gap-4">
                  {/* Left Brand & Workspace Chip */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <img src="/brand/logo_icon.png" alt="MakonSense" className="w-6 h-6 object-contain" />
                      <span className="font-bold text-base text-[#0C4137] tracking-tight">MakonSense.</span>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-[10px] bg-[#F1F5F9] border border-black/[0.05] text-xs font-medium text-neutral-600">
                      <span className="w-2 h-2 rounded-full bg-[#06D6A0]" />
                      <span>O‘zbekiston Savdo Xaritasi</span>
                    </div>
                  </div>

                  {/* Right Profile & Action Buttons */}
                  <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[#F1F5F9] border border-black/[0.04] text-xs text-neutral-400 w-48">
                      <Search className="w-3.5 h-3.5" />
                      <span>Shahar yoki lokatsiya...</span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center text-neutral-600 hover:bg-neutral-200 cursor-pointer transition-colors relative">
                      <Bell className="w-4 h-4" />
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
                    </div>

                    <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-black/[0.08]">
                      <div className="w-8 h-8 rounded-full bg-[#0C4137] text-white flex items-center justify-center font-bold text-xs">
                        SR
                      </div>
                      <div className="text-left text-xs leading-none">
                        <div className="font-bold text-neutral-800">Sardor Rahimov</div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">Bosh Tahlilchi</div>
                      </div>
                    </div>

                    {/* Add New Report Button */}
                    <button
                      onClick={() => generateAuditReport()}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-[10px] bg-[#0C4137] hover:bg-[#072822] text-white text-xs font-semibold shadow-xs cursor-pointer transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#06D6A0]" />
                      <span>+ Yangi Hisobot</span>
                    </button>
                  </div>
                </div>

                {/* Dashboard Body: Sidebar + Main Panels */}
                <div className="flex flex-1 overflow-hidden">
                  {/* Left Icon-Led Navigation Sidebar */}
                  <div className="hidden md:flex flex-col justify-between w-52 bg-white border-r border-black/[0.06] p-4 text-left">
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono uppercase text-neutral-400 font-semibold px-2 mb-2">
                        Tahlil Bo‘limlari
                      </div>

                      <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-xs font-semibold transition-colors cursor-pointer ${
                          activeTab === 'dashboard'
                            ? 'bg-[#E6FBF6] text-[#0C4137] border border-[#06D6A0]/30'
                            : 'text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-[#06D6A0]" />
                          <span>Dashboard</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setActiveTab('radar')}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-xs font-semibold transition-colors cursor-pointer ${
                          activeTab === 'radar'
                            ? 'bg-[#E6FBF6] text-[#0C4137] border border-[#06D6A0]/30'
                            : 'text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Compass className="w-4 h-4 text-[#06D6A0]" />
                          <span>Shahar Radari</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setActiveTab('analytics')}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-xs font-semibold transition-colors cursor-pointer ${
                          activeTab === 'analytics'
                            ? 'bg-[#E6FBF6] text-[#0C4137] border border-[#06D6A0]/30'
                            : 'text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-[#06D6A0]" />
                          <span>Fazoviy Tahlil</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setCurrentView('app')}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-neutral-500" />
                          <span>Savdo Obyektlari</span>
                        </span>
                      </button>

                      <button
                        onClick={() => setCurrentView('app')}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-neutral-500" />
                          <span>Aholi & Xaridorlar</span>
                        </span>
                      </button>
                    </div>

                    {/* Sidebar Bottom Indicator */}
                    <div className="p-3 rounded-[12px] bg-[#F8FAFC] border border-black/[0.05] text-[11px] text-neutral-500 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[#0C4137]">
                        <span className="w-2 h-2 rounded-full bg-[#06D6A0]" />
                        <span>Baza Yangilandi</span>
                      </div>
                      <div>524,476 ta faol bino va korxona</div>
                    </div>
                  </div>

                  {/* Main Interior Content Area */}
                  <div className="flex-1 p-5 sm:p-7 space-y-6 text-left overflow-y-auto">
                    {/* Greeting Banner */}
                    <div className="space-y-1.5">
                      <div className="text-xl sm:text-2xl font-bold text-[#0C4137] tracking-tight">
                        Salom, Sardor! Xayrli tong!
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[8px] bg-[#E6FBF6] border border-[#06D6A0]/40 text-[#0C4137] text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#06D6A0] animate-pulse" />
                        <span>Sizda ko‘rib chiqilishi lozim bo‘lgan 8 ta yuqori salohiyatli lokatsiya mavjud ↗</span>
                      </div>
                    </div>

                    {/* DYNAMIC CONTENT SWITCHER BASED ON ACTIVE TAB */}
                    {activeTab === 'dashboard' && (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch animate-in fade-in duration-200">
                        {/* Left Chart Card: Regional Foot Traffic & Sales Dynamics (8 cols) */}
                        <SpotlightCard spotlightColor="rgba(6, 214, 160, 0.08)" className="lg:col-span-8 p-5 sm:p-6 rounded-[20px] bg-white border border-black/[0.06] shadow-xs flex flex-col justify-between space-y-5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-xs font-bold text-[#0C4137]">
                                <span className="w-2 h-2 rounded-full bg-[#06D6A0]" />
                                <span>Hududiy Savdo & Oqim Tahlili</span>
                              </div>
                              <div className="text-[11px] text-neutral-400">
                                Butun O‘zbekiston: Toshkent, Samarqand, Farg‘ona, Buxoro...
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-500 bg-[#F8FAFC] px-2.5 py-1 rounded-[8px] border border-black/[0.04]">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Yanvar 2026 – Oktyabr 2026 ▾</span>
                            </div>
                          </div>

                          {/* Top Key Metrics Row */}
                          <div className="flex flex-wrap items-baseline gap-6 pb-2 border-b border-black/[0.04]">
                            <div>
                              <span className="text-[11px] text-neutral-400 block font-medium">Jami Obyektlar</span>
                              <span className="text-xl sm:text-2xl font-bold font-mono text-[#0C4137]">524,476</span>
                              <span className="text-[10px] text-[#0C4137] font-bold ml-1.5 bg-[#E6FBF6] px-1.5 py-0.5 rounded border border-[#06D6A0]/30">+18.2%</span>
                            </div>
                            <div>
                              <span className="text-[11px] text-neutral-400 block font-medium">Model Aniqligi</span>
                              <span className="text-xl sm:text-2xl font-bold font-mono text-[#0C4137]">96.4%</span>
                            </div>
                            <div>
                              <span className="text-[11px] text-neutral-400 block font-medium">O‘rtacha Qoplanish</span>
                              <span className="text-xl sm:text-2xl font-bold font-mono text-[#0C4137]">8.2 oy</span>
                            </div>
                          </div>

                          {/* Visual Bar Chart with Striking Emerald/Brunswick Active Bar */}
                          <div className="relative pt-6 pb-2">
                            <div className="flex items-end justify-between gap-2 sm:gap-3 h-36 px-2">
                              {MONTHLY_BARS.map((bar) => {
                                const isHovered = hoveredBar === bar.month;
                                return (
                                  <div
                                    key={bar.month}
                                    onMouseEnter={() => setHoveredBar(bar.month)}
                                    onMouseLeave={() => setHoveredBar(null)}
                                    className="flex-1 flex flex-col items-center gap-2 relative group cursor-pointer"
                                  >
                                    {(bar.isPeak || isHovered) && (
                                      <div className="absolute -top-7 px-2 py-0.5 rounded-full bg-[#0C4137] text-white text-[9px] font-bold font-mono shadow-sm whitespace-nowrap animate-in fade-in duration-100">
                                        {bar.val} ball
                                      </div>
                                    )}
                                    <div
                                      className={`w-full rounded-t-[7px] transition-all duration-200 ${
                                        bar.isPeak
                                          ? 'bg-[#0C4137] shadow-[0_8px_18px_rgba(12,65,55,0.25)]'
                                          : isHovered
                                          ? 'bg-[#06D6A0]'
                                          : 'bg-[#E2E8F0] group-hover:bg-neutral-300'
                                      }`}
                                      style={{ height: bar.height }}
                                    />
                                    <span
                                      className={`text-[10px] font-mono ${
                                        bar.isPeak ? 'font-bold text-[#0C4137]' : 'text-neutral-400'
                                      }`}
                                    >
                                      {bar.month}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </SpotlightCard>

                        {/* Right KPI Card: MakonScore & Chain Network Breakdown (4 cols) */}
                        <SpotlightCard spotlightColor="rgba(6, 214, 160, 0.08)" className="lg:col-span-4 p-5 sm:p-6 rounded-[20px] bg-white border border-black/[0.06] shadow-xs flex flex-col justify-between space-y-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#0C4137] flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-[#06D6A0]" />
                                <span>O‘rtacha MakonScore™</span>
                              </span>
                              <span className="text-neutral-400 text-xs">•••</span>
                            </div>

                            <div className="flex items-baseline gap-2 pt-1">
                              <span className="text-3xl font-extrabold font-mono text-[#0C4137]">88.64%</span>
                              <span className="text-xs text-[#0C4137] font-bold bg-[#E6FBF6] px-1.5 py-0.5 rounded border border-[#06D6A0]/30">
                                +18.2%
                              </span>
                            </div>
                          </div>

                          {/* Hourly Activity Selector Pills (Interactive) */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase font-semibold">
                              <span>Pik Soatlar Dinamikasi</span>
                              <span className="text-[#0C4137] font-bold">{selectedHour}:00</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {['08', '12', '16', '18', '20', '22'].map((hour) => {
                                const isSelected = selectedHour === hour;
                                return (
                                  <button
                                    key={hour}
                                    onClick={() => setSelectedHour(hour)}
                                    className={`flex-1 text-center py-1.5 rounded-[8px] text-[11px] font-mono font-bold transition-all cursor-pointer ${
                                      isSelected
                                        ? 'bg-[#0C4137] text-white shadow-xs'
                                        : 'bg-[#F1F5F9] text-neutral-600 hover:bg-neutral-200'
                                    }`}
                                  >
                                    {hour}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="p-2 rounded-[8px] bg-[#F8FAFC] border border-black/[0.04] text-[11px] text-neutral-600">
                              <div className="font-bold text-[#0C4137]">{currentHourInfo.label}: {currentHourInfo.count}</div>
                              <div className="text-[10px] text-neutral-400">{currentHourInfo.detail}</div>
                            </div>
                          </div>

                          {/* Chain Network Breakdown Rows */}
                          <div className="space-y-2 pt-2 border-t border-black/[0.05]">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#0C4137]" />
                                <span className="font-semibold text-neutral-700">Korzinka & Makro</span>
                              </div>
                              <span className="font-mono font-bold text-emerald-600">+16.2%</span>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#06D6A0]" />
                                <span className="font-semibold text-neutral-700">Havas & Safia</span>
                              </div>
                              <span className="font-mono font-bold text-emerald-600">+12.8%</span>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                <span className="font-semibold text-neutral-700">Yandex Go & Tranzit</span>
                              </div>
                              <span className="font-mono font-bold text-emerald-600">+10.3%</span>
                            </div>
                          </div>

                          <button
                            onClick={() => setCurrentView('app')}
                            className="w-full py-2.5 rounded-[12px] bg-[#0C4137] hover:bg-[#072822] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                          >
                            <span>Interaktiv Xaritani Ochish</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#06D6A0]" />
                          </button>
                        </SpotlightCard>
                      </div>
                    )}

                    {/* TAB 2: LIVE RADAR HUD VIEW */}
                    {activeTab === 'radar' && (
                      <div className="p-6 rounded-[20px] bg-white border border-black/[0.06] shadow-xs space-y-5 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-black/[0.05]">
                          <div>
                            <div className="text-sm font-bold text-[#0C4137] flex items-center gap-2">
                              <Compass className="w-4 h-4 text-[#06D6A0]" />
                              <span>Jonli Shahar Radari Skaneri</span>
                            </div>
                            <div className="text-xs text-neutral-400">
                              Amir Temur, Samarqand Registon, Farg‘ona Sayilgoh
                            </div>
                          </div>
                          <div className="px-3 py-1 rounded-[6px] bg-[#E6FBF6] border border-[#06D6A0]/30 text-xs font-mono font-bold text-[#0C4137]">
                            41.3123° N, 69.2797° E
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="p-4 rounded-[14px] bg-[#F8FAFC] border border-black/[0.05] space-y-1">
                            <div className="text-[11px] font-mono text-neutral-400 font-semibold">Tranzit Oqimi</div>
                            <div className="text-2xl font-bold font-mono text-[#0C4137]">18,400+</div>
                            <div className="text-xs text-neutral-500">kunlik piyodalar oqimi</div>
                          </div>

                          <div className="p-4 rounded-[14px] bg-[#F8FAFC] border border-black/[0.05] space-y-1">
                            <div className="text-[11px] font-mono text-neutral-400 font-semibold">Savdo Gravitatsiyasi</div>
                            <div className="text-2xl font-bold font-mono text-[#0C4137]">91.2%</div>
                            <div className="text-xs text-neutral-500">4 ta yirik magnit markaz</div>
                          </div>

                          <div className="p-4 rounded-[14px] bg-[#F8FAFC] border border-black/[0.05] space-y-1">
                            <div className="text-[11px] font-mono text-neutral-400 font-semibold">Monopol Bo‘shliq</div>
                            <div className="text-2xl font-bold font-mono text-emerald-600">350 metr</div>
                            <div className="text-xs text-neutral-500">0% kannibalizatsiya</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-[12px] bg-[#E6FBF6] border border-[#06D6A0]/40 text-xs text-[#0C4137]">
                          <span className="flex items-center gap-2 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-[#06D6A0]" />
                            <span>Butun O‘zbekiston bo‘yicha 150,000+ obyektlar tahlili faol ishlamoqda.</span>
                          </span>
                          <button
                            onClick={() => setCurrentView('app')}
                            className="px-4 py-1.5 rounded-[8px] bg-[#0C4137] text-white font-semibold hover:bg-[#072822] cursor-pointer transition-all"
                          >
                            Xaritada ochish
                          </button>
                        </div>
                      </div>
                    )}

                    {/* TAB 3: SPATIAL ANALYTICS VIEW */}
                    {activeTab === 'analytics' && (
                      <div className="p-6 rounded-[20px] bg-white border border-black/[0.06] shadow-xs space-y-5 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-black/[0.05]">
                          <div>
                            <div className="text-sm font-bold text-[#0C4137] flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-[#06D6A0]" />
                              <span>Uber H3 Fazoviy Geksagonlar Auditi</span>
                            </div>
                            <div className="text-xs text-neutral-400">
                              Aholi daromadi, novostroykalar va xarid quvvati
                            </div>
                          </div>
                          <div className="px-3 py-1 rounded-[6px] bg-[#E6FBF6] border border-[#06D6A0]/30 text-xs font-mono font-bold text-[#0C4137]">
                            Res: 8 (460m)
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 rounded-[14px] bg-[#F8FAFC] border border-black/[0.05] space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-[#0C4137]">
                              <span>Aholi Zichligi (500m radius)</span>
                              <span className="font-mono text-emerald-600">3,850 xonadon</span>
                            </div>
                            <p className="text-xs text-neutral-500 leading-relaxed">
                              Toshkent City va Mirobod Avenue premium xonadonlari. Doimiy istiqomat qiluvchilar: 14,200+ kishi.
                            </p>
                          </div>

                          <div className="p-4 rounded-[14px] bg-[#F8FAFC] border border-black/[0.05] space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-[#0C4137]">
                              <span>Daromad Toifasi</span>
                              <span className="font-mono text-emerald-600">Class A & B+</span>
                            </div>
                            <p className="text-xs text-neutral-500 leading-relaxed">
                              Aholining o‘rtacha oylik daromadi shahar o‘rtacha darajasidan +48% yuqori.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setCurrentView('app')}
                          className="w-full py-2.5 rounded-[12px] bg-[#0C4137] hover:bg-[#072822] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <span>To‘liq Fazoviy Hisobotni Ko‘rish</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#06D6A0]" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof Strip Across All Uzbekistan */}
        <div className="pt-16 pb-4 md:pt-24 md:pb-6 text-center">
          <p className="text-[17px] sm:text-[19px] font-semibold text-[#0C4137]">
            O‘zbekistonning 14 ta hududida 500,000+ tijorat obyektlari tahlili
          </p>
          <p className="mt-1 text-xs sm:text-sm font-medium text-neutral-400">
            Toshkent, Samarqand, Farg‘ona, Buxoro, Andijon, Namangan va barcha yirik shaharlar
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
            {['Toshkent shahri', 'Samarqand viloyati', 'Farg‘ona vodiysi', 'Buxoro & Navoiy', 'Qashqadaryo & Surxondaryo', 'Xorazm & Qoraqalpog‘iston'].map((region, i) => (
              <div
                key={i}
                className="px-4 py-2 rounded-full border border-black/[0.06] bg-white/75 backdrop-blur-sm text-xs font-semibold text-[#0C4137] shadow-2xs hover:border-[#06D6A0] transition-colors"
              >
                📍 {region}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
