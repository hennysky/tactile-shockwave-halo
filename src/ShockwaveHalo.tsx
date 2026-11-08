import React, { useEffect, useRef, useCallback } from 'react';

export type HaloPalette = 'aurora' | 'halo' | 'frost' | 'spark';

export interface PaletteColors {
  name: string;
  label: string;
  dark: [string, string, string, string];
  light: [string, string, string, string];
}

export const PALETTES: Record<HaloPalette, PaletteColors> = {
  aurora: {
    name: 'Aurora',
    label: '极光蓝紫粉桃',
    dark: [
      'rgb(80, 140, 255)',
      'rgb(160, 110, 255)',
      'rgb(255, 110, 180)',
      'rgb(255, 190, 140)',
    ],
    light: [
      'rgb(110, 150, 255)',
      'rgb(180, 130, 255)',
      'rgb(255, 130, 190)',
      'rgb(255, 180, 120)',
    ],
  },
  halo: {
    name: 'Halo',
    label: '暖阳金曦',
    dark: [
      'rgb(255, 150, 60)',
      'rgb(255, 190, 70)',
      'rgb(255, 225, 120)',
      'rgb(255, 245, 210)',
    ],
    light: [
      'rgb(255, 140, 50)',
      'rgb(255, 175, 60)',
      'rgb(245, 200, 80)',
      'rgb(255, 225, 150)',
    ],
  },
  frost: {
    name: 'Frost',
    label: '清透薄荷青绿',
    dark: [
      'rgb(80, 220, 175)',
      'rgb(70, 195, 225)',
      'rgb(180, 240, 150)',
      'rgb(235, 255, 245)',
    ],
    light: [
      'rgb(40, 190, 150)',
      'rgb(50, 170, 210)',
      'rgb(140, 210, 90)',
      'rgb(180, 235, 215)',
    ],
  },
  spark: {
    name: 'Spark',
    label: '先锋紫金',
    dark: [
      'rgb(140, 100, 255)',
      'rgb(200, 130, 255)',
      'rgb(255, 200, 110)',
      'rgb(255, 235, 170)',
    ],
    light: [
      'rgb(130, 95, 240)',
      'rgb(185, 125, 245)',
      'rgb(245, 185, 80)',
      'rgb(250, 215, 120)',
    ],
  },
};

interface ShockwaveWave {
  id: number;
  originX: number;
  originY: number;
  startTime: number;
  duration: number;
  maxRadius: number;
  palette: HaloPalette;
}

interface ShockwaveHaloProps {
  theme?: 'light' | 'dark';
}

export interface ShockwaveHaloRef {
  trigger: (options?: { x?: number; y?: number; palette?: HaloPalette }) => void;
}

