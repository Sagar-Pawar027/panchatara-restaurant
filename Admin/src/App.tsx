import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { AdminLayout } from './components/AdminLayout.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { MenuManagerPage } from './pages/MenuManagerPage.tsx';
import { ReservationsPage } from './pages/ReservationsPage.tsx';
import { OrdersPage } from './pages/OrdersPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';
import { AdminLoginPage } from './pages/AdminLoginPage.tsx';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#12110F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function AdminAppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <MenuManagerPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservations"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <ReservationsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <OrdersPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <SettingsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      {/* Catch-all redirect to admin dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdminAppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
}
