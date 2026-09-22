import { Router, Request, Response } from 'express';
import { MenuItemModel } from '../models/MenuItem.ts';
import { ReservationModel } from '../models/Reservation.ts';
import { PreOrderModel } from '../models/PreOrder.ts';
import { memoryStore, isMongoDBConnected, getDatabaseStatus, connectDB } from '../config/db.ts';

export const statsRouter = Router();

statsRouter.get('/summary', async (_req: Request, res: Response) => {
  try {
    const mongoConnected = isMongoDBConnected();
    const dbStatus = getDatabaseStatus();

    if (mongoConnected) {
      const [totalDishes, availableDishes, totalReservations, confirmedReservations, preOrders] =
        await Promise.all([
          (MenuItemModel as any).countDocuments(),
          (MenuItemModel as any).countDocuments({ isAvailable: true }),
          (ReservationModel as any).countDocuments(),
          (ReservationModel as any).countDocuments({ status: 'confirmed' }),
          (PreOrderModel as any).find(),
        ]);

      const totalRevenue = preOrders.reduce((acc: number, curr: any) => acc + (curr.totalAmount || 0), 0);

      return res.json({
        success: true,
        data: {
          databaseType: 'MongoDB (Cloud/Atlas)',
          databaseConnected: true,
          databaseStatus: dbStatus,
          totalDishes,
          availableDishes,
          totalReservations,
          confirmedReservations,
          totalPreOrders: preOrders.length,
          totalRevenue,
          settings: memoryStore.settings,
        }
      });
    }

    const totalDishes = memoryStore.menuItems.length;
    const availableDishes = memoryStore.menuItems.filter((i) => i.isAvailable !== false).length;
    const totalReservations = memoryStore.reservations.length;
    const confirmedReservations = memoryStore.reservations.filter((r) => r.status === 'confirmed').length;
    const totalPreOrders = memoryStore.preOrders.length;
    const totalRevenue = memoryStore.preOrders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

    return res.json({
      success: true,
      data: {
        databaseType: 'Resilient Local Datastore (MongoDB Schema Compatible)',
        databaseConnected: false,
        databaseStatus: dbStatus,
        totalDishes,
        availableDishes,
        totalReservations,
        confirmedReservations,
        totalPreOrders,
        totalRevenue,
        settings: memoryStore.settings,
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Reconnect to MongoDB
statsRouter.post('/reconnect', async (_req: Request, res: Response) => {
  try {
    const connected = await connectDB();
    const dbStatus = getDatabaseStatus();
    return res.json({
      success: true,
      data: {
        connected,
        dbStatus,
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Update settings
statsRouter.post('/settings', async (req: Request, res: Response) => {
  try {
    const newSettings = req.body;
    memoryStore.settings = {
      ...memoryStore.settings,
      ...newSettings,
    };
    return res.json({ success: true, data: memoryStore.settings });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});
