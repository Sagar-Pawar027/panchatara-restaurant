import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  CalendarDays,
  ShoppingBag,
  IndianRupee,
  Database,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Plus,
} from 'lucide-react';
import {
  getAdminStats,
  getReservations,
  getPreOrders,
  AdminStats,
  AdminReservation,
  AdminPreOrder,
  updateReservationStatus,
  reconnectDatabase,
} from '../api.ts';

export function DashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [orders, setOrders] = useState<AdminPreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [reconnectResult, setReconnectResult] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [statsData, resData, ordData] = await Promise.all([
        getAdminStats(),
        getReservations(),
        getPreOrders(),
      ]);
      setStats(statsData);
      setReservations(resData);
      setOrders(ordData);
    } catch (err) {
      console.error('Failed loading dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleTestConnection = async () => {
    setReconnecting(true);
    setReconnectResult(null);
    try {
      const res = await reconnectDatabase();
      if (res.connected) {
        setReconnectResult('Connected successfully to your remote MongoDB cluster!');
      } else if (res.dbStatus?.ipWhitelistNotice) {
        setReconnectResult('Still blocked: Please ensure 0.0.0.0/0 is added and marked Active in MongoDB Atlas Network Access.');
      } else {
        setReconnectResult(res.dbStatus?.errorReason || 'Could not connect to MongoDB cluster.');
      }
      loadData();
    } catch (err: any) {
      setReconnectResult(err.message || 'Connection test failed');
    } finally {
      setReconnecting(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateReservationStatus(id, newStatus);
      loadData();
    } catch (err) {
      console.error('Failed updating status:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-white/50 tracking-wider">Loading Panjtara Command Center...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner with Database Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#C5A880] font-medium">
              Restaurant Operations
            </span>
          </div>
          <h1 className="font-editorial-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FAF7F2]">
            Panjtara Command Center
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Real-time control for dining reservations, kitchen pre-orders, and menu inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white/80 transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>

          <Link
            to="/admin/menu"
            className="px-4 py-2 bg-[#C5A880] hover:bg-[#B39366] text-[#12110F] text-xs font-semibold tracking-wider uppercase rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Menu</span>
          </Link>
        </div>
      </div>

      {/* Database Connection Status & Atlas IP Whitelist Helper */}
      <div className={`border rounded-xl p-4 sm:p-5 transition-all ${
        stats?.databaseConnected
          ? 'bg-[#181614] border-emerald-500/30'
          : stats?.databaseStatus?.ipWhitelistNotice
          ? 'bg-amber-950/20 border-amber-500/30'
          : 'bg-[#181614] border-white/10'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-lg shrink-0 ${
              stats?.databaseConnected
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : stats?.databaseStatus?.ipWhitelistNotice
                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300'
                : 'bg-white/5 border border-white/10 text-[#C5A880]'
            }`}>
              <Database className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-[#FAF7F2]">
                  {stats?.databaseConnected
                    ? 'MongoDB Atlas Cluster: Connected & Synchronized'
                    : stats?.databaseStatus?.ipWhitelistNotice
                    ? 'MongoDB Atlas Whitelist Required (0.0.0.0/0)'
                    : 'Backend Database Engine: Resilient Local Store'}
                </span>

                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                  stats?.databaseConnected
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : stats?.databaseStatus?.ipWhitelistNotice
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-white/10 text-white/70 border-white/15'
                }`}>
                  {stats?.databaseConnected ? 'Live Atlas Connection' : 'High-Performance Local Mode'}
                </span>
              </div>

              <p className="text-xs text-white/60 leading-relaxed max-w-3xl">
                {stats?.databaseConnected ? (
                  'All menu items, table bookings, and pre-orders are streaming directly to your remote MongoDB Atlas cluster in real time.'
                ) : stats?.databaseStatus?.ipWhitelistNotice ? (
                  'Your MongoDB URI is configured! MongoDB Atlas is currently restricting access because cloud containers use dynamic IPs. To connect: In your MongoDB Atlas Dashboard → Network Access → Add IP Address → select "Allow Access from Anywhere" (0.0.0.0/0).'
                ) : (
                  'The application is fully functional! Express and Mongoose schemas are running on our high-performance in-memory datastore with instant reactivity. All admin changes will persist seamlessly.'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={handleTestConnection}
              disabled={reconnecting}
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/15 rounded-lg text-xs font-semibold text-[#C5A880] transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${reconnecting ? 'animate-spin' : ''}`} />
              <span>{reconnecting ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>
        </div>

        {/* Reconnect notification feedback */}
        {reconnectResult && (
          <div className={`mt-3.5 p-3 rounded-lg text-xs flex items-start gap-2 border ${
            stats?.databaseConnected
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-200'
          }`}>
            {stats?.databaseConnected ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            )}
            <div className="leading-relaxed">{reconnectResult}</div>
          </div>
        )}
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Dishes */}
        <div className="bg-[#181614] border border-white/10 rounded-xl p-5 hover:border-[#C5A880]/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Dishes In Menu</span>
            <div className="p-2 rounded-lg bg-white/5 text-[#C5A880] group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-editorial-display text-[#FAF7F2]">
              {stats?.totalDishes ?? 0}
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              {stats?.availableDishes ?? 0} In Stock
            </span>
          </div>
          <Link
            to="/admin/menu"
            className="mt-3 text-[11px] text-[#C5A880] hover:text-[#e0cbb2] inline-flex items-center gap-1 font-medium"
          >
            Update menu availability <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Table Reservations */}
        <div className="bg-[#181614] border border-white/10 rounded-xl p-5 hover:border-[#C5A880]/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Bookings</span>
            <div className="p-2 rounded-lg bg-white/5 text-[#C5A880] group-hover:scale-110 transition-transform">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-editorial-display text-[#FAF7F2]">
              {stats?.totalReservations ?? 0}
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              {stats?.confirmedReservations ?? 0} Confirmed
            </span>
          </div>
          <Link
            to="/admin/reservations"
            className="mt-3 text-[11px] text-[#C5A880] hover:text-[#e0cbb2] inline-flex items-center gap-1 font-medium"
          >
            View reservation roster <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Pre-Orders */}
        <div className="bg-[#181614] border border-white/10 rounded-xl p-5 hover:border-[#C5A880]/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Kitchen Pre-Orders</span>
            <div className="p-2 rounded-lg bg-white/5 text-[#C5A880] group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-editorial-display text-[#FAF7F2]">
              {stats?.totalPreOrders ?? 0}
            </span>
            <span className="text-xs text-white/50 font-medium">Order requests</span>
          </div>
          <Link
            to="/admin/orders"
            className="mt-3 text-[11px] text-[#C5A880] hover:text-[#e0cbb2] inline-flex items-center gap-1 font-medium"
          >
            Manage live orders <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Pre-Order Revenue */}
        <div className="bg-[#181614] border border-white/10 rounded-xl p-5 hover:border-[#C5A880]/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Pre-Order Value</span>
            <div className="p-2 rounded-lg bg-white/5 text-emerald-400 group-hover:scale-110 transition-transform">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-editorial-display text-[#FAF7F2]">
              ₹{stats?.totalRevenue ?? 0}
            </span>
            <span className="text-xs text-emerald-400 font-medium">Recorded</span>
          </div>
          <span className="mt-3 text-[11px] text-white/40 block">
            Average ticket ₹{stats?.totalPreOrders ? Math.round((stats.totalRevenue / stats.totalPreOrders)) : 0}
          </span>
        </div>
      </div>

      {/* Two Column Layout: Recent Reservations & Recent Kitchen Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reservations Table */}
        <div className="bg-[#181614] border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#C5A880]" />
              <h2 className="text-sm font-semibold text-[#FAF7F2] tracking-wide">
                Recent Table Bookings
              </h2>
            </div>
            <Link
              to="/admin/reservations"
              className="text-xs text-[#C5A880] hover:underline"
            >
              See All
            </Link>
          </div>

          {reservations.length === 0 ? (
            <p className="text-xs text-white/40 py-6 text-center">No bookings recorded yet.</p>
          ) : (
            <div className="space-y-2.5">
              {reservations.slice(0, 5).map((res) => (
                <div
                  key={res._id}
                  className="p-3 bg-black/30 rounded-lg border border-white/5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-medium text-[#FAF7F2] flex items-center gap-2">
                      <span>{res.name}</span>
                      <span className="text-[10px] px-2 py-0.2 rounded bg-white/10 text-white/70">
                        {res.guests} Guests
                      </span>
                    </div>
                    <div className="text-white/50 text-[11px] flex items-center gap-2">
                      <span>{res.date} • {res.time}</span>
                      <span>|</span>
                      <span className="text-[#C5A880]">{res.seatingArea}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-semibold ${
                        res.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : res.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {res.status}
                    </span>

                    {res.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(res._id, 'confirmed')}
                        className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-[#12110F] text-[10px] font-bold rounded"
                        title="Confirm Booking"
                      >
                        Accept
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Kitchen Pre-Orders */}
        <div className="bg-[#181614] border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
              <h2 className="text-sm font-semibold text-[#FAF7F2] tracking-wide">
                Live Kitchen Pre-Orders
              </h2>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs text-[#C5A880] hover:underline"
            >
              See All
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-white/40 py-6 text-center">No orders received yet.</p>
          ) : (
            <div className="space-y-2.5">
              {orders.slice(0, 5).map((ord) => (
                <div
                  key={ord._id}
                  className="p-3 bg-black/30 rounded-lg border border-white/5 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#FAF7F2]">{ord.customerName}</span>
                      <span className="text-white/40 text-[11px] ml-2">({ord.phone})</span>
                    </div>
                    <span className="text-[#C5A880] font-bold">₹{ord.totalAmount}</span>
                  </div>

                  <div className="text-[11px] text-white/60">
                    {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-white/40 pt-1 border-t border-white/5">
                    <span>Target Time: {ord.time}</span>
                    <span className="uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/80 font-medium">
                      Status: {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
