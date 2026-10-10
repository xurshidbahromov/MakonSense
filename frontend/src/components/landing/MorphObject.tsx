import React, { useEffect, useRef } from 'react';

/* ------------------------------------------------------------------ */
/* Scroll-driven morphing dot object                                   */
/* A single fixed canvas renders ~384 3D dots. Each landing section    */
/* places an empty <MorphAnchor shape="..."/> slot. While scrolling,   */
/* the object rides the current anchor, then flies to the next one     */
/* and re-assembles into that section's shape.                         */
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
  | 'ring';

const N = 384;
const ACCENT: [number, number, number] = [14, 159, 110];

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

const fibSphere = (n: number, r: number, c: Vec3 = [0, 0, 0]): Vec3[] => {
  const ga = Math.PI * (3 - Math.sqrt(5));
  const out: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rr = Math.sqrt(1 - y * y);
    const th = ga * i;
    out.push([c[0] + Math.cos(th) * rr * r, c[1] + y * r, c[2] + Math.sin(th) * rr * r]);
  }
  return out;
};

const segment = (a: Vec3, b: Vec3, n: number): Vec3[] => {
  const out: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / n;
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
  }
  return out;
};

/** Dots sampled along the 12 edges of a box. */
const boxEdges = (cx: number, cz: number, w: number, y0: number, y1: number, density = 14): Vec3[] => {
  const h = w / 2;
  const x0 = cx - h, x1 = cx + h, z0 = cz - h, z1 = cz + h;
  const c = (x: number, y: number, z: number): Vec3 => [x, y, z];
  const edges: [Vec3, Vec3][] = [
    [c(x0, y0, z0), c(x1, y0, z0)], [c(x1, y0, z0), c(x1, y0, z1)],
    [c(x1, y0, z1), c(x0, y0, z1)], [c(x0, y0, z1), c(x0, y0, z0)],
    [c(x0, y1, z0), c(x1, y1, z0)], [c(x1, y1, z0), c(x1, y1, z1)],
    [c(x1, y1, z1), c(x0, y1, z1)], [c(x0, y1, z1), c(x0, y1, z0)],
    [c(x0, y0, z0), c(x0, y1, z0)], [c(x1, y0, z0), c(x1, y1, z0)],
    [c(x1, y0, z1), c(x1, y1, z1)], [c(x0, y0, z1), c(x0, y1, z1)],
  ];
  const out: Vec3[] = [];
  edges.forEach(([a, b]) => {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    out.push(...segment(a, b, Math.max(2, Math.round(len * density))));
  });
  return out;
};

/* --------------------------- formations --------------------------- */

const buildFormations = (): Record<MorphShape, Formation> => {
  // 1. Globe — Uzbekistan highlighted
  const globe = (() => {
    const pts = fibSphere(N, 1);
    const lat = (41 * Math.PI) / 180;
    const lon = (64 * Math.PI) / 180;
    const t: Vec3 = [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
    const acc = pts.map((p) => (p[0] * t[0] + p[1] * t[1] + p[2] * t[2] > 0.93 ? 1 : 0));
    return fill(pts, acc);
  })();

  // 2. Three stacked data layers
  const layers = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];
    [0.55, 0, -0.55].forEach((y, li) => {
      for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
          pts.push([-0.85 + (i / 10) * 1.7, y, -0.85 + (j / 10) * 1.7]);
          acc.push(li === 0 ? 1 : 0);
        }
      }
    });
    return fill(pts, acc);
  })();

  // 3. Ordered cube lattice — precision
  const cube = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];
    for (let i = 0; i < 7; i++)
      for (let j = 0; j < 7; j++)
        for (let k = 0; k < 7; k++) {
          pts.push([-0.72 + i * 0.24, -0.72 + j * 0.24, -0.72 + k * 0.24]);
          acc.push(i === 3 && k === 3 ? 1 : 0);
        }
    return fill(pts, acc);
  })();

  // 4. A/B towers — tall winner vs short
  const towers = (() => {
    const a = boxEdges(-0.42, 0, 0.5, -0.85, 0.85, 16);
    const b = boxEdges(0.42, 0, 0.5, -0.85, -0.05, 16);
    return fill([...a, ...b], [...a.map(() => 1), ...b.map(() => 0)]);
  })();

  // 5. Three connected steps
  const steps = (() => {
    const c: Vec3[] = [[-0.75, -0.5, 0], [0, 0.02, 0], [0.75, 0.55, 0]];
    const pts: Vec3[] = [];
    const acc: number[] = [];
    c.forEach((cc, i) => {
      const s = fibSphere(96, 0.24, cc);
      pts.push(...s);
      acc.push(...s.map(() => (i === 2 ? 1 : 0)));
    });
    const l1 = segment(c[0], c[1], 44);
    const l2 = segment(c[1], c[2], 44);
    pts.push(...l1, ...l2);
    acc.push(...l1.map(() => 0), ...l2.map(() => 0));
    return fill(pts, acc);
  })();

  // 6. Four industry clusters
  const clusters = (() => {
    const c: Vec3[] = [[-0.5, 0, -0.5], [0.5, 0, -0.5], [0.5, 0, 0.5], [-0.5, 0, 0.5]];
    const pts: Vec3[] = [];
    const acc: number[] = [];
    c.forEach((cc, i) => {
      const s = fibSphere(96, 0.3, cc);
      pts.push(...s);
      acc.push(...s.map(() => (i === 0 ? 1 : 0)));
    });
    return fill(pts, acc);
  })();

  // 7. Growth bars — ROI
  const bars = (() => {
    const heights = [0.35, 0.6, 0.9, 1.2, 1.6];
    const pts: Vec3[] = [];
    const acc: number[] = [];
    heights.forEach((h, i) => {
      const b = boxEdges(-0.8 + i * 0.4, 0, 0.24, -0.8, -0.8 + h, 14);
      pts.push(...b);
      acc.push(...b.map(() => (i === heights.length - 1 ? 1 : 0)));
    });
    return fill(pts, acc);
  })();

  // 8. Calm ring — FAQ
  const ring = (() => {
    const pts: Vec3[] = [];
    const acc: number[] = [];
    for (let u = 0; u < 32; u++) {
      for (let v = 0; v < 12; v++) {
        const a = (u / 32) * Math.PI * 2;
        const b = (v / 12) * Math.PI * 2;
        const R = 0.72, r = 0.2;
        pts.push([(R + r * Math.cos(b)) * Math.cos(a), r * Math.sin(b), (R + r * Math.cos(b)) * Math.sin(a)]);
        acc.push(u % 8 === 0 && v === 0 ? 1 : 0);
      }
    }
    return fill(pts, acc);
  })();

  return { globe, layers, cube, towers, steps, clusters, bars, ring };
};

