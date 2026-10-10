import React, { useState } from 'react';
import { FileText, Sparkles, MapPin, ArrowLeft, User, LogOut, ChevronDown } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { SearchBar } from '../ui/SearchBar';

export const Header: React.FC = () => {
  const { selectedCoords, generateAuditReport, setCurrentView } = useAnalyticsStore();
  const { user, isGuest, logout, setAuthMode } = useAuthStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="h-16 border-b border-[#0C4137]/[0.08] bg-white/90 backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between z-30 relative select-none">
      {/* Brand Identity & Back to Landing */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentView('landing')}
          title="Bosh sahifaga qaytish"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200/80 border border-[#0C4137]/[0.08] text-[#0C4137] text-xs font-semibold transition-all duration-150 ease-out active:scale-[0.96] group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#06D6A0] group-hover:-translate-x-0.5 transition-transform duration-150" />
          <span className="hidden sm:inline">Bosh sahifa</span>
        </button>

        <div
          className="flex items-center gap-2.5 cursor-pointer group select-none"
          onClick={() => setCurrentView('landing')}
        >
          <img
            src="/brand/logo_icon.png"
            alt="MakonSense Logo"
            className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-[0_2px_8px_rgba(6,214,160,0.3)]"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base tracking-tight text-[#0C4137]">MakonSense</span>
              <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-[#E6FBF6] text-[#0C4137] border border-[#06D6A0]/30 font-mono font-bold">
                PRO
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Central Search Bar with Autocomplete */}
      <div className="flex-1 max-w-sm sm:max-w-md mx-3 hidden sm:block">
        <SearchBar />
      </div>

      {/* Action Buttons, Coords & User Profile */}
      <div className="flex items-center gap-2.5">
        {/* Active Coordinate Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F8FAF9] border border-[#0C4137]/[0.08] text-xs font-mono text-neutral-600">
          <MapPin className="w-3.5 h-3.5 text-[#06D6A0]" />
          <span>
            {selectedCoords.latitude.toFixed(4)}° N, {selectedCoords.longitude.toFixed(4)}° E
          </span>
        </div>

        {/* Audit PDF Export Button */}
        <button
          onClick={() => generateAuditReport()}
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#0C4137] hover:bg-[#072822] text-white font-semibold text-xs transition-all duration-150 ease-out shadow-sm active:scale-[0.96] cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-[#06D6A0]" />
          <span className="hidden sm:inline">Avtomatik PDF Audit</span>
          <span className="sm:hidden">Audit</span>
          <Sparkles className="w-3 h-3 text-[#06D6A0]" />
        </button>

        {/* User Profile / Auth State Pill */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200/80 border border-[#0C4137]/[0.08] transition-all cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#0C4137] text-white flex items-center justify-center font-bold text-[10px]">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-[#0C4137] max-w-[90px] truncate hidden md:inline">
                {user.name}
              </span>
              <ChevronDown size={12} className="text-neutral-500" />
            </button>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl border border-neutral-200 p-2 z-50">
                <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                  <div className="text-xs font-bold text-neutral-900 truncate">{user.name}</div>
                  <div className="text-[11px] text-neutral-500 truncate">{user.emailOrPhone}</div>
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
                    <span>Ro'yxatdan o'tish</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    logout();
                    setUserMenuOpen(false);
                    setCurrentView('landing');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-all cursor-pointer"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200/80 border border-[#0C4137]/[0.08] text-[#0C4137] text-xs font-semibold transition-all cursor-pointer"
          >
            <User size={13} className="text-[#06D6A0]" />
            <span>Kirish</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
