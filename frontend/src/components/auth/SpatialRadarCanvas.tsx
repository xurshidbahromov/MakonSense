import React, { useEffect, useRef } from 'react';

interface CityNode {
  name: string;
  coords: string;
  x: number; // normalized -1..1
  y: number; // normalized -1..1
  score: number;
  highlight?: boolean;
}

const CITIES: CityNode[] = [
  { name: 'Toshkent', coords: '41.31°N, 69.28°E', x: 0.15, y: -0.22, score: 94.2, highlight: true },
  { name: 'Samarqand', coords: '39.65°N, 66.96°E', x: -0.42, y: 0.28, score: 88.5 },
  { name: "Farg'ona", coords: '40.38°N, 71.78°E', x: 0.52, y: 0.05, score: 84.1 },
  { name: 'Buxoro', coords: '39.77°N, 64.43°E', x: -0.68, y: -0.08, score: 81.3 },
];

export const SpatialRadarCanvas: React.FC<{ activeCategory?: string }> = ({ activeCategory = 'cafe' }) => {
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

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let angle = 0;
    let raf = 0;
    let last = performance.now();

    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * (1 - Math.exp(-dt * 3.5));
      mouseY += (targetY - mouseY) * (1 - Math.exp(-dt * 3.5));

      angle = (angle + dt * 0.75) % (Math.PI * 2);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5 + mouseX * 18;
      const cy = h * 0.5 + mouseY * 18;
      const maxR = Math.min(w, h) * 0.44;

      // 1. Concentric radar range rings
      const rings = [0.25, 0.5, 0.75, 1.0];
      rings.forEach((ratio, idx) => {
        const r = maxR * ratio;
        ctx.strokeStyle = idx === 3 ? 'rgba(14,159,110,0.22)' : 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        ctx.setLineDash(idx === 1 ? [4, 6] : []);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Distance label
        if (idx > 0) {
          ctx.fillStyle = 'rgba(255,255,255,0.25)';
          ctx.font = '9px monospace';
          ctx.fillText(`${(ratio * 20).toFixed(0)}km`, cx + r + 4, cy - 3);
        }
      });
      ctx.setLineDash([]);

      // 2. Crosshair grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.beginPath();
      ctx.moveTo(cx - maxR * 1.08, cy);
      ctx.lineTo(cx + maxR * 1.08, cy);
      ctx.moveTo(cx, cy - maxR * 1.08);
      ctx.lineTo(cx, cy + maxR * 1.08);
      ctx.stroke();

      // Degree tick markers
      for (let deg = 0; deg < 360; deg += 30) {
        const rad = (deg * Math.PI) / 180;
        const x1 = cx + Math.cos(rad) * (maxR - 5);
        const y1 = cy + Math.sin(rad) * (maxR - 5);
        const x2 = cx + Math.cos(rad) * (maxR + 5);
        const y2 = cy + Math.sin(rad) * (maxR + 5);
        ctx.strokeStyle = 'rgba(14,159,110,0.18)';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // 3. Sweeping Radar Beam with Cone Gradient
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, angle - 0.45, angle);
      ctx.closePath();
      const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      sweepGrad.addColorStop(0, 'rgba(14,159,110,0.35)');
      sweepGrad.addColorStop(0.7, 'rgba(14,159,110,0.12)');
      sweepGrad.addColorStop(1, 'rgba(14,159,110,0.0)');
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Sharp Leading Beam Edge
      ctx.strokeStyle = 'rgba(52,211,153,0.85)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
      ctx.stroke();
      ctx.restore();

      // 4. Connecting Geodesic Lines between Cities
      ctx.strokeStyle = 'rgba(14,159,110,0.14)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      CITIES.forEach((c, i) => {
        const px = cx + c.x * maxR;
        const py = cy + c.y * maxR;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);

      // 5. City Nodes & Blips
      CITIES.forEach((c) => {
        const px = cx + c.x * maxR;
        const py = cy + c.y * maxR;

        // Angle difference from sweep
        const nodeAngle = Math.atan2(py - cy, px - cx);
        let diff = (angle - nodeAngle) % (Math.PI * 2);
        if (diff < 0) diff += Math.PI * 2;
        const hit = diff < 0.65;
        const intensity = hit ? Math.max(0, 1 - diff / 0.65) : 0;

        // Outer glow on hit
        if (intensity > 0) {
          ctx.fillStyle = `rgba(14,159,110,${0.35 * intensity})`;
          ctx.beginPath();
          ctx.arc(px, py, 12 + intensity * 10, 0, Math.PI * 2);
          ctx.fill();
        }

        // Pulse ring
        const pulse = (now * 0.002 + c.score) % 1;
        ctx.strokeStyle = `rgba(14,159,110,${0.4 * (1 - pulse)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(px, py, 5 + pulse * 14, 0, Math.PI * 2);
        ctx.stroke();

        // Center dot
        ctx.fillStyle = c.highlight ? '#34D399' : '#FFFFFF';
        ctx.beginPath();
        ctx.arc(px, py, c.highlight ? 4.5 : 3.5, 0, Math.PI * 2);
        ctx.fill();

        // City & Score Tag Box
        const tagX = px + 10;
        const tagY = py - 4;
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
        ctx.fillText(c.name, tagX, tagY);

        ctx.fillStyle = '#0E9F6E';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(`${c.score} SCORE`, tagX, tagY + 11);

        ctx.fillStyle = 'rgba(255,255,255,0.38)';
        ctx.font = '8px monospace';
        ctx.fillText(c.coords, tagX, tagY + 20);
      });

      // 6. Center Hub Node
      ctx.fillStyle = '#0E9F6E';
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [activeCategory]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
    />
  );
};

export default SpatialRadarCanvas;
