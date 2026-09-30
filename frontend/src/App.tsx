import React, { useEffect } from 'react';
import { LandingPage } from './components/landing/LandingPage';
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

  // 2. If user is inside the Interactive GIS Spatial Intelligence Workspace
  return (
    <div className="h-screen w-screen flex flex-col bg-[#FBFBFD] text-[#0C4137] font-sans overflow-hidden">
      {/* Top Navigation & Brand Header */}
      <Header />

      {/* Main Workspace: Interactive Map (Left) + Analytics Sidebar (Right) */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Map View Area */}
        <div className="flex-1 h-1/2 md:h-full relative overflow-hidden">
          <MapView />
        </div>

        {/* Analytics & Insights Sidebar (Pinned Score Header + Scrollable Factor Tabs) */}
        <aside className="w-full md:w-[420px] lg:w-[460px] h-1/2 md:h-full border-t md:border-t-0 md:border-l border-[#0C4137]/[0.08] bg-white/95 backdrop-blur-2xl flex flex-col z-20 select-none shadow-xl overflow-hidden">
          {/* 1. Pinned Score Header — Guaranteed to never scroll away */}
          <div className="flex-shrink-0 p-3.5 sm:p-4 border-b border-[#0C4137]/[0.08] bg-[#F8FAF9]">
            <ScoreCard />
          </div>

          {/* 2. Scrollable Deep Analytics & Breakdown Tabs */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4 bg-[#FBFBFD]/60">
            <MetricsBreakdown />
          </div>
        </aside>
      </main>

      {/* 5-Section Pay-per-Report Audit Modal */}
      <AuditReportModal />
    </div>
  );
};

export default App;
