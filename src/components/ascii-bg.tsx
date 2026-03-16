"use client";

import { useEffect, useRef, useCallback } from "react";

const CHARS = "+×·•○◊∘⊹⋅∗#@%=~-|/\\{}[]()&$!?<>^01".split("");
const CELL_W = 11;
const CELL_H = 13;
const RIPPLE_RADIUS = 180;
const FADE_SPEED = 0.002;
const DRIFT_SPEED = 0.08;
const AUTO_RIPPLE_RADIUS = 200;
const AUTO_RIPPLE_COUNT = 3;

const RIPPLE_COLORS = [
  [100, 120, 220],
  [130, 100, 200],
  [80, 140, 240],
  [160, 100, 220],
  [90, 160, 200],
];

type Cell = {
  char: string;
  baseOpacity: number;
  opacity: number;
  phase: number;
  driftX: number;
  driftY: number;
  driftPhase: number;
  colorIdx: number;
};

export function AsciiBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const cellsRef = useRef<Cell[]>([]);
  const dimsRef = useRef({ cols: 0, rows: 0, width: 0, height: 0 });
  const rafRef = useRef<number>(0);
  const autoRipplesRef = useRef(
    Array.from({ length: AUTO_RIPPLE_COUNT }, (_, i) => ({
      phase: (i / AUTO_RIPPLE_COUNT) * Math.PI * 2,
      speedX: 0.3 + Math.random() * 0.2,
      speedY: 0.2 + Math.random() * 0.15,
      offsetX: Math.random() * Math.PI * 2,
      offsetY: Math.random() * Math.PI * 2,
    }))
  );

  const initCells = useCallback((cols: number, rows: number) => {
    const cells: Cell[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        cells.push({
          char: CHARS[Math.floor(Math.random() * CHARS.length)],
          baseOpacity: 0.06 + Math.random() * 0.09,
          opacity: 0.06 + Math.random() * 0.09,
          phase: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * 2,
          driftY: (Math.random() - 0.5) * 2,
          driftPhase: Math.random() * Math.PI * 2,
          colorIdx: Math.floor(Math.random() * RIPPLE_COLORS.length),
        });
      }
    }
    cellsRef.current = cells;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    function resize() {
      if (!canvas || !parent || !ctx) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const cols = Math.ceil(w / CELL_W) + 2;
      const rows = Math.ceil(h / CELL_H) + 2;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);

      dimsRef.current = { cols, rows, width: w, height: h };
      initCells(cols, rows);
    }

    resize();
    window.addEventListener("resize", resize);

    let time = 0;

    function animate() {
      const { cols, rows, width, height } = dimsRef.current;
      if (!ctx || !cols) return;
      time += 1;
      ctx.clearRect(0, 0, width, height);
      ctx.font = '12px "SF Mono", ui-monospace, monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Compute auto-ripple positions
      const autoRipples = autoRipplesRef.current.map((r) => ({
        x: (Math.sin(time * 0.005 * r.speedX + r.offsetX) * 0.5 + 0.5) * width,
        y: (Math.cos(time * 0.005 * r.speedY + r.offsetY) * 0.5 + 0.5) * height,
      }));

      const cells = cellsRef.current;
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const col = i % cols;
        const row = Math.floor(i / cols);

        const driftOffsetX =
          Math.sin(time * DRIFT_SPEED * 0.01 + cell.driftPhase) *
          cell.driftX * 2;
        const driftOffsetY =
          Math.cos(time * DRIFT_SPEED * 0.01 + cell.driftPhase * 1.3) *
          cell.driftY * 2;

        const cx = col * CELL_W + CELL_W / 2 + driftOffsetX;
        const cy = row * CELL_H + CELL_H / 2 + driftOffsetY;

        // Fade cycle
        const fadeCycle =
          Math.sin(time * FADE_SPEED + cell.phase) * 0.5 + 0.5;
        cell.opacity = cell.baseOpacity * (0.3 + fadeCycle * 0.7);

        // Default: subtle colored animation
        const color = RIPPLE_COLORS[cell.colorIdx];
        const baseAlpha = cell.opacity * 1.5;

        // Auto-ripple — ambient glow that drifts across the canvas
        let autoIntensity = 0;
        for (let r = 0; r < autoRipples.length; r++) {
          const adx = cx - autoRipples[r].x;
          const ady = cy - autoRipples[r].y;
          const adist = Math.sqrt(adx * adx + ady * ady);
          if (adist < AUTO_RIPPLE_RADIUS) {
            const t = 1 - adist / AUTO_RIPPLE_RADIUS;
            autoIntensity = Math.max(autoIntensity, t * t * 0.45);
          }
        }

        // Ripple on hover — accentuates the default animation
        const dx = cx - mx;
        const dy = cy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let alpha = baseAlpha + autoIntensity;

        if (dist < RIPPLE_RADIUS) {
          const t = 1 - dist / RIPPLE_RADIUS;
          const intensity = t * t;

          // Swap chars near cursor
          if (dist < 60 && Math.random() < 0.03) {
            cell.char = CHARS[Math.floor(Math.random() * CHARS.length)];
          }

          alpha = Math.min(alpha + intensity * 0.8, 0.95);
        }

        alpha = Math.min(alpha, 0.95);
        ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
        ctx.fillText(cell.char, cx, cy);
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [initCells]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none select-none w-full h-full"
      />
      <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
