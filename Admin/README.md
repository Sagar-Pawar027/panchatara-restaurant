# Panjtara Pure Veg — Staff & Admin Portal

Dedicated staff management dashboard with Firebase Authentication, real-time table reservation management, dynamic menu stock controls, kitchen order queues, and database diagnostics.

## Clean Architecture Structure
```text
Admin/
├── package.json         # Self-contained admin dependencies
├── vite.config.ts       # Vite configuration with API proxying
├── tsconfig.json        # TypeScript configuration
├── index.html           # Admin HTML entry shell
├── .env.example         # Firebase & Backend API environment variables
└── src/
    ├── config/
    │   └── firebase.ts  # Firebase SDK initialization
    ├── context/
    │   └── AuthContext.tsx # Authentication provider & permission state
    ├── services/
    │   └── api.ts       # Typed client communicating with /api/admin & /api/*
    ├── components/
    │   └── AdminLayout.tsx # Dashboard shell & sidebar navigation
    ├── pages/
    │   ├── AdminLoginPage.tsx # Staff sign-in page
    │   ├── DashboardPage.tsx  # Analytics, business metrics & Atlas connection test
    │   ├── MenuManagerPage.tsx # Menu inventory & instant stock toggle
    │   ├── ReservationsPage.tsx # Floor bookings & table statuses
    │   ├── OrdersPage.tsx     # Kitchen pre-order workflow
    │   └── SettingsPage.tsx   # Restaurant hours & Atlas IP whitelist guide
    ├── App.tsx          # Protected admin router & auth wrapper
    ├── main.tsx         # React root initialization
    └── index.css        # Admin dark luxury theme styling
```

## Running Standalone
```bash
cd Admin
npm install
npm run dev
```
Runs on `http://localhost:5174` and proxies `/api` calls directly to the Backend.
