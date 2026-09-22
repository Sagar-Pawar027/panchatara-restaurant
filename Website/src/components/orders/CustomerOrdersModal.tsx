import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { FoodOrder } from '../../types/customer.ts';

interface CustomerOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerOrdersModal({ isOpen, onClose }: CustomerOrdersModalProps) {
  const { user, openAuthModal } = useCustomerAuth();
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchOrders = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/pre-orders/user/${user.phone}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch user orders', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchOrders();
      // Auto-poll every 4 seconds for real-time status updates (Zepto/Swiggy style)
      const interval = setInterval(() => {
        fetchOrders();
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

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
      `Namaste Panjtara Pure Veg! 🙏\n\nI want to check the live status of my order:\n🔖 Order ID: ${ord.orderNumber || ord._id}\n👤 Name: ${ord.customerName}\n📱 Phone: ${ord.phone}\n💰 Total: ₹${ord.totalAmount}\n\nPlease update me on the delivery status. Thank you!`
    );
    return `https://wa.me/919522010107?text=${text}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 overflow-y-auto bg-black/80 backdrop-blur-sm p-4">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#161412] text-[#FAF7F2] rounded-2xl border border-[#C5A880]/30 shadow-2xl overflow-hidden z-10 max-h-[88vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#221E19] to-[#161412] p-5 border-b border-[#C5A880]/20 flex items-center justify-between">
            <div>
              <h2 className="font-editorial-serif text-xl text-[#FAF7F2] flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#C5A880]" />
                <span>{isHi ? 'मेरे ऑर्डर्स एवं लाइव ट्रैकिंग' : 'My Orders & Live Tracking'}</span>
              </h2>
              <p className="text-xs text-[#A89F91]">
                {user ? `Phone: +91 ${user.phone}` : isHi ? 'कृपया ऑर्डर्स देखने के लिए लॉगिन करें' : 'Please log in to view orders'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchOrders}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                title="Refresh orders"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            {!user ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880]">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {isHi ? 'ऑर्डर देखने के लिए लॉगिन करें' : 'Login to View Past Orders'}
                  </h3>
                  <p className="text-xs text-white/60 mt-1 max-w-sm mx-auto">
                    {isHi
                      ? 'अपने मोबाइल नंबर से 1-क्लिक में लॉगिन करके अपने लाइव ऑर्डर्स ट्रैक करें।'
                      : 'Login with your 10-digit mobile number to track kitchen dispatch, delivery & invoices.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    openAuthModal();
                  }}
                  className="px-6 py-2.5 bg-[#C5A880] hover:bg-[#d8bf9a] text-black font-semibold text-xs rounded-xl uppercase tracking-wider transition-all"
                >
                  {isHi ? 'तुरंत लॉगिन करें' : 'Login / Register'}
                </button>
              </div>
            ) : isLoading ? (
              <div className="py-12 text-center text-xs text-white/50 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#C5A880]" />
                <span>Loading your orders...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-sm text-white/70">
                  {isHi ? 'अभी तक कोई ऑर्डर नहीं मिला' : 'No orders found for this number yet.'}
                </p>
                <p className="text-xs text-white/50">
                  {isHi
                    ? 'मेन्यू से स्वादिष्ट शुद्ध शाकाहारी व्यंजन चुनें और ऑर्डर करें!'
                    : 'Explore our pure veg delights and place your first express order!'}
                </p>
              </div>
            ) : (
              orders.map((ord) => {
                const step = getStatusStep(ord.status);
                const isDelivery = ord.orderType === 'delivery';

                return (
                  <div
                    key={ord._id}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#C5A880]/40 transition-colors space-y-4"
                  >
                    {/* Top Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#C5A880]">
                            {ord.orderNumber || `ORD-${ord._id.slice(-6).toUpperCase()}`}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                              isDelivery
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : ord.orderType === 'takeaway'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            }`}
                          >
                            {ord.orderType || 'Dine-In'}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/50">
                          {new Date(ord.createdAt).toLocaleDateString()} at{' '}
                          {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-white">₹{ord.totalAmount}</span>
                        <div className="text-[10px] text-white/60">
                          {ord.paymentStatus === 'paid' ? (
                            <span className="text-emerald-400 font-medium">● Paid</span>
                          ) : (
                            <span className="text-amber-400 font-medium">● Advance / Pending</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Zepto-Style Live Status Progress Stepper */}
                    <div className="bg-black/30 rounded-xl p-3 border border-white/5 space-y-3">
                      <div className="flex items-center justify-between relative px-2">
                        {/* Connecting line background */}
                        <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
                        {/* Active connecting line */}
                        <div
                          className="absolute top-1/2 left-6 h-0.5 bg-[#C5A880] -translate-y-1/2 z-0 transition-all duration-500"
                          style={{
                            width: `${Math.min(100, Math.max(0, ((step - 1) / 5) * 100))}%`,
                          }}
                        />

                        {/* Step 1: Received */}
                        <div className="relative z-10 flex flex-col items-center gap-1">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${
                              step >= 1 ? 'bg-[#C5A880] text-black font-bold' : 'bg-white/10 text-white/40'
                            }`}
                          >
                            ✓
                          </div>
                          <span className="text-[10px] text-white/70">Placed</span>
                        </div>

                        {/* Step 2: Cooking */}
                        <div className="relative z-10 flex flex-col items-center gap-1">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${
                              step >= 3
                                ? 'bg-[#C5A880] text-black font-bold'
                                : 'bg-white/10 text-white/40'
                            } ${ord.status === 'preparing' ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black animate-pulse' : ''}`}
                          >
                            <ChefHat className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[10px] text-white/70">Cooking</span>
                        </div>

                        {/* Step 3: Ready / Packed */}
                        <div className="relative z-10 flex flex-col items-center gap-1">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${
                              step >= 4
                                ? 'bg-[#C5A880] text-black font-bold'
                                : 'bg-white/10 text-white/40'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[10px] text-white/70">Ready</span>
                        </div>

                        {/* Step 4: Out for delivery */}
                        <div className="relative z-10 flex flex-col items-center gap-1">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${
                              step >= 5
                                ? 'bg-cyan-500 text-black font-bold'
                                : 'bg-white/10 text-white/40'
                            } ${ord.status === 'out_for_delivery' ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-black animate-pulse' : ''}`}
                          >
                            <Bike className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[10px] text-white/70">
                            {isDelivery ? 'Out for Delivery' : 'Dispatched'}
                          </span>
                        </div>

                        {/* Step 5: Delivered */}
                        <div className="relative z-10 flex flex-col items-center gap-1">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${
                              step >= 6 ? 'bg-emerald-500 text-white font-bold' : 'bg-white/10 text-white/40'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[10px] text-white/70">
                            {isDelivery ? 'Delivered' : 'Served'}
                          </span>
                        </div>
                      </div>

                      {/* Live Contextual Status Banner */}
                      <div className="pt-1">
                        {ord.status === 'out_for_delivery' ? (
                          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center justify-between">
                            <span className="flex items-center gap-1.5 font-medium">
                              <Bike className="w-4 h-4 animate-bounce" />
                              <span>🛵 Rider is out for delivery with your hot royal feast!</span>
                            </span>
                            <span className="text-[10px] uppercase font-mono font-bold tracking-wider">
                              In Transit
                            </span>
                          </div>
                        ) : ord.status === 'ready' ? (
                          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-1.5 font-medium">
                            <Clock className="w-4 h-4" />
                            <span>
                              {isDelivery
                                ? '📦 Order packed hot & sealed in insulated bag. Assigning rider!'
                                : '🎉 Table & pre-ordered royal dishes are ready for you!'}
                            </span>
                          </div>
                        ) : ord.status === 'preparing' ? (
                          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-1.5 font-medium">
                            <ChefHat className="w-4 h-4 animate-pulse" />
                            <span>👨‍🍳 Master Chef is preparing your pure veg meal fresh in desi ghee.</span>
                          </div>
                        ) : ord.status === 'delivered' || ord.status === 'served' ? (
                          <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-1.5 font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>✅ Order completed! We hope you loved dining with Panjtara.</span>
                          </div>
                        ) : (
                          <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-xs flex items-center gap-1.5">
                            <span>🕒 Order received by restaurant. Awaiting chef assignment.</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ordered Items summary */}
                    <div className="space-y-1.5 text-xs text-white/80 border-t border-white/5 pt-2">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-mono text-white/60">₹{item.price * item.quantity}</span>
                        </div>
                      ))}

                      {ord.deliveryAddress && (
                        <div className="pt-2 text-[11px] text-white/60 flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                          <span>
                            {ord.deliveryAddress.flat}, {ord.deliveryAddress.street},{' '}
                            {ord.deliveryAddress.area}, Indore
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                      <a
                        href={getWhatsAppTrackingUrl(ord)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded-lg border border-emerald-500/30 text-xs font-medium transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Track on WhatsApp</span>
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
