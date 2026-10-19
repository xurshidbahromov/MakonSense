import React, { useEffect, useRef } from 'react';
import { WORDMARK_PTS, WORDMARK_ACCENT } from './wordmarkPoints';
import { UZBEKISTAN_DOTS, UZBEKISTAN_HUBS } from './uzbekistanMapData';

/* ------------------------------------------------------------------ */
/* Scroll-driven morphing 3D spatial particle object                  */
/* Clean, minimal Swiss design: 300 elegant dots with silky emerald   */
/* accent highlights and smooth aerodynamic scroll transitions.       */
/* Sits at z-[2] behind section cards, softly diffusing through glass */
/* and re-assembling into clean domain geometries per section.        */
/* At the footer, morphs smoothly into the 10-letter MakonSense       */
/* wordmark with illuminated signature emerald "Sense" highlight.     */
/* ------------------------------------------------------------------ */

type Vec3 = [number, number, number];

interface Formation {
  pts: Vec3[];
  accent: number[];
  weight: number[];
}

export type MorphShape =
  | 'map'
  | 'globe'
  | 'layers'
  | 'cube'
  | 'towers'
  | 'steps'
  | 'clusters'
  | 'bars'
  | 'ring'
  | 'wordmark';

const N = 300;
const ACCENT: [number, number, number] = [14, 159, 110]; // Signature Silky Emerald #0E9F6E

/* ---------------------------- helpers ----------------------------- */

const fill = (pts: Vec3[], acc: number[]): Formation => {
  const out: Vec3[] = [];
  const a: number[] = [];
  const w: number[] = [];
  const M = pts.length;
  for (let i = 0; i < N; i++) {
    const k = i % M;
    out.push(pts[k]);
    a.push(acc[k]);
    w.push(i < M ? 1.0 : 0.0);
  }
  return { pts: out, accent: a, weight: w };
};

const segment = (a: Vec3, b: Vec3, n: number): Vec3[] => {
  const out: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / Math.max(1, n - 1);
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
  }
  return out;
};

const circleRing = (r: number, y: number, n: number, cx = 0, cz = 0): Vec3[] => {
  const out: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    out.push([cx + Math.cos(a) * r, y, cz + Math.sin(a) * r]);
  }
  return out;
};

const planarDisc = (
  r: number,
  y: number,
  cx = 0,
  cz = 0,
  rings = 4,
  accBase = 0.2
): { pts: Vec3[]; acc: number[] } => {
  const pts: Vec3[] = [[cx, y, cz]];
  const acc: number[] = [accBase + 0.3];
  for (let ring = 1; ring <= rings; ring++) {
    const ringR = (ring / rings) * r;
    const ringPts = ring * 6;
    for (let i = 0; i < ringPts; i++) {
      const a = (i / ringPts) * Math.PI * 2;
      pts.push([cx + Math.cos(a) * ringR, y, cz + Math.sin(a) * ringR]);
      acc.push(ring === rings ? accBase + 0.2 : accBase);
    }
  }
  return { pts, acc };
};

const gridPlate = (
  size: number,
  y: number,
  n = 7,
  accBase = 0.22
): { pts: Vec3[]; acc: number[] } => {
  const pts: Vec3[] = [];
  const acc: number[] = [];
  const half = size / 2;
  const mid = Math.floor(n / 2);
  for (let ix = 0; ix < n; ix++) {
    for (let iz = 0; iz < n; iz++) {
      const x = -half + (ix / (n - 1)) * size;
      const z = -half + (iz / (n - 1)) * size;
      pts.push([x, y, z]);
      const isCenter = ix === mid && iz === mid;
      const isCorridor = ix === mid || iz === mid;
      acc.push(isCenter ? 1.0 : (isCorridor ? accBase + 0.50 : accBase));
    }
  }
  return { pts, acc };
};

const fibSphere = (n: number, r: number, c: Vec3 = [0, 0, 0]): Vec3[] => {
  const ga = Math.PI * (3 - Math.sqrt(5));
  const out: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / Math.max(1, n - 1)) * 2;
    const rr = Math.sqrt(Math.max(0, 1 - y * y));
    const th = ga * i;
    out.push([c[0] + Math.cos(th) * rr * r, c[1] + y * r, c[2] + Math.sin(th) * rr * r]);
  }
  return out;
};

const geoToSphere = (latDeg: number, lonDeg: number, r = 1.0): Vec3 => {
  const phi = (latDeg * Math.PI) / 180;
  const theta = (lonDeg * Math.PI) / 180;
  const cosPhi = Math.cos(phi);
  return [
    r * cosPhi * Math.sin(theta),
    r * Math.sin(phi),
    r * cosPhi * Math.cos(theta),
  ];
};

