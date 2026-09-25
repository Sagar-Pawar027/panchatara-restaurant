import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ThemeStickers } from './components/ThemeStickers';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { ReservationSection } from './components/ReservationSection';
import { ExperienceSection } from './components/ExperienceSection';
import { Footer } from './components/Footer';
import { ReservationModal } from './components/ReservationModal';
import { PreOrderModal } from './components/PreOrderModal';
import { ReservationConfirmationModal } from './components/ReservationConfirmationModal';
import { CartDrawer } from './components/CartDrawer';
import { Toast, ToastProps } from './components/Toast';
import { ReservationData, CartItem } from './types';
import { MenuItem } from './data/restaurantData';

export function App() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [activeSection, setActiveSection] = useState('home');

  const [activeReservation, setActiveReservation] = useState<ReservationData | null>(() => {
    try {
      const saved = localStorage.getItem('panchtara_active_reservation');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isPreOrderModalOpen, setIsPreOrderModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationReservation, setConfirmationReservation] = useState<ReservationData | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('panchtara_cart_items');
      return saved && JSON.parse(saved).length > 0
        ? JSON.parse(saved)
        : [
            { id: 'dal-panchtara', name: 'Dal Panchtara Signature', price: 360, quantity: 1, spiceLevel: 'Rich & Royal' },
            { id: 'garlic-butter-naan', name: 'Royal Garlic Butter Naan', price: 90, quantity: 1, spiceLevel: 'Mild' },
          ];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Omit<ToastProps, 'onClose' | 'onCopyReference'>[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('panchtara_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (activeReservation) {
        localStorage.setItem('panchtara_active_reservation', JSON.stringify(activeReservation));
      } else {
        localStorage.removeItem('panchtara_active_reservation');
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeReservation]);

  const addToast = (title: string, message: string, referenceId?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, referenceId }]);
    setTimeout(() => {
      removeToast(id);
    }, 8000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCopyReference = (ref: string) => {
    navigator.clipboard.writeText(ref);
    addToast('Reference ID Copied', `Copied ${ref} to clipboard`);
  };

  const handleReservationSuccess = (res: ReservationData) => {
    setActiveReservation(res);
    setConfirmationReservation(res);
    setIsConfirmationModalOpen(true);

    addToast(
      'Table Reservation Confirmed!',
      `Namaste ${res.name}, table booked for ${res.guests} guests on ${res.date} at ${res.time}.`,
      res.referenceId
    );
  };

  const handlePreOrderSuccess = (orderRef: string, total: number) => {
    setIsPreOrderModalOpen(false);
    addToast(
      'Pre-Order Locked with 50% Advance!',
      `Your royal feast (₹${total}) has been queued with reference ${orderRef}.`,
      orderRef
    );
  };

  const handleAddToCart = (dish: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: dish.id,
          name: dish.name,
          price: dish.price,
          quantity: 1,
          spiceLevel: dish.spiceLevel,
        },
      ];
    });

    addToast('Dish Added to Bag', `${dish.name} added to your direct kitchen order.`);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0E0C0A] text-[#FAF7F2] flex flex-col font-sans relative selection:bg-[#C5A880]/30 selection:text-white">
      {/* Toast Notification Container */}
      <div 
        aria-live="polite" 
        className="fixed top-22 sm:top-24 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            title={toast.title}
            message={toast.message}
            referenceId={toast.referenceId}
            onClose={removeToast}
            onCopyReference={handleCopyReference}
          />
        ))}
      </div>

      {/* Rotating Gold Royal Seal Badge on top right */}
      <ThemeStickers />

      {/* Navigation matching image */}
      <Navbar
        onOpenReservation={() => setIsReservationModalOpen(true)}
        onOpenPreOrder={() => setIsPreOrderModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
        language={language}
        onToggleLanguage={() => setLanguage((l) => (l === 'en' ? 'hi' : 'en'))}
        onNavigate={scrollToSection}
        activeSection={activeSection}
        activeReservation={activeReservation}
        onViewActiveReservation={() => {
          if (activeReservation) {
            setConfirmationReservation(activeReservation);
            setIsConfirmationModalOpen(true);
          }
        }}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* Exact Hero Section from uploaded screenshot */}
        <div id="home">
          <HeroSection
            onReserveTable={() => setIsReservationModalOpen(true)}
            onPreOrder={() => setIsPreOrderModalOpen(true)}
            onOpenCart={() => setIsCartOpen(true)}
            language={language}
          />
        </div>

        {/* Signature Dishes & Menu Section */}
        <div id="menu">
          <MenuSection onAddToCart={handleAddToCart} />
        </div>

        {/* Dedicated Reservation Section */}
        <div id="reservations">
          <ReservationSection
            onReservationSuccess={handleReservationSuccess}
            activeReservation={activeReservation}
            onViewActiveReservation={() => {
              if (activeReservation) {
                setConfirmationReservation(activeReservation);
                setIsConfirmationModalOpen(true);
              }
            }}
          />
        </div>

        {/* Malwa Experience & Heritage Section */}
        <div id="experience">
          <ExperienceSection />
        </div>
      </main>

      {/* Footer */}
      <div id="location">
        <Footer />
      </div>

      {/* Interactive Table Reservation Modal */}
      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        onSuccess={handleReservationSuccess}
      />

      {/* Pre-Order Modal with 50% Advance Lock */}
      <PreOrderModal
        isOpen={isPreOrderModalOpen}
        onClose={() => setIsPreOrderModalOpen(false)}
        onPreOrderSuccess={handlePreOrderSuccess}
      />

      {/* Booking Confirmation Modal with Booking Reference ID */}
      <ReservationConfirmationModal
        isOpen={isConfirmationModalOpen}
        reservation={confirmationReservation}
        onClose={() => setIsConfirmationModalOpen(false)}
        onBrowseMenu={() => {
          setIsConfirmationModalOpen(false);
          scrollToSection('menu');
        }}
      />

      {/* Direct Order Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}

export default App;
