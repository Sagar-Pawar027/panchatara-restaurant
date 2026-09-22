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
  updatedAt: Date;
}

const ReservationSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true, min: 1, max: 50 },
    seatingArea: {
      type: String,
      required: true,
      enum: ['Garden Lawn', 'Poolside Cabana', 'Banquet Hall', 'Standard Indoor'],
      default: 'Garden Lawn',
    },
    specialRequests: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const ReservationModel = mongoose.models.Reservation || mongoose.model<IReservation>('Reservation', ReservationSchema);
