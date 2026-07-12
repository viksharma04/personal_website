'use client';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';

interface EnterTransitionProps {
  active: boolean;
  onComplete: () => void;
  /**
   * 'crt'  — full CRT power-on: fade to black + a bright expanding line (used
   *          when navigating to the terminal).
   * 'fade' — a quick plain fade to black, no line flourish (used when entering
   *          the room, which hands off to its own green loading bar).
   */
  variant?: 'crt' | 'fade';
}

export default function EnterTransition({
  active,
  onComplete,
  variant = 'crt',
}: EnterTransitionProps) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!active) return;
    // Time before navigation: quick fade for reduced motion; otherwise the CRT
    // flourish needs longer than the plain fade.
    const total = prefersReduced ? 150 : variant === 'crt' ? 850 : 300;
    const id = setTimeout(onComplete, total);
    return () => clearTimeout(id);
  }, [active, prefersReduced, variant, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          data-testid="enter-transition"
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: variant === 'crt' ? 0.25 : 0.2, ease: 'easeIn' }}
        >
          {variant === 'crt' && !prefersReduced && (
            <motion.div
              data-testid="crt-line"
              className="h-[3px] rounded-full bg-[#eafff0]"
              style={{
                boxShadow:
                  '0 0 18px 5px rgba(120,255,170,0.75), 0 0 60px 12px rgba(80,255,140,0.35)',
              }}
              initial={{ width: '0%', opacity: 0 }}
              animate={{ width: ['0%', '12%', '78%'], opacity: [0, 1, 1, 0.85, 1] }}
              transition={{ delay: 0.28, duration: 0.5, ease: 'easeOut' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
