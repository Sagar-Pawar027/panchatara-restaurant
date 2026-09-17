import mongoose from 'mongoose';
import { MENU_ITEMS } from '../src/data/menu.ts';

// In-memory fallback state for sandboxed preview environments without external MongoDB credentials
export const memoryStore = {
  menuItems: [...MENU_ITEMS.map((item) => ({
    ...item,
    _id: item.id,
    isAvailable: true,
    createdAt: new Date().toISOString(),
  }))],
  reservations: [
    {
      _id: 'res-101',
      name: 'Rajesh Sharma',
      phone: '+91 98260 12345',
      email: 'rajesh.sharma@example.com',
      date: new Date().toISOString().split('T')[0],
      time: '08:00 PM',
      guests: 4,
      seatingArea: 'Garden Lawn',
      specialRequests: 'Window/Corner garden table, celebrating family anniversary',
      status: 'confirmed',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      _id: 'res-102',
      name: 'Pooja Agrawal',
      phone: '+91 94250 56789',
      email: 'pooja.agrawal@example.com',
      date: new Date().toISOString().split('T')[0],
      time: '08:30 PM',
      guests: 6,
      seatingArea: 'Poolside Cabana',
      specialRequests: 'Strictly Jain food (no onion, garlic, or root vegetables)',
      status: 'pending',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      _id: 'res-103',
      name: 'Vikram Mehta',
      phone: '+91 98930 77112',
      email: 'vikram.mehta@example.com',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '01:30 PM',
      guests: 8,
      seatingArea: 'Banquet Hall',
      specialRequests: 'Corporate lunch meeting with high tea',
      status: 'confirmed',
      createdAt: new Date(Date.now() - 14400000).toISOString(),
    }
  ],
  preOrders: [
    {
      _id: 'ord-501',
      customerName: 'Amit Singhal',
      phone: '+91 98270 33441',
      date: new Date().toISOString().split('T')[0],
      time: '08:00 PM',
      items: [
        { name: 'Panchtara Paneer Tikka', quantity: 2, price: 395 },
        { name: 'Dal Panchtara', quantity: 1, price: 345 },
        { name: 'Garlic Butter Naan', quantity: 4, price: 85 }
      ],
      totalAmount: 1475,
      status: 'received',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    }
  ],
  settings: {
    restaurantName: 'Panjtara Pure Veg',
    tagline: '100% Pure Vegetarian Restaurant & Garden Lawn',
    phone: '+91 95220 10107',
    address: 'Bypass Road, Near Bharat Benz, Indore, MP 452016',
    openingHoursLunch: '11:00 AM - 03:30 PM',
    openingHoursDinner: '06:30 PM - 12:00 Midnight',
    acceptingReservations: true,
    noticeBanner: 'Poolside cabanas fill quickly for weekend dinners. Advance booking recommended.',
  }
};

let isConnected = false;
let dbStatus = {
  connected: false,
  uriProvided: false,
  errorReason: null as string | null,
  ipWhitelistNotice: false,
};

export async function connectDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  if (!uri || !uri.trim()) {
    dbStatus = {
      connected: false,
      uriProvided: false,
      errorReason: 'MONGODB_URI not provided in environment',
      ipWhitelistNotice: false,
    };
    console.log('[Database] MONGODB_URI not configured. Operating in high-performance local store mode (MongoDB schema compatible).');
    return false;
  }

  dbStatus.uriProvided = true;

  try {
    // Reset any previous lingering connection attempt
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect().catch(() => {});
    }

    await mongoose.connect(uri.trim(), {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });

    isConnected = true;
    dbStatus.connected = true;
    dbStatus.errorReason = null;
    dbStatus.ipWhitelistNotice = false;
    console.log('[Database] MongoDB connected successfully to remote cluster.');
    return true;
  } catch (error) {
    const rawMsg = (error as Error).message || '';
    const isWhitelistIssue =
      rawMsg.includes('IP that isn\'t whitelisted') ||
      rawMsg.includes('whitelist') ||
      rawMsg.includes('ETIMEDOUT') ||
      rawMsg.includes('ENOTFOUND') ||
      rawMsg.includes('Server selection timed out');

    // Cleanly close any half-opened connection
    await mongoose.disconnect().catch(() => {});
    isConnected = false;

    dbStatus.connected = false;
    dbStatus.ipWhitelistNotice = isWhitelistIssue;
    dbStatus.errorReason = isWhitelistIssue
      ? 'MongoDB Atlas Network Access: The cloud container IP is not whitelisted. In MongoDB Atlas > Network Access, add 0.0.0.0/0 (Allow Access from Anywhere).'
      : rawMsg;

    console.log(`[Database] Notice: Remote MongoDB unreachable (${isWhitelistIssue ? 'Atlas IP whitelist required: add 0.0.0.0/0' : rawMsg.slice(0, 80)}). Seamlessly serving all requests via local datastore.`);
    return false;
  }
}

export function isMongoDBConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

export function getDatabaseStatus() {
  return {
    ...dbStatus,
    connected: isMongoDBConnected(),
  };
}
