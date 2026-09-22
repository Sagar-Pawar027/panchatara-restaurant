import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ShoppingBag,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ChefHat,
  Filter,
  MessageSquare,
  Bike,
  MapPin,
  Printer,
  PackageCheck,
  Search,
  ExternalLink,
  Utensils,
  Sparkles,
} from 'lucide-react';
import {
  getPreOrders,
  updatePreOrderStatus,
  AdminPreOrder,
} from '../services/api.ts';
import { OrdersShimmer } from '../components/AdminShimmer.tsx';

const TYPE_FILTERS = [
  { id: 'all', label: 'All Orders' },
  { id: 'delivery', label: '🛵 Express Delivery' },
  { id: 'takeaway', label: '🥡 Takeaway Pickup' },
  { id: 'dine-in', label: '🍽️ Dine-In Pre-Orders' },
];

const STATUS_FILTERS = [
  'all',
  'received',
  'confirmed',
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered',
  'served',
  'cancelled',
] as const;

function getOrderWhatsAppUrl(ord: AdminPreOrder) {
  const cleanPhone = ord.phone.replace(/[^0-9]/g, '');
  const phoneWithCode = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const isDelivery = ord.orderType === 'delivery';

  let statusMsg = '';
  if (ord.status === 'out_for_delivery') {
    statusMsg = `🛵 Great news! Your Panjtara express delivery #${ord.orderNumber || ord._id} is *OUT FOR DELIVERY* with our rider in Indore. Please keep your phone reachable.`;
  } else if (ord.status === 'ready') {
    statusMsg = isDelivery
      ? `📦 Your order #${ord.orderNumber || ord._id} is packed hot & ready at the counter! Rider dispatching shortly.`
      : `🎉 Your pre-ordered feast & dining table are READY at Panjtara Pure Veg! We are waiting to serve you hot delicacies.`;
  } else if (ord.status === 'preparing') {
    statusMsg = `👨‍🍳 Our royal chefs have started preparing your freshly cooked pure veg dishes with desi ghee!`;
  } else if (ord.status === 'delivered' || ord.status === 'served') {
    statusMsg = `✅ Your order has been delivered/served! We hope you love the taste of Panjtara. Please rate us 5-stars on Google Maps!`;
  } else {
    statusMsg = `To confirm kitchen preparation, please deposit ₹${ord.advanceDeposit || Math.round(ord.totalAmount * 0.5)} via UPI to *panjtara@icici* and share the payment screenshot here.`;
  }

  const text = encodeURIComponent(
    `Namaste ${ord.customerName}! 🙏\n\nRegarding your order #${ord.orderNumber || ord._id} at *Panjtara Pure Veg, Indore*:\n🍽️ Items: ${ord.items.length} dishes\n💰 Total: ₹${ord.totalAmount} (Status: ${ord.status.toUpperCase()})\n\n${statusMsg}\n\nThank you for choosing Panjtara!`
  );
  return `https://wa.me/${phoneWithCode}?text=${text}`;
}

