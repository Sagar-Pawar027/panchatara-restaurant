import mongoose, { Schema, Document } from 'mongoose';

export interface IPreOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface IPreOrder extends Document {
  customerName: string;
  phone: string;
  date: string;
  time: string;
  items: IPreOrderItem[];
  totalAmount: number;
  status: 'received' | 'preparing' | 'ready' | 'served' | 'cancelled';
  notes?: string;
  createdAt: Date;
}

const PreOrderSchema = new Schema<IPreOrder>({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['received', 'preparing', 'ready', 'served', 'cancelled'],
    default: 'received'
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const PreOrderModel =
  mongoose.models.PreOrder || mongoose.model<IPreOrder>('PreOrder', PreOrderSchema);
