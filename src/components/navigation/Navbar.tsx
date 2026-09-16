import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Menu, X, ArrowUpRight, Phone } from 'lucide-react';
import { SoundToggle } from '../common/SoundToggle.tsx';
import { RESTAURANT_INFO } from '../../data/restaurant.ts';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const NAV_LINKS = [
  { id: 'story', label: 'Our Story' },
  { id: 'philosophy', label: 'Philosophy' },
  { id: 'signature', label: 'Signatures' },
  { id: 'menu', label: 'Menu' },
  { id: 'experience', label: 'Experience' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'reservation', label: 'Reservation' },
  { id: 'location', label: 'Location' },
];

export function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <header
        id="panchtara-main-header"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#12110F]/90 backdrop-blur-md py-3.5 border-b border-[#C5A880]/15 shadow-xl text-[#FAF7F2]'
            : 'bg-gradient-to-b from-[#12110F]/80 via-[#12110F]/40 to-transparent py-6 text-[#FAF7F2]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Logo / Brandmark */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('hero');
            }}
            className="group flex flex-col items-start select-none"
            aria-label="Panjtara Pure Veg Restaurant Home"
          >
            <span className="font-editorial-display text-lg sm:text-xl tracking-[0.22em] uppercase text-[#FAF7F2] group-hover:text-[#C5A880] transition-colors font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Panjtara
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.3em] text-[#C5A880]/90 uppercase -mt-0.5">
              Pure Veg • Indore
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            id="desktop-navigation-links"
            className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-[0.18em]"
            aria-label="Main Navigation"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative py-1 font-medium transition-colors ${
                    isActive
                      ? 'text-[#C5A880]'
                      : 'text-[#FAF7F2]/75 hover:text-[#FAF7F2]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C5A880]"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 380, damping: 30 }
                      }
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Ambient sound toggle */}
            <SoundToggle />

            {/* Reserve CTA */}
            <button
              id="header-reserve-table-btn"
              onClick={() => handleLinkClick('reservation')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-widest font-medium text-[#12110F] bg-[#C5A880] hover:bg-[#dfcaab] transition-all rounded-sm shadow-sm"
            >
              <span>Reserve</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2 text-[#FAF7F2] hover:text-[#C5A880] transition-colors focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-fullscreen-overlay"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-30 lg:hidden bg-[#12110F] text-[#FAF7F2] flex flex-col justify-between pt-24 pb-8 px-8 overflow-y-auto"
          >
            <div className="space-y-6">
              <div className="text-xs uppercase tracking-[0.28em] text-[#C5A880]/70 pb-3 border-b border-white/10">
                Navigation
              </div>

              <div className="flex flex-col space-y-4">
                {NAV_LINKS.map((link, idx) => (
                  <motion.button
                    key={link.id}
                    id={`mobile-nav-link-${link.id}`}
                    initial={shouldReduceMotion ? {} : { opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * idx, duration: 0.3 }}
                    onClick={() => handleLinkClick(link.id)}
                    className="text-left font-editorial-serif text-2xl tracking-wide text-[#FAF7F2] hover:text-[#C5A880] transition-colors flex items-center justify-between py-1 group"
                  >
                    <span>{link.label}</span>
                    <span className="text-xs text-[#C5A880] font-sans tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Mobile Footer Info */}
            <div className="pt-8 border-t border-white/10 space-y-4">
              <button
                id="mobile-menu-reserve-action"
                onClick={() => handleLinkClick('reservation')}
                className="w-full py-3.5 px-6 rounded bg-[#C5A880] text-[#12110F] font-medium text-xs uppercase tracking-[0.2em] hover:bg-[#dfcaab] transition-colors text-center block"
              >
                Reserve Your Table
              </button>

              <div className="flex items-center justify-between text-xs text-white/60 pt-2">
                <a
                  href={`tel:${RESTAURANT_INFO.contact.phone}`}
                  className="flex items-center gap-2 hover:text-[#C5A880] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{RESTAURANT_INFO.contact.phone}</span>
                </a>
                <span className="text-[10px] tracking-wider text-emerald-400 font-medium">Bypass Road, Indore</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
