import React, { useEffect } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { Header } from './components/layout/Header';
import { MapView } from './components/map/MapView';
import { ScoreCard } from './components/sidebar/ScoreCard';
import { MetricsBreakdown } from './components/sidebar/MetricsBreakdown';
import { AuditReportModal } from './components/sidebar/AuditReportModal';
import { useAnalyticsStore } from './store/useAnalyticsStore';

export const App: React.FC = () => {
  const { currentView, inspectPoint } = useAnalyticsStore();

  useEffect(() => {
    // Initial inspection on app load
    inspectPoint();
  }, []);

  // 1. If user is on the Landing / Front-Door experience
  if (currentView === 'landing') {
    return <LandingPage />;
  }

  // 2. If user is on the Auth / Register & Login experience
  if (currentView === 'auth') {
    return <AuthPage />;
  }

  // 3. If user is inside the Interactive GIS Spatial Intelligence Workspace
  // Full-bleed 100% viewport map behind floating Dynamic Island top navbar + bottom-right blurred Analytics Island
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#FDFDFD] dark:bg-[#0D0D0F] text-[#111111] dark:text-[#FDFDFD] font-sans select-none">
      {/* Full-Screen Interactive Map Canvas (100% Viewport Background) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <MapView />
      </div>

      {/* Top Floating Dynamic Island Navigation Bar */}
      <Header />

      {/* Bottom-Right Floating Frosted-Glass Analytics Island */}
      <aside
        aria-label="Manzil tahlili va ko'rsatkichlar paneli"
        className="fixed z-20 bottom-2.5 left-2.5 right-2.5 h-[48vh] md:top-[72px] md:bottom-3.5 md:right-3.5 md:left-auto md:w-[420px] lg:w-[460px] md:h-auto spatial-glass-island rounded-[24px] md:rounded-[28px] flex flex-col overflow-hidden transition-all duration-300"
      >
        {/* 1. Pinned Score Header — Translucent glass top section */}
        <div className="flex-shrink-0 p-3.5 sm:p-4 border-b border-black/[0.07] dark:border-white/[0.08] bg-white/30 dark:bg-white/[0.02]">
          <ScoreCard />
        </div>

        {/* 2. Scrollable Deep Analytics & 5-Tab Breakdown — Pure frosted blur canvas */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 space-y-3.5 bg-transparent">
          <MetricsBreakdown />
        </div>
      </aside>

      {/* 5-Section Executive Spatial & Financial Audit Modal */}
      <AuditReportModal />
    </div>
  );
};

export default App;
