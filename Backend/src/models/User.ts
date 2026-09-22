import mongoose, { Schema, Document } from 'mongoose';

export interface IUserAddress {
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

export interface IUser extends Document {
  name: string;
  phone: string;
  email?: string;
  addresses: IUserAddress[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, unique: true },
    email: { type: String, trim: true, lowercase: true },
    addresses: [
      {
        id: { type: String, required: true },
        label: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
        flat: { type: String, required: true },
        street: { type: String, required: true },
        landmark: { type: String },
        area: { type: String, required: true },
        city: { type: String, default: 'Indore' },
        pincode: { type: String, default: '452016' },
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
