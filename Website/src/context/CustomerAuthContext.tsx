import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerUser, CustomerAddress } from '../types/customer.ts';

interface CustomerAuthContextType {
  user: CustomerUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signup: (data: { name: string; email: string; password: string; phone: string }) => Promise<{ success: boolean; error?: string }>;
  login: (data: { identifier: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  sendOtp: (phone: string) => Promise<{ success: boolean; message?: string; devOtp?: string; error?: string }>;
  verifyOtp: (phone: string, otp: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  quickDemoLogin: () => Promise<boolean>;
  logout: () => void;
  addAddress: (address: Omit<CustomerAddress, 'id'>) => Promise<boolean>;
  removeAddress: (addressId: string) => Promise<boolean>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'panjtara_customer_user';
const TOKEN_STORAGE_KEY = 'panjtara_customer_token';

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (e) {
      console.error('Failed to parse customer user session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // 0. Signup with Name, Email, Password, and Mobile Number
  const signup = async (signupData: { name: string; email: string; password: string; phone: string }) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to create account.' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message || 'Network error occurred.' };
    }
  };

  // 0.1 Login with Email/Phone and Password
  const login = async (loginData: { identifier: string; password: string }) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to log in.' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message || 'Network error occurred.' };
    }
  };

  // 1. Send OTP
  const sendOtp = async (phone: string) => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to send OTP' };
      }
      return { success: true, message: data.message, devOtp: data.devOtp };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  // 2. Verify OTP
  const verifyOtp = async (phone: string, otp: string, name?: string) => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, name }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Invalid OTP' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  // 3. Quick Demo Login (Zepto-style 1-tap instant experience)
  const quickDemoLogin = async () => {
    try {
      const res = await fetch('/api/auth/quick-demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
        setIsAuthModalOpen(false);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Quick demo login failed', e);
      return false;
    }
  };

  // 4. Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  // 5. Add Address
  const addAddress = async (addressData: Omit<CustomerAddress, 'id'>) => {
    if (!user) return false;
    try {
      const res = await fetch('/api/auth/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id || (user as any)._id,
          'x-user-phone': user.phone,
        },
        body: JSON.stringify(addressData),
      });
      const data = await res.json();
      if (data.success && data.addresses) {
        const updated = { ...user, addresses: data.addresses };
        setUser(updated);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to add address', e);
      return false;
    }
  };

  // 6. Remove Address
  const removeAddress = async (addressId: string) => {
    if (!user) return false;
    try {
      const res = await fetch(`/api/auth/address/${addressId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user.id || (user as any)._id,
          'x-user-phone': user.phone,
        },
      });
      const data = await res.json();
      if (data.success && data.addresses) {
        const updated = { ...user, addresses: data.addresses };
        setUser(updated);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to remove address', e);
      return false;
    }
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signup,
        login,
        sendOtp,
        verifyOtp,
        quickDemoLogin,
        logout,
        addAddress,
        removeAddress,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}
