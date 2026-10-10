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
/* Sections 2-8: Tall, Slender, Minimalist Vertical Archetypes        */

const buildFormations = (): Record<MorphShape, Formation> => {
  // 1. Hero: Pure Geodesic Sphere (Mukammal Dumaloq Shar — atrofidagi ringsiz)
  // Perfectly round spherical particle orb with zero outer rings or orbits
  const globe = (() => {
    const pts = fibSphere(N, 0.98);
    const acc = pts.map((p) => {
      // Highlight Tashkent coordinates (~41.31° N, ~69.28° E) and gentle equator
      if (p[1] > 0.55 && p[0] > 0.25) return 0.95;
      if (Math.abs(p[1]) < 0.08) return 0.45;
      return 0.04;
    });
    return fill(pts, acc);
  })();

  // 2. ScrollExperience: Tall Fluted Architectural Column (Baland Qavatli Kolon)
  // Slender vertical column with 6 horizontal calibration rings and 6 vertical spines
  const layers = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];
    const r = 0.62;
    const numRings = 7;
    for (let i = 0; i < numRings; i++) {
      const t = i / (numRings - 1);
      const y = -1.22 + t * 2.44;
      const ring = circleRing(r, y, 32);
      pts.push(...ring);
      acc.push(...ring.map(() => (i === numRings - 1 ? 0.85 : i === 0 ? 0.3 : i === 3 ? 0.5 : 0.05)));
    }
    // 6 vertical fluted column ribs
    for (let cIdx = 0; cIdx < 6; cIdx++) {
      const a = (cIdx / 6) * Math.PI * 2;
      const px = Math.cos(a) * r;
      const pz = Math.sin(a) * r;
      const vLine = segment([px, -1.22, pz], [px, 1.22, pz], 14);
      pts.push(...vLine);
      acc.push(...vLine.map((_, idx) => (idx === vLine.length - 1 ? 0.8 : 0.15)));
    }
    return fill(pts, acc);
  })();

  // 3. ProblemSolution: Tall Hexagonal Obelisk Prism (Baland Olti Qirrali Prizma)
  // Tall crystalline prism: 6 vertical corner edges, 3 hex tiers, apex pyramid cap
  const cube = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];
    const r = 0.66;
    const hexVerts: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      hexVerts.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
    // 6 vertical corner edges running full height
    hexVerts.forEach(([hx, hz]) => {
      const edge = segment([hx, -1.22, hz], [hx, 1.05, hz], 24);
      pts.push(...edge);
      acc.push(...edge.map((_, idx) => (idx === edge.length - 1 ? 0.8 : 0.15)));
    });
    // 3 horizontal hexagon rings
    [-1.22, 0.0, 1.05].forEach((yTier) => {
      for (let i = 0; i < 6; i++) {
        const [x1, z1] = hexVerts[i];
        const [x2, z2] = hexVerts[(i + 1) % 6];
        const seg = segment([x1, yTier, z1], [x2, yTier, z2], 7);
        pts.push(...seg);
        acc.push(...seg.map(() => (yTier > 0.5 ? 0.6 : 0.1)));
      }
    });
    // Top pyramid apex needle
    const topApex: Vec3 = [0, 1.34, 0];
    hexVerts.forEach(([hx, hz]) => {
      const cap = segment([hx, 1.05, hz], topApex, 9);
      pts.push(...cap);
      acc.push(...cap.map((p) => (p[1] > 1.2 ? 0.95 : 0.4)));
    });
    return fill(pts, acc);
  })();

  // 4. LocationCompareSection: Tall Hourglass Bicone (Baland Bikonus / Qumsoat)
  // Two cones meeting at waist: slender waist (r = 0.16) flaring to bases (r = 0.74)
  const towers = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];
    const numRings = 9;
    for (let i = 0; i < numRings; i++) {
      const t = i / (numRings - 1);
      const y = -1.22 + t * 2.44;
      const r = 0.16 + Math.abs(y / 1.22) * 0.58;
      const ring = circleRing(r, y, 26);
      pts.push(...ring);
      const isWaist = Math.abs(y) < 0.2;
      const isTop = y > 1.0;
      acc.push(...ring.map(() => (isTop ? 0.9 : isWaist ? 0.75 : 0.08)));
    }
    // 6 vertical diagonal spiral ribs along the cone mantle
    for (let sIdx = 0; sIdx < 6; sIdx++) {
      const a0 = (sIdx / 6) * Math.PI * 2;
      const rib: Vec3[] = [];
      const ribAcc: number[] = [];
      for (let j = 0; j < 18; j++) {
        const t = j / 17;
        const y = -1.22 + t * 2.44;
        const r = 0.16 + Math.abs(y / 1.22) * 0.58;
        const a = a0 + t * Math.PI * 0.6;
        rib.push([Math.cos(a) * r, y, Math.sin(a) * r]);
        ribAcc.push(t > 0.85 ? 0.8 : 0.15);
      }
      pts.push(...rib);
      acc.push(...ribAcc);
    }
    return fill(pts, acc);
  })();

  // 5. HowItWorks: Tall Ascending Double Helix Pillar (Baland Dinamik Spiral Ustun)
  // Slender vertical double helix climbing from Y = -1.22 to Y = +1.22, radius 0.60
  const steps = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];
    const r = 0.60;
    const count = 125;
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const theta = -Math.PI * 2.5 + t * Math.PI * 5.0;
      const y = -1.22 + t * 2.44;
      // Strand 1
      pts.push([Math.cos(theta) * r, y, Math.sin(theta) * r]);
      acc.push(t > 0.85 ? 0.9 : (i % 16 === 0 ? 0.6 : 0.1));
      // Strand 2
      pts.push([Math.cos(theta + Math.PI) * r, y, Math.sin(theta + Math.PI) * r]);
      acc.push(t > 0.85 ? 0.8 : (i % 16 === 0 ? 0.4 : 0.1));
    }
    // Cross connecting rungs between helical strands
    for (let i = 0; i < 14; i++) {
      const t = i / 13;
      const theta = -Math.PI * 2.5 + t * Math.PI * 5.0;
      const y = -1.22 + t * 2.44;
      const p1: Vec3 = [Math.cos(theta) * r, y, Math.sin(theta) * r];
      const p2: Vec3 = [Math.cos(theta + Math.PI) * r, y, Math.sin(theta + Math.PI) * r];
      const cross = segment(p1, p2, 4);
      pts.push(...cross);
      acc.push(...cross.map(() => 0.25));
    }
    return fill(pts, acc);
  })();

  // 6. IndustrySolutions: Tall Diamond Needle Bipyramid (Baland Cho'ziq Olmos Shpil)
  // Slender faceted diamond needle with top apex at Y = 1.34 and bottom apex at Y = -1.34
  const clusters = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];
    const top: Vec3 = [0, 1.34, 0];
    const bot: Vec3 = [0, -1.34, 0];
    const r = 0.66;
    const midVerts: Vec3[] = [
      [r, 0, 0],
      [0, 0, r],
      [-r, 0, 0],
      [0, 0, -r],
    ];
    midVerts.forEach((v, i) => {
      const next = midVerts[(i + 1) % 4];
      const eTop = segment(top, v, 24);
      const eBot = segment(bot, v, 24);
      const eMid = segment(v, next, 16);
      pts.push(...eTop, ...eBot, ...eMid);
      acc.push(
        ...eTop.map((p) => (p[1] > 0.8 ? 0.95 : 0.3)),
        ...eBot.map(() => 0.15),
        ...eMid.map(() => 0.5)
      );
    });
    // Equatorial inner ring
    const midRing = circleRing(0.48, 0, 36);
    pts.push(...midRing);
    acc.push(...midRing.map((_, i) => (i % 6 === 0 ? 0.8 : 0.15)));
    return fill(pts, acc);
  })();

  // 7. RoiCalculator: Tall Hyperbolic Spindle (Baland Kavisli Giperbolik Minora)
  // Slender hyperboloid: waist r = 0.22 at Y = 0, flaring to r = 0.72 at Y = +/-1.22
  const bars = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];
    const numRings = 10;
    for (let i = 0; i < numRings; i++) {
      const t = i / (numRings - 1);
      const y = -1.22 + t * 2.44;
      const r = Math.sqrt(0.24 * 0.24 + Math.pow(y * 0.54, 2));
      const ring = circleRing(r, y, 28);
      pts.push(...ring);
      const isWaist = Math.abs(y) < 0.2;
      const isTop = y > 0.9;
      acc.push(...ring.map(() => (isTop ? 0.9 : isWaist ? 0.75 : 0.1)));
    }
    // 6 vertical hyperbolic generator lines
    for (let gIdx = 0; gIdx < 6; gIdx++) {
      const a0 = (gIdx / 6) * Math.PI * 2;
      const vCurve: Vec3[] = [];
      const vAcc: number[] = [];
      for (let j = 0; j < 14; j++) {
        const t = j / 13;
        const y = -1.22 + t * 2.44;
        const r = Math.sqrt(0.24 * 0.24 + Math.pow(y * 0.54, 2));
        vCurve.push([Math.cos(a0) * r, y, Math.sin(a0) * r]);
        vAcc.push(t > 0.85 ? 0.8 : 0.15);
      }
      pts.push(...vCurve);
      acc.push(...vAcc);
    }
    return fill(pts, acc);
  })();

  // 8. FaqSection: Tall Meridian Ellipses Nest (Baland Vertikal Meridian Halqalar)
  // 3 tall vertical ellipses: height Y in [-1.22, 1.22], radius 0.62
  const ring = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];
    const rx = 0.62;
    const ry = 1.22;
    const steps = 64;

    // Ellipse 1: Front vertical meridian (XY plane)
    for (let i = 0; i < steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      pts.push([Math.cos(a) * rx, Math.sin(a) * ry, 0]);
      acc.push(i % 8 === 0 ? 0.75 : 0.1);
    }
    // Ellipse 2: Side vertical meridian (ZY plane)
    for (let i = 0; i < steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      pts.push([0, Math.sin(a) * ry, Math.cos(a) * rx]);
      acc.push(i % 8 === 0 ? 0.75 : 0.1);
    }
    // Ellipse 3: Tilted 45° vertical meridian
    for (let i = 0; i < steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const c = Math.cos(a) * rx;
      pts.push([c * 0.707, Math.sin(a) * ry, c * 0.707]);
      acc.push(i % 8 === 0 ? 0.75 : 0.1);
    }
    // Equator horizontal circle belt
    const equator = circleRing(rx, 0, 48);
    pts.push(...equator);
    acc.push(...equator.map((_, i) => (i % 6 === 0 ? 0.8 : 0.1)));

    // Center calm node
    pts.push([0, 0, 0]);
    acc.push(0.9);

    return fill(pts, acc);
  })();

  // 9. LandingFooter: Illuminated 10-Letter MakonSense Wordmark
  // Exactly 300 dots forming M · a · k · o · n · S · e · n · s · e
  // First 5 letters (Makon): crisp neutral starlight (acc = 0.15)
  // Last 5 letters (Sense): signature emerald highlight (acc = 0.95)
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

      // Dynamic z-index: sits behind glass cards (z-2) in sections 1-8,
      // steps forward (z-25) while landing into wordmark, and slips back (z-2) once fully absorbed
      if (wordmarkWeight > 0.05 && absorb < 0.98) {
        canvas.style.zIndex = '25';
      } else {
        canvas.style.zIndex = '2';
      }

      // Aspect-ratio aware scaling: wide letterform bounds for wordmark, square for columns
      const aRx = A.shape === 'wordmark' ? A.width * 0.50 : A.size * 0.44;
      const aRy = A.shape === 'wordmark' ? A.height * 0.50 : A.size * 0.44;
      const bRx = B.shape === 'wordmark' ? B.width * 0.50 : B.size * 0.44;
      const bRy = B.shape === 'wordmark' ? B.height * 0.50 : B.size * 0.44;
      const Rx = lerp(aRx, bRx, e);
      const Ry = lerp(aRy, bRy, e);
      const size = lerp(A.size, B.size, e);

      // Calm, smooth flight arc (gentle direct glide when locking into wordmark)
      const flight = Math.sin(e * Math.PI); // 0 when locked on anchor, 1 mid-flight
      const curveX = (B.shape === 'wordmark' || A.shape === 'wordmark') ? 0 : -flight * Math.min(50, vw * 0.035);
      const cx = lerp(A.cx, B.cx, e) + curveX;
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
      const base = dark ? [253, 253, 253] : [17, 17, 17];
      const scale = clamp(size / 380, 0.85, 1.45);

      /* -------- Render Pure Elegant Subtle 3D Dots & Ambient Halos -------- */
      // Whisper-quiet ambient presence in sections; plunging into letters & vanishing at footer
      for (let n = 0; n < N; n++) {
        const k = order[n];
        const depth = clamp((sz[k] + 1.4) / 2.8);
        const acc = sa[k];
        const alpha = (0.07 + wordmarkWeight * 0.15 + depth * 0.36 + acc * 0.18) * globalAlpha * dotVisibility;
        const rad = (0.75 + depth * 0.85 + acc * 0.65) * scale * dotScale;
        const r = Math.round(lerp(base[0], ACCENT[0], acc));
        const g = Math.round(lerp(base[1], ACCENT[1], acc));
        const bl = Math.round(lerp(base[2], ACCENT[2], acc));

        // Soft, refined emerald radial aura for accented nodes ("Sense" portion)
        if (acc > 0.35 && dotVisibility > 0.08) {
          ctx.fillStyle = `rgba(14,159,110,${0.09 * alpha * dotVisibility})`;
          ctx.beginPath();
          ctx.arc(sx[k], sy[k], rad * 2.5, 0, Math.PI * 2);
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
      className="hidden lg:block fixed inset-0 z-[2] pointer-events-none"
    />
  );
};

export default MorphObject;
