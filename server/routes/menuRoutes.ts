import { Router, Request, Response } from 'express';
import { MenuItemModel } from '../models/MenuItem.ts';
import { memoryStore, isMongoDBConnected } from '../db.ts';

export const menuRouter = Router();

// GET all menu items
menuRouter.get('/', async (_req: Request, res: Response) => {
  try {
    if (isMongoDBConnected()) {
      const items = await MenuItemModel.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: items.length, data: items });
    }
    return res.json({ success: true, count: memoryStore.menuItems.length, data: memoryStore.menuItems });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// POST create new menu item
menuRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { name, hindiName, description, price, category, dietary, spiceLevel, isAvailable, isSignature, image } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, error: 'Name, price, and category are required' });
    }

    if (isMongoDBConnected()) {
      const newItem = await MenuItemModel.create({
        name,
        hindiName,
        description: description || '',
        price: price.startsWith('₹') ? price : `₹${price}`,
        category,
        dietary: dietary || ['veg'],
        spiceLevel: Number(spiceLevel) || 1,
        isAvailable: isAvailable ?? true,
        isSignature: Boolean(isSignature),
        image: image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      });
      return res.status(201).json({ success: true, data: newItem });
    }

    const newItem = {
      id: `m-custom-${Date.now()}`,
      _id: `m-custom-${Date.now()}`,
      name,
      hindiName: hindiName || '',
      description: description || '',
      price: price.startsWith('₹') ? price : `₹${price}`,
      category,
      dietary: dietary || ['veg'],
      spiceLevel: Number(spiceLevel) || 1,
      isAvailable: isAvailable ?? true,
      isSignature: Boolean(isSignature),
      image: image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date().toISOString(),
    };

    // @ts-ignore
    memoryStore.menuItems.unshift(newItem);
    return res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// PATCH toggle item stock availability
menuRouter.patch('/:id/toggle-stock', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongoDBConnected()) {
      const item = await (MenuItemModel as any).findById(id);
      if (!item) {
        return res.status(404).json({ success: false, error: 'Menu item not found' });
      }
      item.isAvailable = !item.isAvailable;
      await item.save();
      return res.json({ success: true, data: item });
    }

    const itemIndex = memoryStore.menuItems.findIndex((i: any) => (i._id || i.id) === id);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }

    // @ts-ignore
    const current = memoryStore.menuItems[itemIndex].isAvailable ?? true;
    // @ts-ignore
    memoryStore.menuItems[itemIndex].isAvailable = !current;

    return res.json({ success: true, data: memoryStore.menuItems[itemIndex] });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// PUT update menu item
menuRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMongoDBConnected()) {
      const updated = await (MenuItemModel as any).findByIdAndUpdate(id, updates, { new: true });
      if (!updated) return res.status(404).json({ success: false, error: 'Item not found' });
      return res.json({ success: true, data: updated });
    }

    const itemIndex = memoryStore.menuItems.findIndex((i: any) => (i._id || i.id) === id);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }

    memoryStore.menuItems[itemIndex] = {
      ...memoryStore.menuItems[itemIndex],
      ...updates,
    };

    return res.json({ success: true, data: memoryStore.menuItems[itemIndex] });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// DELETE menu item
menuRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongoDBConnected()) {
      const deleted = await (MenuItemModel as any).findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, error: 'Item not found' });
      return res.json({ success: true, message: 'Item deleted successfully' });
    }

    const itemIndex = memoryStore.menuItems.findIndex((i: any) => (i._id || i.id) === id);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }

    memoryStore.menuItems.splice(itemIndex, 1);
    return res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});
