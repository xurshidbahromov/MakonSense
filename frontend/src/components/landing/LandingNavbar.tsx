import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  Moon,
  Sun,
  Menu,
  X,
  Coffee,
  ShoppingBag,
  Pill,
  ArrowRight,
  MapPin,
  Sparkles,
  Building,
} from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { Magnet } from '../ui/Magnet';

interface TabItem {
  id: string;
  label: string;
  href?: string;
  hasDropdown?: 'solutions' | 'regions';
}

const NAV_TABS: TabItem[] = [
  { id: 'home', label: 'Bosh sahifa' },
  { id: 'solutions', label: 'Yechimlar', hasDropdown: 'solutions' },
  { id: 'regions', label: 'Hududlar', hasDropdown: 'regions' },
  { id: 'radar', label: 'Shahar Radari', href: '#features' },
  { id: 'calculator', label: 'Moliya & ROI', href: '#calculator' },
];

export const LandingNavbar: React.FC = () => {
  const { setCurrentView } = useAnalyticsStore();
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [regionsOpen, setRegionsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-3.5 sm:top-5 left-0 right-0 z-50 pointer-events-none transition-all duration-300">
      {/* Harmonious Apple Proximity Container (max-w-5xl / 6xl rather than stretched 7xl) */}
      <div className="max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* ========================================================= */}
        {/* ISLAND 1 (LEFT): BRAND DYNAMIC ISLAND                     */}
        {/* Clean, iconic, Apple-minimalist, React Bits Magnet        */}
        {/* ========================================================= */}
        <Magnet magnetStrength={4}>
          <motion.div
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 450, damping: 26 }}
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`pointer-events-auto h-[46px] px-4 rounded-full border border-black/[0.07] bg-white/75 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] hover:bg-white/90 hover:border-black/[0.12] transition-all flex items-center gap-2.5 cursor-pointer select-none ${
              scrolled ? 'bg-white/85 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : ''
            }`}
          >
            <img
              src="/brand/logo_icon.png"
              alt="MakonSense Logo"
              className="h-5 w-auto object-contain"
            />
            <span className="font-bold text-[15px] tracking-[-0.02em] text-[#0C4137]">
              MakonSense
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#06D6A0] opacity-80" />
          </motion.div>
        </Magnet>

        {/* ========================================================= */}
        {/* ISLAND 2 (CENTER): DYNAMIC SEGMENTED SWITCH ISLAND        */}
        {/* Apple liquid sliding pill, optical padding, crystal glass  */}
        {/* ========================================================= */}
        <motion.nav
          whileHover={{ y: -0.5 }}
          transition={{ type: 'spring', stiffness: 450, damping: 26 }}
          onMouseLeave={() => {
            setHoveredTab(null);
            setSolutionsOpen(false);
            setRegionsOpen(false);
          }}
          className={`pointer-events-auto relative hidden md:flex items-center h-[46px] p-1 rounded-full border border-black/[0.07] bg-white/75 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] hover:border-black/[0.12] transition-all ${
            scrolled ? 'bg-white/85 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : ''
          }`}
        >
          {NAV_TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            const isHovered = hoveredTab === tab.id;
            const isSolutions = tab.hasDropdown === 'solutions';
            const isRegions = tab.hasDropdown === 'regions';

            const handleMouseEnter = () => {
              setHoveredTab(tab.id);
              if (isSolutions) {
                setSolutionsOpen(true);
                setRegionsOpen(false);
              } else if (isRegions) {
                setRegionsOpen(true);
                setSolutionsOpen(false);
              } else {
                setSolutionsOpen(false);
                setRegionsOpen(false);
              }
            };

            const handleClick = () => {
              setActiveTab(tab.id);
              if (tab.id === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            };

            const labelContent = (
              <>
                <span>{tab.label}</span>
                {tab.hasDropdown && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 opacity-50 ${
                      (isSolutions && solutionsOpen) || (isRegions && regionsOpen)
                        ? 'rotate-180 opacity-100 text-[#0C4137]'
                        : ''
                    }`}
                  />
                )}
              </>
            );

            return (
              <div key={tab.id} className="relative">
                {/* Framer Motion Sliding Active Pill */}
                {isSelected && (
                  <motion.div
                    layoutId="dynamic-island-active-pill"
                    transition={{ type: 'spring', stiffness: 440, damping: 32 }}
                    className="absolute inset-0 z-0 bg-white rounded-full border border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                  />
                )}

                {/* Framer Motion Hover Ghost Pill */}
                {isHovered && !isSelected && (
                  <motion.div
                    layoutId="dynamic-island-hover-pill"
                    transition={{ type: 'spring', stiffness: 480, damping: 35 }}
                    className="absolute inset-0 z-0 bg-black/[0.03] rounded-full"
                  />
                )}

                {tab.href ? (
                  <a
                    href={tab.href}
                    onMouseEnter={handleMouseEnter}
                    onClick={handleClick}
                    className={`relative z-10 flex items-center gap-1.5 px-3.5 py-1.5 text-[13.5px] rounded-full transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                      isSelected ? 'text-[#0C4137] font-semibold' : 'text-neutral-600 hover:text-neutral-900 font-medium'
                    }`}
                  >
                    {labelContent}
                  </a>
                ) : (
                  <button
                    onMouseEnter={handleMouseEnter}
                    onClick={handleClick}
                    className={`relative z-10 flex items-center gap-1.5 px-3.5 py-1.5 text-[13.5px] rounded-full transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                      isSelected ? 'text-[#0C4137] font-semibold' : 'text-neutral-600 hover:text-neutral-900 font-medium'
                    }`}
                  >
                    {labelContent}
                  </button>
                )}

                {/* Solutions Dropdown Menu (AnimatePresence) */}
                <AnimatePresence>
                  {isSolutions && solutionsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                      onMouseEnter={() => setSolutionsOpen(true)}
                      onMouseLeave={() => setSolutionsOpen(false)}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[400px] sm:w-[440px] bg-white/95 backdrop-blur-3xl border border-black/[0.08] shadow-[0_24px_50px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] rounded-[24px] p-3 space-y-1.5 z-50"
                    >
                      <div className="px-3 pt-1 pb-2 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold border-b border-black/[0.04]">
                        <span>Sohaviy Geomarketing Tahlili</span>
                        <span className="text-[#06D6A0] font-bold">Sun’iy Intellekt</span>
                      </div>

                      <a
                        href="#solutions"
                        onClick={() => setSolutionsOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-[16px] hover:bg-black/[0.035] transition-all duration-200 ease-out group cursor-pointer"
                      >
                        <Coffee className="w-5 h-5 text-[#0C4137] group-hover:-translate-y-0.5 transition-transform duration-200 ease-out mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0 group-hover:translate-x-1.5 transition-transform duration-200 ease-out">
                          <div className="text-[13px] font-bold text-[#0C4137] flex items-center justify-between">
                            <span>HoReCa, Kafe & Restoranlar</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#0C4137] opacity-0 -translate-x-1.5 group-hover:opacity-40 group-hover:translate-x-0 transition-all duration-200 ease-out" />
                          </div>
                          <div className="text-[11px] text-neutral-500 leading-snug mt-0.5">
                            Piyoda tranzit oqimi, pik soatlar va raqobat tahlili
                          </div>
                        </div>
                      </a>

                      <a
                        href="#solutions"
                        onClick={() => setSolutionsOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-[16px] hover:bg-black/[0.035] transition-all duration-200 ease-out group cursor-pointer"
                      >
                        <ShoppingBag className="w-5 h-5 text-[#0C4137] group-hover:-translate-y-0.5 transition-transform duration-200 ease-out mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0 group-hover:translate-x-1.5 transition-transform duration-200 ease-out">
                          <div className="text-[13px] font-bold text-[#0C4137] flex items-center justify-between">
                            <span>Supermarket & Chakana Savdo</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#0C4137] opacity-0 -translate-x-1.5 group-hover:opacity-40 group-hover:translate-x-0 transition-all duration-200 ease-out" />
                          </div>
                          <div className="text-[11px] text-neutral-500 leading-snug mt-0.5">
                            Aholi zichligi, xarid quvvati va to‘lov layoqati
                          </div>
                        </div>
                      </a>

                      <a
                        href="#solutions"
                        onClick={() => setSolutionsOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-[16px] hover:bg-black/[0.035] transition-all duration-200 ease-out group cursor-pointer"
                      >
                        <Pill className="w-5 h-5 text-[#0C4137] group-hover:-translate-y-0.5 transition-transform duration-200 ease-out mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0 group-hover:translate-x-1.5 transition-transform duration-200 ease-out">
                          <div className="text-[13px] font-bold text-[#0C4137] flex items-center justify-between">
                            <span>Dorixona, Tibbiyot & Optika</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#0C4137] opacity-0 -translate-x-1.5 group-hover:opacity-40 group-hover:translate-x-0 transition-all duration-200 ease-out" />
                          </div>
                          <div className="text-[11px] text-neutral-500 leading-snug mt-0.5">
                            Monopol radius, retseptli tranzit va bemorlar oqimi
                          </div>
                        </div>
                      </a>

                      <a
                        href="#solutions"
                        onClick={() => setSolutionsOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-[16px] hover:bg-black/[0.035] transition-all duration-200 ease-out group cursor-pointer"
                      >
                        <Building className="w-5 h-5 text-[#0C4137] group-hover:-translate-y-0.5 transition-transform duration-200 ease-out mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0 group-hover:translate-x-1.5 transition-transform duration-200 ease-out">
                          <div className="text-[13px] font-bold text-[#0C4137] flex items-center justify-between">
                            <span>Ko‘chmas Mulk & Tijoriy Bino</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#0C4137] opacity-0 -translate-x-1.5 group-hover:opacity-40 group-hover:translate-x-0 transition-all duration-200 ease-out" />
                          </div>
                          <div className="text-[11px] text-neutral-500 leading-snug mt-0.5">
                            ROI prognozi, ijara stavkalari va qaytish muddati
                          </div>
                        </div>
                      </a>

                      {/* Interactive Bottom CTA Footer (Calm & Minimalist) */}
                      <div
                        onClick={() => {
                          setSolutionsOpen(false);
                          setCurrentView('app');
                        }}
                        className="mt-1 pt-2.5 border-t border-black/[0.04] px-3 py-2.5 rounded-[14px] bg-black/[0.02] hover:bg-black/[0.04] flex items-center justify-between group cursor-pointer transition-colors duration-200"
                      >
                        <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-200 ease-out">
                          <Sparkles className="w-4 h-4 text-[#0C4137]/70" />
                          <span className="text-xs font-semibold text-[#0C4137]">
                            O‘z biznesingiz bo‘yicha bepul tahlil oling
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#0C4137]/60 group-hover:translate-x-1 transition-transform duration-200 ease-out" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Regions Dropdown Menu (AnimatePresence) */}
                <AnimatePresence>
                  {isRegions && regionsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 440, damping: 28 }}
                      onMouseEnter={() => setRegionsOpen(true)}
                      onMouseLeave={() => setRegionsOpen(false)}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[420px] sm:w-[460px] bg-white/95 backdrop-blur-3xl border border-black/[0.08] shadow-[0_24px_50px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] rounded-[24px] p-3.5 space-y-2 z-50"
                    >
                      <div className="px-2 pt-1 pb-1 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold border-b border-black/[0.04]">
                        <span>Butun O‘zbekiston Qamrovi</span>
                        <span className="text-[#0C4137] font-bold">14 Ta Hudud</span>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <div
                          onClick={() => {
                            setRegionsOpen(false);
                            setCurrentView('app');
                          }}
                          className="p-2.5 rounded-[14px] hover:bg-black/[0.035] transition-all duration-200 cursor-pointer group"
                        >
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0C4137] group-hover:translate-x-1 transition-transform duration-200 ease-out">
                            <MapPin className="w-3.5 h-3.5 text-[#0C4137]/70 flex-shrink-0 group-hover:-translate-y-0.5 transition-transform duration-200" />
                            <span>Toshkent shahri</span>
                          </div>
                          <div className="text-[10px] text-neutral-400 pl-5">Markaziy hab • 52k+ bino</div>
                        </div>

                        <div
                          onClick={() => {
                            setRegionsOpen(false);
                            setCurrentView('app');
                          }}
                          className="p-2.5 rounded-[14px] hover:bg-black/[0.035] transition-all duration-200 cursor-pointer group"
                        >
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0C4137] group-hover:translate-x-1 transition-transform duration-200 ease-out">
                            <MapPin className="w-3.5 h-3.5 text-[#0C4137]/70 flex-shrink-0 group-hover:-translate-y-0.5 transition-transform duration-200" />
                            <span>Samarqand</span>
                          </div>
                          <div className="text-[10px] text-neutral-400 pl-5">Sayyohlik & Retail • 38k+</div>
                        </div>

                        <div
                          onClick={() => {
                            setRegionsOpen(false);
                            setCurrentView('app');
                          }}
                          className="p-2.5 rounded-[14px] hover:bg-black/[0.035] transition-all duration-200 cursor-pointer group"
                        >
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0C4137] group-hover:translate-x-1 transition-transform duration-200 ease-out">
                            <MapPin className="w-3.5 h-3.5 text-[#0C4137]/70 flex-shrink-0 group-hover:-translate-y-0.5 transition-transform duration-200" />
                            <span>Farg‘ona vodiysi</span>
                          </div>
                          <div className="text-[10px] text-neutral-400 pl-5">Aholi zichligi • 72k+</div>
                        </div>

                        <div
                          onClick={() => {
                            setRegionsOpen(false);
                            setCurrentView('app');
                          }}
                          className="p-2.5 rounded-[14px] hover:bg-black/[0.035] transition-all duration-200 cursor-pointer group"
                        >
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0C4137] group-hover:translate-x-1 transition-transform duration-200 ease-out">
                            <MapPin className="w-3.5 h-3.5 text-[#0C4137]/70 flex-shrink-0 group-hover:-translate-y-0.5 transition-transform duration-200" />
                            <span>Buxoro & Navoiy</span>
                          </div>
                          <div className="text-[10px] text-neutral-400 pl-5">Sanoat & Biznes • 31k+</div>
                        </div>

                        <div
                          onClick={() => {
                            setRegionsOpen(false);
                            setCurrentView('app');
                          }}
                          className="p-2.5 rounded-[14px] hover:bg-black/[0.035] transition-all duration-200 cursor-pointer group"
                        >
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0C4137] group-hover:translate-x-1 transition-transform duration-200 ease-out">
                            <MapPin className="w-3.5 h-3.5 text-[#0C4137]/70 flex-shrink-0 group-hover:-translate-y-0.5 transition-transform duration-200" />
                            <span>Qashqadaryo & Surxondaryo</span>
                          </div>
                          <div className="text-[10px] text-neutral-400 pl-5">Janubiy tranzit • 44k+</div>
                        </div>

                        <div
                          onClick={() => {
                            setRegionsOpen(false);
                            setCurrentView('app');
                          }}
                          className="p-2.5 rounded-[14px] hover:bg-black/[0.035] transition-all duration-200 cursor-pointer group"
                        >
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0C4137] group-hover:translate-x-1 transition-transform duration-200 ease-out">
                            <MapPin className="w-3.5 h-3.5 text-[#0C4137]/70 flex-shrink-0 group-hover:-translate-y-0.5 transition-transform duration-200" />
                            <span>Qoraqalpog‘iston & Xorazm</span>
                          </div>
                          <div className="text-[10px] text-neutral-400 pl-5">G‘arbiy zonalar • 29k+</div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-black/[0.04] text-[11px] text-neutral-500 px-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium text-neutral-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0C4137]/40" />
                          208 ta tuman fazoviy monitoringda
                        </span>
                        <span className="font-mono text-[10px] text-[#0C4137] font-bold bg-black/[0.04] px-2 py-0.5 rounded-full">
                          524,476 ta bino
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.nav>

        {/* ========================================================= */}
        {/* ISLAND 3 (RIGHT): ACTION & CONTROL DYNAMIC ISLAND          */}
        {/* Apple glass mode toggle, Kirish, Magnet CTA Boshlash      */}
        {/* ========================================================= */}
        <motion.div
          whileHover={{ y: -0.5 }}
          transition={{ type: 'spring', stiffness: 450, damping: 26 }}
          className={`pointer-events-auto hidden sm:flex items-center h-[46px] px-2 rounded-full border border-black/[0.07] bg-white/75 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] hover:border-black/[0.12] transition-all gap-1.5 ${
            scrolled ? 'bg-white/85 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : ''
          }`}
        >
          {/* Apple-style minimalist glass mode toggle */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-8 h-8 rounded-full bg-black/[0.03] hover:bg-black/[0.06] border border-black/[0.04] flex items-center justify-center text-neutral-600 hover:text-black transition-colors cursor-pointer select-none"
            title="Mavzu rejimi"
          >
            {isDarkMode ? (
              <Moon className="w-3.5 h-3.5 text-[#06D6A0]" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            )}
          </motion.button>

          {/* Log In Link */}
          <button
            onClick={() => setCurrentView('app')}
            className="text-neutral-700 hover:text-[#0C4137] font-medium text-[13px] px-3 py-1.5 transition-colors cursor-pointer"
          >
            Kirish
          </button>

          {/* Single Dominant CTA Button with React Bits Magnet */}
          <Magnet magnetStrength={4}>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setCurrentView('app')}
              className="group inline-flex items-center justify-center gap-1.5 h-[34px] px-4 rounded-full bg-[#0C4137] hover:bg-[#072822] text-white text-[13px] font-semibold cursor-pointer whitespace-nowrap transition-all shadow-xs"
            >
              <span>Boshlash</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#06D6A0] group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </Magnet>
        </motion.div>

        {/* Mobile Hamburger Island */}
        <div className="pointer-events-auto md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-[46px] w-[46px] rounded-full border border-black/[0.07] bg-white/80 backdrop-blur-2xl text-neutral-700 flex items-center justify-center hover:bg-white transition-all cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-[#0C4137]" /> : <Menu className="w-4 h-4 text-[#0C4137]" />}
          </button>
        </div>
      </div>

      {/* Mobile Dynamic Island Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="pointer-events-auto md:hidden mx-4 mt-2 bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-[22px] p-4 space-y-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
          >
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-semibold text-[#0C4137] rounded-xl hover:bg-neutral-50 transition-colors"
            >
              Shahar Radari
            </a>
            <a
              href="#solutions"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-semibold text-[#0C4137] rounded-xl hover:bg-neutral-50 transition-colors"
            >
              Yechimlar (HoReCa, Retail, Dorixona)
            </a>
            <a
              href="#compare"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-semibold text-[#0C4137] rounded-xl hover:bg-neutral-50 transition-colors"
            >
              A/B Taqqoslash
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-semibold text-[#0C4137] rounded-xl hover:bg-neutral-50 transition-colors"
            >
              Moliya & ROI
            </a>
            <div className="pt-2 border-t border-black/[0.05] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentView('app');
                }}
                className="w-full py-2.5 rounded-full bg-[#0C4137] text-white font-semibold text-xs text-center"
              >
                Platformaga Kirish
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default LandingNavbar;
