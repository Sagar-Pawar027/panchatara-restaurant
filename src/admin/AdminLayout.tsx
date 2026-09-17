import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  CalendarDays,
  ShoppingBag,
  Settings,
  ArrowLeft,
  Database,
  CheckCircle2,
  AlertCircle,
  Menu as MenuIcon,
  X,
  ShieldCheck,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { getAdminStats, AdminStats } from './api.ts';
import { useAuth } from './AuthContext.tsx';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    getAdminStats()
      .then((data) => setStats(data))
      .catch((err) => console.error('Failed loading stats:', err));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#11100E] text-[#FAF7F2] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/admin/menu', label: 'Menu Manager', icon: UtensilsCrossed },
    { path: '/admin/reservations', label: 'Reservations', icon: CalendarDays },
    { path: '/admin/orders', label: 'Pre-Orders', icon: ShoppingBag },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#11100E] text-[#FAF7F2] flex flex-col antialiased">
      {/* Admin Topbar */}
      <header className="h-16 bg-[#181614] border-b border-white/10 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 text-white/70 hover:text-white rounded-md hover:bg-white/5"
            aria-label="Toggle admin sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>

          <Link to="/admin" className="flex items-center gap-2 select-none">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span className="font-editorial-display text-lg tracking-[0.2em] uppercase font-bold text-[#FAF7F2]">
              Panjtara
            </span>
            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-[#C5A880]/20 text-[#C5A880] font-medium border border-[#C5A880]/30">
              Admin Portal
            </span>
          </Link>
        </div>

        {/* Right Info & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Database indicator badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-white/5 border border-white/10 text-white/80"
            title={stats?.databaseConnected ? 'Connected to MongoDB' : 'Running on Express Backend (Mongoose Ready)'}
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>{stats?.databaseConnected ? 'MongoDB Live' : 'Node Express + Mongo Mode'}</span>
          </div>

          {/* User profile & Logout */}
          <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-white/10">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-semibold text-[#FAF7F2] leading-none">
                {user.displayName || 'Administrator'}
              </span>
              <span className="text-[10px] text-white/40 leading-none mt-1">
                {user.email || 'Firebase Auth'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-white/60 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
              title="Sign Out of Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Back to Website button */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-[#C5A880] hover:text-[#12110F] text-xs font-medium transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Website</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed md:static inset-y-0 left-0 top-16 z-30 w-64 bg-[#161412] border-r border-white/10 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 space-y-1">
            <div className="px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-white/40 font-semibold">
              Management
            </div>

            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#C5A880] text-[#12110F] font-semibold shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Sidebar Footer info */}
          <div className="p-4 border-t border-white/10 text-[11px] text-white/50 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Firebase Auth &amp; Mongoose</span>
            </div>
            <p className="text-[10px] text-white/40">
              Indore Bypass Road • Kitchen Portal
            </p>
          </div>
        </aside>

        {/* Overlay on mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-20 md:hidden"
          />
        )}

        {/* Main Admin Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#11100E]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
