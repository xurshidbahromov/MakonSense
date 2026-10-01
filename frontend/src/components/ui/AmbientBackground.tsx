import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

interface AmbientBackgroundProps {
  fixed?: boolean;
  className?: string;
  intensity?: 'subtle' | 'default' | 'vibrant';
}

/**
 * AmbientBackground
 * Features a single, perfectly uniform, whisper-light circular orb.
 *
 * Characteristics:
 * - Ultra-light, airy emerald aura (juda light va muloyim).
 * - Perfectly even color distribution without harsh borders, lines, or hot spots.
 * - Smoothly glides across the screen and gently expands in response to user scroll.
 */
export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  fixed = true,
  className = '',
  intensity = 'default',
}) => {
  // Global scroll tracking
  const { scrollYProgress } = useScroll();

  // Gentle, fluid spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 22,
    restDelta: 0.001,
  });

  // Smooth scroll-driven trajectory across sections
  const x = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ['18vw', '-14vw', '14vw', '-10vw', '0vw']
  );

  const y = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ['-20vh', '-4vh', '14vh', '28vh', '40vh']
  );

  // Gentle, gradual expansion as the user travels down the page
  const scale = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [1.0, 1.1, 1.2, 1.28, 1.36]
  );

  // Subtle opacity multiplier
  const opacityMultiplier =
    intensity === 'vibrant' ? 1.15 : intensity === 'subtle' ? 0.75 : 1.0;

  return (
    <div
      aria-hidden="true"
      className={`${
        fixed ? 'fixed inset-0' : 'absolute inset-0'
      } pointer-events-none z-0 overflow-hidden select-none bg-[#FDFDFD] dark:bg-[#111111] ${className}`}
    >
      {/* 0. Soft universal background wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_0%,rgba(16,185,129,0.015),transparent_75%)] dark:bg-[radial-gradient(ellipse_120%_90%_at_50%_0%,rgba(16,185,129,0.025),transparent_75%)]" />

      {/* 
        1. THE UNIFORM, WHISPER-LIGHT CIRCULAR ORB
        Evenly distributed, very light emerald diffusion that glides smoothly with scroll.
      */}
      <motion.div
        style={{
          x,
          y,
          scale,
          opacity: opacityMultiplier,
        }}
        className="absolute left-1/2 top-1/2 -ml-[400px] -mt-[400px] sm:-ml-[500px] sm:-mt-[500px] lg:-ml-[600px] lg:-mt-[600px] w-[800px] h-[800px] sm:w-[1000px] sm:h-[1000px] lg:w-[1200px] lg:h-[1200px] pointer-events-none transform-gpu"
      >
        {/* Continuous, perfectly smooth radial falloff — zero harsh steps or visible lines */}
        <div
          className="absolute inset-0 rounded-full blur-[100px] sm:blur-[130px] lg:blur-[150px] transform-gpu bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.075)_0%,rgba(16,185,129,0.055)_32%,rgba(16,185,129,0.035)_58%,rgba(16,185,129,0.015)_78%,transparent_90%)] dark:bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.085)_0%,rgba(16,185,129,0.065)_32%,rgba(16,185,129,0.042)_58%,rgba(16,185,129,0.018)_78%,transparent_90%)]"
        />
      </motion.div>
    </div>
  );
};

export default AmbientBackground;
