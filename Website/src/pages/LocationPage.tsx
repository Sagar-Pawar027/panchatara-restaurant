import { LocationSection } from '../components/sections/LocationSection.tsx';
import { RESTAURANT_INFO } from '../data/restaurant.ts';
import { MapPin, Navigation, Car, Phone } from 'lucide-react';

export function LocationPage() {
  return (
    <div className="w-full">
      {/* Page Header Banner */}
      <div className="bg-[#12110F] text-[#FAF7F2] pt-32 pb-16 sm:pt-36 sm:pb-20 px-6 sm:px-8 border-b border-[#C5A880]/20">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#C5A880]/30 bg-black/40 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#C5A880]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Indore Bypass • Easy Access &amp; Valet</span>
          </div>

          <h1 className="font-editorial-serif text-3xl sm:text-5xl lg:text-6xl text-[#FAF7F2] tracking-tight">
            Find &amp; Contact Us
          </h1>

          <p className="font-editorial-serif text-base sm:text-lg italic text-[#C5A880] max-w-2xl mx-auto font-light">
            “Located on Indore’s prominent Bypass Road, opposite Bharat Benz, with ample secure parking.”
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-6 text-xs text-white/60">
            <span className="flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-[#C5A880]" />
              20 mins from Vijay Nagar / Palasia
            </span>
            <span className="flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-emerald-400" />
              Free Valet Parking
            </span>
            <a
              href={`tel:${RESTAURANT_INFO.contact.phone}`}
              className="flex items-center gap-1.5 hover:text-[#C5A880] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
              {RESTAURANT_INFO.contact.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Location Component */}
      <LocationSection />
    </div>
  );
}
