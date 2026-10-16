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
  for (let i = 0; i < N; i++) {
    const k = i % pts.length;
    out.push(pts[k]);
    a.push(acc[k]);
  }
  return { pts: out, accent: a };
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
  // 3-Tier Isometric Geospatial Intelligence Stack:
  // - Layer 01 (Top, cy = +0.62): Piyodalar Tranziti (Isochrone diamond + internal transit corridor crosshairs)
  // - Layer 02 (Mid, cy =  0.00): Raqobat Tahlili (Isochrone diamond + 350m elliptical radar buffer ring)
  // - Layer 03 (Bot, cy = -0.62): Daromad Prognozi / 94.0 MakonScore (Triple-nested synthesis diamond)
  // Connected by a central vertical AI synthesis laser beam + side architectural alignment guides (300 pts, 14 beacons)
  const layers = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    const rx = 0.88;
    const ry = 0.22;

    const addDiamondRing = (
      cy: number,
      scale: number,
      nPerSide: number,
      z: number,
      beaconCorners = false
    ) => {
      const W = rx * scale;
      const H = ry * scale;
      const verts: Vec3[] = [
        [0, cy + H, z - 0.06],
        [W, cy, z],
        [0, cy - H, z + 0.06],
        [-W, cy, z],
      ];
      for (let k = 0; k < 4; k++) {
        const edge = segment(verts[k], verts[(k + 1) % 4], nPerSide).slice(0, -1);
        edge.forEach((p, idx) => {
          pts.push(p);
          const isCorner = beaconCorners && idx === 0;
          acc.push(isCorner ? 1.0 : 0.15);
        });
      }
    };

    // --- LAYER 01 (TOP, cy = +0.62): Piyodalar Tranziti (92 pts, 5 beacons) ---
    const cy1 = 0.62;
    addDiamondRing(cy1, 1.0, 14, 0.08, true); // 52 pts (4 corner beacons)
    addDiamondRing(cy1, 0.55, 7, 0.08, false); // 24 pts
    const axis1X = segment([-rx * 0.82, cy1, 0.08], [rx * 0.82, cy1, 0.08], 9);
    const axis1Y = segment([0, cy1 - ry * 0.75, 0.10], [0, cy1 + ry * 0.75, 0.06], 7);
    axis1X.forEach((p, i) => {
      pts.push(p);
      acc.push(i === 4 ? 1.0 : 0.15);
    });
    axis1Y.forEach((p) => {
      pts.push(p);
      acc.push(0.15);
    });

    // --- LAYER 02 (MIDDLE, cy = 0.00): Raqobat Tahlili (92 pts, 5 beacons) ---
    const cy2 = 0.0;
    const verts2: Vec3[] = [
      [0, cy2 + ry, -0.06],
      [rx, cy2, 0.0],
      [0, cy2 - ry, 0.06],
      [-rx, cy2, 0.0],
    ];
    for (let k = 0; k < 4; k++) {
      const edge = segment(verts2[k], verts2[(k + 1) % 4], 14).slice(0, -1);
      edge.forEach((p, idx) => {
        pts.push(p);
        acc.push((k === 1 || k === 3) && idx === 0 ? 1.0 : 0.15);
      });
    }
    // Elliptical 350m Competitor Buffer Radar Ring inside Layer 2: 28 pts
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2;
      pts.push([Math.cos(a) * (rx * 0.54), cy2 + Math.sin(a) * (ry * 0.54), 0.04]);
      acc.push(i === 5 || i === 19 ? 1.0 : 0.15);
    }
    const sweep2 = segment([-rx * 0.50, cy2, 0.04], [rx * 0.50, cy2, 0.04], 12);
    sweep2.forEach((p, i) => {
      pts.push(p);
      acc.push(i === 6 ? 1.0 : 0.15);
    });

    // --- LAYER 03 (BOTTOM, cy = -0.62): Daromad Prognozi / 94.0 MakonScore (92 pts, 2 beacons) ---
    const cy3 = -0.62;
    const verts3: Vec3[] = [
      [0, cy3 + ry, -0.10],
      [rx, cy3, -0.04],
      [0, cy3 - ry, 0.02],
      [-rx, cy3, -0.04],
    ];
    for (let k = 0; k < 4; k++) {
      const edge = segment(verts3[k], verts3[(k + 1) % 4], 14).slice(0, -1);
      edge.forEach((p, idx) => {
        pts.push(p);
        acc.push((k === 0 || k === 2) && idx === 0 ? 1.0 : 0.15);
      });
    }
    addDiamondRing(cy3, 0.60, 8, -0.02, false); // 28 pts
    addDiamondRing(cy3, 0.28, 4, 0.02, false);  // 12 pts

    // --- VERTICAL AI SYNTHESIS LASER SPINE & SIDE ALIGNMENT PILLARS (24 pts -> Total 300 pts, +2 = 14 beacons) ---
    const spine = segment([0, 0.94, 0.12], [0, -0.94, 0.12], 16);
    spine.forEach((p, i) => {
      pts.push(p);
      acc.push(i === 0 || i === 15 ? 1.0 : 0.15);
    });
    const leftGuide = segment([-rx, cy1, 0], [-rx, cy3, 0], 4);
    const rightGuide = segment([rx, cy1, 0], [rx, cy3, 0], 4);
    [...leftGuide, ...rightGuide].forEach((p) => {
      pts.push(p);
      acc.push(0.15);
    });

    return fill(pts, acc);
  })();

  // 3. ProblemSolution (cube): Broad Noble Heraldic Shield + Bold 3-Layer Checkmark (94.2% Protected Investment)
  // Double-rimmed architectural shield + bold 3-layer verification checkmark (300 pts, 14 emerald beacons)
  const cube = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    const shieldPoint = (t: number, side: number, scale = 1.0, z = 0): Vec3 => {
      if (t <= 0.22) {
        const u = t / 0.22;
        const x = side * (u * 0.84) * scale;
        const y = (0.92 - Math.sin(u * Math.PI * 0.5) * 0.16) * scale;
        return [x, y, z];
      } else {
        const u = (t - 0.22) / 0.78;
        const x = side * 0.84 * Math.pow(1 - Math.pow(u, 1.55), 0.62) * scale;
        const y = (0.76 - u * 1.66) * scale;
        return [x, y, z];
      }
    };

    // Outer shield perimeter: left (56 pts) + right (54 pts) = 110 pts
    for (let i = 0; i < 56; i++) {
      const t = i / 55;
      pts.push(shieldPoint(t, -1, 1.0, 0.08));
      const isBeacon = i === 0 || i === 12 || i === 32 || i === 55;
      acc.push(isBeacon ? 1.0 : 0.15);
    }
    for (let i = 1; i < 55; i++) {
      const t = i / 55;
      pts.push(shieldPoint(t, 1, 1.0, 0.08));
      const isBeacon = i === 12 || i === 32;
      acc.push(isBeacon ? 1.0 : 0.15);
    }

    // Inner shield frame (scale = 0.83): left (44 pts) + right (42 pts) = 86 pts
    for (let i = 0; i < 44; i++) {
      const t = i / 43;
      pts.push(shieldPoint(t, -1, 0.83, -0.04));
      const isBeacon = i === 0 || i === 43;
      acc.push(isBeacon ? 1.0 : 0.15);
    }
    for (let i = 1; i < 43; i++) {
      const t = i / 43;
      pts.push(shieldPoint(t, 1, 0.83, -0.04));
      acc.push(0.15);
    }

    // Bold 3-layer Checkmark (✓) centered in the broad chest of the shield: 104 pts (196 + 104 = 300 pts)
    const offsets = [-0.052, 0.0, 0.052];
    offsets.forEach((off, oIdx) => {
      const pStart: Vec3 = [-0.36, 0.04 + off, 0.14];
      const pKnee: Vec3 = [-0.08, -0.26 + off, 0.16];
      const pEnd: Vec3 = [0.44, 0.36 + off, 0.14];

      const leg1Count = oIdx === 1 ? 14 : 13;
      const leg2Count = oIdx === 1 ? 22 : 21;
      const leg1 = segment(pStart, pKnee, leg1Count);
      const leg2 = segment(pKnee, pEnd, leg2Count);

      leg1.forEach((p, idx) => {
        pts.push(p);
        const isB = oIdx === 1 && (idx === 0 || idx === 7 || idx === leg1Count - 1);
        acc.push(isB ? 1.0 : 0.15);
      });
      leg2.forEach((p, idx) => {
        pts.push(p);
        const isB = oIdx === 1 && (idx === 7 || idx === 14 || idx === leg2Count - 1);
        acc.push(isB ? 1.0 : 0.15);
      });
    });

    return fill(pts, acc);
  })();

  // 4. LocationCompareSection (towers): Architectural A/B Comparison Monolith Towers
  // Tall Winner Tower A (Amir Temur 94.0 with stepped crown & spire) vs Shorter Tower B (Chilonzor 62.3) + Curved Advantage Vector
  const towers = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    // Ground foundation baseline: 28 pts
    const baseLine = segment([-0.94, -0.84, 0], [0.94, -0.84, 0], 28);
    baseLine.forEach((p, i) => {
      pts.push(p);
      acc.push(i === 0 || i === 27 ? 1.0 : 0.15);
    });

    // --- LEFT TOWER A (Winner: Amir Temur 94.0, x in [-0.76, -0.18], y in [-0.84, +0.66]) ---
    const xA1 = -0.76, xA2 = -0.18, yB = -0.84, yA = 0.66;
    const wallAL = segment([xA1, yB, 0.06], [xA1, yA, 0.06], 24);
    const wallAR = segment([xA2, yB, 0.06], [xA2, yA, 0.06], 24);
    wallAL.forEach((p, i) => {
      pts.push(p);
      acc.push(i === 23 ? 1.0 : 0.15);
    });
    wallAR.forEach((p, i) => {
      pts.push(p);
      acc.push(i === 23 ? 1.0 : 0.15);
    });

    // 9 Horizontal architectural floor bands inside Tower A (9 * 7 = 63 pts)
    for (let f = 1; f <= 9; f++) {
      const yf = yB + (f / 9) * (yA - yB);
      const row = segment([xA1 + 0.06, yf, 0.04], [xA2 - 0.06, yf, 0.04], 7);
      row.forEach((p, idx) => {
        pts.push(p);
        const isB = (f === 9 || f === 5) && idx === 3;
        acc.push(isB ? 1.0 : 0.15);
      });
    }

    // Stepped Crown & Spire on Tower A (21 pts)
    const crownTop = segment([-0.64, 0.78, 0.08], [-0.30, 0.78, 0.08], 7);
    const crownL = segment([-0.64, 0.66, 0.08], [-0.64, 0.78, 0.08], 3);
    const crownR = segment([-0.30, 0.66, 0.08], [-0.30, 0.78, 0.08], 3);
    const spire = segment([-0.47, 0.78, 0.10], [-0.47, 1.04, 0.12], 8);
    [...crownTop, ...crownL, ...crownR].forEach((p) => {
      pts.push(p);
      acc.push(0.15);
    });
    spire.forEach((p, i) => {
      pts.push(p);
      acc.push(i === 7 || i === 0 ? 1.0 : 0.15);
    });

    // --- RIGHT TOWER B (Chilonzor 62.3, x in [0.18, 0.76], y in [-0.84, +0.02]) ---
    const xB1 = 0.18, xB2 = 0.76, yTopB = 0.02;
    const wallBL = segment([xB1, yB, -0.04], [xB1, yTopB, -0.04], 16);
    const wallBR = segment([xB2, yB, -0.04], [xB2, yTopB, -0.04], 16);
    [...wallBL, ...wallBR].forEach((p) => {
      pts.push(p);
      acc.push(0.15);
    });

    // 6 Horizontal floor bands inside Tower B (6 * 7 = 42 pts)
    for (let f = 1; f <= 6; f++) {
      const yf = yB + (f / 6) * (yTopB - yB);
      const row = segment([xB1 + 0.06, yf, -0.04], [xB2 - 0.06, yf, -0.04], 7);
      row.forEach((p, idx) => {
        pts.push(p);
        acc.push(f === 6 && idx === 3 ? 1.0 : 0.15);
      });
    }

    // --- COMPARISON BRIDGES & CRISP CURVED ADVANTAGE TRAJECTORY (66 pts -> Total 300 pts) ---
    const bridge1 = segment([-0.18, -0.22, 0.02], [0.18, -0.22, 0.02], 9);
    const bridge2 = segment([-0.18, -0.46, 0.02], [0.18, -0.46, 0.02], 9);
    [...bridge1, ...bridge2].forEach((p, i) => {
      pts.push(p);
      acc.push(i === 4 || i === 13 ? 1.0 : 0.15);
    });

    for (let i = 0; i < 32; i++) {
      const t = i / 31;
      const x = 0.47 - t * 0.65;
      const y = 0.18 + Math.pow(t, 0.82) * 0.72;
      pts.push([x, y, 0.12]);
      acc.push(i === 0 || i === 16 || i === 31 ? 1.0 : 0.15);
    }

    const arrowL = segment([-0.18, 0.90, 0.12], [-0.15, 0.66, 0.12], 8);
    const arrowR = segment([-0.18, 0.90, 0.12], [0.06, 0.88, 0.12], 8);
    [...arrowL, ...arrowR].forEach((p) => {
      pts.push(p);
      acc.push(0.15);
    });

    return fill(pts, acc);
  })();

  // 5. HowItWorks (steps): Exact Tangent Teardrop Map Pin (📍) + 3 Concentric Isochrone Radius Rings
  // Directly visualizes: 01 Xaritadan nuqta belgilang -> 02 Toifa va radiusni tanlang (300m-1km) -> 03 MakonScore
  const steps = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    const cyPin = 0.42;
    const rPin = 0.40;
    const tipY = -0.36;

    const buildPinContour = (scale: number, nArc: number, nLeg: number, z: number): Vec3[] => {
      const out: Vec3[] = [];
      const r = rPin * scale;
      const yT = cyPin - (cyPin - tipY) * scale;
      const aStart = (-30 * Math.PI) / 180;
      const aEnd = (210 * Math.PI) / 180;
      for (let i = 0; i < nArc; i++) {
        const t = i / (nArc - 1);
        const a = aStart + t * (aEnd - aStart);
        out.push([Math.cos(a) * r, cyPin + Math.sin(a) * r, z]);
      }
      const pLeft: Vec3 = [Math.cos(aEnd) * r, cyPin + Math.sin(aEnd) * r, z];
      const pRight: Vec3 = [Math.cos(aStart) * r, cyPin + Math.sin(aStart) * r, z];
      const pTip: Vec3 = [0, yT, z];
      const leftLeg = segment(pLeft, pTip, nLeg).slice(1);
      const rightLeg = segment(pTip, pRight, nLeg).slice(1, -1);
      return [...out, ...leftLeg, ...rightLeg];
    };

    // Outer Pin Contour: 83 pts (4 beacons)
    const outerPin = buildPinContour(1.0, 42, 22, 0.12);
    outerPin.forEach((p, i) => {
      pts.push(p);
      const isB = i === 0 || i === 21 || i === 41 || i === 62;
      acc.push(isB ? 1.0 : 0.15);
    });

    // Inner Pin Contour: 61 pts
    const innerPin = buildPinContour(0.84, 32, 16, 0.08);
    innerPin.forEach((p) => {
      pts.push(p);
      acc.push(0.15);
    });

    // Inner Donut Circle inside the Map Pin head + center bullseye beacon: 29 pts (5 beacons)
    pts.push([0, cyPin, 0.16]);
    acc.push(1.0);
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2;
      pts.push([Math.cos(a) * 0.17, cyPin + Math.sin(a) * 0.17, 0.14]);
      acc.push(i % 7 === 0 ? 1.0 : 0.15);
    }

    // 3 Concentric Perspective Isochrone Radius Rings (300m, 500m, 1km) around the pinpoint target (127 pts -> Total 300 pts)
    const targetY = -0.44;
    const rings = [
      { rx: 0.38, ry: 0.15, n: 29, z: 0.02, beacons: [0, 14] },
      { rx: 0.68, ry: 0.27, n: 42, z: -0.04, beacons: [0, 21] },
      { rx: 0.98, ry: 0.39, n: 56, z: -0.10, beacons: [0] },
    ];
    rings.forEach((rg) => {
      for (let i = 0; i < rg.n; i++) {
        const a = (i / rg.n) * Math.PI * 2;
        const x = Math.cos(a) * rg.rx;
        const y = targetY + Math.sin(a) * rg.ry;
        const z = rg.z + Math.sin(a) * 0.08;
        pts.push([x, y, z]);
        acc.push(rg.beacons.includes(i) ? 1.0 : 0.15);
      }
    });

    return fill(pts, acc);
  })();

  // 6. IndustrySolutions (clusters): Central Hexagonal AI Core + 4 Distinct Quadrant Sector Hexagons
  // Directly visualizes: Central AI Hub + 4 Distinct Business Sectors (HoReCa, Retail, Dorixona, Ko'chmas Mulk)
  const clusters = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    const addHexHub = (
      cx: number,
      cy: number,
      cz: number,
      rOuter: number,
      nSideOuter: number,
      nSideInner: number,
      extraCenterBeacons = false
    ) => {
      pts.push([cx, cy, cz + 0.06]);
      acc.push(1.0);

      const vertsO: Vec3[] = [];
      const vertsI: Vec3[] = [];
      for (let k = 0; k < 6; k++) {
        const a = (k * Math.PI) / 3 + Math.PI / 6;
        vertsO.push([cx + Math.cos(a) * rOuter, cy + Math.sin(a) * rOuter, cz]);
        vertsI.push([
          cx + Math.cos(a) * (rOuter * 0.56),
          cy + Math.sin(a) * (rOuter * 0.56),
          cz + 0.03,
        ]);
      }
      for (let k = 0; k < 6; k++) {
        const edge = segment(vertsO[k], vertsO[(k + 1) % 6], nSideOuter).slice(0, -1);
        edge.forEach((p, idx) => {
          pts.push(p);
          acc.push(extraCenterBeacons && idx === 0 && k < 4 ? 1.0 : 0.15);
        });
      }
      for (let k = 0; k < 6; k++) {
        const edge = segment(vertsI[k], vertsI[(k + 1) % 6], nSideInner).slice(0, -1);
        edge.forEach((p) => {
          pts.push(p);
          acc.push(0.15);
        });
      }
    };

    // 1. Central Command Hexagon at (0, 0): 61 pts (5 beacons)
    addHexHub(0, 0, 0.10, 0.34, 7, 5, true);

    // 2. 4 Sector Satellite Hexagons well-separated in the 4 quadrants: 196 pts (4 beacons)
    const sectors: Vec3[] = [
      [-0.66, 0.58, 0.02],  // HoReCa
      [0.66, 0.58, 0.02],   // Retail
      [-0.66, -0.58, 0.02], // Dorixona
      [0.66, -0.58, 0.02],  // Ko'chmas Mulk
    ];
    sectors.forEach(([sx, sy, sz]) => {
      addHexHub(sx, sy, sz, 0.25, 6, 4, false);
    });

    // 3. 4 Radial Laser Bridges from Central Hub to the 4 Sector Hubs: 43 pts -> Total 300 pts (5 beacons)
    sectors.forEach(([sx, sy], sIdx) => {
      const p1: Vec3 = [sx * 0.38, sy * 0.38, 0.08];
      const p2: Vec3 = [sx * 0.72, sy * 0.72, 0.04];
      const nPts = sIdx < 3 ? 11 : 10;
      const bridge = segment(p1, p2, nPts);
      bridge.forEach((p, idx) => {
        pts.push(p);
        acc.push(idx === 5 || (sIdx === 0 && idx === 0) ? 1.0 : 0.15);
      });
    });

    return fill(pts, acc);
  })();

  // 7. RoiCalculator (bars): 4 Crisp Ascending Financial Columns + High-Clearance Breakout Trend Arrow (📈)
  // Directly visualizes: Sarmoyangizni hisoblang — ROI Kalkulyatori & Capital Protection Growth
  const bars = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    // Horizontal X-Axis baseline at y = -0.84: 32 pts (2 beacons)
    const baseAxis = segment([-0.92, -0.84, 0], [0.92, -0.84, 0], 32);
    baseAxis.forEach((p, i) => {
      pts.push(p);
      acc.push(i === 0 || i === 31 ? 1.0 : 0.15);
    });

    // 4 Ascending Rectangular Columns (kept below y = +0.46 so the trend arrow soars cleanly above!): 224 pts (6 beacons)
    const barsCfg = [
      { x1: -0.78, x2: -0.50, yTop: -0.46, nSide: 10, nFillRows: 3 },
      { x1: -0.34, x2: -0.06, yTop: -0.16, nSide: 14, nFillRows: 5 },
      { x1: 0.10, x2: 0.38, yTop: 0.14, nSide: 18, nFillRows: 7 },
      { x1: 0.54, x2: 0.82, yTop: 0.46, nSide: 22, nFillRows: 9 },
    ];
    barsCfg.forEach((b, bIdx) => {
      const leftW = segment([b.x1, -0.84, 0.04], [b.x1, b.yTop, 0.04], b.nSide);
      const rightW = segment([b.x2, -0.84, 0.04], [b.x2, b.yTop, 0.04], b.nSide);
      const topCap = segment([b.x1, b.yTop, 0.06], [b.x2, b.yTop, 0.06], 6);

      leftW.forEach((p, i) => {
        pts.push(p);
        acc.push(bIdx === 3 && i === b.nSide - 1 ? 1.0 : 0.15);
      });
      rightW.forEach((p, i) => {
        pts.push(p);
        acc.push(bIdx === 3 && i === b.nSide - 1 ? 1.0 : 0.15);
      });
      topCap.forEach((p, i) => {
        pts.push(p);
        acc.push(i === 2 ? 1.0 : 0.15);
      });

      for (let r = 1; r <= b.nFillRows; r++) {
        const yr = -0.84 + (r / (b.nFillRows + 1)) * (b.yTop - -0.84);
        const row = segment([b.x1 + 0.06, yr, 0.02], [b.x2 - 0.06, yr, 0.02], 3);
        row.forEach((p) => {
          pts.push(p);
          acc.push(0.15);
        });
      }
    });

    // High-Clearance Breakout Trend Curve + Arrowhead at (+0.74, +0.94): 44 pts -> Total 300 pts (6 beacons)
    for (let i = 0; i < 28; i++) {
      const t = i / 27;
      const x = -0.76 + t * 1.50;
      const y = -0.18 + Math.pow(t, 1.12) * 1.12;
      pts.push([x, y, 0.14]);
      const isB = i === 0 || i === 9 || i === 18 || i === 27;
      acc.push(isB ? 1.0 : 0.15);
    }

    const wingL = segment([0.74, 0.94, 0.16], [0.46, 0.90, 0.16], 8);
    const wingR = segment([0.74, 0.94, 0.16], [0.70, 0.66, 0.16], 8);
    wingL.forEach((p, i) => {
      pts.push(p);
      acc.push(i === 7 ? 1.0 : 0.15);
    });
    wingR.forEach((p, i) => {
      pts.push(p);
      acc.push(i === 7 ? 1.0 : 0.15);
    });

    return fill(pts, acc);
  })();

  // 8. FaqSection (ring): Sculptural Question Mark (?) Emblem + 6-Node Knowledge Halo Ring
  // Directly visualizes: Ko'p so'raladigan savollar (6 FAQs)
  const ring = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    // 1. Outer Knowledge Halo Ring (r = 1.04) with 6 emerald beacons for the 6 FAQs: 84 pts (6 beacons)
    for (let i = 0; i < 84; i++) {
      const a = (i / 84) * Math.PI * 2;
      pts.push([Math.cos(a) * 1.04, Math.sin(a) * 1.04, -0.06]);
      acc.push(i % 14 === 0 ? 1.0 : 0.15);
    }

    // 2. Sculptural 3-Ribbon Question Mark (?) in the center: 186 pts (6 beacons)
    const questionCurve = (t: number, offset: number): Vec3 => {
      if (t <= 0.62) {
        const u = t / 0.62;
        const a = (165 - u * 210) * (Math.PI / 180);
        const r = 0.38 + offset;
        const cx = 0.0, cy = 0.34;
        return [cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0.10];
      } else if (t <= 0.82) {
        const u = (t - 0.62) / 0.20;
        const aStart = (-45 * Math.PI) / 180;
        const r = 0.38 + offset;
        const x0 = Math.cos(aStart) * r;
        const y0 = 0.34 + Math.sin(aStart) * r;
        const x1 = offset;
        const y1 = -0.06;
        const ease = u * u * (3 - 2 * u);
        return [x0 + (x1 - x0) * ease, y0 + (y1 - y0) * ease, 0.12];
      } else {
        const u = (t - 0.82) / 0.18;
        return [offset, -0.06 - u * 0.26, 0.12];
      }
    };

    const qOffsets = [-0.065, 0.0, 0.065];
    qOffsets.forEach((off, oIdx) => {
      for (let i = 0; i < 62; i++) {
        const t = i / 61;
        pts.push(questionCurve(t, off));
        const isB =
          oIdx === 1 && (i === 0 || i === 15 || i === 30 || i === 44 || i === 53 || i === 61);
        acc.push(isB ? 1.0 : 0.15);
      }
    });

    // 3. The Question Mark Bottom Dot at (0, -0.60): 30 pts -> Total 300 pts (2 beacons)
    const dotY = -0.60;
    pts.push([0, dotY, 0.16]);
    acc.push(1.0);
    for (let i = 0; i < 11; i++) {
      const a = (i / 11) * Math.PI * 2;
      pts.push([Math.cos(a) * 0.055, dotY + Math.sin(a) * 0.055, 0.15]);
      acc.push(i === 0 ? 1.0 : 0.15);
    }
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      pts.push([Math.cos(a) * 0.105, dotY + Math.sin(a) * 0.105, 0.14]);
      acc.push(0.15);
    }

    return fill(pts, acc);
  })();

  // 9. LandingFooter: Illuminated 10-Letter MakonSense Wordmark
  const wordmark: Formation = {
    pts: WORDMARK_PTS,
    accent: WORDMARK_ACCENT,
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

      // Aspect-ratio aware scaling: wide letterform bounds for wordmark and map, enlarged 3D presence for archetypes
      const aIsWide = A.shape === 'wordmark' || A.shape === 'map' || A.shape === 'globe';
      const bIsWide = B.shape === 'wordmark' || B.shape === 'map' || B.shape === 'globe';
      const aRx = aIsWide ? A.width * 0.50 : A.size * 0.52;
      const aRy = aIsWide ? (A.shape === 'wordmark' ? A.height * 0.50 : A.width * 0.50) : A.size * 0.52;
      const bRx = bIsWide ? B.width * 0.50 : B.size * 0.52;
      const bRy = bIsWide ? (B.shape === 'wordmark' ? B.height * 0.50 : B.width * 0.50) : B.size * 0.52;
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
      }

      order.sort((i, j) => sz[i] - sz[j]);

      const dark = document.documentElement.classList.contains('dark');
      const base = dark ? [255, 255, 255] : [100, 116, 139]; // white in dark mode, slate in light mode
      const scale = clamp(size / 380, 0.85, 1.35);

      /* -------- Render Solid Crisp 3D Dots & Halos (Matching Hero Map) -------- */
      for (let n = 0; n < N; n++) {
        const k = order[n];
        const depth = clamp((sz[k] + 1.4) / 2.8);
        const acc = sa[k];
        const isGreen = acc > 0.75;

        // Opacity matching Uzbekistan map (0.42 to 0.82)
        const alpha = (0.46 + wordmarkWeight * 0.15 + depth * 0.36 + (isGreen ? 0.20 : 0)) * globalAlpha * dotVisibility;

        // Exact radius matching Hero Map (1.85px baseline, 2.9px for green beacon nodes)
        const rad = (1.85 + depth * 0.30 + (isGreen ? 1.05 : 0)) * scale * dotScale;

        // Exact colors: green is #0E9F6E, white is pure white in dark mode or slate in light mode
        const r = isGreen ? ACCENT[0] : base[0];
        const g = isGreen ? ACCENT[1] : base[1];
        const bl = isGreen ? ACCENT[2] : base[2];

        // Refined emerald aura for green nodes (matching Hero map hub halos)
        if (isGreen && dotVisibility > 0.08) {
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
