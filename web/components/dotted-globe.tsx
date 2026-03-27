"use client";

import { useEffect, useRef } from "react";

export function DottedGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 400;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = 155;
    const dots: { lat: number; lon: number }[] = [];

    for (let lat = -90; lat <= 90; lat += 7) {
      const latRad = (lat * Math.PI) / 180;
      const r = Math.cos(latRad);
      const numDots = Math.max(1, Math.round(2 * Math.PI * r * 4.5));
      for (let i = 0; i < numDots; i++) {
        dots.push({ lat, lon: (i / numDots) * 360 });
      }
    }

    let rotation = 0;

    function draw() {
      ctx!.clearRect(0, 0, size, size);
      rotation += 0.12;

      for (const dot of dots) {
        const latRad = (dot.lat * Math.PI) / 180;
        const lonRad = ((dot.lon + rotation) * Math.PI) / 180;

        const x3d = radius * Math.cos(latRad) * Math.sin(lonRad);
        const y3d = radius * Math.sin(latRad);
        const z3d = radius * Math.cos(latRad) * Math.cos(lonRad);

        if (z3d < -10) continue;

        const screenX = cx + x3d;
        const screenY = cy - y3d;
        const depth = (z3d + radius) / (2 * radius);
        const alpha = 0.08 + 0.5 * depth;
        const dotSize = 0.6 + 1.2 * depth;

        ctx!.beginPath();
        ctx!.arc(screenX, screenY, dotSize, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(109, 40, 217, ${alpha})`;
        ctx!.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-[400px] h-[400px]" />;
}
