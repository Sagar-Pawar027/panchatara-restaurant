import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { Utensils, Calendar } from 'lucide-react';
import { RESTAURANT_INFO } from '../../data/restaurant.ts';

interface HeroSectionProps {
  onExploreMenu: () => void;
  onReserveTable: () => void;
}

export function HeroSection({ onExploreMenu, onReserveTable }: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Calm, GPU-accelerated background parallax
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.7], ['0%', '8%']);

  return (
    <section
      ref={containerRef}
      id="hero"
      aria-label="Welcome to Panjtara Pure Veg"
      className="relative w-full min-h-screen flex flex-col justify-between items-center text-center text-[#FAF7F2] overflow-hidden bg-[#0E0D0B] pt-32 pb-12 px-6 select-none"
    >
      {/* Background Image Layer with Parallax Depth */}
      <motion.div
        style={
          shouldReduceMotion
            ? {}
            : {
                y: bgY,
                scale: bgScale,
              }
        }
        className="absolute inset-0 z-0 pointer-events-none will-change-transform"
      >
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=85"
          alt="Panjtara Pure Veg Garden and Poolside Dining Atmosphere"
          className="w-full h-full object-cover object-center filter brightness-[0.68] contrast-[1.05]"
          loading="eager"
        />
        {/* Rich cinematic vignettes & subtle warm gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D0B] via-[#0E0D0B]/60 to-[#0E0D0B]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(14,13,11,0.75)_85%)]" />
      </motion.div>

      {/* Top Heritage Badge: Refined & Understated */}
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="relative z-10 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-black/50 backdrop-blur-md text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#C5A880]"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Indore Bypass • 100% Pure Veg Garden & Poolside Dining</span>
      </motion.div>

      {/* Center Choreographed Typography & Content */}
      <motion.div
        style={shouldReduceMotion ? {} : { opacity: contentOpacity, y: contentY }}
        className="relative z-10 max-w-4xl mx-auto my-auto space-y-6 sm:space-y-8"
      >
        {/* Brand Eyebrow */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="space-y-1"
        >
          <span className="text-xs sm:text-sm tracking-[0.4em] uppercase text-[#C5A880] font-light block">
            {RESTAURANT_INFO.brandName}
          </span>
        </motion.div>

        {/* Main Headline with Masked Line Reveal */}
        <h1 className="font-editorial-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.08] tracking-tight text-[#FAF7F2]">
          <span className="block overflow-hidden py-1">
            <motion.span
              initial={shouldReduceMotion ? {} : { y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.95, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              Where Every Meal
            </motion.span>
          </span>

          <span className="block overflow-hidden py-1">
            <motion.span
              initial={shouldReduceMotion ? {} : { y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.95, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
              className="block italic font-light text-[#E0CEB5]"
            >
              Becomes a Memory.
            </motion.span>
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="text-sm sm:text-base md:text-lg text-[#FAF7F2]/85 max-w-2xl mx-auto font-light leading-relaxed tracking-wide"
        >
          {RESTAURANT_INFO.subheading}
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <button
            id="hero-explore-menu-btn"
            onClick={onExploreMenu}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#C5A880] text-[#12110F] font-medium text-xs uppercase tracking-[0.22em] rounded-sm hover:bg-[#dfcaab] transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#C5A880]/15"
          >
            <Utensils className="w-3.5 h-3.5 text-[#12110F]" />
            <span>Explore Our Menu</span>
          </button>

          <button
            id="hero-reserve-table-btn"
            onClick={onReserveTable}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 border border-white/25 text-[#FAF7F2] font-medium text-xs uppercase tracking-[0.22em] rounded-sm hover:bg-white/10 hover:border-white transition-all transform hover:-translate-y-0.5 backdrop-blur-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Reserve a Table</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Architectural Scroll Indicator (No cheap bouncing arrow) */}
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.9 }}
        className="relative z-10 flex flex-col items-center gap-3 cursor-pointer text-[#FAF7F2]/60 hover:text-[#C5A880] transition-colors pt-4"
        onClick={onExploreMenu}
        role="button"
        tabIndex={0}
        aria-label="Scroll down to explore story"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onExploreMenu();
        }}
      >
        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-light text-white/50">
          Scroll To Discover
        </span>

        {/* Minimalist vertical luxury hairline runner */}
        <div className="w-[1px] h-10 bg-white/15 relative overflow-hidden rounded-full">
          {!shouldReduceMotion && (
            <motion.div
              animate={{ y: ['-100%', '100%'] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: [0.65, 0, 0.35, 1],
              }}
              className="w-full h-1/2 bg-[#C5A880]"
            />
          )}
        </div>
      </motion.div>
    </section>
  );
}
