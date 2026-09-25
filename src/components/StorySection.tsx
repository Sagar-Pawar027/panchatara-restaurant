import React from 'react';
import { Heart, Sparkles, Award, ShieldCheck } from 'lucide-react';

export const StorySection: React.FC = () => {
  return (
    <section id="heritage" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0b100d] border-t border-[#1d2d23]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Visual Composition */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#263c2e] shadow-2xl bg-[#14231a]">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"
                alt="Panchtara Royal Dining Ambiance"
                referrerPolicy="no-referrer"
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b100d] via-black/30 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#0b120e]/90 backdrop-blur-md border border-[#23352a]">
                <p className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">Our Sacred Creed</p>
                <p className="text-sm text-white font-medium mt-1">
                  "Annadata Sukhibhava — Every grain cooked in pure A2 ghee, stone-pounded royal masalas, and pristine pure vegetarian integrity."
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Heritage Prose */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-[#15231b] border border-[#2d4636]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Indore Bypass Culinary Heritage</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-royal font-bold text-white leading-tight">
              Honoring India's Pure Vegetarian Grandeur
            </h2>

            <p className="text-sm text-[#a0aec0] leading-relaxed">
              Situated gracefully along the busy Indore Bypass, Panchtara was conceived to provide discerning travelers, Indore families, and culinary connoisseurs a sanctuary of royal gastronomic hospitality.
            </p>

            <p className="text-sm text-[#a0aec0] leading-relaxed">
              From our famous 24-hour slow wood-fired Dal Panchtara to our handcrafted tandoori soya chaap and Sarafa-inspired chilled rabdi desserts, every offering honors traditional techniques devoid of artificial colors, emulsifiers, or frozen compromises.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1d2d23]">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#15241b] text-[#d4af37] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">100% Pure Veg</h4>
                  <p className="text-[11px] text-[#8e9f94] mt-0.5">Strictly separate kitchens and zero animal products.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#15241b] text-[#d4af37] shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Malwa Tradition</h4>
                  <p className="text-[11px] text-[#8e9f94] mt-0.5">Authentic local recipes made with organic farm produce.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
