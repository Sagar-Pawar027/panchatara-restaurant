import React from 'react';
import { ArrowRight, Utensils, Sparkles, ShoppingBag, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  onReserveTable: () => void;
  onPreOrder: () => void;
  onOpenCart: () => void;
  language: 'en' | 'hi';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onReserveTable,
  onPreOrder,
  onOpenCart,
  language,
}) => {
  const isHi = language === 'hi';

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[#0A0908] pt-20 pb-28 px-4 sm:px-6">
      {/* Background Video / Poster */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/videos/hero-poster.jpg"
          className="w-full h-full object-cover object-center scale-105"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
          <img
            src="/videos/hero-poster.jpg"
            alt="Panchtara Restaurant Interior"
            className="w-full h-full object-cover"
          />
        </video>
        {/* Measured dark scrim for high contrast and readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-brightness-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C0A] via-black/40 to-black/70" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center flex flex-col items-center">
        
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] sm:text-xs tracking-wider uppercase text-[#FAF7F2]/90 mb-4 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span>INDORE BYPASS • 100% PURE VEG GARDEN & POOLSIDE SANCTUARY</span>
        </div>

        {/* Subtitle */}
        <div className="text-[11px] sm:text-xs uppercase tracking-[0.35em] text-[#FAF7F2]/80 font-medium mb-3">
          {isHi ? 'जहाँ हर भोजन एक मधुर स्मृति बन जाता है' : 'WHERE EVERY MEAL BECOMES A MEMORY'}
        </div>

        {/* Giant Serif Brand Name */}
        <h1 className="font-editorial-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light text-[#FAF7F2] tracking-[0.25em] uppercase leading-none drop-shadow-2xl mb-8">
          PANCHTARA
        </h1>

        {/* Central Interactive Card ("Your Evening Awaits") */}
        <div className="w-full max-w-3xl md:max-w-4xl lg:max-w-5xl bg-[#12110F]/90 border border-[#C5A880]/35 rounded-xl p-5 sm:p-7 md:p-9 backdrop-blur-md shadow-2xl relative text-left">
          
          {/* Card Header */}
          <div className="text-center mb-5 sm:mb-7">
            <span className="text-xs sm:text-sm md:text-base uppercase tracking-[0.32em] text-[#C5A880] block font-semibold mb-2">
              {isHi ? 'आपकी शाम प्रतीक्षारत है' : 'YOUR EVENING AWAITS'}
            </span>
            <h2 className="font-editorial-serif text-2xl sm:text-3xl md:text-4xl text-[#FAF7F2] font-normal tracking-wide">
              {isHi ? 'आप पंचतारा का अनुभव कैसे करना चाहेंगे?' : 'How would you like to experience Panchtara?'}
            </h2>
          </div>

          {/* Concierge Message Banner */}
          <div className="flex items-center gap-3.5 sm:gap-4 p-4 sm:p-5 mb-6 sm:mb-7 rounded-xl bg-gradient-to-r from-[#241F1A]/95 via-[#1A1713]/90 to-[#141210]/80 border border-[#C5A880]/40 text-left shadow-lg">
            <div className="relative shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-[#C5A880] shadow-md bg-[#241F1A]">
                <img
                  src="/images/royal_concierge.jpg"
                  alt="Maharaj Raghuveer Ji"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#12110F]" />
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-editorial-serif text-sm sm:text-base md:text-lg font-semibold text-[#FAF7F2]">
                  {isHi ? 'महाराज रघुवीर जी की ओर से सादर प्रणाम 🙏' : 'Namaste from Maharaj Raghuveer Ji 🙏'}
                </span>
                <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded bg-[#C5A880]/20 text-[#C5A880] font-mono uppercase tracking-wider font-semibold">
                  HEAD CONCIERGE
                </span>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-[#FAF7F2]/90 font-normal leading-relaxed">
                {isHi
                  ? '"पंचतारा में आपका हार्दिक स्वागत है। क्या आप आज शाम की टेबल आरक्षित करेंगे या घर के लिए ताज़ा शाही भोजन मंगवाएंगे?"'
                  : '"Welcome to Panchtara Pure Veg. Shall I reserve a royal table for your evening, or dispatch our pure veg delicacies directly to your home?"'}
              </p>
            </div>
          </div>

          {/* Two Option Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Left Card: Reserve Your Table */}
            <div
              role="button"
              tabIndex={0}
              onClick={onReserveTable}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onReserveTable()}
              className="group relative p-5 sm:p-6 md:p-7 rounded-xl bg-[#181613]/90 hover:bg-[#201D19] border border-white/10 hover:border-[#C5A880]/80 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-md hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-3xl sm:text-4xl" role="img" aria-label="Dining plate">🍽</span>
                  <span className="text-xs sm:text-sm font-mono tracking-widest uppercase text-white/60 group-hover:text-[#C5A880] transition-colors font-medium">
                    {isHi ? 'चरण 1 का 1' : 'STEP 1 OF 1'}
                  </span>
                </div>
                <h3 className="font-editorial-serif text-xl sm:text-2xl md:text-3xl text-[#FAF7F2] group-hover:text-[#C5A880] transition-colors font-medium">
                  {isHi ? 'टेबल बुक करें' : 'Reserve Your Table'}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-[#FAF7F2]/80 font-light leading-relaxed mt-2.5">
                  {isHi
                    ? 'अपनी यात्रा के लिए टेबल बुक करें। तारीख, समय और अतिथि चुनें।'
                    : 'Book a table for your visit. Choose your date, time and guests.'}
                </p>
              </div>

              <div className="pt-4 sm:pt-5 flex items-center justify-between text-xs sm:text-sm md:text-base font-semibold text-[#C5A880] border-t border-white/10 mt-5">
                <span className="uppercase tracking-wider">
                  {isHi ? 'टेबल आरक्षित करें' : 'RESERVE A TABLE'}
                </span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </div>

            {/* Right Card: Pre-Order Your Meal */}
            <div
              role="button"
              tabIndex={0}
              onClick={onPreOrder}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPreOrder()}
              className="group relative p-5 sm:p-6 md:p-7 rounded-xl bg-[#181613]/90 hover:bg-[#201D19] border border-[#C5A880]/35 hover:border-[#C5A880] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-md hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-3xl sm:text-4xl" role="img" aria-label="Sparkles">✨</span>
                  <span className="text-xs sm:text-sm font-mono tracking-widest uppercase text-emerald-400 font-semibold">
                    {isHi ? '50% अग्रिम लॉक' : '50% ADVANCE LOCK'}
                  </span>
                </div>
                <h3 className="font-editorial-serif text-xl sm:text-2xl md:text-3xl text-[#FAF7F2] group-hover:text-[#C5A880] transition-colors font-medium">
                  {isHi ? 'भोजन प्री-ऑर्डर करें' : 'Pre-Order Your Meal'}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-[#FAF7F2]/80 font-light leading-relaxed mt-2.5">
                  {isHi
                    ? '50% अग्रिम दें और हम आपके आगमन पर गर्मागर्म भोजन तैयार रखेंगे।'
                    : "Pay 50% now & we'll prepare your meal. Choose your dishes in advance."}
                </p>
              </div>

              <div className="pt-4 sm:pt-5 flex items-center justify-between text-xs sm:text-sm md:text-base font-semibold text-[#C5A880] border-t border-white/10 mt-5">
                <span className="uppercase tracking-wider">
                  {isHi ? 'प्री-ऑर्डर शुरू करें' : 'START PRE-ORDER'}
                </span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </div>

          </div>

          {/* Availability / Operating Hours */}
          <div className="mt-5 sm:mt-6 pt-4 border-t border-white/15 text-center text-xs sm:text-sm md:text-base text-[#FAF7F2]/80 font-light">
            <span className="text-emerald-400 font-medium">{isHi ? 'प्रतिदिन खुला:' : 'Open Daily:'}</span>{' '}
            {isHi ? 'दोपहर 11:00 AM – 3:30 PM • रात्रि 6:30 PM – मध्यरात्रि • अपनी यात्रा की योजना बनाएं' : 'Lunch 11:00 AM – 3:30 PM • Dinner 6:30 PM – Midnight • Plan your visit'}
          </div>
        </div>

      </div>

      {/* Floating / Sticky Order Bar at Bottom */}
      <aside aria-label="Direct order bar" className="fixed bottom-4 sm:bottom-6 z-30 inset-x-4 max-w-2xl mx-auto">
        <div className="p-2 sm:p-2.5 rounded-xl bg-[#12110F]/95 border border-[#C5A880]/40 backdrop-blur-md shadow-2xl flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Bag count & savings */}
          <div className="flex items-center gap-3 pl-2">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-[#241F1A] border border-[#3A3228] flex items-center justify-center text-[#C5A880]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full bg-emerald-500 text-black text-[9px] font-bold">
                3
              </span>
            </div>

            <div className="text-left">
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono font-bold text-sm text-[#FAF7F2]">₹450</span>
                <span className="text-[10px] text-[#C5A880] uppercase tracking-wider font-semibold">3 ITEMS</span>
              </div>
              <span className="text-[10px] text-emerald-400 block font-medium">
                Direct Order: Saved ~₹113 vs Zomato
              </span>
            </div>
          </div>

          {/* Center: 0% App Commission Badge */}
          <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span>%</span>
            <span>0% App Commission</span>
          </div>

          {/* Right CTA Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#C5A880] to-[#997424] hover:from-[#D5B890] hover:to-[#A8822F] text-[#0E0C0A] font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            <span>ORDER NOW • DIRECT DELIVERY</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Floating Royal Concierge Avatar at Bottom Left */}
      <aside aria-label="Royal concierge character" className="fixed bottom-4 left-4 z-30 hidden sm:block">
        <div
          role="button"
          tabIndex={0}
          onClick={onReserveTable}
          className="relative group cursor-pointer"
          title="Chat with Maharaj Raghuveer Ji"
        >
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#C5A880] shadow-2xl bg-[#241F1A] transition-transform duration-300 group-hover:scale-105 ring-2 ring-black/40">
            <img
              src="/images/royal_concierge.jpg"
              alt="Maharaj Raghuveer Ji"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0E0C0A]" />
        </div>
      </aside>
    </section>
  );
};
