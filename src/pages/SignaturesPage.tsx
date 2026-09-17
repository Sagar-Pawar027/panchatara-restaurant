import { useNavigate } from 'react-router-dom';
import { SignatureDishesSection } from '../components/sections/SignatureDishesSection.tsx';
import { SignatureDish } from '../types/index.ts';
import { ArrowRight, Utensils, Calendar } from 'lucide-react';

interface SignaturesPageProps {
  onSelectDish: (dish: SignatureDish) => void;
}

export function SignaturesPage({ onSelectDish }: SignaturesPageProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Page Header Banner */}
      <div className="bg-[#12110F] text-[#FAF7F2] pt-32 pb-16 sm:pt-36 sm:pb-20 px-6 sm:px-8 border-b border-[#C5A880]/20">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#C5A880]/30 bg-black/40 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#C5A880]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Masterpieces of the Hearth</span>
          </div>

          <h1 className="font-editorial-serif text-3xl sm:text-5xl lg:text-6xl text-[#FAF7F2] tracking-tight">
            Chef’s Signature Dishes
          </h1>

          <p className="font-editorial-serif text-base sm:text-lg italic text-[#C5A880] max-w-2xl mx-auto font-light">
            “Prized recipes perfected over generations—from glowing charcoal tandoor platters to slow-simmered handi gravies.”
          </p>
        </div>
      </div>

      {/* Main Signature Dishes Content */}
      <SignatureDishesSection
        onSelectDish={onSelectDish}
        onViewFullMenu={() => navigate('/menu')}
      />

      {/* Next Steps CTA Strip */}
      <div className="py-16 bg-[#F4EFE6] border-t border-[#EAE1D3] text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-4">
          <h2 className="font-editorial-serif text-2xl sm:text-3xl text-[#161412]">
            Ready to Taste the Craft?
          </h2>
          <p className="text-xs sm:text-sm text-[#5D574F] max-w-lg mx-auto">
            Book your table or explore our entire 80+ item dining menu.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/menu')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#161412] hover:bg-[#2C2824] text-[#FAF7F2] text-xs uppercase tracking-[0.2em] font-medium rounded-sm transition-all"
            >
              <Utensils className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Explore Complete Menu</span>
            </button>
            <button
              onClick={() => navigate('/reservation')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C5A880] hover:bg-[#dfcaab] text-[#12110F] text-xs uppercase tracking-[0.2em] font-medium rounded-sm transition-all shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reserve a Table</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
