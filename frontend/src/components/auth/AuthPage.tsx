import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Sun,
  Moon,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { AuthSphereVisual } from './AuthSphereVisual';

export const AuthPage: React.FC = () => {
  const { setCurrentView } = useAnalyticsStore();
  const { authMode, setAuthMode, login, register, loginWithSocial, continueAsGuest } = useAuthStore();

  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('makonsense_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('makonsense_theme', 'light');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (authMode === 'register') {
        const res = await register(name, emailOrPhone, password);
        if (!res.success) {
          setError(res.error || "Ro'yxatdan o'tishda xatolik yuz berdi");
          setLoading(false);
          return;
        }
      } else {
        const res = await login(emailOrPhone, password);
        if (!res.success) {
          setError(res.error || 'Kirishda xatolik yuz berdi');
          setLoading(false);
          return;
        }
      }

      setCurrentView('app');
    } catch {
      setError('Kutilmagan xatolik yuz berdi, qaytadan urinib ko‘ring');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'telegram') => {
    setLoading(true);
    setError(null);
    try {
      await loginWithSocial(provider);
      setCurrentView('app');
    } catch {
      setError('Ijtimoiy tarmoq orqali kirishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    setCurrentView('app');
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#FDFDFD] dark:bg-[#111111] text-[#111111] dark:text-[#FDFDFD] font-sans selection:bg-[#0E9F6E]/20">
      {/* ========================================================= */}
      {/* LEFT COLUMN: SWISS ARTISTIC BRAND VISUAL (ZERO SCROLL)    */}
      {/* ========================================================= */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[45%] h-screen overflow-hidden relative flex-col justify-between p-8 xl:p-12 bg-[#080E0B] text-white border-r border-white/[0.08] select-none">
        {/* Soft Ambient Geometric Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[420px] h-[420px] rounded-full bg-[#0E9F6E]/12 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[420px] h-[420px] rounded-full bg-[#0E9F6E]/10 blur-[120px] pointer-events-none" />

        {/* Subtle Spatial Coordinate Grid Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Top: Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <img
              src="/brand/logo_icon.png"
              alt="MakonSense Icon"
              className="h-8 w-auto object-contain drop-shadow-[0_2px_12px_rgba(14,159,110,0.45)] transition-transform duration-200 group-hover:scale-105"
            />
            <span className="text-xl font-bold tracking-tight text-white">MakonSense</span>
            <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0E9F6E]/20 text-[#0E9F6E] border border-[#0E9F6E]/30 font-semibold">
              Spatial AI
            </span>
          </div>

          <button
            onClick={() => setCurrentView('landing')}
            className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] transition-all duration-200 cursor-pointer group"
          >
            <ArrowLeft size={13} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>Bosh sahifa</span>
          </button>
        </div>

        {/* Center: Hypnotic Minimal 3D Geodesic Sphere & Serene Editorial Copy */}
        <div className="relative z-10 my-auto flex flex-col items-center text-center px-4 max-w-sm mx-auto">
          {/* Calm, Floating 3D Geodesic Sphere */}
          <div className="w-[200px] h-[200px] xl:w-[240px] xl:h-[240px] relative mb-5">
            <AuthSphereVisual />
          </div>

          <h1 className="text-2xl xl:text-3xl font-bold tracking-[-0.03em] leading-[1.2] text-white">
            Joylashuv qarorlarida <br />
            <span className="text-[#0E9F6E]">yangi standart.</span>
          </h1>

          <p className="mt-2.5 text-xs xl:text-sm text-neutral-400 max-w-xs leading-relaxed">
            O'zbekiston bo'ylab 524,000+ bino, piyodalar tranziti va raqobatchilar tahlili bir platformada.
          </p>

          {/* Minimal Metric Ticker Pill */}
          <div className="mt-5 inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-neutral-300">
            <span>524k+ bino</span>
            <span className="w-1 h-1 rounded-full bg-[#0E9F6E]" />
            <span>14 hudud</span>
            <span className="w-1 h-1 rounded-full bg-[#0E9F6E]" />
            <span className="text-[#0E9F6E] font-semibold">94.2% aniqlik</span>
          </div>
        </div>

        {/* Bottom: Quiet Status */}
        <div className="relative z-10 flex items-center justify-between text-xs text-neutral-500 pt-3 border-t border-white/[0.06]">
          <span className="font-mono text-[11px]">Toshkent · Samarqand · Farg'ona · Buxoro</span>
          <div className="flex items-center gap-1.5 text-[11px] text-[#0E9F6E]">
            <CheckCircle2 size={13} />
            <span>Rasmiy tahlil</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: REFINED CRISP FORM (ZERO SCROLL ON DESKTOP)  */}
      {/* ========================================================= */}
      <div className="flex-1 h-screen overflow-y-auto lg:overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col justify-between p-6 sm:p-10 lg:py-7 lg:px-12 xl:py-10 xl:px-14 max-w-lg mx-auto w-full">
        {/* Top Controls */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div
            onClick={() => setCurrentView('landing')}
            className="flex lg:hidden items-center gap-2 cursor-pointer select-none"
          >
            <img src="/brand/logo_icon.png" alt="MakonSense Icon" className="h-7 w-auto object-contain" />
            <span className="font-bold text-base tracking-tight text-[#111111] dark:text-white">MakonSense</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={toggleTheme}
              className="w-8.5 h-8.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.08] dark:hover:bg-white/[0.14] border border-black/[0.06] dark:border-white/[0.1] flex items-center justify-center text-neutral-600 dark:text-neutral-300 transition-all cursor-pointer"
              title="Mavzu rejimi"
            >
              {isDark ? <Moon size={14} className="text-[#0E9F6E]" /> : <Sun size={14} className="text-amber-500" />}
            </button>

            <button
              onClick={() => setCurrentView('landing')}
              className="lg:hidden p-2 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.08] text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-all cursor-pointer"
              title="Bosh sahifa"
            >
              <ArrowLeft size={17} />
            </button>
          </div>
        </div>

        {/* Center: The Form */}
        <div className="my-auto py-2 flex-shrink-0">
          {/* Header */}
          <div className="mb-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0E9F6E] font-semibold">
              {authMode === 'login' ? 'TIZIMGA KIRISH' : "RO'YXATDAN O'TISH"}
            </span>
            <h2 className="mt-1 text-2xl sm:text-[26px] font-bold tracking-tight text-[#111111] dark:text-[#FDFDFD]">
              {authMode === 'login' ? 'Xush kelibsiz' : 'Yangi hisob yarating'}
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              {authMode === 'login'
                ? "Lokatsiyalaringiz va tahlillarni ko'rish uchun kiring."
                : "Bir zumda O'zbekiston fazoviy tahlil platformasiga kiring."}
            </p>
          </div>

          {/* Segmented Switcher with Fluid Spring Pill */}
          <div className="mb-4 p-1 rounded-2xl bg-neutral-100 dark:bg-white/[0.05] border border-black/[0.04] dark:border-white/[0.08] grid grid-cols-2 gap-1 relative">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setError(null);
              }}
              className={`relative z-10 py-2 text-xs font-semibold rounded-xl transition-colors duration-200 cursor-pointer ${
                authMode === 'login'
                  ? 'text-[#111111] dark:text-white'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              {authMode === 'login' && (
                <motion.div
                  layoutId="active-auth-pill"
                  className="absolute inset-0 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-xs"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">Kirish</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setError(null);
              }}
              className={`relative z-10 py-2 text-xs font-semibold rounded-xl transition-colors duration-200 cursor-pointer ${
                authMode === 'register'
                  ? 'text-[#111111] dark:text-white'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              {authMode === 'register' && (
                <motion.div
                  layoutId="active-auth-pill"
                  className="absolute inset-0 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-xs"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">Ro'yxatdan o'tish</span>
            </button>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-2.5 mb-3.5">
            <button
              type="button"
              onClick={() => handleSocialAuth('google')}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-white/[0.03] hover:bg-neutral-50 dark:hover:bg-white/[0.06] text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialAuth('telegram')}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-white/[0.03] hover:bg-neutral-50 dark:hover:bg-white/[0.06] text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <svg className="w-4 h-4 fill-[#229ED9]" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
              </svg>
              <span>Telegram</span>
            </button>
          </div>

          {/* Thin Divider */}
          <div className="relative my-3 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/[0.06] dark:border-white/[0.08]" />
            </div>
            <span className="relative bg-[#FDFDFD] dark:bg-[#111111] px-2.5 text-[10px] font-mono uppercase text-neutral-400">
              yoki
            </span>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2"
            >
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Name (Register only) */}
            <AnimatePresence>
              {authMode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                    Ism yoki kompaniya
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alisher Karimov"
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-xs sm:text-sm text-[#111111] dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#0E9F6E] focus:ring-2 focus:ring-[#0E9F6E]/20 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email or Phone */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                Email yoki telefon
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="nomi@kompaniya.uz yoki +998 (90) 123-45-67"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-xs sm:text-sm text-[#111111] dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#0E9F6E] focus:ring-2 focus:ring-[#0E9F6E]/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                  Parol
                </label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert("Parolni tiklash havolasi yuborildi.")}
                    className="text-[11px] text-[#0E9F6E] hover:underline font-medium cursor-pointer"
                  >
                    Unutdingizmi?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kamida 6 ta belgi"
                  className="w-full pl-9 pr-10 py-2 rounded-xl bg-neutral-50 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] text-xs sm:text-sm text-[#111111] dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#0E9F6E] focus:ring-2 focus:ring-[#0E9F6E]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-5 rounded-xl bg-[#111111] hover:bg-neutral-800 text-white dark:bg-[#FDFDFD] dark:hover:bg-neutral-200 dark:text-[#111111] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white dark:border-[#111111] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{authMode === 'login' ? 'Tizimga kirish' : 'Akkaunt yaratish'}</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* One-click Guest Pass */}
          <div className="mt-3.5 text-center">
            <button
              type="button"
              onClick={handleGuest}
              className="text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white font-medium hover:underline cursor-pointer inline-flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#0E9F6E]" />
              <span>Mehmon sifatida davom etish (Ro'yxatdan o'tmasdan)</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Bottom Footer Note */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500 font-mono pt-2.5 border-t border-black/[0.04] dark:border-white/[0.06] flex-shrink-0">
          <span>O'zbekiston · 14 hudud</span>
          <div className="flex items-center gap-1">
            <ShieldCheck size={13} className="text-[#0E9F6E]" />
            <span>SSL Himoyalangan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
