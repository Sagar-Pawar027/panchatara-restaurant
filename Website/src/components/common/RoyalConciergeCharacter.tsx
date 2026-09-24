import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  ShoppingBag,
  Sparkles,
  X,
  MessageCircle,
  ChevronRight,
  Volume2,
  VolumeX,
  Utensils,
  MapPin,
  Check,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useCart } from '../../context/CartContext.tsx';
import { useNavigate } from 'react-router-dom';

interface RoyalConciergeCharacterProps {
  onReserve?: () => void;
  onOrder?: () => void;
}

const GREETINGS_EN = [
  {
    tag: 'Royal Welcome',
    text: 'Namaste! Welcome to Panjtara Pure Veg. How may I host you today?',
    ctaType: 'both',
  },
  {
    tag: 'Garden & Cabana',
    text: 'Planning dinner with family? Reserve our Garden Lawn or Poolside Cabana.',
    ctaType: 'reserve',
  },
  {
    tag: 'Direct Kitchen Order',
    text: 'Enjoying from home? Order directly to save 25% aggregator commission!',
    ctaType: 'order',
  },
  {
    tag: '100% Shuddh Desi Ghee',
    text: 'Our signature Dal Panjtara is slow-simmered for 14 hours in pure desi ghee.',
    ctaType: 'order',
  },
];

const GREETINGS_HI = [
  {
    tag: 'शाही स्वागत',
    text: 'नमस्ते! पंचतारा शुद्ध शाकाहारी में आपका हार्दिक स्वागत है। आज आपकी क्या सेवा करें?',
    ctaType: 'both',
  },
  {
    tag: 'गार्डन व पूलसाइड',
    text: 'परिवार संग पधार रहे हैं? गार्डन लॉन या पूलसाइड कबाना पहले से बुक करें।',
    ctaType: 'reserve',
  },
  {
    tag: 'सीधे ऑनलाइन ऑर्डर',
    text: 'घर बैठे 0% कमीशन पर ताज़ा शाही भोजन मंगवाएं और अतिरिक्त बचत पाएं।',
    ctaType: 'order',
  },
  {
    tag: '100% शुद्ध देशी घी',
    text: 'हमारी दाल पंचतारा 14 घंटे धीमी आंच पर शुद्ध देशी घी में तैयार होती है।',
    ctaType: 'order',
  },
];

