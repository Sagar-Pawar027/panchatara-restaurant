import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext.tsx';
import { Lock, Mail, Key, ShieldCheck, AlertCircle, Sparkles, ArrowRight, Utensils } from 'lucide-react';

export function AdminLoginPage() {
  const { user, loginWithEmail, loginWithGoogle, loginDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('admin@panjtara.com');
  const [password, setPassword] = useState('panjtara2026');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard
  if (user) {
    const destination = (location.state as any)?.from?.pathname || '/admin';
    navigate(destination, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await loginWithEmail(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Google Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = () => {
    loginDemo('superadmin');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#0D0C0A] text-[#FAF7F2] flex items-center justify-center p-4 sm:p-6 antialiased">
      {/* Subtle Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(197,168,128,0.08),transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md bg-[#161412] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 text-[#C5A880] mb-1">
            <Utensils className="w-6 h-6" />
          </div>
          <h1 className="font-editorial-display text-2xl sm:text-3xl font-bold tracking-wider uppercase text-[#FAF7F2]">
            Panjtara Portal
          </h1>
          <p className="text-xs text-white/60 tracking-wider">
            Pure Veg &amp; Garden Lawn • Management Console
          </p>
        </div>

        {/* Status / Error Banner */}
        {error && (
          <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <div className="flex-1 leading-relaxed">{error}</div>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/70 block uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@panjtara.com"
                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm text-[#FAF7F2] placeholder-white/30 focus:outline-none focus:border-[#C5A880] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/70 block uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm text-[#FAF7F2] placeholder-white/30 focus:outline-none focus:border-[#C5A880] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#C5A880] hover:bg-[#B39366] text-[#12110F] font-semibold text-xs uppercase tracking-widest rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Authenticating...' : 'Sign In with Firebase'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#161412] px-3 text-[10px] uppercase tracking-widest text-white/40 absolute">
            Or quick demo access
          </span>
        </div>

        {/* Quick Demo Access Button */}
        <button
          onClick={handleQuickDemo}
          type="button"
          className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-2 group"
        >
          <Sparkles className="w-4 h-4 text-[#C5A880] group-hover:scale-110 transition-transform" />
          <span>One-Click SuperAdmin Login (Instant Preview)</span>
        </button>

        {/* Google Sign In option */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={isLoading}
          className="w-full py-2 bg-black/40 hover:bg-black/60 border border-white/10 text-white/70 hover:text-white text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span>Continue with Google (Firebase Auth)</span>
        </button>

        {/* Security Footer Notice */}
        <div className="pt-2 text-center border-t border-white/5 space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400/90 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Protected Firebase Authentication &amp; Express API</span>
          </div>
          <p className="text-[10px] text-white/40">
            Panjtara Pure Veg • Bypass Road, Indore
          </p>
        </div>
      </div>
    </div>
  );
}
