import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowUp, Instagram, Facebook, Check, ArrowRight } from 'lucide-react';
import { RESTAURANT_INFO } from '../../data/restaurant.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

const FOOTER_LINKS = [
  { path: '/', label: 'Home', hiLabel: 'होम' },
  { path: '/menu', label: 'Menu', hiLabel: 'मेनू' },
  { path: '/story', label: 'Our Story', hiLabel: 'हमारी कहानी' },
  { path: '/philosophy', label: 'Philosophy', hiLabel: 'दर्शन' },
  { path: '/signatures', label: 'Signatures', hiLabel: 'खास व्यंजन' },
  { path: '/experience', label: 'Experience', hiLabel: 'माहौल' },
  { path: '/gallery', label: 'Gallery', hiLabel: 'गैलरी' },
  { path: '/reservation', label: 'Reservation', hiLabel: 'टेबल बुकिंग' },
  { path: '/location', label: 'Location', hiLabel: 'स्थान' },
];

export function Footer({ onNavigate }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const isHi = language === 'hi';

  const handleLink = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setIsSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="panchtara-footer"
      className="bg-[#0D0C0A] text-[#FAF7F2] pt-20 sm:pt-24 pb-[calc(env(safe-area-inset-bottom,0px)+6.5rem)] sm:pb-24 border-t border-white/10 select-none"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Top Section with Brandmark and Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Presentation */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <h2 className="font-editorial-display text-2xl sm:text-3xl tracking-[0.2em] uppercase text-[#FAF7F2]">
                {t('footer.brandName')}
              </h2>
            </div>
            <p className="font-editorial-serif text-lg italic text-[#C5A880]">
              “{isHi ? 'परंपरा, शुद्धता और पारिवारिक स्वाद का संगम' : RESTAURANT_INFO.tagline}”
            </p>
            <p className="text-xs sm:text-sm text-white/60 font-light max-w-md leading-relaxed">
              {t('footer.brandDesc')}
            </p>

            {/* Accolades Micro Row */}
            <div className="pt-4 flex flex-wrap gap-4 text-[11px] text-white/50">
              {RESTAURANT_INFO.accolades.map((acc, idx) => (
                <span key={idx} className="border-r border-white/10 pr-4 last:border-none">
                  ✦ {acc.title} ({acc.year})
                </span>
              ))}
            </div>
          </div>

          {/* Newsletter Concierge Signup */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-4">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] block mb-1">
                {t('footer.festiveHeading')}
              </span>
              <p className="text-xs text-white/60 font-light">
                {t('footer.festiveSub')}
              </p>
            </div>

            {isSubscribed ? (
              <div className="p-3 bg-[#C5A880]/15 border border-[#C5A880]/40 rounded text-xs text-[#C5A880] flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{t('footer.subscribedMsg')}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                <input
                  id="footer-newsletter-input"
                  type="email"
                  required
                  placeholder={t('footer.emailPlaceholder')}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 text-xs text-[#FAF7F2] placeholder:text-white/40 rounded focus:outline-none focus:border-[#C5A880]"
                />
                <button
                  id="footer-newsletter-btn"
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="px-5 py-2.5 bg-[#C5A880] text-[#12110F] text-xs uppercase tracking-wider font-medium rounded hover:bg-[#dfcaab] transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <span>{t('footer.joinBtn')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Navigation & Contact Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-16 border-b border-white/10 text-xs">
          {/* Quick Links */}
          <div className="space-y-3">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A880] block font-medium">
              {t('footer.navHeading')}
            </span>
            <ul className="space-y-2 text-white/70">
              {FOOTER_LINKS.map((link) => (
                <li key={link.path}>
                  <button
                    id={`footer-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => handleLink(link.path)}
                    className="hover:text-[#C5A880] transition-colors text-left"
                  >
                    {isHi ? link.hiLabel : link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A880] block font-medium">
              {t('footer.contactHeading')}
            </span>
            <div className="space-y-2 text-white/70">
              <p>
                <a href={`tel:${RESTAURANT_INFO.contact.phone}`} className="hover:text-[#C5A880] transition-colors">
                  {RESTAURANT_INFO.contact.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${RESTAURANT_INFO.contact.email}`} className="hover:text-[#C5A880] transition-colors">
                  {RESTAURANT_INFO.contact.email}
                </a>
              </p>
              <p className="text-white/50 text-[11px]">
                {isHi ? 'इवेंट्स:' : 'Events:'} {RESTAURANT_INFO.contact.eventsEmail}
              </p>
            </div>
          </div>

          {/* Dining Hours */}
          <div className="space-y-3">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A880] block font-medium">
              {t('footer.hoursHeading')}
            </span>
            <div className="space-y-2 text-white/70 text-[11px]">
              <div>
                <span className="text-[#FAF7F2] font-medium block">
                  {isHi ? 'दोपहर (सोम - रवि)' : `Lunch (${RESTAURANT_INFO.hours.lunchDays})`}
                </span>
                <span>{RESTAURANT_INFO.hours.lunchHours}</span>
              </div>
              <div>
                <span className="text-[#FAF7F2] font-medium block">
                  {isHi ? 'रात्रि (सोम - रवि)' : `Dinner (${RESTAURANT_INFO.hours.dinnerDays})`}
                </span>
                <span>{RESTAURANT_INFO.hours.dinnerHours}</span>
              </div>
              <span className="text-emerald-400 block font-medium">
                {isHi ? 'सातों दिन खुला' : RESTAURANT_INFO.hours.closed}
              </span>
            </div>
          </div>

          {/* Location & Social */}
          <div className="space-y-3">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A880] block font-medium">
              {t('footer.locationHeading')}
            </span>
            <div className="space-y-2 text-white/70">
              <p className="text-[11px] leading-relaxed">
                {isHi ? 'मुख्य बायपास रोड' : RESTAURANT_INFO.address.line1}<br />
                {isHi ? 'बॉम्बे इंटरनेशनल स्कूल के पास' : RESTAURANT_INFO.address.area}<br />
                {RESTAURANT_INFO.address.city}, {RESTAURANT_INFO.address.postalCode}
              </p>
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={RESTAURANT_INFO.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Panjtara Pure Veg on Instagram"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/75 hover:text-[#C5A880] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={RESTAURANT_INFO.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Panjtara Pure Veg on Facebook"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/75 hover:text-[#C5A880] transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Panjtara Pure Veg. {t('footer.rights')}</p>

          <div className="flex items-center gap-6">
            <span className="hidden sm:inline">Indore Bypass • Madhya Pradesh</span>
            <button
              onClick={() => onNavigate ? onNavigate('/admin') : navigate('/admin')}
              className="text-white/40 hover:text-[#C5A880] transition-colors text-xs"
            >
              Staff Portal
            </button>
            <button
              id="back-to-top-btn"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-white/60 hover:text-[#C5A880] transition-colors"
              aria-label="Scroll back to top of page"
            >
              <span>{t('footer.backToTop')}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
