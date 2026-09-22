import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Search, Sparkles, UtensilsCrossed, Plus, Minus, ShoppingBag, Percent } from 'lucide-react';
import { MenuCategoryKey, MenuItem } from '../../types/index.ts';
import { MENU_CATEGORIES, MENU_ITEMS } from '../../data/menu.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useCart } from '../../context/CartContext.tsx';

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
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const { items: cartItems, addItem, updateQuantity, openCart } = useCart();

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
      className="py-28 md:py-36 bg-[#141311] text-[#FAF7F2] overflow-hidden relative"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(197,168,128,0.05)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Editorial Folio Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-8 border-b border-white/10 gap-6">
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
                {isHi ? '100% शुद्ध शाकाहारी रसोई' : '100% Pure Vegetarian Kitchen'}
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
                {isHi ? 'पंजतारा संपूर्ण मेनू' : 'Gastronomic Repertoire'}
              </motion.h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="menu-quick-order-cta"
              onClick={() => openCart('delivery')}
              className="px-4 py-2.5 rounded bg-[#C5A880] text-[#12110F] text-xs uppercase tracking-wider font-bold hover:bg-[#dfcaab] transition-colors flex items-center gap-1.5 shadow-md"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isHi ? 'ऑनलाइन फूड ऑर्डर करें' : 'Order Food Online (0% Fee)'}</span>
            </button>

            <button
              id="menu-pre-reserve-cta"
              onClick={() => openCart('dine-in')}
              className="px-4 py-2.5 rounded bg-white/10 hover:bg-white/15 border border-[#C5A880]/50 text-[#FAF7F2] text-xs uppercase tracking-wider font-medium transition-colors"
            >
              {isHi ? 'टेबल प्री-रिजर्व (50% अग्रिम)' : 'Pre-Reserve Table (50% Now)'}
            </button>
          </div>
        </div>

        {/* 2 Key Leverages Highlight Bar */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl bg-black/40 border border-[#C5A880]/30 text-xs">
          <div className="flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Percent className="w-3.5 h-3.5" />
            </span>
            <div>
              <strong className="text-emerald-300 block uppercase tracking-wider text-[11px]">
                {isHi ? 'लेवरेज 1: 0% कमीशन सीधे ऑर्डर करें' : 'Benefit 1: Save 25% Aggregator Commission'}
              </strong>
              <p className="text-white/70 text-[11px] mt-0.5">
                {isHi
                  ? 'जोमैटो या स्विगी के 25% कमीशन से बचें। सीधे हमारी वेबसाइट से ऑर्डर करें और ताज़ा शुद्ध शाकाहारी भोजन पाएं।'
                  : 'Order online directly through our website. Skip hefty 25-30% Zomato/Swiggy commissions with genuine kitchen pricing!'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 border-t md:border-t-0 md:border-l border-white/10 pt-2.5 md:pt-0 md:pl-4">
            <span className="w-6 h-6 rounded-full bg-[#C5A880]/20 text-[#C5A880] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <div>
              <strong className="text-[#C5A880] block uppercase tracking-wider text-[11px]">
                {isHi ? 'लेवरेज 2: टेबल प्री-रिजर्वेशन (50% अब, 50% बाद में)' : 'Benefit 2: Table Pre-Reservation (Pay 50% Now, 50% Later)'}
              </strong>
              <p className="text-white/70 text-[11px] mt-0.5">
                {isHi
                  ? 'अपनी पसंदीदा डिश पहले से ऑर्डर करें ताकि पहुंचते ही गर्मागर्म मिले। 50% अग्रिम दें और शेष 50% सेवा के बाद!'
                  : 'Book your royal table & pre-order dishes for zero wait time. Pay only 50% now to confirm, and 50% comfortably after service!'}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar & Dietary Filter Pills */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                id="menu-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHi ? 'व्यंजन खोजें (उदा. पनीर, नान, दाल)...' : 'Search dishes (e.g., Paneer, Naan, Dal)...'}
                className="w-full bg-[#1A1815] border border-white/15 focus:border-[#C5A880] rounded-full pl-10 pr-4 py-2.5 text-xs text-[#FAF7F2] placeholder-white/40 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Dietary Filters */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {[
                { key: 'all', label: 'All Dishes', hiLabel: 'सभी' },
                { key: 'signatures', label: 'Signatures', hiLabel: 'सिग्नेचर' },
                { key: 'jain-available', label: 'Jain Friendly', hiLabel: 'जैन विकल्प' },
                { key: 'chef-special', label: "Chef's Special", hiLabel: 'शेफ स्पेशल' },
              ].map((pill) => (
                <button
                  key={pill.key}
                  id={`filter-${pill.key}`}
                  onClick={() => setDietaryFilter(pill.key as any)}
                  className={`px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-medium transition-all ${
                    dietaryFilter === pill.key
                      ? 'bg-[#C5A880] text-[#12110F] font-semibold'
                      : 'bg-[#1C1A17] text-white/70 hover:text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  {isHi ? pill.hiLabel : pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          {!searchQuery.trim() && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
              {MENU_CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  id={`category-tab-${cat.key}`}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeCategory === cat.key
                      ? 'bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/60 font-semibold'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{isHi && cat.sublabel ? cat.sublabel : cat.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Description */}
        {!searchQuery.trim() && (
          <div className="mb-8">
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
            className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"
          >
            {filteredItems.length === 0 ? (
              <div className="col-span-full py-16 text-center text-white/50 space-y-3">
                <UtensilsCrossed className="w-8 h-8 mx-auto text-[#C5A880]/60 mb-2" />
                <p className="text-base font-editorial-serif">
                  {isHi ? 'आपकी खोज के अनुसार कोई व्यंजन नहीं मिला।' : 'No dishes found matching your selection.'}
                </p>
                <button
                  id="menu-reset-filters-btn"
                  onClick={() => {
                    setDietaryFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-xs uppercase tracking-widest text-[#C5A880] underline hover:text-[#dfcaab]"
                >
                  {isHi ? 'फ़िल्टर रीसेट करें' : 'Reset filters'}
                </button>
              </div>
            ) : (
              filteredItems.map((item, idx) => {
                const cartItem = cartItems.find((ci) => ci.id === item.id);
                const quantityInCart = cartItem ? cartItem.quantity : 0;

                return (
                  <motion.div
                    key={item.id}
                    id={`menu-item-${item.id}`}
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.3) }}
                    className="group pb-6 border-b border-white/10 hover:border-[#C5A880]/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-4 mb-1">
                        <div
                          className="flex items-center gap-2 cursor-pointer flex-1"
                          onClick={() => onSelectDish(item)}
                        >
                          <h3 className="font-editorial-serif text-xl sm:text-2xl text-[#FAF7F2] group-hover:text-[#C5A880] transition-colors font-medium">
                            {isHi && item.hindiName ? item.hindiName : item.name}
                          </h3>
                          {item.isChefSpecial && (
                            <span title="Chef's Special Selection" className="text-[#C5A880]">
                              <Sparkles className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>

                        {/* Price & Cart Control (Zomato-Style) */}
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-editorial-serif text-lg text-[#FAF7F2] font-semibold">
                            {item.price}
                          </span>

                          {/* Instant Add or Quantity Counter */}
                          {quantityInCart === 0 ? (
                            <button
                              id={`add-btn-${item.id}`}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                addItem(item, 1);
                              }}
                              className="px-3 py-1 bg-[#C5A880] hover:bg-[#dfcaab] text-[#12110F] text-[11px] uppercase font-bold rounded tracking-wider transition-all flex items-center gap-1 shadow-sm active:scale-95"
                            >
                              <Plus className="w-3 h-3" />
                              <span>{isHi ? 'ऑर्डर' : 'ADD'}</span>
                            </button>
                          ) : (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1.5 bg-[#12110F] border border-[#C5A880] rounded p-0.5"
                            >
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-6 h-6 flex items-center justify-center rounded text-white/70 hover:text-white hover:bg-white/10"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono text-xs font-bold w-4 text-center text-[#C5A880]">
                                {quantityInCart}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-6 h-6 flex items-center justify-center rounded text-[#C5A880] hover:text-white hover:bg-white/10"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Subtitle / Alternate name */}
                      <div className="cursor-pointer" onClick={() => onSelectDish(item)}>
                        {isHi ? (
                          <span className="text-xs text-white/50 font-serif tracking-wide block mb-1.5">
                            {item.name}
                          </span>
                        ) : item.hindiName ? (
                          <span className="text-xs text-[#C5A880]/75 font-serif tracking-wide block mb-1.5">
                            {item.hindiName}
                          </span>
                        ) : null}

                        <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed mb-3">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Dietary & Sommelier Pairing */}
                    <div className="flex items-center justify-between text-[11px] text-white/50 pt-1">
                      <div className="flex items-center gap-1.5">
                        {item.dietary?.map((diet) => (
                          <span
                            key={diet}
                            className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-[#FAF7F2]/80 border border-white/5 capitalize"
                          >
                            {diet === 'jain-available' && isHi ? 'जैन उपलब्ध' : diet.replace('-', ' ')}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectDish(item)}
                        className="text-[11px] text-[#C5A880] hover:underline"
                      >
                        {isHi ? 'विवरण देखें →' : 'Tasting Notes →'}
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>

        {/* Dietary & Reserve Table Notice */}
        <div className="mt-16 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <p className="text-xs text-white/60 font-light">
              {isHi
                ? 'कृपया किसी भी खाद्य एलर्जी या विशेष आहार संबंधी प्राथमिकता के बारे में अपने वेटर को अवश्य बताएं।'
                : 'Kindly inform your server of any food allergies or specific dietary preferences.'}
            </p>
            <p className="text-xs text-[#22c55e] flex items-center justify-center sm:justify-start gap-1.5 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-[#22c55e]" />
              {isHi
                ? '100% शुद्ध शाकाहारी रसोई। बिना प्याज व लहसुन की समर्पित जैन भोजन व्यवस्था उपलब्ध है।'
                : '100% Pure Vegetarian Kitchen (शुद्ध शाकाहारी). Dedicated Jain preparation with zero onion & garlic available upon request.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="menu-open-delivery-bottom"
              onClick={() => openCart('delivery')}
              className="px-5 py-3 bg-[#C5A880] text-[#12110F] text-xs uppercase tracking-wider font-bold rounded hover:bg-[#dfcaab] transition-colors"
            >
              {isHi ? 'घर पर मंगाएं (0% कमीशन)' : 'Order Online (0% Commission)'}
            </button>
            <button
              id="menu-reserve-cta-btn"
              onClick={onReserveTable}
              className="px-5 py-3 bg-white/10 border border-white/20 text-white text-xs uppercase tracking-wider font-medium rounded hover:bg-white/15 transition-colors"
            >
              {isHi ? 'टेबल बुक करें' : 'Reserve Table'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
