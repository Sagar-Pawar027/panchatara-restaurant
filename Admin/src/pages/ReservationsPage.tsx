import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CalendarDays,
  Clock,
  Users,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  X,
  MessageSquare,
} from 'lucide-react';
import {
  getReservations,
  createReservation,
  updateReservationStatus,
  deleteReservation,
  AdminReservation,
} from '../services/api.ts';
import { ReservationsShimmer } from '../components/AdminShimmer.tsx';

const STATUS_FILTERS = ['all', 'confirmed', 'pending', 'completed', 'cancelled'];
const SEATING_AREAS = ['Garden Lawn', 'Poolside Cabana', 'Family Dining', 'Banquet Hall', 'Indoor AC'];

function getWhatsAppReservationUrl(r: AdminReservation) {
  const cleanPhone = r.phone.replace(/[^0-9]/g, '');
  const phoneWithCode = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const isConfirmed = r.status === 'confirmed';
  const text = encodeURIComponent(
    `Namaste ${r.name}! 🙏\n\nRegarding your table booking at *Panjtara Pure Veg, Indore*:\n📅 Date: ${r.date}\n⏰ Time: ${r.time}\n👥 Guests: ${r.guests}\n📍 Seating: ${r.seatingArea}\n\n` +
    (isConfirmed
      ? `✅ Your reservation is CONFIRMED! We look forward to welcoming you.`
      : `To confirm your table, please deposit the advance amount of ₹500 via UPI (UPI ID: panjtara@icici) and share the payment screenshot here.\n\nThank you!`)
  );
  return `https://wa.me/${phoneWithCode}?text=${text}`;
}

export function ReservationsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // TanStack Query
  const { data: reservations = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['admin-reservations', statusFilter, dateFilter],
    queryFn: () => getReservations(statusFilter, dateFilter || undefined),
  });

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: string }) =>
      updateReservationStatus(id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reservations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reservations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const createMutation = useMutation({
    mutationFn: (newReservation: Parameters<typeof createReservation>[0]) =>
      createReservation(newReservation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reservations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setIsModalOpen(false);
      setName('');
      setPhone('');
      setEmail('');
      setSpecialRequests('');
    },
  });

  // New reservation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('08:00 PM');
  const [guests, setGuests] = useState(4);
  const [seatingArea, setSeatingArea] = useState('Garden Lawn');
  const [specialRequests, setSpecialRequests] = useState('');

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, newStatus });
  };

  const handleDelete = (id: string, customerName: string) => {
    if (!window.confirm(`Delete reservation for ${customerName}?`)) return;
    deleteMutation.mutate(id);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date || !time) return;

    createMutation.mutate({
      name,
      phone,
      email,
      date,
      time,
      guests: Number(guests),
      seatingArea,
      specialRequests,
    });
  };

  const filtered = reservations.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.phone.toLowerCase().includes(q) ||
      (r.specialRequests && r.specialRequests.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return <ReservationsShimmer />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <h1 className="font-editorial-display text-2xl font-bold text-[#FAF7F2]">
            Table Booking &amp; Floor Roster
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Manage table requests for Garden Lawn, Poolside Cabanas, and Indoor dining.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-[#C5A880] hover:bg-[#B39366] text-[#12110F] text-xs font-semibold tracking-wider uppercase rounded-lg transition-all shadow flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by guest name, phone..."
            className="w-full pl-10 pr-4 py-2 bg-[#181614] border border-white/10 rounded-lg text-xs text-[#FAF7F2] placeholder-white/30 focus:outline-none focus:border-[#C5A880]"
          />
        </div>

        {/* Date Filter */}
        <div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#181614] border border-white/10 rounded-lg text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-[#C5A880] text-[#12110F] font-semibold'
                  : 'bg-[#181614] text-white/70 hover:text-white border border-white/10'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations List */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center bg-[#181614] rounded-xl border border-white/10 p-6 space-y-3">
          <CalendarDays className="w-8 h-8 text-white/20 mx-auto" />
          <p className="text-xs text-white/50">No table bookings match your filter query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r) => (
            <div
              key={r._id}
              className="bg-[#181614] border border-white/10 rounded-xl p-5 space-y-3.5 hover:border-[#C5A880]/30 transition-colors"
            >
              {/* Card top */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-[#FAF7F2] text-sm flex items-center gap-2">
                    <span>{r.name}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/80">
                      {r.guests} Guests
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/50 mt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#C5A880]" />
                      <a href={`tel:${r.phone}`} className="hover:text-white underline">
                        {r.phone}
                      </a>
                    </span>
                    {r.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-white/40" />
                        <span className="truncate max-w-[140px]">{r.email}</span>
                      </span>
                    )}
                  </div>

                  {/* Direct Contact & WhatsApp Pay/Confirm */}
                  <div className="flex items-center gap-2 mt-2.5">
                    <a
                      href={`tel:${r.phone}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded border border-white/10 text-[11px] font-medium transition-colors"
                      title="Call customer directly"
                    >
                      <Phone className="w-3 h-3 text-[#C5A880]" />
                      <span>Call</span>
                    </a>
                    <a
                      href={getWhatsAppReservationUrl(r)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded border border-emerald-500/30 text-[11px] font-medium transition-colors"
                      title="Send WhatsApp payment link or confirmation"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp Pay/Confirm</span>
                    </a>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold ${
                    r.status === 'confirmed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : r.status === 'pending'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : r.status === 'completed'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {r.status}
                </span>
              </div>

              {/* Booking slot info */}
              <div className="p-2.5 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-white/80 font-medium">
                  <CalendarDays className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{r.date}</span>
                  <span>•</span>
                  <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{r.time}</span>
                </div>

                <div className="flex items-center gap-1 text-[#C5A880] text-[11px] font-medium">
                  <MapPin className="w-3 h-3" />
                  <span>{r.seatingArea}</span>
                </div>
              </div>

              {/* Special Requests */}
              {r.specialRequests && (
                <div className="text-[11px] text-white/60 bg-white/[0.02] p-2.5 rounded border border-white/5 italic">
                  &ldquo;{r.specialRequests}&rdquo;
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <div className="flex items-center gap-1.5">
                  {r.status !== 'confirmed' && (
                    <button
                      onClick={() => handleStatusChange(r._id, 'confirmed')}
                      className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded"
                    >
                      Confirm
                    </button>
                  )}
                  {r.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusChange(r._id, 'completed')}
                      className="px-2.5 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 text-[10px] font-bold rounded"
                    >
                      Mark Seated/Done
                    </button>
                  )}
                  {r.status !== 'cancelled' && (
                    <button
                      onClick={() => handleStatusChange(r._id, 'cancelled')}
                      className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/60 text-[10px] rounded"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(r._id, r.name)}
                  className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                  title="Remove from history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#181614] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="font-editorial-display text-lg font-bold text-[#FAF7F2]">
                New Table Reservation
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-white/70 block">
                    Guest Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Guest full name"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-white/70 block">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98260 12345"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-white/70 block">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-white/70 block">
                    Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="08:00 PM"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-white/70 block">
                    Guests *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    required
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-white/70 block">
                  Seating Area
                </label>
                <select
                  value={seatingArea}
                  onChange={(e) => setSeatingArea(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                >
                  {SEATING_AREAS.map((area) => (
                    <option key={area} value={area} className="bg-[#181614] text-white">
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-white/70 block">
                  Dietary / Special Requests
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Jain preparation, poolside table for birthday celebration..."
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 text-xs rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C5A880] hover:bg-[#B39366] text-[#12110F] font-semibold text-xs rounded-lg transition-colors shadow"
                >
                  Confirm Table Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
