import React, { useEffect, useRef } from 'react';

type Vec3 = [number, number, number];

interface AuthSphereVisualProps {
  mode?: 'login' | 'register';
}

const N = 64;
const ACCENT_COLOR: [number, number, number] = [14, 159, 110]; // Signature Silky Emerald #0E9F6E

/* ---------------------------- Geometry Helpers ---------------------------- */
function seg(p1: [number, number], p2: [number, number], count: number, z = 0.0): Vec3[] {
  const out: Vec3[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / Math.max(1, count - 1);
    out.push([p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t, z]);
  }
  return out;
}

function arc(cx: number, cy: number, r: number, aStart: number, aEnd: number, count: number, z = 0.0): Vec3[] {
  const out: Vec3[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / Math.max(1, count - 1);
    const a = aStart + (aEnd - aStart) * t;
    out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, z]);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* OBJECT A: LOGIN (Rounded Tilted Rectangle + Entrance Arrow)        */
/* ------------------------------------------------------------------ */
function buildLoginGeometry(): { pts: Vec3[]; acc: number[]; edges: [number, number][] } {
  const pts: Vec3[] = [];
  const acc: number[] = [];
  const edges: [number, number][] = [];

  const rx1 = -0.25;
  const rx2 = 0.65;
  const ry1 = -0.65;
  const ry2 = 0.65;
  const cr = 0.14; // Corner radius for smooth rounded edges

  // 1. Four edges and four rounded corner arcs (40 points total)
  const t1 = seg([rx1 + cr, ry2], [rx2 - cr, ry2], 6); // Top edge
  const t2 = arc(rx2 - cr, ry2 - cr, cr, Math.PI / 2, 0, 4); // Top-right rounded corner
  const t3 = seg([rx2, ry2 - cr], [rx2, ry1 + cr], 6); // Right edge
  const t4 = arc(rx2 - cr, ry1 + cr, cr, 0, -Math.PI / 2, 4); // Bottom-right rounded corner
  const t5 = seg([rx2 - cr, ry1], [rx1 + cr, ry1], 6); // Bottom edge
  const t6 = arc(rx1 + cr, ry1 + cr, cr, -Math.PI / 2, -Math.PI, 4); // Bottom-left rounded corner
  const t7 = seg([rx1, ry1 + cr], [rx1, ry2 - cr], 6); // Left edge
  const t8 = arc(rx1 + cr, ry2 - cr, cr, Math.PI, Math.PI / 2, 4); // Top-left rounded corner

  const rectPts = [...t1, ...t2, ...t3, ...t4, ...t5, ...t6, ...t7, ...t8];
  for (let i = 0; i < rectPts.length; i++) {
    pts.push(rectPts[i]);
    acc.push(0.25);
    edges.push([i, (i + 1) % rectPts.length]);
  }

  // 2. Entrance Arrow entering the rounded rectangle (24 points total)
  const addPts = (newPts: Vec3[], aVal: number) => {
    const start = pts.length;
    for (let i = 0; i < newPts.length; i++) {
      pts.push(newPts[i]);
      acc.push(aVal);
      if (i > 0) {
        edges.push([start + i - 1, start + i]);
      }
    }
  };

  // Shaft (12 points)
  addPts(seg([-0.75, 0.0], [0.15, 0.0], 12, 0.04), 0.95);
  // Upper wing (6 points)
  addPts(seg([0.15, 0.0], [-0.05, 0.20], 6, 0.04), 0.95);
  // Lower wing (6 points)
  addPts(seg([0.15, 0.0], [-0.05, -0.20], 6, 0.04), 0.95);

  return { pts, acc, edges };
}

