// API Client for Admin Panel & Customer app

export interface DatabaseStatus {
  connected: boolean;
  uriProvided: boolean;
  errorReason: string | null;
  ipWhitelistNotice: boolean;
}

export interface AdminStats {
  databaseType: string;
  databaseConnected: boolean;
  databaseStatus?: DatabaseStatus;
  totalDishes: number;
  availableDishes: number;
  totalReservations: number;
  confirmedReservations: number;
  totalPreOrders: number;
  totalRevenue: number;
  settings: {
    restaurantName: string;
    tagline: string;
    phone: string;
    address: string;
    openingHoursLunch: string;
    openingHoursDinner: string;
    acceptingReservations: boolean;
    noticeBanner: string;
  };
}

export interface AdminMenuItem {
  _id?: string;
  id?: string;
  name: string;
  hindiName?: string;
  description: string;
  price: string;
  category: string;
  dietary?: string[];
  spiceLevel?: number;
  isAvailable?: boolean;
  isSignature?: boolean;
  image?: string;
}

export interface AdminReservation {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface AdminPreOrder {
  _id: string;
  customerName: string;
  phone: string;
  date: string;
  time: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  status: 'received' | 'preparing' | 'ready' | 'served' | 'cancelled';
  notes?: string;
  createdAt: string;
}

// Fetch stats summary
export async function getAdminStats(): Promise<AdminStats> {
  const res = await fetch('/api/admin/summary');
  const json = await res.json();
  return json.data;
}

// Menu API
export async function getMenuItems(): Promise<AdminMenuItem[]> {
  const res = await fetch('/api/menu');
  const json = await res.json();
  return json.data;
}

export async function createMenuItem(data: Partial<AdminMenuItem>): Promise<AdminMenuItem> {
  const res = await fetch('/api/menu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to add dish');
  return json.data;
}

export async function toggleMenuItemStock(id: string): Promise<AdminMenuItem> {
  const res = await fetch(`/api/menu/${id}/toggle-stock`, {
    method: 'PATCH',
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to toggle dish stock');
  return json.data;
}

export async function updateMenuItem(id: string, data: Partial<AdminMenuItem>): Promise<AdminMenuItem> {
  const res = await fetch(`/api/menu/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to update dish');
  return json.data;
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  const res = await fetch(`/api/menu/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  return json.success;
}

// Reservations API
export async function getReservations(status?: string, date?: string): Promise<AdminReservation[]> {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.append('status', status);
  if (date) params.append('date', date);

  const res = await fetch(`/api/reservations?${params.toString()}`);
  const json = await res.json();
  return json.data;
}

export async function createReservation(data: Partial<AdminReservation>): Promise<AdminReservation> {
  const res = await fetch('/api/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to create reservation');
  return json.data;
}

export async function updateReservationStatus(id: string, status: string): Promise<AdminReservation> {
  const res = await fetch(`/api/reservations/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to update reservation status');
  return json.data;
}

export async function deleteReservation(id: string): Promise<boolean> {
  const res = await fetch(`/api/reservations/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  return json.success;
}

// Pre-Orders API
export async function getPreOrders(): Promise<AdminPreOrder[]> {
  const res = await fetch('/api/preorders');
  const json = await res.json();
  return json.data;
}

export async function updatePreOrderStatus(id: string, status: string): Promise<AdminPreOrder> {
  const res = await fetch(`/api/preorders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to update order status');
  return json.data;
}

// Settings API
export async function updateSettings(settings: any): Promise<any> {
  const res = await fetch('/api/admin/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  const json = await res.json();
  return json.data;
}

// Database Connection Test & Reconnect
export async function reconnectDatabase(): Promise<{ connected: boolean; dbStatus: DatabaseStatus }> {
  const res = await fetch('/api/admin/reconnect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const json = await res.json();
  return json.data;
}

