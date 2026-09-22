# Panjtara Pure Veg — Guest Website

Customer-facing React 19 + Vite web application showcasing luxury vegetarian cuisine, poolside garden dining, and instant table reservations.

## Clean Architecture Structure
```text
Website/
├── package.json         # Self-contained frontend dependencies
├── vite.config.ts       # Vite configuration with API proxying
├── tsconfig.json        # TypeScript configuration
├── index.html           # Public HTML shell
├── .env.example         # Optional backend URL configuration
└── src/
    ├── components/
    │   ├── common/      # Navbar, Footer, PreOrderModal, DishDetailModal
    │   └── sections/    # Hero, InteractiveMenu, ReservationSection, Story, etc.
    ├── data/            # Menu records, restaurant hours, philosophy
    ├── pages/           # Public route views (Home, Menu, Story, Signatures, Location)
    ├── services/        # Clean API client communicating with Backend
    ├── types/           # Data models and component interfaces
    ├── App.tsx          # Public router & modal state
    ├── main.tsx         # React root initialization
    └── index.css        # Tailwind styling & typography
```

## Running Standalone
```bash
cd Website
npm install
npm run dev
```
Runs on `http://localhost:5173` and proxies `/api` calls directly to the Backend.
