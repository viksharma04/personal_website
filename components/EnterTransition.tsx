'use client';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';

interface EnterTransitionProps {
  active: boolean;
  onComplete: () => void;
}

export default function EnterTransition({ active, onComplete }: EnterTransitionProps) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!active) return;
    // Total time before navigation: quick fade for reduced motion, full flourish otherwise.
    const total = prefersReduced ? 150 : 850;
    const id = setTimeout(onComplete, total);
    return () => clearTimeout(id);
  }, [active, prefersReduced, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          data-testid="enter-transition"
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeIn' }}
        >
          {!prefersReduced && (
            <motion.div
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
