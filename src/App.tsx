/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Navbar } from './components/navigation/Navbar.tsx';
import { InitialIntro } from './components/common/InitialIntro.tsx';
import { Lightbox } from './components/common/Lightbox.tsx';
import { DishDetailModal } from './components/common/DishDetailModal.tsx';
import { HeroSection } from './components/sections/HeroSection.tsx';
import { StorySection } from './components/sections/StorySection.tsx';
import { PhilosophySection } from './components/sections/PhilosophySection.tsx';
import { SignatureDishesSection } from './components/sections/SignatureDishesSection.tsx';
import { InteractiveMenuSection } from './components/sections/InteractiveMenuSection.tsx';
import { ExperienceSection } from './components/sections/ExperienceSection.tsx';
import { FullscreenQuoteSection } from './components/sections/FullscreenQuoteSection.tsx';
import { GallerySection } from './components/sections/GallerySection.tsx';
import { ReservationSection } from './components/sections/ReservationSection.tsx';
import { LocationSection } from './components/sections/LocationSection.tsx';
import { Footer } from './components/sections/Footer.tsx';
import { GALLERY_ITEMS } from './data/gallery.ts';
import { SignatureDish, MenuItem } from './types/index.ts';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [selectedDish, setSelectedDish] = useState<SignatureDish | MenuItem | null>(null);

  // Smooth scroll handler
  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scrollspy active section observer
  useEffect(() => {
    const sectionIds = ['hero', 'story', 'philosophy', 'signature', 'menu', 'experience', 'gallery', 'reservation', 'location'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1A17] relative selection:bg-[#C5A880]/30 selection:text-[#181614]">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#C5A880] text-[#12110F] font-medium text-xs uppercase tracking-widest rounded shadow-lg"
      >
        Skip to main content
      </a>

      {/* Initial 1.2s Intro Reveal */}
      <InitialIntro />

      {/* Sticky Luxury Navigation */}
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Content Sections */}
      <main id="main-content">
        {/* 1. Hero Section */}
        <HeroSection
          onExploreMenu={() => handleNavigate('menu')}
          onReserveTable={() => handleNavigate('reservation')}
        />

        {/* 2. Story Section: More Than A Restaurant */}
        <StorySection onExploreSignatures={() => handleNavigate('signature')} />

        {/* 3. Philosophy Section: Tradition, Craft, Ingredients, Experience */}
        <PhilosophySection />

        {/* 4. Signature Dishes Showcase */}
        <SignatureDishesSection
          onSelectDish={(dish) => setSelectedDish(dish)}
          onViewFullMenu={() => handleNavigate('menu')}
        />

        {/* 5. Interactive Menu with Categories & Filters */}
        <InteractiveMenuSection
          onSelectDish={(dish) => setSelectedDish(dish)}
          onReserveTable={() => handleNavigate('reservation')}
        />

        {/* 6. The Panchtara Experience (Dining, Flavour, Hospitality) */}
        <ExperienceSection />

        {/* 7. Fullscreen Cinematic Quote & Atmosphere */}
        <FullscreenQuoteSection />

        {/* 8. Editorial Asymmetric Gallery */}
        <GallerySection onOpenLightbox={(idx) => setLightboxIndex(idx)} />

        {/* 9. Reservation Concierge */}
        <ReservationSection />

        {/* 10. Location, Hours, Direction & Parking */}
        <LocationSection />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Fullscreen Lightbox for Gallery */}
      <Lightbox
        items={GALLERY_ITEMS}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />

      {/* Dish Detail Preview Modal */}
      <DishDetailModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        onReserveClick={() => {
          setSelectedDish(null);
          handleNavigate('reservation');
        }}
      />
    </div>
  );
}
