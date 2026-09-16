import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

export function FullscreenQuoteSection() {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Calm window parallax effect
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section
      ref={containerRef}
      id="fullscreen-story"
      aria-label="Atmospheric Panjtara Pure Veg Experience"
      className="relative w-full min-h-[85vh] flex items-center justify-center text-center overflow-hidden bg-[#12110F] px-6 py-28 select-none"
    >
      {/* Background Image with Parallax Depth */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          style={shouldReduceMotion ? {} : { y: bgY }}
          className="w-full h-[120%] -top-[10%] relative will-change-transform"
        >
          <img
            src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=2000&q=85"
            alt="Evening garden and poolside dining atmosphere at Panjtara Pure Veg"
            className="w-full h-full object-cover object-center filter brightness-[0.7] contrast-[1.1]"
            loading="lazy"
          />
        </motion.div>
        {/* Cinematic Vignettes */}
        <div className="absolute inset-0 bg-[#0E0D0B]/65" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(14,13,11,0.9)_90%)]" />
      </div>

      {/* Typography Overlay with Choreographed Reveal */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-7 text-[#FAF7F2]">
        {/* Flanking Gold Rules */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-4"
        >
          <motion.span
            initial={shouldReduceMotion ? {} : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 1 }}
            className="w-12 sm:w-16 h-[1px] bg-[#C5A880]/70 inline-block"
          />
          <span className="text-xs uppercase tracking-[0.35em] text-[#C5A880] font-light">
            The Panjtara Promise
          </span>
          <motion.span
            initial={shouldReduceMotion ? {} : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0 }}
            className="w-12 sm:w-16 h-[1px] bg-[#C5A880]/70 inline-block"
          />
        </motion.div>

        {/* Main Monograph Headline with Masked Entrance */}
        <h2 className="font-editorial-serif text-4xl sm:text-6xl md:text-7xl font-normal leading-tight text-[#FAF7F2]">
          <span className="block overflow-hidden py-1">
            <motion.span
              initial={shouldReduceMotion ? {} : { y: '100%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              Come for the food.
            </motion.span>
          </span>

          <span className="block overflow-hidden py-1">
            <motion.span
              initial={shouldReduceMotion ? {} : { y: '100%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="block italic text-[#E0CEB5] font-light mt-1"
            >
              Stay for the feeling.
            </motion.span>
          </span>
        </h2>

        <motion.p
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 0.85 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#FAF7F2]/80 font-light max-w-md mx-auto pt-4 border-t border-white/10"
        >
          100% Pure Veg • Open Garden Lawns • Malwi Hospitality
        </motion.p>
      </div>
    </section>
  );
}
