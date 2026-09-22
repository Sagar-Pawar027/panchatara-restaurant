# Panjtara Pure Veg — Backend API

Standalone Express + Mongoose + Node.js backend service with clean architecture and production security.

## Clean Architecture Structure
```text
Backend/
├── package.json         # Self-contained dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── .env.example         # Environment variables template
├── src/
│   ├── config/
│   │   └── db.ts        # Database connection & in-memory resilience store
│   ├── data/
│   │   └── seedMenu.ts  # Default menu seeding data
│   ├── middleware/
│   │   ├── auth.ts      # Admin token & verification guard
│   │   └── security.ts  # Rate limiting, OWASP security headers, centralized error handler
│   ├── models/
│   │   ├── MenuItem.ts  # Mongoose model for menu inventory
│   │   ├── PreOrder.ts  # Mongoose model for kitchen pre-orders
│   │   └── Reservation.ts # Mongoose model for table bookings
│   ├── routes/
│   │   ├── menuRoutes.ts # /api/menu endpoints (CRUD + stock toggle)
│   │   ├── preOrderRoutes.ts # /api/pre-orders endpoints (Create & status updates)
│   │   ├── reservationRoutes.ts # /api/reservations endpoints (Create, filter, status)
│   │   └── statsRoutes.ts # /api/admin metrics & connection diagnostics
│   ├── app.ts           # Express application setup
│   └── server.ts        # Standalone server entry point
```

## Running Standalone
```bash
cd Backend
npm install
npm run dev
```
Runs on `http://localhost:5000` by default.