export function RoyalConciergeCharacter({ onReserve, onOrder }: RoyalConciergeCharacterProps) {
  const { language } = useLanguage();
  const isHi = language === 'hi';
  const { openCart, itemCount } = useCart();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position to coordinate with StickyBookingBar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 550);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const greetings = isHi ? GREETINGS_HI : GREETINGS_EN;
  const currentGreeting = greetings[currentIdx % greetings.length];

  // Auto-rotate dialogue messages every 8 seconds when card is open or minimized
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % greetings.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [greetings.length]);

  const handleReserveClick = () => {
    setHasInteracted(true);
    setIsOpen(false);
    if (onReserve) {
      onReserve();
    } else {
      navigate('/reservation');
    }
  };

  const handleOrderClick = () => {
    setHasInteracted(true);
    setIsOpen(false);
    if (onOrder) {
      onOrder();
    } else {
      openCart('delivery');
    }
  };

  if (isDismissed) return null;

  // On mobile screens (< 640px), when either FloatingCartBar (itemCount > 0)
  // or StickyBookingBar (isScrolled) is occupying the bottom of the viewport,
  // hide the floating concierge button so there is ZERO UI collision or overlap.
  const hasBottomBarOnMobile = (itemCount > 0 || isScrolled) && !isOpen;

  return (
    <div
      id="royal-concierge-container"
      className={`fixed z-30 select-none print:hidden pointer-events-auto transition-all duration-300 ${
        hasBottomBarOnMobile ? 'hidden sm:block' : 'block'
      } bottom-3 sm:bottom-6 left-3 sm:left-6`}
    >
      <AnimatePresence>
        {/* Expanded Concierge Welcoming Dialogue Card */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.9, transformOrigin: 'bottom left' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 w-[calc(100vw-2rem)] sm:w-80 bg-[#161411]/95 backdrop-blur-md border border-[#C5A880]/60 rounded-2xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.7)] text-[#FAF7F2] relative overflow-hidden"
          >
            {/* Top golden accent bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent" />

            {/* Header with Host Identity and Close */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#C5A880] shadow-md bg-[#241F1A]">
                    <img
                      src="/images/royal_concierge.jpg"
                      alt="Maharaj Raghuveer - Royal Concierge"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#161411]" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-editorial-serif text-sm font-bold text-[#FAF7F2] leading-tight">
                      {isHi ? 'महाराज रघुवीर जी' : 'Raghuveer Ji'}
                    </h4>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#C5A880]/20 text-[#C5A880] font-mono uppercase tracking-wider">
                      {isHi ? 'होस्ट' : 'Host'}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/50">
                    {isHi ? 'मुख्य आतिथ्य सत्कार • इंदौर' : 'Royal Concierge • Panjtara'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setHasInteracted(true);
                }}
                className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                title={isHi ? 'संक्षिप्त करें' : 'Minimize'}
                aria-label="Minimize concierge"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Dialogue Speech Bubble */}
            <div className="py-3">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#C5A880]/15 text-[#C5A880] text-[9.5px] uppercase font-bold tracking-wider mb-1.5">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{currentGreeting.tag}</span>
              </div>

              <motion.p
                key={currentIdx}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="text-xs text-[#FAF7F2]/90 leading-relaxed font-light"
              >
                "{currentGreeting.text}"
              </motion.p>
            </div>

            {/* Engaging Quick Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="concierge-reserve-btn"
                  onClick={handleReserveClick}
                  className="py-2 px-2.5 rounded-lg bg-[#C5A880] hover:bg-[#dfcaab] text-[#12110F] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isHi ? 'टेबल बुक करें' : 'Book Table'}</span>
                </button>

                <button
                  id="concierge-order-btn"
                  onClick={handleOrderClick}
                  className="py-2 px-2.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isHi ? 'ऑर्डर करें' : 'Order Food'}</span>
                </button>
              </div>

              {/* Direct WhatsApp Concierge Assistance */}
              <a
                href="https://wa.me/919876543210?text=Namaste!%20I%20would%20like%20assistance%20with%20table%20booking%20or%20dining%20at%20Panjtara%20Pure%20Veg%2C%20Indore."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-[11px] font-medium transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{isHi ? 'व्हाट्सएप पर शाही सहायता' : 'WhatsApp Concierge Desk'}</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-white/40" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Interactive Character Avatar Trigger */}
      <motion.button
        id="royal-concierge-toggle-btn"
        onClick={() => {
          setIsOpen(!isOpen);
          setHasInteracted(true);
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="group relative flex items-center gap-2.5 bg-[#141210]/95 hover:bg-[#1C1814] border-2 border-[#C5A880] p-1.5 pr-3.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all cursor-pointer backdrop-blur-md"
        aria-label="Toggle Royal Concierge"
        title="Namaste! Click to speak with Royal Concierge"
      >
        {/* Pulsing Golden Aura */}
        <span className="absolute inset-0 rounded-full bg-[#C5A880]/20 animate-ping pointer-events-none opacity-40" />

        {/* Character Avatar with Royal Namaste Framing */}
        <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#C5A880] shadow-md bg-[#241F1A] shrink-0">
          <img
            src="/images/royal_concierge.jpg"
            alt="Royal Concierge Character Avatar"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
          {/* Namaste Badge */}
          <div className="absolute bottom-0 right-0 bg-[#C5A880] text-[#12110F] text-[9px] font-bold px-1 rounded-tl-sm flex items-center justify-center leading-none">
            🙏
          </div>
        </div>

        {/* Text Label & Status Indicator */}
        <div className="text-left hidden xs:block">
          <div className="flex items-center gap-1.5">
            <span className="font-editorial-serif text-xs font-bold text-[#FAF7F2] tracking-wide">
              {isHi ? 'रघुवीर जी' : 'Raghuveer Ji'}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="text-[10px] text-[#C5A880] font-medium block leading-tight">
            {isOpen
              ? isHi ? 'संक्षिप्त करें' : 'Tap to close'
              : isHi ? 'नमस्ते! कैसे मदद करें?' : 'Namaste! How may I help?'}
          </span>
        </div>

        {/* Small Notification Pill if not opened yet */}
        {!hasInteracted && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A880] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C5A880]" />
          </span>
        )}
      </motion.button>
    </div>
  );
}