const segGeo = (p1: [number, number], p2: [number, number], n: number, r = 1.0): Vec3[] => {
  const res: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / Math.max(1, n - 1);
    const lat = p1[0] + (p2[0] - p1[0]) * t;
    const lon = p1[1] + (p2[1] - p1[1]) * t;
    res.push(geoToSphere(lat, lon, r));
  }
  return res;
};

/* --------------------------- formations --------------------------- */
/* 9 Signature 3D Particle Archetypes Tailored to Each Section:
   1. Hero (map / globe)        -> Low-Angle Dotted Uzbekistan Map (14 Regional Hubs + 286 Baseline Dots)
   2. ScrollExperience (layers) -> 3-Tier Isometric Geospatial Intelligence Stack (Uch Qatlam Tahlil: Transit, Competitor Radar, MakonScore)
   3. ProblemSolution (cube)    -> Broad Noble Heraldic Shield + Bold 3-Layer Checkmark (94.2% Protected Investment)
   4. LocationCompare (towers)  -> Architectural A/B Comparison Monolith Towers (94.0 Winner vs 62.3 + Curved Advantage Vector)
   5. HowItWorks (steps)        -> Exact Tangent Teardrop Map Pin (📍) + 3 Isochrone Radius Rings (300m · 500m · 1km)
   6. IndustrySolutions (clusters) -> Central Hexagonal AI Core + 4 Quadrant Sector Hexagons (HoReCa, Retail, Dorixona, Mulk)
   7. RoiCalculator (bars)      -> 4 Ascending Financial Columns + High-Clearance Breakout Trend Arrow (📈)
   8. FaqSection (ring)         -> Sculptural Question Mark (?) Emblem + 6-Node Knowledge Halo Ring
   9. Footer (wordmark)         -> Illuminated 10-Letter MakonSense Wordmark
/* ------------------------- camera angles -------------------------- */
const SHAPE_ANGLES: Record<MorphShape, { yaw: number; pitch: number }> = {
  map: { yaw: 0.0, pitch: 0.0 },
  globe: { yaw: 0.0, pitch: 0.0 },
  layers: { yaw: 0.0, pitch: 0.0 },
  cube: { yaw: 0.0, pitch: 0.0 },
  towers: { yaw: 0.0, pitch: 0.0 },
  steps: { yaw: 0.0, pitch: 0.0 },
  clusters: { yaw: 0.0, pitch: 0.0 },
  bars: { yaw: 0.0, pitch: 0.0 },
  ring: { yaw: 0.0, pitch: 0.0 },
  wordmark: { yaw: 0.0, pitch: 0.0 },
};

