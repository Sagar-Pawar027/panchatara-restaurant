import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  Utensils,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  QrCode,
  CreditCard,
  Phone,
  Copy,
  Check,
  Bike,
  ShoppingBag,
  MapPin,
  Percent,
  Trash2,
  History,
  RotateCcw,
} from 'lucide-react';
import { SIGNATURE_DISHES, MENU_ITEMS } from '../../data/menu.ts';
import { RESTAURANT_INFO } from '../../data/restaurant.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useCustomerAuth } from '../../context/CustomerAuthContext.tsx';
import { useCart, INDORE_DELIVERY_ZONES, OrderType } from '../../context/CartContext.tsx';
import { saveLocalOrder } from '../../services/orderStorage.ts';
import { FoodOrder } from '../../types/customer.ts';

interface PreOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToReservation?: () => void;
  onOpenOrdersTracking?: () => void;
}

type PaymentMethod = 'upi' | 'razorpay' | 'cod' | 'counter';

const QUICK_ADD_DISHES = [
  {
    id: 'm-dal-panjtara',
    name: 'Dal Panchtara',
    hindiName: 'दाल पंचतारा',
    price: 345,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'm-paneer-tikka',
    name: 'Paneer Lababdar',
    hindiName: 'पनीर लबाबदार',
    price: 395,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'm-butter-naan',
    name: 'Butter Naan',
    hindiName: 'बटर नान',
    price: 65,
    category: 'Breads',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'm-gulab-jamun',
    name: 'Gulab Jamun (2 pcs)',
    hindiName: 'गुलाब जामुन',
    price: 145,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'm-jeera-rice',
    name: 'Jeera Rice',
    hindiName: 'जीरा राइस',
    price: 195,
    category: 'Rice',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80',
  },
];

