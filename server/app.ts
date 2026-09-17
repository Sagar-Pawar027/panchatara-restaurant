import express from 'express';
import { menuRouter } from './routes/menuRoutes.ts';
import { reservationRouter } from './routes/reservationRoutes.ts';
import { preOrderRouter } from './routes/preOrderRoutes.ts';
import { statsRouter } from './routes/statsRoutes.ts';

export function createExpressApp() {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Panjtara Pure Veg Backend API',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount API routers
  app.use('/api/menu', menuRouter);
  app.use('/api/reservations', reservationRouter);
  app.use('/api/preorders', preOrderRouter);
  app.use('/api/admin', statsRouter);

  return app;
}
