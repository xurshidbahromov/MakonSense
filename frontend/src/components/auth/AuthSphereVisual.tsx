import React, { useEffect, useRef } from 'react';

type Vec3 = [number, number, number];

export const AuthSphereVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    // 150 Geodesic Fibonacci sphere points
    const N = 150;
    const pts: Vec3[] = [];
    const accents: number[] = [];
    const ga = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < N; i++) {
      const y = 1 - (i / Math.max(1, N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = ga * i;
      pts.push([Math.cos(theta) * r, y, Math.sin(theta) * r]);
      // Accent cluster around top-right quadrant
      accents.push(y > 0.25 && Math.cos(theta) > 0.2 ? 0.95 : 0.08);
    }

    // Precompute geodesic network edges
    const edges: [number, number][] = [];
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = pts[i][0] - pts[j][0];
        const dy = pts[i][1] - pts[j][1];
        const dz = pts[i][2] - pts[j][2];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < 0.14) {
          edges.push([i, j]);
        }
      }
    }

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

    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * (1 - Math.exp(-dt * 3.5));
      mouseY += (targetMouseY - mouseY) * (1 - Math.exp(-dt * 3.5));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const time = (now - start) / 1000;
      const yaw = time * 0.16 + mouseX * 0.2;
      const pitch = -0.2 + mouseY * 0.15;

      const cY = Math.cos(yaw), sY = Math.sin(yaw);
      const cP = Math.cos(pitch), sP = Math.sin(pitch);
      const D = 3.6;

      const cx = w * 0.5;
      const cy = h * 0.5;
      const radius = Math.min(w, h) * 0.44;

      // 3D Projection
      const projected: { x: number; y: number; z: number; acc: number }[] = [];

      for (let k = 0; k < N; k++) {
        const [x0, y0, z0] = pts[k];
        const x1 = x0 * cY + z0 * sY;
        const z1 = -x0 * sY + z0 * cY;
        const y2 = y0 * cP - z1 * sP;
        const z2 = y0 * sP + z1 * cP;

        const persp = D / (D - z2);
        projected.push({
          x: cx + x1 * persp * radius,
          y: cy - y2 * persp * radius,
          z: z2,
          acc: accents[k],
        });
      }

      // Draw faint geodesic network lines (connecting nodes)
      ctx.lineWidth = 0.75;
      for (let e = 0; e < edges.length; e++) {
        const [i, j] = edges[e];
        const p1 = projected[i];
        const p2 = projected[j];
        const avgZ = (p1.z + p2.z) * 0.5;
        if (avgZ > -0.6) {
          const depth = Math.max(0, Math.min(1, (avgZ + 1.2) / 2.4));
          const lineAlpha = (0.04 + depth * 0.16) * 0.9;
          const isAccent = p1.acc > 0.4 || p2.acc > 0.4;

          ctx.strokeStyle = isAccent
            ? `rgba(14,159,110,${lineAlpha * 1.5})`
            : `rgba(255,255,255,${lineAlpha})`;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Draw nodes sorted by depth
      const sortedIndices = Array.from({ length: N }, (_, i) => i).sort(
        (a, b) => projected[a].z - projected[b].z
      );

      for (let s = 0; s < N; s++) {
        const i = sortedIndices[s];
        const p = projected[i];
        const depth = Math.max(0, Math.min(1, (p.z + 1.2) / 2.4));
        const alpha = 0.15 + depth * 0.75 + p.acc * 0.15;
        const rad = 1.0 + depth * 1.6 + p.acc * 0.9;

        // Glowing halo for accent nodes
        if (p.acc > 0.4) {
          ctx.fillStyle = `rgba(14,159,110,${0.3 * alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, rad * 3, 0, Math.PI * 2);
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
      className="w-full h-full pointer-events-none select-none"
    />
  );
};

export default AuthSphereVisual;