/* ------------------------------------------------------------------ */
/* OBJECT B: REGISTER (Rounded Paper Sheet + Account Circle)          */
/* ------------------------------------------------------------------ */
function buildRegisterGeometry(): { pts: Vec3[]; acc: number[]; edges: [number, number][] } {
  const pts: Vec3[] = [];
  const acc: number[] = [];
  const edges: [number, number][] = [];

  const px1 = -0.48;
  const px2 = 0.48;
  const py1 = -0.65;
  const py2 = 0.65;
  const pcr = 0.12; // Rounded corner radius

  // 1. Paper outline with rounded corners and top-right fold cut (34 points)
  const p1 = arc(px1 + pcr, py2 - pcr, pcr, Math.PI, Math.PI / 2, 4); // Top-left rounded corner
  const p2 = seg([px1 + pcr, py2], [0.18, py2], 4); // Top straight to fold cut
  const p3 = seg([0.18, py2], [px2, 0.35], 4); // Fold diagonal
  const p4 = seg([px2, 0.35], [px2, py1 + pcr], 5); // Right straight edge
  const p5 = arc(px2 - pcr, py1 + pcr, pcr, 0, -Math.PI / 2, 4); // Bottom-right rounded corner
  const p6 = seg([px2 - pcr, py1], [px1 + pcr, py1], 5); // Bottom straight edge
  const p7 = arc(px1 + pcr, py1 + pcr, pcr, -Math.PI / 2, -Math.PI, 4); // Bottom-left rounded corner
  const p8 = seg([px1, py1 + pcr], [px1, py2 - pcr], 4); // Left straight edge

  const sheetOutline = [...p1, ...p2, ...p3, ...p4, ...p5, ...p6, ...p7, ...p8];
  for (let i = 0; i < sheetOutline.length; i++) {
    pts.push(sheetOutline[i]);
    acc.push(i >= 8 && i <= 11 ? 0.55 : 0.25);
    edges.push([i, (i + 1) % sheetOutline.length]);
  }

  const addPts = (newPts: Vec3[], aVal: number) => {
    const start = pts.length;
    for (let i = 0; i < newPts.length; i++) {
      pts.push(newPts[i]);
      acc.push(aVal);
      if (i > 0) {
        edges.push([start + i - 1, start + i]);
      }
    }
  };

  // 2. Fold flap (6 points)
  addPts(seg([0.18, py2], [0.18, 0.35], 3, 0.04), 0.85);
  addPts(seg([0.18, 0.35], [px2, 0.35], 3, 0.04), 0.85);

  // 3. Center Account Avatar Circle (14 points)
  const cStart = pts.length;
  for (let i = 0; i < 14; i++) {
    const ang = (i / 14) * Math.PI * 2;
    pts.push([Math.cos(ang) * 0.16, 0.15 + Math.sin(ang) * 0.16, 0.04]);
    acc.push(0.95);
    if (i > 0) {
      edges.push([cStart + i - 1, cStart + i]);
    }
  }
  edges.push([cStart + 13, cStart]);

  // 4. Data Line (10 points)
  addPts(seg([-0.30, -0.22], [0.30, -0.22], 10, 0.02), 0.65);

  return { pts, acc, edges };
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

    // Precompute rounded geometries
    const loginGeo = buildLoginGeometry();
    const regGeo = buildRegisterGeometry();

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

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

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * (1 - Math.exp(-dt * 3.5));
      mouseY += (targetMouseY - mouseY) * (1 - Math.exp(-dt * 3.5));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const time = (now - start) / 1000;

      // Clean isometric slant ("yonboshlagan") with gentle floating hover
      const hover = Math.sin(time * 1.2) * 0.04;
      const yaw = 0.34 + hover + mouseX * 0.12;
      const pitch = -0.22 + mouseY * 0.10 + Math.cos(time * 1.2) * 0.03;

      const cY = Math.cos(yaw), sY = Math.sin(yaw);
      const cP = Math.cos(pitch), sP = Math.sin(pitch);
      const D = 3.8;

      const cx = w * 0.5;
      const cy = h * 0.5;
      const radius = Math.min(w, h) * 0.45;

      // 3D Projection
      const projected: { x: number; y: number; z: number; acc: number }[] = [];

      for (let k = 0; k < N; k++) {
        const pL = loginGeo.pts[k];
        const pR = regGeo.pts[k];

        // Smooth 3D position morphing
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

      // Check current theme (light mode vs dark mode)
      const isDark = document.documentElement.classList.contains('dark');
      const baseColor: [number, number, number] = isDark ? [253, 253, 253] : [17, 17, 17];

      // -------------------------------------------------------------
      // DRAW CLEAN CONNECTING LINES
      // -------------------------------------------------------------
      // 1. Login Lines (Rounded Rectangle & Entrance Arrow)
      if (morph < 0.98) {
        const alphaFade = 1 - morph;
        ctx.lineWidth = 1.0;

        for (let e = 0; e < loginGeo.edges.length; e++) {
          const [i, j] = loginGeo.edges[e];
          const p1 = projected[i];
          const p2 = projected[j];
          const avgZ = (p1.z + p2.z) * 0.5;
          const depth = Math.max(0, Math.min(1, (avgZ + 1.2) / 2.4));
          const lineAlpha = (0.08 + depth * 0.28) * alphaFade;
          const isAccent = p1.acc > 0.6 || p2.acc > 0.6;

          ctx.strokeStyle = isAccent
            ? `rgba(14,159,110,${lineAlpha * 2.0})`
            : isDark
            ? `rgba(255,255,255,${lineAlpha * 0.85})`
            : `rgba(17,17,17,${lineAlpha * 0.75})`;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // 2. Register Lines (Rounded Paper Sheet & Account Circle)
      if (morph > 0.02) {
        const alphaFade = morph;
        ctx.lineWidth = 1.0;

        for (let e = 0; e < regGeo.edges.length; e++) {
          const [i, j] = regGeo.edges[e];
          const p1 = projected[i];
          const p2 = projected[j];
          const avgZ = (p1.z + p2.z) * 0.5;
          const depth = Math.max(0, Math.min(1, (avgZ + 1.2) / 2.4));
          const lineAlpha = (0.08 + depth * 0.28) * alphaFade;
          const isAccent = p1.acc > 0.6 || p2.acc > 0.6;

          ctx.strokeStyle = isAccent
            ? `rgba(14,159,110,${lineAlpha * 2.0})`
            : isDark
            ? `rgba(255,255,255,${lineAlpha * 0.85})`
            : `rgba(17,17,17,${lineAlpha * 0.75})`;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // -------------------------------------------------------------
      // DRAW MINIMAL 3D PARTICLES (64 points, rounded, pure & distinct)
      // -------------------------------------------------------------
      const sortedIndices = Array.from({ length: N }, (_, i) => i).sort(
        (a, b) => projected[a].z - projected[b].z
      );

      for (let s = 0; s < N; s++) {
        const i = sortedIndices[s];
        const p = projected[i];
        const depth = Math.max(0, Math.min(1, (p.z + 1.2) / 2.4));
        const alpha = 0.25 + depth * 0.65 + p.acc * 0.15;
        const rad = 1.6 + depth * 1.6 + p.acc * 0.8;

        // Subtle glowing emerald halo for accent nodes (arrow, avatar)
        if (p.acc > 0.5) {
          ctx.fillStyle = `rgba(14,159,110,${0.28 * alpha})`;
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
      window.removeEventListener('mousemove', onMouseMove);
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
