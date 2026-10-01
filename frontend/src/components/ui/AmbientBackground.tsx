import React from 'react';

interface AmbientBackgroundProps {
  fixed?: boolean;
  className?: string;
  intensity?: 'subtle' | 'default' | 'vibrant';
}

/**
 * AmbientBackground
 * Ultra-refined, whisper-soft emerald atmospheric background.
 * Provides the base theme canvas (light #FDFDFD / dark #111111) with
 * delicate, calm, and silky ambient green light floating gracefully at z-0.
 */
export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  fixed = true,
  className = '',
  intensity = 'default',
}) => {
  // Opacity multipliers based on intensity
  const opacityClass =
    intensity === 'vibrant'
      ? 'opacity-100'
      : intensity === 'subtle'
      ? 'opacity-65'
      : 'opacity-85';

  return (
    <div
      aria-hidden="true"
      className={`${
        fixed ? 'fixed inset-0' : 'absolute inset-0'
      } pointer-events-none z-0 overflow-hidden select-none bg-[#FDFDFD] dark:bg-[#111111] ${opacityClass} ${className}`}
    >
      {/* 0. Subtle organic page-wide ambient wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-10%,rgba(16,185,129,0.04),transparent_70%)] dark:bg-[radial-gradient(ellipse_100%_80%_at_50%_-10%,rgba(16,185,129,0.06),transparent_70%)]" />

      {/* 1. Top-Right Hero Ambient Mesh (Luminous Primary Bloom) */}
      <div className="absolute -top-[12%] right-[2%] w-[980px] h-[980px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.13)_0%,rgba(14,159,110,0.05)_42%,transparent_72%)] dark:bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.14)_0%,rgba(14,159,110,0.055)_45%,transparent_75%)] blur-[125px] transform-gpu" />

      {/* 2. Top-Left Hero Drift (Secondary Soft Flow) */}
      <div className="absolute top-[4%] -left-[6%] w-[840px] h-[840px] rounded-full bg-[radial-gradient(circle_at_center,rgba(14,159,110,0.10)_0%,rgba(16,185,129,0.04)_45%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(14,159,110,0.11)_0%,rgba(16,185,129,0.045)_48%,transparent_72%)] blur-[125px] transform-gpu" />

      {/* 3. Center Flow (Directly illuminating ScrollExperience & Solutions) */}
      <div className="absolute top-[28%] left-[12%] w-[980px] h-[880px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.11)_0%,rgba(14,159,110,0.04)_45%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12)_0%,rgba(14,159,110,0.045)_48%,transparent_72%)] blur-[130px] transform-gpu" />

      {/* 4. Mid-Right Accent (Illuminating HowItWorks & Industry cases) */}
      <div className="absolute top-[48%] -right-[2%] w-[940px] h-[900px] rounded-full bg-[radial-gradient(circle_at_center,rgba(14,159,110,0.10)_0%,rgba(16,185,129,0.04)_45%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(14,159,110,0.11)_0%,rgba(16,185,129,0.045)_48%,transparent_72%)] blur-[130px] transform-gpu" />

      {/* 5. Lower Flow (Behind ROI Calculator & FAQ) */}
      <div className="absolute top-[68%] left-[8%] w-[980px] h-[900px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.11)_0%,rgba(14,159,110,0.04)_45%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12)_0%,rgba(14,159,110,0.045)_48%,transparent_72%)] blur-[135px] transform-gpu" />

      {/* 6. Footer Base Glow */}
      <div className="absolute -bottom-[6%] right-[5%] w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle_at_center,rgba(14,159,110,0.09)_0%,rgba(16,185,129,0.035)_45%,transparent_70%)] dark:dark:bg-[radial-gradient(circle_at_center,rgba(14,159,110,0.10)_0%,rgba(16,185,129,0.04)_48%,transparent_72%)] blur-[125px] transform-gpu" />
    </div>
  );
};

export default AmbientBackground;
