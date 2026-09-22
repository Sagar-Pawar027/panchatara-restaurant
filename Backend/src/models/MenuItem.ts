import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem extends Document {
  id?: string;
  name: string;
  hindiName?: string;
  category: string;
  price: string;
  description: string;
  dietary: string[];
  isSignature?: boolean;
  spiceLevel?: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    hindiName: { type: String, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['starters', 'tandoor', 'mains', 'dal-rice', 'breads', 'desserts', 'beverages'],
    },
    price: { type: String, required: true },
    description: { type: String, required: true },
    dietary: { type: [String], default: [] },
    isSignature: { type: Boolean, default: false },
    spiceLevel: { type: Number, min: 1, max: 3, default: 1 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const MenuItemModel = mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
