// Clean API Service for Website Frontend

export interface ReservationPayload {
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: string;
  specialRequests?: string;
}

export interface PreOrderPayload {
  customerName: string;
  phone: string;
  date: string;
  time: string;
  guests?: number;
  seatingArea?: string;
  specialDiet?: string;
  items: Array<{
    dishId?: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  advanceDeposit?: number;
}

const API_BASE = '';

export async function fetchLiveMenu() {
  const res = await fetch(`${API_BASE}/api/menu`);
  if (!res.ok) throw new Error('Failed to fetch menu');
  return res.json();
}

export async function submitReservation(payload: ReservationPayload) {
  const res = await fetch(`${API_BASE}/api/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to submit reservation');
  return res.json();
}

export async function submitPreOrder(payload: PreOrderPayload) {
  const res = await fetch(`${API_BASE}/api/pre-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to submit pre-order');
  return res.json();
}
