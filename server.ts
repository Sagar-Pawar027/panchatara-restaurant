import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createExpressApp } from './server/app.ts';
import { connectDB } from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // Connect to Database (or initialize in-memory fallback)
  await connectDB();

  const app = createExpressApp();
  const PORT = 3000;

  if (process.env.NODE_ENV !== 'production') {
    // Development mode: attach Vite as middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve built assets from dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Panjtara Server] Running on http://0.0.0.0:${PORT} (Node Express MongoDB Full-stack)`);
  });
}

startServer().catch((err) => {
  console.error('[Panjtara Server] Fatal error starting server:', err);
});
