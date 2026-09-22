import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User,
} from '../config/firebase.ts';

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role: 'superadmin' | 'manager' | 'chef';
  isDemo?: boolean;
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginDemo: (role?: 'superadmin' | 'manager' | 'chef') => void;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_ADMIN_KEY = 'panjtara_admin_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => {
    // Check saved local admin session (for demo or persistent quick login)
    try {
      const saved = localStorage.getItem(LOCAL_ADMIN_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen to real Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (fbUser: User | null) => {
      if (fbUser) {
        const admin: AdminUser = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Admin',
          photoURL: fbUser.photoURL,
          role: 'superadmin',
        };
        setUser(admin);
        localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(admin));
      } else {
        // If not in Firebase, keep demo session if active, else null
        const saved = localStorage.getItem(LOCAL_ADMIN_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed?.isDemo) {
              setUser(parsed);
              setLoading(false);
              return;
            }
          } catch {
            // ignore
          }
        }
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      // If Firebase project credentials aren't active in dev or invalid credential, provide clear message
      // and allow fallback to demo
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password. You can also use Quick Demo Login below.');
      } else if (err.code === 'auth/api-key-not-valid' || err.code === 'auth/configuration-not-found') {
        throw new Error('Firebase Auth requires valid project credentials. Please use Quick Demo Login or configure your Firebase keys in .env.');
      }
      throw new Error(err.message || 'Firebase login failed');
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        return;
      }
      throw new Error(err.message || 'Google Sign-In failed');
    }
  };

  const loginDemo = (role: 'superadmin' | 'manager' | 'chef' = 'superadmin') => {
    const demoUser: AdminUser = {
      uid: 'demo-admin-101',
      email: 'admin@panjtara.com',
      displayName: role === 'superadmin' ? 'Panjtara SuperAdmin' : `${role.toUpperCase()} Admin`,
      role,
      isDemo: true,
    };
    setUser(demoUser);
    localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(demoUser));
  };

  const logout = async () => {
    localStorage.removeItem(LOCAL_ADMIN_KEY);
    setUser(null);
    try {
      await fbSignOut(auth);
    } catch {
      // ignore
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithEmail,
        loginWithGoogle,
        loginDemo,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
