import React, { useEffect, useRef } from 'react';

type Vec3 = [number, number, number];

interface AuthSphereVisualProps {
  mode: 'login' | 'register';
}

export const AuthSphereVisual: React.FC<AuthSphereVisualProps> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = canvas.clientWidth;
    let h = canvas.clientHeight;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const N = 160;

    // -------------------------------------------------------------
    // SHAPE A: REGISTER MODE (Geodesic Fibonacci Constellation Globe)
    // -------------------------------------------------------------
    const regPts: Vec3[] = [];
    const regAccents: number[] = [];
    const ga = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < N; i++) {
      const y = 1 - (i / Math.max(1, N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = ga * i;
      regPts.push([Math.cos(theta) * r * 1.05, y * 1.05, Math.sin(theta) * r * 1.05]);
      regAccents.push(y > 0.25 && Math.cos(theta) > 0.15 ? 0.95 : 0.08);
    }

    // Geodesic mesh edges for Register mode
    const regEdges: [number, number][] = [];
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = regPts[i][0] - regPts[j][0];
        const dy = regPts[i][1] - regPts[j][1];
        const dz = regPts[i][2] - regPts[j][2];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < 0.13) {
          regEdges.push([i, j]);
        }
      }
    }

    // -------------------------------------------------------------
    // SHAPE B: LOGIN MODE (Aperture / Quantum Lock / Gyroscope Portal)
    // -------------------------------------------------------------
    const loginPts: Vec3[] = [];
    const loginAccents: number[] = [];
    const loginEdges: [number, number][] = [];

    // Group 1: Core Vault Lock (i: 0..23, 24 points)
    const CORE_COUNT = 24;
    for (let i = 0; i < CORE_COUNT; i++) {
      const angle = (i / CORE_COUNT) * Math.PI * 2;
      const radius = 0.22;
      const zOffset = Math.sin(angle * 2) * 0.04;
      loginPts.push([Math.cos(angle) * radius, Math.sin(angle) * radius * 0.4, Math.sin(angle) * radius + zOffset]);
      loginAccents.push(1.0); // Bright emerald lock core
      if (i > 0) loginEdges.push([i - 1, i]);
      if (i === CORE_COUNT - 1) loginEdges.push([i, 0]);
    }

    // Group 2: Inner Gimbal Ring tilted at +45 deg (i: 24..67, 44 points)
    const INNER_START = 24;
    const INNER_COUNT = 44;
    const tilt1 = Math.PI / 4;
    for (let i = 0; i < INNER_COUNT; i++) {
      const angle = (i / INNER_COUNT) * Math.PI * 2;
      const r = 0.58;
      const x0 = Math.cos(angle) * r;
      const y0 = Math.sin(angle) * r;
      // Tilt around X axis
      const x = x0;
      const y = y0 * Math.cos(tilt1);
      const z = y0 * Math.sin(tilt1);
      loginPts.push([x, y, z]);
      loginAccents.push(i % 4 === 0 ? 0.8 : 0.1);
      const curr = INNER_START + i;
      if (i > 0) loginEdges.push([curr - 1, curr]);
      if (i === INNER_COUNT - 1) loginEdges.push([curr, INNER_START]);
    }

    // Group 3: Mid Gimbal Ring tilted at -45 deg (i: 68..115, 48 points)
    const MID_START = 68;
    const MID_COUNT = 48;
    const tilt2 = -Math.PI / 4;
    for (let i = 0; i < MID_COUNT; i++) {
      const angle = (i / MID_COUNT) * Math.PI * 2;
      const r = 0.86;
      const x0 = Math.cos(angle) * r;
      const y0 = Math.sin(angle) * r;
      // Tilt around X axis
      const x = x0;
      const y = y0 * Math.cos(tilt2);
      const z = y0 * Math.sin(tilt2);
      loginPts.push([x, y, z]);
      loginAccents.push(i % 5 === 0 ? 0.75 : 0.05);
      const curr = MID_START + i;
      if (i > 0) loginEdges.push([curr - 1, curr]);
      if (i === MID_COUNT - 1) loginEdges.push([curr, MID_START]);
    }

    // Group 4: Outer Aperture Ring (i: 116..159, 44 points)
    const OUTER_START = 116;
    const OUTER_COUNT = N - OUTER_START;
    for (let i = 0; i < OUTER_COUNT; i++) {
      const angle = (i / OUTER_COUNT) * Math.PI * 2;
      const r = 1.14;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle * 4) * 0.05;
      const z = Math.sin(angle) * r;
      loginPts.push([x, y, z]);
      loginAccents.push(i % 6 === 0 ? 0.9 : 0.05);
      const curr = OUTER_START + i;
      if (i > 0) loginEdges.push([curr - 1, curr]);
      if (i === OUTER_COUNT - 1) loginEdges.push([curr, OUTER_START]);
    }

    // Alignment crosshairs between rings for Login mode
    loginEdges.push([0, INNER_START]);
    loginEdges.push([Math.floor(CORE_COUNT / 2), INNER_START + Math.floor(INNER_COUNT / 2)]);
    loginEdges.push([INNER_START, MID_START]);
    loginEdges.push([MID_START, OUTER_START]);

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

      // Smooth morph between Login (0) and Register (1)
      const targetMorph = modeRef.current === 'register' ? 1.0 : 0.0;
      morph += (targetMorph - morph) * (1 - Math.exp(-dt * 4.2));

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * (1 - Math.exp(-dt * 3.5));
      mouseY += (targetMouseY - mouseY) * (1 - Math.exp(-dt * 3.5));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const time = (now - start) / 1000;

      // Dynamics depend on mode:
      // Login: focused gimbal rotation, slower yaw, slight pitch
      // Register: full 3D planetary orbit
      const yaw = time * (0.15 + (1 - morph) * 0.08) + mouseX * 0.18;
      const pitch = -0.22 + mouseY * 0.14 + (1 - morph) * 0.12 * Math.sin(time * 0.5);

      const cY = Math.cos(yaw), sY = Math.sin(yaw);
      const cP = Math.cos(pitch), sP = Math.sin(pitch);
      const D = 3.6;

      const cx = w * 0.5;
      const cy = h * 0.5;
      const radius = Math.min(w, h) * 0.42;

      // 3D Projection of interpolated vertices
      const projected: { x: number; y: number; z: number; acc: number; isCore: boolean }[] = [];

      for (let k = 0; k < N; k++) {
        const lP = loginPts[k];
        const rP = regPts[k];

        // Smooth 3D position interpolation
        let x0 = lP[0] * (1 - morph) + rP[0] * morph;
        let y0 = lP[1] * (1 - morph) + rP[1] * morph;
        let z0 = lP[2] * (1 - morph) + rP[2] * morph;

        // In login mode, core pulses gently
        const isCore = k < CORE_COUNT;
        if (isCore && morph < 0.6) {
          const corePulse = 1 + Math.sin(time * 3.5) * 0.08 * (1 - morph);
          x0 *= corePulse;
          y0 *= corePulse;
          z0 *= corePulse;
        }

        // Rotate in 3D
        const x1 = x0 * cY + z0 * sY;
        const z1 = -x0 * sY + z0 * cY;
        const y2 = y0 * cP - z1 * sP;
        const z2 = y0 * sP + z1 * cP;

        const persp = D / (D - z2);
        const acc = loginAccents[k] * (1 - morph) + regAccents[k] * morph;

        projected.push({
          x: cx + x1 * persp * radius,
          y: cy - y2 * persp * radius,
          z: z2,
          acc,
          isCore,
        });
      }

      // -----------------------------------------------------------
      // DRAW CONNECTING LINES
      // -----------------------------------------------------------
      // 1. Login Ring Tracks & Crosshairs (dominant when morph -> 0)
      if (morph < 0.92) {
        const loginLineAlphaMult = (1 - morph) * 0.9;
        ctx.lineWidth = 0.85;

        for (let e = 0; e < loginEdges.length; e++) {
          const [i, j] = loginEdges[e];
          const p1 = projected[i];
          const p2 = projected[j];
          const avgZ = (p1.z + p2.z) * 0.5;

          const depth = Math.max(0, Math.min(1, (avgZ + 1.2) / 2.4));
          const lineAlpha = (0.05 + depth * 0.22) * loginLineAlphaMult;
          const isAccent = p1.acc > 0.5 || p2.acc > 0.5;

          ctx.strokeStyle = isAccent
            ? `rgba(14,159,110,${lineAlpha * 1.8})`
            : `rgba(255,255,255,${lineAlpha * 0.85})`;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // 2. Register Geodesic Network Mesh (dominant when morph -> 1)
      if (morph > 0.08) {
        const regLineAlphaMult = morph * 0.85;
        ctx.lineWidth = 0.75;

        for (let e = 0; e < regEdges.length; e++) {
          const [i, j] = regEdges[e];
          const p1 = projected[i];
          const p2 = projected[j];
          const avgZ = (p1.z + p2.z) * 0.5;

          if (avgZ > -0.6) {
            const depth = Math.max(0, Math.min(1, (avgZ + 1.2) / 2.4));
            const lineAlpha = (0.04 + depth * 0.18) * regLineAlphaMult;
            const isAccent = p1.acc > 0.4 || p2.acc > 0.4;

            ctx.strokeStyle = isAccent
              ? `rgba(14,159,110,${lineAlpha * 1.6})`
              : `rgba(255,255,255,${lineAlpha * 0.75})`;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // -----------------------------------------------------------
      // DRAW NODES (Sorted by 3D depth)
      // -----------------------------------------------------------
      const sortedIndices = Array.from({ length: N }, (_, i) => i).sort(
        (a, b) => projected[a].z - projected[b].z
      );

      for (let s = 0; s < N; s++) {
        const i = sortedIndices[s];
        const p = projected[i];
        const depth = Math.max(0, Math.min(1, (p.z + 1.2) / 2.4));
        const alpha = 0.16 + depth * 0.74 + p.acc * 0.15;
        let rad = 1.0 + depth * 1.5 + p.acc * 0.9;

        // In Login mode, central lock nodes have luminous aura
        if (p.isCore && morph < 0.6) {
          rad += (1 - morph) * 0.8;
          ctx.fillStyle = `rgba(14,159,110,${0.35 * (1 - morph) * alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, rad * 3.4, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.acc > 0.4) {
          ctx.fillStyle = `rgba(14,159,110,${0.28 * alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, rad * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }

        const r = Math.round(253 * (1 - p.acc) + 14 * p.acc);
        const g = Math.round(253 * (1 - p.acc) + 159 * p.acc);
        const b = Math.round(253 * (1 - p.acc) + 110 * p.acc);

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
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full pointer-events-none select-none transition-opacity duration-300"
    />
  );
};

export default AuthSphereVisual;
