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
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-3.5 sm:top-5 left-0 right-0 z-50 pointer-events-none transition-all duration-300">
      {/* Dynamic Container: wide & borderless at top (max-w-7xl), compacts to original island width on scroll (max-w-5xl/6xl) */}
      <div
        className={`mx-auto transition-all duration-500 ease-out flex items-center justify-between gap-3 ${
          scrolled
            ? 'max-w-5xl xl:max-w-6xl px-4 sm:px-6'
            : 'max-w-7xl px-6 sm:px-10'
        }`}
      >
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
            className={`pointer-events-auto h-[50px] rounded-full transition-all duration-500 flex items-center gap-2 cursor-pointer select-none ${
              scrolled
                ? 'px-3.5 sm:px-4 border border-white/60 bg-white/65 backdrop-blur-2xl backdrop-saturate-[180%] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_4px_16px_rgba(0,0,0,0.02)] hover:bg-white/75 hover:border-white/80'
                : 'px-1 bg-transparent border-transparent shadow-none hover:opacity-85'
            }`}
          >
            <img
              src={isDarkMode ? '/brand/logo_icon_white.png' : '/brand/logo_icon.png'}
              alt="MakonSense Icon"
              className="h-[23px] sm:h-[24.5px] w-auto object-contain flex-shrink-0"
            />
            <img
              src={isDarkMode ? '/brand/logo_text_white.png' : '/brand/logo_text_dark.png'}
              alt="MakonSense"
              className="h-[13px] sm:h-[13.5px] w-auto object-contain select-none"
            />
          </motion.div>
        </Magnet>

        {/* ========================================================= */}
        {/* ISLAND 2 (CENTER): DYNAMIC SEGMENTED SWITCH ISLAND        */}
        {/* Apple liquid sliding pill, optical padding, crystal glass  */}
        {/* ========================================================= */}
        <nav
          onMouseLeave={() => {
            setHoveredTab(null);
            setSolutionsOpen(false);
            setRegionsOpen(false);
          }}
          className="pointer-events-auto relative hidden md:flex items-center h-[50px] p-1.5 rounded-full select-none"
        >
          {/* Island 2 Glass Capsule Background (Active only when scrolled) */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-500 pointer-events-none -z-10 ${
              scrolled
                ? 'opacity-100 border border-white/60 bg-white/45 backdrop-blur-2xl backdrop-saturate-[180%] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_4px_16px_rgba(0,0,0,0.02)] hover:border-white/80'
                : 'opacity-0 border-transparent bg-transparent shadow-none'
            }`}
          />
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

            const handleClick = (e: React.MouseEvent) => {
              setActiveTab(tab.id);
              if (tab.id === 'home') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (tab.href && tab.href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(tab.href);
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
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
                {/* Framer Motion Sliding Active Pill (Zero-shadow, pure minimalist flat white tile) */}
                {isSelected && (
                  <motion.div
                    layoutId="dynamic-island-active-pill"
                    transition={{
                      duration: 0.18,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`absolute inset-0 z-0 rounded-full ${
                      isDarkMode ? 'bg-white/20' : 'bg-white'
                    }`}
                  />
                )}

                {/* Framer Motion Hover Ghost Pill (Feather-light 140ms) */}
                {isHovered && !isSelected && (
                  <motion.div
                    layoutId="dynamic-island-hover-pill"
                    transition={{
                      duration: 0.14,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute inset-0 z-0 bg-black/[0.025] dark:bg-white/[0.06] rounded-full"
                  />
                )}

                {tab.href ? (
                  <a
                    href={tab.href}
                    onMouseEnter={handleMouseEnter}
                    onClick={handleClick}
                    className={`relative z-10 flex items-center gap-1.5 px-4 py-2 text-[14px] rounded-full transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? isDarkMode ? 'text-white font-semibold' : 'text-[#0C4137] font-semibold'
                        : isDarkMode ? 'text-neutral-300 hover:text-white font-medium' : 'text-neutral-500 hover:text-neutral-900 font-medium'
                    }`}
                  >
                    {labelContent}
                  </a>
                ) : (
                  <button
                    onMouseEnter={handleMouseEnter}
                    onClick={handleClick}
                    className={`relative z-10 flex items-center gap-1.5 px-4 py-2 text-[14px] rounded-full transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? isDarkMode ? 'text-white font-semibold' : 'text-[#0C4137] font-semibold'
                        : isDarkMode ? 'text-neutral-300 hover:text-white font-medium' : 'text-neutral-500 hover:text-neutral-900 font-medium'
                    }`}
                  >
                    {labelContent}
                  </button>
                )}

              </div>
            );
          })}

          {/* ========================================================= */}
          {/* UNIFIED FULL-WIDTH LIQUID DROPDOWN (Island 2 Extension)    */}
          {/* Matches navbar width, drips downward as one continuous body */}
          {/* ========================================================= */}
          <AnimatePresence mode="wait">
            {solutionsOpen && (
              <motion.div
                key="solutions-dropdown"
                initial={{ opacity: 0, y: -16, scaleY: 0.65, scaleX: 0.98 }}
                animate={{ opacity: 1, y: 0, scaleY: 1, scaleX: 1 }}
                exit={{ opacity: 0, y: -12, scaleY: 0.7, scaleX: 0.98, transition: { duration: 0.14 } }}
                transition={{ type: 'spring', stiffness: 360, damping: 25, mass: 0.75 }}
                onMouseEnter={() => setSolutionsOpen(true)}
                onMouseLeave={() => setSolutionsOpen(false)}
                style={{
                  transformOrigin: 'top center',
                  backdropFilter: 'blur(28px) saturate(190%)',
                  WebkitBackdropFilter: 'blur(28px) saturate(190%)',
                }}
                className="apple-glass-dropdown absolute top-full left-0 right-0 mt-2 w-full rounded-[26px] p-3.5 space-y-2 z-50 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
              >
                <div className="px-2 pt-0.5 pb-1.5 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold border-b border-black/[0.04]">
                  <span>Sohaviy Geomarketing Tahlili</span>
                  <span className="text-[#06D6A0] font-bold">Sun’iy Intellekt</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <a
                    href="#solutions"
                    onClick={() => setSolutionsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[14px] hover:bg-black/[0.035] transition-all duration-200 ease-out group cursor-pointer"
                  >
                    <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                      <Coffee className="w-5 h-5 text-[#0C4137] transition-transform duration-200 ease-out group-hover:scale-105" />
                    </div>
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="text-[13px] font-bold text-[#0C4137] tracking-tight group-hover:translate-x-0.5 transition-transform duration-200 ease-out">
                        HoReCa & Restoranlar
                      </div>
                      <div className="text-[11px] text-neutral-500 leading-snug mt-0.5">
                        Piyoda tranzit va raqobat tahlili
                      </div>
                    </div>
                  </a>

                  <a
                    href="#solutions"
                    onClick={() => setSolutionsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[14px] hover:bg-black/[0.035] transition-all duration-200 ease-out group cursor-pointer"
                  >
                    <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-5 h-5 text-[#0C4137] transition-transform duration-200 ease-out group-hover:scale-105" />
                    </div>
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="text-[13px] font-bold text-[#0C4137] tracking-tight group-hover:translate-x-0.5 transition-transform duration-200 ease-out">
                        Supermarket & Retail
                      </div>
                      <div className="text-[11px] text-neutral-500 leading-snug mt-0.5">
                        Aholi zichligi va xarid quvvati
                      </div>
                    </div>
                  </a>

                  <a
                    href="#solutions"
                    onClick={() => setSolutionsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[14px] hover:bg-black/[0.035] transition-all duration-200 ease-out group cursor-pointer"
                  >
                    <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                      <Pill className="w-5 h-5 text-[#0C4137] transition-transform duration-200 ease-out group-hover:scale-105" />
                    </div>
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="text-[13px] font-bold text-[#0C4137] tracking-tight group-hover:translate-x-0.5 transition-transform duration-200 ease-out">
                        Dorixona & Tibbiyot
                      </div>
                      <div className="text-[11px] text-neutral-500 leading-snug mt-0.5">
                        Monopol radius va bemorlar oqimi
                      </div>
                    </div>
                  </a>

                  <a
                    href="#solutions"
                    onClick={() => setSolutionsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[14px] hover:bg-black/[0.035] transition-all duration-200 ease-out group cursor-pointer"
                  >
                    <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                      <Building className="w-5 h-5 text-[#0C4137] transition-transform duration-200 ease-out group-hover:scale-105" />
                    </div>
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="text-[13px] font-bold text-[#0C4137] tracking-tight group-hover:translate-x-0.5 transition-transform duration-200 ease-out">
                        Tijoriy Ko‘chmas Mulk
                      </div>
                      <div className="text-[11px] text-neutral-500 leading-snug mt-0.5">
                        ROI prognozi va ijara stavkalari
                      </div>
                    </div>
                  </a>
                </div>

                {/* Interactive Bottom CTA Footer */}
                <div
                  onClick={() => {
                    setSolutionsOpen(false);
                    setCurrentView('app');
                  }}
                  className="mt-1 px-3.5 py-2 rounded-[14px] bg-white/40 hover:bg-white/70 backdrop-blur-md border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] flex items-center justify-between group cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-center gap-2 group-hover:translate-x-0.5 transition-transform duration-200 ease-out">
                    <Sparkles className="w-3.5 h-3.5 text-[#0C4137]/80" />
                    <span className="text-xs font-semibold text-[#0C4137]">
                      O‘z biznesingiz bo‘yicha bepul geomarketing tahlilini sinab ko‘ring
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0C4137]/70 group-hover:translate-x-0.5 transition-transform duration-200 ease-out" />
                </div>
              </motion.div>
            )}

            {regionsOpen && (
              <motion.div
                key="regions-dropdown"
                initial={{ opacity: 0, y: -16, scaleY: 0.65, scaleX: 0.98 }}
                animate={{ opacity: 1, y: 0, scaleY: 1, scaleX: 1 }}
                exit={{ opacity: 0, y: -12, scaleY: 0.7, scaleX: 0.98, transition: { duration: 0.14 } }}
                transition={{ type: 'spring', stiffness: 360, damping: 25, mass: 0.75 }}
                onMouseEnter={() => setRegionsOpen(true)}
                onMouseLeave={() => setRegionsOpen(false)}
                style={{
                  transformOrigin: 'top center',
                  backdropFilter: 'blur(28px) saturate(190%)',
                  WebkitBackdropFilter: 'blur(28px) saturate(190%)',
                }}
                className="apple-glass-dropdown absolute top-full left-0 right-0 mt-2 w-full rounded-[26px] p-3.5 space-y-2 z-50 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
              >
                <div className="px-2 pt-0.5 pb-1.5 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold border-b border-black/[0.04]">
                  <span>Butun O‘zbekiston Qamrovi</span>
                  <span className="text-[#0C4137] font-bold">14 Ta Hudud</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <div
                    onClick={() => {
                      setRegionsOpen(false);
                      setCurrentView('app');
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-[14px] hover:bg-black/[0.035] transition-all duration-200 cursor-pointer group"
                  >
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-[#0C4137]/70 transition-transform duration-200 ease-out group-hover:scale-110" />
                    </div>
                    <div className="flex-1 min-w-0 group-hover:translate-x-0.5 transition-transform duration-200 ease-out">
                      <div className="text-xs font-bold text-[#0C4137]">Toshkent shahri</div>
                      <div className="text-[10px] text-neutral-400">Markaziy hab • 52k+ bino</div>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setRegionsOpen(false);
                      setCurrentView('app');
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-[14px] hover:bg-black/[0.035] transition-all duration-200 cursor-pointer group"
                  >
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-[#0C4137]/70 transition-transform duration-200 ease-out group-hover:scale-110" />
                    </div>
                    <div className="flex-1 min-w-0 group-hover:translate-x-0.5 transition-transform duration-200 ease-out">
                      <div className="text-xs font-bold text-[#0C4137]">Samarqand</div>
                      <div className="text-[10px] text-neutral-400">Sayyohlik & Retail • 38k+</div>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setRegionsOpen(false);
                      setCurrentView('app');
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-[14px] hover:bg-black/[0.035] transition-all duration-200 cursor-pointer group"
                  >
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-[#0C4137]/70 transition-transform duration-200 ease-out group-hover:scale-110" />
                    </div>
                    <div className="flex-1 min-w-0 group-hover:translate-x-0.5 transition-transform duration-200 ease-out">
                      <div className="text-xs font-bold text-[#0C4137]">Farg‘ona vodiysi</div>
                      <div className="text-[10px] text-neutral-400">Aholi zichligi • 72k+</div>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setRegionsOpen(false);
                      setCurrentView('app');
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-[14px] hover:bg-black/[0.035] transition-all duration-200 cursor-pointer group"
                  >
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-[#0C4137]/70 transition-transform duration-200 ease-out group-hover:scale-110" />
                    </div>
                    <div className="flex-1 min-w-0 group-hover:translate-x-0.5 transition-transform duration-200 ease-out">
                      <div className="text-xs font-bold text-[#0C4137]">Buxoro & Navoiy</div>
                      <div className="text-[10px] text-neutral-400">Sanoat & Biznes • 31k+</div>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setRegionsOpen(false);
                      setCurrentView('app');
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-[14px] hover:bg-black/[0.035] transition-all duration-200 cursor-pointer group"
                  >
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-[#0C4137]/70 transition-transform duration-200 ease-out group-hover:scale-110" />
                    </div>
                    <div className="flex-1 min-w-0 group-hover:translate-x-0.5 transition-transform duration-200 ease-out">
                      <div className="text-xs font-bold text-[#0C4137]">Qashqadaryo & Surxondaryo</div>
                      <div className="text-[10px] text-neutral-400">Janubiy tranzit • 44k+</div>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setRegionsOpen(false);
                      setCurrentView('app');
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-[14px] hover:bg-black/[0.035] transition-all duration-200 cursor-pointer group"
                  >
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-[#0C4137]/70 transition-transform duration-200 ease-out group-hover:scale-110" />
                    </div>
                    <div className="flex-1 min-w-0 group-hover:translate-x-0.5 transition-transform duration-200 ease-out">
                      <div className="text-xs font-bold text-[#0C4137]">Qoraqalpog‘iston & Xorazm</div>
                      <div className="text-[10px] text-neutral-400">G‘arbiy zonalar • 29k+</div>
                    </div>
                  </div>
                </div>

                <div className="pt-1.5 border-t border-black/[0.04] text-[11px] text-neutral-500 px-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium text-neutral-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0C4137]/40" />
                    208 ta tuman fazoviy monitoringda
                  </span>
                  <span className="font-mono text-[10px] text-[#0C4137] font-bold bg-white/60 backdrop-blur-sm border border-white/70 px-2 py-0.5 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                    524,476 ta bino
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* ========================================================= */}
        {/* ISLAND 3 (RIGHT): ACTION & CONTROL DYNAMIC ISLAND          */}
        {/* Apple glass mode toggle, Kirish, Magnet CTA Boshlash      */}
        {/* ========================================================= */}
        <motion.div
          whileHover={{ y: -0.5 }}
          transition={{ type: 'spring', stiffness: 450, damping: 26 }}
          className={`pointer-events-auto hidden sm:flex items-center h-[50px] rounded-full transition-all duration-500 ${
            scrolled
              ? 'pl-2 sm:pl-2.5 pr-3.5 sm:pr-4 border border-white/60 bg-white/45 backdrop-blur-2xl backdrop-saturate-[180%] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_4px_16px_rgba(0,0,0,0.02)] hover:border-white/80 gap-1.5 sm:gap-2'
              : 'pl-1 pr-1 bg-transparent border-transparent shadow-none gap-2 sm:gap-2.5'
          }`}
        >
          {/* Apple-style minimalist glass mode toggle */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-[34px] h-[34px] rounded-full bg-white/40 hover:bg-white/70 backdrop-blur-md border border-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] flex items-center justify-center text-neutral-600 hover:text-black transition-all cursor-pointer select-none"
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
            className="text-neutral-600 hover:text-[#0C4137] font-medium text-[13.5px] px-2.5 sm:px-3 py-1.5 rounded-full hover:bg-white/40 transition-all cursor-pointer"
          >
            Kirish
          </button>

          {/* Single Dominant CTA Button with React Bits Magnet */}
          <Magnet magnetStrength={4}>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setCurrentView('app')}
              className="group inline-flex items-center justify-center gap-1.5 h-[36px] px-4 rounded-full bg-[#0C4137] hover:bg-[#072822] text-white text-[13.5px] font-semibold cursor-pointer whitespace-nowrap transition-all shadow-[0_2px_8px_rgba(12,65,55,0.18),inset_0_1px_0_rgba(255,255,255,0.2)]"
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
            className={`rounded-full transition-all duration-500 text-neutral-700 flex items-center justify-center cursor-pointer ${
              scrolled
                ? 'h-[50px] w-[50px] border border-white/60 bg-white/45 backdrop-blur-2xl backdrop-saturate-[180%] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_4px_16px_rgba(0,0,0,0.02)] hover:bg-white/65 hover:border-white/80'
                : 'h-[44px] w-[44px] bg-transparent border-transparent shadow-none hover:bg-black/[0.04]'
            }`}
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
            style={{
              backdropFilter: 'blur(28px) saturate(190%)',
              WebkitBackdropFilter: 'blur(28px) saturate(190%)',
            }}
            className="apple-glass-dropdown pointer-events-auto md:hidden mx-4 mt-2 rounded-[24px] p-4 space-y-2"
          >
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2 text-xs font-semibold text-[#0C4137] rounded-xl hover:bg-white/50 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-all"
            >
              Shahar Radari
            </a>
            <a
              href="#solutions"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2 text-xs font-semibold text-[#0C4137] rounded-xl hover:bg-white/50 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-all"
            >
              Yechimlar (HoReCa, Retail, Dorixona)
            </a>
            <a
              href="#compare"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2 text-xs font-semibold text-[#0C4137] rounded-xl hover:bg-white/50 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-all"
            >
              A/B Taqqoslash
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2 text-xs font-semibold text-[#0C4137] rounded-xl hover:bg-white/50 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-all"
            >
              Moliya & ROI
            </a>
            <div className="pt-2 border-t border-black/[0.04] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentView('app');
                }}
                className="w-full py-2.5 rounded-full bg-[#0C4137] hover:bg-[#072822] text-white font-semibold text-xs text-center transition-all shadow-[0_2px_8px_rgba(12,65,55,0.18)]"
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
