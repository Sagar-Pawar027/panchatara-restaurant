# Panjtara Pure Veg — 3-Tier Clean Architecture Monorepo

A modular, production-ready restaurant system divided into **3 independent folders** (`Admin/`, `Website/`, and `Backend/`), each with its own `package.json`, TypeScript configuration, and isolated environment settings.

---

## Architecture Overview

```text
├── Backend/                 # Standalone Express + Node.js + MongoDB API Service
│   ├── package.json         # Backend dependencies (express, mongoose, cors, dotenv)
│   ├── tsconfig.json        # NodeNext TypeScript configuration
│   ├── .env.example         # Backend environment variables (PORT, MONGODB_URI, CORS_ORIGINS)
│   ├── README.md            # Backend documentation & standalone setup guide
│   └── src/
│       ├── config/          # MongoDB Atlas connection & resilient in-memory fallback
│       ├── data/            # Seed menu items and initial store
│       ├── middleware/      # Security headers, sliding-window rate limiting & auth verification
│       ├── models/          # Mongoose models (MenuItem, Reservation, PreOrder)
│       ├── routes/          # RESTful routes (/api/menu, /api/reservations, /api/pre-orders, /api/admin)
│       ├── app.ts           # Express application definition
│       └── server.ts        # Standalone server entry point
│
├── Website/                 # Standalone Guest-Facing React 19 + Vite Website
│   ├── package.json         # Website dependencies (react, react-router-dom, motion, lucide-react)
│   ├── vite.config.ts       # Vite config with proxy to backend /api
│   ├── tsconfig.json        # Frontend TypeScript configuration
│   ├── index.html           # Public HTML shell
│   ├── .env.example         # Website environment variables (VITE_API_URL)
│   ├── README.md            # Website documentation & standalone setup guide
│   └── src/
│       ├── components/      # Common UI (Navbar, Footer, Modals) & Page Sections
│       ├── data/            # Restaurant metadata, dishes, philosophy
│       ├── pages/           # Public pages (Home, Menu, Story, Signatures, Location, etc.)
│       ├── services/        # Clean API client for backend communication
│       ├── types/           # Shared interfaces and types
│       ├── App.tsx          # Public router & customer layout
│       └── main.tsx         # React root
│
├── Admin/                   # Standalone Staff & Admin React 19 + Vite Portal
│   ├── package.json         # Admin dependencies (firebase, react, react-router-dom, lucide-react)
│   ├── vite.config.ts       # Vite config with proxy to backend /api
│   ├── tsconfig.json        # Admin TypeScript configuration
│   ├── index.html           # Admin HTML shell
│   ├── .env.example         # Admin environment variables (Firebase config & VITE_API_URL)
│   ├── README.md            # Admin portal documentation & setup guide
│   └── src/
│       ├── config/          # Firebase SDK initialization
│       ├── context/         # AuthContext with session persistence & role verification
│       ├── services/        # Typed API SDK calling backend admin routes
│       ├── components/      # AdminLayout and dashboard navigation shell
│       ├── pages/           # Dashboard, MenuManager, Reservations, Orders, Settings, Login
│       ├── App.tsx          # Protected admin router
│       └── main.tsx         # React root
│
├── server.ts                # Unified dev & production gateway on Port 3000
├── package.json             # Root monorepo orchestration scripts
└── README.md                # Master documentation
```

---

## Security & Clean Architecture Highlights

1. **Security Headers & Hardening**:
   - `Backend/src/middleware/security.ts` applies OWASP-recommended headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection`, and `Strict-Transport-Security`.
2. **Rate Limiting Protection**:
   - Sliding-window rate limiter prevents DDoS and brute-force reservation spam on all `/api/*` endpoints.
3. **CORS Isolation**:
   - Explicit origin whitelisting in `Backend/src/app.ts` ensuring external unauthorized domains cannot make cross-origin API calls.
4. **Input Validation & Sanitization**:
   - Request payloads are validated before database persistence; payload body size is limited to 1MB to prevent memory exhaustion attacks.
5. **Role & Auth Guarding**:
   - `Admin/src/context/AuthContext.tsx` handles Firebase token authentication with demo fallback and protected route redirection (`<ProtectedRoute>`).
6. **Error Masking**:
   - Centralized error handler ensures database connection strings, credentials, and internal stack traces are never leaked in API responses.

---

## Independent Standalone Execution

Each folder can be operated independently in its own terminal:

### Running Backend Standalone
```bash
cd Backend
npm install
npm run dev
# Starts on http://localhost:5000
```

### Running Website Standalone
```bash
cd Website
npm install
npm run dev
# Starts on http://localhost:5173 (proxies API requests to http://localhost:5000)
```

### Running Admin Portal Standalone
```bash
cd Admin
npm install
npm run dev
# Starts on http://localhost:5174 (proxies API requests to http://localhost:5000)
```

---

## Unified Execution (AI Studio & Cloud Container)

In AI Studio's Cloud Run environment, the unified gateway runs both the API and the frontends together on **Port 3000**:
```bash
# Start development server
npm run dev

# Or build for production
npm run build
npm start
```
