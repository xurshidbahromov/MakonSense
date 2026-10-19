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
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );

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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', nextDark);
      try {
        window.localStorage.setItem('makon_theme', nextDark ? 'dark' : 'light');
      } catch {
        // ignore
      }
    }
    if (basemapMode !== 'satellite') {
      setBasemapMode(nextDark ? 'dark' : 'light');
    }
  };

  return (
    <header className="h-14 sm:h-16 border-b border-black/[0.07] dark:border-white/[0.08] bg-[#FDFDFD]/95 dark:bg-[#111111]/95 backdrop-blur-2xl px-3 sm:px-5 flex items-center justify-between gap-2 z-30 relative select-none transition-colors">
      {/* Left: Brand Identity & Back to Landing */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={() => setCurrentView('landing')}
          title="Bosh sahifaga qaytish"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] border border-black/[0.06] dark:border-white/[0.08] text-[#111111] dark:text-[#FDFDFD] text-xs font-medium transition-all duration-150 active:scale-[0.97] group cursor-pointer"
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
            alt="MakonSense Logo"
            className="h-7 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm sm:text-[15px] tracking-tight text-[#111111] dark:text-[#FDFDFD]">
              MakonSense
            </span>
            <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-[#0E9F6E]/10 text-[#0E9F6E] border border-[#0E9F6E]/25 font-mono font-bold">
              GIS 2.4
            </span>
          </div>
        </div>
      </div>

      {/* Center: Search Bar with Autocomplete & Coordinate Parser */}
      <div className="flex-1 max-w-md mx-2 hidden sm:block">
        <SearchBar />
      </div>

      {/* Right: Workspace Tools, Saved Locations, Theme Toggle, Audit PDF & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Active Location & Coordinate Pill */}
        <div
          title={`${selectedCoords.latitude.toFixed(4)}° N, ${selectedCoords.longitude.toFixed(4)}° E`}
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.07] text-[11px] font-mono text-[#525854] dark:text-[#9CA3AF]"
        >
          <MapPin className="w-3.5 h-3.5 text-[#0E9F6E] shrink-0" />
          <span className="max-w-[150px] truncate font-sans font-medium text-[#111111] dark:text-[#E5E7EB]">
            {inspection.context.location_label || 'Toshkent'}
          </span>
          <span className="text-[#8A908C]">·</span>
          <span>
            {selectedCoords.latitude.toFixed(3)}, {selectedCoords.longitude.toFixed(3)}
          </span>
        </div>

        {/* AI Top Hotspots Quick Button */}
        <button
          onClick={() => setActiveSidebarTab('hotspots')}
          title="AI Optimal Joylashuv Skayneri"
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
            activeSidebarTab === 'hotspots'
              ? 'bg-[#0E9F6E]/15 text-[#0E9F6E] border-[#0E9F6E]/40'
              : 'bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.09] text-[#111111] dark:text-[#FDFDFD] border-black/[0.06] dark:border-white/[0.08]'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-[#0E9F6E]" />
          <span className="hidden lg:inline">Top Nuqtalar</span>
        </button>

        {/* Saved Locations Dropdown */}
        <div ref={savedRef} className="relative">
          <button
            onClick={() => setSavedMenuOpen(!savedMenuOpen)}
            title="Saqlangan manzillar"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.09] border border-black/[0.06] dark:border-white/[0.08] text-[#111111] dark:text-[#FDFDFD] text-xs font-medium transition-all cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#0E9F6E]" />
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#0E9F6E]/15 text-[#0E9F6E]">
              {savedLocations.length}
            </span>
          </button>

          {savedMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#161618] shadow-2xl border border-black/[0.08] dark:border-white/[0.1] overflow-hidden z-50">
              <div className="px-3.5 py-2.5 border-b border-black/[0.06] dark:border-white/[0.07] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#111111] dark:text-[#FDFDFD]">
                    Saqlangan Manzillar
                  </div>
                  <div className="text-[10px] text-[#7A807C] dark:text-[#9CA3AF]">
                    Tezkor qaytish va A/B taqqoslash
                  </div>
                </div>
                <button
                  onClick={() => saveCurrentLocation()}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0E9F6E] hover:bg-[#0B875D] text-white text-[10px] font-semibold transition-colors cursor-pointer"
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
                      className="px-3.5 py-2.5 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] flex items-center justify-between gap-2 cursor-pointer group transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-[#111111] dark:text-[#FDFDFD] truncate group-hover:text-[#0E9F6E] transition-colors">
                            {loc.name}
                          </span>
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-black/[0.05] dark:bg-white/[0.07] text-[#6E7470] dark:text-[#9CA3AF]">
                            {loc.category}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#7A807C] dark:text-[#9CA3AF] truncate mt-0.5">
                          {loc.district} · [{loc.coordinates.latitude.toFixed(3)}, {loc.coordinates.longitude.toFixed(3)}]
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setCompareCoords(loc.coordinates);
                            setActiveSidebarTab('compare');
                            setSavedMenuOpen(false);
                          }}
                          title="B nuqta sifatida solishtirish"
                          className="p-1 rounded hover:bg-indigo-500/15 text-[#7A807C] hover:text-indigo-500 transition-colors cursor-pointer"
                        >
                          <GitCompare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSavedLocation(loc.id);
                          }}
                          title="O‘chirish"
                          className="p-1 rounded hover:bg-rose-500/15 text-[#7A807C] hover:text-rose-500 transition-colors cursor-pointer"
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

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Yorug' rejim" : "Qorong'u rejim"}
          className="p-2 rounded-full bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.07] dark:hover:bg-white/[0.1] border border-black/[0.06] dark:border-white/[0.08] text-[#111111] dark:text-[#FDFDFD] transition-all cursor-pointer"
        >
          {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-[#525854]" />}
        </button>

        {/* Audit PDF Export Button */}
        <button
          onClick={() => generateAuditReport()}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-[#111111] dark:bg-[#FDFDFD] hover:bg-[#27272A] dark:hover:bg-neutral-200 text-white dark:text-[#111111] font-semibold text-xs transition-all duration-150 shadow-sm active:scale-[0.97] cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-[#0E9F6E]" />
          <span className="hidden md:inline">PDF Audit</span>
          <Sparkles className="w-3 h-3 text-[#0E9F6E] hidden sm:inline" />
        </button>

        {/* User Profile / Auth State Pill */}
        {user ? (
          <div ref={userRef} className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] border border-black/[0.06] dark:border-white/[0.08] transition-all cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#0E9F6E] text-white flex items-center justify-center font-bold text-[10px]">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-[#111111] dark:text-[#FDFDFD] max-w-[85px] truncate hidden lg:inline">
                {user.name}
              </span>
              <ChevronDown size={12} className="text-[#7A807C]" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-[#161618] shadow-2xl border border-black/[0.08] dark:border-white/[0.1] p-2 z-50">
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
                    onClick={() => {
                      setUserMenuOpen(false);
                      setAuthMode('register');
                      setCurrentView('auth');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#0E9F6E] font-semibold hover:bg-[#0E9F6E]/10 rounded-xl transition-all cursor-pointer"
                  >
                    <User size={14} />
                    <span>Ro‘yxatdan o‘tish</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    logout();
                    setUserMenuOpen(false);
                    setCurrentView('landing');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 font-semibold hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Chiqish</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => {
              setAuthMode('login');
              setCurrentView('auth');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] border border-black/[0.06] dark:border-white/[0.08] text-[#111111] dark:text-[#FDFDFD] text-xs font-semibold transition-all cursor-pointer"
          >
            <User size={13} className="text-[#0E9F6E]" />
            <span>Kirish</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
