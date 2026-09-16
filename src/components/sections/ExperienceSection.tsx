import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Check } from 'lucide-react';
import { EXPERIENCE_PILLARS } from '../../data/restaurant.ts';

export function ExperienceSection() {
  const [activeTab, setActiveTab] = useState(EXPERIENCE_PILLARS[0].id);
  const currentPillar = EXPERIENCE_PILLARS.find((p) => p.id === activeTab) || EXPERIENCE_PILLARS[0];
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="py-32 md:py-44 bg-[#FAF7F2] text-[#1C1A17] overflow-hidden border-t border-[#EAE1D3]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Editorial Folio Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#EAE1D3] gap-6">
          <div>
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A58458]">
                [ 05 ]
              </span>
              <span className="h-[1px] w-6 bg-[#C5A880]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C7355] font-medium">
                The Panjtara Experience
              </span>
            </motion.div>

            <div className="overflow-hidden">
              <motion.h2
                id="experience-heading"
                initial={shouldReduceMotion ? {} : { y: '100%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#181614] leading-[1.1]"
              >
                The Experience
              </motion.h2>
            </div>
          </div>

          {/* Clean Agency Typographic Selector with Animated Spring Underline */}
          <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto pb-2 scrollbar-none">
            {EXPERIENCE_PILLARS.map((pillar, idx) => {
              const isSelected = activeTab === pillar.id;
              return (
                <button
                  key={pillar.id}
                  id={`experience-tab-${pillar.id}`}
                  onClick={() => setActiveTab(pillar.id)}
                  className={`relative text-xs uppercase tracking-[0.22em] font-medium pb-2 transition-colors duration-300 whitespace-nowrap ${
                    isSelected
                      ? 'text-[#181614]'
                      : 'text-[#706658] hover:text-[#181614]'
                  }`}
                >
                  <span className="font-mono text-[10px] text-[#A58458] mr-1.5">0{idx + 1}</span>
                  <span>{pillar.title}</span>

                  {isSelected && (
                    <motion.div
                      layoutId="activeExperienceTab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#181614]"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 380, damping: 32 }
                      }
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Large Visual Card & Narrative Container */}
        <div className="bg-[#141311] text-[#FAF7F2] rounded-sm overflow-hidden border border-white/5 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPillar.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]"
            >
              {/* Image Side with Quiet Settle */}
              <div className="lg:col-span-7 relative h-72 lg:h-full min-h-[380px] overflow-hidden bg-[#0E0D0B]">
                <motion.img
                  key={currentPillar.image}
                  src={currentPillar.image}
                  alt={currentPillar.title}
                  initial={shouldReduceMotion ? {} : { scale: 1.04 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141311] via-transparent to-transparent lg:hidden" />
                <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-transparent via-[#141311]/40 to-[#141311]" />

                <div className="absolute bottom-8 left-8 text-[#FAF7F2]">
                  <span className="text-2xl font-editorial-serif text-[#C5A880] block mb-1">
                    {currentPillar.hindiTitle}
                  </span>
                  <span className="text-xs uppercase tracking-[0.25em] text-[#FAF7F2]/75">
                    Indore Bypass Enclave
                  </span>
                </div>
              </div>

              {/* Text / Atmosphere Side */}
              <div className="lg:col-span-5 p-8 sm:p-14 flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] block mb-2 font-medium">
                      Dimension {currentPillar.title}
                    </span>
                    <h3 className="font-editorial-serif text-2xl sm:text-3xl text-[#FAF7F2] font-normal leading-snug">
                      “{currentPillar.tagline}”
                    </h3>
                  </div>

                  <p className="text-sm sm:text-base text-white/75 font-light leading-relaxed">
                    {currentPillar.description}
                  </p>

                  <div className="pt-4 space-y-3">
                    <span className="text-[11px] uppercase tracking-wider text-[#C5A880] block font-medium">
                      Atmospheric Hallmarks:
                    </span>
                    <ul className="space-y-2.5">
                      {currentPillar.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-white/70">
                          <Check className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10 mt-8 flex items-center justify-between">
                  <span className="text-xs text-white/50 tracking-wider">
                    Panjtara Dining Experience
                  </span>
                  <a
                    href="#reservation"
                    className="text-xs uppercase tracking-widest text-[#C5A880] hover:text-white transition-colors"
                  >
                    Reserve Table →
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
