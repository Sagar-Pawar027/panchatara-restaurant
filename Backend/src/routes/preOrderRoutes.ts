import { Router, Request, Response } from 'express';
import { PreOrderModel } from '../models/PreOrder.ts';
import { memoryStore, isMongoDBConnected } from '../config/db.ts';

export const preOrderRouter = Router();

// Helper to generate readable order number
function generateOrderNumber(type: string): string {
  const prefix = type === 'delivery' ? 'DEL' : type === 'takeaway' ? 'TAK' : 'PRE';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `PCH-${prefix}-${randomNum}`;
}

// GET all orders (with optional status or orderType filter)
preOrderRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { status, type } = req.query;

    if (isMongoDBConnected()) {
      const query: any = {};
      if (status && status !== 'all') query.status = status;
      if (type && type !== 'all') query.orderType = type;

      const orders = await (PreOrderModel as any).find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, data: orders });
    }

    let orders = [...memoryStore.preOrders];
    if (status && status !== 'all') {
      orders = orders.filter((o: any) => o.status === status);
    }
    if (type && type !== 'all') {
      orders = orders.filter((o: any) => o.orderType === type);
    }

    return res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// GET orders by user ID or customer phone
preOrderRouter.get('/user/:identifier', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const cleanPhone = identifier.replace(/[^0-9]/g, '');

    if (isMongoDBConnected()) {
      const orders = await (PreOrderModel as any).find({
        $or: [
          { userId: identifier },
          { phone: identifier },
          { phone: cleanPhone },
        ],
      }).sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, data: orders });
    }

    const orders = memoryStore.preOrders.filter(
      (o: any) =>
        o.userId === identifier ||
        o.phone === identifier ||
        o.phone?.replace(/[^0-9]/g, '').includes(cleanPhone)
    );

    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// POST new order (delivery, takeaway, or dine-in preorder)
preOrderRouter.post('/', async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      phone,
      email,
      userId,
      orderType = 'delivery',
      date,
      time,
      guests,
      seatingArea,
      specialDiet,
      deliveryAddress,
      deliveryFee = 0,
      specialInstructions,
      items,
      totalAmount,
      advanceDeposit = 0,
      paymentMethod = 'upi',
      paymentStatus = 'pending',
    } = req.body;

    if (!customerName || !phone || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: customerName, phone, and at least one item are required',
      });
    }

    const orderNumber = generateOrderNumber(orderType);
    const initialStatus = 'received';

    if (isMongoDBConnected()) {
      const order = await (PreOrderModel as any).create({
        orderNumber,
        userId,
        customerName,
        phone,
        email,
        orderType,
        date: date || new Date().toISOString().split('T')[0],
        time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        guests: Number(guests) || 2,
        seatingArea: seatingArea || 'Garden Lawn',
        specialDiet: specialDiet || '',
        deliveryAddress,
        deliveryFee: Number(deliveryFee) || 0,
        specialInstructions,
        items,
        totalAmount: Number(totalAmount) || 0,
        advanceDeposit: Number(advanceDeposit) || 0,
        paymentMethod,
        paymentStatus,
        status: initialStatus,
      });
      return res.status(201).json({ success: true, data: order });
    }

    const order = {
      _id: `ord-${Date.now()}`,
      orderNumber,
      userId,
      customerName,
      phone,
      email,
      orderType,
      date: date || new Date().toISOString().split('T')[0],
      time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      guests: Number(guests) || 2,
      seatingArea: seatingArea || 'Garden Lawn',
      specialDiet: specialDiet || '',
      deliveryAddress,
      deliveryFee: Number(deliveryFee) || 0,
      specialInstructions,
      items,
      totalAmount: Number(totalAmount) || 0,
      advanceDeposit: Number(advanceDeposit) || 0,
      paymentMethod,
      paymentStatus,
      status: initialStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryStore.preOrders.unshift(order as any);
    return res.status(201).json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// PATCH update status
preOrderRouter.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const validStatuses = [
      'received',
      'confirmed',
      'preparing',
      'ready',
      'out_for_delivery',
      'served',
      'delivered',
      'cancelled',
    ];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid order status' });
    }

    const updateFields: any = {};
    if (status) updateFields.status = status;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    if (isMongoDBConnected()) {
      const updated = await (PreOrderModel as any).findByIdAndUpdate(id, updateFields, { new: true });
      if (!updated) return res.status(404).json({ success: false, error: 'Order not found' });
      return res.json({ success: true, data: updated });
    }

    const order = memoryStore.preOrders.find((o: any) => o._id === id || o.orderNumber === id);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

    if (status) (order as any).status = status;
    if (paymentStatus) (order as any).paymentStatus = paymentStatus;
    (order as any).updatedAt = new Date().toISOString();

    return res.json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});
