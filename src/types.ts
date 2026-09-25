export interface ReservationData {
  id: string;
  referenceId: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  tableAreaId: string;
  tableAreaName: string;
  specialRequests?: string;
  advanceAmount: number;
  createdAt: string;
  status: 'Confirmed' | 'Pending Advance Verification';
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  spiceLevel?: string;
}
