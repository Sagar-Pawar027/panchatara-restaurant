# Panjtara Pure Veg — Full-Stack Web Application

A full-stack restaurant web application with a guest-facing experience, a dedicated staff/admin management portal, and a Node.js + Express + MongoDB backend.

---

## Architecture Overview

```text
├── server/                   # Backend API (Node.js, Express, Mongoose)
│   ├── models/               # Mongoose Schemas (MenuItem, Reservation, PreOrder)
│   ├── routes/               # Express REST Routers (/api/menu, /api/reservations, /api/pre-orders, /api/admin)
│   ├── app.ts                # Express app configuration & middleware
│   └── db.ts                 # Dual-mode database layer (MongoDB Atlas + In-Memory fallback)
│
├── src/
│   ├── admin/                # Dedicated Staff & Admin Portal
│   │   ├── pages/            # Dashboard, Menu Manager, Reservations, Kitchen Orders, Settings, Login
│   │   ├── AuthContext.tsx   # Firebase Authentication provider
│   │   ├── firebase.ts       # Firebase client initialization
│   │   ├── AdminLayout.tsx   # Admin dashboard shell & navigation
│   │   └── api.ts            # Typed client SDK communicating with /api/*
│   │
│   ├── components/           # Public guest website UI components
│   │   ├── common/           # Navigation, Pre-Order Modal, Footers, Modals
│   │   └── sections/         # Hero, Menu Section, Reservation Section, etc.
│   │
│   ├── pages/                # Public routes (Home, Menu, Story, Signatures, Reservations, Location, etc.)
│   ├── data/                 # Menu, philosophy, and restaurant data
│   ├── types/                # TypeScript shared interfaces
│   ├── App.tsx               # Master router (Guest website + Admin Portal)
│   └── main.tsx              # React entry point
│
├── server.ts                 # Unified server entry point (Express API + Vite SPA middleware)
├── package.json              # Full-stack dependencies & build scripts
└── .env.example              # Environment variables template
```

---

## Features

### 1. Public Customer Website
- **Dynamic Gastronomic Menu (`/menu`)**: Live synchronization with backend (`GET /api/menu`), filtering by dietary preferences (Jain Satvik, Chef's Special, Gluten-Free) and instant stock availability tags.
- **Table Reservation Concierge (`/reservation`)**: Live booking connected directly to `POST /api/reservations`.
- **Kitchen Pre-Ordering (`PreOrderModal`)**: Cart system for dishes, advance deposit estimation, and submission directly to `POST /api/pre-orders`.
- **Ambiance & Culinary Showcase**: Open-air lawn, poolside cabanas, high-contrast dark aesthetic with gold accents.

### 2. Staff & Admin Management Portal (`/admin`)
- **Firebase Authentication**: Email/Password login, Google Sign-In, and instant demo access.
- **Command Dashboard (`/admin`)**: Real-time business metrics, live Atlas database connectivity check, and latest booking logs.
- **Menu Management (`/admin/menu`)**: Create, update, delete dishes, adjust pricing, and toggle real-time "In Stock / Sold Out" status.
- **Table Reservations Manager (`/admin/reservations`)**: Filter by date and status (`confirmed`, `pending`, `completed`, `cancelled`), manage walk-in bookings, and delete records.
- **Kitchen Order Pipeline (`/admin/orders`)**: Kitchen workflow pipeline (`received` → `preparing` → `ready` → `served`).
- **Settings & Database Diagnostics (`/admin/settings`)**: Atlas IP whitelist status helper, connection testing tool, and restaurant hours configuration.

### 3. Backend REST API (`/server`)
- `GET /api/menu` — Fetch all menu items
- `POST /api/menu` — Add a new menu item
- `PUT /api/menu/:id` — Update menu item details
- `PATCH /api/menu/:id/toggle-stock` — Toggle stock availability
- `DELETE /api/menu/:id` — Remove menu item
- `GET /api/reservations` — List reservations (optional filters: `status`, `date`)
- `POST /api/reservations` — Create a new reservation
- `PATCH /api/reservations/:id/status` — Update booking status
- `DELETE /api/reservations/:id` — Delete booking
- `GET /api/pre-orders` — List kitchen pre-orders
- `POST /api/pre-orders` — Submit new pre-order
- `PATCH /api/pre-orders/:id/status` — Update order status
- `GET /api/admin/summary` — Overview metrics and database status
- `POST /api/admin/reconnect` — Test and reconnect to MongoDB Atlas
- `POST /api/admin/settings` — Update restaurant settings

---

## Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your `MONGODB_URI` (optional — runs on in-memory mode if omitted):
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/panjtara
```

*Note on MongoDB Atlas:* In your Atlas dashboard under **Network Access**, ensure you add `0.0.0.0/0` (Allow Access from Anywhere) so your environment can connect.

### 3. Start Development Server
```bash
npm run dev
```
Both the Express API server and the Vite React frontend run together on **`http://localhost:3000`**.

### 4. Build & Run for Production
```bash
npm run build
npm start
```
This builds the client to `dist/` and bundles the backend server into `dist/server.cjs`.
