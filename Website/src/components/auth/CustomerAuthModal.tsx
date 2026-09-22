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
  ArrowRight,
  Sparkles,
  LogOut,
  ShoppingBag,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
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
    signup,
    login,
    sendOtp,
    verifyOtp,
    quickDemoLogin,
    logout,
    addAddress,
    removeAddress,
  } = useCustomerAuth();

  const { language } = useLanguage();
  const isHi = language === 'hi';

  // Active view: 'login' | 'signup' | 'otp'
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'otp'>('login');

  // Sign Up Form State
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  // Login Form State
  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: '',
  });

  // OTP Fallback Form State
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  // Common UI State
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address form (for authenticated users)
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

  // Reset errors when switching modes
  const handleSwitchMode = (mode: 'login' | 'signup' | 'otp') => {
    setError(null);
    setSuccessMsg(null);
    setAuthMode(mode);
  };

  // Handle Signup Submit
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!signupForm.name.trim() || signupForm.name.trim().length < 2) {
      setError(isHi ? 'कृपया अपना पूरा नाम दर्ज करें' : 'Please enter your full name (minimum 2 characters).');
      return;
    }

    if (!signupForm.email.trim() || !/^\S+@\S+\.\S+$/.test(signupForm.email.trim())) {
      setError(isHi ? 'कृपया वैध ईमेल आईडी दर्ज करें' : 'Please enter a valid email address.');
      return;
    }

    const cleanPhone = signupForm.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError(isHi ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (signupForm.password.length < 6) {
      setError(isHi ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए' : 'Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const res = await signup({
      name: signupForm.name.trim(),
      email: signupForm.email.trim(),
      phone: cleanPhone,
      password: signupForm.password,
    });
    setIsSubmitting(false);

    if (!res.success) {
      setError(res.error || 'Failed to create account.');
    } else {
      setSuccessMsg(isHi ? 'खाता सफलतापूर्वक बनाया गया!' : 'Account created successfully!');
    }
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!loginForm.identifier.trim()) {
      setError(isHi ? 'कृपया अपना ईमेल या मोबाइल नंबर दर्ज करें' : 'Please enter your email or mobile number.');
      return;
    }

    if (!loginForm.password) {
      setError(isHi ? 'कृपया अपना पासवर्ड दर्ज करें' : 'Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    const res = await login({
      identifier: loginForm.identifier.trim(),
      password: loginForm.password,
    });
    setIsSubmitting(false);

    if (!res.success) {
      setError(res.error || 'Failed to log in. Please check your credentials.');
    }
  };

  // Handle OTP Send
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanPhone = otpPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError(isHi ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setIsSubmitting(true);
    const res = await sendOtp(cleanPhone);
    setIsSubmitting(false);

    if (res.success) {
      setDevOtpHint(res.devOtp || '1234');
      setOtpSent(true);
    } else {
      setError(res.error || 'Failed to send OTP.');
    }
  };

  // Handle OTP Verify
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!otpCode || otpCode.length < 4) {
      setError(isHi ? 'कृपया 4 अंकों का OTP दर्ज करें' : 'Please enter the 4-digit OTP.');
      return;
    }
    setIsSubmitting(true);
    const res = await verifyOtp(otpPhone, otpCode);
    setIsSubmitting(false);

    if (!res.success) {
      setError(res.error || 'Invalid OTP.');
    }
  };

  // Quick Demo Login
  const handleQuickDemo = async () => {
    setIsSubmitting(true);
    setError(null);
    await quickDemoLogin();
    setIsSubmitting(false);
  };

  // Save New Address
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.flat || !newAddr.street) {
      setError(isHi ? 'कृपया फ्लैट और सड़क का पता दर्ज करें' : 'Please fill flat and street details.');
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
      setError('Failed to save address.');
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="customer-auth-modal-overlay"
        className="fixed inset-0 z-[999] flex items-center justify-center px-4 overflow-y-auto bg-black/80 backdrop-blur-md p-4"
      >
        {/* Backdrop click to close */}
        <div className="fixed inset-0" onClick={closeAuthModal} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[#161412] text-[#FAF7F2] rounded-2xl border border-[#C5A880]/30 shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Top Decorative Header */}
          <div className="bg-gradient-to-r from-[#231E18] via-[#1A1815] to-[#141210] p-6 border-b border-[#C5A880]/20 flex items-start justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#C5A880]/20 text-[#C5A880] text-[10px] font-mono tracking-wider uppercase">
                <Sparkles className="w-3 h-3" />
                <span>Panjtara Pure Veg • Indore</span>
              </div>

              <h2 className="font-editorial-serif text-2xl text-[#FAF7F2]">
                {isAuthenticated
                  ? isHi ? 'आपका खाता एवं पते' : 'Your Account & Addresses'
                  : authMode === 'signup'
                  ? isHi ? 'नया खाता बनाएं' : 'Create an Account'
                  : authMode === 'login'
                  ? isHi ? 'लॉगिन करें' : 'Welcome Back'
                  : isHi ? 'मोबाइल OTP लॉगिन' : 'Mobile OTP Verification'}
              </h2>

              <p className="text-xs text-[#A89F91]">
                {isAuthenticated
                  ? isHi ? 'डिलीवरी पते और पिछले ऑर्डर प्रबंधित करें' : 'Manage delivery addresses & instant orders'
                  : authMode === 'signup'
                  ? isHi ? 'ऑर्डर और विशेष छूट के लिए साइन-अप करें' : 'Sign up for instant ordering, table pre-reservation & order history'
                  : isHi ? 'अपने ईमेल/मोबाइल और पासवर्ड से प्रवेश करें' : 'Log in with your credentials to access fast checkout'}
              </p>
            </div>

            <button
              id="customer-auth-close-btn"
              onClick={closeAuthModal}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[#FAF7F2]/70 hover:text-white transition-colors"
              aria-label="Close authentication modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5">
            {/* Feedback Alerts */}
            {error && (
              <div className="p-3 bg-red-950/70 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-center gap-2">
                <span>⚠️ {error}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* VIEW 1: AUTHENTICATED USER (Profile & Addresses) */}
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
                      {user.email && <p className="text-xs text-[#A89F91]">{user.email}</p>}
                      <p className="text-xs text-[#A89F91] font-mono">+91 {user.phone}</p>
                    </div>
                  </div>

                  <button
                    id="customer-logout-btn"
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
                    id="customer-view-past-orders-btn"
                    onClick={() => {
                      closeAuthModal();
                      onViewOrders();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#2A241E] hover:bg-[#383129] border border-[#C5A880]/30 text-[#C5A880] text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors shadow-sm"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isHi ? 'मेरे पिछले ऑर्डर्स व लाइव ट्रैकिंग' : 'View My Past Orders & Live Tracking'}</span>
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {/* Saved Delivery Addresses */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C5A880] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{isHi ? 'सहेजे गए डिलीवरी पते' : 'Saved Delivery Addresses'}</span>
                    </h4>
                    <button
                      id="customer-add-address-toggle-btn"
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
            ) : (
              /* VIEW 2: UNAUTHENTICATED (Login / Signup / OTP) */
              <div className="space-y-5">
                {/* Mode Selector Tabs: [ Log In ] [ Sign Up ] */}
                <div className="grid grid-cols-2 p-1 bg-black/50 border border-[#C5A880]/30 rounded-xl">
                  <button
                    id="auth-tab-login"
                    type="button"
                    onClick={() => handleSwitchMode('login')}
                    className={`py-2 text-xs uppercase tracking-widest font-semibold rounded-lg transition-all ${
                      authMode === 'login'
                        ? 'bg-[#C5A880] text-[#12110F] shadow-sm'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {isHi ? 'लॉगिन' : 'Log In'}
                  </button>

                  <button
                    id="auth-tab-signup"
                    type="button"
                    onClick={() => handleSwitchMode('signup')}
                    className={`py-2 text-xs uppercase tracking-widest font-semibold rounded-lg transition-all ${
                      authMode === 'signup'
                        ? 'bg-[#C5A880] text-[#12110F] shadow-sm'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {isHi ? 'साइन-अप' : 'Sign Up'}
                  </button>
                </div>

                {/* 2A: SIGN UP TAB (Name, Email, Mobile No, Password) */}
                {authMode === 'signup' && (
                  <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                    {/* 1. Full Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-white/80">
                        {isHi ? 'पूरा नाम *' : 'Full Name *'}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-[#C5A880]" />
                        <input
                          id="signup-name-input"
                          type="text"
                          placeholder="e.g. Sagar Pawar"
                          value={signupForm.name}
                          onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                          className="w-full bg-black/40 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] transition-colors"
                          required
                        />
                      </div>
                    </div>

                    {/* 2. Email Address */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-white/80">
                        {isHi ? 'ईमेल पता *' : 'Email Address *'}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-[#C5A880]" />
                        <input
                          id="signup-email-input"
                          type="email"
                          placeholder="sagar@example.com"
                          value={signupForm.email}
                          onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                          className="w-full bg-black/40 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] transition-colors"
                          required
                        />
                      </div>
                    </div>

                    {/* 3. Mobile Number */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-white/80">
                        {isHi ? 'मोबाइल नंबर *' : '10-Digit Mobile Number *'}
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute left-3 flex items-center gap-1.5 pointer-events-none">
                          <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
                          <span className="text-xs text-[#C5A880] font-mono font-medium">+91</span>
                          <span className="h-4 w-[1px] bg-white/20" />
                        </div>
                        <input
                          id="signup-phone-input"
                          type="tel"
                          placeholder="95220 10107"
                          maxLength={10}
                          value={signupForm.phone}
                          onChange={(e) =>
                            setSignupForm({
                              ...signupForm,
                              phone: e.target.value.replace(/[^0-9]/g, ''),
                            })
                          }
                          className="w-full bg-black/40 border border-white/15 rounded-xl pl-20 pr-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#C5A880] transition-colors"
                          required
                        />
                      </div>
                    </div>

                    {/* 4. Password */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-white/80">
                        {isHi ? 'पासवर्ड (कम से कम 6 अक्षर) *' : 'Password (min. 6 characters) *'}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-[#C5A880]" />
                        <input
                          id="signup-password-input"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={signupForm.password}
                          onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                          className="w-full bg-black/40 border border-white/15 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] transition-colors"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-white/40 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      id="signup-submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 mt-2 bg-[#C5A880] hover:bg-[#d8bf9a] disabled:opacity-50 text-black text-xs uppercase tracking-widest font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C5A880]/20"
                    >
                      {isSubmitting ? (
                        <span>Creating Account...</span>
                      ) : (
                        <>
                          <span>{isHi ? 'खाता बनाएं (साइन-अप)' : 'Create Account & Sign In'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* Switch to login prompt */}
                    <div className="text-center pt-2">
                      <p className="text-xs text-white/60">
                        {isHi ? 'पहले से खाता है?' : 'Already have an account?'}{' '}
                        <button
                          type="button"
                          onClick={() => handleSwitchMode('login')}
                          className="text-[#C5A880] font-medium hover:underline ml-1"
                        >
                          {isHi ? 'यहाँ लॉगिन करें' : 'Log In here'}
                        </button>
                      </p>
                    </div>
                  </form>
                )}

                {/* 2B: LOG IN TAB (Email/Phone + Password) */}
                {authMode === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {/* 1. Identifier (Email or Mobile No) */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-white/80">
                        {isHi ? 'ईमेल या 10-अंकीय मोबाइल नंबर *' : 'Email Address or Mobile Number *'}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-[#C5A880]" />
                        <input
                          id="login-identifier-input"
                          type="text"
                          placeholder="sagar@example.com or 9522010107"
                          value={loginForm.identifier}
                          onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                          className="w-full bg-black/40 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] transition-colors"
                          required
                        />
                      </div>
                    </div>

                    {/* 2. Password */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-white/80">
                          {isHi ? 'पासवर्ड *' : 'Password *'}
                        </label>
                        <button
                          type="button"
                          onClick={() => handleSwitchMode('otp')}
                          className="text-[11px] text-[#C5A880] hover:underline"
                        >
                          {isHi ? 'पासवर्ड भूल गए? OTP से लॉगिन करें' : 'Forgot? Log in with OTP'}
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-[#C5A880]" />
                        <input
                          id="login-password-input"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          className="w-full bg-black/40 border border-white/15 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] transition-colors"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-white/40 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      id="login-submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-[#C5A880] hover:bg-[#d8bf9a] disabled:opacity-50 text-black text-xs uppercase tracking-widest font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C5A880]/20"
                    >
                      {isSubmitting ? (
                        <span>Logging in...</span>
                      ) : (
                        <>
                          <span>{isHi ? 'लॉगिन करें' : 'Sign In to Account'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* Switch to Signup */}
                    <div className="text-center pt-1">
                      <p className="text-xs text-white/60">
                        {isHi ? 'खाता नहीं है?' : "Don't have an account?"}{' '}
                        <button
                          type="button"
                          onClick={() => handleSwitchMode('signup')}
                          className="text-[#C5A880] font-medium hover:underline ml-1"
                        >
                          {isHi ? 'नया खाता बनाएं (Sign Up)' : 'Create One (Sign Up)'}
                        </button>
                      </p>
                    </div>

                    {/* Alternative Quick OTP & Demo */}
                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleSwitchMode('otp')}
                          className="w-1/2 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-white/80 font-medium flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
                          <span>{isHi ? 'मोबाइल OTP' : 'Mobile OTP'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleQuickDemo}
                          disabled={isSubmitting}
                          className="w-1/2 py-2 px-3 bg-white/5 hover:bg-white/10 border border-[#C5A880]/30 rounded-xl text-xs text-[#FAF7F2] font-medium flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                          <span>{isHi ? '1-क्लिक डेमो' : '1-Click Demo'}</span>
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* 2C: OTP BACKUP TAB */}
                {authMode === 'otp' && (
                  <div className="space-y-4">
                    {!otpSent ? (
                      <form onSubmit={handleSendOtp} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-white/80">
                            {isHi ? '10-अंकीय मोबाइल नंबर *' : '10-Digit Mobile Number *'}
                          </label>
                          <div className="relative flex items-center">
                            <div className="absolute left-3 flex items-center gap-1.5 pointer-events-none">
                              <span className="text-xs text-[#C5A880] font-mono font-medium">+91</span>
                              <span className="h-4 w-[1px] bg-white/20" />
                            </div>
                            <input
                              id="otp-phone-input"
                              type="tel"
                              placeholder="95220 10107"
                              maxLength={10}
                              value={otpPhone}
                              onChange={(e) => setOtpPhone(e.target.value.replace(/[^0-9]/g, ''))}
                              className="w-full bg-black/40 border border-white/15 rounded-xl pl-16 pr-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#C5A880]"
                              required
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting || otpPhone.length < 10}
                          className="w-full py-3 bg-[#C5A880] hover:bg-[#d8bf9a] disabled:opacity-50 text-black text-xs uppercase tracking-widest font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                          {isSubmitting ? (
                            <span>Sending OTP...</span>
                          ) : (
                            <>
                              <span>{isHi ? 'OTP प्राप्त करें' : 'Send OTP'}</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>

                        <div className="text-center pt-1">
                          <button
                            type="button"
                            onClick={() => handleSwitchMode('login')}
                            className="text-xs text-[#C5A880] hover:underline"
                          >
                            {isHi ? '← पासवर्ड से लॉगिन पर वापस जाएं' : '← Back to Email / Password Login'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="text-center space-y-1">
                          <p className="text-xs text-white/70">
                            {isHi ? 'OTP भेजा गया:' : 'OTP sent to'}{' '}
                            <span className="font-mono text-[#C5A880]">+91 {otpPhone}</span>
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
                            id="otp-code-input"
                            type="text"
                            maxLength={4}
                            placeholder="1 2 3 4"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full bg-black/40 border border-white/20 rounded-xl py-3 text-center text-lg tracking-[0.5em] font-mono text-white focus:outline-none focus:border-[#C5A880]"
                            autoFocus
                            required
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setOtpSent(false)}
                            className="w-1/3 py-2.5 bg-white/5 hover:bg-white/10 text-xs text-white/70 rounded-xl transition-colors"
                          >
                            {isHi ? 'बदलें' : 'Change No.'}
                          </button>
                          <button
                            id="otp-verify-submit-btn"
                            type="submit"
                            disabled={isSubmitting || otpCode.length < 4}
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
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
