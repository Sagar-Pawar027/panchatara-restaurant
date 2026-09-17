import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Clock,
  Phone,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ChefHat,
  ArrowRight,
  Filter,
} from 'lucide-react';
import {
  getPreOrders,
  updatePreOrderStatus,
  AdminPreOrder,
} from '../api.ts';

const STATUSES = ['all', 'received', 'preparing', 'ready', 'served', 'cancelled'] as const;

export function OrdersPage() {
  const [orders, setOrders] = useState<AdminPreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getPreOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updatePreOrderStatus(id, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: newStatus as any } : o))
      );
    } catch (err) {
      console.error('Failed updating order status:', err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <h1 className="font-editorial-display text-2xl font-bold text-[#FAF7F2]">
            Kitchen Pre-Orders &amp; Concierge Queue
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Track dishes pre-ordered by guests in advance to streamline kitchen prep and fast service.
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/70 hover:text-white transition-colors self-start sm:self-auto"
          title="Refresh orders"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STATUSES.map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-lg text-xs capitalize whitespace-nowrap transition-colors ${
              statusFilter === st
                ? 'bg-[#C5A880] text-[#12110F] font-semibold'
                : 'bg-[#181614] text-white/70 hover:text-white border border-white/10'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-white/40">Loading kitchen orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 text-center bg-[#181614] rounded-xl border border-white/10 p-6 space-y-3">
          <ShoppingBag className="w-8 h-8 text-white/20 mx-auto" />
          <p className="text-xs text-white/50">No pre-orders in this status category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((ord) => (
            <div
              key={ord._id}
              className="bg-[#181614] border border-white/10 rounded-xl p-5 space-y-4 flex flex-col justify-between hover:border-[#C5A880]/30 transition-colors"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-sm text-[#FAF7F2]">{ord.customerName}</h3>
                    <a
                      href={`tel:${ord.phone}`}
                      className="text-xs text-white/50 hover:text-white flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3 h-3 text-[#C5A880]" />
                      <span>{ord.phone}</span>
                    </a>
                  </div>

                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                      ord.status === 'ready'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : ord.status === 'preparing'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : ord.status === 'served'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>

                {/* Timing */}
                <div className="p-2.5 bg-black/40 rounded-lg border border-white/5 text-xs text-white/70 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Serve at {ord.time}</span>
                  </div>
                  <span className="text-white/40 text-[11px]">{ord.date}</span>
                </div>

                {/* Items List */}
                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">
                    Ordered Dishes
                  </div>
                  <div className="space-y-1 bg-black/20 p-2.5 rounded border border-white/5">
                    {ord.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-white/90">
                          <span className="font-bold text-[#C5A880]">{item.quantity}x</span> {item.name}
                        </span>
                        <span className="text-white/50 text-[11px]">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#FAF7F2]">
                      <span>Total</span>
                      <span className="text-[#C5A880]">₹{ord.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {ord.notes && (
                  <div className="text-[11px] text-white/60 bg-white/[0.02] p-2 rounded border border-white/5">
                    <span className="font-semibold text-white/80">Special Note:</span> {ord.notes}
                  </div>
                )}
              </div>

              {/* Status Action Workflow Pipeline */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="text-[10px] text-white/40 uppercase tracking-wider">Move Status:</span>
                <div className="flex items-center gap-1.5">
                  {ord.status === 'received' && (
                    <button
                      onClick={() => handleStatusUpdate(ord._id, 'preparing')}
                      className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded flex items-center gap-1"
                    >
                      <ChefHat className="w-3 h-3" />
                      <span>Start Cooking</span>
                    </button>
                  )}
                  {ord.status === 'preparing' && (
                    <button
                      onClick={() => handleStatusUpdate(ord._id, 'ready')}
                      className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Mark Ready</span>
                    </button>
                  )}
                  {ord.status === 'ready' && (
                    <button
                      onClick={() => handleStatusUpdate(ord._id, 'served')}
                      className="px-2.5 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 text-[10px] font-bold rounded"
                    >
                      Mark Served
                    </button>
                  )}
                  {ord.status !== 'cancelled' && ord.status !== 'served' && (
                    <button
                      onClick={() => handleStatusUpdate(ord._id, 'cancelled')}
                      className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white/40 text-[10px] rounded"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
