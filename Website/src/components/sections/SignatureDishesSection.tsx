import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Plus, Minus, ShoppingBag, Sparkles, Percent } from 'lucide-react';
import { SignatureDish } from '../../types/index.ts';
import { SIGNATURE_DISHES } from '../../data/menu.ts';
import { useCart } from '../../context/CartContext.tsx';

interface SignatureDishesSectionProps {
  onSelectDish: (dish: SignatureDish) => void;
  onViewFullMenu: () => void;
}

export function SignatureDishesSection({ onSelectDish, onViewFullMenu }: SignatureDishesSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const { items: cartItems, addItem, updateQuantity, openCart } = useCart();

  return (
    <section
      id="signature"
      aria-labelledby="signature-title"
      className="py-28 md:py-36 bg-[#FAF7F2] text-[#1C1A17] overflow-hidden border-t border-[#EAE1D3]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Editorial Folio Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-8 border-b border-[#EAE1D3] gap-6">
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
              <span className="text-xs uppercase tracking-[0.25em] text-emerald-800 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                100% Pure Veg Signatures • Direct Delivery
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

          <div className="flex items-center gap-3">
            <button
              onClick={() => openCart('delivery')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded bg-[#C5A880] hover:bg-[#b8986c] text-[#12110F] text-xs uppercase tracking-wider font-bold transition-all shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Order Online (0% Fee)</span>
            </button>

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
        </div>

        {/* 6 Signature Dishes Grid with Calm Stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {SIGNATURE_DISHES.map((dish, index) => {
            const cartItem = cartItems.find((ci) => ci.id === dish.id);
            const quantityInCart = cartItem ? cartItem.quantity : 0;

            return (
              <motion.article
                key={dish.id}
                id={`signature-dish-card-${dish.id}`}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.75, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col bg-[#FDFBF7] border border-[#E8E0D2] hover:border-[#C5A880] transition-all duration-500 rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] w-full"
              >
                {/* Image Container */}
                <div
                  className="relative aspect-[16/11] overflow-hidden bg-[#1C1A17] cursor-pointer"
                  onClick={() => onSelectDish(dish)}
                >
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

                  {/* 0% Commission Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-2.5 py-1 text-[9px] uppercase tracking-wider bg-emerald-950/80 backdrop-blur-md text-emerald-300 rounded-full border border-emerald-500/30 font-semibold flex items-center gap-1">
                      <Percent className="w-2.5 h-2.5" />
                      <span>0% Fee</span>
                    </span>
                  </div>
                </div>

                {/* Text Information */}
                <div className="p-6 flex flex-col flex-1 justify-between bg-[#FBF8F2] group-hover:bg-[#F6F0E6] transition-colors duration-500">
                  <div>
                    <div
                      className="flex items-baseline justify-between gap-4 mb-1 cursor-pointer"
                      onClick={() => onSelectDish(dish)}
                    >
                      <h3 className="font-editorial-serif text-xl sm:text-2xl text-[#181614] font-medium group-hover:text-[#A58458] transition-colors duration-300">
                        {dish.name}
                      </h3>
                      <span className="font-editorial-serif text-lg text-[#181614] font-bold shrink-0">
                        {dish.price}
                      </span>
                    </div>

                    {dish.hindiName && (
                      <span className="text-xs text-[#8C7355] block mb-2 font-serif tracking-wider">
                        {dish.hindiName}
                      </span>
                    )}

                    <p className="text-xs text-[#4A453E] font-light leading-relaxed mb-4 line-clamp-2">
                      {dish.description}
                    </p>
                  </div>

                  {/* Card Footer: Tasting Details + Direct Add Button */}
                  <div className="pt-4 border-t border-[#EAE1D3] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectDish(dish)}
                      className="text-[11px] text-[#A58458] hover:underline font-medium uppercase tracking-wider text-left"
                    >
                      View Details &amp; Notes →
                    </button>

                    {/* Quantity or Add Button */}
                    {quantityInCart === 0 ? (
                      <button
                        type="button"
                        onClick={() => addItem(dish, 1)}
                        className="px-3 py-1.5 bg-[#C5A880] hover:bg-[#b8986c] text-[#12110F] text-xs font-bold uppercase tracking-wider rounded-md transition-colors flex items-center gap-1 shadow-sm active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Order</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-white border border-[#C5A880] rounded p-0.5 shadow-sm">
                        <button
                          type="button"
                          onClick={() => updateQuantity(dish.id, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded text-gray-700 hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold w-4 text-center text-[#181614]">
                          {quantityInCart}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(dish.id, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded text-[#A58458] hover:bg-gray-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
