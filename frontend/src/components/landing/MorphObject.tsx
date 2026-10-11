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
/* 8 Completely Distinct, Signature 3D Archetypes Tailored to Each Section:
   1. Hero (globe)           -> 3D Global Earth Map with Selected & Highlighted Uzbekistan
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
  // 1. Hero: 3D Global Earth Map with Highlighted & Selected Uzbekistan (Global Yer Xaritasi va O'zbekiston Tanlovi)
  const globe = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    // --- A. UZBEKISTAN: Precise Geographic Contour & Selected Region Highlight ---
    // True border vertices along Karakalpakstan, Kyzylkum, Tashkent Oasis, Fergana Valley, Surkhandarya
    const uzContour: [number, number][] = [
      [45.0, 56.0], [45.5, 58.5], [43.5, 59.0], [42.46, 59.6], [41.5, 60.5],
      [40.8, 62.5], [39.77, 64.42], [38.5, 66.8], [37.22, 67.28], [38.2, 68.2],
      [40.8, 68.7], [41.31, 69.28], [41.5, 70.0], [40.9, 71.5], [40.75, 72.35],
      [40.38, 71.78], [40.2, 70.8], [41.2, 67.5], [43.0, 64.0], [44.5, 61.5], [45.0, 56.0],
    ];
    for (let i = 0; i < uzContour.length - 1; i++) {
      const edge = segGeo(uzContour[i], uzContour[i + 1], 3, 1.006);
      pts.push(...edge);
      acc.push(...edge.map(() => 0.20));
    }

    // Major Regional Hub Nodes in Uzbekistan (Tashkent, Samarkand, Bukhara, Fergana, Nukus, Termez, etc.)
    const uzHubs: [number, number][] = [
      [41.31, 69.28], // Tashkent Capital
      [39.65, 66.97], // Samarkand
      [39.77, 64.42], // Bukhara
      [40.38, 71.78], // Fergana
      [42.46, 59.60], // Nukus
      [37.22, 67.28], // Termez
      [40.10, 65.37], // Navoiy
      [40.78, 72.34], // Andijan
      [40.99, 71.67], // Namangan
      [41.55, 60.63], // Urgench
    ];
    uzHubs.forEach((coord) => {
      pts.push(geoToSphere(coord[0], coord[1], 1.01));
      acc.push(1.0);
    });

    // Tashkent Radial Pin Laser Beacon (rising out from Tashkent coords)
    for (let step = 1; step <= 5; step++) {
      pts.push(geoToSphere(41.31, 69.28, 1.0 + step * 0.04));
      acc.push(step === 5 ? 1.0 : 0.20);
    }

    // High-Tech Selector Radar Ring around Uzbekistan
    const centerUz: [number, number] = [41.0, 66.0];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const lat = centerUz[0] + Math.sin(a) * 4.5;
      const lon = centerUz[1] + Math.cos(a) * 6.5;
      pts.push(geoToSphere(lat, lon, 1.008));
      acc.push(0.20);
    }

    // --- B. WORLD CONTINENTS: Fine Starlight Global Landmass Outline ---
    const continents: [number, number][][] = [
      // Europe & Mediterranean
      [[36, -6], [43, -9], [48, -4], [55, 5], [60, 18], [69, 20], [60, 30], [55, 37], [45, 38], [41, 28], [38, 15], [36, -6]],
      // British Isles
      [[50, -5], [58, -3], [55, -1], [50, 1]],
      // Africa
      [[36, -5], [32, 25], [12, 51], [-4, 40], [-25, 33], [-34, 20], [-10, 14], [5, 1], [15, -16], [30, -10], [36, -5]],
      // Middle East & Arabia
      [[30, 34], [13, 48], [24, 57], [30, 48], [37, 45], [30, 34]],
      // Asia Coastline & Eastern Archipelago
      [[24, 68], [8, 77], [22, 88], [1, 104], [22, 115], [38, 120], [42, 130], [55, 140], [68, 140], [70, 80], [55, 60]],
      // Japan
      [[31, 131], [36, 138], [43, 143]],
      // North America
      [[15, -92], [30, -115], [48, -125], [65, -165], [70, -140], [60, -95], [50, -60], [25, -80], [18, -90]],
      // South America
      [[12, -72], [-5, -35], [-23, -43], [-55, -68], [-40, -73], [-10, -78], [12, -72]],
      // Australia
      [[-15, 128], [-35, 118], [-38, 144], [-24, 153], [-11, 142], [-15, 128]],
    ];

    continents.forEach((poly) => {
      for (let i = 0; i < poly.length - 1; i++) {
        const edge = segGeo(poly[i], poly[i + 1], 2, 1.0);
        pts.push(...edge);
        acc.push(...edge.map(() => 0.14));
      }
    });

    // Equator Reference Grid Belt
    for (let i = 0; i < 24; i++) {
      const lon = (i / 24) * 360 - 180;
      pts.push(geoToSphere(0, lon, 0.996));
      acc.push(0.18);
    }

    // Latitude Tropic Reference Bands (23.5° N & -23.5° S)
    for (let i = 0; i < 16; i++) {
      const lon = (i / 16) * 360 - 180;
      pts.push(geoToSphere(23.5, lon, 0.996));
      acc.push(0.10);
      pts.push(geoToSphere(-23.5, lon, 0.996));
      acc.push(0.10);
    }

    return fill(pts, acc);
  })();

  // 2. ScrollExperience (Tahlil Section): 3D DNA Double Helix with EXACTLY 3 LOOPS matching user's image:
  // - Loop 1 (bottom): 3 parallel rungs
  // - Crossover 1 (X)
  // - Loop 2 (middle): 4 parallel rungs
  // - Crossover 2 (X)
  // - Loop 3 (top): 3 parallel rungs
  // Calibrated dot distribution: 96% crisp white baseline dots + exactly 12 emerald beacon nodes matching Hero Map
  // Total: 100 (Strand 1) + 100 (Strand 2) + 100 (10 rungs x 10 pts) = 300 points!
  const layers = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    // Diagonal unit vectors in screen projection plane (~48° angle from bottom-left to top-right)
    const angleDiag = Math.PI * 0.27; // ~48.6 degrees
    const uX = Math.cos(angleDiag);
    const uY = Math.sin(angleDiag);
    const vX = -Math.sin(angleDiag);
    const vY = Math.cos(angleDiag);

    const span = 1.25; // spine half-length
    const amp = 0.52;  // wide, clear loop amplitude
    const totalRad = Math.PI * 3.0; // exactly 3 half-cycles = 3 LOOPS!

    const numStrand = 100;

    // --- Strand 1 (100 points) ---
    for (let i = 0; i < numStrand; i++) {
      const t = i / (numStrand - 1); // 0 to 1
      const s = -span + t * (span * 2);
      const theta = t * totalRad; // 0 to 3*PI
      const wave = Math.sin(theta) * amp;
      const depth = Math.cos(theta) * 0.16;

      const x = s * uX + wave * vX;
      const y = s * uY + wave * vY;
      const z = depth;
      pts.push([x, y, z]);
      // Emerald beacon nodes: apex crests of Loop 1, Loop 2, Loop 3 and top terminal node (4 points)
      const isGreen = i === 17 || i === 50 || i === 83 || i === 99;
      acc.push(isGreen ? 1.0 : 0.10);
    }

    // --- Strand 2 (100 points, opposite phase) ---
    for (let i = 0; i < numStrand; i++) {
      const t = i / (numStrand - 1);
      const s = -span + t * (span * 2);
      const theta = t * totalRad;
      const wave = -Math.sin(theta) * amp;
      const depth = -Math.cos(theta) * 0.16;

      const x = s * uX + wave * vX;
      const y = s * uY + wave * vY;
      const z = depth;
      pts.push([x, y, z]);
      // Emerald beacon nodes: complementary troughs of Loop 1, Loop 2, Loop 3 and bottom start node (4 points)
      const isGreen = i === 0 || i === 17 || i === 50 || i === 83;
      acc.push(isGreen ? 1.0 : 0.10);
    }

    // --- Exactly 10 Crossbars (Rungs) matching reference image: 3 in Loop 1, 4 in Loop 2, 3 in Loop 3 ---
    const rungThetas: number[] = [
      // Loop 1 (bottom loop, theta in (0, PI)): exactly 3 parallel rungs
      Math.PI * 0.28, Math.PI * 0.50, Math.PI * 0.72,
      // Loop 2 (middle loop, theta in (PI, 2*PI)): exactly 4 parallel rungs
      Math.PI * 1.22, Math.PI * 1.40, Math.PI * 1.60, Math.PI * 1.78,
      // Loop 3 (top loop, theta in (2*PI, 3*PI)): exactly 3 parallel rungs
      Math.PI * 2.28, Math.PI * 2.50, Math.PI * 2.72,
    ];

    const ptsPerRung = 10;
    rungThetas.forEach((th, rIdx) => {
      const t = th / totalRad;
      const s = -span + t * (span * 2);
      const wave = Math.sin(th) * amp;
      const depth = Math.cos(th) * 0.16;

      const p1: Vec3 = [s * uX + wave * vX, s * uY + wave * vY, depth];
      const p2: Vec3 = [s * uX - wave * vX, s * uY - wave * vY, -depth];
      const bar = segment(p1, p2, ptsPerRung);
      pts.push(...bar);
      // Only the two central focal rungs in Loop 2 (rIdx === 4 and 5) have their center base pair as green beacons (4 points)
      const isCenterRung = rIdx === 4 || rIdx === 5;
      acc.push(
        ...bar.map((_, idx) =>
          isCenterRung && (idx === 4 || idx === 5) ? 1.0 : 0.10
        )
      );
    });

    return fill(pts, acc);
  })();

  // 3. ProblemSolution: 3D Urban Spatial Voxel / Smart Building Matrix (Hajmdor 3D Bino va Ichki AI Yadrosi)
  // An authentic, solid 3D isometric city block representing 524,000+ indexed buildings
  const cube = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    const S = 0.75; // half-width of building
    const yB = -0.75;
    const yT = 0.75;

    // Roof deck planar grid (5x5 = 25 pts)
    for (let ix = -2; ix <= 2; ix++) {
      for (let iz = -2; iz <= 2; iz++) {
        pts.push([(ix / 2) * S, yT, (iz / 2) * S]);
        // Only center beacon and 4 corner pins are green beacons (5 points)
        const isCorner = Math.abs(ix) === 2 && Math.abs(iz) === 2;
        const isCenter = ix === 0 && iz === 0;
        acc.push(isCenter || isCorner ? 1.0 : 0.15);
      }
    }

    // Foundation slab planar grid (5x5 = 25 pts)
    for (let ix = -2; ix <= 2; ix++) {
      for (let iz = -2; iz <= 2; iz++) {
        pts.push([(ix / 2) * S, yB, (iz / 2) * S]);
        acc.push(0.15);
      }
    }

    // 6 Solid Floor Perimeter Bands around the building
    for (let f = 0; f < 6; f++) {
      const yF = yB + ((f + 0.5) / 6) * (yT - yB);
      const numPerSide = 6;
      for (let i = 0; i < numPerSide; i++) {
        const t = -S + (i / numPerSide) * (2 * S);
        pts.push([t, yF, -S], [S, yF, t], [-t, yF, S], [-S, yF, -t]);
        acc.push(0.15, 0.15, 0.15, 0.15);
      }
    }

    // 4 Vertical Steel Corner Pillars
    const corners = [[-S, -S], [S, -S], [S, S], [-S, S]];
    corners.forEach(([cx, cz]) => {
      const col = segment([cx, yB, cz], [cx, yT, cz], 12);
      pts.push(...col);
      acc.push(...col.map(() => 0.15));
    });

    // Inner Glowing AI Kernel Core (spatial intelligence brain)
    const core = fibSphere(32, 0.32);
    pts.push(...core);
    // 6 cardinal focal nodes are green beacons (6 points)
    acc.push(...core.map((_, idx) => (idx < 6 ? 1.0 : 0.15)));

    return fill(pts, acc);
  })();

  // 4. LocationCompareSection: Dual Comparative Skyscraper Monoliths (Yonma-Yon Taqqoslash Minoralari)
  // Two solid architectural skyscraper towers comparing Amir Temur (Winner, 94.0) vs Chilonzor (62.3)
  const towers = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    // Base ground slab under both towers (y = -0.88)
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      pts.push([Math.cos(a) * 0.95, -0.88, Math.sin(a) * 0.42]);
      acc.push(0.15);
    }

    // --- Tower A (Winner: Amir Temur, x = -0.44, r = 0.32) ---
    const cxA = -0.44;
    const rA = 0.32;
    for (let f = 0; f < 12; f++) {
      const yF = -0.85 + (f / 11) * 1.70;
      const numPts = 10;
      for (let i = 0; i < numPts; i++) {
        const a = (i / numPts) * Math.PI * 2;
        pts.push([cxA + Math.cos(a) * rA, yF, Math.sin(a) * rA]);
        // 4 cardinal observation beacons on top crown floor
        const isCrownBeacon = f === 11 && i % 3 === 0;
        acc.push(isCrownBeacon ? 1.0 : 0.15);
      }
    }
    // Crown Pinnacle on Tower A (MakonScore 94.0 pinnacle needle)
    const apexA = segment([cxA, 0.85, 0], [cxA, 1.25, 0], 8);
    pts.push(...apexA);
    // 4 tip points of the spire are green beacons
    acc.push(...apexA.map((_, idx) => (idx >= 4 ? 1.0 : 0.15)));

    // --- Tower B (Competitor: Chilonzor, x = +0.48, r = 0.28) ---
    const cxB = 0.48;
    const rB = 0.28;
    for (let f = 0; f < 6; f++) {
      const yF = -0.85 + (f / 5) * 0.95;
      const numPts = 10;
      for (let i = 0; i < numPts; i++) {
        const a = (i / numPts) * Math.PI * 2;
        pts.push([cxB + Math.cos(a) * rB, yF, Math.sin(a) * rB]);
        acc.push(0.15);
      }
    }
    // Flat roof cap on Tower B
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      pts.push([cxB + Math.cos(a) * (rB * 0.5), 0.10, Math.sin(a) * (rB * 0.5)]);
      acc.push(0.15);
    }

    // --- Skywalk Bridge connecting the two towers at y = -0.10 and +0.05 ---
    [-0.10, 0.05].forEach((yBridge) => {
      const bridge = segment([cxA + rA, yBridge, 0], [cxB - rB, yBridge, 0], 12);
      pts.push(...bridge);
      // 1 midpoint gateway beacon per bridge level
      acc.push(...bridge.map((_, idx) => (idx === 6 ? 1.0 : 0.15)));
    });

    return fill(pts, acc);
  })();

  // 5. HowItWorks: 3 Solid Terraced Plazas (3 Bosqichli Mustahkam Pog'onalar)
  // 3 distinct solid circular platforms (01 Pinpoint -> 02 Filter -> 03 MakonScore)
  const steps = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    const terraces = [
      { cx: -0.62, cy: -0.58, cz: 0.18, r: 0.44 }, // Step 01
      { cx: 0.0, cy: 0.0, cz: -0.16, r: 0.44 },   // Step 02
      { cx: 0.62, cy: 0.58, cz: 0.18, r: 0.44 },    // Step 03
    ];

    terraces.forEach((t, idx) => {
      // Solid filled terrace plate (center + 3 rings = 37 pts)
      const d = planarDisc(t.r, t.cy, t.cx, t.cz, 3, 0.15);
      pts.push(...d.pts);
      // Center pin marker of each terrace (3 points total)
      acc.push(...d.acc.map((_, i) => (i === 0 ? 1.0 : 0.15)));

      // Vertical skirt rim around each terrace
      const skirt = circleRing(t.r, t.cy - 0.08, 16, t.cx, t.cz);
      pts.push(...skirt);
      acc.push(...skirt.map(() => 0.15));

      if (idx === 2) {
        // Summit beacon for Step 03 (5 green beacon nodes)
        const beacon = segment([t.cx, t.cy, t.cz], [t.cx, t.cy + 0.35, t.cz], 7);
        pts.push(...beacon);
        acc.push(...beacon.map((_, i) => (i >= 2 ? 1.0 : 0.15)));
      }
    });

    // Connecting stair ramps between Terrace 1 -> 2 and Terrace 2 -> 3
    const ramp1 = segment([-0.42, -0.50, 0.10], [-0.18, -0.08, -0.10], 14);
    const ramp2 = segment([0.18, 0.08, -0.10], [0.42, 0.50, 0.10], 14);
    pts.push(...ramp1, ...ramp2);
    // 1 waypoint beacon per ramp (2 points)
    acc.push(
      ...ramp1.map((_, i) => (i === 7 ? 1.0 : 0.15)),
      ...ramp2.map((_, i) => (i === 7 ? 1.0 : 0.15))
    );

    // Ground contour baseline
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * Math.PI * 2;
      pts.push([Math.cos(a) * 1.05, -0.92, Math.sin(a) * 0.75]);
      acc.push(0.12);
    }

    return fill(pts, acc);
  })();

  // 6. IndustrySolutions: Central Command Hub + 4 Solid Sector Islands (Markaziy Hub va 4 Ta Soha Oroli)
  // Central solid urban intelligence hub connected to 4 solid sector platforms
  const clusters = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    // Central Command Hub: dense core with 50 points
    const core = fibSphere(50, 0.38);
    pts.push(...core);
    // 4 cardinal apex beacons on central core (4 points)
    acc.push(...core.map((_, idx) => (idx < 4 ? 1.0 : 0.15)));

    // Equatorial and polar rings on central hub
    const hubRing1 = circleRing(0.42, 0, 20);
    pts.push(...hubRing1);
    acc.push(...hubRing1.map(() => 0.15));

    // 4 Solid Sector Islands: HoReCa, Retail, Pharmacy, Real Estate
    const islands: { pos: Vec3; name: string }[] = [
      { pos: [0.90, 0.30, 0.0], name: 'HoReCa' },
      { pos: [0.0, -0.35, 0.90], name: 'Retail' },
      { pos: [-0.90, 0.25, 0.0], name: 'Dorixona' },
      { pos: [0.0, 0.35, -0.90], name: 'Mulk' },
    ];

    islands.forEach((isl) => {
      // Solid filled island disc
      const d = planarDisc(0.24, isl.pos[1], isl.pos[0], isl.pos[2], 2, 0.15);
      pts.push(...d.pts);
      // Center beacon of each island (1 per island = 4 points)
      acc.push(...d.acc.map((_, i) => (i === 0 ? 1.0 : 0.15)));

      // Highway laser connection corridor from central hub to island
      const bridge = segment([0, 0, 0], isl.pos, 12);
      pts.push(...bridge);
      // 1 gateway beacon on bridge (4 points)
      acc.push(...bridge.map((_, i) => (i === 11 ? 1.0 : 0.15)));
    });

    // Outer orbital highway ring
    for (let i = 0; i < 32; i++) {
      const a = (i / 32) * Math.PI * 2;
      pts.push([Math.cos(a) * 1.08, Math.sin(a) * 0.22, Math.sin(a) * 1.08]);
      acc.push(0.12);
    }

    return fill(pts, acc);
  })();

  // 7. RoiCalculator: 4 Solid 3D Financial Bar Columns (4 Ta Mustahkam 3D Moliyaviy Ustun)
  // 4 solid 3D volumetric bar columns showing exponential capital growth
  const bars = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];

    // Solid baseline platform under all 4 bars at y = -0.92
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      pts.push([Math.cos(a) * 1.05, -0.92, Math.sin(a) * 0.35]);
      acc.push(0.15);
    }

    const barConfigs = [
      { x: -0.72, yTop: -0.42, w: 0.16, d: 0.14 }, // Base
      { x: -0.24, yTop: -0.10, w: 0.16, d: 0.14 }, // Optimized
      { x: 0.24, yTop: 0.38, w: 0.16, d: 0.14 },  // Protected
      { x: 0.72, yTop: 0.96, w: 0.16, d: 0.14 },  // Peak Return
    ];

    barConfigs.forEach((cfg, bIdx) => {
      // 4 vertical corner columns
      const corners = [
        [cfg.x - cfg.w, -cfg.d],
        [cfg.x + cfg.w, -cfg.d],
        [cfg.x + cfg.w, cfg.d],
        [cfg.x - cfg.w, cfg.d],
      ];
      corners.forEach(([cx, cz]) => {
        const edge = segment([cx, -0.92, cz], [cx, cfg.yTop, cz], 8);
        pts.push(...edge);
        acc.push(...edge.map(() => 0.15));
      });

      // Solid filled top cap (3x3 grid = 9 pts)
      for (let ix = -1; ix <= 1; ix++) {
        for (let iz = -1; iz <= 1; iz++) {
          pts.push([cfg.x + (ix * cfg.w) / 1.2, cfg.yTop, (iz * cfg.d) / 1.2]);
          // Peak return bar (bIdx === 3) top cap center beacons (4 points)
          const isTopBeacon = bIdx === 3 && (ix === 0 || iz === 0);
          acc.push(isTopBeacon ? 1.0 : 0.15);
        }
      }

      // Mid-level horizontal band
      const yMid = -0.92 + (cfg.yTop - -0.92) * 0.5;
      corners.forEach(([cx, cz]) => {
        pts.push([cx, yMid, cz]);
        acc.push(0.15);
      });
    });

    // Exponential growth trend arc curving over the tops of all 4 bars (38 pts)
    for (let i = 0; i < 38; i++) {
      const t = i / 37;
      const x = -0.92 + t * 1.84;
      const y = -0.55 + Math.pow(t, 1.45) * 1.62;
      pts.push([x, y, 0.20]);
      // Apex arrow tip: top 6 points are green beacons (6 points)
      acc.push(i >= 32 ? 1.0 : 0.15);
    }

    return fill(pts, acc);
  })();

  // 8. FaqSection: Tri-Axial Precision Gyroscope & Prismatic Core (Mustahkam Giroskop va Prizma)
  const ring = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];
    const R = 1.10;

    // 3 Solid multi-point orthogonal gimbal rings (Equator, Prime Meridian, Cross)
    const numRingPts = 48;
    for (let i = 0; i < numRingPts; i++) {
      const a = (i / numRingPts) * Math.PI * 2;
      // Cardinal alignment beacons at 90 degree intervals (i === 0, 12, 24, 36)
      const isCardinal = i % 12 === 0;

      pts.push([Math.cos(a) * R, 0, Math.sin(a) * R]);
      acc.push(isCardinal ? 1.0 : 0.15);

      pts.push([Math.cos(a) * R, Math.sin(a) * R, 0]);
      acc.push(isCardinal ? 1.0 : 0.15);

      pts.push([0, Math.sin(a) * R, Math.cos(a) * R]);
      acc.push(0.15);
    }

    // Dense solid faceted core prism (diamond octahedral beacon)
    const topD: Vec3 = [0, 0.45, 0];
    const botD: Vec3 = [0, -0.45, 0];
    const midD: Vec3[] = [
      [0.32, 0, 0],
      [0, 0, 0.32],
      [-0.32, 0, 0],
      [0, 0, -0.32],
    ];
    // Top apex and bottom nadir are green beacons (2 points)
    pts.push(topD, botD);
    acc.push(1.0, 1.0);

    midD.forEach((m) => {
      const ray1 = segment(topD, m, 6);
      const ray2 = segment(botD, m, 6);
      pts.push(...ray1, ...ray2);
      acc.push(...ray1.map(() => 0.15), ...ray2.map(() => 0.15));
    });
    // Core center node
    pts.push([0, 0, 0]);
    acc.push(0.15);

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

      // On hero section (scrollY near 0), keep 3D particles transparent so FlatWorldMap shines cleanly.
      // As user scrolls down towards Section 2, 3D particles fluidly assemble into the 3D formations.
      const heroFade = clamp(scrollY / Math.min(320, vh * 0.4));
      const dotVisibility = Math.max(0, 1 - easeInOutCubic(absorb)) * heroFade;
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

      /* -------- Stable Isometric View (Clear, Precise & Recognizable) -------- */
      // Exactly like UzbekistanDottedMap: STABLE & IMMOBILE (NO chaotic spinning!)
      // A clean, fixed 14° architectural isometric angle lets the user see the exact shape instantly,
      // with subtle interactive mouse tilt.
      const isWordmark = wordmarkWeight > 0.05;
      const isLayers = A.shape === 'layers' || B.shape === 'layers';
      const baseYaw = isWordmark ? 0 : (isLayers ? -0.04 : -0.22);
      const basePitch = isWordmark ? 0 : (isLayers ? -0.05 : -0.18);
      const yaw = baseYaw + mouseX * (isLayers ? 0.04 : 0.06);
      const pitch = basePitch + mouseY * (isLayers ? 0.03 : 0.04);

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
