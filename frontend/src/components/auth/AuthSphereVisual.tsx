import React, { useEffect, useRef } from 'react';

type Vec3 = [number, number, number];

interface AuthSphereVisualProps {
  mode?: 'login' | 'register';
}

const N = 64;
const ACCENT_COLOR: [number, number, number] = [14, 159, 110]; // Signature Silky Emerald #0E9F6E

/* ------------------------------------------------------------------ */
/* UNIFORM ARC-LENGTH SAMPLER                                         */
/* Ensures identical distance between every single dot on paths       */
/* ------------------------------------------------------------------ */
class UniformPath {
  private segments: { length: number; sample: (t: number) => Vec3 }[] = [];
  public totalLen = 0;

  addLine(p1: [number, number], p2: [number, number], z = 0.0) {
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const length = Math.hypot(dx, dy);
    this.segments.push({
      length,
      sample: (t: number) => [p1[0] + dx * t, p1[1] + dy * t, z],
    });
    this.totalLen += length;
  }

  addArc(cx: number, cy: number, r: number, aStart: number, aEnd: number, z = 0.0) {
    const dAng = aEnd - aStart;
    const length = Math.abs(dAng) * r;
    this.segments.push({
      length,
      sample: (t: number) => {
        const ang = aStart + dAng * t;
        return [cx + Math.cos(ang) * r, cy + Math.sin(ang) * r, z];
      },
    });
    this.totalLen += length;
  }

  sampleEven(count: number): Vec3[] {
    const points: Vec3[] = [];
    const step = this.totalLen / count;
    for (let i = 0; i < count; i++) {
      const dist = i * step;
      let curDist = 0;
      let found = false;
      for (const seg of this.segments) {
        if (curDist + seg.length >= dist || (dist >= this.totalLen - 1e-6 && seg.length > 0)) {
          const localT = Math.max(0, Math.min(1, (dist - curDist) / Math.max(1e-9, seg.length)));
          points.push(seg.sample(localT));
          found = true;
          break;
        }
        curDist += seg.length;
      }
      if (!found && this.segments.length > 0) {
        points.push(this.segments[this.segments.length - 1].sample(1.0));
      }
    }
    return points;
  }
}

/* ------------------------------------------------------------------ */
/* OBJECT A: LOGIN (Uniform Rounded Rectangle + Entrance Arrow)       */
/* ------------------------------------------------------------------ */
function buildLoginGeometry(): { pts: Vec3[]; acc: number[] } {
  const pts: Vec3[] = [];
  const acc: number[] = [];

  const rx1 = -0.22;
  const rx2 = 0.66;
  const ry1 = -0.64;
  const ry2 = 0.64;
  const cr = 0.14; // Smooth rounded corner radius

  // 1. Continuous Rounded Rectangle Path (44 points, perfectly even spacing)
  const rectPath = new UniformPath();
  rectPath.addLine([rx1 + cr, ry2], [rx2 - cr, ry2]); // Top edge
  rectPath.addArc(rx2 - cr, ry2 - cr, cr, Math.PI / 2, 0); // Top-right arc
  rectPath.addLine([rx2, ry2 - cr], [rx2, ry1 + cr]); // Right edge
  rectPath.addArc(rx2 - cr, ry1 + cr, cr, 0, -Math.PI / 2); // Bottom-right arc
  rectPath.addLine([rx2 - cr, ry1], [rx1 + cr, ry1]); // Bottom edge
  rectPath.addArc(rx1 + cr, ry1 + cr, cr, -Math.PI / 2, -Math.PI); // Bottom-left arc
  rectPath.addLine([rx1, ry1 + cr], [rx1, ry2 - cr]); // Left edge
  rectPath.addArc(rx1 + cr, ry2 - cr, cr, Math.PI, Math.PI / 2); // Top-left arc

  const rectPts = rectPath.sampleEven(44);
  for (const p of rectPts) {
    pts.push(p);
    acc.push(0.25);
  }

  // 2. Entrance Arrow (20 points, evenly spaced)
  // Shaft (10 points from x = -0.76 to 0.14)
  for (let i = 0; i < 10; i++) {
    const t = i / 9;
    pts.push([-0.76 + t * 0.90, 0.0, 0.04]);
    acc.push(0.95);
  }

  // Upper wing (5 points from [0.14, 0] back to [-0.10, 0.20])
  for (let i = 1; i <= 5; i++) {
    const t = i / 5;
    pts.push([0.14 - t * 0.24, t * 0.20, 0.04]);
    acc.push(0.95);
  }

  // Lower wing (5 points from [0.14, 0] back to [-0.10, -0.20])
  for (let i = 1; i <= 5; i++) {
    const t = i / 5;
    pts.push([0.14 - t * 0.24, -t * 0.20, 0.04]);
    acc.push(0.95);
  }

  return { pts, acc };
}

