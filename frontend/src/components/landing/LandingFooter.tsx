import React, { useState } from 'react';
import { ArrowRight, MapPin, Search, ShieldCheck, Database, Layers, CheckCircle2 } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

const PRESET_LOCATIONS = [
  { name: 'Amir Temur (Toshkent)', lat: 41.3123, lon: 69.2797 },
  { name: 'Universitet Xiyoboni (Samarqand)', lat: 39.6542, lon: 66.9597 },
  { name: 'Sayilgoh Ko‘chasi (Farg‘ona)', lat: 40.3864, lon: 71.7864 },
  { name: 'Lab-i Hovuz Markazi (Buxoro)', lat: 39.7747, lon: 64.4286 },
];

export const LandingFooter: React.FC = () => {
  const { setCurrentView, setSelectedCoords } = useAnalyticsStore();
  const [selectedLocation, setSelectedLocation] = useState(PRESET_LOCATIONS[0]);

  const handleLaunch = () => {
    setSelectedCoords({ latitude: selectedLocation.lat, longitude: selectedLocation.lon });
    setCurrentView('app');
  };

  return (
    <footer className="border-t border-[#0C4137]/[0.08] bg-[#F7F9F8] relative overflow-hidden select-none">
      {/* Interactive Location Scan Chassis */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="relative rounded-[18px] p-8 sm:p-14 bg-white border border-[#0C4137]/[0.1] shadow-[0_16px_50px_rgba(12,65,55,0.06)] overflow-hidden">
          {/* Subtle geometric grid background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0C413708_1px,transparent_1px),linear-gradient(to_bottom,#0C413708_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#E6FBF6] border border-[#06D6A0]/30 text-[#0C4137] text-xs font-mono font-semibold">
                <span className="text-[#06D6A0]">●</span>
                <span>TEZKOR SKANERLASH</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-[#0C4137] tracking-tight leading-[1.1]">
                O‘zbekistondagi manzilingizni tekshirishga tayyormisiz? <br />
                <span className="text-neutral-400">Bir zumda MakonScore hisoblang.</span>
              </h2>

              <p className="text-sm sm:text-base text-neutral-600 max-w-xl leading-relaxed">
                Bir marta noto‘g‘ri lokatsiyadan asralgan mablag‘ — biznesingizning kelgusi 5 yillik barqarorligi va yuqori daromadini ta’minlaydi.
              </p>

              {/* Trust Metric Chips */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#F7F9F8] border border-[#0C4137]/[0.08] text-xs font-medium text-[#0C4137]">
                  <Database className="w-3.5 h-3.5 text-[#06D6A0]" />
                  <span>500,000+ O‘zbekiston binolari</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#F7F9F8] border border-[#0C4137]/[0.08] text-xs font-medium text-[#0C4137]">
                  <Layers className="w-3.5 h-3.5 text-[#06D6A0]" />
                  <span>14 ta viloyat • 208 ta tuman</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#E6FBF6] border border-[#06D6A0]/30 text-xs font-semibold text-[#0C4137]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#06D6A0]" />
                  <span>0 xavf • Bepul sinov</span>
                </div>
              </div>
            </div>

            {/* Right Action: Interactive Location Selector & Launch Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-[14px] bg-[#F7F9F8] border border-[#0C4137]/[0.1] shadow-sm space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold text-[#0C4137]">
                  <span className="flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-[#06D6A0]" />
                    <span>Sinov uchun lokatsiyani tanlang:</span>
                  </span>
                  <span className="text-[11px] text-[#06D6A0] font-mono">Toshkent</span>
                </div>

                {/* Preset Chips */}
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_LOCATIONS.map((loc, i) => {
                    const isSelected = selectedLocation.name === loc.name;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedLocation(loc)}
                        className={`p-2.5 rounded-[8px] text-xs font-semibold text-left transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#0C4137] text-white border-[#0C4137] shadow-sm'
                            : 'bg-white text-neutral-700 border-[#0C4137]/[0.08] hover:border-[#06D6A0]'
                        }`}
                      >
                        <div className="truncate">{loc.name}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Location Details */}
                <div className="p-3 rounded-[8px] bg-white border border-[#0C4137]/[0.08] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#06D6A0]" />
                    <span className="font-bold text-[#0C4137]">{selectedLocation.name}</span>
                  </div>
                  <span className="font-mono text-neutral-400 text-[11px]">
                    {selectedLocation.lat.toFixed(4)}, {selectedLocation.lon.toFixed(4)}
                  </span>
                </div>

                {/* Primary Launch Action */}
                <button
                  onClick={handleLaunch}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-[10px] bg-[#0C4137] hover:bg-[#072822] text-white font-semibold text-sm transition-all duration-150 ease-out active:scale-[0.98] shadow-sm hover:shadow group cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#06D6A0]" />
                  <span>Ushbu Manzilni Skanerlash</span>
                  <ArrowRight className="w-4 h-4 text-[#06D6A0] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Professional Footer Navigation Grid */}
        <div className="pt-16 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 border-b border-[#0C4137]/[0.08]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/brand/logo_icon.png"
                alt="MakonSense Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="font-bold text-[#0C4137] text-lg tracking-tight">MakonSense</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed max-w-sm">
              Toshkent shahri uchun yetakchi fazoviy tahlil va geomarketing platformasi. Har bir tijoriy qaroringizni aniq ko‘rsatkichlarga asoslang.
            </p>
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[#E6FBF6] border border-[#06D6A0]/30 text-xs font-mono font-medium text-[#0C4137]">
              <span className="w-2 h-2 rounded-full bg-[#06D6A0] animate-pulse" />
              <span>Toshkent Fazoviy Tizimi Faol (2026)</span>
            </div>
          </div>

          {/* Col 1: Mahsulot */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-[#0C4137] uppercase tracking-wider font-mono">
              MAHSULOT
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li>
                <button onClick={() => setCurrentView('app')} className="hover:text-[#0C4137] transition-colors text-left cursor-pointer">
                  Interaktiv 3D Xarita
                </button>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#0C4137] transition-colors">MakonScore Indeksi</a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#0C4137] transition-colors">5-Qatlamli Radar</a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-[#0C4137] transition-colors">Sohaviy Yechimlar</a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-[#0C4137] transition-colors">Moliyaviy Himoya (ROI)</a>
              </li>
            </ul>
          </div>

          {/* Col 2: Ma'lumotlar Bazasi */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-[#0C4137] uppercase tracking-wider font-mono">
              MA’LUMOTLAR BAZASI
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li><span>48 ta Metro Bekatlari</span></li>
              <li><span>12 ta Ma’muriy Tuman</span></li>
              <li><span>2,400+ Raqobatchi Obyektlari</span></li>
              <li><span>Piyodalar Oqimi Modeli</span></li>
              <li><span>Uber H3 Geksagonlari</span></li>
            </ul>
          </div>

          {/* Col 3: Bog'lanish */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-[#0C4137] uppercase tracking-wider font-mono">
              BOG‘LANISH
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li>
                <a href="https://t.me/makonsense" target="_blank" rel="noreferrer" className="hover:text-[#0C4137] transition-colors">
                  Telegram: @makonsense
                </a>
              </li>
              <li>
                <a href="mailto:info@makonsense.uz" className="hover:text-[#0C4137] transition-colors">
                  info@makonsense.uz
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#0C4137] transition-colors">Savol-Javob</a>
              </li>
              <li>
                <span className="text-neutral-500">Toshkent, O‘zbekiston</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © 2026 MakonSense Inc. Barcha huquqlar himoyalangan.
          </div>
          <div className="text-neutral-500">
            Toshkent shahri uchun yetakchi geomarketing va shahar analitikasi platformasi.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
