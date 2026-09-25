import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  ChefHat,
  Bike,
  ShoppingBag,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Search,
  RotateCcw,
  Sparkles,
  History,
  Activity,
  Star,
  Check,
  Edit3,
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useCart } from '../../context/CartContext.tsx';
import { FoodOrder } from '../../types/customer.ts';
import { getLocalOrders, fetchUserOrdersByPhone, submitOrderReview } from '../../services/orderStorage.ts';
import { OrderDeliveryTracker } from './OrderDeliveryTracker.tsx';

interface CustomerOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMenu?: () => void;
}

export function CustomerOrdersModal({ isOpen, onClose, onNavigateToMenu }: CustomerOrdersModalProps) {
  const { user, openAuthModal } = useCustomerAuth();
  const { language } = useLanguage();
  const isHi = language === 'hi';
  const { addMultipleItems, openCart } = useCart();

  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [initialTabSet, setInitialTabSet] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [phoneSearch, setPhoneSearch] = useState<string>('');
  const [searchError, setSearchError] = useState<string | null>(null);

  // Culinary rating & feedback state for past orders
  const [ratingDrafts, setRatingDrafts] = useState<Record<string, number>>({});
  const [feedbackDrafts, setFeedbackDrafts] = useState<Record<string, string>>({});
  const [hoveredStars, setHoveredStars] = useState<Record<string, number>>({});
  const [submittingReview, setSubmittingReview] = useState<Record<string, boolean>>({});
  const [editingReview, setEditingReview] = useState<Record<string, boolean>>({});
  const [reviewSuccess, setReviewSuccess] = useState<Record<string, boolean>>({});

  // Load orders from local storage and backend
  const loadAllOrders = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setSearchError(null);

    // 1. First get local orders
    const local = getLocalOrders();
    let combined = [...local];

    // 2. Fetch server orders if user or phoneSearch is provided
    const phoneToQuery = user?.phone || (phoneSearch.trim().length >= 10 ? phoneSearch.trim() : null);

    if (phoneToQuery) {
      try {
        const serverOrders = await fetchUserOrdersByPhone(phoneToQuery);
        // Merge without duplicates
        serverOrders.forEach((so) => {
          if (!combined.some((co) => co._id === so._id || co.orderNumber === so.orderNumber)) {
            combined.unshift(so);
          }
        });
      } catch (e) {
        console.warn('Failed background order sync', e);
      }
    }

    // Sort newest first
    combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setOrders(combined);
    if (!silent) setIsLoading(false);
  }, [user?.phone, phoneSearch]);

  useEffect(() => {
    if (isOpen) {
      setInitialTabSet(false);
      loadAllOrders(false);
      // Silent background poll every 8 seconds
      const timer = setInterval(() => {
        loadAllOrders(true);
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [isOpen, loadAllOrders]);

  // Separate active orders from past history
  const isActiveOrder = (ord: FoodOrder) => {
    return ['received', 'pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(ord.status);
  };

  const activeOrders = orders.filter(isActiveOrder);
  const historyOrders = orders.filter((ord) => !isActiveOrder(ord));

  // Auto-switch to Past History if user has no active orders upon initial modal load
  useEffect(() => {
    if (isOpen && !initialTabSet && orders.length > 0) {
      if (activeOrders.length === 0 && historyOrders.length > 0) {
        setActiveTab('history');
      } else {
        setActiveTab('active');
      }
      setInitialTabSet(true);
    }
  }, [isOpen, initialTabSet, orders.length, activeOrders.length, historyOrders.length]);

  if (!isOpen) return null;

  const displayedOrders = activeTab === 'active' ? activeOrders : historyOrders;

  const handlePhoneSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneSearch.replace(/\D/g, '').length < 10) {
      setSearchError(isHi ? 'कृपया 10-अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    setIsLoading(true);
    setSearchError(null);
    try {
      const serverOrders = await fetchUserOrdersByPhone(phoneSearch);
      if (serverOrders.length === 0) {
        setSearchError(isHi ? 'इस नंबर पर कोई पिछला ऑर्डर नहीं मिला' : 'No past orders found for this mobile number');
      }
      loadAllOrders(false);
    } catch {
      setSearchError(isHi ? 'ऑर्डर खोजने में त्रुटि' : 'Could not fetch orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorder = (ord: FoodOrder) => {
    if (ord.items && ord.items.length > 0) {
      addMultipleItems(
        ord.items.map((it) => ({
          name: it.name,
          hindiName: it.hindiName,
          price: it.price,
          quantity: it.quantity,
        }))
      );
      onClose();
      openCart(ord.orderType || 'delivery');
    }
  };

  const getStarLabel = (stars: number) => {
    switch (stars) {
      case 5:
        return isHi ? '५/५ - लाजवाब व शाही स्वाद! 👑' : '5/5 - Royal & Exceptional! 👑';
      case 4:
        return isHi ? '४/५ - बहुत स्वादिष्ट व ताज़ा' : '4/5 - Very Good & Fresh';
      case 3:
        return isHi ? '३/५ - अच्छा अनुभव' : '3/5 - Good Experience';
      case 2:
        return isHi ? '२/५ - औसत / सुधार अपेक्षित' : '2/5 - Fair / Scope to Improve';
      case 1:
        return isHi ? '१/५ - असंतोषजनक' : '1/5 - Needs Improvement';
      default:
        return '';
    }
  };

  const handleSaveReview = async (ord: FoodOrder) => {
    const key = ord._id || ord.orderNumber;
    const ratingToSave = ratingDrafts[key] ?? ord.rating ?? 5;
    const feedbackToSave = feedbackDrafts[key] !== undefined ? feedbackDrafts[key] : (ord.feedback || '');

    if (!ratingToSave) return;

    setSubmittingReview((prev) => ({ ...prev, [key]: true }));

    try {
      await submitOrderReview(key, ratingToSave, feedbackToSave);

      // Update state locally in `orders`
      setOrders((prev) =>
        prev.map((o) =>
          o._id === ord._id || o.orderNumber === ord.orderNumber
            ? { ...o, rating: ratingToSave, feedback: feedbackToSave, ratedAt: new Date().toISOString() }
            : o
        )
      );

      setReviewSuccess((prev) => ({ ...prev, [key]: true }));
      setEditingReview((prev) => ({ ...prev, [key]: false }));

      setTimeout(() => {
        setReviewSuccess((prev) => ({ ...prev, [key]: false }));
      }, 3000);
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setSubmittingReview((prev) => ({ ...prev, [key]: false }));
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'received':
      case 'pending':
        return 1;
      case 'confirmed':
        return 2;
      case 'preparing':
        return 3;
      case 'ready':
        return 4;
      case 'out_for_delivery':
        return 5;
      case 'delivered':
      case 'served':
        return 6;
      default:
        return 1;
    }
  };

  const getWhatsAppTrackingUrl = (ord: FoodOrder) => {
    const text = encodeURIComponent(
      `Namaste Panjtara Pure Veg! 🙏\n\nI want to check status of my order:\n🔖 Order ID: ${ord.orderNumber || ord._id}\n👤 Name: ${ord.customerName}\n📱 Phone: ${ord.phone}\n💰 Total: ₹${ord.totalAmount}\n\nPlease update me on delivery/preparation status.`
    );
    return `https://wa.me/919522010107?text=${text}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-end sm:justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xs">
        {/* Backdrop dismiss */}
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-history-title"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          className="relative z-10 w-full sm:max-w-2xl bg-[#141210] border-l sm:border border-[#C5A880]/30 sm:rounded-2xl shadow-2xl flex flex-col h-[100dvh] sm:h-auto sm:max-h-[90vh] overflow-hidden text-[#FAF7F2]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1F1B16] via-[#161412] to-[#141210] p-4 sm:p-5 border-b border-[#C5A880]/20 flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#C5A880]" />
                <h2 id="order-history-title" className="font-editorial-serif text-xl sm:text-2xl text-[#FAF7F2]">
                  {isHi ? 'ऑर्डर इतिहास एवं लाइव ट्रैकिंग' : 'Order History & Live Status'}
                </h2>
              </div>
              <p className="text-xs text-[#A89F91] mt-0.5">
                {user ? `Account: ${user.name} (+91 ${user.phone})` : isHi ? 'आपके हालिया ऑर्डर्स' : 'Your recent orders & live dispatch'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => loadAllOrders(false)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                title="Refresh orders"
                aria-label="Refresh orders"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#C5A880]' : ''}`} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                aria-label="Close order history"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Phone Search / Lookup Bar for Guests */}
          <div className="px-4 sm:px-5 py-3 bg-[#0E0D0B] border-b border-white/5 shrink-0">
            <form onSubmit={handlePhoneSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Phone className="w-3.5 h-3.5 text-[#C5A880] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneSearch}
                  onChange={(e) => setPhoneSearch(e.target.value.replace(/\D/g, ''))}
                  placeholder={isHi ? '10 अंकों का फोन नंबर डालकर ऑर्डर खोजें...' : 'Enter 10-digit phone to track any past order...'}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#C5A880]"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-3 py-1.5 bg-[#C5A880] hover:bg-[#dfcaab] text-[#12110F] text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{isHi ? 'खोजें' : 'Find'}</span>
              </button>
            </form>
            {searchError && (
              <p className="text-[11px] text-amber-400 mt-1.5">{searchError}</p>
            )}
          </div>

          {/* Tab Navigation: Active Orders vs Past History */}
          <div className="px-4 sm:px-5 py-2.5 bg-[#141210] border-b border-[#C5A880]/15 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('active')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'active'
                    ? 'bg-[#C5A880] text-[#12110F] shadow-sm font-bold'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="relative flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  {activeOrders.length > 0 && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                  <span>{isHi ? 'सक्रिय ऑर्डर्स' : 'Active Orders'}</span>
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none ${
                    activeTab === 'active'
                      ? 'bg-black/20 text-[#12110F] font-bold'
                      : 'bg-white/10 text-white/70'
                  }`}
                >
                  {activeOrders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'history'
                    ? 'bg-[#C5A880] text-[#12110F] shadow-sm font-bold'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>{isHi ? 'पिछला इतिहास' : 'Past History'}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none ${
                    activeTab === 'history'
                      ? 'bg-black/20 text-[#12110F] font-bold'
                      : 'bg-white/10 text-white/70'
                  }`}
                >
                  {historyOrders.length}
                </span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#A89F91]">
              {activeTab === 'active' ? (
                activeOrders.length > 0 ? (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{isHi ? 'लाइव स्टेटस सक्रिय' : 'Live tracking active'}</span>
                  </span>
                ) : (
                  <span>{isHi ? 'कोई चालू ऑर्डर नहीं' : 'No ongoing orders'}</span>
                )
              ) : (
                <span>{isHi ? 'सभी पिछले ऑर्डर' : `${historyOrders.length} past orders`}</span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
            {isLoading && orders.length === 0 ? (
              <div className="py-16 text-center text-xs text-white/50 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-[#C5A880]" />
                <span>{isHi ? 'ऑर्डर लोड हो रहे हैं...' : 'Loading your order history...'}</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-14 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#C5A880]/10 border border-[#C5A880]/20 flex items-center justify-center text-[#C5A880]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white font-editorial-serif">
                    {isHi ? 'कोई पिछला ऑर्डर नहीं मिला' : 'No Orders Found Yet'}
                  </h3>
                  <p className="text-xs text-white/60 mt-1 max-w-sm mx-auto">
                    {isHi
                      ? 'शुद्ध शाकाहारी पंजतारा मेनू से अपने पसंदीदा व्यंजन चुनें और 0% कमीशन पर सीधे ऑर्डर करें!'
                      : 'You have not placed any orders from this device yet. Browse our pure vegetarian royal menu to order now!'}
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      openCart('delivery');
                    }}
                    className="px-5 py-2.5 bg-[#C5A880] hover:bg-[#d8bf9a] text-black font-bold text-xs rounded-xl uppercase tracking-wider transition-all shadow-md"
                  >
                    {isHi ? 'नया ऑर्डर करें →' : 'Start Fresh Order →'}
                  </button>
                  {!user && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        openAuthModal();
                      }}
                      className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 text-xs rounded-xl border border-white/10 transition-all"
                    >
                      {isHi ? 'लॉगिन करें' : 'Login With Phone'}
                    </button>
                  )}
                </div>
              </div>
            ) : activeTab === 'active' && activeOrders.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400/80" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white font-editorial-serif">
                    {isHi ? 'वर्तमान में कोई सक्रिय ऑर्डर नहीं है' : 'No Active Orders Right Now'}
                  </h3>
                  <p className="text-xs text-white/60 mt-1 max-w-sm mx-auto">
                    {historyOrders.length > 0
                      ? (isHi
                          ? `आपके सभी ${historyOrders.length} पिछले ऑर्डर सफलतापूर्वक पूरे हो चुके हैं। आप उन्हें 'पिछला इतिहास' टैब में देख सकते हैं।`
                          : `All your previous orders have been completed. You can review them in the 'Past History' tab.`)
                      : (isHi
                          ? 'वर्तमान में कोई सक्रिय या तैयार हो रहा ऑर्डर नहीं है।'
                          : 'You do not have any ongoing food orders in the kitchen or on the road right now.')}
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  {historyOrders.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('history')}
                      className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-medium text-xs rounded-xl border border-white/15 transition-all flex items-center gap-1.5"
                    >
                      <History className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>{isHi ? `पिछला इतिहास देखें (${historyOrders.length})` : `View Past History (${historyOrders.length})`}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      openCart('delivery');
                    }}
                    className="px-4 py-2 bg-[#C5A880] hover:bg-[#d8bf9a] text-black font-bold text-xs rounded-xl uppercase tracking-wider transition-all shadow-md"
                  >
                    {isHi ? 'नया ऑर्डर करें →' : 'Start Fresh Order →'}
                  </button>
                </div>
              </div>
            ) : activeTab === 'history' && historyOrders.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
                  <History className="w-7 h-7 text-[#C5A880]/80" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white font-editorial-serif">
                    {isHi ? 'कोई पिछला ऑर्डर इतिहास नहीं' : 'No Past Order History'}
                  </h3>
                  <p className="text-xs text-white/60 mt-1 max-w-sm mx-auto">
                    {activeOrders.length > 0
                      ? (isHi
                          ? `वर्तमान में आपके पास ${activeOrders.length} सक्रिय ऑर्डर चालू है!`
                          : `You currently have ${activeOrders.length} active order in progress!`)
                      : (isHi
                          ? 'डिलीवर किए गए या पूरे हुए ऑर्डर्स का इतिहास यहाँ दिखेगा।'
                          : 'Fulfilled orders will appear here once delivered or completed.')}
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  {activeOrders.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('active')}
                      className="px-4 py-2 bg-[#C5A880] hover:bg-[#d8bf9a] text-black font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>{isHi ? `सक्रिय ऑर्डर देखें (${activeOrders.length})` : `View Active Orders (${activeOrders.length})`}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      openCart('delivery');
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-medium text-xs rounded-xl border border-white/15 transition-all"
                  >
                    {isHi ? 'नया ऑर्डर करें →' : 'Start Fresh Order →'}
                  </button>
                </div>
              </div>
            ) : (
              displayedOrders.map((ord) => {
                const isDelivery = ord.orderType === 'delivery';
                const isFulfilled = ord.status === 'delivered' || ord.status === 'served';
                const isCancelled = ord.status === 'cancelled';

                return (
                  <div
                    key={ord._id || ord.orderNumber}
                    className="p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-[#1C1A17] to-[#141210] border border-white/10 hover:border-[#C5A880]/40 transition-all space-y-4 shadow-xl"
                  >
                    {/* Top Row: Clean luxury header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-[#C5A880] bg-[#C5A880]/15 px-2.5 py-1 rounded-lg border border-[#C5A880]/30 shadow-xs">
                            {ord.orderNumber || `ORD-${ord._id?.slice(-6).toUpperCase()}`}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${
                              isDelivery
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                : ord.orderType === 'takeaway'
                                ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                                : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                            }`}
                          >
                            {ord.orderType === 'delivery' ? '🛵 Direct Delivery' : ord.orderType === 'takeaway' ? '🥡 Self Pickup' : '🍽️ Dine-in Table'}
                          </span>
                        </div>
                        <p className="text-xs text-white/50">
                          {new Date(ord.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}{' '}
                          at{' '}
                          {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {ord.customerName ? ` • Guest: ${ord.customerName}` : ''}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-lg sm:text-xl font-bold text-white font-mono">₹{ord.totalAmount}</div>
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium inline-block mt-0.5 ${
                          isCancelled
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : isFulfilled
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : ord.status === 'out_for_delivery'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          ● {isCancelled ? (isHi ? 'रद्द' : 'Cancelled') : isFulfilled ? (ord.status === 'served' ? (isHi ? 'परोसा गया' : 'Served') : (isHi ? 'डिलीवर हुआ' : 'Delivered')) : ord.status === 'out_for_delivery' ? (isHi ? 'रास्ते में है' : 'En Route') : (isHi ? 'रसोई तैयारी' : 'Preparing')}
                        </span>
                      </div>
                    </div>

                    {/* Cancelled Banner */}
                    {isCancelled && (
                      <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-3.5 flex items-center justify-between text-xs text-red-300">
                        <span className="font-semibold">{isHi ? '✕ यह ऑर्डर रद्द कर दिया गया था' : '✕ This order was cancelled'}</span>
                        <span className="text-[11px] text-red-300/80">{isHi ? 'सहायता हेतु संपर्क करें' : 'Contact Panjtara team for query'}</span>
                      </div>
                    )}

                    {/* Active Order: Single Authoritative Live Delivery Tracker (Radar Map + Timeline + Telemetry) */}
                    {!isCancelled && activeTab === 'active' && (
                      <OrderDeliveryTracker order={ord} isHi={isHi} />
                    )}

                    {/* History Order Fulfilled Badge */}
                    {!isCancelled && activeTab === 'history' && isFulfilled && (
                      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
                        <span className="flex items-center gap-1.5 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>{isDelivery ? (isHi ? 'सफलतापूर्वक आपके पते पर डिलीवर हुआ' : 'Successfully Delivered to Your Doorstep') : (isHi ? 'रेस्टोरेंट में परोसा गया' : 'Served at Panchtara Restaurant')}</span>
                        </span>
                        <span className="text-[11px] text-emerald-300/70 font-mono">
                          {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}

                    {/* Ordered Items Breakdown */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-white/70 uppercase tracking-wider">
                        <span>{isHi ? 'व्यंजन सूची:' : 'Dishes in Order:'}</span>
                        <span className="text-white/40 font-mono text-[11px]">{ord.items?.length || 0} items</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {ord.items && ord.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                            <span className="text-white/90 truncate mr-2">
                              <span className="text-[#C5A880] font-bold mr-1.5 font-mono">{item.quantity}x</span>
                              {item.name}
                            </span>
                            <span className="text-white/70 font-mono font-medium shrink-0">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address or Reservation Details */}
                    {ord.deliveryAddress && (
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/75 flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white/90 mr-1.5">{isHi ? 'डिलीवरी पता:' : 'Delivery Address:'}</span>
                          <span>
                            {ord.deliveryAddress.flat}, {ord.deliveryAddress.street}, {ord.deliveryAddress.area}, Indore
                          </span>
                        </div>
                      </div>
                    )}
                    {ord.date && (
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/75 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#C5A880] shrink-0" />
                        <span>Table Reservation: {ord.date} at {ord.time} ({ord.guests} guests, {ord.seatingArea})</span>
                      </div>
                    )}

                    {/* Culinary Star Rating & Feedback Input for 'Past History' Tab */}
                    {activeTab === 'history' && !isCancelled && (
                      <div className="pt-2 border-t border-white/5 space-y-2.5">
                        {ord.rating && !editingReview[ord._id || ord.orderNumber] ? (
                          /* Already Rated View */
                          <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-[#C5A880]/10 via-[#181613] to-white/5 border border-[#C5A880]/30 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= (ord.rating || 0)
                                          ? 'fill-[#C5A880] text-[#C5A880]'
                                          : 'text-white/20'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs font-bold text-[#FAF7F2]">
                                  {ord.rating}.0
                                </span>
                                <span className="text-[11px] text-[#C5A880]/90 font-medium hidden sm:inline">
                                  • {getStarLabel(ord.rating)}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  const key = ord._id || ord.orderNumber;
                                  setRatingDrafts((prev) => ({ ...prev, [key]: ord.rating || 5 }));
                                  setFeedbackDrafts((prev) => ({ ...prev, [key]: ord.feedback || '' }));
                                  setEditingReview((prev) => ({ ...prev, [key]: true }));
                                }}
                                className="text-[11px] text-white/50 hover:text-[#C5A880] flex items-center gap-1 transition-colors px-2 py-0.5 rounded hover:bg-white/5 cursor-pointer"
                                title="Edit your rating or review"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>{isHi ? 'संपादित करें' : 'Edit Rating'}</span>
                              </button>
                            </div>

                            {ord.feedback ? (
                              <div className="text-xs text-white/85 bg-black/40 rounded-lg p-2.5 border border-white/5 italic font-serif">
                                “{ord.feedback}”
                              </div>
                            ) : null}

                            <div className="flex items-center justify-between text-[10px] text-white/50 pt-0.5">
                              <span className="text-emerald-400/90 flex items-center gap-1 font-medium">
                                <Check className="w-3 h-3" />
                                {isHi ? 'समीक्षा दर्ज हो चुकी है। धन्यवाद!' : 'Culinary feedback recorded. Thank you!'}
                              </span>
                              {ord.ratedAt && (
                                <span className="text-white/40">
                                  {new Date(ord.ratedAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          /* Interactive Star Rating & Feedback Form */
                          <div className="p-3 sm:p-3.5 rounded-xl bg-black/40 border border-[#C5A880]/25 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880]">
                                  <Star className="w-3 h-3 fill-current" />
                                </div>
                                <span className="text-xs font-semibold text-[#FAF7F2]">
                                  {isHi ? 'व्यंजन रेटिंग एवं अनुभव' : 'Rate Your Culinary Experience'}
                                </span>
                              </div>
                              <span className="text-[10px] text-[#C5A880]/80">
                                {isHi ? 'शाही स्वाद व प्रस्तुति' : 'Taste & Freshness'}
                              </span>
                            </div>

                            {/* 5-Star Interactive Rating */}
                            <div className="flex items-center flex-wrap gap-2">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((starNum) => {
                                  const key = ord._id || ord.orderNumber;
                                  const effectiveVal =
                                    hoveredStars[key] || ratingDrafts[key] || ord.rating || 0;
                                  const isFilled = starNum <= effectiveVal;

                                  return (
                                    <button
                                      key={starNum}
                                      type="button"
                                      onMouseEnter={() =>
                                        setHoveredStars((prev) => ({ ...prev, [key]: starNum }))
                                      }
                                      onMouseLeave={() =>
                                        setHoveredStars((prev) => ({ ...prev, [key]: 0 }))
                                      }
                                      onClick={() => {
                                        setRatingDrafts((prev) => ({ ...prev, [key]: starNum }));
                                      }}
                                      className="p-1 rounded-md transition-transform hover:scale-125 focus:outline-none focus:ring-1 focus:ring-[#C5A880] cursor-pointer"
                                      aria-label={`Rate ${starNum} stars`}
                                    >
                                      <Star
                                        className={`w-5 h-5 transition-colors ${
                                          isFilled
                                            ? 'fill-[#C5A880] text-[#C5A880] drop-shadow-[0_0_6px_rgba(197,168,128,0.4)]'
                                            : 'text-white/25 hover:text-white/50'
                                        }`}
                                      />
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Dynamic star label */}
                              {(() => {
                                const key = ord._id || ord.orderNumber;
                                const activeVal =
                                  hoveredStars[key] || ratingDrafts[key] || ord.rating || 0;
                                return activeVal > 0 ? (
                                  <span className="text-xs text-[#C5A880] font-medium">
                                    {getStarLabel(activeVal)}
                                  </span>
                                ) : (
                                  <span className="text-[11px] text-white/40">
                                    {isHi ? 'रेट करने के लिए स्टार पर टैप करें' : 'Tap a star to rate experience'}
                                  </span>
                                );
                              })()}
                            </div>

                            {/* Quick Praise Chips */}
                            <div className="flex items-center flex-wrap gap-1.5 pt-0.5">
                              {[
                                '♨️ Piping Hot',
                                '🍲 Authentic Handi Taste',
                                '🫓 Soft & Fresh Naan',
                                '🛵 Speedy Delivery',
                                '📦 Spill-Proof Packaging',
                                '👨‍🍳 Chef Compliments',
                              ].map((chip) => {
                                const key = ord._id || ord.orderNumber;
                                const currentText = feedbackDrafts[key] ?? ord.feedback ?? '';
                                const isSelected = currentText.includes(chip);

                                return (
                                  <button
                                    key={chip}
                                    type="button"
                                    onClick={() => {
                                      let newText = currentText;
                                      if (isSelected) {
                                        newText = newText.replace(chip, '').replace(/,\s*,/g, ',').replace(/^,\s*/, '').replace(/,\s*$/, '').trim();
                                      } else {
                                        newText = currentText ? `${currentText}, ${chip}` : chip;
                                      }
                                      setFeedbackDrafts((prev) => ({ ...prev, [key]: newText }));
                                      if (!ratingDrafts[key] && !ord.rating) {
                                        setRatingDrafts((prev) => ({ ...prev, [key]: 5 }));
                                      }
                                    }}
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all border cursor-pointer ${
                                      isSelected
                                        ? 'bg-[#C5A880] text-black border-[#C5A880] font-bold shadow-xs'
                                        : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/10'
                                    }`}
                                  >
                                    {chip}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Feedback Input Field */}
                            <div className="space-y-1">
                              <textarea
                                rows={2}
                                value={
                                  feedbackDrafts[ord._id || ord.orderNumber] !== undefined
                                    ? feedbackDrafts[ord._id || ord.orderNumber]
                                    : (ord.feedback || '')
                                }
                                onChange={(e) => {
                                  const key = ord._id || ord.orderNumber;
                                  const val = e.target.value;
                                  setFeedbackDrafts((prev) => ({ ...prev, [key]: val }));
                                }}
                                placeholder={
                                  isHi
                                    ? 'अपने अनुभव, स्वाद या शेफ के लिए कोई टिप्पणी लिखें (वैकल्पिक)...'
                                    : 'Share your feedback (e.g. flavours, aroma, Dal Panjtara freshness, compliments for chef)...'
                                }
                                className="w-full bg-white/5 border border-white/10 focus:border-[#C5A880] rounded-lg px-3 py-2 text-xs text-white placeholder-white/35 focus:outline-none resize-none transition-colors"
                              />
                            </div>

                            {/* Action Buttons for Feedback */}
                            {(() => {
                              const key = ord._id || ord.orderNumber;
                              const selectedRating = ratingDrafts[key] ?? ord.rating ?? 0;
                              const isSubmitting = submittingReview[key];
                              const isFlash = reviewSuccess[key];

                              return (
                                <div className="flex items-center justify-between gap-2 pt-0.5">
                                  <div className="text-[10px] text-white/45">
                                    {selectedRating === 0
                                      ? (isHi ? 'कृपया 1 से 5 स्टार चुनें' : 'Select 1 to 5 stars to submit')
                                      : (isHi ? 'समीक्षा शेफ व प्रबंधन तक पहुंचेगी' : 'Shared directly with Panjtara kitchen team')}
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {ord.rating && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setEditingReview((prev) => ({ ...prev, [key]: false }))
                                        }
                                        className="px-2.5 py-1 text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
                                      >
                                        {isHi ? 'रद्द करें' : 'Cancel'}
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      disabled={selectedRating === 0 || isSubmitting}
                                      onClick={() => handleSaveReview(ord)}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                                        selectedRating === 0 || isSubmitting
                                          ? 'bg-white/10 text-white/30 cursor-not-allowed'
                                          : 'bg-[#C5A880] hover:bg-[#d8be99] text-[#12110F] cursor-pointer'
                                      }`}
                                    >
                                      {isSubmitting ? (
                                        <>
                                          <RefreshCw className="w-3 h-3 animate-spin" />
                                          <span>{isHi ? 'सहेज रहे हैं...' : 'Saving...'}</span>
                                        </>
                                      ) : isFlash ? (
                                        <>
                                          <Check className="w-3 h-3 text-emerald-900" />
                                          <span>{isHi ? 'सहेज दिया गया!' : 'Rating Saved!'}</span>
                                        </>
                                      ) : (
                                        <>
                                          <Star className="w-3 h-3 fill-current" />
                                          <span>{isHi ? 'फीडबैक भेजें' : 'Submit Rating'}</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => handleReorder(ord)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#C5A880] hover:bg-[#dfcaab] text-[#12110F] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{isHi ? 'दोबारा ऑर्डर करें' : 'Re-Order Again'}</span>
                      </button>

                      <a
                        href={getWhatsAppTrackingUrl(ord)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isHi ? 'व्हाट्सएप सहायता' : 'WhatsApp Support'}</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
