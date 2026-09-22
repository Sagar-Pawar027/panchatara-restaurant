import { motion, useReducedMotion } from 'motion/react';
import { RESTAURANT_INFO } from '../../data/restaurant.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface StorySectionProps {
  onExploreSignatures: () => void;
}

export function StorySection({ onExploreSignatures }: StorySectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const { language } = useLanguage();
  const isHi = language === 'hi';

  return (
    <section
      id="story"
      aria-labelledby="story-headline"
      className="relative py-32 md:py-44 bg-[#FAF7F2] text-[#1C1A17] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Editorial Folio Tag with animated draw line */}
        <div className="flex items-center gap-3 mb-10 pb-4 border-b border-[#EAE1D3] relative">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A58458]">
              [ 01 ]
            </span>
            <span className="h-[1px] w-6 bg-[#C5A880]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7355] font-medium">
              {isHi ? 'विरासत एवं उद्गम' : 'Genesis & Heritage'}
            </span>
          </motion.div>
        </div>

        {/* Large Editorial Headline and Asymmetric Composition */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 lg:gap-20 items-center">
          <div className="md:col-span-7 space-y-8">
            {/* Masked Headline Reveal */}
            <div className="overflow-hidden">
              <motion.h2
                id="story-headline"
                initial={shouldReduceMotion ? {} : { y: '100%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl text-[#181614] font-normal leading-[1.12]"
              >
                {isHi ? (
                  <>
                    रेस्तरां से कहीं <span className="italic text-[#A58458]">अधिक।</span>
                  </>
                ) : (
                  <>
                    More Than <span className="italic text-[#A58458]">A Restaurant.</span>
                  </>
                )}
              </motion.h2>
            </div>

            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg sm:text-xl text-[#292622] font-editorial-serif italic leading-relaxed"
            >
              {isHi && RESTAURANT_INFO.hindiStoryLead
                ? RESTAURANT_INFO.hindiStoryLead
                : RESTAURANT_INFO.storyLead}
            </motion.p>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5 text-sm sm:text-base text-[#3E3A34] font-light leading-relaxed"
            >
              <p>
                {isHi && RESTAURANT_INFO.hindiStoryParagraph1
                  ? RESTAURANT_INFO.hindiStoryParagraph1
                  : RESTAURANT_INFO.storyParagraph1}
              </p>
              <p>
                {isHi && RESTAURANT_INFO.hindiStoryParagraph2
                  ? RESTAURANT_INFO.hindiStoryParagraph2
                  : RESTAURANT_INFO.storyParagraph2}
              </p>
            </motion.div>

            {/* Accolade Quote Card */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="pt-8 border-t border-[#EAE1D3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <blockquote className="font-editorial-serif text-base text-[#1C1A17] italic">
                {isHi && RESTAURANT_INFO.hindiStoryQuote
                  ? RESTAURANT_INFO.hindiStoryQuote
                  : RESTAURANT_INFO.storyQuote}
              </blockquote>
              <button
                id="story-view-signatures-btn"
                onClick={onExploreSignatures}
                className="group shrink-0 text-xs uppercase tracking-[0.2em] text-[#A58458] hover:text-[#181614] font-medium transition-colors inline-flex items-center gap-2 border-b border-[#A58458]/40 pb-0.5"
              >
                <span>{isHi ? 'खास व्यंजन' : 'The Signatures'}</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </button>
            </motion.div>
          </div>

          {/* Architectural Image Mask Reveal */}
          <div className="md:col-span-5 lg:col-span-5 relative">
            <motion.div
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' }
              }
              whileInView={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }
              }
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.15, ease: [0.19, 1, 0.22, 1] }}
              className="relative rounded-sm overflow-hidden shadow-2xl bg-[#1C1A17] aspect-[4/5] max-w-md mx-auto border border-[#EAE1D3]"
            >
              <motion.img
                initial={shouldReduceMotion ? {} : { scale: 1.08 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.3, ease: [0.19, 1, 0.22, 1] }}
                src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80"
                alt="Chef finishing a heritage pure vegetarian dish at Panjtara"
                className="w-full h-full object-cover object-center transform hover:scale-104 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12110F]/75 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 text-[#FAF7F2]">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] block mb-1">
                  Atelier Kitchen
                </span>
                <p className="font-editorial-serif text-sm italic text-[#FAF7F2]/90">
                  Where smoke, heritage seeds, and clay-hearth embers harmonize.
                </p>
              </div>
            </motion.div>

            {/* Subtle decorative offset border box */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 w-48 h-48 border border-[#C5A880]/30 -z-10 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
