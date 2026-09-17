import mongoose, { Schema, Document } from 'mongoose';

export interface IReservation extends Document {
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
}

const ReservationSchema = new Schema<IReservation>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true, default: 2 },
  seatingArea: { type: String, default: 'Garden Lawn' },
  specialRequests: { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now }
});

export const ReservationModel =
  mongoose.models.Reservation || mongoose.model<IReservation>('Reservation', ReservationSchema);
