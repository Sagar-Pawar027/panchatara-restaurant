import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Menu, X, ArrowUpRight, Phone, Utensils, ShieldCheck, Globe, User as UserIcon, ShoppingBag, Bike, Percent, MessageCircle } from 'lucide-react';
import { RESTAURANT_INFO } from '../../data/restaurant.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useCustomerAuth } from '../../context/CustomerAuthContext.tsx';
import { useCart } from '../../context/CartContext.tsx';

interface NavbarProps {
  onPreOrderClick?: () => void;
  onOpenOrders?: () => void;
}

const NAV_LINKS = [
  { path: '/', label: 'Home', hiLabel: 'होम' },
  { path: '/menu', label: 'Menu', hiLabel: 'मेनू', hasIcon: true },
  { path: '/story', label: 'Our Story', hiLabel: 'हमारी कहानी' },
  { path: '/philosophy', label: 'Philosophy', hiLabel: 'दर्शन' },
  { path: '/signatures', label: 'Signatures', hiLabel: 'खास व्यंजन' },
  { path: '/experience', label: 'Experience', hiLabel: 'माहौल' },
  { path: '/gallery', label: 'Gallery', hiLabel: 'गैलरी' },
  { path: '/location', label: 'Location', hiLabel: 'स्थान' },
];

