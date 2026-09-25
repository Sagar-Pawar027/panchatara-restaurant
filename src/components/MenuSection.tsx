import React, { useState } from 'react';
import { Plus, Check, Flame, Sparkles } from 'lucide-react';
import { MENU_ITEMS, MenuItem } from '../data/restaurantData';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Royal Specialities' },
    { id: 'mains', label: 'Royal Mains' },
    { id: 'starters', label: 'Starters & Tandoor' },
    { id: 'biryani', label: 'Awadhi Biryani' },
    { id: 'breads', label: 'Tandoori Breads' },
    { id: 'desserts', label: 'Desi Desserts' },
  ];

  const filteredItems = activeCategory === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category === activeCategory);

  const handleAdd = (item: MenuItem) => {
    onAddToCart(item);
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 1200);
  };

  return (
    <section id="menu" className="py-20 bg-[#100D09] text-[#E8DFD0] relative border-t border-[#1C1610]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#C9A24D] font-medium mb-2">
            <span>Direct Kitchen Ordering</span>
            <span aria-hidden="true">·</span>
            <span>Zero Aggregator Markup</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-[#F7E7CE]">
            Indore’s Royal Vegetarian Table
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#A89F91]">
            Prepared fresh to order in a dedicated vegetarian satvik kitchen with authentic clay tandoors and slow dum handis.
          </p>
        </div>

        {/* Category Tabs (Segmented Button Controls per skill) */}
        <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <div className="flex items-center gap-1.5 p-1.5 bg-[#17130E] border border-[#2B231B] rounded-xl shrink-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-[#C9A24D] text-[#0D0B08] shadow-sm'
                    : 'text-[#A89F91] hover:text-[#E8DFD0]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#14100C] border border-[#261E14] hover:border-[#3D3021] rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image slot with styled CSS fallback */}
                {item.image ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1A140F]">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14100C] via-transparent to-transparent opacity-80" />
                    
                    {/* Pure veg indicator */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-[#261E14] text-[10px] text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Pure Veg</span>
                    </div>

                    {item.isSignature && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded bg-[#C9A24D]/90 text-[#0D0B08] text-[10px] font-bold uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        <span>Chef’s Signature</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 pt-5 pb-0 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>100% Pure Veg</span>
                    </span>
                    <span className="text-[11px] text-[#8C8273]">{item.spiceLevel}</span>
                  </div>
                )}

                {/* Details */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-base font-bold font-display text-[#F7E7CE] group-hover:text-[#C9A24D] transition-colors">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-xs text-[#8C8273] line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Clean unboxed metadata */}
                  <div className="flex items-center gap-2 text-[11px] text-[#A89F91]">
                    <span>{item.spiceLevel}</span>
                    <span aria-hidden="true">·</span>
                    <span>Indore Kitchen Fresh</span>
                  </div>
                </div>
              </div>

              {/* Price & Add Action */}
              <div className="p-5 pt-0 border-t border-[#1C1610] mt-2 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-[#F7E7CE] font-mono tabular-nums">
                      ₹{item.price}
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs text-[#6B6355] line-through font-mono tabular-nums">
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#C9A24D] block font-medium">
                    Save ₹{(item.originalPrice || item.price + 50) - item.price} direct
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdd(item)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    addedItemId === item.id
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-[#C9A24D]/15 hover:bg-[#C9A24D] text-[#C9A24D] hover:text-[#0D0B08] border border-[#C9A24D]/30'
                  }`}
                >
                  {addedItemId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Dish</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
