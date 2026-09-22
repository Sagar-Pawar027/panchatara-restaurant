import { useNavigate } from 'react-router-dom';
import { PhilosophySection } from '../components/sections/PhilosophySection.tsx';
import { ArrowRight, Utensils, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

export function PhilosophyPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isHi = language === 'hi';

  return (
    <div className="w-full">
      {/* Page Header Banner */}
      <div className="bg-[#12110F] text-[#FAF7F2] pt-32 pb-16 sm:pt-36 sm:pb-20 px-6 sm:px-8 border-b border-[#C5A880]/20">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#C5A880]/30 bg-black/40 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#C5A880]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{isHi ? 'पवित्रता एवं परंपरा' : 'Purity & Tradition'}</span>
          </div>

          <h1 className="font-editorial-serif text-3xl sm:text-5xl lg:text-6xl text-[#FAF7F2] tracking-tight">
            {isHi ? 'हमारा पाक-कला दर्शन' : 'Our Culinary Philosophy'}
          </h1>

          <p className="font-editorial-serif text-base sm:text-lg italic text-[#C5A880] max-w-2xl mx-auto font-light">
            {isHi
              ? '“भारतीय शाकाहारी पाककला के चार पवित्र स्तंभ: शुद्धता, कारीगरी, ताज़गी और सत्कार।”'
              : '“Four sacred principles of Indian vegetarian gastronomy: Purity, Craft, Freshness, and Hospitality.”'}
          </p>
        </div>
      </div>

      {/* Main Philosophy Content */}
      <PhilosophySection />

      {/* Next Steps CTA Strip */}
      <div className="py-16 bg-[#F4EFE6] border-t border-[#EAE1D3] text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-4">
          <h2 className="font-editorial-serif text-2xl sm:text-3xl text-[#161412]">
            {isHi ? 'हमारे पाक-शिल्प का स्वाद चखें' : 'Taste Our Culinary Craft'}
          </h2>
          <p className="text-xs sm:text-sm text-[#5D574F] max-w-lg mx-auto">
            {isHi
              ? 'अनुभव करें कैसे ये सिद्धांत हमारी मिट्टी के तंदूर की रोटियों, दाल हांडी और शाही पनीर करी में जीवंत होते हैं।'
              : 'See how these principles come to life in our signature tandoor breads, dal handis, and paneer curries.'}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/signatures')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#161412] hover:bg-[#2C2824] text-[#FAF7F2] text-xs uppercase tracking-[0.2em] font-medium rounded-sm transition-all"
            >
              <span>{isHi ? 'खास व्यंजन देखें' : 'View Signature Dishes'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
            </button>
            <button
              onClick={() => navigate('/menu')}
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#161412]/30 hover:border-[#161412] text-[#161412] text-xs uppercase tracking-[0.2em] font-medium rounded-sm transition-all"
            >
              <Utensils className="w-3.5 h-3.5 text-[#A68860]" />
              <span>{isHi ? 'संपूर्ण मेनू' : 'Full Menu'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
