import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface InitialIntroProps {
  onComplete?: () => void;
}

const LOADING_STEPS = [
  { threshold: 20, label: 'Curating royal heritage ambiance...', hiLabel: 'शाही शाकाहारी वातावरण तैयार हो रहा है...' },
  { threshold: 50, label: 'Warming up fresh desi ghee kitchens...', hiLabel: 'शुद्ध देशी घी एवं तंदूर की महक...' },
  { threshold: 80, label: 'Connecting Indore Bypass sanctuary...', hiLabel: 'इंदौर बायपास रॉयल डाइनिंग लोड हो रही है...' },
  { threshold: 100, label: 'Welcome to Panjtara Pure Veg', hiLabel: 'पंचतारा में आपका स्वागत है' },
];

export function InitialIntro({ onComplete }: InitialIntroProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(LOADING_STEPS[0].label);
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

    // Smooth production-ready progress simulation over ~2.8 seconds
    const totalDuration = 2800; // 2.8s ensures production assets, fonts & initial API calls are warm
    const intervalTime = 40;
    const increment = 100 / (totalDuration / intervalTime);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + increment);

        // Update status text based on progress
        const step = LOADING_STEPS.find((s) => next <= s.threshold) || LOADING_STEPS[LOADING_STEPS.length - 1];
        setStatusText(step.label);

        if (next >= 100) {
          clearInterval(progressTimer);
          // Allow full 100% state to linger for 300ms before smooth curtain lift
          setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('panchtara_intro_played', 'true');
            onComplete?.();
          }, 350);
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(progressTimer);
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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0E0D0B] text-[#FAF7F2] select-none"
        >
          {/* Ambient Royal Gold Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.14)_0%,rgba(14,13,11,0.95)_70%)] pointer-events-none" />

          {/* Decorative Corner Filigree Accents */}
          <div className="absolute top-6 left-6 text-[#C5A880]/30 font-mono text-xs tracking-widest pointer-events-none hidden sm:block">
            EST. INDORE • BYPASS
          </div>
          <div className="absolute top-6 right-6 text-[#C5A880]/30 font-mono text-xs tracking-widest pointer-events-none hidden sm:block">
            100% PURE VEG
          </div>

          {/* Logo Brandmark reveal */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center relative z-10 px-6 max-w-md w-full flex flex-col items-center"
          >
            {/* Five-star symbol (Panchtara) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="flex justify-center items-center gap-3 mb-4 text-[#C5A880]"
            >
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                  className="text-sm tracking-widest text-[#C5A880] drop-shadow-[0_0_8px_rgba(197,168,128,0.5)]"
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
                className="font-editorial-display text-3xl sm:text-4xl md:text-5xl text-[#FAF7F2] uppercase font-light tracking-[0.25em]"
              >
                Panjtara
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-[11px] md:text-xs tracking-[0.38em] text-[#C5A880] uppercase mt-2.5 font-editorial-sans font-medium"
            >
              Pure Veg • Royal Dining Sanctuary
            </motion.p>

            {/* Production Progress Loader Bar */}
            <div className="w-64 sm:w-80 mt-10 space-y-2.5">
              {/* Status Text */}
              <div className="flex items-center justify-between text-[11px] font-mono tracking-wider text-[#C5A880]/80">
                <span className="truncate max-w-[200px] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#C5A880] shrink-0 animate-spin" />
                  <span>{statusText}</span>
                </span>
                <span className="font-semibold text-white/90">{Math.round(progress)}%</span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#8C7355] via-[#C5A880] to-[#E6D5BC] rounded-full relative"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                >
                  {/* Subtle shimmer sheen */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Instant Skip button for fast access */}
          <button
            id="intro-skip-btn"
            onClick={handleSkip}
            className="absolute bottom-8 px-4 py-2 rounded-full border border-white/10 hover:border-[#C5A880]/50 bg-white/5 hover:bg-white/10 text-[10px] uppercase tracking-[0.22em] text-white/50 hover:text-[#C5A880] transition-all flex items-center gap-1.5"
          >
            <span>Skip to Sanctuary</span>
            <span>→</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
