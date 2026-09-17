import { Router, Request, Response } from 'express';
import { PreOrderModel } from '../models/PreOrder.ts';
import { memoryStore, isMongoDBConnected } from '../db.ts';

export const preOrderRouter = Router();

// GET all pre-orders
preOrderRouter.get('/', async (_req: Request, res: Response) => {
  try {
    if (isMongoDBConnected()) {
      const orders = await PreOrderModel.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, data: orders });
    }
    return res.json({ success: true, count: memoryStore.preOrders.length, data: memoryStore.preOrders });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// POST submit a pre-order
preOrderRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { customerName, phone, date, time, items, totalAmount, notes } = req.body;

    if (!customerName || !phone || !items || !items.length) {
      return res.status(400).json({ success: false, error: 'Customer name, phone, and items are required' });
    }

    if (isMongoDBConnected()) {
      const order = await PreOrderModel.create({
        customerName,
        phone,
        date: date || new Date().toISOString().split('T')[0],
        time: time || '08:00 PM',
        items,
        totalAmount: Number(totalAmount) || 0,
        notes,
        status: 'received',
      });
      return res.status(201).json({ success: true, data: order });
    }

    const newOrder = {
      _id: `ord-${Date.now()}`,
      customerName,
      phone,
      date: date || new Date().toISOString().split('T')[0],
      time: time || '08:00 PM',
      items,
      totalAmount: Number(totalAmount) || 0,
      notes,
      status: 'received' as const,
      createdAt: new Date().toISOString(),
    };

    memoryStore.preOrders.unshift(newOrder);
    return res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// PATCH update pre-order status
preOrderRouter.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['received', 'preparing', 'ready', 'served', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid order status' });
    }

    if (isMongoDBConnected()) {
      const updated = await (PreOrderModel as any).findByIdAndUpdate(id, { status }, { new: true });
      if (!updated) return res.status(404).json({ success: false, error: 'Order not found' });
      return res.json({ success: true, data: updated });
    }

    const order = memoryStore.preOrders.find((o) => o._id === id);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

    // @ts-ignore
    order.status = status;
    return res.json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});
