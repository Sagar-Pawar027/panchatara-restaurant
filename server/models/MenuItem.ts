import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem extends Document {
  name: string;
  hindiName?: string;
  description: string;
  price: string;
  category: string;
  dietary: string[];
  spiceLevel?: number;
  isAvailable: boolean;
  isSignature?: boolean;
  isChefSpecial?: boolean;
  image?: string;
  createdAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>({
  name: { type: String, required: true },
  hindiName: { type: String },
  description: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String, required: true },
  dietary: { type: [String], default: ['veg'] },
  spiceLevel: { type: Number, default: 1 },
  isAvailable: { type: Boolean, default: true },
  isSignature: { type: Boolean, default: false },
  isChefSpecial: { type: Boolean, default: false },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const MenuItemModel = mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
