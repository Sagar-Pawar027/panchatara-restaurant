import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SignatureDish } from '../../types/index.ts';
import { SIGNATURE_DISHES } from '../../data/menu.ts';

interface SignatureDishesSectionProps {
  onSelectDish: (dish: SignatureDish) => void;
  onViewFullMenu: () => void;
}

export function SignatureDishesSection({ onSelectDish, onViewFullMenu }: SignatureDishesSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="signature"
      aria-labelledby="signature-title"
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
                [ 03 ]
              </span>
              <span className="h-[1px] w-6 bg-[#C5A880]" />
              <span className="text-xs uppercase tracking-[0.25em] text-emerald-800 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                100% Pure Veg Signatures
              </span>
            </motion.div>

            <div className="overflow-hidden">
              <motion.h2
                id="signature-title"
                initial={shouldReduceMotion ? {} : { y: '100%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#181614] leading-[1.1]"
              >
                Signature Vegetarian Delicacies
              </motion.h2>
            </div>
          </div>

          <motion.button
            id="view-complete-menu-link-btn"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={onViewFullMenu}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#181614] hover:text-[#A58458] font-medium transition-colors border-b border-[#181614] hover:border-[#A58458] pb-1 w-fit"
          >
            <span>Explore Entire Menu</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300" />
          </motion.button>
        </div>

        {/* 6 Signature Dishes Grid with Calm Stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {SIGNATURE_DISHES.map((dish, index) => (
            <motion.article
              key={dish.id}
              id={`signature-dish-card-${dish.id}`}
              role="button"
              tabIndex={0}
              aria-label={`View tasting notes and details for ${dish.name}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectDish(dish);
                }
              }}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.75, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onSelectDish(dish)}
              className="group cursor-pointer flex flex-col bg-[#FDFBF7] border border-[#E8E0D2] hover:border-[#C5A880] focus:border-[#C5A880] focus:outline-none focus:ring-2 focus:ring-[#C5A880]/30 transition-all duration-500 rounded-sm overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
            >
              {/* Image Container with Measured Zoom */}
              <div className="relative aspect-[16/11] overflow-hidden bg-[#1C1A17]">
                <img
                  src={dish.image}
                  alt={dish.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-40 group-hover:opacity-25 transition-opacity duration-500" />

                {/* Category tag */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-[9px] uppercase tracking-[0.2em] bg-black/60 backdrop-blur-md text-[#FAF7F2] rounded-full border border-white/15">
                    {dish.category}
                  </span>
                </div>
              </div>

              {/* Text Information */}
              <div className="p-7 flex flex-col flex-1 justify-between bg-[#FBF8F2] group-hover:bg-[#F6F0E6] transition-colors duration-500">
                <div>
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <h3 className="font-editorial-serif text-xl sm:text-2xl text-[#181614] font-medium group-hover:text-[#A58458] transition-colors duration-300">
                      {dish.name}
                    </h3>
                    <span className="font-editorial-serif text-lg text-[#181614] font-semibold shrink-0">
                      {dish.price}
                    </span>
                  </div>

                  {dish.hindiName && (
                    <span className="text-xs text-[#8C7355] block mb-3 font-serif tracking-wider">
                      {dish.hindiName}
                    </span>
                  )}

                  <p className="text-xs sm:text-sm text-[#4A453E] font-light leading-relaxed mb-5 line-clamp-2">
                    {dish.description}
                  </p>
                </div>

                {/* Flavor Notes and Origin */}
                <div className="pt-4 border-t border-[#EAE1D3] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#A58458] font-medium tracking-wider uppercase">
                    {dish.heritageOrigin}
                  </span>
                  <span className="text-[11px] text-[#181614] group-hover:text-[#A58458] transition-colors inline-flex items-center gap-1 font-medium">
                    <span>Tasting Details</span>
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
