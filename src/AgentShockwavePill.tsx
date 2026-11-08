import React, { useState, useRef } from 'react';
import { Sparkles, X, Send, ArrowRight, Palette, Play } from 'lucide-react';
import { PALETTES } from './ShockwaveHalo';
import type { HaloPalette } from './ShockwaveHalo';

interface AgentShockwavePillProps {
  onTriggerHalo: (options: { x: number; y: number; palette: HaloPalette }) => void;
  theme: 'light' | 'dark';
}

export function AgentShockwavePill({ onTriggerHalo, theme }: AgentShockwavePillProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState<HaloPalette>('aurora');
  const [inputValue, setInputValue] = useState('');
  const pillRef = useRef<HTMLDivElement | null>(null);

  const handleOpen = (e: React.MouseEvent) => {
    if (isOpen) return;

    // Get origin coordinates from the click or pill center
    const rect = pillRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : e.clientX;
    const y = rect ? rect.top + rect.height / 2 : e.clientY;

    setIsOpen(true);

    // Launch shockwave 40ms after spring open starts (as in Kubai087 prompt spec)
    setTimeout(() => {
      onTriggerHalo({ x, y, palette: selectedPalette });
    }, 40);
  };

  const handleFireDirect = (e: React.MouseEvent, pal: HaloPalette) => {
    e.stopPropagation();
    setSelectedPalette(pal);
    const rect = pillRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : e.clientX;
    const y = rect ? rect.top + rect.height / 2 : e.clientY;
    onTriggerHalo({ x, y, palette: pal });
  };

  return (
    <div className="relative w-full max-w-xl mx-auto my-4 z-20">
      {/* ── Collapsed Spring Pill (Section 1) ── */}
      {!isOpen ? (
        <div
          ref={pillRef}
          onClick={handleOpen}
          className="group relative cursor-pointer flex items-center justify-between h-12 px-5 rounded-full bg-surface/90 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.12] shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.97]"
          style={{
            background:
              theme === 'dark'
                ? 'linear-gradient(135deg, rgba(30, 32, 38, 0.95), rgba(18, 20, 24, 0.95))'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(246, 248, 252, 0.95))',
          }}
        >
          {/* Subtle ambient border shine */}
          <div className="absolute inset-0 rounded-full pointer-events-none p-[1px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-7 h-7 rounded-full bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-heading">
              呼出 AI 智能体 · 体验物理冲击波光效
            </span>
          </div>

          <div className="flex items-center gap-2 relative z-10">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hidden sm:inline">
              Click to Burst
            </span>
            <div className="w-7 h-7 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      ) : (
        /* ── Expanded Card with Metal Edge & Conic Light (Section 1) ── */
        <div
          ref={pillRef}
          className="relative rounded-2xl p-5 bg-surface/95 backdrop-blur-2xl border border-black/[0.1] dark:border-white/[0.15] shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95"
          style={{
            background:
              theme === 'dark'
                ? 'linear-gradient(145deg, #181b22, #0f1115)'
                : 'linear-gradient(145deg, #ffffff, #f7f9fc)',
          }}
        >
          {/* Header & Close */}
          <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-heading tracking-tight">
                AI 智能体物理冲击波实验台 (Shockwave Lab)
              </span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center text-heading transition-colors"
              title="收起面板"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Palette Selector Tabs */}
          <div className="py-3 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-neutral-400" />
                <span>选择光学配色方案 (触发不同色域色散)</span>
              </span>
              <span className="font-mono text-[11px] text-blue-500">
                {PALETTES[selectedPalette].name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(PALETTES) as HaloPalette[]).map(pal => {
                const p = PALETTES[pal];
                const isSelected = selectedPalette === pal;
                return (
                  <button
                    key={pal}
                    onClick={e => handleFireDirect(e, pal)}
                    className={`px-3 py-2 rounded-xl text-left border transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'border-black/[0.06] dark:border-white/[0.08] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-tight">{p.name}</span>
                      <Play className="w-3 h-3 opacity-60" />
                    </div>
                    {/* Swatch gradient preview */}
                    <div
                      className="h-1.5 w-full rounded-full"
                      style={{
                        background: `linear-gradient(to right, ${p.dark.join(', ')})`,
                      }}
                    />
                    <span className="text-[10px] text-neutral-400 line-clamp-1">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Box Simulation */}
          <div className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="输入任何 AI 交互指令，或点击右侧再次激发冲击波..."
              className="flex-1 h-10 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-black/[0.06] dark:border-white/[0.08] text-xs text-heading placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const rect = pillRef.current?.getBoundingClientRect();
                  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
                  const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
                  onTriggerHalo({ x, y, palette: selectedPalette });
                }
              }}
            />
            <button
              onClick={e => {
                const rect = pillRef.current?.getBoundingClientRect();
                const x = rect ? rect.left + rect.width / 2 : e.clientX;
                const y = rect ? rect.top + rect.height / 2 : e.clientY;
                onTriggerHalo({ x, y, palette: selectedPalette });
              }}
              className="h-10 px-4 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-medium flex items-center gap-1.5 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shrink-0 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>发射冲击波</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
