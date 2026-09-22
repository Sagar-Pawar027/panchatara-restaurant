import mongoose from 'mongoose';
import { INITIAL_MENU_SEED } from '../data/seedMenu.ts';

// In-memory persistent datastore for development & sandbox environments without MongoDB credentials
export const memoryStore = {
  menuItems: [...INITIAL_MENU_SEED.map((item) => ({
    ...item,
    _id: item.id,
    isAvailable: item.isAvailable ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
      guests: 4,
      seatingArea: 'Garden Lawn',
      specialDiet: 'Jain (Satvik)',
      items: [
        { name: 'Panchtara Paneer Tikka', quantity: 2, price: 395 },
        { name: 'Dal Panchtara', quantity: 1, price: 345 },
        { name: 'Garlic Butter Naan', quantity: 4, price: 85 }
      ],
      totalAmount: 1475,
      advanceDeposit: 500,
      status: 'received',
      orderType: 'dine-in',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    }
  ],
  users: [
    {
      _id: 'usr-1',
      name: 'Sagar Pawar',
      phone: '9522010107',
      email: 'pawarsagar27000@gmail.com',
      addresses: [
        {
          id: 'addr-1',
          label: 'Home',
          flat: 'Flat 402, Shanti Kunj',
          street: 'Near Bypass Ring Road',
          landmark: 'Opposite Bharat Benz',
          area: 'Bicholi Mardana',
          city: 'Indore',
          pincode: '452016',
          isDefault: true,
        },
      ],
      createdAt: new Date().toISOString(),
    },
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
    return false;
  }

  dbStatus.uriProvided = true;

  try {
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
    console.log('[Backend Database] MongoDB Atlas connected successfully.');
    return true;
  } catch (error) {
    const rawMsg = (error as Error).message || '';
    const isWhitelistIssue =
      rawMsg.includes('IP that isn\'t whitelisted') ||
      rawMsg.includes('whitelist') ||
      rawMsg.includes('ETIMEDOUT') ||
      rawMsg.includes('ENOTFOUND') ||
      rawMsg.includes('Server selection timed out');

    await mongoose.disconnect().catch(() => {});
    isConnected = false;

    dbStatus.connected = false;
    dbStatus.ipWhitelistNotice = isWhitelistIssue;
    dbStatus.errorReason = isWhitelistIssue
      ? 'MongoDB Atlas Network Access: Cloud container IP is not whitelisted. In MongoDB Atlas > Network Access, add 0.0.0.0/0 (Allow Access from Anywhere).'
      : rawMsg;

    console.log(`[Backend Database] Operating via local datastore (${isWhitelistIssue ? 'Atlas IP whitelist needed: 0.0.0.0/0' : rawMsg.slice(0, 80)}).`);
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
