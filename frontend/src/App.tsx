import React, { useEffect } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { Header } from './components/layout/Header';
import { MapView } from './components/map/MapView';
import { ScoreCard } from './components/sidebar/ScoreCard';
import { MetricsBreakdown } from './components/sidebar/MetricsBreakdown';
import { AuditReportModal } from './components/sidebar/AuditReportModal';
import { SearchBar } from './components/ui/SearchBar';
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
  return (
    <div className="h-screen w-screen flex flex-col bg-[#FDFDFD] dark:bg-[#111111] text-[#111111] dark:text-[#FDFDFD] font-sans overflow-hidden transition-colors">
      {/* Top Navigation & Brand Header */}
      <Header />

      {/* Mobile Search Bar (visible on small screens) */}
      <div className="sm:hidden px-3 py-2 border-b border-black/[0.07] dark:border-white/[0.08] bg-[#FDFDFD] dark:bg-[#111111] z-25">
        <SearchBar />
      </div>

      {/* Main Workspace: Interactive Map (Left) + Analytics Sidebar (Right) */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Map View Area */}
        <div className="flex-1 h-[46%] md:h-full relative overflow-hidden">
          <MapView />
        </div>

        {/* Analytics & Insights Sidebar (Pinned Score Header + Scrollable Factor Tabs) */}
        <aside className="w-full md:w-[430px] lg:w-[475px] h-[54%] md:h-full border-t md:border-t-0 md:border-l border-black/[0.07] dark:border-white/[0.08] bg-[#FDFDFD]/95 dark:bg-[#121214]/95 backdrop-blur-2xl flex flex-col z-20 select-none shadow-2xl overflow-hidden transition-colors">
          {/* 1. Pinned Score Header — Guaranteed to never scroll away */}
          <div className="flex-shrink-0 p-3.5 sm:p-4 border-b border-black/[0.06] dark:border-white/[0.07] bg-[#F8F9F8] dark:bg-[#161618]">
            <ScoreCard />
          </div>

          {/* 2. Scrollable Deep Analytics & 5-Tab Breakdown */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-[#FDFDFD] dark:bg-[#111111]">
            <MetricsBreakdown />
          </div>
        </aside>
      </main>

      {/* 5-Section Executive Spatial & Financial Audit Modal */}
      <AuditReportModal />
    </div>
  );
};

export default App;
