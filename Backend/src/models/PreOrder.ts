import mongoose, { Schema, Document } from 'mongoose';

export interface IPreOrderItem {
  dishId?: string;
  name: string;
  quantity: number;
  price: number;
}

export interface IPreOrder extends Document {
  orderNumber?: string;
  userId?: string;
  customerName: string;
  phone: string;
  email?: string;
  orderType?: 'delivery' | 'takeaway' | 'dine-in';
  date?: string;
  time?: string;
  guests?: number;
  seatingArea?: string;
  specialDiet?: string;
  deliveryAddress?: {
    id?: string;
    label?: string;
    flat?: string;
    street?: string;
    landmark?: string;
    area?: string;
    city?: string;
    pincode?: string;
  };
  deliveryFee?: number;
  specialInstructions?: string;
  items: IPreOrderItem[];
  totalAmount: number;
  advanceDeposit?: number;
  paymentMethod?: 'upi' | 'card' | 'cod' | 'counter' | 'whatsapp';
  paymentStatus?: 'pending' | 'paid' | 'advance_paid';
  status: 'received' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'served' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const PreOrderSchema: Schema = new Schema(
  {
    orderNumber: { type: String },
    userId: { type: String },
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    orderType: {
      type: String,
      enum: ['delivery', 'takeaway', 'dine-in'],
      default: 'dine-in',
    },
    date: { type: String },
    time: { type: String },
    guests: { type: Number, default: 2 },
    seatingArea: { type: String, default: 'Garden Lawn' },
    specialDiet: { type: String, trim: true },
    deliveryAddress: {
      id: String,
      label: String,
      flat: String,
      street: String,
      landmark: String,
      area: String,
      city: { type: String, default: 'Indore' },
      pincode: { type: String, default: '452016' },
    },
    deliveryFee: { type: Number, default: 0 },
    specialInstructions: { type: String },
    items: [
      {
        dishId: { type: String },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    advanceDeposit: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ['upi', 'card', 'cod', 'counter', 'whatsapp'],
      default: 'upi',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'advance_paid'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: [
        'received',
        'confirmed',
        'preparing',
        'ready',
        'out_for_delivery',
        'served',
        'delivered',
        'cancelled',
      ],
      default: 'received',
    },
  },
  { timestamps: true }
);

export const PreOrderModel = mongoose.models.PreOrder || mongoose.model<IPreOrder>('PreOrder', PreOrderSchema);

