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

    // 160 Geodesic Fibonacci sphere points
    const N = 160;
    const pts: Vec3[] = [];
    const accents: number[] = [];
    const ga = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < N; i++) {
      const y = 1 - (i / Math.max(1, N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = ga * i;
      pts.push([Math.cos(theta) * r, y, Math.sin(theta) * r]);
      // Accent cluster around top-right
      accents.push(y > 0.35 && Math.cos(theta) > 0.2 ? 0.95 : 0.08);
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

      // Mouse smooth interpolation
      mouseX += (targetMouseX - mouseX) * (1 - Math.exp(-dt * 3.5));
      mouseY += (targetMouseY - mouseY) * (1 - Math.exp(-dt * 3.5));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const time = (now - start) / 1000;
      const yaw = time * 0.15 + mouseX * 0.18;
      const pitch = -0.22 + mouseY * 0.12;

      const cY = Math.cos(yaw), sY = Math.sin(yaw);
      const cP = Math.cos(pitch), sP = Math.sin(pitch);
      const D = 3.6;

      const cx = w * 0.5;
      const cy = h * 0.5;
      const radius = Math.min(w, h) * 0.42;

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

      projected.sort((a, b) => a.z - b.z);

      // Render dots & subtle emerald halos
      for (let i = 0; i < N; i++) {
        const p = projected[i];
        const depth = Math.max(0, Math.min(1, (p.z + 1.2) / 2.4));
        const alpha = 0.12 + depth * 0.72 + p.acc * 0.16;
        const rad = 1.0 + depth * 1.6 + p.acc * 0.8;

        if (p.acc > 0.4) {
          ctx.fillStyle = `rgba(14,159,110,${0.25 * alpha})`;
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
      className="w-full h-full pointer-events-none select-none"
    />
  );
};

export default AuthSphereVisual;
