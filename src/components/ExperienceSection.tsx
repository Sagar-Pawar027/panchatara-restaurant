import React from 'react';
import { Sparkles, HeartHandshake, ShieldCheck, Clock } from 'lucide-react';
import { RESTAURANT_IMAGES } from '../data/restaurantData';

export const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="py-20 bg-[#0D0B08] text-[#E8DFD0] relative border-t border-[#1C1610]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C9A24D] font-medium">
              <span>Satvik Malwa Heritage</span>
              <span aria-hidden="true">·</span>
              <span>Indore Bypass Landmark</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#F7E7CE] leading-tight">
              Culinary Grace Born of Clay & Charcoal
            </h2>

            <p className="text-sm sm:text-base text-[#A89F91] leading-relaxed">
              Panchtara is rooted in the timeless hospitality traditions of Central India. From hand-pounded masalas ground daily on stone silbattas to slow dum cooking in sealed earthen vessels, every dish is an ode to purity and royal flavor.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#14100C] border border-[#261E14]">
                <ShieldCheck className="w-5 h-5 text-[#C9A24D] mb-2" />
                <h4 className="text-sm font-bold text-[#F7E7CE]">100% Satvik Pure Veg</h4>
                <p className="text-xs text-[#8C8273] mt-1">
                  Strictly vegetarian environment with dedicated Jain preparations upon request.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#14100C] border border-[#261E14]">
                <Clock className="w-5 h-5 text-[#C9A24D] mb-2" />
                <h4 className="text-sm font-bold text-[#F7E7CE]">Overnight Dal Simmer</h4>
                <p className="text-xs text-[#8C8273] mt-1">
                  Dal Panchtara is simmered for 16 continuous hours over smoldering tandoor embers.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#14100C] border border-[#261E14]">
                <Sparkles className="w-5 h-5 text-[#C9A24D] mb-2" />
                <h4 className="text-sm font-bold text-[#F7E7CE]">Live Sitar Evenings</h4>
                <p className="text-xs text-[#8C8273] mt-1">
                  Gentle classical Indian ragas accompany your evening candlelight courtyard dinners.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#14100C] border border-[#261E14]">
                <HeartHandshake className="w-5 h-5 text-[#C9A24D] mb-2" />
                <h4 className="text-sm font-bold text-[#F7E7CE]">Zero Rush Hospitality</h4>
                <p className="text-xs text-[#8C8273] mt-1">
                  Tables reserved with advance tokens are kept exclusively available for your arrival.
                </p>
              </div>
            </div>
          </div>

          {/* Right Visual Bento Column */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#1A140F] border border-[#2B231B] shadow-lg">
                <img
                  src={RESTAURANT_IMAGES.dalPanchtara}
                  alt="Dal Panchtara Slow Cooked"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-4 rounded-2xl bg-[#14100C] border border-[#261E14]">
                <span className="text-[10px] text-[#C9A24D] font-mono uppercase tracking-wider block">Signature Secret</span>
                <span className="text-xs font-semibold text-[#E8DFD0] mt-0.5 block">Hand-Churned Makhan & Desi Ghee Only</span>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="p-4 rounded-2xl bg-[#14100C] border border-[#261E14]">
                <span className="text-[10px] text-[#C9A24D] font-mono uppercase tracking-wider block">Highway Access</span>
                <span className="text-xs font-semibold text-[#E8DFD0] mt-0.5 block">Direct Valet Drop-off on Indore Bypass</span>
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#1A140F] border border-[#2B231B] shadow-lg">
                <img
                  src={RESTAURANT_IMAGES.royalBiryani}
                  alt="Awadhi Dum Biryani Handi"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
