import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Sparkles, Utensils, Star, ShieldCheck, MapPin, Clock, Calendar, HeartHandshake } from 'lucide-react';
import { HeroSection } from '../components/sections/HeroSection.tsx';
import { RESTAURANT_INFO, PHILOSOPHY_PRINCIPLES, EXPERIENCE_PILLARS } from '../data/restaurant.ts';
import { SIGNATURE_DISHES } from '../data/menu.ts';
import { SignatureDish, MenuItem } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface HomePageProps {
  onPreOrderClick: () => void;
  onSelectDish: (dish: SignatureDish | MenuItem) => void;
}

export function HomePage({ onPreOrderClick, onSelectDish }: HomePageProps) {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { language, t } = useLanguage();
  const isHi = language === 'hi';

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <HeroSection
        onReserveTable={() => navigate('/reservation')}
        onPreOrderMeal={onPreOrderClick}
        onExploreMenu={() => navigate('/menu')}
        onExplorePanchtara={() => navigate('/story')}
      />

      {/* 2. Restaurant Identity & Story Overview */}
      <section
        id="home-about-overview"
        aria-label="About Panjtara Pure Veg"
        className="py-24 sm:py-32 bg-[#FAF7F2] text-[#1C1A17] border-b border-[#EAE1D3]"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Eyebrow badge */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#A68860] font-semibold">
              {t('home.essence.eyebrow')}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#161412] leading-[1.15]">
                {t('home.essence.heading')}
              </h2>

              <p className="font-editorial-serif text-lg sm:text-xl italic text-[#A68860] leading-relaxed">
                {t('home.essence.quote')}
              </p>

              <div className="space-y-4 text-sm sm:text-base text-[#4A453F] leading-relaxed font-light">
                <p>{t('home.essence.p1')}</p>
                <p>{t('home.essence.p2')}</p>
              </div>

              {/* Badges row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#EAE1D3]">
                <div className="space-y-1">
                  <span className="font-editorial-display text-xl sm:text-2xl font-semibold text-[#161412] block">
                    100%
                  </span>
                  <span className="text-[11px] tracking-wider uppercase text-[#736B63] block">
                    {t('home.essence.stat1')}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="font-editorial-display text-xl sm:text-2xl font-semibold text-[#161412] block">
                    4.1★
                  </span>
                  <span className="text-[11px] tracking-wider uppercase text-[#736B63] block">
                    {t('home.essence.stat2')}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="font-editorial-display text-xl sm:text-2xl font-semibold text-[#161412] block">
                    3+
                  </span>
                  <span className="text-[11px] tracking-wider uppercase text-[#736B63] block">
                    {t('home.essence.stat3')}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="font-editorial-display text-xl sm:text-2xl font-semibold text-[#161412] block">
                    7 Days
                  </span>
                  <span className="text-[11px] tracking-wider uppercase text-[#736B63] block">
                    {t('home.essence.stat4')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  id="home-explore-story-btn"
                  onClick={() => navigate('/story')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#161412] hover:bg-[#2C2824] text-[#FAF7F2] text-xs uppercase tracking-[0.2em] font-medium rounded-sm transition-all shadow-sm"
                >
                  <span>{t('home.essence.readStory')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                </button>
                <button
                  id="home-view-menu-btn"
                  onClick={() => navigate('/menu')}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#161412]/20 hover:border-[#161412] text-[#161412] text-xs uppercase tracking-[0.2em] font-medium rounded-sm transition-all"
                >
                  <Utensils className="w-3.5 h-3.5 text-[#A68860]" />
                  <span>{t('home.essence.browseMenu')}</span>
                </button>
              </div>
            </div>

            {/* Right Visual Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] border border-[#EAE1D3]">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
                  alt="Panjtara Pure Veg Dining Atmosphere"
                  className="w-full h-full object-cover filter brightness-[0.92] contrast-[1.05]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-[#FAF7F2] space-y-1.5">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#E5D1B8] font-medium">
                    {t('home.essence.ambianceTag')}
                  </span>
                  <p className="font-editorial-serif text-lg sm:text-xl font-medium">
                    {t('home.essence.ambianceDesc')}
                  </p>
                </div>
              </div>

              {/* Floating Leaflet Card */}
              <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-[#EAE1D3] shadow-xl max-w-[240px] sm:max-w-[270px]">
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t('home.essence.jainCardTitle')}</span>
                </div>
                <p className="text-[11px] text-[#555048] leading-relaxed">
                  {t('home.essence.jainCardDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Four Culinary Pillars */}
      <section
        id="home-pillars-overview"
        aria-label="Panjtara Culinary Pillars"
        className="py-24 sm:py-28 bg-[#F4EFE6] text-[#1C1A17] border-b border-[#EAE1D3]"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#A68860] font-semibold block">
              {t('home.pillars.eyebrow')}
            </span>
            <h2 className="font-editorial-serif text-3xl sm:text-4xl text-[#161412]">
              {t('home.pillars.heading')}
            </h2>
            <p className="text-sm text-[#5D574F] font-light">
              {t('home.pillars.sub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PHILOSOPHY_PRINCIPLES.map((pillar, idx) => {
              const hiTitles = [
                'शुद्धता (100% शुद्ध शाकाहारी)',
                'मालवा एवं पंजाबी चूल्हा',
                'खेतों की ताज़ा उपज',
                'पारिवारिक एवं खुले आकाश का आतिथ्य',
              ];
              const hiTaglines = [
                'सच्ची पवित्रता एवं सात्विक परंपरा',
                'तंदूर की सौंधी महक और पारंपरिक ज़ायका',
                'प्रतिदिन ताज़ा मलाई पनीर व खड़े मसाले',
                'इंदौर के तारों की छांव में अपनापन',
              ];
              const hiQuotes = [
                'शुद्ध भोजन न केवल शरीर, बल्कि आत्मा और मन को भी तृप्त करता है।',
                'मिट्टी के तंदूर और पीतल की देग का स्वाद कोई आधुनिक तकनीक नहीं दे सकती।',
                'सच्चा स्वाद ईमानदार मिट्टी और शुद्ध सामग्री से ही शुरू होता है।',
                'अतिथि देवो भवः—जहाँ हर पारिवारिक दावत का स्वागत राजसी अंदाज में होता है।',
              ];

              return (
                <div
                  key={pillar.number}
                  className="bg-white/85 p-7 rounded-xl border border-[#EAE1D3] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-editorial-display text-xl font-bold text-[#A68860]">
                        {pillar.number}
                      </span>
                      <span className="text-xs text-emerald-700 font-medium">
                        {pillar.culturalElement}
                      </span>
                    </div>
                    <h3 className="font-editorial-display text-base font-semibold tracking-wider uppercase text-[#161412]">
                      {isHi ? hiTitles[idx] || pillar.title : pillar.title}
                    </h3>
                    <p className="text-xs text-[#5D574F] leading-relaxed">
                      {isHi ? hiTaglines[idx] || pillar.description : pillar.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#EAE1D3]/80">
                    <p className="text-[11px] italic text-[#A68860]">
                      “{isHi ? hiQuotes[idx] || pillar.quote : pillar.quote}”
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/philosophy')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#161412] hover:text-[#A68860] transition-colors"
            >
              <span>{t('home.pillars.btn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Signature Dishes Highlights */}
      <section
        id="home-signatures-preview"
        aria-label="Signature Dishes Preview"
        className="py-24 sm:py-32 bg-[#FAF7F2] text-[#1C1A17] border-b border-[#EAE1D3]"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 pb-6 border-b border-[#EAE1D3] gap-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.28em] text-[#A68860] font-semibold block mb-2">
                {t('home.signatures.eyebrow')}
              </span>
              <h2 className="font-editorial-serif text-3xl sm:text-4xl text-[#161412]">
                {t('home.signatures.heading')}
              </h2>
            </div>
            <button
              id="home-signatures-view-full-menu-top"
              onClick={() => navigate('/menu')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#161412] hover:bg-[#2C2824] text-[#FAF7F2] text-xs uppercase tracking-[0.18em] font-medium rounded-sm transition-all"
            >
              <span>{t('home.signatures.viewMenu')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SIGNATURE_DISHES.slice(0, 4).map((dish) => (
              <div
                key={dish.id}
                onClick={() => onSelectDish(dish)}
                className="group cursor-pointer bg-white rounded-xl border border-[#EAE1D3] overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#EAE1D3]">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-[#12110F]/80 backdrop-blur-sm text-[#FAF7F2] text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-sm">
                    {dish.price}
                  </div>
                  {dish.dietary?.includes('jain-available') && (
                    <div className="absolute top-3 right-3 bg-emerald-800 text-white text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm">
                      {isHi ? 'जैन' : 'Jain'}
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-widest text-[#A68860] font-medium block">
                      {dish.category}
                    </span>
                    <h3 className="font-editorial-serif text-lg font-medium text-[#161412] group-hover:text-[#A68860] transition-colors">
                      {isHi && dish.hindiName ? dish.hindiName : dish.name}
                    </h3>
                    <p className="text-xs text-[#5D574F] line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#EAE1D3] flex items-center justify-between text-xs text-[#161412] font-medium group-hover:text-[#A68860] transition-colors">
                    <span>{t('home.signatures.viewDetails')}</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              id="home-signatures-view-full-menu-bottom"
              onClick={() => navigate('/menu')}
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#C5A880] hover:bg-[#d6be9a] text-[#12110F] text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-all shadow-md"
            >
              <span>{t('home.signatures.explore80')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Dining Experiences Preview */}
      <section
        id="home-experience-preview"
        aria-label="Dining Experience at Panjtara"
        className="py-24 sm:py-32 bg-[#12110F] text-[#FAF7F2] relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#C5A880] font-semibold block">
              {t('home.experience.eyebrow')}
            </span>
            <h2 className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl text-[#FAF7F2]">
              {t('home.experience.heading')}
            </h2>
            <p className="text-sm text-white/70 font-light">
              {t('home.experience.sub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {EXPERIENCE_PILLARS.map((exp, idx) => {
              const hiExpTitles = ['गार्डन एवं पूलसाइड', 'शुद्ध शाकाहारी पाक कला', 'उत्सव व बैंक्वेट'];
              const hiExpDescs = [
                'हरे-भरे लॉन, रोशनी से जगमगाते पूलसाइड कबाना, शाम की ठंडी हवा और सुरीली धुनों के बीच यादगार भोजन।',
                'हमारे शेफ शुद्ध देसी घी और साबुत खड़े मसालों से स्वादिष्ट उत्तर भारतीय करी और तंदूरी व्यंजन तैयार करते हैं।',
                'वातानुकूलित इनडोर हॉल और इंदौर बायपास पर विशाल खुले लॉन के साथ, पारिवारिक आयोजनों का प्रमुख केंद्र।',
              ];

              return (
                <div
                  key={exp.id}
                  className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#C5A880]/50 transition-colors flex flex-col justify-between group"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-[0.85]"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-[#C5A880] text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-sm">
                      {exp.hindiTitle}
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-editorial-display text-base tracking-wider uppercase text-[#FAF7F2]">
                        {isHi ? hiExpTitles[idx] || exp.title : exp.title}
                      </h3>
                      <p className="text-xs text-white/65 leading-relaxed font-light">
                        {isHi ? hiExpDescs[idx] || exp.description : exp.description}
                      </p>
                    </div>

                    <ul className="space-y-1.5 text-[11px] text-white/75 pt-3 border-t border-white/10">
                      {exp.highlights.slice(0, 2).map((h, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2">
                          <span className="text-[#C5A880] mt-0.5">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/experience')}
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#C5A880] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#12110F] text-xs uppercase tracking-[0.2em] font-medium rounded-sm transition-all"
            >
              <span>{t('home.experience.btn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. Quick Reservation Invitation Strip */}
      <section
        id="home-reservation-cta-strip"
        aria-label="Reserve Your Table"
        className="py-20 bg-gradient-to-r from-[#221F1B] via-[#1A1815] to-[#221F1B] text-[#FAF7F2] border-y border-[#C5A880]/20"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold block">
              {t('home.cta.eyebrow')}
            </span>
            <h2 className="font-editorial-serif text-2xl sm:text-3xl lg:text-4xl">
              {t('home.cta.heading')}
            </h2>
            <p className="text-xs sm:text-sm text-white/70 font-light">
              {t('home.cta.sub')}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              id="home-reserve-action-btn"
              onClick={() => navigate('/reservation')}
              className="px-8 py-3.5 bg-[#C5A880] hover:bg-[#dfcaab] text-[#12110F] text-xs uppercase tracking-[0.2em] font-medium rounded-sm transition-all shadow-lg"
            >
              {t('home.cta.reserve')}
            </button>
            <button
              id="home-call-concierge-btn"
              onClick={() => window.open(`tel:${RESTAURANT_INFO.contact.phone}`)}
              className="px-6 py-3.5 border border-white/20 hover:border-white/50 text-[#FAF7F2] text-xs uppercase tracking-[0.18em] font-medium rounded-sm transition-all"
            >
              {t('home.cta.call')}: {RESTAURANT_INFO.contact.phone}
            </button>
          </div>
        </div>
      </section>

      {/* 7. Quick Visit & Timings Summary */}
      <section
        id="home-visit-summary"
        aria-label="Visit Panjtara Pure Veg"
        className="py-16 bg-[#FAF7F2] text-[#1C1A17]"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 sm:p-8 bg-white rounded-2xl border border-[#EAE1D3] shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EAE1D3] flex items-center justify-center shrink-0 text-[#A68860]">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#736B63] font-semibold block">
                  {t('home.visit.locationTitle')}
                </span>
                <p className="text-xs text-[#161412] font-medium">
                  {isHi ? 'मुख्य बायपास रोड, बॉम्बे इंटरनेशनल स्कूल के पास' : RESTAURANT_INFO.address.line1}
                </p>
                <p className="text-[11px] text-[#736B63]">
                  {isHi ? 'भारत बेंज़ शोरूम के सामने, इंदौर बायपास' : RESTAURANT_INFO.address.landmark}
                </p>
                <button
                  onClick={() => navigate('/location')}
                  className="text-[11px] text-[#A68860] hover:underline pt-1 block font-medium"
                >
                  {t('home.visit.directions')}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EAE1D3] flex items-center justify-center shrink-0 text-[#A68860]">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#736B63] font-semibold block">
                  {t('home.visit.hoursTitle')}
                </span>
                <p className="text-xs text-[#161412] font-medium">
                  {t('home.visit.hoursLunch')}
                </p>
                <p className="text-xs text-[#161412] font-medium">
                  {t('home.visit.hoursDinner')}
                </p>
                <span className="text-[11px] text-emerald-700 font-semibold block">
                  {t('home.visit.hoursOpen')}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EAE1D3] flex items-center justify-center shrink-0 text-[#A68860]">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#736B63] font-semibold block">
                  {t('home.visit.eventsTitle')}
                </span>
                <p className="text-xs text-[#161412] font-medium">
                  {t('home.visit.eventsDesc')}
                </p>
                <p className="text-[11px] text-[#736B63]">
                  {t('home.visit.eventsParking')}
                </p>
                <button
                  onClick={() => navigate('/reservation')}
                  className="text-[11px] text-[#A68860] hover:underline pt-1 block font-medium"
                >
                  {t('home.visit.eventsInquire')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
