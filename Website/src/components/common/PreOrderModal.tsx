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
  ChevronLeft,
  QrCode,
  CreditCard,
  Phone,
  Copy,
  Check,
  ExternalLink,
  Bike,
  ShoppingBag,
  MapPin,
  Zap,
  Percent,
} from 'lucide-react';
import { SIGNATURE_DISHES, MENU_ITEMS } from '../../data/menu.ts';
import { RESTAURANT_INFO } from '../../data/restaurant.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useCustomerAuth } from '../../context/CustomerAuthContext.tsx';
import { useCart, INDORE_DELIVERY_ZONES, OrderType } from '../../context/CartContext.tsx';

interface PreOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToReservation?: () => void;
  onOpenOrdersTracking?: () => void;
}

type PaymentMethod = 'upi' | 'razorpay' | 'whatsapp_pay' | 'cod' | 'counter';

const QUICK_ADD_DISHES = [
  ...SIGNATURE_DISHES.map((d) => ({
    id: d.id,
    name: d.name,
    hindiName: d.hindiName,
    price: d.price,
    category: 'Signature',
    description: d.subtitle,
    image: d.image,
  })),
  ...MENU_ITEMS.filter((m) =>
    ['m-paneer-tikka', 'm-butter-naan', 'm-jowar-roti', 'm-gulab-jamun', 'm-dal-panjtara', 'm-chana-masala'].includes(m.id)
  ).map((m) => ({
    id: m.id,
    name: m.name,
    hindiName: m.hindiName,
    price: m.price,
    category: m.category,
    description: m.description,
    image: m.image,
  })),
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

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Dine-in fields (Leverage 2: 50% split)
  const [date, setDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [time, setTime] = useState<string>('20:00');
  const [guests, setGuests] = useState<number>(4);
  const [seatingArea, setSeatingArea] = useState<string>('Garden Lawn');

  // Delivery Address fields (Leverage 1: Zomato-style online ordering)
  const [flat, setFlat] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');

  // Contact Info
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [specialDiet, setSpecialDiet] = useState<string>('');
  const [isJain, setIsJain] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const [bookingRef, setBookingRef] = useState<string>('');

  // Prefill contact and address when user is authenticated
  useEffect(() => {
    if (user) {
      if (!name && user.name) setName(user.name);
      if (!phone && user.phone) setPhone(user.phone);
      if (user.savedAddresses && user.savedAddresses.length > 0) {
        const defaultAddr = user.savedAddresses.find((a) => a.isDefault) || user.savedAddresses[0];
        if (defaultAddr) {
          if (!flat) setFlat(defaultAddr.flat);
          if (!street) setStreet(defaultAddr.street);
          if (!landmark && defaultAddr.landmark) setLandmark(defaultAddr.landmark);
          if (defaultAddr.area) setSelectedArea(defaultAddr.area);
        }
      }
    }
  }, [user, isOpen, setSelectedArea]);

  if (!isOpen) return null;

  const finalPayable = orderType === 'dine-in' ? advanceDeposit : totalAmount + deliveryFee;

  const handleConfirmOrder = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedItems = cartItems.map((item) => ({
      dishId: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    let generatedToken = `PCH-${orderType === 'delivery' ? 'DEL' : orderType === 'takeaway' ? 'TAK' : 'DINE'}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    try {
      const res = await fetch('/api/pre-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.id ? { 'x-user-id': user.id } : {}),
        },
        body: JSON.stringify({
          userId: user?.id,
          orderType,
          customerName: name || user?.name || 'Valued Guest',
          phone: phone || user?.phone || '9876543210',
          date: orderType === 'dine-in' ? date : new Date().toISOString().split('T')[0],
          time: orderType === 'dine-in' ? time : `Express (${currentZone.etaMinutes})`,
          guests: orderType === 'dine-in' ? guests : 1,
          seatingArea: orderType === 'dine-in' ? seatingArea : 'Delivery',
          deliveryAddress:
            orderType === 'delivery'
              ? {
                  flat,
                  street,
                  landmark,
                  area: selectedArea,
                  city: 'Indore',
                }
              : undefined,
          deliveryFee: orderType === 'delivery' ? deliveryFee : 0,
          specialDiet: isJain ? `Jain (Satvik) - ${specialDiet}`.trim() : specialDiet,
          items: formattedItems,
          totalAmount: totalAmount + (orderType === 'delivery' ? deliveryFee : 0),
          advanceDeposit,
          paymentMethod,
          paymentStatus:
            orderType === 'dine-in'
              ? 'advance_paid'
              : paymentMethod === 'cod' || paymentMethod === 'counter'
              ? 'pending'
              : 'paid',
        }),
      });

      const data = await res.json();
      if (data.data?.orderNumber) {
        generatedToken = data.data.orderNumber;
      } else if (data.data?._id) {
        generatedToken = `PCH-${String(data.data._id).slice(-6).toUpperCase()}`;
      }
    } catch {
      // Fallback local token
    } finally {
      setBookingRef(generatedToken);
      setIsSubmitting(false);
      setStep(4);
      playSuccessSound();
    }
  };

  const handleReset = () => {
    setStep(1);
    onClose();
  };

  const getWhatsAppMessage = () => {
    const itemsList = cartItems
      .map((item) => `• ${item.name} x${item.quantity} (₹${item.price * item.quantity})`)
      .join('\n');

    const addressText =
      orderType === 'delivery'
        ? `📍 *Delivery Address:* ${flat}, ${street}${landmark ? `, Near ${landmark}` : ''}, ${selectedArea}, Indore (Est: ${currentZone.etaMinutes})\n`
        : `📅 *Dine-In Schedule:* ${date} at ${time} (${guests} Guests - ${seatingArea})\n`;

    const paymentDetails =
      orderType === 'dine-in'
        ? `• Total Dining Amount: *₹${totalAmount}*\n• 50% Advance Paid: *₹${advanceDeposit}*\n• 50% Balance (Pay after service): *₹${remainingBalance}*`
        : `• Total Amount: *₹${totalAmount + deliveryFee}* (Delivery Fee: ₹${deliveryFee})\n• Commission Saved: *₹${commissionSavings}*`;

    return `*PANJTARA PURE VEG - ${orderType.toUpperCase()} ORDER*
----------------------------------------
🏷️ *Order Number:* ${bookingRef}
👤 *Customer:* ${name || 'Valued Guest'}
📞 *Phone:* ${phone}
🚚 *Service:* ${
      orderType === 'delivery'
        ? '🛵 Express Delivery (Direct Kitchen - 0% Commission)'
        : orderType === 'takeaway'
        ? '🥡 Takeaway Pickup'
        : '🍽️ Table Pre-Reservation (50% Advance Paid)'
    }
${addressText}${isJain ? '🥗 *Special Diet:* Strictly Jain (Satvik - No Onion/Garlic)\n' : ''}${
      specialDiet ? `📝 *Notes:* ${specialDiet}\n` : ''
    }
🍽️ *Items:*
${itemsList}

💰 *Payment Details:*
${paymentDetails}
• Mode: ${paymentMethod.toUpperCase()}
----------------------------------------
_Thank you for ordering directly with Panjtara Pure Veg!_`;
  };

  const getWhatsAppOrderUrl = () => {
    return `https://wa.me/919522010107?text=${encodeURIComponent(getWhatsAppMessage())}`;
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(getWhatsAppMessage());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <motion.div
        id="preorder-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2.5 sm:p-4 md:p-6"
      >
        <motion.div
          id="preorder-modal-container"
          role="dialog"
          aria-modal="true"
          aria-labelledby="preorder-modal-title"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-[#141210] text-[#FAF7F2] rounded-2xl overflow-hidden border border-[#C5A880]/40 shadow-2xl max-h-[94vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-white/10 bg-[#191714] flex items-start justify-between relative shrink-0">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-[#C5A880] mb-1 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{isHi ? 'पंजतारा ऑनलाइन ऑर्डरिंग व डाइनिंग' : 'Panjtara Royal Dining & Express Delivery'}</span>
              </div>
              <h2 id="preorder-modal-title" className="font-editorial-serif text-xl sm:text-2xl font-medium text-[#FAF7F2]">
                {orderType === 'delivery'
                  ? isHi ? 'एक्सप्रेस होम डिलीवरी (Zomato विकल्प)' : 'Express Home Delivery • 0% Commission'
                  : orderType === 'dine-in'
                  ? isHi ? 'टेबल प्री-रिजर्वेशन (50% अग्रिम)' : 'Table Pre-Reservation (Pay 50% Now)'
                  : isHi ? 'टेकअवे पार्सल पिकअप' : 'Express Takeaway Counter Pickup'}
              </h2>
              <p className="text-xs text-[#FAF7F2]/70 font-light mt-1 max-w-lg">
                {orderType === 'delivery'
                  ? 'Pure vegetarian delicacies delivered fresh from our tandoor right to your doorstep in Indore.'
                  : orderType === 'dine-in'
                  ? 'Lock your royal table with 50% advance now; pre-order your meal so it is ready on arrival. Pay remaining 50% after service!'
                  : 'Fast counter pickup from Indore Bypass road.'}
              </p>
            </div>

            <button
              id="preorder-modal-close-btn"
              onClick={handleReset}
              aria-label="Close Modal"
              className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step Progress Tracker */}
          {step < 4 && (
            <div className="flex items-center justify-between px-4 sm:px-8 py-2 bg-[#0E0D0B] border-b border-white/5 text-[11px] uppercase tracking-wider text-[#FAF7F2]/60 shrink-0">
              <span className={step === 1 ? 'text-[#C5A880] font-semibold' : ''}>
                {isHi ? '1. सेवा व स्थान' : '1. Service & Location'}
              </span>
              <span className="text-white/20">•</span>
              <span className={step === 2 ? 'text-[#C5A880] font-semibold' : ''}>
                {isHi ? `2. व्यंजन (${itemCount})` : `2. Dishes (${itemCount})`}
              </span>
              <span className="text-white/20">•</span>
              <span className={step === 3 ? 'text-[#C5A880] font-semibold' : ''}>
                {isHi ? '3. भुगतान व ऑर्डर' : '3. Payment & Dispatch'}
              </span>
            </div>
          )}

          {/* Quick OTP prompt if not logged in */}
          {!isAuthenticated && step < 4 && (
            <div className="bg-[#C5A880]/10 border-b border-[#C5A880]/20 px-4 py-2 flex items-center justify-between gap-3 text-xs text-[#FAF7F2]">
              <div className="flex items-center gap-2 text-[11px]">
                <Zap className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span>
                  {isHi
                    ? '10-सेकंड लॉगिन: सहेजे गए पते और लाइव स्टेटस ट्रैकिंग का उपयोग करें।'
                    : 'Quick 10-second login: auto-fill addresses & track live order progress!'}
                </span>
              </div>
              <button
                type="button"
                onClick={openAuthModal}
                className="px-2.5 py-1 bg-[#C5A880] hover:bg-[#d8bf9a] text-[#12110F] text-[10px] font-bold rounded uppercase tracking-wider whitespace-nowrap"
              >
                {isHi ? 'लॉगिन' : 'Login'}
              </button>
            </div>
          )}

          {/* Modal Scrollable Body */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
            {/* STEP 1: SERVICE TYPE & LOCATION */}
            {step === 1 && (
              <div className="space-y-5">
                {/* 3 Service Types */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C5A880] mb-2 font-semibold">
                    {isHi ? 'सेवा चुनें' : 'Choose Dining / Ordering Service'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* 1. Online Delivery (Like Zomato) */}
                    <button
                      type="button"
                      onClick={() => setOrderType('delivery')}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        orderType === 'delivery'
                          ? 'bg-[#C5A880]/20 border-[#C5A880] text-white shadow-md'
                          : 'bg-[#1C1A17] border-white/10 text-white/70 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <Bike className="w-5 h-5 text-amber-400" />
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold uppercase">
                          0% Fee
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">🛵 Online Delivery</div>
                        <div className="text-[11px] text-white/60 mt-0.5">
                          {currentZone.etaMinutes} in Indore
                        </div>
                      </div>
                    </button>

                    {/* 2. Dine-In Table Pre-Reservation (Leverage 2: 50% split) */}
                    <button
                      type="button"
                      onClick={() => setOrderType('dine-in')}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        orderType === 'dine-in'
                          ? 'bg-[#C5A880]/20 border-[#C5A880] text-white shadow-md'
                          : 'bg-[#1C1A17] border-white/10 text-white/70 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <Utensils className="w-5 h-5 text-purple-400" />
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold uppercase">
                          Pay 50%
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">🍽️ Table Pre-Reservation</div>
                        <div className="text-[11px] text-white/60 mt-0.5">
                          Food Pre-Order + Lock Table
                        </div>
                      </div>
                    </button>

                    {/* 3. Takeaway Counter Pickup */}
                    <button
                      type="button"
                      onClick={() => setOrderType('takeaway')}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        orderType === 'takeaway'
                          ? 'bg-[#C5A880]/20 border-[#C5A880] text-white shadow-md'
                          : 'bg-[#1C1A17] border-white/10 text-white/70 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <ShoppingBag className="w-5 h-5 text-blue-400" />
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold uppercase">
                          Quick
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">🥡 Takeaway Pickup</div>
                        <div className="text-[11px] text-white/60 mt-0.5">
                          Ready in 20-25 mins
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* LEVERAGE 1 BENEFIT CALLOUT (For Delivery) */}
                {orderType === 'delivery' && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-3">
                    <Percent className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                        Direct Order Advantage • Save Aggregator Commission
                      </h4>
                      <p className="text-[11px] text-white/80 mt-0.5 leading-relaxed">
                        Third-party apps (Zomato/Swiggy) charge 25-30% platform commissions. By ordering directly on our website, you get genuine kitchen rates, saving approx. <strong>₹{commissionSavings}</strong>, plus complimentary roasted masala papad and mint chutney!
                      </p>
                    </div>
                  </div>
                )}

                {/* LEVERAGE 2 BENEFIT CALLOUT (For Table Pre-Reservation) */}
                {orderType === 'dine-in' && (
                  <div className="p-3.5 rounded-xl bg-[#2A231A] border border-[#C5A880]/50 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[#C5A880] uppercase tracking-wider">
                        Pre-Reservation Split Payment (50% Now, 50% After Service)
                      </h4>
                      <p className="text-[11px] text-white/80 mt-0.5 leading-relaxed">
                        Select your dishes in advance so our royal kitchen has them piping-hot upon your arrival. Pay only <strong>50% advance deposit</strong> now to confirm your royal table. Pay the remaining 50% comfortably after enjoying your meal!
                      </p>
                    </div>
                  </div>
                )}

                {/* CONDITIONAL DETAILS */}
                {orderType === 'delivery' && (
                  <div className="space-y-3.5 p-4 rounded-xl bg-black/40 border border-white/10">
                    <div className="flex items-center justify-between">
                      <label className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Delivery Location &amp; Address (Indore)</span>
                      </label>

                      {/* Saved addresses shortcut */}
                      {user?.savedAddresses && user.savedAddresses.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          {user.savedAddresses.map((addr) => (
                            <button
                              key={addr.id}
                              type="button"
                              onClick={() => {
                                setFlat(addr.flat);
                                setStreet(addr.street);
                                setLandmark(addr.landmark || '');
                                setSelectedArea(addr.area);
                              }}
                              className="px-2 py-0.5 rounded bg-white/10 hover:bg-[#C5A880] hover:text-black text-[10px] font-semibold text-white/80 transition-colors uppercase"
                            >
                              {addr.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Area Selector */}
                    <div>
                      <label className="block text-[11px] text-white/60 mb-1">
                        Select Delivery Locality in Indore *
                      </label>
                      <select
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                        className="w-full bg-[#1C1A17] border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                      >
                        {INDORE_DELIVERY_ZONES.map((zone) => (
                          <option key={zone.name} value={zone.name}>
                            {zone.name} ({zone.distanceKm} km • Est: {zone.etaMinutes})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* ETA & Distance indicator badge */}
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#181614] border border-white/10 text-xs text-white/80">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#C5A880]" />
                        <span>
                          Estimated Delivery: <strong>{currentZone.etaMinutes}</strong>
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-medium">
                        {deliveryFee === 0
                          ? '✓ Free Delivery'
                          : `Delivery Fee: ₹${deliveryFee} (Free above ₹${currentZone.minOrderFreeDelivery})`}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-white/60 mb-1">
                          Flat / House No. / Building *
                        </label>
                        <input
                          type="text"
                          required
                          value={flat}
                          placeholder="e.g. Flat 302, Royal Palms"
                          onChange={(e) => setFlat(e.target.value)}
                          className="w-full bg-[#1C1A17] border border-white/15 rounded px-3 py-2 text-xs text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-white/60 mb-1">
                          Street / Society / Colony Road *
                        </label>
                        <input
                          type="text"
                          required
                          value={street}
                          placeholder="e.g. Bypass Road / Lane 4"
                          onChange={(e) => setStreet(e.target.value)}
                          className="w-full bg-[#1C1A17] border border-white/15 rounded px-3 py-2 text-xs text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-white/60 mb-1">
                        Landmark / Nearest Point (Optional)
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        placeholder="e.g. Opposite Bharat Benz Showroom or DPS"
                        onChange={(e) => setLandmark(e.target.value)}
                        className="w-full bg-[#1C1A17] border border-white/15 rounded px-3 py-2 text-xs text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* DINE-IN TABLE DETAILS */}
                {orderType === 'dine-in' && (
                  <div className="space-y-3.5 p-4 rounded-xl bg-black/40 border border-white/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#C5A880] mb-1 font-medium">
                          Dining Date *
                        </label>
                        <input
                          type="date"
                          value={date}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-[#1C1A17] border border-white/15 rounded px-3 py-2 text-xs text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#C5A880] mb-1 font-medium">
                          Arrival Time Slot *
                        </label>
                        <select
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full bg-[#1C1A17] border border-white/15 rounded px-3 py-2 text-xs text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                        >
                          <option value="12:30">12:30 PM (Lunch)</option>
                          <option value="13:30">01:30 PM (Lunch)</option>
                          <option value="19:30">07:30 PM (Dinner)</option>
                          <option value="20:00">08:00 PM (Peak Dinner)</option>
                          <option value="20:30">08:30 PM (Peak Dinner)</option>
                          <option value="21:00">09:00 PM (Dinner)</option>
                          <option value="21:30">09:30 PM (Late Dinner)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#C5A880] mb-1 font-medium">
                          Number of Guests
                        </label>
                        <div className="flex items-center gap-1.5">
                          {[2, 4, 6, 8, 12].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setGuests(num)}
                              className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors ${
                                guests === num
                                  ? 'bg-[#C5A880] text-[#12110F]'
                                  : 'bg-[#1C1A17] text-[#FAF7F2]/80 border border-white/10'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#C5A880] mb-1 font-medium">
                          Seating Ambience
                        </label>
                        <select
                          value={seatingArea}
                          onChange={(e) => setSeatingArea(e.target.value)}
                          className="w-full bg-[#1C1A17] border border-white/15 rounded px-3 py-2 text-xs text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                        >
                          <option value="Garden Lawn">Lush Open-Air Garden Lawn</option>
                          <option value="Poolside Deck">Poolside Candlelit Table</option>
                          <option value="AC Royal Banquet">Air-Conditioned Royal Hall</option>
                          <option value="Private Cabana">Private Dining Gazebo / Cabana</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAKEAWAY DETAILS */}
                {orderType === 'takeaway' && (
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                    <label className="block text-xs uppercase tracking-wider text-[#C5A880] font-medium">
                      Pickup Slot (Today)
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-[#1C1A17] border border-white/15 rounded px-3 py-2 text-xs text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                    >
                      <option value="Fastest Prep: Ready in 20 Mins">Fastest Prep: Ready in 20-25 Mins</option>
                      <option value="Ready in 40 Mins">In 40 Mins</option>
                      <option value="Evening 07:30 PM">Evening 07:30 PM</option>
                      <option value="Evening 08:30 PM">Evening 08:30 PM</option>
                    </select>
                    <p className="text-[11px] text-white/60">
                      Pick up directly from our express counter at Panjtara Pure Veg, Indore Bypass.
                    </p>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#C5A880] text-[#12110F] font-semibold text-xs uppercase tracking-widest rounded-lg hover:bg-[#dfcaab] transition-colors shadow-md"
                  >
                    <span>{isHi ? 'व्यंजन चुनें / समीक्षा करें' : 'Proceed to Curate Dishes'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: DISHES SELECTION & QUANTITY */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#FAF7F2]/80 font-medium">
                    {isHi ? 'ऑर्डर में शामिल व्यंजन' : 'Dishes in Your Order'}
                  </span>
                  <span className="text-xs text-[#C5A880] font-mono font-bold">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'} • ₹{totalAmount}
                  </span>
                </div>

                {/* Currently selected items */}
                {cartItems.length === 0 ? (
                  <div className="p-6 rounded-xl bg-[#181614] border border-white/10 text-center space-y-2">
                    <p className="text-xs text-white/60">Your cart is currently empty.</p>
                    <p className="text-[11px] text-[#C5A880]">Select from the recommended delicacies below!</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-[#1C1A17] border border-white/10 flex items-center justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-editorial-serif text-sm sm:text-base text-[#FAF7F2] truncate font-medium">
                            {item.name}
                          </h4>
                          <span className="text-xs font-mono text-[#C5A880] font-semibold block mt-0.5">
                            ₹{item.price} each (₹{item.price * item.quantity})
                          </span>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center gap-2 bg-[#12110F] border border-white/15 rounded-lg p-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            aria-label={`Decrease ${item.name}`}
                            className="w-7 h-7 flex items-center justify-center rounded text-white/70 hover:text-white hover:bg-white/10"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-xs font-bold w-5 text-center text-[#FAF7F2]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            aria-label={`Increase ${item.name}`}
                            className="w-7 h-7 flex items-center justify-center rounded text-[#C5A880] hover:text-white hover:bg-white/10"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick-add more items section */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <span className="text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold block">
                    + Add More Panjtara Specialties:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                    {QUICK_ADD_DISHES.map((dish) => {
                      const inCart = cartItems.find((ci) => ci.id === dish.id);
                      return (
                        <div
                          key={dish.id}
                          className="p-2.5 rounded-lg bg-[#181614] border border-white/5 flex items-center justify-between gap-2 hover:border-white/20 transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-xs text-white font-medium truncate">{dish.name}</div>
                            <div className="text-[10px] text-[#C5A880] font-mono">{dish.price}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => addItem(dish, 1)}
                            className="px-2.5 py-1 bg-[#28241F] hover:bg-[#C5A880] hover:text-black text-[#C5A880] text-[10px] uppercase font-bold rounded transition-colors flex items-center gap-1 shrink-0"
                          >
                            <Plus className="w-3 h-3" />
                            <span>{inCart ? `${inCart.quantity} in cart` : 'Add'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Price Summary Breakdown */}
                <div className="p-3.5 rounded-xl bg-[#1A1815] border border-[#C5A880]/30 space-y-1.5 text-xs text-[#FAF7F2]">
                  <div className="flex items-center justify-between">
                    <span>Food Items Subtotal:</span>
                    <span className="font-mono font-semibold">₹{totalAmount}</span>
                  </div>

                  {orderType === 'delivery' && (
                    <div className="flex items-center justify-between text-white/70">
                      <span>Delivery Fee ({selectedArea}):</span>
                      <span className="font-mono text-emerald-400">
                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                      </span>
                    </div>
                  )}

                  {/* Leverage 1 indicator */}
                  {orderType === 'delivery' && (
                    <div className="flex items-center justify-between text-emerald-400 border-t border-white/10 pt-1.5 text-[11px]">
                      <span>⚡ Commission Saved (Direct Kitchen):</span>
                      <span className="font-mono font-bold">~₹{commissionSavings}</span>
                    </div>
                  )}

                  {/* Leverage 2 indicator */}
                  {orderType === 'dine-in' ? (
                    <div className="border-t border-white/10 pt-2 space-y-1">
                      <div className="flex items-center justify-between text-sm text-[#C5A880] font-bold">
                        <span>50% Advance Table Lock (Pay Now):</span>
                        <span className="font-mono">₹{advanceDeposit}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-white/60">
                        <span>50% Remaining (Pay After Dine-In Service):</span>
                        <span className="font-mono">₹{remainingBalance}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-sm text-[#C5A880] font-bold border-t border-white/10 pt-1.5">
                      <span>Total Payable Now:</span>
                      <span className="font-mono">₹{totalAmount + deliveryFee}</span>
                    </div>
                  )}
                </div>

                {/* Back / Next */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1 text-xs text-[#FAF7F2]/70 hover:text-[#C5A880]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Details</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={cartItems.length === 0}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C5A880] text-[#12110F] font-semibold text-xs uppercase tracking-widest rounded-lg hover:bg-[#dfcaab] disabled:opacity-40 transition-colors shadow-md"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CONTACT & PAYMENT */}
            {step === 3 && (
              <form onSubmit={handleConfirmOrder} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#C5A880] mb-1 font-semibold">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sagar Pawar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#1C1A17] border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#C5A880] mb-1 font-semibold">
                      WhatsApp / Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#1C1A17] border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#C5A880] mb-1 font-semibold">
                    Cooking &amp; Kitchen Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Medium spicy, please pack mint chutney, extra napkins"
                    value={specialDiet}
                    onChange={(e) => setSpecialDiet(e.target.value)}
                    className="w-full bg-[#1C1A17] border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                  />
                </div>

                <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#1C1A17] border border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isJain}
                    onChange={(e) => setIsJain(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C5A880] focus:ring-[#C5A880] bg-[#12110F] border-white/20"
                  />
                  <span className="text-xs text-[#FAF7F2]">
                    Prepare strictly <strong>Jain (Satvik)</strong> — No onion, garlic, or root vegetables.
                  </span>
                </label>

                {/* Payment method selector */}
                <div className="space-y-2 pt-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold">
                    Select Payment Mode
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Instant UPI */}
                    <div
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-2.5 ${
                        paymentMethod === 'upi'
                          ? 'bg-[#C5A880]/20 border-[#C5A880] text-white shadow-sm'
                          : 'bg-[#1C1A17] border-white/10 text-white/70 hover:border-white/25'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-white">Instant UPI (GPay/PhonePe)</div>
                        <div className="text-[10px] text-white/50">Zero fees &amp; instant token generation</div>
                      </div>
                    </div>

                    {/* Razorpay Gateway */}
                    <div
                      onClick={() => setPaymentMethod('razorpay')}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-2.5 ${
                        paymentMethod === 'razorpay'
                          ? 'bg-[#C5A880]/20 border-[#C5A880] text-white shadow-sm'
                          : 'bg-[#1C1A17] border-white/10 text-white/70 hover:border-white/25'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-white">Cards &amp; NetBanking</div>
                        <div className="text-[10px] text-white/50">Visa, Mastercard, RuPay &amp; NetBanking</div>
                      </div>
                    </div>

                    {/* Cash on Delivery or Counter Pay */}
                    <div
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-2.5 ${
                        paymentMethod === 'cod'
                          ? 'bg-[#C5A880]/20 border-[#C5A880] text-white shadow-sm'
                          : 'bg-[#1C1A17] border-white/10 text-white/70 hover:border-white/25'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-white">
                          {orderType === 'dine-in' ? 'Pay at Table' : 'Cash / UPI on Delivery'}
                        </div>
                        <div className="text-[10px] text-white/50">Pay to rider upon delivery arrival</div>
                      </div>
                    </div>

                    {/* WhatsApp Pay Link */}
                    <div
                      onClick={() => setPaymentMethod('whatsapp_pay')}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-2.5 ${
                        paymentMethod === 'whatsapp_pay'
                          ? 'bg-[#C5A880]/20 border-[#C5A880] text-white shadow-sm'
                          : 'bg-[#1C1A17] border-white/10 text-white/70 hover:border-white/25'
                      }`}
                    >
                      <Phone className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-white">WhatsApp Pay Link</div>
                        <div className="text-[10px] text-white/50">Receive payment link on WhatsApp</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Callout for 50% split if dine-in */}
                {orderType === 'dine-in' && (
                  <div className="p-3 rounded-lg bg-[#27221A] border border-[#C5A880]/40 text-xs text-white/90">
                    <div className="flex justify-between font-semibold">
                      <span>Deposit Payable Now (50%):</span>
                      <span className="text-[#C5A880] font-mono font-bold">₹{advanceDeposit}</span>
                    </div>
                    <div className="text-[11px] text-white/60 mt-1">
                      Remaining ₹{remainingBalance} will be billed at your table after your meal service.
                    </div>
                  </div>
                )}

                {/* Submit & Back buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-1 text-xs text-[#FAF7F2]/70 hover:text-[#C5A880]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Dishes</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#C5A880] hover:bg-[#dfcaab] text-[#12110F] font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-lg active:scale-98 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Submitting Order...</span>
                    ) : (
                      <>
                        <span>
                          {orderType === 'dine-in'
                            ? `Confirm & Pay ₹${advanceDeposit} Advance`
                            : `Place Online Order (₹${finalPayable})`}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: AUTHENTIC FEEDBACK & CONFIRMATION */}
            {step === 4 && (
              <div className="py-4 text-center space-y-4">
                {/* Audio success feedback checkmark */}
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl animate-pulse">
                  <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                </div>

                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold block">
                    {orderType === 'delivery'
                      ? 'Order Dispatched to Panjtara Kitchen'
                      : orderType === 'dine-in'
                      ? 'Table Pre-Reservation Confirmed!'
                      : 'Takeaway Order Received'}
                  </span>
                  <h3 className="font-editorial-serif text-2xl sm:text-3xl text-white font-medium mt-1">
                    {orderType === 'delivery' ? 'Your Feast is on Its Way!' : 'We Look Forward to Welcoming You'}
                  </h3>
                  <p className="text-xs text-white/70 max-w-md mx-auto mt-1">
                    {orderType === 'delivery'
                      ? `Your order has reached our master chefs. Direct kitchen delivery estimated in ${currentZone.etaMinutes} to ${selectedArea}.`
                      : `Your table for ${guests} guests on ${date} at ${time} is secured. Fresh preparations will commence right before your arrival!`}
                  </p>
                </div>

                {/* Token Box */}
                <div className="p-4 rounded-xl bg-[#1C1A17] border border-[#C5A880]/40 max-w-sm mx-auto space-y-2">
                  <div className="text-[10px] uppercase tracking-widest text-white/50">
                    Official Reference Token
                  </div>
                  <div className="text-xl font-mono font-bold text-[#C5A880] tracking-wider">
                    {bookingRef}
                  </div>
                  <div className="text-[11px] text-white/60">
                    {orderType === 'dine-in'
                      ? `50% Advance (₹${advanceDeposit}) Recorded • Balance (₹${remainingBalance}) due after service`
                      : `Total Bill: ₹${totalAmount + deliveryFee} • 0% Commission Saved: ₹${commissionSavings}`}
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2">
                  {/* WhatsApp instant receipt */}
                  <a
                    href={getWhatsAppOrderUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <Phone className="w-4 h-4" />
                    <span>WhatsApp Order Slip</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* Live order tracking button */}
                  {onOpenOrdersTracking && (
                    <button
                      type="button"
                      onClick={onOpenOrdersTracking}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#C5A880] hover:bg-[#dfcaab] text-[#12110F] font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                      <Bike className="w-4 h-4" />
                      <span>Track Live Order (5 Stages)</span>
                    </button>
                  )}
                </div>

                {/* Sub actions */}
                <div className="flex items-center justify-center gap-4 text-xs pt-1">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="text-white/60 hover:text-white flex items-center gap-1"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Receipt Copied!' : 'Copy Summary'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[#C5A880] hover:underline uppercase tracking-wider text-[11px]"
                  >
                    Done / Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
