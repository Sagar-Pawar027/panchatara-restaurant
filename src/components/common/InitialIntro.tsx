import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface InitialIntroProps {
  onComplete?: () => void;
}

export function InitialIntro({ onComplete }: InitialIntroProps) {
  const [isVisible, setIsVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // If user prefers reduced motion, skip intro directly
    if (shouldReduceMotion) {
      setIsVisible(false);
      onComplete?.();
      return;
    }

    // Check if user already saw the intro in this session
    const hasSeen = sessionStorage.getItem('panchtara_intro_played');
    if (hasSeen) {
      setIsVisible(false);
      onComplete?.();
      return;
    }

    // Auto dismiss after ~1.4 seconds with dignified cinematic pacing
    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('panchtara_intro_played', 'true');
      onComplete?.();
    }, 1350);

    return () => clearTimeout(timer);
  }, [onComplete, shouldReduceMotion]);

  const handleSkip = () => {
    setIsVisible(false);
    sessionStorage.setItem('panchtara_intro_played', 'true');
    onComplete?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="panchtara-initial-intro-curtain"
          initial={{ opacity: 1, y: 0 }}
          exit={{ y: '-100%', opacity: 0.98 }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0E0D0B] text-[#FAF7F2] select-none"
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.12)_0%,transparent_70%)] pointer-events-none" />

          {/* Logo Brandmark reveal */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center relative z-10 px-6"
          >
            {/* Five-star symbol (Panchtara) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="flex justify-center items-center gap-2.5 mb-4 text-[#C5A880]"
            >
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.4 }}
                  className="text-xs tracking-widest text-[#C5A880]/85"
                >
                  ✦
                </motion.span>
              ))}
            </motion.div>

            {/* Brand Headline with masked line reveal */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-editorial-display text-2xl md:text-3xl lg:text-4xl text-[#FAF7F2] uppercase font-light tracking-[0.25em]"
              >
                Panjtara
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="text-[10px] md:text-xs tracking-[0.35em] text-[#C5A880] uppercase mt-3 font-editorial-sans font-light"
            >
              100% Pure Veg • Indore Bypass
            </motion.p>
          </motion.div>

          {/* Subtle progress rule */}
          <div className="absolute bottom-12 w-28 h-[1px] bg-white/10 overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.25, ease: 'easeInOut' }}
              className="w-full h-full bg-[#C5A880]"
            />
          </div>

          {/* Skip button for instant access */}
          <button
            id="intro-skip-btn"
            onClick={handleSkip}
            className="absolute bottom-5 text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-[#C5A880] transition-colors"
          >
            Enter Sanctuary →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
