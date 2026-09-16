import { motion, useReducedMotion } from 'motion/react';
import { MapPin, Phone, Clock, Navigation, ShieldCheck, Car } from 'lucide-react';
import { RESTAURANT_INFO } from '../../data/restaurant.ts';

export function LocationSection() {
  const shouldReduceMotion = useReducedMotion();
  const googleMapsUrl =
    'https://www.google.com/maps/place/Panjtara+Pure+Veg/@22.7381151,75.933332,17z/data=!4m6!3m5!1s0x3962e3a90e58642d:0xc05586d0124e2acd!8m2!3d22.7380896!4d75.9334818!16s%2Fg%2F11rwq6rp25';

  return (
    <section
      id="location"
      aria-labelledby="location-heading"
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
                [ 08 ]
              </span>
              <span className="h-[1px] w-6 bg-[#C5A880]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C7355] font-medium">
                Indore Bypass Sanctuary
              </span>
            </motion.div>

            <div className="overflow-hidden">
              <motion.h2
                id="location-heading"
                initial={shouldReduceMotion ? {} : { y: '100%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#181614] leading-[1.1]"
              >
                Find Panjtara Pure Veg
              </motion.h2>
            </div>
          </div>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md text-sm sm:text-base text-[#4A453E] font-light leading-relaxed"
          >
            Situated conveniently on Indore’s prominent Bypass Road, offering lush open-air garden lawns, poolside dining, and celebratory banquet spaces.
          </motion.p>
        </div>

        {/* Location Details & Architectural Map Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Details Card */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 bg-[#F4EFE6] border border-[#EAE1D3] rounded-sm p-8 sm:p-10 flex flex-col justify-between space-y-8"
          >
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-full bg-[#181614] text-[#C5A880] shrink-0 mt-1">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#A58458] block font-medium">
                    Address & Destination
                  </span>
                  <p className="font-editorial-serif text-xl text-[#181614] mt-0.5">
                    {RESTAURANT_INFO.address.line1}
                  </p>
                  <p className="text-xs text-[#3E3A34] font-light mt-0.5">
                    {RESTAURANT_INFO.address.area}, {RESTAURANT_INFO.address.city}, MP {RESTAURANT_INFO.address.postalCode}
                  </p>
                  <p className="text-[11px] text-[#A58458] mt-1.5 font-serif italic">
                    Landmark: {RESTAURANT_INFO.address.landmark}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-full bg-[#181614] text-[#C5A880] shrink-0 mt-1">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#A58458] block font-medium">
                    Dining Timings
                  </span>
                  <div className="text-xs text-[#181614] mt-1 space-y-1.5 font-light">
                    <div>
                      <span className="font-medium">Lunch ({RESTAURANT_INFO.hours.lunchDays}):</span>
                      <span className="block text-[#3E3A34]">{RESTAURANT_INFO.hours.lunchHours}</span>
                    </div>
                    <div>
                      <span className="font-medium">Dinner ({RESTAURANT_INFO.hours.dinnerDays}):</span>
                      <span className="block text-[#3E3A34]">{RESTAURANT_INFO.hours.dinnerHours}</span>
                    </div>
                    <div className="text-[11px] text-emerald-700 pt-1 font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
                      {RESTAURANT_INFO.hours.closed}
                    </div>
                  </div>
                </div>
              </div>

              {/* Telephone & Concierge */}
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-full bg-[#181614] text-[#C5A880] shrink-0 mt-1">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#A58458] block font-medium">
                    Table & Party Booking
                  </span>
                  <a
                    href={`tel:${RESTAURANT_INFO.contact.phone}`}
                    className="font-editorial-serif text-lg text-[#181614] hover:text-[#A58458] transition-colors block mt-0.5 font-semibold"
                  >
                    {RESTAURANT_INFO.contact.phone}
                  </a>
                  <p className="text-xs text-[#3E3A34] mt-0.5">
                    Email: <a href={`mailto:${RESTAURANT_INFO.contact.email}`} className="hover:underline">{RESTAURANT_INFO.contact.email}</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Chauffeur / Valet Notice */}
            <div className="pt-6 border-t border-[#EAE1D3] space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#181614]">
                <Car className="w-3.5 h-3.5 text-[#A58458]" />
                <span className="font-medium">Parking:</span>
                <span className="text-[#3E3A34]">Huge dedicated parking space on Indore Bypass.</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#181614]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span className="font-medium text-emerald-800">Assurance:</span>
                <span className="text-[#3E3A34]">100% Pure Vegetarian Kitchen & Hygienic Dining.</span>
              </div>

              <a
                id="get-directions-action-btn"
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-4 py-3.5 px-6 rounded-sm bg-[#181614] text-[#FAF7F2] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#3E3A34] transition-colors flex items-center justify-center gap-2 text-center"
              >
                <Navigation className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </motion.div>

          {/* Stylized Architectural Map Simulation */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative min-h-[440px] rounded-sm overflow-hidden bg-[#181614] text-[#FAF7F2] shadow-xl flex flex-col justify-between p-8"
          >
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80"
                alt="Panjtara Pure Veg garden and poolside dining ambience"
                className="w-full h-full object-cover opacity-45 filter brightness-75 contrast-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181614] via-[#181614]/70 to-[#181614]/60" />
            </div>

            {/* Stylized pin marker */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#C5A880] text-[#12110F] flex items-center justify-center shadow-2xl relative z-10">
                <MapPin className="w-7 h-7 fill-current" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] block font-medium">
                  Garden & Poolside Restaurant
                </span>
                <h3 className="font-editorial-display text-3xl text-[#FAF7F2] tracking-wider uppercase">
                  Panjtara Pure Veg
                </h3>
                <p className="text-xs text-[#FAF7F2]/80 font-light max-w-md mx-auto">
                  Main Bypass Road, In Front of Bharat Benz, Bicholi Mardana / Kanadia, Indore, MP 452016
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono">
                    ★ 4.1 on Google (3,500+ Reviews)
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                    100% Pure Veg
                  </span>
                </div>
              </div>

              <a
                id="interactive-map-direct-link"
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded bg-black/70 hover:bg-black/95 text-xs tracking-wider text-[#C5A880] border border-[#C5A880]/50 transition-colors backdrop-blur-md font-medium"
              >
                <span>Navigate via Google Maps</span>
                <span>↗</span>
              </a>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
              <span>Opposite: Bharat Benz Commercial Vehicles Showroom</span>
              <span>Near: Bombay International School, Indore Bypass</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
