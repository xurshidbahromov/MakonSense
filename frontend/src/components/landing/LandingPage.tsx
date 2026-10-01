import React, { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#111111] text-[#111111] dark:text-[#FDFDFD] font-sans overflow-x-clip">
      {/* Minimalist Smooth Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[100] pointer-events-none">
        <motion.div
          className="h-full bg-[#0E9F6E]"
          style={{
            scaleX,
            transformOrigin: '0%',
          }}
        />
      </div>

      <LandingNavbar />

      <main>
        <LandingHero />
        <ScrollExperience />
        <ProblemSolution />
        <LocationCompareSection />
        <HowItWorks />
        <IndustrySolutions />
        <RoiCalculator />
        <FaqSection />
      </main>

      <LandingFooter />
      <AuditReportModal />
    </div>
  );
};

export default LandingPage;
