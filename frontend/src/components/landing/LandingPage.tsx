import React, { useEffect } from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { ScrollExperience } from './ScrollExperience';
import { ProblemSolution } from './ProblemSolution';
import { HowItWorks } from './HowItWorks';
import { IndustrySolutions } from './IndustrySolutions';
import { RoiCalculator } from './RoiCalculator';
import { LocationCompareSection } from './LocationCompareSection';
import { FaqSection } from './FaqSection';
import { LandingFooter } from './LandingFooter';
import { AuditReportModal } from '../sidebar/AuditReportModal';

export const LandingPage: React.FC = () => {
  const [scrollProgress, setScrollProgress] = React.useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / total) * 100)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#0C4137] font-sans selection:bg-[#06D6A0]/25 selection:text-[#0C4137] overflow-x-clip">
      {/* Hairline Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] bg-transparent z-[100] pointer-events-none">
        <div
          className="h-full bg-[#06D6A0] transition-[width] duration-75 ease-out shadow-[0_0_8px_rgba(6,214,160,0.5)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Sticky Blurred Navigation Bar */}
      <LandingNavbar />

      {/* Main Sections Flow */}
      <main>
        <LandingHero />
        <ScrollExperience />
        <LocationCompareSection />
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
