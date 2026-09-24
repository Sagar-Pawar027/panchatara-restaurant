import { useNavigate } from 'react-router-dom';
import { Sparkles, Utensils, ShieldCheck, Bike, Percent } from 'lucide-react';
import { InteractiveMenuSection } from '../components/sections/InteractiveMenuSection.tsx';
import { MenuItem } from '../types/index.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useCart } from '../context/CartContext.tsx';

interface MenuPageProps {
  onSelectDish: (dish: MenuItem) => void;
}

export function MenuPage({ onSelectDish }: MenuPageProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isHi = language === 'hi';
  const { openCart } = useCart();

  return (
    <div className="w-full">
      {/* Page Header Banner */}
      <div className="bg-[#12110F] text-[#FAF7F2] pt-32 pb-14 sm:pt-36 sm:pb-16 px-6 sm:px-8 border-b border-[#C5A880]/20">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#C5A880]/30 bg-black/40 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#C5A880]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>
              {isHi
                ? '100% शुद्ध शाकाहारी रसोई • इंदौर बायपास'
                : '100% Pure Vegetarian Kitchen • Indore Bypass'}
            </span>
          </div>

          <h1 className="font-editorial-serif text-3xl sm:text-5xl lg:text-6xl text-[#FAF7F2] tracking-tight">
            {isHi ? 'हमारा स्वादिष्ट मेनू' : 'Our Gastronomic Menu'}
          </h1>

          <p className="font-editorial-serif text-base sm:text-lg italic text-[#C5A880] max-w-2xl mx-auto font-light">
            {isHi
              ? '“तंदूरी स्टार्टर्स, धीमी आंच पर पकी समृद्ध करी, गरमा-गरम रोटियां और सात्विक जैन व्यंजन।”'
              : '“Authentic tandoori starters, slow-simmered rich curries, hot earthen rotis, and pure satvik Jain specialties.”'}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-5 text-xs text-white/70">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {isHi ? 'शुद्ध शाकाहारी' : 'Strictly Pure Veg'}
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              {isHi ? 'विशेष जैन विकल्प' : 'Dedicated Jain Options'}
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Percent className="w-3.5 h-3.5" />
              {isHi ? '0% जोमैटो कमीशन बचत' : 'Save ~25% Aggregator Commission'}
            </span>
          </div>

          {/* Quick Action Button */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              id="menu-banner-order-delivery-btn"
              onClick={() => openCart('delivery')}
              className="px-5 py-2.5 rounded bg-emerald-950/80 border border-emerald-500/50 hover:bg-emerald-900/90 text-emerald-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
            >
              <Bike className="w-4 h-4 text-emerald-400" />
              <span>{isHi ? 'ऑनलाइन फूड ऑर्डर करें (0% शुल्क)' : 'Order Food Online (0% Commission)'}</span>
            </button>
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
