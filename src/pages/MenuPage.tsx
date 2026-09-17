import { useNavigate } from 'react-router-dom';
import { Sparkles, Utensils, ShieldCheck, ArrowRight } from 'lucide-react';
import { InteractiveMenuSection } from '../components/sections/InteractiveMenuSection.tsx';
import { MenuItem } from '../types/index.ts';

interface MenuPageProps {
  onSelectDish: (dish: MenuItem) => void;
}

export function MenuPage({ onSelectDish }: MenuPageProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Page Header Banner */}
      <div className="bg-[#12110F] text-[#FAF7F2] pt-32 pb-16 sm:pt-36 sm:pb-20 px-6 sm:px-8 border-b border-[#C5A880]/20">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#C5A880]/30 bg-black/40 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#C5A880]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>100% Pure Vegetarian Kitchen • Indore Bypass</span>
          </div>

          <h1 className="font-editorial-serif text-3xl sm:text-5xl lg:text-6xl text-[#FAF7F2] tracking-tight">
            Our Gastronomic Menu
          </h1>

          <p className="font-editorial-serif text-base sm:text-lg italic text-[#C5A880] max-w-2xl mx-auto font-light">
            “Authentic tandoori starters, slow-simmered rich curries, hot earthen rotis, and pure satvik Jain specialties.”
          </p>

          <div className="pt-2 flex items-center justify-center gap-6 text-xs text-white/60">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Strictly Pure Veg
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              Dedicated Jain Options
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Menu Section */}
      <InteractiveMenuSection
        onSelectDish={onSelectDish}
        onReserveTable={() => navigate('/reservation')}
      />
    </div>
  );
}
