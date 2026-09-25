import React, { useState } from 'react';
import { Utensils, ShoppingBag, User, Globe, Bike, Menu, X, Calendar } from 'lucide-react';
import { ReservationData } from '../types';

interface NavbarProps {
  onOpenReservation: () => void;
  onOpenPreOrder: () => void;
  onOpenCart: () => void;
  cartCount: number;
  language: 'en' | 'hi';
  onToggleLanguage: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  activeReservation: ReservationData | null;
  onViewActiveReservation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenReservation,
  onOpenPreOrder,
  onOpenCart,
  cartCount,
  language,
  onToggleLanguage,
  onNavigate,
  activeSection,
  activeReservation,
  onViewActiveReservation,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', hiLabel: 'होम' },
    { id: 'menu', label: 'Menu', hiLabel: 'मेनू', icon: Utensils },
    { id: 'story', label: 'Our Story', hiLabel: 'हमारी कहानी' },
    { id: 'philosophy', label: 'Philosophy', hiLabel: 'सिद्धांत' },
    { id: 'signatures', label: 'Signatures', hiLabel: 'खास व्यंजन' },
    { id: 'experience', label: 'Experience', hiLabel: 'अनुभव' },
    { id: 'gallery', label: 'Gallery', hiLabel: 'गैलरी' },
    { id: 'location', label: 'Location', hiLabel: 'स्थान' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0E0C0A]/95 backdrop-blur-md border-b border-[#241F1A]">
      <div className="w-full px-3 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2 xl:gap-4">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center text-left group"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2.5 shrink-0 shadow-sm shadow-emerald-500/50" />
            <div>
              <span className="font-editorial-serif text-xl sm:text-2xl font-bold tracking-[0.25em] text-[#FAF7F2] uppercase block group-hover:text-[#C5A880] transition-colors leading-none">
                PANJTARA
              </span>
              <span className="text-[8.5px] font-mono tracking-[0.3em] text-[#C5A880] uppercase block mt-1">
                PURE VEG • INDORE
              </span>
            </div>
          </button>
        </div>

        {/* Center: Clean Nav Links (Desktop) */}
        <nav className="hidden 2xl:flex items-center gap-5 text-[13px] font-medium text-[#FAF7F2]/80">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => onNavigate(link.id)}
                className={`transition-colors whitespace-nowrap flex items-center gap-1.5 py-1 ${
                  isActive
                    ? 'text-[#C5A880] border-b-2 border-[#C5A880] font-semibold'
                    : 'text-[#FAF7F2]/75 hover:text-[#C5A880]'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5 text-[#C5A880]" />}
                <span>{language === 'hi' ? link.hiLabel : link.label}</span>
              </button>
            );
          })}

          {/* Orders Link */}
          <button
            type="button"
            onClick={onOpenCart}
            className="flex items-center gap-1.5 text-[#FAF7F2]/75 hover:text-[#C5A880] transition-colors whitespace-nowrap py-1"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Orders</span>
          </button>

          {/* Login / Sign Up */}
          <button
            type="button"
            onClick={() => alert('Customer accounts are active. Direct ordering and table reservations do not require an upfront password.')}
            className="flex items-center gap-1.5 text-[#FAF7F2]/75 hover:text-[#C5A880] transition-colors whitespace-nowrap py-1"
          >
            <User className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Login / Sign Up</span>
          </button>

          {/* Hindi / English Language Switcher */}
          <button
            type="button"
            onClick={onToggleLanguage}
            className="flex items-center gap-1 text-[#FAF7F2]/75 hover:text-[#C5A880] transition-colors whitespace-nowrap py-1 text-xs"
          >
            <Globe className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>{language === 'hi' ? 'EN' : 'हिन्दी'}</span>
          </button>
        </nav>

        {/* Right CTAs */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Active Reservation Reference Pill (if booked) */}
          {activeReservation && (
            <button
              type="button"
              onClick={onViewActiveReservation}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-sm bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/40 text-xs font-medium hover:bg-[#C5A880]/30 transition-colors"
            >
              <span>Ref: <strong>{activeReservation.referenceId}</strong></span>
            </button>
          )}

          {/* Order Online Button (Dark Emerald with Scooter Icon & Count) */}
          <button
            type="button"
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-sm bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-500/40 text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 shrink-0"
          >
            <Bike className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            <span className="hidden xs:inline">ORDER ONLINE</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-[#0E0C0A] text-[10px] font-bold">
              {cartCount}
            </span>
          </button>

          {/* Reserve Table Button (Gold Button, ensure plenty of room so it is NEVER clipped) */}
          <button
            type="button"
            onClick={onOpenReservation}
            className="flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-sm bg-[#C5A880] hover:bg-[#D5B890] text-[#12110F] font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0"
          >
            <Calendar className="w-3.5 h-3.5 text-[#12110F] shrink-0" />
            <span>RESERVE</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="2xl:hidden p-2 text-[#FAF7F2]/80 hover:text-white rounded-md hover:bg-[#1E1A16] transition-colors shrink-0"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="2xl:hidden border-t border-[#241F1A] bg-[#12100E] px-4 py-4 space-y-2.5">
          {activeReservation && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onViewActiveReservation();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded bg-[#C5A880]/15 border border-[#C5A880]/40 text-xs text-[#C5A880]"
            >
              <span>Active Table Booking: <strong>{activeReservation.referenceId}</strong></span>
              <span>View Details →</span>
            </button>
          )}

          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate(link.id);
              }}
              className="w-full text-left py-2 px-2 text-sm text-[#FAF7F2]/80 hover:text-[#C5A880] hover:bg-[#1A1612] rounded transition-colors"
            >
              {language === 'hi' ? link.hiLabel : link.label}
            </button>
          ))}

          <div className="pt-3 border-t border-[#241F1A] flex items-center justify-between text-xs text-[#FAF7F2]/80">
            <button
              type="button"
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 text-[#C5A880]"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Language: {language === 'hi' ? 'हिंदी (सक्रिय)' : 'English (Active)'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
