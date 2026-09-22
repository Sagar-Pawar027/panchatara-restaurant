import dotenv from 'dotenv';
import { createBackendApp } from './app.ts';
import { connectDB } from './config/db.ts';

dotenv.config();

const app = createBackendApp();
const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 [Panjtara Backend Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`📡 API Endpoints active at /api/menu, /api/reservations, /api/pre-orders, /api/admin`);
  });
}

start().catch((err) => {
  console.error('Fatal startup error:', err);
});
