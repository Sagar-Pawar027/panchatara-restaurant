export interface CustomerAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  flat: string;
  street: string;
  landmark?: string;
  area: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
}

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  addresses: CustomerAddress[];
  createdAt: string;
}

export type OrderType = 'delivery' | 'takeaway' | 'dine-in';

export type OrderStatus =
  | 'received'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'served'
  | 'cancelled';

export interface FoodOrderItem {
  dishId?: string;
  name: string;
  hindiName?: string;
  quantity: number;
  price: number;
  image?: string;
  isVeg?: boolean;
}

export interface FoodOrder {
  _id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  phone: string;
  email?: string;
  orderType: OrderType;
  status: OrderStatus;
  items: FoodOrderItem[];
  totalAmount: number;
  deliveryFee?: number;
  advanceDeposit?: number;
  deliveryAddress?: CustomerAddress;
  deliverySlot?: string;
  specialInstructions?: string;
  paymentMethod: 'upi' | 'card' | 'cod' | 'counter' | 'whatsapp';
  paymentStatus: 'pending' | 'paid' | 'advance_paid';
  createdAt: string;
  estimatedDeliveryTime?: string;
  // For dine-in preorders
  date?: string;
  time?: string;
  guests?: number;
  seatingArea?: string;
  // Ratings and feedback for past orders
  rating?: number;
  feedback?: string;
  ratedAt?: string;
}
