/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/navigation/Navbar.tsx';
import { InitialIntro } from './components/common/InitialIntro.tsx';
import { ScrollToTop } from './components/common/ScrollToTop.tsx';
import { Lightbox } from './components/common/Lightbox.tsx';
import { DishDetailModal } from './components/common/DishDetailModal.tsx';
import { PreOrderModal } from './components/common/PreOrderModal.tsx';
import { StickyBookingBar } from './components/common/StickyBookingBar.tsx';
import { FloatingCartBar } from './components/common/FloatingCartBar.tsx';
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

// Admin Portal Components & Pages (From Admin folder)
import { AuthProvider as AdminAuthProvider } from '../../Admin/src/context/AuthContext.tsx';
import { AdminLayout } from '../../Admin/src/components/AdminLayout.tsx';
import { AdminLoginPage } from '../../Admin/src/pages/AdminLoginPage.tsx';
import { DashboardPage } from '../../Admin/src/pages/DashboardPage.tsx';
import { MenuManagerPage } from '../../Admin/src/pages/MenuManagerPage.tsx';
import { ReservationsPage } from '../../Admin/src/pages/ReservationsPage.tsx';
import { OrdersPage } from '../../Admin/src/pages/OrdersPage.tsx';
import { SettingsPage } from '../../Admin/src/pages/SettingsPage.tsx';

import { GALLERY_ITEMS } from './data/gallery.ts';
import { SignatureDish, MenuItem } from './types/index.ts';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { CustomerAuthProvider } from './context/CustomerAuthContext.tsx';
import { CartProvider, useCart } from './context/CartContext.tsx';
import { CustomerAuthModal } from './components/auth/CustomerAuthModal.tsx';
import { CustomerOrdersModal } from './components/orders/CustomerOrdersModal.tsx';
import { RoyalConciergeCharacter } from './components/common/RoyalConciergeCharacter.tsx';

function CustomerLayout() {
  const navigate = useNavigate();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [selectedDish, setSelectedDish] = useState<SignatureDish | MenuItem | null>(null);
  const [isPreOrderOpen, setIsPreOrderOpen] = useState<boolean>(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState<boolean>(false);

  const { isCartOpen, openCart, closeCart } = useCart();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1A17] relative selection:bg-[#C5A880]/30 selection:text-[#181614] flex flex-col justify-between">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#C5A880] text-[#12110F] font-medium text-xs uppercase tracking-widest rounded shadow-lg"
      >
        Skip to main content
      </a>

      {/* Production Royal Intro / Loader with Progress Indicator */}
      <InitialIntro />

      {/* Automatic Scroll Restoration on Route Change */}
      <ScrollToTop />

      {/* Top Header Navigation */}
      <Navbar
        onPreOrderClick={() => openCart('dine-in')}
        onOpenOrders={() => setIsOrdersModalOpen(true)}
      />

      {/* Main Routed Page Content */}
      <main id="main-content" className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onPreOrderClick={() => openCart('dine-in')}
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
                onPreOrderClick={() => openCart('dine-in')}
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
        onPreOrder={() => openCart('dine-in')}
      />

      {/* Zomato-Style Persistent Floating Cart Bar with 0% Commission Badge */}
      <FloatingCartBar />

      {/* Royal Concierge Character Host (Welcomes & engages guest to book table or order food) */}
      <RoyalConciergeCharacter
        onReserve={() => navigate('/reservation')}
        onOrder={() => openCart('delivery')}
      />

      {/* Pre-Order & Online Delivery Checkout Concierge Modal */}
      <PreOrderModal
        isOpen={isPreOrderOpen || isCartOpen}
        onClose={() => {
          setIsPreOrderOpen(false);
          closeCart();
        }}
        onNavigateToReservation={() => {
          setIsPreOrderOpen(false);
          closeCart();
          navigate('/reservation');
        }}
        onOpenOrdersTracking={() => {
          setIsPreOrderOpen(false);
          closeCart();
          setIsOrdersModalOpen(true);
        }}
      />

      {/* Customer Authentication Modal (Zepto-style OTP login) */}
      <CustomerAuthModal onViewOrders={() => setIsOrdersModalOpen(true)} />

      {/* Customer Orders & Live Status Tracking Modal */}
      <CustomerOrdersModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds fresh cache
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          <AdminAuthProvider>
            <CustomerAuthProvider>
              <CartProvider>
                <Routes>
                  {/* Admin Portal Routes */}
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

                  {/* Public Customer Website Routes */}
                  <Route path="/*" element={<CustomerLayout />} />
                </Routes>
              </CartProvider>
            </CustomerAuthProvider>
          </AdminAuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
