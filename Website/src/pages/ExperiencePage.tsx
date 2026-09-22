import { useNavigate } from 'react-router-dom';
import { ExperienceSection } from '../components/sections/ExperienceSection.tsx';
import { Calendar, Phone, ArrowRight } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurant.ts';

export function ExperiencePage() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Page Header Banner */}
      <div className="bg-[#12110F] text-[#FAF7F2] pt-32 pb-16 sm:pt-36 sm:pb-20 px-6 sm:px-8 border-b border-[#C5A880]/20">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#C5A880]/30 bg-black/40 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#C5A880]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Open Air &amp; Poolside Sanctuary</span>
          </div>

          <h1 className="font-editorial-serif text-3xl sm:text-5xl lg:text-6xl text-[#FAF7F2] tracking-tight">
            The Dining Experience
          </h1>

          <p className="font-editorial-serif text-base sm:text-lg italic text-[#C5A880] max-w-2xl mx-auto font-light">
            “Open garden lawns, poolside tables, and celebrations under starry skies on Indore Bypass.”
          </p>
        </div>
      </div>

      {/* Main Experience Content */}
      <ExperienceSection />

      {/* Celebrations & Banquet Info Strip */}
      <div className="py-20 bg-[#F4EFE6] border-t border-[#EAE1D3]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A68860] font-semibold block">
              Host Your Celebrations
            </span>
            <h2 className="font-editorial-serif text-2xl sm:text-3xl text-[#161412]">
              Grand Lawns &amp; Private Banquet Spaces
            </h2>
            <p className="text-xs sm:text-sm text-[#5D574F] leading-relaxed">
              From milestone 50th anniversaries and birthdays to intimate family get-togethers and corporate dinners, our expansive lawns host up to 500 guests with live counters, valet parking, and pure vegetarian feast spreads.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/reservation')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#161412] hover:bg-[#2C2824] text-[#FAF7F2] text-xs uppercase tracking-[0.2em] font-medium rounded-sm transition-all"
              >
                <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Reserve Dining Space</span>
              </button>
              <a
                href={`tel:${RESTAURANT_INFO.contact.phone}`}
                className="inline-flex items-center gap-2 px-5 py-3 border border-[#161412]/30 text-[#161412] text-xs uppercase tracking-[0.2em] font-medium rounded-sm transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-[#A68860]" />
                <span>Call Banquet Desk</span>
              </a>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg border border-[#EAE1D3]">
            <img
              src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80"
              alt="Panjtara Pure Veg Banquet Lawns"
              className="w-full h-full object-cover aspect-[4/3]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