/* ---------------------------- easing ------------------------------ */

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* --------------------------- anchor slot -------------------------- */

export const MorphAnchor: React.FC<{ shape: MorphShape; className?: string }> = ({ shape, className = '' }) => (
  <div aria-hidden data-morph={shape} className={`hidden lg:block flex-shrink-0 ${className}`} />
);

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

    // Per-dot random scatter direction (used while flying / intro)
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
        targetP = idx + easeInOutCubic(clamp((t - 0.22) / 0.56));
      }

      if (smoothP === null) smoothP = targetP;
      smoothP += (targetP - smoothP) * (1 - Math.exp(-dt * 9));
      const P = smoothP;

      const a = Math.min(anchors.length - 1, Math.floor(P));
      const b = Math.min(anchors.length - 1, a + 1);
      const e = clamp(P - a);
      const A = anchors[a];
      const B = anchors[b];
      const fa = formations[A.shape];
      const fb = formations[B.shape];

      const flight = Math.sin(e * Math.PI); // 0 when docked, 1 mid-flight
      const cx = lerp(A.cx, B.cx, e) - flight * Math.min(160, vw * 0.1);
      const cy = lerp(A.cy, B.cy, e);
      const size = lerp(A.size, B.size, e);
      const R = size * 0.4;

      /* -------- intro assemble -------- */
      const intro = reduced ? 1 : easeOutCubic(clamp((now - start) / 1400));
      const scatter = flight * 0.5 + (1 - intro) * 1.4;
      const globalAlpha = clamp((now - start) / 600);

      /* -------- rotation -------- */
      const time = reduced ? 0 : (now - start) / 1000;
      const yaw = time * 0.28 + P * Math.PI * 0.5;
      const pitch = -0.38;
      const cY = Math.cos(yaw), sY = Math.sin(yaw);
      const cP = Math.cos(pitch), sP = Math.sin(pitch);
      const D = 3.4;

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

        const persp = D / (D - z2);
        sx[k] = cx + x1 * persp * R;
        sy[k] = cy - y2 * persp * R;
        sz[k] = z2;
        sa[k] = lerp(fa.accent[k], fb.accent[k], e);
      }

      order.sort((i, j) => sz[i] - sz[j]);

      const dark = document.documentElement.classList.contains('dark');
      const base = dark ? [253, 253, 253] : [17, 17, 17];
      const scale = clamp(size / 380, 0.7, 1.35);

      for (let n = 0; n < N; n++) {
        const k = order[n];
        const depth = clamp((sz[k] + 1.3) / 2.6);
        const acc = sa[k];
        const alpha = (0.16 + depth * 0.7 + acc * 0.2) * globalAlpha;
        const rad = (0.85 + depth * 1.05 + acc * 0.9) * scale;
        const r = Math.round(lerp(base[0], ACCENT[0], acc));
        const g = Math.round(lerp(base[1], ACCENT[1], acc));
        const bl = Math.round(lerp(base[2], ACCENT[2], acc));

        if (acc > 0.5) {
          ctx.fillStyle = `rgba(14,159,110,${0.12 * alpha})`;
          ctx.beginPath();
          ctx.arc(sx[k], sy[k], rad * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
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
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="hidden lg:block fixed inset-0 z-20 pointer-events-none"
    />
  );
};

export default MorphObject;
