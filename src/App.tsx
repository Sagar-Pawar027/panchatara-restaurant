/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/navigation/Navbar.tsx';
import { InitialIntro } from './components/common/InitialIntro.tsx';
import { ScrollToTop } from './components/common/ScrollToTop.tsx';
import { Lightbox } from './components/common/Lightbox.tsx';
import { DishDetailModal } from './components/common/DishDetailModal.tsx';
import { PreOrderModal } from './components/common/PreOrderModal.tsx';
import { StickyBookingBar } from './components/common/StickyBookingBar.tsx';
import { Footer } from './components/sections/Footer.tsx';

// Public Customer Pages
import { HomePage } from './pages/HomePage.tsx';
import { MenuPage } from './pages/MenuPage.tsx';
import { StoryPage } from './pages/StoryPage.tsx';
import { PhilosophyPage } from './pages/PhilosophyPage.tsx';
import { SignaturesPage } from './pages/SignaturesPage.tsx';
import { ExperiencePage } from './pages/ExperiencePage.tsx';
import { GalleryPage } from './pages/GalleryPage.tsx';
import { ReservationPage } from './pages/ReservationPage.tsx';
import { LocationPage } from './pages/LocationPage.tsx';

// Admin Portal Components & Pages
import { AuthProvider } from './admin/AuthContext.tsx';
import { AdminLayout } from './admin/AdminLayout.tsx';
import { AdminLoginPage } from './admin/pages/AdminLoginPage.tsx';
import { DashboardPage } from './admin/pages/DashboardPage.tsx';
import { MenuManagerPage } from './admin/pages/MenuManagerPage.tsx';
import { ReservationsPage } from './admin/pages/ReservationsPage.tsx';
import { OrdersPage } from './admin/pages/OrdersPage.tsx';
import { SettingsPage } from './admin/pages/SettingsPage.tsx';

import { GALLERY_ITEMS } from './data/gallery.ts';
import { SignatureDish, MenuItem } from './types/index.ts';

function CustomerLayout() {
  const navigate = useNavigate();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [selectedDish, setSelectedDish] = useState<SignatureDish | MenuItem | null>(null);
  const [isPreOrderOpen, setIsPreOrderOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1A17] relative selection:bg-[#C5A880]/30 selection:text-[#181614] flex flex-col justify-between">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#C5A880] text-[#12110F] font-medium text-xs uppercase tracking-widest rounded shadow-lg"
      >
        Skip to main content
      </a>

      {/* Initial 1.2s Intro Reveal */}
      <InitialIntro />

      {/* Automatic Scroll Restoration on Route Change */}
      <ScrollToTop />

      {/* Top Header Navigation */}
      <Navbar onPreOrderClick={() => setIsPreOrderOpen(true)} />

      {/* Main Routed Page Content */}
      <main id="main-content" className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onPreOrderClick={() => setIsPreOrderOpen(true)}
                onSelectDish={(dish) => setSelectedDish(dish)}
              />
            }
          />
          <Route
            path="/menu"
            element={<MenuPage onSelectDish={(dish) => setSelectedDish(dish)} />}
          />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/philosophy" element={<PhilosophyPage />} />
          <Route
            path="/signatures"
            element={<SignaturesPage onSelectDish={(dish) => setSelectedDish(dish)} />}
          />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route
            path="/gallery"
            element={<GalleryPage onOpenLightbox={(idx) => setLightboxIndex(idx)} />}
          />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/location" element={<LocationPage />} />
          <Route
            path="*"
            element={
              <HomePage
                onPreOrderClick={() => setIsPreOrderOpen(true)}
                onSelectDish={(dish) => setSelectedDish(dish)}
              />
            }
          />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer onNavigate={(path) => navigate(path)} />

      {/* Sticky Booking Action Bar (Appears after scroll) */}
      <StickyBookingBar
        onReserve={() => navigate('/reservation')}
        onPreOrder={() => setIsPreOrderOpen(true)}
      />

      {/* Pre-Order Concierge Modal */}
      <PreOrderModal
        isOpen={isPreOrderOpen}
        onClose={() => setIsPreOrderOpen(false)}
        onNavigateToReservation={() => {
          setIsPreOrderOpen(false);
          navigate('/reservation');
        }}
      />

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
          navigate('/reservation');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <DashboardPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/menu"
            element={
              <AdminLayout>
                <MenuManagerPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/reservations"
            element={
              <AdminLayout>
                <ReservationsPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminLayout>
                <OrdersPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminLayout>
                <SettingsPage />
              </AdminLayout>
            }
          />

          {/* Public Customer Routes */}
          <Route path="/*" element={<CustomerLayout />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
