import { motion, useReducedMotion } from 'motion/react';
import { PHILOSOPHY_PRINCIPLES } from '../../data/restaurant.ts';

export function PhilosophySection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="philosophy"
      aria-labelledby="philosophy-title"
      className="relative py-32 md:py-44 bg-[#F5F0E8] text-[#1C1A17] overflow-hidden border-t border-[#EAE1D3]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Editorial Folio Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#D8CFBF] gap-6">
          <div>
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A58458]">
                [ 02 ]
              </span>
              <span className="h-[1px] w-6 bg-[#C5A880]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C7355] font-medium">
                The Guiding Tenets
              </span>
            </motion.div>

            <div className="overflow-hidden">
              <motion.h2
                id="philosophy-title"
                initial={shouldReduceMotion ? {} : { y: '100%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#181614] leading-[1.1]"
              >
                Our Philosophy
              </motion.h2>
            </div>
          </div>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-md text-sm sm:text-base text-[#4A453E] font-light leading-relaxed"
          >
            Four unbending culinary convictions that govern our hearth, our seasonal forage, and the grace of our table.
          </motion.p>
        </div>

        {/* Editorial Tenets Index with Hairline Line Draw & Choreographed Content */}
        <div className="space-y-0">
          {PHILOSOPHY_PRINCIPLES.map((principle, index) => (
            <div key={principle.number} className="relative">
              {/* Hairline Divider with Draw Motion */}
              <motion.div
                initial={shouldReduceMotion ? {} : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ originX: 0 }}
                className="w-full h-[1px] bg-[#D8CFBF]"
              />

              <motion.div
                id={`philosophy-item-${principle.number}`}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: index * 0.12 + 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start group transition-colors duration-500 rounded-sm hover:bg-[#EFE9DF]/40 px-2 sm:px-4 -mx-2 sm:-mx-4"
              >
                {/* Number and Sanskrit cultural element */}
                <div className="lg:col-span-3 flex items-baseline justify-between lg:block space-y-2">
                  <span className="font-editorial-serif text-4xl sm:text-5xl text-[#A58458] group-hover:text-[#181614] transition-colors duration-500 block">
                    {principle.number}
                  </span>
                  <span className="block text-xs uppercase tracking-[0.25em] text-[#7A6A56] font-serif">
                    {principle.culturalElement}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div className="lg:col-span-4 space-y-2">
                  <h3 className="font-editorial-display text-2xl sm:text-3xl uppercase tracking-[0.12em] text-[#181614] font-medium group-hover:text-[#A58458] transition-colors duration-300">
                    {principle.title}
                  </h3>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#A58458] block font-light">
                    {principle.tagline}
                  </span>
                </div>

                {/* Description & Accompanying Thought */}
                <div className="lg:col-span-5 space-y-4">
                  <p className="text-sm sm:text-base text-[#3E3A34] font-light leading-relaxed">
                    {principle.description}
                  </p>
                  <blockquote className="text-xs sm:text-sm text-[#706658] italic font-editorial-serif border-l-2 border-[#C5A880] group-hover:border-[#A58458] pl-3.5 py-0.5 transition-colors duration-300">
                    “{principle.quote}”
                  </blockquote>
                </div>
              </motion.div>
            </div>
          ))}

          {/* Final Bottom Hairline */}
          <motion.div
            initial={shouldReduceMotion ? {} : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.45 }}
            style={{ originX: 0 }}
            className="w-full h-[1px] bg-[#D8CFBF]"
          />
        </div>
      </div>
    </section>
  );
}
