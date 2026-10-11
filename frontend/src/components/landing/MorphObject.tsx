import React, { useEffect, useRef } from 'react';
import { WORDMARK_PTS, WORDMARK_ACCENT } from './wordmarkPoints';

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

/* --------------------------- formations --------------------------- */
/* Hero: Pure Round Sphere without outer ring ("dumaloq ringsiz")     */
/* --------------------------- formations --------------------------- */
/* 8 Completely Distinct, Signature 3D Archetypes Tailored to Each Section:
   1. Hero (globe)           -> Grand Geodesic Fibonacci Spatial Sphere with Tashkent Beacon
   2. ScrollExperience (layers) -> 3 Floating Geospatial Strata / Disc Decks with Vertical Laser Links
   3. ProblemSolution (cube)  -> 3D Isometric Tesseract / Hypercube with Inner Glowing Core
   4. LocationCompare (towers)-> Dual Comparative Monolith Towers Side-by-Side with Analytical Bridge
   5. HowItWorks (steps)      -> Ascending 3-Tier Spiral Helix Platform (Step 01 -> Step 02 -> Step 03)
   6. IndustrySolutions (clusters)-> Multi-Satellite Constellation Network (Central Hub + 4 Orbital Pods)
   7. RoiCalculator (bars)    -> 3D Exponential Financial Bar Matrix with Curved Parabolic Growth Arc
   8. FaqSection (ring)       -> Tri-Axial Precision Gyroscope / Armillary Sphere with Diamond Center
   9. Footer (wordmark)       -> Illuminated 10-Letter MakonSense Wordmark
*/

