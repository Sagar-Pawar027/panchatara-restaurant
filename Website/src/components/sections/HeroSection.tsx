import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { RoyalCrestSticker } from '../common/ThemeStickers.tsx';

interface HeroSectionProps {
  onReserveTable: () => void;
  onPreOrderMeal: () => void;
  onExploreMenu?: () => void;
  onExplorePanchtara?: () => void;
}

export function HeroSection({
  onReserveTable,
  onPreOrderMeal,
  onExplorePanchtara,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [hoveredCard, setHoveredCard] = useState<'reserve' | 'preorder' | null>(null);
  const { language, t } = useLanguage();
  const isHi = language === 'hi';

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Calm, GPU-accelerated background parallax
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.75], ['0%', '6%']);

  const handleScrollExplore = () => {
    if (onExplorePanchtara) {
      onExplorePanchtara();
    } else {
      const storyEl = document.getElementById('story') || document.getElementById('philosophy');
      storyEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      aria-label="Welcome to Panchtara"
      className="relative w-full min-h-[100dvh] flex flex-col justify-between items-center text-center text-[#FAF7F2] bg-[#0A0908] pt-[calc(env(safe-area-inset-top,0px)+5rem)] sm:pt-32 pb-10 sm:pb-14 px-4 sm:px-6 select-none"
    >
      {/* Background Image with Parallax and Layered Vignettes */}
      <motion.div
        style={
          shouldReduceMotion
            ? {}
            : {
                y: bgY,
                scale: bgScale,
              }
        }
        className="absolute inset-0 z-0 pointer-events-none will-change-transform overflow-hidden"
      >
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=85"
          alt="Panjtara Pure Veg Dining Atmosphere"
          className="w-full h-full object-cover object-center filter brightness-[0.52] contrast-[1.12]"
          loading="eager"
        />

        {/* Cinematic rich vignettes & atmospheric warm overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/65 to-[#0A0908]/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(10,9,8,0.85)_85%)]" />
        <div
          className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
            hoveredCard === 'reserve'
              ? 'bg-amber-950/20'
              : hoveredCard === 'preorder'
              ? 'bg-emerald-950/20'
              : 'opacity-0'
          }`}
        />
      </motion.div>

      {/* Top Heritage Badge: Refined & Understated */}
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="relative z-10 inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full border border-[#C5A880]/30 bg-black/60 backdrop-blur-md text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#C5A880] text-center max-w-[94vw]"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span className="hidden sm:inline">{t('hero.badge')}</span>
        <span className="sm:hidden">{isHi ? '100% शुद्ध शाकाहारी • इंदौर बायपास' : '100% Pure Veg • Indore Bypass'}</span>
      </motion.div>

      {/* Floating Royal Animated Crest Sticker */}
      <div className="absolute top-24 sm:top-28 right-4 sm:right-8 lg:right-14 z-20 hidden md:block pointer-events-auto">
        <RoyalCrestSticker size="md" />
      </div>

      {/* Centerpiece Presentation */}
      <motion.div
        style={shouldReduceMotion ? {} : { opacity: contentOpacity, y: contentY }}
        className="relative z-10 w-full max-w-5xl mx-auto my-auto py-4 sm:py-6 space-y-6 sm:space-y-8"
      >
        {/* Top Tagline */}
        <motion.p
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.25 }}
          className="text-xs sm:text-sm md:text-base tracking-[0.28em] sm:tracking-[0.34em] uppercase text-[#E0CEB5] font-light"
        >
          {isHi ? 'जहाँ हर भोजन एक यादगार दावत बन जाता है' : 'Where every meal becomes a memory.'}
        </motion.p>

        {/* Main Title: PANCHTARA */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.95, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-2 pb-2"
        >
          <h1 className="font-editorial-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-[0.14em] sm:tracking-[0.18em] text-[#FAF7F2] uppercase drop-shadow-md">
            {isHi ? 'पंचतारा' : 'Panchtara'}
          </h1>
        </motion.div>

        {/* Interactive "CHOOSE YOUR EXPERIENCE" (Section 40) */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="pt-2 sm:pt-4 max-w-3xl mx-auto"
        >
          <div className="bg-[#12110F]/85 border border-[#C5A880]/30 rounded-sm p-5 sm:p-7 backdrop-blur-md shadow-2xl relative">
            {/* Top Eyebrow & Prompt */}
            <div className="text-center mb-5 sm:mb-6">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#C5A880] block font-medium mb-1">
                {isHi ? 'आपकी शाम प्रतीक्षारत है' : 'Your Evening Awaits'}
              </span>
              <h2 className="font-editorial-serif text-xl sm:text-2xl text-[#FAF7F2] font-light">
                {isHi ? 'आप पंचतारा का अनुभव कैसे करना चाहेंगे?' : 'How would you like to experience Panchtara?'}
              </h2>
            </div>

            {/* Royal Concierge Welcome Banner */}
            <div className="flex items-center gap-3 p-3 sm:p-3.5 mb-5 rounded-lg bg-gradient-to-r from-[#241F1A]/95 via-[#1A1713]/90 to-[#141210]/80 border border-[#C5A880]/40 text-left shadow-lg">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#C5A880] shadow-md bg-[#241F1A]">
                  <img
                    src="/images/royal_concierge.jpg"
                    alt="Maharaj Raghuveer Ji"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#12110F]" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-editorial-serif text-xs sm:text-sm font-semibold text-[#FAF7F2]">
                    {isHi ? 'महाराज रघुवीर जी की ओर से सादर प्रणाम 🙏' : 'Namaste from Maharaj Raghuveer Ji 🙏'}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#C5A880]/20 text-[#C5A880] font-mono uppercase tracking-wider hidden sm:inline-block">
                    {isHi ? 'मुख्य आतिथ्य' : 'Head Concierge'}
                  </span>
                </div>
                <p className="text-[11px] text-[#FAF7F2]/80 font-light leading-relaxed">
                  {isHi
                    ? '"पंचतारा में आपका हार्दिक स्वागत है। क्या आप आज शाम की टेबल आरक्षित करेंगे या घर के लिए ताज़ा शाही भोजन मंगवाएंगे?"'
                    : '"Welcome to Panchtara Pure Veg. Shall I reserve a royal table for your evening, or dispatch our pure veg delicacies directly to your home?"'}
                </p>
              </div>
            </div>

            {/* 2 Conversion Choice Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {/* Option 1: Reserve Your Table */}
              <div
                id="hero-card-reserve"
                role="button"
                tabIndex={0}
                onClick={onReserveTable}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onReserveTable()}
                onMouseEnter={() => setHoveredCard('reserve')}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative p-5 rounded-sm bg-[#181613]/90 hover:bg-[#1E1C18] border border-white/10 hover:border-[#C5A880]/70 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl" role="img" aria-label="Dining plate">
                      🍽
                    </span>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-white/50 group-hover:text-[#C5A880] transition-colors">
                      {isHi ? 'चरण 1 का 1' : 'Step 1 of 1'}
                    </span>
                  </div>

                  <h3 className="font-editorial-serif text-lg sm:text-xl text-[#FAF7F2] group-hover:text-[#C5A880] transition-colors font-medium">
                    {isHi ? 'टेबल बुक करें' : 'Reserve Your Table'}
                  </h3>

                  <p className="text-xs text-[#FAF7F2]/75 font-light leading-relaxed mt-1.5">
                    {isHi ? 'अपनी यात्रा के लिए टेबल बुक करें। तारीख, समय और अतिथि चुनें।' : 'Book a table for your visit. Choose your date, time and guests.'}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-medium text-[#C5A880] border-t border-white/5 mt-4">
                  <span className="uppercase tracking-wider">{t('hero.reserve')}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>

              {/* Option 2: Pre-Order Your Meal */}
              <div
                id="hero-card-preorder"
                role="button"
                tabIndex={0}
                onClick={onPreOrderMeal}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPreOrderMeal()}
                onMouseEnter={() => setHoveredCard('preorder')}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative p-5 rounded-sm bg-[#181613]/90 hover:bg-[#1E1C18] border border-[#C5A880]/30 hover:border-[#C5A880] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl" role="img" aria-label="Sparkles">
                      ✨
                    </span>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 font-medium">
                      {isHi ? '50% अग्रिम लॉक' : '50% Advance Lock'}
                    </span>
                  </div>

                  <h3 className="font-editorial-serif text-lg sm:text-xl text-[#FAF7F2] group-hover:text-[#C5A880] transition-colors font-medium">
                    {isHi ? 'भोजन प्री-ऑर्डर करें' : 'Pre-Order Your Meal'}
                  </h3>

                  <p className="text-xs text-[#FAF7F2]/75 font-light leading-relaxed mt-1.5">
                    {isHi ? '50% अग्रिम दें और हम आपके आगमन पर गर्मागर्म भोजन तैयार रखेंगे।' : "Pay 50% now & we'll prepare your meal. Choose your dishes in advance."}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-medium text-[#C5A880] border-t border-white/5 mt-4">
                  <span className="uppercase tracking-wider">{isHi ? 'प्री-ऑर्डर शुरू करें' : 'Start Your Pre-Order'}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            </div>

            {/* Smart Availability Message (Section 42) */}
            <div className="mt-4 pt-3 border-t border-white/10 text-center text-[11px] text-[#FAF7F2]/65 font-light">
              <span className="text-emerald-400 font-medium">{isHi ? 'प्रतिदिन खुला:' : 'Open Daily:'}</span> {isHi ? 'दोपहर 11:00 AM – 3:30 PM • रात्रि 6:30 PM – मध्यरात्रि • अपनी यात्रा की योजना बनाएं' : 'Lunch 11:00 AM – 3:30 PM • Dinner 6:30 PM – Midnight • Plan your visit'}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Explore Panchtara Indicator */}
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.9 }}
        className="relative z-10 pt-2"
      >
        <button
          id="hero-explore-panchtara-btn"
          onClick={handleScrollExplore}
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#FAF7F2]/70 hover:text-[#C5A880] transition-colors py-2 px-4 rounded-full border border-white/10 hover:border-[#C5A880]/40 bg-black/40 backdrop-blur-sm"
        >
          <span>{isHi ? 'पंचतारा का अनुभव करें' : 'Explore Panchtara'}</span>
          <ArrowDown className="w-3.5 h-3.5 transform group-hover:translate-y-0.5 transition-transform" />
        </button>
      </motion.div>
    </section>
  );
}
