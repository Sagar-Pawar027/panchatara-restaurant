import { Request, Response, NextFunction } from 'express';

// In-memory sliding window rate limiter to protect reservation & admin endpoints from abuse
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimiter(limit = 100, windowMs = 60000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const clientRecord = requestCounts.get(ip);

    if (!clientRecord || now > clientRecord.resetTime) {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (clientRecord.count >= limit) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again after 1 minute.',
      });
    }

    clientRecord.count += 1;
    next();
  };
}

// Security headers middleware (OWASP recommendations)
export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
}

// Centralized error handling middleware
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('[API Error]:', err.message);
  const isProd = process.env.NODE_ENV === 'production';
  return res.status(500).json({
    success: false,
    error: isProd ? 'Internal server error' : err.message,
  });
}
