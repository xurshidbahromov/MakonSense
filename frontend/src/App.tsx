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

        {/* Analytics & Insights Sidebar */}
        <aside className="w-full md:w-[440px] lg:w-[480px] h-1/2 md:h-full border-t md:border-t-0 md:border-l border-[#222735] bg-[#0A0C12] flex flex-col overflow-y-auto p-4 space-y-4 z-20 select-none shadow-2xl">
          {/* 1. Main Score Card + Integrated Quick Filter Strip */}
          <ScoreCard />

          {/* 2. Four Key Factors Breakdown & Tabs (Omillar, Raqobat, Trafik, A/B) */}
          <MetricsBreakdown />
        </aside>
      </main>

      {/* 5-Section Pay-per-Report Audit Modal */}
      <AuditReportModal />
    </div>
  );
};

export default App;
