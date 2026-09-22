import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Phone,
  ShieldCheck,
  User,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  LogOut,
  ShoppingBag,
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface CustomerAuthModalProps {
  onViewOrders?: () => void;
}

export function CustomerAuthModal({ onViewOrders }: CustomerAuthModalProps) {
  const {
    user,
    isAuthenticated,
    isAuthModalOpen,
    closeAuthModal,
    sendOtp,
    verifyOtp,
    quickDemoLogin,
    logout,
    addAddress,
    removeAddress,
  } = useCustomerAuth();

  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address form
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    label: 'Home' as 'Home' | 'Work' | 'Other',
    flat: '',
    street: '',
    landmark: '',
    area: 'Bicholi Mardana / Indore Bypass',
    city: 'Indore',
    pincode: '452016',
    isDefault: true,
  });

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phone || phone.replace(/[^0-9]/g, '').length < 10) {
      setError(isHi ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    setIsSubmitting(true);
    const res = await sendOtp(phone);
    setIsSubmitting(false);

    if (res.success) {
      setDevOtpHint(res.devOtp || '1234');
      setStep('otp');
    } else {
      setError(res.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!otp || otp.length < 4) {
      setError(isHi ? 'कृपया 4 अंकों का OTP दर्ज करें' : 'Please enter the 4-digit OTP');
      return;
    }
    setIsSubmitting(true);
    const res = await verifyOtp(phone, otp, name);
    setIsSubmitting(false);

    if (res.success) {
      setStep('phone');
      setOtp('');
      setDevOtpHint(null);
    } else {
      setError(res.error || 'Invalid OTP');
    }
  };

  const handleQuickDemo = async () => {
    setIsSubmitting(true);
    setError(null);
    await quickDemoLogin();
    setIsSubmitting(false);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.flat || !newAddr.street) {
      setError(isHi ? 'कृपया फ्लैट और सड़क का पता दर्ज करें' : 'Please fill flat and street details');
      return;
    }
    setIsSubmitting(true);
    const ok = await addAddress(newAddr);
    setIsSubmitting(false);
    if (ok) {
      setShowAddAddress(false);
      setNewAddr({
        label: 'Home',
        flat: '',
        street: '',
        landmark: '',
        area: 'Bicholi Mardana / Indore Bypass',
        city: 'Indore',
        pincode: '452016',
        isDefault: false,
      });
    } else {
      setError('Failed to save address');
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 overflow-y-auto bg-black/75 backdrop-blur-sm p-4">
        {/* Backdrop click */}
        <div className="fixed inset-0" onClick={closeAuthModal} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#161412] text-[#FAF7F2] rounded-2xl border border-[#C5A880]/30 shadow-2xl overflow-hidden z-10"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#221E19] to-[#161412] p-6 border-b border-[#C5A880]/20 flex items-start justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#C5A880]/20 text-[#C5A880] text-[10px] font-mono tracking-wider uppercase">
                <Sparkles className="w-3 h-3" />
                <span>Panjtara Express • Indore</span>
              </div>
              <h2 className="font-editorial-serif text-2xl text-[#FAF7F2]">
                {isAuthenticated
                  ? isHi ? 'आपका प्रोफ़ाइल एवं पते' : 'Your Account & Addresses'
                  : step === 'phone'
                  ? isHi ? 'लॉगिन / साइन-अप' : 'Express Login / Sign Up'
                  : isHi ? 'OTP सत्यापन' : 'Verify One-Time Password'}
              </h2>
              <p className="text-xs text-[#A89F91]">
                {isAuthenticated
                  ? isHi ? 'डिलीवरी पते और पिछले ऑर्डर प्रबंधित करें' : 'Manage delivery addresses & instant orders'
                  : isHi ? 'तेज़ ऑर्डर और डिलीवरी के लिए मोबाइल नंबर दर्ज करें' : 'Enter mobile for 10-minute order dispatch & live tracking'}
              </p>
            </div>

            <button
              onClick={closeAuthModal}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[#FAF7F2]/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {error && (
              <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-lg text-red-200 text-xs flex items-center gap-2">
                <span>⚠️ {error}</span>
              </div>
            )}

            {/* 1. If Logged in -> Profile & Addresses View */}
            {isAuthenticated && user ? (
              <div className="space-y-6">
                {/* User card */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880] font-editorial-serif text-lg font-bold">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-[#FAF7F2]">{user.name}</h3>
                      <p className="text-xs text-[#A89F91] font-mono">+91 {user.phone}</p>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 hover:bg-red-500/10 text-red-400 text-xs transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isHi ? 'लॉगआउट' : 'Logout'}</span>
                  </button>
                </div>

                {/* View Orders CTA */}
                {onViewOrders && (
                  <button
                    onClick={() => {
                      closeAuthModal();
                      onViewOrders();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#2A241E] hover:bg-[#383129] border border-[#C5A880]/30 text-[#C5A880] text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isHi ? 'मेरे पिछले ऑर्डर्स देखें' : 'View My Past Orders & Tracking'}</span>
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {/* Saved Delivery Addresses */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C5A880] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{isHi ? 'सहेजे गए पते' : 'Saved Delivery Addresses'}</span>
                    </h4>
                    <button
                      onClick={() => setShowAddAddress(!showAddAddress)}
                      className="text-xs text-[#C5A880] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isHi ? 'नया पता जोड़ें' : 'Add New'}</span>
                    </button>
                  </div>

                  {/* Add address form */}
                  {showAddAddress && (
                    <form onSubmit={handleSaveAddress} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex gap-2">
                        {(['Home', 'Work', 'Other'] as const).map((lbl) => (
                          <button
                            key={lbl}
                            type="button"
                            onClick={() => setNewAddr({ ...newAddr, label: lbl })}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              newAddr.label === lbl
                                ? 'bg-[#C5A880] text-black'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            {lbl}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="House / Flat / Floor No."
                        value={newAddr.flat}
                        onChange={(e) => setNewAddr({ ...newAddr, flat: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Street / Society / Building Name"
                        value={newAddr.street}
                        onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Landmark (Optional)"
                        value={newAddr.landmark}
                        onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={newAddr.area}
                          onChange={(e) => setNewAddr({ ...newAddr, area: e.target.value })}
                          className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                        />
                        <input
                          type="text"
                          value={newAddr.pincode}
                          onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                          className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowAddAddress(false)}
                          className="px-3 py-1.5 text-xs text-white/60 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-1.5 bg-[#C5A880] text-black text-xs font-medium rounded-lg hover:bg-[#d8bf9a]"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List of addresses */}
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {user.addresses && user.addresses.length > 0 ? (
                      user.addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-start justify-between text-xs"
                        >
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 rounded bg-[#C5A880]/20 text-[#C5A880] font-mono text-[10px] uppercase">
                              {addr.label}
                            </span>
                            <p className="text-white/90">
                              {addr.flat}, {addr.street}
                            </p>
                            <p className="text-white/60 text-[11px]">
                              {addr.landmark ? `${addr.landmark}, ` : ''}
                              {addr.area}, {addr.city} - {addr.pincode}
                            </p>
                          </div>
                          <button
                            onClick={() => removeAddress(addr.id)}
                            className="p-1 text-white/40 hover:text-red-400 transition-colors"
                            title="Delete address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-white/50 italic text-center py-3">
                        {isHi ? 'कोई पता सहेजा नहीं गया है' : 'No addresses saved yet'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : step === 'phone' ? (
              /* 2. Step 1: Phone input */
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/80">
                    {isHi ? 'आपका पूरा नाम (वैकल्पिक)' : 'Your Name (Optional)'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      placeholder="e.g. Sagar Pawar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/80">
                    {isHi ? 'मोबाइल नंबर *' : '10-Digit Mobile Number *'}
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center gap-1.5 pointer-events-none">
                      <span className="text-xs text-[#C5A880] font-mono font-medium">+91</span>
                      <span className="h-4 w-[1px] bg-white/20" />
                    </div>
                    <input
                      type="tel"
                      placeholder="95220 10107"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full bg-black/40 border border-white/15 rounded-xl pl-16 pr-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#C5A880]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || phone.length < 10}
                  className="w-full py-3 bg-[#C5A880] hover:bg-[#d8bf9a] disabled:opacity-50 text-black text-xs uppercase tracking-widest font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  {isSubmitting ? (
                    <span>Sending OTP...</span>
                  ) : (
                    <>
                      <span>{isHi ? 'OTP प्राप्त करें' : 'Continue with OTP'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Zepto style 1-tap quick demo */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="text-center">
                    <span className="text-[11px] text-white/50 uppercase tracking-widest">
                      {isHi ? 'या 1-क्लिक में तुरंत आज़माएं' : 'Or Instant 1-Click Demo'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickDemo}
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-[#C5A880]/30 rounded-xl text-xs text-[#FAF7F2] font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>{isHi ? 'त्वरित डेमो लॉगिन (Sagar Pawar)' : 'Instant Demo Login (Sagar Pawar)'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* 3. Step 2: OTP verification */
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center space-y-1">
                  <p className="text-xs text-white/70">
                    {isHi ? 'OTP भेजा गया:' : 'OTP sent to'} <span className="font-mono text-[#C5A880]">+91 {phone}</span>
                  </p>
                  {devOtpHint && (
                    <div className="inline-block px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
                      ✨ Demo Hint: Enter OTP <strong className="text-white underline">{devOtpHint}</strong>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/80 block text-center">
                    {isHi ? '4-अंकीय OTP दर्ज करें' : 'Enter 4-Digit OTP'}
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="1 2 3 4"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-black/40 border border-white/20 rounded-xl py-3 text-center text-lg tracking-[0.5em] font-mono text-white focus:outline-none focus:border-[#C5A880]"
                    autoFocus
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="w-1/3 py-2.5 bg-white/5 hover:bg-white/10 text-xs text-white/70 rounded-xl transition-colors"
                  >
                    {isHi ? 'बदलें' : 'Change No.'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || otp.length < 4}
                    className="w-2/3 py-2.5 bg-[#C5A880] hover:bg-[#d8bf9a] disabled:opacity-50 text-black text-xs uppercase tracking-widest font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <span>Verifying...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>{isHi ? 'सत्यापित करें' : 'Verify & Enter'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
