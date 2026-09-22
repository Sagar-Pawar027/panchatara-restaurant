import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  hindiName?: string;
  price: number; // numeric in INR
  quantity: number;
  image?: string;
  category?: string;
  isSignature?: boolean;
}

export type OrderType = 'delivery' | 'dine-in' | 'takeaway';

export interface DeliveryZoneInfo {
  name: string;
  distanceKm: number;
  etaMinutes: string;
  minOrderFreeDelivery: number;
  standardFee: number;
}

export const INDORE_DELIVERY_ZONES: DeliveryZoneInfo[] = [
  {
    name: 'Indore Bypass (Near Panjtara)',
    distanceKm: 2.5,
    etaMinutes: '20-25 mins',
    minOrderFreeDelivery: 199,
    standardFee: 0,
  },
  {
    name: 'Bicholi Mardana & Kanadia Road',
    distanceKm: 4.0,
    etaMinutes: '25-30 mins',
    minOrderFreeDelivery: 249,
    standardFee: 20,
  },
  {
    name: 'Bengali Square & Pipliyahana',
    distanceKm: 6.5,
    etaMinutes: '30-35 mins',
    minOrderFreeDelivery: 299,
    standardFee: 30,
  },
  {
    name: 'Vijay Nagar & Scheme 54',
    distanceKm: 9.0,
    etaMinutes: '35-45 mins',
    minOrderFreeDelivery: 399,
    standardFee: 40,
  },
  {
    name: 'Palasia & Old Palasia',
    distanceKm: 8.5,
    etaMinutes: '35-40 mins',
    minOrderFreeDelivery: 399,
    standardFee: 35,
  },
  {
    name: 'MR-10 & Super Corridor',
    distanceKm: 12.0,
    etaMinutes: '40-50 mins',
    minOrderFreeDelivery: 499,
    standardFee: 45,
  },
  {
    name: 'Rau Circle & Silicon City',
    distanceKm: 11.0,
    etaMinutes: '35-45 mins',
    minOrderFreeDelivery: 499,
    standardFee: 40,
  },
  {
    name: 'Geeta Bhawan & AB Road',
    distanceKm: 7.5,
    etaMinutes: '30-40 mins',
    minOrderFreeDelivery: 349,
    standardFee: 30,
  },
  {
    name: 'Bhawarkua & Annapurna',
    distanceKm: 10.5,
    etaMinutes: '40-50 mins',
    minOrderFreeDelivery: 499,
    standardFee: 45,
  },
];

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  advanceDeposit: number; // 50% for dine-in pre-reservation, 100% for delivery
  remainingBalance: number; // 50% payable after dining service
  commissionSavings: number; // 25% average commission saved compared to Zomato/Swiggy
  addItem: (
    dish: {
      id: string;
      name: string;
      hindiName?: string;
      price: string | number;
      image?: string;
      category?: string;
      isSignature?: boolean;
    },
    quantity?: number
  ) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  currentZone: DeliveryZoneInfo;
  deliveryFee: number;
  openCart: (type?: OrderType) => void;
  closeCart: () => void;
  toastMessage: string | null;
  playSuccessSound: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'panjtara_customer_cart';
const ORDER_TYPE_KEY = 'panjtara_order_type';
const DELIVERY_AREA_KEY = 'panjtara_delivery_area';

function parseNumericPrice(price: string | number): number {
  if (typeof price === 'number') return price;
  const cleaned = String(price).replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Default starter item to give user an immediate taste
    return [
      {
        id: 'paneer-lababdar',
        name: 'Paneer Lababdar Special',
        hindiName: 'पनीर लबाबदार',
        price: 340,
        quantity: 1,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
        isSignature: true,
      },
      {
        id: 'm-butter-naan',
        name: 'Butter Naan',
        hindiName: 'बटर नान',
        price: 55,
        quantity: 2,
        category: 'Breads',
      },
    ];
  });

  const [orderType, setOrderType] = useState<OrderType>(() => {
    try {
      const saved = localStorage.getItem(ORDER_TYPE_KEY) as OrderType;
      if (saved && ['delivery', 'dine-in', 'takeaway'].includes(saved)) return saved;
    } catch {
      // fallback
    }
    return 'delivery';
  });

  const [selectedArea, setSelectedArea] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(DELIVERY_AREA_KEY);
      if (saved) return saved;
    } catch {
      // fallback
    }
    return INDORE_DELIVERY_ZONES[0].name;
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDER_TYPE_KEY, orderType);
    } catch {
      // fallback
    }
  }, [orderType]);

  useEffect(() => {
    try {
      localStorage.setItem(DELIVERY_AREA_KEY, selectedArea);
    } catch {
      // fallback
    }
  }, [selectedArea]);

  // Calculations
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 50% split payment leverage for table pre-reservation
  const advanceDeposit = orderType === 'dine-in' ? Math.round(totalAmount * 0.5) : totalAmount;
  const remainingBalance = orderType === 'dine-in' ? totalAmount - advanceDeposit : 0;

  // Leverage 1: ~25% savings compared to third-party aggregators (Zomato/Swiggy commission markups)
  const commissionSavings = Math.round(totalAmount * 0.25);

  const currentZone =
    INDORE_DELIVERY_ZONES.find((z) => z.name === selectedArea) || INDORE_DELIVERY_ZONES[0];

  const deliveryFee =
    orderType !== 'delivery'
      ? 0
      : totalAmount >= currentZone.minOrderFreeDelivery
      ? 0
      : currentZone.standardFee;

  // Add Item to Cart
  const addItem = (
    dish: {
      id: string;
      name: string;
      hindiName?: string;
      price: string | number;
      image?: string;
      category?: string;
      isSignature?: boolean;
    },
    quantity: number = 1
  ) => {
    const numericPrice = parseNumericPrice(dish.price);

    setItems((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: dish.id,
          name: dish.name,
          hindiName: dish.hindiName,
          price: numericPrice,
          quantity,
          image: dish.image,
          category: dish.category,
          isSignature: dish.isSignature,
        },
      ];
    });

    // Show instant toast feedback
    setToastMessage(`Added ${quantity}x ${dish.name} to order`);
    setTimeout(() => {
      setToastMessage((cur) => (cur?.includes(dish.name) ? null : cur));
    }, 2800);
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = (type?: OrderType) => {
    if (type) setOrderType(type);
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  // Pleasant authentic audio chime on order success using Web Audio API
  const playSuccessSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      // Dual harmonic bell chime
      const now = ctx.currentTime;

      // Note 1: E5 (659.25Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.9);

      // Note 2: B5 (987.77Hz) at +120ms
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, now + 0.12);
      gain2.gain.setValueAtTime(0.25, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 1.2);
    } catch {
      // Audio playback gracefully optional
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalAmount,
        advanceDeposit,
        remainingBalance,
        commissionSavings,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        isCartOpen,
        orderType,
        setOrderType,
        selectedArea,
        setSelectedArea,
        currentZone,
        deliveryFee,
        openCart,
        closeCart,
        toastMessage,
        playSuccessSound,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
