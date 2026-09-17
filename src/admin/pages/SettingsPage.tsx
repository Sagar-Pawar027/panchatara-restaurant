import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Clock,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Database,
  Building,
  Bell,
  Check,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { getAdminStats, updateSettings, reconnectDatabase, DatabaseStatus } from '../api.ts';

export function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [databaseType, setDatabaseType] = useState('');
  const [databaseConnected, setDatabaseConnected] = useState(false);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [reconnecting, setReconnecting] = useState(false);
  const [reconnectResult, setReconnectResult] = useState<string | null>(null);

  const [restaurantName, setRestaurantName] = useState('Panjtara Pure Veg');
  const [tagline, setTagline] = useState('100% Pure Vegetarian Restaurant & Garden Lawn');
  const [phone, setPhone] = useState('+91 95220 10107');
  const [address, setAddress] = useState('Bypass Road, Near Bharat Benz, Indore, MP 452016');
  const [openingHoursLunch, setOpeningHoursLunch] = useState('11:00 AM - 03:30 PM');
  const [openingHoursDinner, setOpeningHoursDinner] = useState('06:30 PM - 12:00 Midnight');
  const [acceptingReservations, setAcceptingReservations] = useState(true);
  const [noticeBanner, setNoticeBanner] = useState(
    'Poolside cabanas fill quickly for weekend dinners. Advance booking recommended.'
  );

  const loadData = () => {
    getAdminStats()
      .then((data) => {
        setDatabaseType(data.databaseType);
        setDatabaseConnected(data.databaseConnected);
        if (data.databaseStatus) setDbStatus(data.databaseStatus);
        if (data.settings) {
          setRestaurantName(data.settings.restaurantName || 'Panjtara Pure Veg');
          setTagline(data.settings.tagline || '');
          setPhone(data.settings.phone || '+91 95220 10107');
          setAddress(data.settings.address || '');
          setOpeningHoursLunch(data.settings.openingHoursLunch || '11:00 AM - 03:30 PM');
          setOpeningHoursDinner(data.settings.openingHoursDinner || '06:30 PM - 12:00 Midnight');
          setAcceptingReservations(data.settings.acceptingReservations ?? true);
          setNoticeBanner(data.settings.noticeBanner || '');
        }
      })
      .catch((err) => console.error('Failed loading settings:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTestConnection = async () => {
    setReconnecting(true);
    setReconnectResult(null);
    try {
      const res = await reconnectDatabase();
      setDatabaseConnected(res.connected);
      setDbStatus(res.dbStatus);
      if (res.connected) {
        setReconnectResult('Success! Connected to MongoDB Atlas cluster.');
      } else if (res.dbStatus?.ipWhitelistNotice) {
        setReconnectResult('Blocked by Atlas IP Whitelist: Please add 0.0.0.0/0 in Atlas Network Access and click again.');
      } else {
        setReconnectResult(res.dbStatus?.errorReason || 'Could not reach MongoDB cluster.');
      }
    } catch (err: any) {
      setReconnectResult(err.message || 'Connection test failed');
    } finally {
      setReconnecting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({
        restaurantName,
        tagline,
        phone,
        address,
        openingHoursLunch,
        openingHoursDinner,
        acceptingReservations,
        noticeBanner,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed saving settings:', err);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-white/40">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <h1 className="font-editorial-display text-2xl font-bold text-[#FAF7F2]">
            Restaurant &amp; System Configuration
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Control business hours, contact numbers, notices, and database connectivity.
          </p>
        </div>

        {saved && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
            <Check className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      {/* Database Connection Info Box */}
      <div className={`border rounded-xl p-5 space-y-4 transition-all ${
        databaseConnected
          ? 'bg-[#181614] border-emerald-500/30'
          : dbStatus?.ipWhitelistNotice
          ? 'bg-amber-950/20 border-amber-500/30'
          : 'bg-[#181614] border-white/10'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#FAF7F2]">
            <Database className={`w-4 h-4 ${databaseConnected ? 'text-emerald-400' : 'text-[#C5A880]'}`} />
            <span>Database Architecture &amp; Connection Status</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${
              databaseConnected
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : dbStatus?.ipWhitelistNotice
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-white/10 text-white/70 border-white/15'
            }`}>
              {databaseConnected ? 'Atlas Cluster Live' : dbStatus?.ipWhitelistNotice ? 'Atlas Whitelist Required' : 'Local Datastore Active'}
            </span>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={reconnecting}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/15 rounded text-xs text-[#C5A880] flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${reconnecting ? 'animate-spin' : ''}`} />
              <span>{reconnecting ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>
        </div>

        {reconnectResult && (
          <div className={`p-3 rounded-lg text-xs flex items-start gap-2 border ${
            databaseConnected
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-200'
          }`}>
            {databaseConnected ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            )}
            <div className="leading-relaxed">{reconnectResult}</div>
          </div>
        )}

        {dbStatus?.ipWhitelistNotice && (
          <div className="bg-black/40 border border-amber-500/20 rounded-lg p-4 space-y-2 text-xs">
            <div className="font-semibold text-amber-300 flex items-center gap-1.5">
              <span>How to whitelist Cloud Run in MongoDB Atlas:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-white/70 text-[11px] leading-relaxed">
              <li>Open your cluster at <a href="https://cloud.mongodb.com" target="_blank" rel="noreferrer" className="text-[#C5A880] underline">cloud.mongodb.com</a>.</li>
              <li>Go to <strong className="text-white">Security &rarr; Network Access</strong> on the left sidebar.</li>
              <li>Click <strong className="text-white">Add IP Address</strong>.</li>
              <li>Click <strong className="text-white">Allow Access from Anywhere</strong> (which enters <code className="text-[#C5A880]">0.0.0.0/0</code>) and confirm.</li>
              <li>Once active (10-30 seconds), click the <strong className="text-[#C5A880]">Test Connection</strong> button above.</li>
            </ol>
          </div>
        )}

        <p className="text-xs text-white/60 leading-relaxed">
          The backend API runs on Node.js and Express with full Mongoose models (<code className="text-[#C5A880]">MenuItem</code>, <code className="text-[#C5A880]">Reservation</code>, <code className="text-[#C5A880]">PreOrder</code>).
          When you provide your <code className="text-[#C5A880]">MONGODB_URI</code> environment variable (e.g. from MongoDB Atlas), the server automatically connects to your MongoDB cluster with zero extra configuration!
        </p>

        <div className="bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-[11px] text-white/70">
          <span className="text-white/40"># In .env:</span><br />
          MONGODB_URI=mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.mongodb.net/panjtara
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Business Info */}
        <div className="bg-[#181614] border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#FAF7F2] pb-2 border-b border-white/10">
            <Building className="w-4 h-4 text-[#C5A880]" />
            <span>Business Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-white/70 block">
                Restaurant Name
              </label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-white/70 block">
                Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider text-white/70 block">
              Tagline / Subheading
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider text-white/70 block">
              Full Physical Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
            />
          </div>
        </div>

        {/* Operating Hours & Reservations */}
        <div className="bg-[#181614] border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#FAF7F2] pb-2 border-b border-white/10">
            <Clock className="w-4 h-4 text-[#C5A880]" />
            <span>Operating Timings &amp; Booking Control</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-white/70 block">
                Lunch Shift Hours
              </label>
              <input
                type="text"
                value={openingHoursLunch}
                onChange={(e) => setOpeningHoursLunch(e.target.value)}
                placeholder="11:00 AM - 03:30 PM"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-white/70 block">
                Dinner Shift Hours
              </label>
              <input
                type="text"
                value={openingHoursDinner}
                onChange={(e) => setOpeningHoursDinner(e.target.value)}
                placeholder="06:30 PM - 12:00 Midnight"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptingReservations}
                onChange={(e) => setAcceptingReservations(e.target.checked)}
                className="w-4 h-4 text-[#C5A880] rounded focus:ring-0"
              />
              <div>
                <div className="text-xs font-semibold text-[#FAF7F2]">Accept Online Table Bookings</div>
                <div className="text-[11px] text-white/50">
                  Allow guests to place online reservations via the customer portal
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Public Notice Banner */}
        <div className="bg-[#181614] border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#FAF7F2] pb-2 border-b border-white/10">
            <Bell className="w-4 h-4 text-[#C5A880]" />
            <span>Customer Notice Banner</span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider text-white/70 block">
              Notice / Announcement Text
            </label>
            <textarea
              rows={2}
              value={noticeBanner}
              onChange={(e) => setNoticeBanner(e.target.value)}
              placeholder="e.g. Special weekend musical fountain and poolside dining live from 7 PM..."
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#C5A880] hover:bg-[#B39366] text-[#12110F] font-bold text-xs uppercase tracking-widest rounded-lg shadow-lg transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