export function OrdersPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrderForKOT, setSelectedOrderForKOT] = useState<AdminPreOrder | null>(null);

  // TanStack Query
  const { data: orders = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: getPreOrders,
    refetchInterval: 12000, // Auto-poll every 12s for Zepto-style live dispatch
  });

  // TanStack Mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: string }) =>
      updatePreOrderStatus(id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const handleStatusUpdate = (id: string, newStatus: string) => {
    statusMutation.mutate({ id, newStatus });
  };

  const filteredOrders = orders.filter((o) => {
    // Type filter
    if (typeFilter !== 'all') {
      const orderType = o.orderType || 'dine-in';
      if (orderType !== typeFilter) return false;
    }
    // Status filter
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = o.customerName?.toLowerCase().includes(q);
      const matchPhone = o.phone?.includes(q);
      const matchNumber = o.orderNumber?.toLowerCase().includes(q);
      const matchArea = o.deliveryAddress?.area?.toLowerCase().includes(q);
      return matchName || matchPhone || matchNumber || matchArea;
    }
    return true;
  });

  const printKOT = (ord: AdminPreOrder) => {
    setSelectedOrderForKOT(ord);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  if (loading) {
    return <OrdersShimmer />;
  }

  // Count active live orders
  const activeCount = orders.filter(
    (o) => o.status === 'received' || o.status === 'confirmed' || o.status === 'preparing' || o.status === 'out_for_delivery'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-editorial-display text-2xl font-bold text-[#FAF7F2]">
              Live Orders &amp; Kitchen Dispatch
            </h1>
            {activeCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {activeCount} Active Now
              </span>
            )}
          </div>
          <p className="text-xs text-white/60 mt-1">
            Zepto-style express delivery management, takeaway packing &amp; dine-in kitchen dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
            title="Refresh orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Type Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TYPE_FILTERS.map((tf) => (
          <button
            key={tf.id}
            onClick={() => setTypeFilter(tf.id)}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              typeFilter === tf.id
                ? 'bg-[#C5A880] text-[#12110F] font-bold shadow-md'
                : 'bg-[#181614] text-white/70 hover:text-white border border-white/10'
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-[11px] capitalize whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-white/20 text-white font-semibold border border-white/30'
                  : 'bg-[#181614] text-white/50 hover:text-white border border-white/5'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Search box */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-white/40" />
          <input
            type="text"
            placeholder="Search name, phone, area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#181614] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#C5A880]"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center bg-[#181614] rounded-xl border border-white/10 p-6 space-y-3">
          <ShoppingBag className="w-8 h-8 text-white/20 mx-auto" />
          <p className="text-xs text-white/50">No orders match the selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((ord) => {
            const isDelivery = ord.orderType === 'delivery';
            const isTakeaway = ord.orderType === 'takeaway';

            return (
              <div
                key={ord._id}
                className="bg-[#181614] border border-white/10 rounded-xl p-5 space-y-4 flex flex-col justify-between hover:border-[#C5A880]/40 transition-colors"
              >
                <div className="space-y-3">
                  {/* Top: Order Type Badge & ID */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isDelivery
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : isTakeaway
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      }`}
                    >
                      {isDelivery ? <Bike className="w-3 h-3" /> : isTakeaway ? <ShoppingBag className="w-3 h-3" /> : <Utensils className="w-3 h-3" />}
                      <span>{ord.orderType || 'Dine-In'}</span>
                    </span>

                    <span className="font-mono text-xs font-bold text-[#C5A880]">
                      {ord.orderNumber || `ORD-${ord._id.slice(-6).toUpperCase()}`}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-sm text-[#FAF7F2]">{ord.customerName}</h3>
                      <a
                        href={`tel:${ord.phone}`}
                        className="text-xs text-white/60 hover:text-white flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3 text-[#C5A880]" />
                        <span>{ord.phone}</span>
                      </a>

                      {/* Direct Contact & WhatsApp */}
                      <div className="flex items-center gap-2 mt-2">
                        <a
                          href={`tel:${ord.phone}`}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded border border-white/10 text-[10px] font-medium transition-colors"
                          title="Call customer"
                        >
                          <Phone className="w-2.5 h-2.5 text-[#C5A880]" />
                          <span>Call</span>
                        </a>
                        <a
                          href={getOrderWhatsAppUrl(ord)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded border border-emerald-500/30 text-[10px] font-medium transition-colors"
                          title="Send WhatsApp payment link or status update"
                        >
                          <MessageSquare className="w-2.5 h-2.5" />
                          <span>WhatsApp Update</span>
                        </a>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                        ord.status === 'delivered' || ord.status === 'served'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : ord.status === 'out_for_delivery'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse'
                          : ord.status === 'ready'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : ord.status === 'preparing'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Delivery Address (if delivery) or Table Seating (if dine-in) */}
                  {isDelivery && ord.deliveryAddress ? (
                    <div className="p-2.5 bg-black/40 rounded-lg border border-white/5 text-xs text-white/80 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-[#C5A880] font-semibold">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>Delivery Address:</span>
                        </span>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${ord.deliveryAddress.flat} ${ord.deliveryAddress.street} ${ord.deliveryAddress.area} Indore`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-[#C5A880] hover:underline flex items-center gap-0.5"
                        >
                          <span>Map</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                      <p className="text-[11px] text-white/70">
                        {ord.deliveryAddress.flat}, {ord.deliveryAddress.street},{' '}
                        {ord.deliveryAddress.landmark ? `${ord.deliveryAddress.landmark}, ` : ''}
                        {ord.deliveryAddress.area}, Indore
                      </p>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-black/40 rounded-lg border border-white/5 text-xs text-white/70 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Schedule: {ord.time || 'Immediate'}</span>
                      </div>
                      <span className="text-white/40 text-[11px]">{ord.date || 'Today'}</span>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold flex items-center justify-between">
                      <span>Ordered Dishes ({ord.items.length})</span>
                      <button
                        onClick={() => printKOT(ord)}
                        className="text-[10px] text-[#C5A880] hover:underline flex items-center gap-1 font-mono"
                        title="Print Kitchen Order Ticket"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Print KOT</span>
                      </button>
                    </div>

                    <div className="space-y-1 bg-black/20 p-2.5 rounded border border-white/5 max-h-36 overflow-y-auto">
                      {ord.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-white/90">
                            <span className="font-bold text-[#C5A880]">{item.quantity}x</span> {item.name}
                          </span>
                          <span className="text-white/50 text-[11px]">₹{item.price * item.quantity}</span>
                        </div>
                      ))}

                      <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#FAF7F2]">
                        <span>Total Bill</span>
                        <span className="text-[#C5A880]">₹{ord.totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  {ord.specialDiet && (
                    <div className="text-[11px] text-white/70 bg-white/[0.03] p-2 rounded border border-white/5">
                      <span className="font-semibold text-amber-400">Dietary Note:</span> {ord.specialDiet}
                    </div>
                  )}
                </div>

                {/* Zepto-Style Express Status Action Pipeline */}
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider">Quick Action:</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Received/Pending/Confirmed -> Start Preparing */}
                    {['received', 'pending', 'confirmed'].includes(ord.status) && (
                      <button
                        onClick={() => handleStatusUpdate(ord._id, 'preparing')}
                        className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded flex items-center gap-1"
                      >
                        <ChefHat className="w-3 h-3" />
                        <span>Start Cooking</span>
                      </button>
                    )}

                    {/* Preparing -> Ready */}
                    {ord.status === 'preparing' && (
                      <button
                        onClick={() => handleStatusUpdate(ord._id, 'ready')}
                        className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Mark Ready / Packed</span>
                      </button>
                    )}

                    {/* Ready -> Out for Delivery (if delivery) or Served (if dine-in) */}
                    {ord.status === 'ready' && isDelivery && (
                      <button
                        onClick={() => handleStatusUpdate(ord._id, 'out_for_delivery')}
                        className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold rounded flex items-center gap-1"
                      >
                        <Bike className="w-3 h-3" />
                        <span>Dispatch Rider</span>
                      </button>
                    )}

                    {ord.status === 'ready' && !isDelivery && (
                      <button
                        onClick={() => handleStatusUpdate(ord._id, 'served')}
                        className="px-2.5 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 text-[10px] font-bold rounded"
                      >
                        Mark Served
                      </button>
                    )}

                    {/* Out for Delivery -> Delivered */}
                    {ord.status === 'out_for_delivery' && (
                      <button
                        onClick={() => handleStatusUpdate(ord._id, 'delivered')}
                        className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded flex items-center gap-1"
                      >
                        <PackageCheck className="w-3 h-3" />
                        <span>Mark Delivered</span>
                      </button>
                    )}

                    {ord.status !== 'cancelled' && ord.status !== 'delivered' && ord.status !== 'served' && (
                      <button
                        onClick={() => handleStatusUpdate(ord._id, 'cancelled')}
                        className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white/40 hover:text-red-400 text-[10px] rounded"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hidden Printable Kitchen Order Ticket (KOT) */}
      {selectedOrderForKOT && (
        <div className="hidden print:block fixed inset-0 bg-white text-black p-8 font-mono text-sm">
          <div className="border-b-2 border-black pb-2 text-center">
            <h2 className="text-xl font-bold">PANJTARA PURE VEG</h2>
            <p className="text-xs">Indore Bypass • 100% Pure Vegetarian</p>
            <h3 className="text-base font-bold mt-2">KITCHEN ORDER TICKET (KOT)</h3>
          </div>

          <div className="py-2 border-b border-black text-xs space-y-1">
            <div className="flex justify-between">
              <span>Token: <strong>{selectedOrderForKOT.orderNumber || selectedOrderForKOT._id}</strong></span>
              <span>Type: <strong>{(selectedOrderForKOT.orderType || 'Dine-In').toUpperCase()}</strong></span>
            </div>
            <div>Guest: {selectedOrderForKOT.customerName} ({selectedOrderForKOT.phone})</div>
            <div>Time: {new Date().toLocaleTimeString()}</div>
            {selectedOrderForKOT.deliveryAddress && (
              <div>Address: {selectedOrderForKOT.deliveryAddress.flat}, {selectedOrderForKOT.deliveryAddress.street}, {selectedOrderForKOT.deliveryAddress.area}</div>
            )}
          </div>

          <div className="py-3 border-b border-black space-y-1">
            {selectedOrderForKOT.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="py-2 flex justify-between font-bold text-base">
            <span>TOTAL:</span>
            <span>₹{selectedOrderForKOT.totalAmount}</span>
          </div>

          {selectedOrderForKOT.specialDiet && (
            <div className="py-2 text-xs border-t border-black">
              <strong>Instructions:</strong> {selectedOrderForKOT.specialDiet}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