export const ShockwaveCanvas = React.forwardRef<ShockwaveHaloRef, ShockwaveHaloProps>(
  ({ theme = 'dark' }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const wavesRef = useRef<ShockwaveWave[]>([]);
    const nextIdRef = useRef(1);
    const animFrameRef = useRef<number | null>(null);

    const trigger = useCallback(
      (options?: { x?: number; y?: number; palette?: HaloPalette }) => {
        const originX = options?.x ?? window.innerWidth / 2;
        const originY = options?.y ?? window.innerHeight * 0.75;
        const palette = options?.palette ?? 'aurora';

        // Calculate max radius needed to cover all 4 screen corners from origin
        const corners = [
          { x: 0, y: 0 },
          { x: window.innerWidth, y: 0 },
          { x: 0, y: window.innerHeight },
          { x: window.innerWidth, y: window.innerHeight },
        ];
        const maxDist = Math.max(
          ...corners.map(c => Math.hypot(c.x - originX, c.y - originY))
        );

        wavesRef.current.push({
          id: nextIdRef.current++,
          originX,
          originY,
          startTime: performance.now(),
          duration: 1100, // ~1.1s physically tuned duration
          maxRadius: maxDist + 220,
          palette,
        });

        if (!animFrameRef.current) {
          startRenderLoop();
        }
      },
      []
    );

    React.useImperativeHandle(ref, () => ({ trigger }), [trigger]);

    const startRenderLoop = () => {
      const render = (now: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize canvas if needed
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const displayWidth = window.innerWidth;
        const displayHeight = window.innerHeight;
        if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
          canvas.width = displayWidth * dpr;
          canvas.height = displayHeight * dpr;
        }

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, displayWidth, displayHeight);

        const activeWaves: ShockwaveWave[] = [];

        for (const wave of wavesRef.current) {
          const elapsed = now - wave.startTime;
          if (elapsed >= wave.duration) continue;

          activeWaves.push(wave);
          const t = Math.max(0, Math.min(1, elapsed / wave.duration));

          // Physical timing formula from Kubai087:
          // r(t) = r_start + delta_r * (1 - 2^(-9t)) / (1 - 2^(-9))
          const factor = (1 - Math.pow(2, -9 * t)) / (1 - Math.pow(2, -9));
          const currentRadius = 30 + (wave.maxRadius - 30) * factor;

          // Strength formula: min(1, t / 0.03) * (1 - t^2.2)
          const strength = Math.min(1, t / 0.03) * (1 - Math.pow(t, 2.2));

          const paletteDef = PALETTES[wave.palette] || PALETTES.aurora;
          const colors = theme === 'dark' ? paletteDef.dark : paletteDef.light;

          // Multi-layer optical shockwave rendering:
          // We draw 3 chromatic rings (Red, Green, Blue channel dispersion offsets)
          // to produce the physical chromatic aberration (通道分离) + lens gradient
          const ringWidth = 120; // w = 110~120px

          ctx.save();
          if (theme === 'dark') {
            ctx.globalCompositeOperation = 'screen';
          } else {
            ctx.globalCompositeOperation = 'multiply';
          }

          // 1. Red channel chromatic split (+8% radius offset)
          drawChromaticBand(
            ctx,
            wave.originX,
            wave.originY,
            currentRadius * 1.025,
            ringWidth,
            colors[2] || colors[0],
            strength * 0.35,
            theme
          );

          // 2. Green core physical band (Main Halo)
          drawMultiRingHalo(
            ctx,
            wave.originX,
            wave.originY,
            currentRadius,
            ringWidth,
            colors,
            strength,
            theme
          );

          // 3. Blue channel chromatic split (-8% radius offset)
          drawChromaticBand(
            ctx,
            wave.originX,
            wave.originY,
            currentRadius * 0.975,
            ringWidth,
            colors[0],
            strength * 0.32,
            theme
          );

          ctx.restore();
        }

        ctx.restore();

        wavesRef.current = activeWaves;

        if (activeWaves.length > 0) {
          animFrameRef.current = requestAnimationFrame(render);
        } else {
          animFrameRef.current = null;
        }
      };

      animFrameRef.current = requestAnimationFrame(render);
    };

    const drawMultiRingHalo = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      width: number,
      colors: [string, string, string, string],
      strength: number,
      currentTheme: 'light' | 'dark'
    ) => {
      const innerRadius = Math.max(0, radius - width * 0.6);
      const outerRadius = radius + width * 0.6;

      const grad = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
      const alphaScale = currentTheme === 'dark' ? 0.85 : 0.45;

      grad.addColorStop(0.0, 'transparent');
      grad.addColorStop(0.2, rgba(colors[0], strength * 0.45 * alphaScale));
      grad.addColorStop(0.45, rgba(colors[1], strength * 0.75 * alphaScale));
      grad.addColorStop(0.7, rgba(colors[2], strength * 0.8 * alphaScale));
      grad.addColorStop(0.9, rgba(colors[3], strength * 0.4 * alphaScale));
      grad.addColorStop(1.0, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawChromaticBand = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      width: number,
      color: string,
      strength: number,
      currentTheme: 'light' | 'dark'
    ) => {
      const innerRadius = Math.max(0, radius - width * 0.4);
      const outerRadius = radius + width * 0.4;

      const grad = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
      const alphaScale = currentTheme === 'dark' ? 0.5 : 0.25;

      grad.addColorStop(0.0, 'transparent');
      grad.addColorStop(0.5, rgba(color, strength * alphaScale));
      grad.addColorStop(1.0, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    const rgba = (rgbStr: string, alpha: number) => {
      // Convert 'rgb(r, g, b)' to 'rgba(r, g, b, alpha)'
      const match = rgbStr.match(/\d+,\s*\d+,\s*\d+/);
      if (match) {
        return `rgba(${match[0]}, ${Math.max(0, Math.min(1, alpha)).toFixed(3)})`;
      }
      return rgbStr;
    };

    useEffect(() => {
      return () => {
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-40 w-full h-full"
        style={{
          mixBlendMode: theme === 'dark' ? 'screen' : 'multiply',
        }}
      />
    );
  }
);