/* --------------------------- formations --------------------------- */
const buildFormations = (): Record<MorphShape, Formation> => {
  // 1. Hero: Exact Low-Angle Dotted Uzbekistan Map matching UzbekistanDottedMap (14 Regional Hubs + 286 Baseline Dots)
  const map = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    // SVG viewBox bounds: VB_X = 15, VB_Y = 184, VB_W = 965, VB_H = 322
    const midX = 15 + 965 / 2; // 497.5
    const midY = 184 + 322 / 2; // 345.0
    const halfW = 965 / 2;      // 482.5

    // A. All 14 regional hubs as landmark emerald beacons (exact coords from UzbekistanDottedMap)
    UZBEKISTAN_HUBS.forEach((hub) => {
      const x = (hub.x - midX) / halfW;
      const y = -(hub.y - midY) / halfW;
      const z = 0.04;
      pts.push([x, y, z]);
      acc.push(1.0); // Signature Silky Emerald Hub Beacon
    });

    // B. Sample 286 points evenly across UZBEKISTAN_DOTS (853 total dots)
    const numSample = N - UZBEKISTAN_HUBS.length; // exactly 286 points
    const totalDots = UZBEKISTAN_DOTS.length;
    for (let i = 0; i < numSample; i++) {
      const idx = Math.min(totalDots - 1, Math.floor((i / numSample) * totalDots));
      const dot = UZBEKISTAN_DOTS[idx];
      const x = (dot.x - midX) / halfW;
      const y = -(dot.y - midY) / halfW;
      // Gentle subtle starlight elevation
      const z = (dot.s - 0.95) * 0.08;
      pts.push([x, y, z]);
      acc.push(0.15); // Baseline crisp white/slate dot
    }

    return fill(pts, acc);
  })();

  // 2. ScrollExperience (Tahlil Section — "Uch qatlam tahlil. Bir hisobot."):
  // Pure 3-Layer Isometric Planes (NO vertical pillars, NO extra clutter!):
  // 3 planes x (5x5 = 25 wide-spaced dots) = 75 unique dots total!
  const layers = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    const rx = 0.94;
    const ry = 0.24;
    const layerCenters = [
      { cy: 0.66, zBase: 0.08 },  // Layer 01: Piyodalar Tranziti
      { cy: 0.0, zBase: 0.0 },    // Layer 02: Raqobat Tahlili
      { cy: -0.66, zBase: -0.08 } // Layer 03: Daromad Prognozi
    ];

    layerCenters.forEach((layer) => {
      for (let iu = 0; iu < 5; iu++) {
        for (let iv = 0; iv < 5; iv++) {
          const u = -1 + (iu / 4) * 2;
          const v = -1 + (iv / 4) * 2;
          const x = (u - v) * 0.5 * rx;
          const y = layer.cy + (u + v) * 0.5 * ry;
          const z = layer.zBase + (v - u) * 0.04;
          pts.push([x, y, z]);

          const isCornerOrCenter =
            ((iu === 0 || iu === 4) && (iv === 0 || iv === 4)) || (iu === 2 && iv === 2);
          acc.push(isCornerOrCenter ? 1.0 : 0.15);
        }
      }
    });

    return fill(pts, acc);
  })();

  // 3. ProblemSolution (cube): Single Crisp Shield Outline + Single Crisp Checkmark (NO inner shield, NO interior filler!)
  // 40 outer shield dots + 16 checkmark dots = 56 unique wide-spaced dots total!
  const cube = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    const shieldPoint = (t: number, side: number, z = 0): Vec3 => {
      if (t <= 0.22) {
        const u = t / 0.22;
        const x = side * (u * 0.86);
        const y = 0.90 - Math.sin(u * Math.PI * 0.5) * 0.16;
        return [x, y, z];
      } else {
        const u = (t - 0.22) / 0.78;
        const x = side * 0.86 * Math.pow(1 - Math.pow(u, 1.55), 0.62);
        const y = 0.74 - u * 1.64;
        return [x, y, z];
      }
    };

    // 1. Single Crisp Shield Outline: left (21 pts) + right (19 pts) = 40 wide-spaced dots
    for (let i = 0; i < 21; i++) {
      const t = i / 20;
      pts.push(shieldPoint(t, -1, 0.06));
      acc.push(i === 0 || i === 4 || i === 12 || i === 20 ? 1.0 : 0.15);
    }
    for (let i = 1; i < 20; i++) {
      const t = i / 20;
      pts.push(shieldPoint(t, 1, 0.06));
      acc.push(i === 4 || i === 12 ? 1.0 : 0.15);
    }

    // 2. Single Crisp Checkmark (✓) in the open center: 6 short leg + 10 long leg = 16 wide-spaced dots
    const pStart: Vec3 = [-0.36, 0.02, 0.12];
    const pKnee: Vec3 = [-0.08, -0.26, 0.14];
    const pEnd: Vec3 = [0.42, 0.34, 0.12];
    const leg1 = segment(pStart, pKnee, 6);
    const leg2 = segment(pKnee, pEnd, 11).slice(1);
    leg1.forEach((p, idx) => {
      pts.push(p);
      acc.push(idx === 0 || idx === 3 || idx === 5 ? 1.0 : 0.15);
    });
    leg2.forEach((p, idx) => {
      pts.push(p);
      acc.push(idx === 3 || idx === 6 || idx === 9 ? 1.0 : 0.15);
    });

    return fill(pts, acc);
  })();

  // 4. LocationCompareSection (towers): Pure A/B Comparison Columns on a Baseline (NO ticks, NO bridges, NO clutter!)
  // 15 baseline dots + 45 Tower A (5x9) + 25 Tower B (5x5) = 85 unique wide-spaced dots total!
  const towers = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    // 1. Clean Ground Baseline: 15 wide-spaced dots
    const baseLine = segment([-0.88, -0.82, 0], [0.88, -0.82, 0], 15);
    baseLine.forEach((p, i) => {
      pts.push(p);
      acc.push(i === 0 || i === 14 ? 1.0 : 0.15);
    });

    // 2. Left Column A (Winner: Amir Temur 94.0) — 5 cols x 9 rows = 45 wide-spaced dots
    for (let r = 0; r < 9; r++) {
      const y = -0.64 + (r / 8) * 1.44;
      for (let c = 0; c < 5; c++) {
        const x = -0.78 + (c / 4) * 0.58;
        pts.push([x, y, 0.06]);
        const isTopRow = r === 8;
        const isCore = r === 4 && c === 2;
        acc.push(isTopRow || isCore ? 1.0 : 0.15);
      }
    }

    // 3. Right Column B (Chilonzor 62.3) — 5 cols x 5 rows = 25 wide-spaced dots
    for (let r = 0; r < 5; r++) {
      const y = -0.64 + (r / 4) * 0.72;
      for (let c = 0; c < 5; c++) {
        const x = 0.20 + (c / 4) * 0.58;
        pts.push([x, y, -0.02]);
        acc.push(r === 4 && c === 2 ? 1.0 : 0.15);
      }
    }

    return fill(pts, acc);
  })();

  // 5. HowItWorks (steps): Non-Overlapping Geolocation Map Pin (📍) + 2 Clean Target Rings Underneath
  // Pin sits cleanly at y in [-0.14, +0.86]; Target rings sit below at y = -0.54 -> ZERO overlap! (77 unique dots total)
  const steps = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    const cyPin = 0.48;
    const rPin = 0.38;
    const tipY = -0.14;

    // 1. Crisp Teardrop Map Pin Contour: 18 arc dots + 7 left leg + 7 right leg = 32 wide-spaced dots
    const aStart = (-30 * Math.PI) / 180;
    const aEnd = (210 * Math.PI) / 180;
    for (let i = 0; i < 18; i++) {
      const t = i / 17;
      const a = aStart + t * (aEnd - aStart);
      pts.push([Math.cos(a) * rPin, cyPin + Math.sin(a) * rPin, 0.10]);
      acc.push(i === 0 || i === 8 || i === 17 ? 1.0 : 0.15);
    }
    const pLeft: Vec3 = [Math.cos(aEnd) * rPin, cyPin + Math.sin(aEnd) * rPin, 0.10];
    const pRight: Vec3 = [Math.cos(aStart) * rPin, cyPin + Math.sin(aStart) * rPin, 0.10];
    const pTip: Vec3 = [0, tipY, 0.10];
    const leftLeg = segment(pLeft, pTip, 8).slice(1);
    const rightLeg = segment(pTip, pRight, 9).slice(1, -1);
    leftLeg.forEach((p, i) => {
      pts.push(p);
      acc.push(i === 6 ? 1.0 : 0.15);
    });
    rightLeg.forEach((p) => {
      pts.push(p);
      acc.push(0.15);
    });

    // 2. Pin Eye Circle at (0, 0.48): 1 center bullseye beacon + 10 ring dots (r = 0.14) = 11 dots
    pts.push([0, cyPin, 0.14]);
    acc.push(1.0);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      pts.push([Math.cos(a) * 0.14, cyPin + Math.sin(a) * 0.14, 0.12]);
      acc.push(i === 0 || i === 5 ? 1.0 : 0.15);
    }

    // 3. 2 Clean Concentric Isochrone Target Rings cleanly below the pin at y = -0.54: 12 + 22 = 34 wide-spaced dots
    const targetY = -0.54;
    const rings = [
      { rx: 0.38, ry: 0.11, n: 12, z: 0.02, beacons: [0, 6] },
      { rx: 0.84, ry: 0.24, n: 22, z: -0.04, beacons: [0, 5, 11, 16] },
    ];
    rings.forEach((rg) => {
      for (let i = 0; i < rg.n; i++) {
        const a = (i / rg.n) * Math.PI * 2;
        pts.push([Math.cos(a) * rg.rx, targetY + Math.sin(a) * rg.ry, rg.z]);
        acc.push(rg.beacons.includes(i) ? 1.0 : 0.15);
      }
    });

    return fill(pts, acc);
  })();

  // 6. IndustrySolutions (clusters): 4 Clean Quadrant Sector Matrices (4x4 = 16 dots each) + Minimalist Center Crosshair
  // Directly visualizes 4 distinct business sectors (HoReCa, Retail, Dorixona, Ko'chmas Mulk): 64 + 17 = 81 unique dots!
  const clusters = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    // 1. 4 Quadrant 4x4 Dot-Matrix Blocks (16 dots each = 64 wide-spaced dots)
    const quads = [
      { cx: -0.52, cy: 0.52 },  // HoReCa
      { cx: 0.52, cy: 0.52 },   // Retail
      { cx: -0.52, cy: -0.52 }, // Dorixona
      { cx: 0.52, cy: -0.52 },  // Ko'chmas Mulk
    ];
    quads.forEach((q) => {
      for (let r = 0; r < 4; r++) {
        const y = q.cy - 0.24 + (r / 3) * 0.48;
        for (let c = 0; c < 4; c++) {
          const x = q.cx - 0.24 + (c / 3) * 0.48;
          pts.push([x, y, 0.04]);
          const isOuterCorner =
            (q.cx < 0 && c === 0 && ((q.cy > 0 && r === 3) || (q.cy < 0 && r === 0))) ||
            (q.cx > 0 && c === 3 && ((q.cy > 0 && r === 3) || (q.cy < 0 && r === 0)));
          const isInnerHub =
            (q.cx < 0 && c === 2 && ((q.cy > 0 && r === 1) || (q.cy < 0 && r === 2))) ||
            (q.cx > 0 && c === 1 && ((q.cy > 0 && r === 1) || (q.cy < 0 && r === 2)));
          acc.push(isOuterCorner || isInnerHub ? 1.0 : 0.15);
        }
      }
    });

    // 2. Minimalist Central Axis Crosshair (+) separating the 4 sectors: 9 horizontal + 8 vertical = 17 dots
    const hAxis = segment([-0.84, 0, 0.08], [0.84, 0, 0.08], 9);
    hAxis.forEach((p, i) => {
      pts.push(p);
      acc.push(i === 0 || i === 4 || i === 8 ? 1.0 : 0.15);
    });
    const vAxis = segment([0, -0.84, 0.08], [0, 0.84, 0.08], 9);
    vAxis.forEach((p, i) => {
      if (i === 4) return;
      pts.push(p);
      acc.push(i === 0 || i === 8 ? 1.0 : 0.15);
    });

    return fill(pts, acc);
  })();

  // 7. RoiCalculator (bars): 4 Minimalist 3-Column Ascending Bars + Single Trend Arrow (NO Y-axis, NO double curves!)
  // 15 baseline + 72 bar dots + 16 arrow dots = 103 unique wide-spaced dots total!
  const bars = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    // 1. Clean Horizontal Baseline at y = -0.84: 15 wide-spaced dots
    const baseAxis = segment([-0.86, -0.84, 0], [0.86, -0.84, 0], 15);
    baseAxis.forEach((p, i) => {
      pts.push(p);
      acc.push(i === 0 || i === 14 ? 1.0 : 0.15);
    });

    // 2. 4 Ascending 3-Column Dot-Matrix Bars: 9 + 15 + 21 + 27 = 72 wide-spaced dots
    const barDefs = [
      { x1: -0.80, x2: -0.56, rows: 3 },
      { x1: -0.36, x2: -0.12, rows: 5 },
      { x1: 0.08, x2: 0.32, rows: 7 },
      { x1: 0.52, x2: 0.76, rows: 9 },
    ];
    barDefs.forEach((b) => {
      for (let r = 0; r < b.rows; r++) {
        const y = -0.68 + r * 0.13;
        for (let c = 0; c < 3; c++) {
          const x = b.x1 + (c / 2) * (b.x2 - b.x1);
          pts.push([x, y, 0.04]);
          acc.push(r === b.rows - 1 && c === 1 ? 1.0 : 0.15);
        }
      }
    });

    // 3. Single-Line Rising Breakout Arrow (↗) cleanly above the bars: 10 curve + 3 + 3 wings = 16 wide-spaced dots
    for (let i = 0; i < 10; i++) {
      const t = i / 9;
      const x = -0.72 + t * 1.44;
      const y = -0.16 + Math.pow(t, 1.10) * 1.04;
      pts.push([x, y, 0.12]);
      acc.push(i === 0 || i === 5 || i === 9 ? 1.0 : 0.15);
    }
    const wingL = segment([0.72, 0.88, 0.14], [0.46, 0.84, 0.14], 4).slice(1);
    const wingR = segment([0.72, 0.88, 0.14], [0.68, 0.62, 0.14], 4).slice(1);
    [...wingL, ...wingR].forEach((p, i) => {
      pts.push(p);
      acc.push(i === 2 || i === 5 ? 1.0 : 0.15);
    });

    return fill(pts, acc);
  })();

  // 8. FaqSection (ring): Single Clean Halo Ring + Single-Line Crisp Question Mark (?)
  // 36 outer ring dots + 18 single-line question mark dots + 7 bottom dot = 61 unique wide-spaced dots total!
  const ring = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    // 1. Single Crisp Outer Halo Ring (r = 0.94) with 6 beacons for the 6 FAQs: 36 wide-spaced dots
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      pts.push([Math.cos(a) * 0.94, Math.sin(a) * 0.94, -0.04]);
      acc.push(i % 6 === 0 ? 1.0 : 0.15);
    }

    // 2. Single-Track Crisp Question Mark (?) in the center: 18 wide-spaced dots
    const questionCurve = (t: number): Vec3 => {
      if (t <= 0.62) {
        const u = t / 0.62;
        const a = (165 - u * 210) * (Math.PI / 180);
        const r = 0.36;
        const cx = 0.0, cy = 0.28;
        return [cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0.10];
      } else if (t <= 0.82) {
        const u = (t - 0.62) / 0.20;
        const aStart = (-45 * Math.PI) / 180;
        const r = 0.36;
        const x0 = Math.cos(aStart) * r;
        const y0 = 0.28 + Math.sin(aStart) * r;
        const x1 = 0.0;
        const y1 = -0.08;
        const ease = u * u * (3 - 2 * u);
        return [x0 + (x1 - x0) * ease, y0 + (y1 - y0) * ease, 0.12];
      } else {
        const u = (t - 0.82) / 0.18;
        return [0.0, -0.08 - u * 0.22, 0.12];
      }
    };

    for (let i = 0; i < 18; i++) {
      const t = i / 17;
      pts.push(questionCurve(t));
      const isB = i === 0 || i === 4 || i === 9 || i === 13 || i === 17;
      acc.push(isB ? 1.0 : 0.15);
    }

    // 3. Question Mark Bottom Dot at (0, -0.52): 1 center + 6 ring dots = 7 dots -> Total 61 dots!
    const dotY = -0.52;
    pts.push([0, dotY, 0.14]);
    acc.push(1.0);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      pts.push([Math.cos(a) * 0.07, dotY + Math.sin(a) * 0.07, 0.12]);
      acc.push(0.15);
    }

    return fill(pts, acc);
  })();

  // 9. LandingFooter: Illuminated 10-Letter MakonSense Wordmark
  const wordmark: Formation = {
    pts: WORDMARK_PTS,
    accent: WORDMARK_ACCENT,
    weight: Array.from({ length: N }, () => 1.0),
  };

  return { map, globe: map, layers, cube, towers, steps, clusters, bars, ring, wordmark };
};

