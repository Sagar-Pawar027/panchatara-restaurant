import { FoodOrder } from '../types/customer.ts';

const LOCAL_ORDERS_KEY = 'panjtara_customer_orders';

export function getLocalOrders(): FoodOrder[] {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading local orders', e);
    return [];
  }
}

export function saveLocalOrder(order: FoodOrder): void {
  try {
    const existing = getLocalOrders();
    // Prepend new order, avoid duplicates
    const filtered = existing.filter((o) => o._id !== order._id && o.orderNumber !== order.orderNumber);
    const updated = [order, ...filtered];
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving local order', e);
  }
}

export async function fetchUserOrdersByPhone(phone: string): Promise<FoodOrder[]> {
  const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
  if (!cleanPhone || cleanPhone.length < 10) return [];

  try {
    const res = await fetch(`/api/pre-orders/user/${cleanPhone}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      // Sync into local storage
      data.data.forEach((ord: FoodOrder) => saveLocalOrder(ord));
      return data.data;
    }
  } catch (err) {
    console.warn('Could not fetch server orders, falling back to local', err);
  }
  return [];
}

export function updateLocalOrderRating(orderIdentifier: string, rating: number, feedback: string): FoodOrder | null {
  try {
    const existing = getLocalOrders();
    let updatedOrder: FoodOrder | null = null;
    const updated = existing.map((o) => {
      if (o._id === orderIdentifier || o.orderNumber === orderIdentifier) {
        updatedOrder = {
          ...o,
          rating,
          feedback,
          ratedAt: new Date().toISOString(),
        };
        return updatedOrder;
      }
      return o;
    });
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
    return updatedOrder;
  } catch (e) {
    console.error('Error updating local order rating', e);
    return null;
  }
}

export async function submitOrderReview(orderId: string, rating: number, feedback: string): Promise<boolean> {
  // Update local storage first so user immediately sees their rating
  updateLocalOrderRating(orderId, rating, feedback);

  // Sync to backend if accessible
  try {
    const res = await fetch(`/api/pre-orders/${encodeURIComponent(orderId)}/review`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating, feedback }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Could not sync review to server, cached locally', err);
    return false;
  }
}