/* ------------------------------------------------------------------ */
/* OBJECT B: REGISTER (Uniform Rounded Paper Sheet + Account Circle)  */
/* ------------------------------------------------------------------ */
function buildRegisterGeometry(): { pts: Vec3[]; acc: number[] } {
  const pts: Vec3[] = [];
  const acc: number[] = [];

  const px1 = -0.48;
  const px2 = 0.48;
  const py1 = -0.64;
  const py2 = 0.64;
  const pcr = 0.12;

  // 1. Paper Outline with Rounded Corners & Fold Cut (38 points)
  const paper = new UniformPath();
  paper.addArc(px1 + pcr, py2 - pcr, pcr, Math.PI, Math.PI / 2); // Top-left arc
  paper.addLine([px1 + pcr, py2], [0.18, py2]); // Top straight to fold cut
  paper.addLine([0.18, py2], [px2, 0.34]); // Fold diagonal cut
  paper.addLine([px2, 0.34], [px2, py1 + pcr]); // Right straight edge
  paper.addArc(px2 - pcr, py1 + pcr, pcr, 0, -Math.PI / 2); // Bottom-right arc
  paper.addLine([px2 - pcr, py1], [px1 + pcr, py1]); // Bottom edge
  paper.addArc(px1 + pcr, py1 + pcr, pcr, -Math.PI / 2, -Math.PI); // Bottom-left arc
  paper.addLine([px1, py1 + pcr], [px1, py2 - pcr]); // Left edge

  const sheetPts = paper.sampleEven(38);
  for (const p of sheetPts) {
    pts.push(p);
    acc.push(0.25);
  }

  // 2. Fold Flap (6 points)
  const flap = new UniformPath();
  flap.addLine([0.18, py2], [0.18, 0.34], 0.04);
  flap.addLine([0.18, 0.34], [px2, 0.34], 0.04);
  const flapPts = flap.sampleEven(6);
  for (const p of flapPts) {
    pts.push(p);
    acc.push(0.85);
  }

  // 3. Center Account Avatar Circle (12 points, perfectly even angles)
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2;
    pts.push([Math.cos(ang) * 0.16, 0.14 + Math.sin(ang) * 0.16, 0.04]);
    acc.push(0.95);
  }

  // 4. Data Bar (8 points, evenly spaced from -0.28 to 0.28)
  for (let i = 0; i < 8; i++) {
    const t = i / 7;
    pts.push([-0.28 + t * 0.56, -0.22, 0.02]);
    acc.push(0.65);
  }

  return { pts, acc };
}

/* ------------------------------------------------------------------ */
/* COMPONENT                                                          */
/* ------------------------------------------------------------------ */
export const AuthSphereVisual: React.FC<AuthSphereVisualProps> = ({ mode = 'login' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = canvas.clientWidth || 280;
    let h = canvas.clientHeight || 280;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth || 280;
      h = canvas.clientHeight || 280;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();
    window.addEventListener('resize', resize);
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);

    // Precompute the two perfectly uniform point formations
    const loginGeo = buildLoginGeometry();
    const regGeo = buildRegisterGeometry();

    let raf = 0;
    let last = performance.now();
    const start = last;
    let morph = modeRef.current === 'register' ? 1.0 : 0.0;

    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Smooth silky morph between Login (0) and Register (1)
      const targetMorph = modeRef.current === 'register' ? 1.0 : 0.0;
      morph += (targetMorph - morph) * (1 - Math.exp(-dt * 4.5));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const time = (now - start) / 1000;

      // Clean isometric slant ("yonboshlagan") with gentle, calm breathing (no mouse movement)
      const hover = Math.sin(time * 0.9) * 0.025;
      const yaw = 0.34 + hover;
      const pitch = -0.22 + Math.cos(time * 0.9) * 0.02;

      const cY = Math.cos(yaw), sY = Math.sin(yaw);
      const cP = Math.cos(pitch), sP = Math.sin(pitch);
      const D = 3.8;

      const cx = w * 0.5;
      const cy = h * 0.5;
      const radius = Math.min(w, h) * 0.45;

      // 3D Projection with smooth position interpolation
      const projected: { x: number; y: number; z: number; acc: number }[] = [];

      for (let k = 0; k < N; k++) {
        const pL = loginGeo.pts[k];
        const pR = regGeo.pts[k];

        const x0 = pL[0] * (1 - morph) + pR[0] * morph;
        const y0 = pL[1] * (1 - morph) + pR[1] * morph;
        const z0 = pL[2] * (1 - morph) + pR[2] * morph;

        const x1 = x0 * cY + z0 * sY;
        const z1 = -x0 * sY + z0 * cY;
        const y2 = y0 * cP - z1 * sP;
        const z2 = y0 * sP + z1 * cP;

        const persp = D / (D - z2);
        const accVal = loginGeo.acc[k] * (1 - morph) + regGeo.acc[k] * morph;

        projected.push({
          x: cx + x1 * persp * radius,
          y: cy - y2 * persp * radius,
          z: z2,
          acc: accVal,
        });
      }

      // Check current theme
      const isDark = document.documentElement.classList.contains('dark');
      const baseColor: [number, number, number] = isDark ? [253, 253, 253] : [17, 17, 17];

      // -------------------------------------------------------------
      // DRAW PURE 3D PARTICLES (NO CONNECTING LINES - PURE DOTS)
      // -------------------------------------------------------------
      const sortedIndices = Array.from({ length: N }, (_, i) => i).sort(
        (a, b) => projected[a].z - projected[b].z
      );

      for (let s = 0; s < N; s++) {
        const i = sortedIndices[s];
        const p = projected[i];
        const depth = Math.max(0, Math.min(1, (p.z + 1.2) / 2.4));
        const alpha = 0.32 + depth * 0.58 + p.acc * 0.10;
        const rad = 2.0 + depth * 1.5 + p.acc * 0.8;

        // Subtle glowing emerald halo for accent nodes (arrow, avatar, flap)
        if (p.acc > 0.5) {
          ctx.fillStyle = `rgba(14,159,110,${0.32 * alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, rad * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }

        const r = Math.round(baseColor[0] * (1 - p.acc) + ACCENT_COLOR[0] * p.acc);
        const g = Math.round(baseColor[1] * (1 - p.acc) + ACCENT_COLOR[1] * p.acc);
        const b = Math.round(baseColor[2] * (1 - p.acc) + ACCENT_COLOR[2] * p.acc);

        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full pointer-events-none select-none"
    />
  );
};

export default AuthSphereVisual;
