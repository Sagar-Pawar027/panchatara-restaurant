import express, { Express } from 'express';
import cors from 'cors';
import { menuRouter } from './routes/menuRoutes.ts';
import { reservationRouter } from './routes/reservationRoutes.ts';
import { preOrderRouter } from './routes/preOrderRoutes.ts';
import { statsRouter } from './routes/statsRoutes.ts';
import { authRouter } from './routes/authRoutes.ts';
import { securityHeaders, rateLimiter, errorHandler } from './middleware/security.ts';
import { verifyAdmin } from './middleware/auth.ts';

export function createBackendApp(): Express {
  const app = express();

  // Security Headers
  app.use(securityHeaders);

  // CORS handling
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
          return callback(null, true);
        }
        return callback(null, true); // Dev-friendly fallback
      },
      credentials: true,
    })
  );

  // Body parser with size limits to prevent payload exhaustion
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // General Rate Limiting
  app.use('/api', rateLimiter(200, 60000));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      service: 'Panjtara Pure Veg Backend',
      timestamp: new Date().toISOString(),
    });
  });

  // Public Guest API Routes
  app.use('/api/auth', authRouter);
  app.use('/api/menu', menuRouter);
  app.use('/api/reservations', reservationRouter);
  app.use('/api/pre-orders', preOrderRouter);
  app.use('/api/preorders', preOrderRouter);

  // Protected / Staff Admin API Routes
  app.use('/api/admin', verifyAdmin, statsRouter);

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
