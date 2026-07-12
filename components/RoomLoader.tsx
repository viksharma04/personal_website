'use client';
import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Full-screen retro loading overlay for the 3D room. Replaces the old spinning
 * circle with an indeterminate green sweep bar over black, styled to match the
 * terminal's CRT aesthetic. Reads drei's global loading state so it covers the
 * scene from first paint and fades out once assets are ready.
 */
export default function RoomLoader() {
  const { active, progress } = useProgress();
  const prefersReduced = useReducedMotion();
  // When we return to /room via client-side navigation, drei's asset cache is
  // already warm, so `active` never flips true — there is nothing to wait for.
  // Detect that up front so the loader doesn't even flash on re-entry.
  const [visible, setVisible] = useState(() => active || progress < 100);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Ignore the initial idle state (active is false before loading begins);
    // only hide once loading has actually started and then finished...
    if (active) {
      setStarted(true);
      return;
    }
    // ...or when the assets were already loaded when we mounted (progress is at
    // 100 with nothing active), which is the cached client-side-nav case.
    if (started || progress >= 100) {
      const id = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(id);
    }
  }, [active, started, progress]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          data-testid="room-loader"
          className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.4 }}
        >
          {/* faint CRT scanlines */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, rgba(0,255,120,0.25) 0px, rgba(0,255,120,0.25) 1px, transparent 1px, transparent 3px)',
            }}
          />

          {/* bar track */}
          <div
            className="relative h-[6px] w-[min(60vw,320px)] overflow-hidden rounded-full"
            style={{
              background: 'rgba(0,255,120,0.12)',
              boxShadow: 'inset 0 0 6px rgba(0,255,120,0.25)',
            }}
          >
            {prefersReduced ? (
              // Reduced motion: a static, gently glowing centered segment.
              <div
                className="absolute left-1/2 top-0 h-full w-2/5 -translate-x-1/2 rounded-full"
                style={{
                  background: '#4dff9d',
                  boxShadow: '0 0 12px 2px rgba(80,255,140,0.7)',
                }}
              />
            ) : (
              // Indeterminate sweep across the track.
              <motion.div
                className="absolute top-0 h-full w-1/3 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, #4dff9d, transparent)',
                  boxShadow: '0 0 12px 2px rgba(80,255,140,0.7)',
                }}
                animate={{ x: ['-100%', '400%'] }}
                transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
              />
            )}
          </div>

          <span
            className="mt-4 font-terminal text-sm uppercase tracking-[0.3em]"
            style={{ color: '#5cff9d', textShadow: '0 0 6px rgba(0,255,120,0.8)' }}
          >
            Loading…
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
