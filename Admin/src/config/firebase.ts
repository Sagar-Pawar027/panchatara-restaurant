import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

const env = (import.meta as any).env || {};

// Standard Firebase config supporting environment variables or safe local defaults
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoAdminPanjtaraIndoreKey2026',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'panjtara-pure-veg.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'panjtara-pure-veg',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'panjtara-pure-veg.appspot.com',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1010101010',
  appId: env.VITE_FIREBASE_APP_ID || '1:1010101010:web:abcdef123456',
};

// Initialize Firebase safely
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
};
export type { User };
