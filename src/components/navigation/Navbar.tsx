import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Menu, X, ArrowUpRight, Phone, Utensils } from 'lucide-react';
import { RESTAURANT_INFO } from '../../data/restaurant.ts';

interface NavbarProps {
  onPreOrderClick?: () => void;
}

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/menu', label: 'Menu', hasIcon: true },
  { path: '/story', label: 'Our Story' },
  { path: '/philosophy', label: 'Philosophy' },
  { path: '/signatures', label: 'Signatures' },
  { path: '/experience', label: 'Experience' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/reservation', label: 'Reservation' },
  { path: '/location', label: 'Location' },
];

export function Navbar({ onPreOrderClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleLinkClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const isHome = location.pathname === '/';
  const isSolidNav = isScrolled || !isHome;

  return (
    <>
      <header
        id="panchtara-main-header"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isSolidNav
            ? 'bg-[#12110F] md:bg-[#12110F]/95 backdrop-blur-md py-3.5 border-b border-[#C5A880]/20 shadow-xl text-[#FAF7F2]'
            : 'bg-gradient-to-b from-[#12110F]/90 via-[#12110F]/50 to-transparent py-5 text-[#FAF7F2]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Logo / Brandmark */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
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
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            id="desktop-navigation-links"
            className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-[0.16em]"
            aria-label="Main Navigation"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);

              return (
                <button
                  key={link.path}
                  id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleLinkClick(link.path)}
                  className={`relative py-1 font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#C5A880]'
                      : 'text-[#FAF7F2]/75 hover:text-[#FAF7F2]'
                  }`}
                >
                  {link.hasIcon && <Utensils className="w-3 h-3 text-[#C5A880]" />}
                  <span>{link.label}</span>
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Menu Button (Desktop & Tablet) */}
            <button
              id="header-nav-to-menu-btn"
              onClick={() => handleLinkClick('/menu')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-[11px] uppercase tracking-wider font-medium text-[#FAF7F2] hover:text-[#C5A880] border border-white/20 hover:border-[#C5A880]/50 transition-all rounded-sm backdrop-blur-sm"
              title="Navigate to Food Menu"
            >
              <Utensils className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="hidden sm:inline">Menu</span>
            </button>

            {/* Pre-Order CTA (Desktop) */}
            {onPreOrderClick && (
              <button
                id="header-preorder-meal-btn"
                onClick={onPreOrderClick}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-[11px] uppercase tracking-widest font-medium text-[#FAF7F2] hover:text-[#C5A880] border border-white/20 hover:border-[#C5A880]/50 transition-all rounded-sm backdrop-blur-sm"
              >
                <span>Pre-Order</span>
              </button>
            )}

            {/* Reserve CTA */}
            <button
              id="header-reserve-table-btn"
              onClick={() => handleLinkClick('/reservation')}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs uppercase tracking-widest font-medium text-[#12110F] bg-[#C5A880] hover:bg-[#dfcaab] transition-all rounded-sm shadow-sm"
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
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-[#FAF7F2] hover:text-[#C5A880] transition-colors focus:outline-none"
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
            className="fixed inset-0 z-30 lg:hidden bg-[#12110F] text-[#FAF7F2] flex flex-col justify-between pt-24 pb-8 px-6 sm:px-8 overflow-y-auto"
          >
            <div className="space-y-6">
              <div className="text-xs uppercase tracking-[0.28em] text-[#C5A880]/70 pb-3 border-b border-white/10 flex items-center justify-between">
                <span>Explore Panjtara</span>
                <span className="text-[10px] text-emerald-400">100% Pure Veg</span>
              </div>

              <div className="flex flex-col space-y-2">
                {NAV_LINKS.map((link, idx) => {
                  const isActive =
                    link.path === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(link.path);

                  return (
                    <motion.button
                      key={link.path}
                      id={`mobile-nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      initial={shouldReduceMotion ? {} : { opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.03 * idx, duration: 0.25 }}
                      onClick={() => handleLinkClick(link.path)}
                      className={`text-left font-editorial-serif text-2xl tracking-wide transition-colors flex items-center justify-between py-2.5 px-1 min-h-[44px] group ${
                        isActive ? 'text-[#C5A880]' : 'text-[#FAF7F2] hover:text-[#C5A880]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        {link.hasIcon && <Utensils className="w-4 h-4 text-[#C5A880]" />}
                        <span>{link.label}</span>
                      </span>
                      <span className="text-xs text-[#C5A880] font-sans tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Footer Info */}
            <div className="pt-8 border-t border-white/10 space-y-4">
              <button
                id="mobile-menu-reserve-action"
                onClick={() => handleLinkClick('/reservation')}
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