const buildFormations = (): Record<MorphShape, Formation> => {
  // 1. Hero: Grand Geodesic Fibonacci Spatial Sphere (Mukammal Dumaloq Shar)
  const globe = (() => {
    const pts = fibSphere(N, 1.08);
    const acc = pts.map((p) => {
      // Beacon at Tashkent coordinates (~41.31° N, ~69.28° E)
      if (p[1] > 0.55 && p[0] > 0.25) return 0.95;
      // Glowing equatorial ring band
      if (Math.abs(p[1]) < 0.08) return 0.60;
      return 0.10;
    });
    return fill(pts, acc);
  })();

  // 2. ScrollExperience: 3 Floating Geospatial Strata / Disc Decks (3 Ta Mustaqil Qatlam Disk)
  // 3 distinct horizontal spatial map strata stacked in 3D:
  // Layer 1 (Bottom, Transit): y = -0.75, radius = 1.15 disc with grid
  // Layer 2 (Middle, Radar/Buffer): y = 0.0, radius = 0.95 disc with radial spokes
  // Layer 3 (Top, MakonScore/Revenue): y = +0.75, radius = 0.75 disc with glowing beacon
  const layers = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    // Layer 1 (Bottom, Transit): y = -0.75
    const r1 = 1.15;
    const ring1Outer = circleRing(r1, -0.75, 42);
    const ring1Inner = circleRing(r1 * 0.55, -0.75, 26);
    pts.push(...ring1Outer, ...ring1Inner);
    acc.push(...ring1Outer.map(() => 0.15), ...ring1Inner.map(() => 0.35));

    // Layer 2 (Middle, Buffer): y = 0.0
    const r2 = 0.95;
    const ring2Outer = circleRing(r2, 0.0, 36);
    const ring2Inner = circleRing(r2 * 0.50, 0.0, 22);
    pts.push(...ring2Outer, ...ring2Inner);
    acc.push(...ring2Outer.map(() => 0.40), ...ring2Inner.map(() => 0.65));

    // Layer 3 (Top, Revenue/Score): y = +0.75
    const r3 = 0.75;
    const ring3Outer = circleRing(r3, 0.75, 30);
    const ring3Inner = circleRing(r3 * 0.45, 0.75, 18);
    pts.push(...ring3Outer, ...ring3Inner);
    acc.push(...ring3Outer.map(() => 0.75), ...ring3Inner.map(() => 0.95));

    // Pinnacle apex beacon on top of Layer 3
    const apexPin = segment([0, 0.75, 0], [0, 1.15, 0], 8);
    pts.push(...apexPin);
    acc.push(...apexPin.map((p) => (p[1] > 1.05 ? 0.98 : 0.6)));

    // 4 vertical laser pillars connecting the 3 strata
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const x = Math.cos(a) * 0.55;
      const z = Math.sin(a) * 0.55;
      const vBeam = segment([x, -0.75, z], [x, 0.75, z], 14);
      pts.push(...vBeam);
      acc.push(...vBeam.map(() => 0.25));
    }

    return fill(pts, acc);
  })();

  // 3. ProblemSolution: 3D Isometric Tesseract / Hypercube (Hajmdor 3D Kub va Ichki Yadrosi)
  // An unmistakable 3D wireframe hypercube: outer cube (size = 1.6) with an inner glowing core cube (size = 0.8)
  const cube = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    const S = 0.82; // half-size of outer cube
    const s = 0.40; // half-size of inner cube

    // 8 outer vertices
    const outerVerts: Vec3[] = [
      [-S, -S, -S], [S, -S, -S], [S, S, -S], [-S, S, -S],
      [-S, -S, S], [S, -S, S], [S, S, S], [-S, S, S],
    ];

    // 8 inner vertices
    const innerVerts: Vec3[] = [
      [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
      [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s],
    ];

    // 12 edges for a cube:
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // bottom/back ring
      [4, 5], [5, 6], [6, 7], [7, 4], // top/front ring
      [0, 4], [1, 5], [2, 6], [3, 7], // connectors
    ];

    // Build outer cube edges
    edges.forEach(([i, j]) => {
      const e = segment(outerVerts[i], outerVerts[j], 10);
      pts.push(...e);
      acc.push(...e.map(() => 0.15));
    });

    // Build inner cube edges
    edges.forEach(([i, j]) => {
      const e = segment(innerVerts[i], innerVerts[j], 7);
      pts.push(...e);
      acc.push(...e.map(() => 0.75));
    });

    // 8 diagonal hypercube rays connecting outer vertices to inner vertices
    for (let k = 0; k < 8; k++) {
      const ray = segment(outerVerts[k], innerVerts[k], 7);
      pts.push(...ray);
      acc.push(...ray.map((_, idx) => (idx === ray.length - 1 ? 0.95 : 0.35)));
    }

    // Glowing core center node
    pts.push([0, 0, 0]);
    acc.push(0.98);

    return fill(pts, acc);
  })();

  // 4. LocationCompareSection: Dual Side-by-Side Comparison Monoliths (Yonma-Yon Taqqoslash Minoralari)
  // Two distinct columns standing side-by-side:
  // Tower A (Winner, left at X = -0.55): Tall, full height Y in [-0.95, +1.0], crowned with pyramid apex
  // Tower B (Competitor, right at X = +0.55): Shorter, height Y in [-0.95, +0.3]
  // Joined by a glowing analytical bridge arc at mid-height
  const towers = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    // --- Tower A (Winner: Amir Temur, X = -0.55) ---
    const cxA = -0.55;
    const rA = 0.36;
    // 6 horizontal rings along Tower A
    const numRingsA = 7;
    for (let i = 0; i < numRingsA; i++) {
      const t = i / (numRingsA - 1);
      const y = -0.95 + t * 1.90;
      const ring = circleRing(rA, y, 22, cxA, 0);
      pts.push(...ring);
      acc.push(...ring.map(() => (t > 0.8 ? 0.85 : 0.25)));
    }
    // 4 vertical flutes for Tower A
    for (let c = 0; c < 4; c++) {
      const a = (c / 4) * Math.PI * 2;
      const px = cxA + Math.cos(a) * rA;
      const pz = Math.sin(a) * rA;
      const vLine = segment([px, -0.95, pz], [px, 0.95, pz], 14);
      pts.push(...vLine);
      acc.push(...vLine.map((_, idx) => (idx === vLine.length - 1 ? 0.95 : 0.2)));
    }
    // Apex crown needle on Tower A
    const apexA: Vec3 = [cxA, 1.25, 0];
    for (let c = 0; c < 4; c++) {
      const a = (c / 4) * Math.PI * 2;
      const cap = segment([cxA + Math.cos(a) * rA, 0.95, Math.sin(a) * rA], apexA, 6);
      pts.push(...cap);
      acc.push(...cap.map(() => 0.95));
    }

    // --- Tower B (Competitor: Chilonzor, X = +0.55) ---
    const cxB = 0.55;
    const rB = 0.36;
    // 4 horizontal rings along Tower B (shorter height, up to Y = 0.30)
    const numRingsB = 4;
    for (let i = 0; i < numRingsB; i++) {
      const t = i / (numRingsB - 1);
      const y = -0.95 + t * 1.25;
      const ring = circleRing(rB, y, 20, cxB, 0);
      pts.push(...ring);
      acc.push(...ring.map(() => 0.12));
    }
    // 4 vertical flutes for Tower B
    for (let c = 0; c < 4; c++) {
      const a = (c / 4) * Math.PI * 2;
      const px = cxB + Math.cos(a) * rB;
      const pz = Math.sin(a) * rB;
      const vLine = segment([px, -0.95, pz], [px, 0.30, pz], 10);
      pts.push(...vLine);
      acc.push(...vLine.map(() => 0.12));
    }

    // --- Dynamic Analytical Comparison Bridge connecting Tower A and Tower B ---
    [-0.20, 0.15].forEach((yBridge) => {
      const bridge = segment([cxA + rA, yBridge, 0], [cxB - rB, yBridge, 0], 12);
      pts.push(...bridge);
      acc.push(...bridge.map(() => 0.85));
    });

    return fill(pts, acc);
  })();

  // 5. HowItWorks: Ascending 3-Tier Spiral Helix Platform (3 Bosqichli Spiral Zinapoya)
  // 3 distinct ascending circular landing pads arranged in a rising corkscrew (Step 1 -> Step 2 -> Step 3)
  const steps = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    const padConfigs = [
      { cx: -0.58, cy: -0.68, cz: -0.25, r: 0.44, accBase: 0.20 }, // Step 01
      { cx: 0.48, cy: -0.05, cz: -0.15, r: 0.44, accBase: 0.50 },  // Step 02
      { cx: -0.08, cy: 0.65, cz: 0.38, r: 0.44, accBase: 0.90 },   // Step 03 (Summit)
    ];

    padConfigs.forEach((cfg) => {
      const outer = circleRing(cfg.r, cfg.cy, 26, cfg.cx, cfg.cz);
      const inner = circleRing(cfg.r * 0.45, cfg.cy, 16, cfg.cx, cfg.cz);
      pts.push(...outer, ...inner);
      acc.push(
        ...outer.map(() => cfg.accBase),
        ...inner.map(() => Math.min(0.98, cfg.accBase + 0.2))
      );
      // Support pillar dropping down
      const pillar = segment([cfg.cx, cfg.cy, cfg.cz], [cfg.cx, -1.05, cfg.cz], 10);
      pts.push(...pillar);
      acc.push(...pillar.map(() => 0.15));
    });

    // Sweeping ascending spiral helix ribbon running through the 3 pads
    for (let i = 0; i < 70; i++) {
      const t = i / 69;
      const angle = -Math.PI * 1.2 + t * Math.PI * 2.8;
      const radHelix = 0.78;
      const y = -0.85 + t * 1.70;
      pts.push([Math.cos(angle) * radHelix, y, Math.sin(angle) * radHelix]);
      acc.push(t > 0.85 ? 0.95 : 0.30);
    }

    return fill(pts, acc);
  })();

  // 6. IndustrySolutions: Multi-Satellite Constellation Network (Markaziy Hub va 4 Ta Sputnik)
  // Central urban intelligence hub with 4 satellite cluster pods at 90° intervals connected by orbital links
  const clusters = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    // Central core hub
    const centerPts = fibSphere(42, 0.40);
    pts.push(...centerPts);
    acc.push(...centerPts.map(() => 0.85));

    // 4 Satellite cluster pods (HoReCa, Retail, Dorixona, Mulk)
    const satellites = [
      { pos: [0.95, 0.35, 0.0] as Vec3, r: 0.24, name: 'HoReCa' },
      { pos: [0.0, -0.40, 0.95] as Vec3, r: 0.24, name: 'Retail' },
      { pos: [-0.95, 0.28, 0.0] as Vec3, r: 0.24, name: 'Dorixona' },
      { pos: [0.0, 0.42, -0.95] as Vec3, r: 0.24, name: 'Mulk' },
    ];

    satellites.forEach((sat) => {
      const satRing1 = circleRing(sat.r, sat.pos[1], 18, sat.pos[0], sat.pos[2]);
      const satRing2: Vec3[] = [];
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        satRing2.push([sat.pos[0], sat.pos[1] + Math.sin(a) * sat.r, sat.pos[2] + Math.cos(a) * sat.r]);
      }
      pts.push(...satRing1, ...satRing2);
      acc.push(...satRing1.map(() => 0.70), ...satRing2.map(() => 0.50));

      // Laser connector ray from central hub to satellite
      const beam = segment([0, 0, 0], sat.pos, 10);
      pts.push(...beam);
      acc.push(...beam.map(() => 0.35));
    });

    // 2 Large tilted orbital rings wrapping around the whole network
    const orbit1: Vec3[] = [];
    const orbit2: Vec3[] = [];
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2;
      const ro = 1.10;
      orbit1.push([Math.cos(a) * ro, Math.sin(a) * 0.35, Math.sin(a) * ro]);
      orbit2.push([Math.sin(a) * ro, -Math.sin(a) * 0.35, Math.cos(a) * ro]);
    }
    pts.push(...orbit1, ...orbit2);
    acc.push(...orbit1.map(() => 0.25), ...orbit2.map(() => 0.25));

    return fill(pts, acc);
  })();

  // 7. RoiCalculator: 3D Exponential Financial Bar Matrix (3D O'suvchi Moliyaviy Diagramma)
  // 4 progressive 3D bar columns arranged left-to-right on an exponential curve with a glowing trendline
  const bars = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    const barConfigs = [
      { x: -0.78, yTop: -0.42, accBar: 0.20 }, // Base capital
      { x: -0.26, yTop: -0.10, accBar: 0.38 }, // Optimized
      { x: 0.26, yTop: 0.36, accBar: 0.65 },  // Protected
      { x: 0.78, yTop: 0.98, accBar: 0.95 },  // Max Return (Peak)
    ];

    const yBase = -0.95;
    const w = 0.16; // half-width of each bar
    const d = 0.16; // half-depth of each bar

    barConfigs.forEach((cfg) => {
      // 4 vertical edges for each 3D rectangular bar
      const corners: [number, number][] = [
        [cfg.x - w, -d], [cfg.x + w, -d], [cfg.x + w, d], [cfg.x - w, d]
      ];
      corners.forEach(([cx, cz]) => {
        const edge = segment([cx, yBase, cz], [cx, cfg.yTop, cz], 12);
        pts.push(...edge);
        acc.push(...edge.map(() => cfg.accBar * 0.7));
      });
      // Top rectangular cap
      for (let i = 0; i < 4; i++) {
        const [x1, z1] = corners[i];
        const [x2, z2] = corners[(i + 1) % 4];
        const topEdge = segment([x1, cfg.yTop, z1], [x2, cfg.yTop, z2], 5);
        pts.push(...topEdge);
        acc.push(...topEdge.map(() => cfg.accBar));
      }
    });

    // Parabolic growth trendline curving gracefully over the bar tops
    for (let i = 0; i < 40; i++) {
      const t = i / 39;
      const x = -0.92 + t * 1.84;
      const y = -0.55 + Math.pow(t, 1.45) * 1.65;
      const z = 0.20;
      pts.push([x, y, z]);
      acc.push(t > 0.75 ? 0.98 : 0.50);
    }

    return fill(pts, acc);
  })();

  // 8. FaqSection: Tri-Axial Precision Gyroscope / Armillary Sphere (3-O'qli Giroskopik Armillyar Sfera)
  // Grand multi-gimbal scientific armillary sphere: 3 giant orthogonal rings + inner tilted gimbal + diamond center
  const ring = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];
    const R = 1.15;
    const numRingPts = 56;

    // Ring 1: Equator (XZ plane, y = 0)
    for (let i = 0; i < numRingPts; i++) {
      const a = (i / numRingPts) * Math.PI * 2;
      pts.push([Math.cos(a) * R, 0, Math.sin(a) * R]);
      acc.push(i % 7 === 0 ? 0.85 : 0.15);
    }

    // Ring 2: Prime Meridian (XY plane, z = 0)
    for (let i = 0; i < numRingPts; i++) {
      const a = (i / numRingPts) * Math.PI * 2;
      pts.push([Math.cos(a) * R, Math.sin(a) * R, 0]);
      acc.push(i % 7 === 0 ? 0.85 : 0.15);
    }

    // Ring 3: Cross Meridian (ZY plane, x = 0)
    for (let i = 0; i < numRingPts; i++) {
      const a = (i / numRingPts) * Math.PI * 2;
      pts.push([0, Math.sin(a) * R, Math.cos(a) * R]);
      acc.push(i % 7 === 0 ? 0.85 : 0.15);
    }

    // Ring 4: Inner 45° tilted gimbal (r = 0.75)
    for (let i = 0; i < 42; i++) {
      const a = (i / 42) * Math.PI * 2;
      const c = Math.cos(a) * 0.75;
      const s = Math.sin(a) * 0.75;
      pts.push([c * 0.707, s, c * 0.707]);
      acc.push(i % 6 === 0 ? 0.90 : 0.30);
    }

    // Center pulsating diamond focal beacon
    const topD: Vec3 = [0, 0.35, 0];
    const botD: Vec3 = [0, -0.35, 0];
    const midD: Vec3[] = [[0.22, 0, 0], [0, 0, 0.22], [-0.22, 0, 0], [0, 0, -0.22]];
    midD.forEach((m) => {
      const ray1 = segment(topD, m, 5);
      const ray2 = segment(botD, m, 5);
      pts.push(...ray1, ...ray2);
      acc.push(...ray1.map(() => 0.95), ...ray2.map(() => 0.75));
    });
    pts.push([0, 0, 0]);
    acc.push(0.98);

    return fill(pts, acc);
  })();

  // 9. LandingFooter: Illuminated 10-Letter MakonSense Wordmark
  const wordmark: Formation = {
    pts: WORDMARK_PTS,
    accent: WORDMARK_ACCENT,
  };

  return { globe, layers, cube, towers, steps, clusters, bars, ring, wordmark };
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
        targetP = idx + easeInOutCubic(clamp((t - 0.2) / 0.6));
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

      const dotVisibility = Math.max(0, 1 - easeInOutCubic(absorb));
      const dotScale = Math.max(0, 1 - Math.pow(absorb, 1.4) * 0.90);

      // Wordmark color clarity reaction:
      // Once particles enter into the letters, the wordmark SVG color clarifies and illuminates ("rangi tiniqlashsin")
      const wordmarkSvg = document.getElementById('makonsense-wordmark-svg');
      if (wordmarkSvg) {
        const dark = document.documentElement.classList.contains('dark');
        const baseOp = dark ? 0.44 : 0.28;
        wordmarkSvg.style.opacity = `${(baseOp + absorb * 0.36).toFixed(3)}`;
      }

      // Fixed at z-20: sits in front of section cards (z-10) to stay 100% crisp without backdrop-blur haze,
      // and behind navbar (z-50). Pointer events pass through seamlessly.
      canvas.style.zIndex = '20';

      // Aspect-ratio aware scaling: wide letterform bounds for wordmark, enlarged 3D presence for archetypes
      const aRx = A.shape === 'wordmark' ? A.width * 0.50 : A.size * 0.52;
      const aRy = A.shape === 'wordmark' ? A.height * 0.50 : A.size * 0.52;
      const bRx = B.shape === 'wordmark' ? B.width * 0.50 : B.size * 0.52;
      const bRy = B.shape === 'wordmark' ? B.height * 0.50 : B.size * 0.52;
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

      /* -------- slow, serene rotation & 3D camera -------- */
      const time = reduced ? 0 : (now - start) / 1000;
      // In sections 1-8: continuous float and gentle 36° pivot on scroll
      // In footer wordmark: smoothly levels out to front-facing readable alignment
      const naturalYaw = time * 0.075 + P * Math.PI * 0.20 + mouseX * 0.10;
      const frontYawTarget =
        Math.round(naturalYaw / (Math.PI * 2)) * Math.PI * 2 +
        mouseX * 0.04 +
        (reduced ? 0 : Math.sin(time * 0.5) * 0.02);
      const yaw = lerp(naturalYaw, frontYawTarget, easeInOutCubic(wordmarkWeight));

      const naturalPitch = -0.24 + mouseY * 0.08;
      const frontPitchTarget = mouseY * 0.03;
      const pitch = lerp(naturalPitch, frontPitchTarget, easeInOutCubic(wordmarkWeight));

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
      const base = dark ? [255, 255, 255] : [17, 17, 17];
      const scale = clamp(size / 340, 1.0, 1.65);

      /* -------- Render Crisp, High-Definition 3D Dots & Emerald Glow -------- */
      for (let n = 0; n < N; n++) {
        const k = order[n];
        const depth = clamp((sz[k] + 1.4) / 2.8);
        const acc = sa[k];
        // Crisp, high-contrast alpha: front dots are vivid (0.75 - 0.95); back dots have tangible depth (0.30 - 0.45)
        const alpha = (0.28 + wordmarkWeight * 0.12 + depth * 0.52 + acc * 0.20) * globalAlpha * dotVisibility;
        // Distinct, sharp 3D spherical nodes (radius ~ 1.60px to 4.2px) with crisp geometry
        const rad = (1.60 + depth * 1.65 + acc * 0.90) * scale * dotScale;
        const r = Math.round(lerp(base[0], ACCENT[0], acc));
        const g = Math.round(lerp(base[1], ACCENT[1], acc));
        const bl = Math.round(lerp(base[2], ACCENT[2], acc));

        // Refined emerald aura for accented nodes
        if (acc > 0.25 && dotVisibility > 0.08) {
          ctx.fillStyle = `rgba(14,159,110,${0.28 * alpha * dotVisibility})`;
          ctx.beginPath();
          ctx.arc(sx[k], sy[k], rad * 2.8, 0, Math.PI * 2);
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
      className="hidden lg:block fixed inset-0 z-[20] pointer-events-none"
    />
  );
};

export default MorphObject;
