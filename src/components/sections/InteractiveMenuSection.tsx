import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Search, Sparkles, UtensilsCrossed } from 'lucide-react';
import { MenuCategoryKey, MenuItem } from '../../types/index.ts';
import { MENU_CATEGORIES, MENU_ITEMS } from '../../data/menu.ts';

interface InteractiveMenuSectionProps {
  onSelectDish: (dish: MenuItem) => void;
  onReserveTable: () => void;
}

export function InteractiveMenuSection({ onSelectDish, onReserveTable }: InteractiveMenuSectionProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [activeCategory, setActiveCategory] = useState<MenuCategoryKey>('starters');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'signatures' | 'jain-available' | 'gluten-free' | 'chef-special'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setMenuItems(data.data);
        }
      })
      .catch(() => {
        // graceful fallback to static data
      });
  }, []);

  const currentCategoryInfo = MENU_CATEGORIES.find((c) => c.key === activeCategory) || MENU_CATEGORIES[0];

  // Filtered items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = searchQuery.trim() ? true : item.category === activeCategory;

      let matchesDietary = true;
      if (dietaryFilter === 'signatures') {
        matchesDietary = item.isSignature || false;
      } else if (dietaryFilter === 'jain-available') {
        matchesDietary = item.dietary?.includes('jain-available') || item.category === 'breads' || item.category === 'rice-biryani' || item.category === 'desserts';
      } else if (dietaryFilter === 'gluten-free') {
        matchesDietary = item.dietary?.includes('gluten-free') || false;
      } else if (dietaryFilter === 'chef-special') {
        matchesDietary = item.isChefSpecial || item.isSignature || false;
      }

      const matchesSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.hindiName && item.hindiName.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesDietary && matchesSearch;
    });
  }, [menuItems, activeCategory, dietaryFilter, searchQuery]);

  return (
    <section
      id="menu"
      aria-labelledby="menu-main-heading"
      className="py-32 md:py-44 bg-[#141311] text-[#FAF7F2] overflow-hidden relative"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(197,168,128,0.05)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Editorial Folio Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-white/10 gap-6">
          <div>
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#C5A880]">
                [ 04 ]
              </span>
              <span className="h-[1px] w-6 bg-[#C5A880]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#22c55e] font-medium flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-[#22c55e]" />
                100% Pure Vegetarian Kitchen
              </span>
            </motion.div>

            <div className="overflow-hidden">
              <motion.h2
                id="menu-main-heading"
                initial={shouldReduceMotion ? {} : { y: '100%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#FAF7F2] leading-[1.1]"
              >
                The Panjtara Menu
              </motion.h2>
            </div>
          </div>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md text-sm sm:text-base text-white/70 font-light leading-relaxed"
          >
            A 100% pure vegetarian gastronomic sanctuary in Indore—featuring sizzling clay tandoor breads, royal paneer gravies, and Malwi hospitality.
          </motion.p>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
          {/* Dietary Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: 'all', label: 'All Pure Veg' },
              { key: 'signatures', label: 'Signatures' },
              { key: 'jain-available', label: 'Jain Friendly' },
              { key: 'gluten-free', label: 'Gluten-Free' },
              { key: 'chef-special', label: "Chef's Specials" },
            ].map((d) => (
              <button
                key={d.key}
                id={`menu-filter-${d.key}`}
                onClick={() => setDietaryFilter(d.key as typeof dietaryFilter)}
                className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.18em] transition-all duration-300 ${
                  dietaryFilter === d.key
                    ? 'bg-[#C5A880] text-[#12110F] font-medium'
                    : 'bg-white/5 text-white/65 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              id="menu-search-input"
              type="text"
              placeholder="Search dishes, paneer, rotis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white/5 border border-white/10 rounded-full text-[#FAF7F2] placeholder:text-white/40 focus:outline-none focus:border-[#C5A880] transition-colors"
            />
          </div>
        </div>

        {/* Category Navigation Tabs with Fluid Spring Line */}
        {!searchQuery && (
          <div className="mb-12 overflow-x-auto pb-3 scrollbar-none flex gap-1 sm:gap-2 border-b border-white/5">
            {MENU_CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  id={`menu-category-tab-${cat.key}`}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`relative px-5 py-3 rounded-t-sm text-xs sm:text-sm whitespace-nowrap transition-colors duration-300 flex flex-col items-center ${
                    isSelected ? 'text-[#C5A880] font-medium' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span className="tracking-[0.2em] uppercase">{cat.label}</span>
                  {cat.sublabel && (
                    <span className="text-[10px] text-white/40 font-serif mt-0.5">{cat.sublabel}</span>
                  )}
                  {isSelected && (
                    <motion.div
                      layoutId="activeCategoryTab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A880]"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 400, damping: 35 }
                      }
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Category Description Banner */}
        {!searchQuery && (
          <div className="mb-10 text-center sm:text-left">
            <p className="text-xs uppercase tracking-[0.25em] text-[#C5A880]/80">
              {currentCategoryInfo.description}
            </p>
          </div>
        )}

        {/* Menu Items Grid with Smooth Fade/Stagger */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + dietaryFilter + searchQuery}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12"
          >
            {filteredItems.length === 0 ? (
              <div className="col-span-full py-16 text-center text-white/50 space-y-3">
                <UtensilsCrossed className="w-8 h-8 mx-auto text-[#C5A880]/60 mb-2" />
                <p className="text-base font-editorial-serif">No dishes found matching your selection.</p>
                <button
                  id="menu-reset-filters-btn"
                  onClick={() => {
                    setDietaryFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-xs uppercase tracking-widest text-[#C5A880] underline hover:text-[#dfcaab]"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  id={`menu-item-${item.id}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details and dietary notes for ${item.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectDish(item);
                    }
                  }}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.3) }}
                  onClick={() => onSelectDish(item)}
                  className="group cursor-pointer pb-8 border-b border-white/10 hover:border-[#C5A880]/40 focus:border-[#C5A880] focus:outline-none focus:ring-1 focus:ring-[#C5A880]/30 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-4 mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-editorial-serif text-xl sm:text-2xl text-[#FAF7F2] group-hover:text-[#C5A880] transition-colors font-medium">
                          {item.name}
                        </h3>
                        {item.isChefSpecial && (
                          <span title="Chef's Special Selection" className="text-[#C5A880]">
                            <Sparkles className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {(item as any).isAvailable === false && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                            Sold Out Today
                          </span>
                        )}
                        <span className="font-editorial-serif text-lg text-[#FAF7F2] group-hover:text-[#C5A880] transition-colors font-semibold">
                          {item.price}
                        </span>
                      </div>
                    </div>

                    {item.hindiName && (
                      <span className="text-xs text-[#C5A880]/75 font-serif tracking-wide block mb-2">
                        {item.hindiName}
                      </span>
                    )}

                    <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  {/* Dietary & Sommelier Pairing */}
                  <div className="flex items-center justify-between text-[11px] text-white/50 pt-2">
                    <div className="flex items-center gap-2">
                      {item.dietary?.map((diet) => (
                        <span
                          key={diet}
                          className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-[#FAF7F2]/80 border border-white/5 capitalize"
                        >
                          {diet.replace('-', ' ')}
                        </span>
                      ))}
                    </div>

                    {item.pairing && (
                      <span className="italic text-[#C5A880]/80">
                        Pairing: {item.pairing}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Dietary & Reserve Table Notice */}
        <div className="mt-20 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <p className="text-xs text-white/60 font-light">
              Kindly inform your server of any food allergies or specific dietary preferences.
            </p>
            <p className="text-xs text-[#22c55e] flex items-center justify-center sm:justify-start gap-1.5 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-[#22c55e]" />
              100% Pure Vegetarian Kitchen (शुद्ध शाकाहारी). Dedicated Jain preparation with zero onion & garlic available upon request.
            </p>
          </div>

          <button
            id="menu-reserve-cta-btn"
            onClick={onReserveTable}
            className="px-7 py-3.5 bg-[#C5A880] text-[#12110F] text-xs uppercase tracking-[0.2em] font-medium rounded-sm hover:bg-[#dfcaab] transition-colors shrink-0"
          >
            Reserve Your Table
          </button>
        </div>
      </div>
    </section>
  );
}
