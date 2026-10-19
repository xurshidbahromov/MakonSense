import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  MapPin,
  ArrowLeft,
  User,
  LogOut,
  ChevronDown,
  Bookmark,
  Sun,
  Moon,
  Trash2,
  GitCompare,
  Plus,
  Compass,
} from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { SearchBar } from '../ui/SearchBar';
import { initThemeFromStorage, toggleThemeWithoutSmear } from '../../utils/themeUtils';

export const Header: React.FC = () => {
  const {
    selectedCoords,
    inspection,
    generateAuditReport,
    setCurrentView,
    savedLocations,
    saveCurrentLocation,
    removeSavedLocation,
    setSelectedCoords,
    setCategory,
    setCompareCoords,
    activeSidebarTab,
    setActiveSidebarTab,
    basemapMode,
    setBasemapMode,
  } = useAnalyticsStore();
  const { user, isGuest, logout, setAuthMode } = useAuthStore();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [savedMenuOpen, setSavedMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => initThemeFromStorage());

  const savedRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (savedRef.current && !savedRef.current.contains(e.target as Node)) {
        setSavedMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSavedMenuOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleTheme = () => {
    const nextDark = toggleThemeWithoutSmear(!isDark);
    setIsDark(nextDark);
    if (basemapMode !== 'satellite') {
      setBasemapMode(nextDark ? 'dark' : 'light');
    }
  };

  return (
    <header className="fixed top-3 sm:top-3.5 left-3 right-3 sm:left-4 sm:right-4 z-30 pointer-events-none">
      <div className="mx-auto flex items-center justify-between gap-2.5 sm:gap-3">
        {/* ========================================================= */}
        {/* ISLAND 1 (LEFT): BRAND & BACK DYNAMIC ISLAND              */}
        {/* ========================================================= */}
        <div className="pointer-events-auto h-[50px] pl-2 pr-3.5 sm:px-3.5 rounded-full spatial-glass-island flex items-center gap-2 sm:gap-2.5 shrink-0 select-none">
          <button
            type="button"
            onClick={() => setCurrentView('landing')}
            title="Bosh sahifaga qaytish"
            aria-label="Bosh sahifaga qaytish"
            className="press-scale flex items-center gap-1.5 h-[36px] px-2.5 sm:px-3 rounded-full bg-black/[0.04] dark:bg-white/[0.07] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] border border-black/[0.06] dark:border-white/[0.09] text-[#111111] dark:text-[#FDFDFD] text-xs font-medium group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#0E9F6E] group-hover:-translate-x-0.5 transition-transform duration-150" />
            <span className="hidden md:inline">Bosh sahifa</span>
          </button>

          <div
            className="flex items-center gap-2 cursor-pointer group select-none"
            onClick={() => setCurrentView('landing')}
          >
            <img
              src="/brand/logo_icon.png"
              alt="MakonSense"
              className="h-[22px] sm:h-[24px] w-auto object-contain transition-transform duration-150 group-hover:scale-105"
            />
            <div className="flex items-center gap-1.5">
              <img
                src={isDark ? '/brand/logo_text_white.png' : '/brand/logo_text_dark.png'}
                alt="MakonSense"
                className="h-[12.5px] sm:h-[13.5px] w-auto object-contain hidden xs:block select-none"
              />
              <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-[#0E9F6E]/12 text-[#0E9F6E] border border-[#0E9F6E]/25 font-mono font-bold">
                GIS 2.4
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ISLAND 2 (CENTER): SEARCH & LIVE COORDINATE DYNAMIC ISLAND */}
        {/* ========================================================= */}
        <div className="pointer-events-auto hidden sm:flex items-center h-[50px] px-2 rounded-full spatial-glass-island flex-1 max-w-xl lg:max-w-2xl gap-2">
          <div className="flex-1 min-w-0">
            <SearchBar />
          </div>

          {/* Active Location & Coordinate Pill (Selectable text for copying coordinates) */}
          <div
            title={`${selectedCoords.latitude.toFixed(4)}° N, ${selectedCoords.longitude.toFixed(4)}° E`}
            className="hidden xl:flex items-center gap-1.5 h-[36px] px-3 rounded-full bg-black/[0.035] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] text-[11px] font-mono tabular-nums text-[#525854] dark:text-[#9CA3AF] shrink-0 select-text"
          >
            <MapPin className="w-3.5 h-3.5 text-[#0E9F6E] shrink-0" aria-hidden="true" />
            <span className="max-w-[135px] truncate font-sans font-semibold text-[#111111] dark:text-[#E5E7EB]">
              {inspection.context.location_label || 'Toshkent'}
            </span>
            <span className="text-[#8A908C]" aria-hidden="true">·</span>
            <span>
              {selectedCoords.latitude.toFixed(3)}, {selectedCoords.longitude.toFixed(3)}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ISLAND 3 (RIGHT): ACTIONS, SAVED, THEME, PDF & PROFILE    */}
        {/* ========================================================= */}
        <div className="pointer-events-auto h-[50px] px-2 sm:px-2.5 rounded-full spatial-glass-island flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* AI Top Hotspots Quick Button */}
          <button
            type="button"
            onClick={() => setActiveSidebarTab('hotspots')}
            title="AI Optimal Joylashuv Skayneri"
            aria-label="Eng yaxshi nuqtalar (AI Top Hotspots)"
            className={`press-scale flex items-center gap-1.5 h-[36px] px-2.5 sm:px-3 rounded-full text-xs font-semibold border cursor-pointer select-none ${
              activeSidebarTab === 'hotspots'
                ? 'bg-[#0E9F6E]/15 text-[#0E9F6E] border-[#0E9F6E]/40'
                : 'bg-black/[0.035] dark:bg-white/[0.06] hover:bg-black/[0.07] dark:hover:bg-white/[0.11] text-[#111111] dark:text-[#FDFDFD] border-black/[0.06] dark:border-white/[0.09]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#0E9F6E]" />
            <span className="hidden lg:inline">Top Nuqtalar</span>
          </button>

          {/* Saved Locations Dropdown */}
          <div ref={savedRef} className="relative select-none">
            <button
              type="button"
              onClick={() => setSavedMenuOpen(!savedMenuOpen)}
              title="Saqlangan manzillar"
              aria-label="Saqlangan manzillar ro'yxati"
              aria-expanded={savedMenuOpen}
              className="press-scale flex items-center gap-1.5 h-[36px] px-2.5 rounded-full bg-black/[0.035] dark:bg-white/[0.06] hover:bg-black/[0.07] dark:hover:bg-white/[0.11] border border-black/[0.06] dark:border-white/[0.09] text-[#111111] dark:text-[#FDFDFD] text-xs font-medium cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#0E9F6E]" />
              <span className="font-mono tabular-nums text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#0E9F6E]/15 text-[#0E9F6E]">
                {savedLocations.length}
              </span>
            </button>

            {savedMenuOpen && (
              <div className="popover-origin-tr apple-glass-dropdown absolute right-0 mt-2.5 w-80 rounded-[24px] overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#111111] dark:text-[#FDFDFD]">
                      Saqlangan Manzillar
                    </div>
                    <div className="text-[10px] text-[#7A807C] dark:text-[#9CA3AF]">
                      Tezkor qaytish va A/B taqqoslash
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => saveCurrentLocation()}
                    className="press-scale flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0E9F6E] hover:bg-[#0B875D] text-white text-[10px] font-semibold cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Joriyni saqlash</span>
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                  {savedLocations.length === 0 ? (
                    <div className="px-4 py-6 text-center text-xs text-[#7A807C]">
                      Hozircha saqlangan manzillar yo‘q.
                    </div>
                  ) : (
                    savedLocations.map((loc) => (
                      <div
                        key={loc.id}
                        onClick={() => {
                          setCategory(loc.category);
                          setSelectedCoords(loc.coordinates);
                          setSavedMenuOpen(false);
                        }}
                        className="px-4 py-2.5 hover:bg-black/[0.035] dark:hover:bg-white/[0.05] flex items-center justify-between gap-2 cursor-pointer group transition-colors duration-150"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-[#111111] dark:text-[#FDFDFD] truncate group-hover:text-[#0E9F6E] transition-colors duration-150">
                              {loc.name}
                            </span>
                            <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-black/[0.05] dark:bg-white/[0.07] text-[#6E7470] dark:text-[#9CA3AF]">
                              {loc.category}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#7A807C] dark:text-[#9CA3AF] truncate mt-0.5 tabular-nums">
                            {loc.district} · [{loc.coordinates.latitude.toFixed(3)}, {loc.coordinates.longitude.toFixed(3)}]
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`text-xs font-mono tabular-nums font-bold px-1.5 py-0.5 rounded ${
                              loc.score >= 80
                                ? 'bg-[#0E9F6E]/15 text-[#0E9F6E]'
                                : loc.score >= 55
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {loc.score}
                          </span>
                          <button
                            type="button"
                            aria-label={`${loc.name} manzilini B nuqta sifatida solishtirish`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCompareCoords(loc.coordinates);
                              setActiveSidebarTab('compare');
                              setSavedMenuOpen(false);
                            }}
                            title="B nuqta sifatida solishtirish"
                            className="press-scale p-1 rounded hover:bg-indigo-500/15 text-[#7A807C] hover:text-indigo-500 cursor-pointer"
                          >
                            <GitCompare className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label={`${loc.name} manzilini o'chirish`}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSavedLocation(loc.id);
                            }}
                            title="O‘chirish"
                            className="press-scale p-1 rounded hover:bg-rose-500/15 text-[#7A807C] hover:text-rose-500 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button (Zero-smear transition suppression) */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? "Yorug' rejim" : "Qorong'u rejim"}
            aria-label={isDark ? "Yorug' rejimga o'tish" : "Qorong'u rejimga o'tish"}
            className="press-scale w-[36px] h-[36px] rounded-full bg-black/[0.035] dark:bg-white/[0.06] hover:bg-black/[0.07] dark:hover:bg-white/[0.12] border border-black/[0.06] dark:border-white/[0.09] flex items-center justify-center text-[#111111] dark:text-[#FDFDFD] cursor-pointer select-none"
          >
            {isDark ? <Moon className="w-3.5 h-3.5 text-[#0E9F6E]" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
          </button>

          {/* Audit PDF Export Button */}
          <button
            type="button"
            onClick={() => generateAuditReport()}
            className="press-scale flex items-center gap-1.5 h-[36px] px-3 sm:px-4 rounded-full bg-[#111111] dark:bg-[#FDFDFD] hover:bg-[#27272A] dark:hover:bg-neutral-200 text-white dark:text-[#111111] font-semibold text-xs shadow-sm cursor-pointer select-none"
          >
            <FileText className="w-3.5 h-3.5 text-[#0E9F6E]" />
            <span className="hidden md:inline">PDF Audit</span>
            <Sparkles className="w-3 h-3 text-[#0E9F6E] hidden sm:inline" />
          </button>

          {/* User Profile / Auth State Pill */}
          {user ? (
            <div ref={userRef} className="relative select-none">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
                aria-label="Foydalanuvchi profili menyusi"
                className="press-scale flex items-center gap-1.5 h-[36px] pl-1.5 pr-2.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.11] border border-black/[0.06] dark:border-white/[0.09] cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#0E9F6E] text-white flex items-center justify-center font-bold text-[10px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-[#111111] dark:text-[#FDFDFD] max-w-[80px] truncate hidden lg:inline">
                  {user.name}
                </span>
                <ChevronDown size={12} className="text-[#7A807C]" />
              </button>

              {userMenuOpen && (
                <div className="popover-origin-tr apple-glass-dropdown absolute right-0 mt-2.5 w-52 rounded-[22px] p-2 z-50">
                  <div className="px-3 py-2 border-b border-black/[0.06] dark:border-white/[0.07] mb-1">
                    <div className="text-xs font-bold text-[#111111] dark:text-[#FDFDFD] truncate">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-[#7A807C] dark:text-[#9CA3AF] truncate">
                      {user.emailOrPhone}
                    </div>
                  </div>

                  {isGuest && (
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setAuthMode('register');
                        setCurrentView('auth');
                      }}
                      className="press-scale w-full flex items-center gap-2 px-3 py-2 text-xs text-[#0E9F6E] font-semibold hover:bg-[#0E9F6E]/10 rounded-xl cursor-pointer"
                    >
                      <User size={14} />
                      <span>Ro‘yxatdan o‘tish</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                      setCurrentView('landing');
                    }}
                    className="press-scale w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 font-semibold hover:bg-rose-500/10 rounded-xl cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Chiqish</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setCurrentView('auth');
              }}
              className="press-scale flex items-center gap-1.5 h-[36px] px-3 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.11] border border-black/[0.06] dark:border-white/[0.09] text-[#111111] dark:text-[#FDFDFD] text-xs font-semibold cursor-pointer select-none"
            >
              <User size={13} className="text-[#0E9F6E]" />
              <span>Kirish</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Floating Search Dynamic Island (visible on small screens) */}
      <div className="sm:hidden mt-2 pointer-events-auto spatial-glass-island rounded-full p-1">
        <SearchBar />
      </div>
    </header>
  );
};

export default Header;
