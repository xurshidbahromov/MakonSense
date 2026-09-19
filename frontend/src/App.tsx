import React, { useEffect } from 'react';
import { Header } from './components/layout/Header';
import { MapView } from './components/map/MapView';
import { ScoreCard } from './components/sidebar/ScoreCard';
import { MetricsBreakdown } from './components/sidebar/MetricsBreakdown';
import { AuditReportModal } from './components/sidebar/AuditReportModal';
import { useAnalyticsStore } from './store/useAnalyticsStore';

export const App: React.FC = () => {
  const { inspectPoint } = useAnalyticsStore();

  useEffect(() => {
    // Initial inspection on app load
    inspectPoint();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#06070B] text-gray-100 font-sans overflow-hidden">
      {/* Top Navigation & Brand Header */}
      <Header />

      {/* Main Workspace: Interactive Map (Left) + Analytics Sidebar (Right) */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Map View Area */}
        <div className="flex-1 h-1/2 md:h-full relative overflow-hidden">
          <MapView />
        </div>

        {/* Analytics & Insights Sidebar (Pinned Score Header + Scrollable Factor Tabs) */}
        <aside className="w-full md:w-[420px] lg:w-[460px] h-1/2 md:h-full border-t md:border-t-0 md:border-l border-white/[0.08] bg-[#080A10]/95 backdrop-blur-2xl flex flex-col z-20 select-none shadow-2xl overflow-hidden">
          {/* 1. Pinned Score Header — Guaranteed to never scroll away */}
          <div className="flex-shrink-0 p-3.5 sm:p-4 border-b border-white/[0.06] bg-gradient-to-b from-[#0F121C] to-[#090B12]">
            <ScoreCard />
          </div>

          {/* 2. Scrollable Deep Analytics & Breakdown Tabs */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4">
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