/* ---------------------------- easing ------------------------------ */

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* --------------------------- anchor slot -------------------------- */

export const MorphAnchor: React.FC<{ shape: MorphShape; className?: string }> = ({
  shape,
  className = '',
}) => <div aria-hidden data-morph={shape} className={`hidden lg:block flex-shrink-0 ${className}`} />;

/* --------------------------- the object --------------------------- */

export const MorphObject: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const formations = buildFormations();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Per-dot random scatter direction for fluid aerodynamic flight
    const noise: Vec3[] = Array.from({ length: N }, () => {
      const v: Vec3 = [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5];
      const l = Math.hypot(v[0], v[1], v[2]) || 1;
      return [v[0] / l, v[1] / l, v[2] / l];
    });

    const sx = new Float32Array(N);
    const sy = new Float32Array(N);
    const sz = new Float32Array(N);
    const sa = new Float32Array(N);
    const sw = new Float32Array(N);
    const order = Array.from({ length: N }, (_, i) => i);

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let vw = window.innerWidth;
    let vh = window.innerHeight;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      vw = window.innerWidth;
      vh = window.innerHeight;
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      canvas.style.width = `${vw}px`;
      canvas.style.height = `${vh}px`;
    };
    resize();
    window.addEventListener('resize', resize);

    // Subtle tactile mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let smoothP: number | null = null;
    let last = performance.now();
    const start = last;
    let raf = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, vw, vh);
      if (vw < 1024) return;

      /* -------- collect anchors -------- */
      const els = Array.from(document.querySelectorAll<HTMLElement>('[data-morph]'));
      const anchors = els
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            shape: el.dataset.morph as MorphShape,
            cx: r.left + r.width / 2,
            cy: r.top + r.height / 2,
            width: r.width,
            height: r.height,
            size: Math.min(r.width, r.height),
          };
        })
        .filter((a) => a.size > 0 && formations[a.shape]);
      if (anchors.length === 0) return;

      /* -------- target progress P = index + flight fraction -------- */
      const vc = vh * 0.5;
      let idx = -1;
      for (let j = 0; j < anchors.length; j++) if (anchors[j].cy - vc <= 0) idx = j;

      let targetP = 0;
      if (idx >= anchors.length - 1) {
        targetP = anchors.length - 1;
      } else if (idx >= 0) {
        const da = anchors[idx].cy - vc;
        const db = anchors[idx + 1].cy - vc;
        const t = clamp(-da / (db - da));
        targetP = idx + easeInOutCubic(clamp((t - 0.24) / 0.52));
      }

      // Smooth transition into the final footer wordmark anchor as page approaches bottom
      const lastIdx = anchors.length - 1;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
      const scrollY = window.scrollY || window.pageYOffset;
      const bottomDist = maxScroll - scrollY;
      if (bottomDist < 480) {
        const bottomFraction = clamp((480 - bottomDist) / 460);
        const footerTarget = (lastIdx - 1) + easeInOutCubic(bottomFraction);
        targetP = Math.max(targetP, footerTarget);
      }

      if (smoothP === null) smoothP = targetP;
      smoothP += (targetP - smoothP) * (1 - Math.exp(-dt * 4.6)); // Silky liquid scroll glide
      const P = smoothP;

      const a = Math.min(anchors.length - 1, Math.floor(P));
      const b = Math.min(anchors.length - 1, a + 1);
      const e = clamp(P - a);
      const A = anchors[a];
      const B = anchors[b];
      const fa = formations[A.shape];
      const fb = formations[B.shape];

      // Wordmark active influence (0 when in sections 1-8, rises to 1 in footer)
      const wordmarkWeight = (A.shape === 'wordmark' ? (1 - e) : 0) + (B.shape === 'wordmark' ? e : 0);

      // Absorption into wordmark:
      // Dots descend ALL THE WAY DOWN through the footer staying 100% visible (e in 0..0.84),
      // and only plunge into the letter interiors and vanish when physically at the wordmark (e in 0.84..1.0)!
      let absorb = 0;
      if (a >= anchors.length - 1) {
        absorb = 1;
      } else if (B.shape === 'wordmark') {
        absorb = clamp((e - 0.84) / 0.16);
      } else if (A.shape === 'wordmark') {
        absorb = 1 - clamp(e / 0.16);
      }

      // On hero section at rest (scrollY <= threshold), keep canvas particles transparent so UzbekistanDottedMap shines cleanly with 100% SVG fidelity.
      // As user scrolls down past Hero towards Section 2, canvas particles smoothly emerge from the map and morph down into the DNA double helix.
      const heroThreshold = Math.min(380, vh * 0.45);
      const heroRange = Math.min(260, vh * 0.30);
      const heroFade = scrollY <= heroThreshold ? 0 : clamp((scrollY - heroThreshold) / heroRange);
      const dotVisibility = Math.max(0, 1 - easeInOutCubic(absorb)) * (scrollY > heroThreshold + heroRange ? 1 : heroFade);
      const dotScale = Math.max(0, 1 - Math.pow(absorb, 1.4) * 0.90);

      // Wordmark color clarity reaction:
      // Once particles enter into the letters, the wordmark SVG color clarifies and illuminates ("rangi tiniqlashsin")
      const wordmarkSvg = document.getElementById('makonsense-wordmark-svg');
      if (wordmarkSvg) {
        const dark = document.documentElement.classList.contains('dark');
        const baseOp = dark ? 0.44 : 0.28;
        wordmarkSvg.style.opacity = `${(baseOp + absorb * 0.36).toFixed(3)}`;
      }

      // Background layer (z-1): sits cleanly behind all section cards and text.
      // Elevates to z-25 only when assembling into the footer wordmark.
      if (wordmarkWeight > 0.05 && absorb < 0.98) {
        canvas.style.zIndex = '25';
      } else {
        canvas.style.zIndex = '1';
      }

      // Aspect-ratio aware scaling: wide letterform bounds for wordmark and map, spacious dot-matrix scale for archetypes
      const aIsWide = A.shape === 'wordmark' || A.shape === 'map' || A.shape === 'globe';
      const bIsWide = B.shape === 'wordmark' || B.shape === 'map' || B.shape === 'globe';
      const aRx = aIsWide ? A.width * 0.50 : A.size * 0.56;
      const aRy = aIsWide ? (A.shape === 'wordmark' ? A.height * 0.50 : A.width * 0.50) : A.size * 0.56;
      const bRx = bIsWide ? B.width * 0.50 : B.size * 0.56;
      const bRy = bIsWide ? (B.shape === 'wordmark' ? B.height * 0.50 : B.width * 0.50) : B.size * 0.56;
      const Rx = lerp(aRx, bRx, e);
      const Ry = lerp(aRy, bRy, e);
      const size = lerp(A.size, B.size, e);

      // Smooth flight glide along the right-hand visual corridor
      const flight = Math.sin(e * Math.PI); // 0 when locked on anchor, 1 mid-flight
      const cx = lerp(A.cx, B.cx, e);
      const cy = lerp(A.cy, B.cy, e);

      /* -------- intro assembly -------- */
      const intro = reduced ? 1 : easeOutCubic(clamp((now - start) / 1400));
      const scatter = flight * 0.22 + (1 - intro) * 0.9;
      const globalAlpha = clamp((now - start) / 600);

      // Smooth, gentle mouse tilt
      mouseX += (targetMouseX - mouseX) * (1 - Math.exp(-dt * 2.8));
      mouseY += (targetMouseY - mouseY) * (1 - Math.exp(-dt * 2.8));

      /* -------- Stable Isometric View (Clear, Precise & Recognizable) -------- */
      // Each archetype sits at its custom architectural angle from SHAPE_ANGLES:
      // completely solid and clear at rest, smoothly interpolating during scroll flight.
      const aAng = SHAPE_ANGLES[A.shape] || { yaw: 0, pitch: 0 };
      const bAng = SHAPE_ANGLES[B.shape] || { yaw: 0, pitch: 0 };
      const baseYaw = lerp(aAng.yaw, bAng.yaw, e);
      const basePitch = lerp(aAng.pitch, bAng.pitch, e);

      const isMap = (A.shape === 'map' || A.shape === 'globe') && e < 0.6;
      const yaw = baseYaw + mouseX * (isMap ? 0.02 : 0.04);
      const pitch = basePitch + mouseY * (isMap ? 0.02 : 0.03);

      const cY = Math.cos(yaw), sY = Math.sin(yaw);
      const cP = Math.cos(pitch), sP = Math.sin(pitch);
      const D = 3.6;

      // If dots are fully absorbed inside the wordmark, canvas is clear and nothing is drawn
      if (dotVisibility <= 0.001) return;

      for (let k = 0; k < N; k++) {
        const pa = fa.pts[k];
        const pb = fb.pts[k];
        const nz = noise[k];
        const x = lerp(pa[0], pb[0], e) + nz[0] * scatter;
        const y = lerp(pa[1], pb[1], e) + nz[1] * scatter;
        const z = lerp(pa[2], pb[2], e) + nz[2] * scatter;

        const x1 = x * cY + z * sY;
        const z1 = -x * sY + z * cY;
        const y2 = y * cP - z1 * sP;
        const z2 = y * sP + z1 * cP;

        // When locking onto wordmark, normalize perspective to 1.0 so dots never drift off letter strokes!
        const persp = lerp(D / (D - z2), 1.0, easeInOutCubic(wordmarkWeight));
        sx[k] = cx + x1 * persp * Rx;
        sy[k] = cy - y2 * persp * Ry;
        sz[k] = z2;
        sa[k] = lerp(fa.accent[k], fb.accent[k], e);
        sw[k] = lerp(fa.weight[k], fb.weight[k], e);
      }

      order.sort((i, j) => sz[i] - sz[j]);

      const dark = document.documentElement.classList.contains('dark');
      const base = dark ? [255, 255, 255] : [100, 116, 139]; // white in dark mode, slate in light mode
      const scale = clamp(size / 380, 0.85, 1.35);

      /* -------- Render Minimalist Crisp 3D Dots & Halos -------- */
      for (let n = 0; n < N; n++) {
        const k = order[n];
        const pw = sw[k];
        if (pw <= 0.005) continue;

        const depth = clamp((sz[k] + 1.4) / 2.8);
        const acc = sa[k];
        const isGreen = acc > 0.75;

        // Opacity modulated by minimalist active weight `pw`
        const alpha = (0.52 + wordmarkWeight * 0.15 + depth * 0.34 + (isGreen ? 0.22 : 0)) * globalAlpha * dotVisibility * pw;

        // Crisp minimalist dot radius (1.95px baseline, 3.05px for green beacon nodes)
        const rad = (1.95 + depth * 0.28 + (isGreen ? 1.10 : 0)) * scale * dotScale * (0.4 + 0.6 * pw);

        // Exact colors: green is #0E9F6E, white is pure white in dark mode or slate in light mode
        const r = isGreen ? ACCENT[0] : base[0];
        const g = isGreen ? ACCENT[1] : base[1];
        const bl = isGreen ? ACCENT[2] : base[2];

        // Refined emerald aura for green nodes (matching Hero map hub halos)
        if (isGreen && dotVisibility * pw > 0.08) {
          ctx.fillStyle = `rgba(14,159,110,${(0.24 + depth * 0.12) * alpha * dotVisibility})`;
          ctx.beginPath();
          ctx.arc(sx[k], sy[k], rad * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Clean crisp particle dot
        ctx.fillStyle = `rgba(${r},${g},${bl},${clamp(alpha)})`;
        ctx.beginPath();
        ctx.arc(sx[k], sy[k], rad, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="hidden lg:block fixed inset-0 z-[1] pointer-events-none"
    />
  );
};

export default MorphObject;