export function PreOrderModal({
  isOpen,
  onClose,
  onNavigateToReservation,
  onOpenOrdersTracking,
}: PreOrderModalProps) {
  const { language } = useLanguage();
  const isHi = language === 'hi';
  const { user, isAuthenticated, openAuthModal } = useCustomerAuth();
  const {
    items: cartItems,
    itemCount,
    totalAmount,
    advanceDeposit,
    remainingBalance,
    commissionSavings,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    orderType,
    setOrderType,
    selectedArea,
    setSelectedArea,
    currentZone,
    deliveryFee,
    playSuccessSound,
  } = useCart();

  // Active step: 'cart' | 'details' | 'success'
  const [activeTab, setActiveTab] = useState<'cart' | 'checkout' | 'success'>('cart');

  // Dine-in fields
  const [date, setDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [time, setTime] = useState<string>('08:00 PM');
  const [guests, setGuests] = useState<number>(4);
  const [seatingArea, setSeatingArea] = useState<string>('Garden Lawn');

  // Customer Contact & Delivery fields
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [addressFlat, setAddressFlat] = useState<string>('');
  const [addressStreet, setAddressStreet] = useState<string>('');
  const [specialDiet, setSpecialDiet] = useState<string>('None');
  const [specialNotes, setSpecialNotes] = useState<string>('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<FoodOrder | null>(null);
  const [copiedToken, setCopiedToken] = useState<boolean>(false);

  // Pre-fill from authenticated user or localStorage
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.phone) setPhone(user.phone);
      if (user.addresses && user.addresses.length > 0) {
        const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
        setAddressFlat(defaultAddr.flat || '');
        setAddressStreet(defaultAddr.street || '');
        if (defaultAddr.area) setSelectedArea(defaultAddr.area);
      }
    } else {
      const savedPhone = localStorage.getItem('panjtara_last_phone');
      const savedName = localStorage.getItem('panjtara_last_name');
      const savedAddress = localStorage.getItem('panjtara_last_address');
      if (savedPhone) setPhone(savedPhone);
      if (savedName) setName(savedName);
      if (savedAddress) setAddressFlat(savedAddress);
    }
  }, [user, setSelectedArea]);

  // Reset or initialize state on open
  useEffect(() => {
    if (isOpen) {
      if (orderSuccess) {
        setActiveTab('success');
      } else if (cartItems.length > 0) {
        setActiveTab('cart');
      }
    }
  }, [isOpen, cartItems.length, orderSuccess]);

  if (!isOpen) return null;

  const handleOrderSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setActiveTab('cart');
      return;
    }

    if (!phone || phone.replace(/\D/g, '').length < 10) {
      alert(isHi ? 'कृपया वैध 10-अंकों का मोबाइल नंबर दर्ज करें' : 'Please provide a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const guestName = name.trim() || user?.name || 'Valued Guest';

    // Remember in localStorage for convenience
    localStorage.setItem('panjtara_last_phone', cleanPhone);
    localStorage.setItem('panjtara_last_name', guestName);
    if (addressFlat) localStorage.setItem('panjtara_last_address', addressFlat);

    const tokenPrefix = orderType === 'delivery' ? 'DEL' : orderType === 'takeaway' ? 'TAK' : 'DINE';
    const generatedOrderNumber = `PCH-${tokenPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderPayload: Partial<FoodOrder> = {
      orderNumber: generatedOrderNumber,
      userId: user?.id,
      customerName: guestName,
      phone: cleanPhone,
      orderType,
      status: 'received',
      items: cartItems.map((item) => ({
        name: item.name,
        hindiName: item.hindiName,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: totalAmount + deliveryFee,
      deliveryFee: orderType === 'delivery' ? deliveryFee : 0,
      advanceDeposit: orderType === 'dine-in' ? advanceDeposit : totalAmount,
      deliveryAddress: orderType === 'delivery' ? {
        id: `addr-${Date.now()}`,
        label: 'Home',
        flat: addressFlat || 'Indore Residence',
        street: addressStreet || currentZone.name,
        area: currentZone.name,
        city: 'Indore',
        pincode: '452016',
      } : undefined,
      specialInstructions: `${specialDiet !== 'None' ? `[Diet: ${specialDiet}] ` : ''}${specialNotes}`.trim(),
      paymentMethod: paymentMethod === 'upi' ? 'upi' : paymentMethod === 'cod' ? 'cod' : 'counter',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      createdAt: new Date().toISOString(),
      ...(orderType === 'dine-in' ? { date, time, guests, seatingArea } : {}),
    };

    try {
      // 1. Post to backend
      const res = await fetch('/api/pre-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.id ? { 'x-user-id': user.id } : {}),
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      const confirmedOrder: FoodOrder = {
        _id: data.data?._id || `ord-${Date.now()}`,
        ...(orderPayload as FoodOrder),
      };

      // 2. Persist in local storage
      saveLocalOrder(confirmedOrder);
      setOrderSuccess(confirmedOrder);
      playSuccessSound();
      clearCart();
      setActiveTab('success');
    } catch (err) {
      console.warn('Backend unavailable, saved locally', err);
      const fallbackOrder: FoodOrder = {
        _id: `ord-${Date.now()}`,
        ...(orderPayload as FoodOrder),
      };
      saveLocalOrder(fallbackOrder);
      setOrderSuccess(fallbackOrder);
      playSuccessSound();
      clearCart();
      setActiveTab('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyToken = () => {
    if (orderSuccess?.orderNumber) {
      navigator.clipboard.writeText(orderSuccess.orderNumber);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const getWhatsAppShareUrl = () => {
    if (!orderSuccess) return '#';
    const text = encodeURIComponent(
      `Namaste Panjtara! 🙏\n\nI have placed an order:\n🔖 *Order Token:* ${orderSuccess.orderNumber}\n👤 *Name:* ${orderSuccess.customerName}\n📱 *Phone:* ${orderSuccess.phone}\n💰 *Amount:* ₹${orderSuccess.totalAmount}\n🍴 *Type:* ${orderSuccess.orderType}\n\nPlease confirm kitchen dispatch.`
    );
    return `https://wa.me/919522010107?text=${text}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Subtle Dark Backdrop */}
        <motion.div
          id="order-sidebar-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/65 backdrop-blur-xs"
        />

        {/* Slide-over Right Side Bar */}
        <motion.div
          id="order-sidebar-container"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-sidebar-title"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-10 w-full sm:max-w-xl md:max-w-xl bg-[#141210] text-[#FAF7F2] border-l border-[#C5A880]/30 shadow-2xl flex flex-col h-[100dvh] overflow-hidden"
        >
          {/* Top Bar Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 bg-[#181614] flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shrink-0" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                  {isHi ? 'पंजतारा डाइनिंग' : 'Panjtara Pure Veg'}
                </span>
              </div>
              <h2 id="order-sidebar-title" className="font-editorial-serif text-xl sm:text-2xl text-[#FAF7F2] font-medium mt-0.5">
                {activeTab === 'success'
                  ? isHi ? 'ऑर्डर पुष्टिकरण' : 'Order Confirmed!'
                  : isHi ? 'आपका ऑर्डर' : 'Your Royal Order'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Quick Order History Link in Sidebar */}
              {onOpenOrdersTracking && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenOrdersTracking();
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-[#C5A880] text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-colors"
                  title="View past orders"
                >
                  <History className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span className="hidden sm:inline">{isHi ? 'इतिहास' : 'History'}</span>
                </button>
              )}

              {/* Close Button */}
              <button
                type="button"
                id="order-sidebar-close-btn"
                onClick={onClose}
                aria-label="Close sidebar"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Service Mode Selector Tabs */}
          {activeTab !== 'success' && (
            <div className="px-4 py-3 bg-[#0F0E0C] border-b border-white/5 shrink-0">
              <div className="grid grid-cols-3 gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    orderType === 'delivery'
                      ? 'bg-[#C5A880] text-[#12110F] shadow-md font-bold'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span>{isHi ? 'डिलीवरी' : 'Delivery'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('dine-in')}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    orderType === 'dine-in'
                      ? 'bg-[#C5A880] text-[#12110F] shadow-md font-bold'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>{isHi ? 'डाइन-इन (50%)' : 'Dine-In (50%)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('takeaway')}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    orderType === 'takeaway'
                      ? 'bg-[#C5A880] text-[#12110F] shadow-md font-bold'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{isHi ? 'टेकअवे' : 'Takeaway'}</span>
                </button>
              </div>

              {/* Aggregator savings highlight banner */}
              <div className="mt-2 flex items-center justify-between text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                <span className="flex items-center gap-1.5">
                  <Percent className="w-3 h-3 text-emerald-400" />
                  <span>{isHi ? '0% प्लेटफॉर्म कमीशन • डायरेक्ट किचन छूट' : '0% App Commission • Saved ~25% vs Zomato'}</span>
                </span>
                <span className="font-bold text-white font-mono">₹0 Fee</span>
              </div>
            </div>
          )}

          {/* Scrollable Main Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {/* SUCCESS SCREEN */}
            {activeTab === 'success' && orderSuccess ? (
              <div className="py-6 space-y-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-editorial-serif text-2xl text-white">
                    {isHi ? 'ऑर्डर सफलतापूर्वक प्राप्त हुआ!' : 'Order Placed Successfully!'}
                  </h3>
                  <p className="text-xs text-[#FAF7F2]/70">
                    {orderSuccess.orderType === 'delivery'
                      ? isHi ? 'रसोई में तैयारी शुरू हो गई है। इंदौर बायपास से ताजा पहुंचेगा।' : 'Preparation underway. Fresh delivery dispatched from Indore Bypass.'
                      : orderSuccess.orderType === 'dine-in'
                      ? isHi ? 'आपकी टेबल 50% अग्रिम के साथ आरक्षित है।' : 'Table reserved with 50% advance. Food will be served hot upon arrival.'
                      : isHi ? '20-25 मिनट में टेकअवे काउंटर पर तैयार।' : 'Ready for pickup in 20-25 mins at counter.'}
                  </p>
                </div>

                {/* Token Badge */}
                <div className="p-4 rounded-xl bg-white/5 border border-[#C5A880]/40 max-w-sm mx-auto space-y-2 text-left">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-[#C5A880]">
                    {isHi ? 'ऑर्डर संदर्भ टोकन' : 'Order Reference Token'}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xl font-bold text-white tracking-wider">
                      {orderSuccess.orderNumber}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyToken}
                      className="px-2.5 py-1 rounded bg-[#C5A880] text-black text-xs font-bold flex items-center gap-1 hover:bg-[#dfcaab] transition-colors"
                    >
                      {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-white/10 text-xs text-white/70 space-y-1">
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-bold text-white">₹{orderSuccess.totalAmount}</span>
                    </div>
                    {orderSuccess.advanceDeposit && orderSuccess.orderType === 'dine-in' && (
                      <div className="flex justify-between text-purple-300">
                        <span>50% Advance Paid:</span>
                        <span>₹{orderSuccess.advanceDeposit}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Customer:</span>
                      <span>{orderSuccess.customerName} (+91 {orderSuccess.phone})</span>
                    </div>
                    {orderSuccess.orderType === 'delivery' && (
                      <div className="flex justify-between text-[#C5A880] font-medium pt-1 border-t border-white/5">
                        <span>{isHi ? 'अनुमानित आगमन (ETA):' : 'Estimated Delivery (ETA):'}</span>
                        <span className="font-mono font-bold">~25-35 mins (18m prep + transit)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 max-w-sm mx-auto pt-2">
                  {onOpenOrdersTracking && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenOrdersTracking();
                      }}
                      className="w-full py-3 rounded-xl bg-[#C5A880] hover:bg-[#dfcaab] text-[#12110F] text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <History className="w-4 h-4" />
                      <span>{isHi ? 'ऑर्डर इतिहास व लाइव स्टेटस देखें' : 'View in Order History & Track'}</span>
                    </button>
                  )}

                  <a
                    href={getWhatsAppShareUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>{isHi ? 'व्हाट्सएप पर पुष्टिकरण भेजें' : 'Send WhatsApp Order Confirmation'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setOrderSuccess(null);
                      setActiveTab('cart');
                      onClose();
                    }}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs transition-colors"
                  >
                    {isHi ? 'बंद करें' : 'Close'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* CART ITEMS LIST */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[#C5A880] font-semibold border-b border-white/10 pb-2">
                    <span>
                      {isHi ? `आपके चयनित व्यंजन (${itemCount})` : `Selected Dishes (${itemCount})`}
                    </span>
                    {cartItems.length > 0 && (
                      <button
                        type="button"
                        onClick={clearCart}
                        className="text-[11px] text-white/50 hover:text-red-400 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{isHi ? 'खाली करें' : 'Clear All'}</span>
                      </button>
                    )}
                  </div>

                  {/* Empty state */}
                  {cartItems.length === 0 ? (
                    <div className="py-8 text-center space-y-3 bg-white/5 rounded-2xl border border-white/5 p-4">
                      <div className="w-12 h-12 mx-auto rounded-full bg-[#C5A880]/10 flex items-center justify-center text-[#C5A880]">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-white">
                          {isHi ? 'आपकी थाली अभी खाली है' : 'Your order bag is empty'}
                        </p>
                        <p className="text-xs text-white/50">
                          {isHi ? 'नीचे दिए गए लोकप्रिय व्यंजनों से 1-क्लिक में जोड़ें:' : 'Quick-add our most loved dishes below:'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Active Cart Items with intuitive steppers */
                    <div className="space-y-2.5">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 hover:border-[#C5A880]/30 transition-all"
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            {/* Veg indicator dot */}
                            <div className="w-3.5 h-3.5 border border-emerald-500 p-0.5 rounded-sm flex items-center justify-center shrink-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-semibold text-white truncate">
                                {isHi && item.hindiName ? item.hindiName : item.name}
                              </h4>
                              <p className="text-[11px] text-[#C5A880] font-mono">
                                ₹{item.price} each
                              </p>
                            </div>
                          </div>

                          {/* User Friendly Stepper Control */}
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="flex items-center bg-[#100E0D] border border-white/15 rounded-lg p-0.5">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, -1)}
                                aria-label="Decrease quantity"
                                className="w-6 h-6 rounded flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                              >
                                {item.quantity === 1 ? (
                                  <Trash2 className="w-3 h-3 text-red-400" />
                                ) : (
                                  <Minus className="w-3 h-3" />
                                )}
                              </button>
                              <span className="font-mono text-xs font-bold w-6 text-center text-[#C5A880]">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 1)}
                                aria-label="Increase quantity"
                                className="w-6 h-6 rounded flex items-center justify-center text-[#C5A880] hover:text-white hover:bg-white/10 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="text-xs font-bold text-white font-mono w-12 text-right">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* QUICK ADD RECOMMENDATION CAROUSEL / GRID */}
                  <div className="pt-2">
                    <div className="text-[11px] uppercase tracking-wider text-white/60 font-semibold mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>{isHi ? 'लोकप्रिय व्यंजन (1-क्लिक में जोड़ें):' : 'Frequently Ordered Add-ons:'}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {QUICK_ADD_DISHES.map((dish) => {
                        const inCart = cartItems.find((i) => i.id === dish.id);
                        return (
                          <div
                            key={dish.id}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-[#C5A880]/30 transition-all flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-medium text-white truncate">
                                {isHi ? dish.hindiName : dish.name}
                              </div>
                              <div className="text-[10px] text-[#C5A880] font-mono">₹{dish.price}</div>
                            </div>

                            <button
                              type="button"
                              onClick={() => addItem(dish, 1)}
                              className="px-2 py-1 rounded bg-[#C5A880] hover:bg-[#dfcaab] text-[#12110F] text-[10px] font-bold uppercase transition-all shrink-0 active:scale-95"
                            >
                              {inCart ? `+${inCart.quantity}` : '+ ADD'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* SERVICE & LOCATION DETAILS */}
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold">
                    {orderType === 'delivery'
                      ? isHi ? 'डिलीवरी पता एवं विवरण' : 'Delivery Address & Slot'
                      : orderType === 'dine-in'
                      ? isHi ? 'टेबल प्री-रिजर्वेशन विवरण' : 'Table Reservation Details'
                      : isHi ? 'टेकअवे पिकअप जानकारी' : 'Takeaway Pickup Details'}
                  </div>

                  {orderType === 'delivery' ? (
                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[11px] text-white/70 mb-1">
                          {isHi ? 'इंदौर डिलीवरी क्षेत्र (Indore Zone)' : 'Delivery Area (Indore)'}
                        </label>
                        <select
                          value={selectedArea}
                          onChange={(e) => setSelectedArea(e.target.value)}
                          className="w-full bg-[#181614] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                        >
                          {INDORE_DELIVERY_ZONES.map((zone) => (
                            <option key={zone.name} value={zone.name}>
                              {zone.name} ({zone.etaMinutes})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={addressFlat}
                          onChange={(e) => setAddressFlat(e.target.value)}
                          placeholder={isHi ? 'मकान / फ्लैट / मंजिल' : 'House / Flat / Floor'}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#C5A880]"
                        />
                        <input
                          type="text"
                          value={addressStreet}
                          onChange={(e) => setAddressStreet(e.target.value)}
                          placeholder={isHi ? 'लैंडमार्क / सड़क' : 'Landmark / Colony'}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>
                    </div>
                  ) : orderType === 'dine-in' ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-white/60 mb-1">{isHi ? 'तारीख' : 'Date'}</label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/60 mb-1">{isHi ? 'समय' : 'Time'}</label>
                        <select
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full bg-[#181614] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                        >
                          <option value="12:30 PM">12:30 PM (Lunch)</option>
                          <option value="01:30 PM">01:30 PM (Lunch)</option>
                          <option value="07:30 PM">07:30 PM (Dinner)</option>
                          <option value="08:00 PM">08:00 PM (Dinner)</option>
                          <option value="08:30 PM">08:30 PM (Dinner)</option>
                          <option value="09:00 PM">09:00 PM (Dinner)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/60 mb-1">{isHi ? 'अतिथि संख्या' : 'Guests'}</label>
                        <select
                          value={guests}
                          onChange={(e) => setGuests(Number(e.target.value))}
                          className="w-full bg-[#181614] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                        >
                          {[2, 3, 4, 6, 8, 10, 12, 16].map((g) => (
                            <option key={g} value={g}>{g} Guests</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/60 mb-1">{isHi ? 'बैठने का स्थान' : 'Seating Area'}</label>
                        <select
                          value={seatingArea}
                          onChange={(e) => setSeatingArea(e.target.value)}
                          className="w-full bg-[#181614] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                        >
                          <option value="Garden Lawn">Garden Lawn</option>
                          <option value="Poolside Cabana">Poolside Cabana</option>
                          <option value="Royal Gazebo">Royal Gazebo</option>
                          <option value="AC Family Hall">AC Family Hall</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200">
                      📍 Counter pickup at: Panjtara Pure Veg, Bypass Road, Near Bharat Benz, Indore (Ready in ~25 mins)
                    </div>
                  )}

                  {/* Customer Phone & Name */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder={isHi ? '10-अंकों का मोबाइल *' : '10-digit Phone *'}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#C5A880]"
                    />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isHi ? 'अतिथि नाम' : 'Your Name'}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  {/* Dietary Note */}
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={specialDiet}
                      onChange={(e) => setSpecialDiet(e.target.value)}
                      className="w-full bg-[#181614] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                    >
                      <option value="None">Regular Pure Veg</option>
                      <option value="Satvik Jain">Jain (No Onion / Garlic)</option>
                      <option value="Mild Spice">Kids / Mild Spice</option>
                      <option value="No Ghee">Less Oil / Low Fat</option>
                    </select>

                    <input
                      type="text"
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      placeholder={isHi ? 'विशेष निर्देश...' : 'Instructions for chef...'}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  {/* Payment Mode Selection */}
                  <div className="pt-2">
                    <label className="block text-[11px] text-white/70 mb-1.5 font-medium">
                      {isHi ? 'भुगतान माध्यम' : 'Payment Method'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          paymentMethod === 'upi'
                            ? 'bg-[#C5A880]/20 border-[#C5A880] text-white'
                            : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'
                        }`}
                      >
                        <QrCode className="w-4 h-4 text-[#C5A880]" />
                        <span className="text-xs font-semibold">Instant UPI / QR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          paymentMethod === 'cod'
                            ? 'bg-[#C5A880]/20 border-[#C5A880] text-white'
                            : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-[#C5A880]" />
                        <span className="text-xs font-semibold">
                          {orderType === 'dine-in' ? 'Pay At Restaurant' : 'Cash on Delivery'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* BILL BREAKDOWN SUMMARY */}
                {cartItems.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between text-white/70">
                      <span>Item Total:</span>
                      <span className="font-mono text-white">₹{totalAmount}</span>
                    </div>

                    {orderType === 'delivery' && (
                      <div className="flex justify-between text-white/70">
                        <span>Delivery Partner Fee:</span>
                        <span className="font-mono text-emerald-400">
                          {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>Platform Commission:</span>
                      <span>₹0 (0% App Fee)</span>
                    </div>

                    <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-bold text-white">
                      <span>
                        {orderType === 'dine-in' ? 'Advance Deposit (50% Now):' : 'Grand Total:'}
                      </span>
                      <span className="font-mono text-[#C5A880] text-base">
                        ₹{orderType === 'dine-in' ? advanceDeposit : totalAmount + deliveryFee}
                      </span>
                    </div>

                    {orderType === 'dine-in' && (
                      <div className="text-[11px] text-white/50 text-right">
                        Remaining ₹{remainingBalance} payable comfortably after your royal meal.
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sticky Bottom Action Checkout Bar */}
          {activeTab !== 'success' && (
            <div className="p-4 border-t border-white/10 bg-[#161412] shrink-0">
              <button
                type="button"
                id="sidebar-place-order-btn"
                disabled={isSubmitting || cartItems.length === 0}
                onClick={handleOrderSubmit}
                className="w-full py-3.5 rounded-xl bg-[#C5A880] hover:bg-[#dfcaab] disabled:opacity-50 disabled:cursor-not-allowed text-[#12110F] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span>Connecting with Panjtara Kitchen...</span>
                ) : (
                  <>
                    <span>
                      {cartItems.length === 0
                        ? isHi ? 'कृपया व्यंजन चुनें' : 'Add Dishes to Proceed'
                        : orderType === 'dine-in'
                        ? isHi ? `टेबल बुक व ऑर्डर • ₹${advanceDeposit} →` : `Lock Table & Pre-Order • ₹${advanceDeposit} →`
                        : isHi ? `ऑर्डर पूरा करें • ₹${totalAmount + deliveryFee} →` : `Place Order • ₹${totalAmount + deliveryFee} →`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
