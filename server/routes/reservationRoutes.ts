import { Router, Request, Response } from 'express';
import { ReservationModel } from '../models/Reservation.ts';
import { memoryStore, isMongoDBConnected } from '../db.ts';

export const reservationRouter = Router();

// GET all reservations
reservationRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { status, date } = req.query;

    if (isMongoDBConnected()) {
      const query: any = {};
      if (status && status !== 'all') query.status = status;
      if (date) query.date = date;

      const reservations = await ReservationModel.find(query).sort({ date: -1, time: -1 });
      return res.json({ success: true, count: reservations.length, data: reservations });
    }

    let list = [...memoryStore.reservations];
    if (status && status !== 'all') {
      list = list.filter((r) => r.status === status);
    }
    if (date) {
      list = list.filter((r) => r.date === date);
    }

    return res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// POST create a reservation
reservationRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { name, phone, email, date, time, guests, seatingArea, specialRequests } = req.body;

    if (!name || !phone || !date || !time) {
      return res.status(400).json({ success: false, error: 'Name, phone, date, and time are required' });
    }

    if (isMongoDBConnected()) {
      const reservation = await ReservationModel.create({
        name,
        phone,
        email,
        date,
        time,
        guests: Number(guests) || 2,
        seatingArea: seatingArea || 'Garden Lawn',
        specialRequests,
        status: 'confirmed',
      });
      return res.status(201).json({ success: true, data: reservation });
    }

    const newRes = {
      _id: `res-${Date.now()}`,
      name,
      phone,
      email: email || '',
      date,
      time,
      guests: Number(guests) || 2,
      seatingArea: seatingArea || 'Garden Lawn',
      specialRequests: specialRequests || '',
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
    };

    memoryStore.reservations.unshift(newRes);
    return res.status(201).json({ success: true, data: newRes });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// PATCH update status (e.g. confirmed, completed, cancelled)
reservationRouter.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid reservation status' });
    }

    if (isMongoDBConnected()) {
      const updated = await (ReservationModel as any).findByIdAndUpdate(id, { status }, { new: true });
      if (!updated) return res.status(404).json({ success: false, error: 'Reservation not found' });
      return res.json({ success: true, data: updated });
    }

    const resItem = memoryStore.reservations.find((r) => r._id === id);
    if (!resItem) {
      return res.status(404).json({ success: false, error: 'Reservation not found' });
    }

    resItem.status = status;
    return res.json({ success: true, data: resItem });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// DELETE reservation
reservationRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongoDBConnected()) {
      const deleted = await (ReservationModel as any).findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, error: 'Reservation not found' });
      return res.json({ success: true, message: 'Reservation removed' });
    }

    const index = memoryStore.reservations.findIndex((r) => r._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Reservation not found' });
    }

    memoryStore.reservations.splice(index, 1);
    return res.json({ success: true, message: 'Reservation removed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});
