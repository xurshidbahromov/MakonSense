import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Train,
  Users,
  Compass,
  FileText,
  Layers,
  ChevronRight,
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
  statusColor: string;
  badgeBg: string;
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
    statusColor: '#10B981',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    transitScore: 92.5,
    nearestMetro: 'Amir Temur Xiyoboni',
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
    statusColor: '#06B6D4',
    badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
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
    statusColor: '#10B981',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    transitScore: 89.0,
    nearestMetro: 'Paxtakor / Alisher Navoiy',
    metroDist: 340,
    competitors: 3,
    households: 4200,
  },
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
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      {/* Background Radial Atmosphere Bloom */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-emerald-500/15 via-cyan-500/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* Subtle Perspective Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1F243315_1px,transparent_1px),linear-gradient(to_bottom,#1F243315_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Badge */}
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-lg shadow-emerald-950/30 animate-in fade-in slide-in-from-top-4 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Toshkent shahri uchun ilk Spatial Intelligence tizimi</span>
            <span className="w-1 h-1 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-mono text-emerald-400">PostGIS + Uber H3</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
            Toshkentda biznes ochishdan oldin uning{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              daromadlilik salohiyatini
            </span>{' '}
            soniyalarda hisoblang.
          </h1>

          {/* Subtitle with Real Commercial Problem Statement */}
          <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed max-w-3xl font-normal">
            Har yili noto‘g‘ri lokatsiya sababli yangi kafe, do‘kon va dorixonalarning <strong>45% i birinchi yilda yopiladi</strong> va biznesga <strong>$30,000 dan $100,000 gacha</strong> zarar keltiradi. MakonSense — millionlab fazoviy ma’lumotlar orqali eng optimal va kam xavfli nuqtani topib beradi.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 w-full sm:w-auto">
            <button
              onClick={() => setCurrentView('app')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold text-sm sm:text-base transition-all duration-200 shadow-xl shadow-emerald-950/60 hover:shadow-emerald-900/50 active:scale-[0.98] group"
            >
              <MapPin className="w-4 h-4" />
              <span>Xaritani Ochish va Hisoblash</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => generateAuditReport()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#121520] hover:bg-[#1A1E2C] border border-white/10 hover:border-white/20 text-gray-200 font-bold text-sm transition-all duration-200 active:scale-[0.98]"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>PDF Audit Namunasini Ko'rish</span>
            </button>
          </div>

          {/* Trust Numbers Ticker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 pt-8 pb-4 border-t border-white/[0.08] w-full max-w-4xl text-center">
            <div>
              <div className="text-xl sm:text-2xl font-black font-mono text-white">150,000+</div>
              <div className="text-[11px] text-gray-400 font-medium mt-0.5">Toshkent binolari bazasi</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black font-mono text-cyan-400">48+</div>
              <div className="text-[11px] text-gray-400 font-medium mt-0.5">Metro & tranzit bekatlari</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">100%</div>
              <div className="text-[11px] text-gray-400 font-medium mt-0.5">PostGIS fazoviy aniqlik</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black font-mono text-purple-400">0 ms</div>
              <div className="text-[11px] text-gray-400 font-medium mt-0.5">Bir lahzalik hisoblash</div>
            </div>
          </div>
        </div>

        {/* Live Interactive Product Teaser Container */}
        <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
          <div className="relative rounded-3xl p-1 bg-gradient-to-b from-white/15 via-white/[0.05] to-transparent shadow-2xl">
            <div className="bg-[#0B0D15]/95 backdrop-blur-2xl rounded-[22px] border border-white/[0.08] overflow-hidden p-5 sm:p-7 space-y-6">
              {/* Teaser Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      Jonli Fazoviy Namoyish
                      <span className="text-[10px] text-gray-400 font-normal hidden sm:inline">
                        — Toshkent bo'yicha namunaviy nuqtalar
                      </span>
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Quyidagi nuqtalardan birini bosing va natijani solishtiring:
                    </p>
                  </div>
                </div>

                {/* Point Switcher Tabs */}
                <div className="flex items-center gap-1.5 bg-[#141724] p-1 rounded-xl border border-white/[0.08] overflow-x-auto">
                  {HERO_DEMOS.map((demo) => {
                    const isSelected = activeDemo.id === demo.id;
                    return (
                      <button
                        key={demo.id}
                        onClick={() => setActiveDemo(demo)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap active:scale-[0.98] ${
                          isSelected
                            ? 'bg-emerald-500 text-black shadow-sm'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {demo.name.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Teaser Body: Gauge + 3-Metric Cards + Direct Platform Entry */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Score Gauge Card (4 cols) */}
                <div className="md:col-span-5 bg-[#121522] border border-white/[0.08] rounded-2xl p-5 flex items-center gap-5 relative overflow-hidden">
                  <div
                    className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-20 pointer-events-none transition-all duration-700"
                    style={{ backgroundColor: activeDemo.statusColor }}
                  />

                  {/* Circular Gauge */}
                  <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r={radius} className="stroke-white/[0.08]" strokeWidth="9" fill="transparent" />
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        stroke={activeDemo.statusColor}
                        strokeWidth="9"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center select-none">
                      <span className="text-2xl font-black font-mono text-white leading-none">
                        <AnimatedCounter value={activeDemo.score} decimals={1} />
                      </span>
                      <span className="text-[8px] text-gray-400 font-bold uppercase mt-1">/ 100</span>
                    </div>
                  </div>

                  {/* Score details */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">MakonScore Reytingi</span>
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block ${activeDemo.badgeBg}`}>
                      {activeDemo.status}
                    </div>
                    <div className="text-xs font-semibold text-white truncate pt-1">{activeDemo.name}</div>
                    <div className="text-[10px] text-gray-400">{activeDemo.district}</div>
                  </div>
                </div>

                {/* Factors Summary Cards (7 cols) */}
                <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Tranzit */}
                  <div className="bg-[#121522] border border-white/[0.08] rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold">
                      <Train className="w-3.5 h-3.5" />
                      <span>Tranzit Oqimi</span>
                    </div>
                    <div className="text-lg font-mono font-bold text-white">
                      {activeDemo.transitScore} <span className="text-xs text-gray-400 font-normal">/ 100</span>
                    </div>
                    <div className="text-[10px] text-gray-400 truncate">
                      {activeDemo.metroDist}m ({activeDemo.nearestMetro})
                    </div>
                  </div>

                  {/* Raqobat */}
                  <div className="bg-[#121522] border border-white/[0.08] rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Raqobatchilar</span>
                    </div>
                    <div className="text-lg font-mono font-bold text-white">
                      {activeDemo.competitors} <span className="text-xs text-gray-400 font-normal">ta nuqta</span>
                    </div>
                    <div className="text-[10px] text-gray-400">400m radius ichida</div>
                  </div>

                  {/* Aholi */}
                  <div className="bg-[#121522] border border-white/[0.08] rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold">
                      <Users className="w-3.5 h-3.5" />
                      <span>Aholi Qamrovi</span>
                    </div>
                    <div className="text-lg font-mono font-bold text-white">
                      ~{activeDemo.households.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-gray-400">Xonadon potensiali</div>
                  </div>
                </div>
              </div>

              {/* Bottom Teaser Launch Prompt */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  Xaritada Toshkentning istalgan nuqtasini bosib real vaqtda tahlil qiling
                </span>
                <button
                  onClick={() => handleLaunchToPoint(activeDemo)}
                  className="flex items-center gap-1.5 font-bold text-emerald-400 hover:text-emerald-300 transition-colors group cursor-pointer"
                >
                  <span>Ushbu nuqtani 3D xaritada ochish</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
