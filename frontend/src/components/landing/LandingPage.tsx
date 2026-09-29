import React, { useEffect } from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { ProblemSolution } from './ProblemSolution';
import { HowItWorks } from './HowItWorks';
import { IndustrySolutions } from './IndustrySolutions';
import { RoiCalculator } from './RoiCalculator';
import { FaqSection } from './FaqSection';
import { LandingFooter } from './LandingFooter';
import { AuditReportModal } from '../sidebar/AuditReportModal';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#06070B] text-gray-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      {/* Sticky Blurred Navigation Bar */}
      <LandingNavbar />

      {/* Main Sections Flow */}
      <main>
        <LandingHero />
        <ProblemSolution />
        <HowItWorks />
        <IndustrySolutions />
        <RoiCalculator />
        <FaqSection />
      </main>

      {/* Grand Footer with Final CTA */}
      <LandingFooter />

      {/* Interactive Audit Modal (Opens on 'PDF Audit Namunasi' click) */}
      <AuditReportModal />
    </div>
  );
};

export default LandingPage;
