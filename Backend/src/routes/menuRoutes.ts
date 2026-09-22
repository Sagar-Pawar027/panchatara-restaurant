import { Router, Request, Response } from 'express';
import { MenuItemModel } from '../models/MenuItem.ts';
import { memoryStore, isMongoDBConnected } from '../config/db.ts';

export const menuRouter = Router();

// GET all menu items
menuRouter.get('/', async (_req: Request, res: Response) => {
  try {
    if (isMongoDBConnected()) {
      const items = await (MenuItemModel as any).find().sort({ createdAt: -1 });
      return res.json({ success: true, count: items.length, data: items });
    }
    return res.json({
      success: true,
      count: memoryStore.menuItems.length,
      data: memoryStore.menuItems,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// GET single menu item
menuRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isMongoDBConnected()) {
      const item = await (MenuItemModel as any).findById(id);
      if (!item) return res.status(404).json({ success: false, error: 'Item not found' });
      return res.json({ success: true, data: item });
    }

    const item = memoryStore.menuItems.find((i) => i._id === id || i.id === id);
    if (!item) return res.status(404).json({ success: false, error: 'Item not found' });
    return res.json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// POST create new menu item
menuRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { name, hindiName, category, price, description, dietary, isSignature, spiceLevel } = req.body;

    if (!name || !category || !price || !description) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, category, price, and description are required',
      });
    }

    if (isMongoDBConnected()) {
      const newItem = await (MenuItemModel as any).create({
        name,
        hindiName,
        category,
        price,
        description,
        dietary: Array.isArray(dietary) ? dietary : [],
        isSignature: Boolean(isSignature),
        spiceLevel: Number(spiceLevel) || 1,
        isAvailable: true,
      });
      return res.status(201).json({ success: true, data: newItem });
    }

    const newItem = {
      _id: `dish-${Date.now()}`,
      id: `dish-${Date.now()}`,
      name,
      hindiName: hindiName || '',
      category,
      price,
      description,
      dietary: Array.isArray(dietary) ? dietary : [],
      isSignature: Boolean(isSignature),
      spiceLevel: Number(spiceLevel) || 1,
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryStore.menuItems.unshift(newItem as any);
    return res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// PUT update menu item
menuRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (isMongoDBConnected()) {
      const updated = await (MenuItemModel as any).findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) return res.status(404).json({ success: false, error: 'Item not found' });
      return res.json({ success: true, data: updated });
    }

    const index = memoryStore.menuItems.findIndex((i) => i._id === id || i.id === id);
    if (index === -1) return res.status(404).json({ success: false, error: 'Item not found' });

    memoryStore.menuItems[index] = {
      ...memoryStore.menuItems[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    return res.json({ success: true, data: memoryStore.menuItems[index] });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// PATCH toggle availability
menuRouter.patch('/:id/toggle-stock', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongoDBConnected()) {
      const current = await (MenuItemModel as any).findById(id);
      if (!current) return res.status(404).json({ success: false, error: 'Item not found' });
      current.isAvailable = !current.isAvailable;
      await current.save();
      return res.json({ success: true, data: current });
    }

    const item = memoryStore.menuItems.find((i) => i._id === id || i.id === id);
    if (!item) return res.status(404).json({ success: false, error: 'Item not found' });

    item.isAvailable = !item.isAvailable;
    item.updatedAt = new Date().toISOString();
    return res.json({ success: true, data: item });
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

    const index = memoryStore.menuItems.findIndex((i) => i._id === id || i.id === id);
    if (index === -1) return res.status(404).json({ success: false, error: 'Item not found' });

    memoryStore.menuItems.splice(index, 1);
    return res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});
