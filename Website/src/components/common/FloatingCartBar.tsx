import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowRight, Sparkles, Percent, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';

export function FloatingCartBar() {
  const { itemCount, totalAmount, commissionSavings, openCart, orderType, toastMessage } = useCart();
  const { language } = useLanguage();
  const isHi = language === 'hi';

  return (
    <>
      {/* Instant Toast Notification when a dish is added */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="bg-[#181614] border border-[#C5A880]/60 px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 text-xs text-[#FAF7F2]">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </span>
              <span className="font-medium">{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Floating Zomato-Style Cart Bar */}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            id="floating-cart-bar-container"
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-3 sm:bottom-6 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 max-w-2xl w-[calc(100%-1.5rem)] sm:w-auto"
          >
            <div className="bg-[#12110F]/95 backdrop-blur-md border border-[#C5A880]/50 rounded-2xl sm:rounded-full p-2.5 sm:p-2 sm:pl-5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[#FAF7F2]">
              {/* Order summary info */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-[#C5A880]/20 border border-[#C5A880] flex items-center justify-center text-[#C5A880]">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C5A880] text-[#12110F] text-[10px] font-bold flex items-center justify-center">
                      {itemCount}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-editorial-serif text-lg font-bold text-white">
                        ₹{totalAmount}
                      </span>
                      <span className="text-[11px] text-[#C5A880] uppercase tracking-wider font-mono">
                        {itemCount} {itemCount === 1 ? (isHi ? 'व्यंजन' : 'item') : (isHi ? 'व्यंजन' : 'items')}
                      </span>
                    </div>

                    {/* Leverage 1 Benefit Badge */}
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                      <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>
                        {isHi
                          ? `0% कमीशन • ₹${commissionSavings} की बचत`
                          : `Direct Order: Saved ~₹${commissionSavings} vs Zomato`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile direct order button */}
                <button
                  id="mobile-floating-cart-btn"
                  onClick={() => openCart()}
                  className="sm:hidden px-4 py-2 bg-[#C5A880] text-[#12110F] text-xs uppercase tracking-wider font-bold rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
                >
                  <span>{orderType === 'dine-in' ? 'Pre-Book' : 'Checkout'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Desktop action button */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] text-emerald-300">
                  <Percent className="w-3 h-3 text-emerald-400" />
                  <span>{isHi ? '0% प्लेटफॉर्म कमीशन' : '0% App Commission'}</span>
                </div>

                <button
                  id="floating-cart-checkout-btn"
                  onClick={() => openCart()}
                  className="px-5 py-2.5 bg-[#C5A880] hover:bg-[#dfcaab] text-[#12110F] text-xs uppercase tracking-widest font-bold rounded-full flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <span>
                    {orderType === 'dine-in'
                      ? isHi ? 'टेबल बुक व प्री-ऑर्डर →' : 'Book Table & Pre-Order (50% Now)'
                      : isHi ? 'ऑर्डर पूरा करें →' : 'Order Now • Direct Delivery'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
