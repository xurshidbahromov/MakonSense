import React, { useState } from 'react';
import {
  UZBEKISTAN_DOTS,
  UZBEKISTAN_HUBS,
  MapHub,
} from './uzbekistanMapData';

export const UzbekistanDottedMap: React.FC = () => {
  const [activeHub, setActiveHub] = useState<MapHub | null>(null);

  // Low-Angle Curved Flat-Oval Viewport Bounds
  const VB_X = 10;
  const VB_Y = 170;
  const VB_W = 980;
  const VB_H = 340;

  return (
    <div className="relative w-full max-w-5xl mx-auto select-none mt-2 sm:mt-4">
      {/* 1. Subtle 3D Curved Earth Depth Shadow under the floating map */}
      <div
        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[88%] h-10 bg-black/[0.05] dark:bg-black/25 rounded-full blur-2xl pointer-events-none"
        aria-hidden
      />

      {/* 2. Seamless Low-Angle Curved Map Viewport with Soft Lower Edge Fade */}
      <div
        className="relative w-full overflow-visible"
        style={{
          maskImage:
            'linear-gradient(to bottom, black 0%, black 88%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 0%, black 88%, transparent 100%)',
        }}
      >
        <svg
          viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
          className="w-full h-auto overflow-visible block"
          style={{ maxHeight: 'min(50vh, 440px)' }}
        >
          <defs>
            {/* Soft glow for regional beacon cores */}
            <filter id="hub-emerald-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#0E9F6E" floodOpacity="0.8" />
            </filter>
            {/* Curved Earth floor shadow */}
            <radialGradient id="map-floor-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Curved Oval Earth Grounding Shadow */}
          <ellipse cx="500" cy="495" rx="440" ry="22" fill="url(#map-floor-shadow)" className="dark:opacity-35" />

          {/* 3. Dotted Matrix forming Low-Angle Curved Oval Uzbekistan (853 points) */}
          <g className="dots-layer pointer-events-none">
            {UZBEKISTAN_DOTS.map((dot, idx) => {
              // Perspective scale and optical depth from low-angle projection
              const r = 1.65 * dot.s;
              const opacity = Math.min(0.78, Math.max(0.38, 0.40 + (dot.s - 0.85) * 0.35));

              return (
                <circle
                  key={idx}
                  cx={dot.x}
                  cy={dot.y}
                  r={+r.toFixed(2)}
                  opacity={+opacity.toFixed(2)}
                  className="fill-[#64748B] dark:fill-white/35 transition-colors duration-150"
                />
              );
            })}
          </g>

          {/* 4. 14 Regional Hub Beacons (Completely Static, Clean, High-Contrast) */}
          <g className="hubs-layer">
            {UZBEKISTAN_HUBS.map((hub) => {
              const isHovered = activeHub?.id === hub.id;
              const baseR = 2.6 * hub.scale;
              const haloR = isHovered ? 7.0 * hub.scale : 4.6 * hub.scale;

              return (
                <g
                  key={hub.id}
                  className="cursor-pointer group"
                  onMouseEnter={() => setActiveHub(hub)}
                  onMouseLeave={() => setActiveHub(null)}
                >
                  {/* Comfortable touch/cursor target */}
                  <circle cx={hub.x} cy={hub.y} r={18} fill="transparent" />

                  {/* Outer beacon aura halo */}
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={+haloR.toFixed(2)}
                    fill="#0E9F6E"
                    fillOpacity={isHovered ? 0.38 : 0.18}
                    className="transition-all duration-150"
                  />

                  {/* Core beacon point */}
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={+baseR.toFixed(2)}
                    fill="#0E9F6E"
                    stroke={isHovered ? '#FFFFFF' : 'currentColor'}
                    strokeWidth={1.2}
                    className="text-white dark:text-neutral-900 transition-all duration-150"
                    filter="url(#hub-emerald-glow)"
                  />
                </g>
              );
            })}
          </g>
        </svg>

        {/* 5. Minimalist Floating Tooltip HUD on Hub Hover */}
        {activeHub && (
          <div
            className="absolute pointer-events-none z-30 transition-opacity duration-150"
            style={{
              left: `${((activeHub.x - VB_X) / VB_W) * 100}%`,
              top: `${((activeHub.y - VB_Y) / VB_H) * 100}%`,
              transform: 'translate(-50%, -130%)',
            }}
          >
            <div className="px-3 py-1.5 rounded-lg bg-white/95 dark:bg-[#12161A]/95 backdrop-blur-md border border-[#0E9F6E]/40 shadow-lg shadow-black/15 flex flex-col gap-0.5 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E9F6E]" />
                <span className="font-mono text-[11px] font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  {activeHub.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0E9F6E]/15 text-[#0E9F6E] font-bold">
                  {activeHub.score}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                <span>{activeHub.sub}</span>
                <span>·</span>
                <span className="text-[#0E9F6E] font-medium">{activeHub.traffic} oqim</span>
              </div>
            </div>
            {/* Pointer tick */}
            <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-white/95 dark:border-t-[#12161A]/95 mx-auto -mt-[1px]" />
          </div>
        )}
      </div>

      {/* 6. Clean Geographic Meta Indicator below the map */}
      <div className="mt-3 flex items-center justify-center gap-4 text-center pointer-events-none">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
          524,476+ Bino Indekslangan · 14 Hudud · 150,000+ Fazoviy Nuqta
        </span>
      </div>
    </div>
  );
};

export default UzbekistanDottedMap;
