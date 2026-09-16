import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Maximize2 } from 'lucide-react';
import { GALLERY_ITEMS } from '../../data/gallery.ts';

interface GallerySectionProps {
  onOpenLightbox: (index: number) => void;
}

export function GallerySection({ onOpenLightbox }: GallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const shouldReduceMotion = useReducedMotion();

  const filteredItems = activeCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
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
                [ 06 ]
              </span>
              <span className="h-[1px] w-6 bg-[#C5A880]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C7355] font-medium">
                Visual Anthology
              </span>
            </motion.div>

            <div className="overflow-hidden">
              <motion.h2
                id="gallery-heading"
                initial={shouldReduceMotion ? {} : { y: '100%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#181614] leading-[1.1]"
              >
                Moments at Panjtara
              </motion.h2>
            </div>
          </div>

          {/* Minimal Editorial Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: 'all', label: 'All Perspectives' },
              { key: 'ambience', label: 'Ambience' },
              { key: 'dishes', label: 'Signatures' },
              { key: 'craft', label: 'Culinary Craft' },
              { key: 'ingredients', label: 'Terroir' },
            ].map((cat) => (
              <button
                key={cat.key}
                id={`gallery-filter-${cat.key}`}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.18em] transition-all duration-300 ${
                  activeCategory === cat.key
                    ? 'bg-[#181614] text-[#FAF7F2] font-medium'
                    : 'bg-[#EAE1D3]/70 text-[#4A453E] hover:bg-[#EAE1D3] hover:text-[#181614]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial Asymmetric Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
          {filteredItems.map((item, index) => {
            let colSpan = 'lg:col-span-4';
            let heightClass = 'h-80 sm:h-96';

            if (index === 0) {
              colSpan = 'lg:col-span-7';
              heightClass = 'h-80 sm:h-[440px]';
            } else if (index === 1) {
              colSpan = 'lg:col-span-5';
              heightClass = 'h-80 sm:h-[440px]';
            } else if (index === 2) {
              colSpan = 'lg:col-span-5';
              heightClass = 'h-80 sm:h-96';
            } else if (index === 3) {
              colSpan = 'lg:col-span-7';
              heightClass = 'h-80 sm:h-96';
            } else if (index === 4) {
              colSpan = 'lg:col-span-8';
              heightClass = 'h-80 sm:h-[420px]';
            } else if (index === 5) {
              colSpan = 'lg:col-span-4';
              heightClass = 'h-80 sm:h-[420px]';
            }

            const originalIndex = GALLERY_ITEMS.findIndex((g) => g.id === item.id);

            return (
              <motion.div
                key={item.id}
                id={`gallery-card-${item.id}`}
                role="button"
                tabIndex={0}
                aria-label={`View full size photograph: ${item.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenLightbox(originalIndex >= 0 ? originalIndex : 0);
                  }
                }}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onOpenLightbox(originalIndex >= 0 ? originalIndex : 0)}
                className={`group relative cursor-pointer overflow-hidden rounded-sm bg-[#181614] shadow-md hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#C5A880] transition-all duration-500 border border-[#EAE1D3] ${colSpan} ${heightClass}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D0B]/80 via-[#0E0D0B]/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-500" />

                {/* Hover Maximize Icon */}
                <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-[#FAF7F2] opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-90 border border-white/20">
                  <Maximize2 className="w-4 h-4 text-[#C5A880]" />
                </div>

                {/* Caption & Category metadata */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-[#FAF7F2] z-10 transform group-hover:-translate-y-1 transition-transform duration-400">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] block mb-1 font-medium">
                    {item.categoryLabel}
                  </span>
                  <h3 className="font-editorial-serif text-lg sm:text-xl font-normal text-[#FAF7F2]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/70 font-light line-clamp-1 mt-1">
                    {item.caption}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