export function Navbar({ onPreOrderClick, onOpenOrders }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const { user, isAuthenticated, openAuthModal } = useCustomerAuth();
  const { itemCount, openCart } = useCart();

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Logo / Brandmark */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex flex-col items-start select-none shrink-0 mr-2 xl:mr-6"
            aria-label="Panjtara Pure Veg Restaurant Home"
          >
            <span className="font-editorial-display text-lg sm:text-xl tracking-[0.22em] uppercase text-[#FAF7F2] group-hover:text-[#C5A880] transition-colors font-medium flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />
              Panjtara
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.3em] text-[#C5A880]/90 uppercase -mt-0.5 whitespace-nowrap">
              Pure Veg • Indore
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            id="desktop-navigation-links"
            className="hidden xl:flex items-center gap-4 2xl:gap-6 text-xs uppercase tracking-[0.14em]"
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
                  className={`relative py-1 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'text-[#C5A880]'
                      : 'text-[#FAF7F2]/75 hover:text-[#FAF7F2]'
                  }`}
                >
                  {link.hasIcon && <Utensils className="w-3 h-3 text-[#C5A880]" />}
                  <span className="whitespace-nowrap">{language === 'hi' ? link.hiLabel : link.label}</span>
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
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* My Orders / Live Tracking CTA (Desktop & Tablet) */}
            {onOpenOrders && (
              <button
                id="header-track-orders-btn"
                onClick={onOpenOrders}
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-white/20 hover:border-[#C5A880]/60 bg-white/5 hover:bg-white/10 text-[11px] sm:text-xs font-medium text-[#FAF7F2] transition-colors shrink-0"
                title={language === 'hi' ? 'मेरे ऑर्डर्स व लाइव ट्रैकिंग' : 'My Orders & Live Tracking'}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#C5A880]" />
                <span className="hidden lg:inline">{language === 'hi' ? 'ऑर्डर्स' : 'Orders'}</span>
              </button>
            )}

            {/* Customer User Account / 1-Click Login CTA */}
            <button
              id="header-customer-auth-btn"
              onClick={openAuthModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#C5A880]/40 hover:border-[#C5A880] bg-[#C5A880]/10 hover:bg-[#C5A880]/20 text-[11px] sm:text-xs font-medium text-[#FAF7F2] transition-colors shrink-0"
              title={isAuthenticated ? `Logged in as ${user?.name}` : 'Login or Sign Up for express ordering'}
            >
              <UserIcon className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="max-w-[85px] sm:max-w-[110px] truncate">
                {isAuthenticated ? user?.name?.split(' ')[0] || 'Account' : language === 'hi' ? 'लॉगिन / साइन-अप' : 'Login / Sign Up'}
              </span>
            </button>

            {/* Language Switcher Button (Desktop & Mobile) */}
            <button
              id="header-language-toggle-btn"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-white/20 hover:border-[#C5A880]/60 bg-white/5 hover:bg-white/10 text-[11px] sm:text-xs font-medium text-[#FAF7F2] transition-colors shrink-0"
              title={language === 'en' ? 'Switch to Hindi (हिन्दी)' : 'Switch to English'}
              aria-label={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
            >
              <Globe className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="font-semibold tracking-wide">
                {language === 'en' ? 'हिन्दी' : 'EN'}
              </span>
            </button>

            {/* Order Online / Cart CTA (Desktop & Tablet) */}
            <button
              id="header-order-online-btn"
              onClick={() => openCart('delivery')}
              className="relative inline-flex items-center gap-1.5 px-3 py-2 text-[11px] uppercase tracking-wider font-semibold text-[#FAF7F2] hover:text-[#C5A880] border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/40 transition-all rounded-sm backdrop-blur-sm whitespace-nowrap shadow-sm"
              title={language === 'hi' ? '0% कमीशन ऑनलाइन ऑर्डर' : 'Direct Online Delivery (0% Commission)'}
            >
              <Bike className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'hi' ? 'ऑर्डर करें (0% शुल्क)' : 'Order Online'}</span>
              {itemCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-emerald-500 text-black text-[10px] font-bold rounded-full">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Reserve CTA */}
            <button
              id="header-reserve-table-btn"
              onClick={() => handleLinkClick('/reservation')}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs uppercase tracking-widest font-medium text-[#12110F] bg-[#C5A880] hover:bg-[#dfcaab] transition-all rounded-sm shadow-sm whitespace-nowrap shrink-0"
            >
              <span>{language === 'hi' ? 'बुक करें' : 'Reserve'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Admin Portal Button */}
            <button
              id="header-admin-portal-btn"
              onClick={() => handleLinkClick('/admin')}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 text-[11px] uppercase tracking-wider font-medium text-[#C5A880] hover:text-[#FAF7F2] bg-white/5 hover:bg-white/10 border border-[#C5A880]/30 hover:border-[#C5A880]/60 transition-all rounded-sm whitespace-nowrap shrink-0"
              title="Open Staff & Admin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{language === 'hi' ? 'एडमिन' : 'Admin'}</span>
            </button>

            {/* Mobile / Tablet Hamburger Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="xl:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-[#FAF7F2] hover:text-[#C5A880] transition-colors focus:outline-none shrink-0"
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
            className="fixed inset-0 z-30 xl:hidden bg-[#12110F] text-[#FAF7F2] flex flex-col justify-between pt-24 pb-8 px-6 sm:px-8 overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Mobile Language Selector */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#C5A880]" />
                  <span className="text-[11px] uppercase tracking-widest text-[#C5A880]">Language / भाषा</span>
                </div>
                <div className="flex items-center bg-white/10 rounded p-0.5 border border-white/10">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      language === 'en'
                        ? 'bg-[#C5A880] text-[#12110F] font-semibold shadow-sm'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('hi')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      language === 'hi'
                        ? 'bg-[#C5A880] text-[#12110F] font-semibold shadow-sm'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    हिन्दी
                  </button>
                </div>
              </div>

              <div className="text-xs uppercase tracking-[0.28em] text-[#C5A880]/70 pb-3 border-b border-white/10 flex items-center justify-between">
                <span>{language === 'hi' ? 'पंचतारा में खोजें' : 'Explore Panjtara'}</span>
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
                        <span>{language === 'hi' ? link.hiLabel : link.label}</span>
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
            <div className="pt-8 border-t border-white/10 space-y-3">
              {/* User Account Button on Mobile */}
              <button
                id="mobile-menu-auth-action"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full py-3 px-4 rounded bg-[#C5A880]/15 border border-[#C5A880]/40 text-[#FAF7F2] font-medium text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <UserIcon className="w-4 h-4 text-[#C5A880]" />
                <span>
                  {isAuthenticated ? `${user?.name} (Account)` : language === 'hi' ? 'लॉगिन / साइन अप' : 'Login / Sign Up'}
                </span>
              </button>

              {/* Order Online Button on Mobile */}
              <button
                id="mobile-menu-order-online-action"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCart('delivery');
                }}
                className="w-full py-3 px-4 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Bike className="w-4 h-4 text-emerald-400" />
                <span>
                  {language === 'hi'
                    ? '🛵 घर पर खाना ऑर्डर करें (0% कमीशन)'
                    : '🛵 Order Food Online (0% Commission)'}
                </span>
                {itemCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-emerald-500 text-black text-[10px] font-bold rounded-full">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* My Orders Button on Mobile */}
              {onOpenOrders && (
                <button
                  id="mobile-menu-orders-action"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenOrders();
                  }}
                  className="w-full py-3 px-4 rounded bg-white/5 border border-white/10 text-white font-medium text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
                  <span>{language === 'hi' ? 'मेरे ऑर्डर्स व लाइव ट्रैकिंग' : 'My Orders & Live Tracking'}</span>
                </button>
              )}

              <button
                id="mobile-menu-reserve-action"
                onClick={() => handleLinkClick('/reservation')}
                className="w-full py-3.5 px-6 rounded bg-[#C5A880] text-[#12110F] font-medium text-xs uppercase tracking-[0.2em] hover:bg-[#dfcaab] transition-colors text-center block shadow-md"
              >
                {language === 'hi' ? 'अपनी टेबल बुक करें' : 'Reserve Your Table'}
              </button>

              {/* WhatsApp Concierge Desk on Mobile Drawer */}
              <a
                id="mobile-menu-whatsapp-concierge"
                href="https://wa.me/919876543210?text=Namaste!%20I%20would%20like%20assistance%20with%20table%20booking%20or%20dining%20at%20Panjtara%20Pure%20Veg%2C%20Indore."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded bg-[#1C1814] border border-[#C5A880]/30 hover:border-[#C5A880]/60 text-[#FAF7F2] font-medium text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{language === 'hi' ? 'शाही आतिथ्य सहायता (व्हाट्सएप)' : 'WhatsApp Royal Concierge'}</span>
              </a>

              <button
                id="mobile-menu-admin-action"
                onClick={() => handleLinkClick('/admin')}
                className="w-full py-2.5 px-6 rounded bg-white/5 border border-[#C5A880]/30 text-[#C5A880] font-medium text-xs uppercase tracking-[0.16em] hover:bg-white/10 transition-colors text-center flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'स्टाफ एवं एडमिन पोर्टल' : 'Staff & Admin Portal'}</span>
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

