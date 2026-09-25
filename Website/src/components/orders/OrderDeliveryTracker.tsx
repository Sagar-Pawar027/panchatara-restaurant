import { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  MapPin,
  Bike,
  ChefHat,
  PackageCheck,
  CheckCircle2,
  Navigation,
  Sparkles,
  ShieldCheck,
  Flame,
  Route,
  Zap,
  Phone,
  MessageSquare,
  Info,
  Radio,
  ExternalLink,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { FoodOrder } from '../../types/customer.ts';
import {
  HARDCODED_BASE_PREPARATION_MINUTES,
  RESTAURANT_ORIGIN,
  INDORE_RADIUS_ZONES,
  calculateOrderDeliveryEta,
  simulateRadiusEta,
} from '../../services/deliveryEtaCalculator.ts';

interface OrderDeliveryTrackerProps {
  order: FoodOrder;
  isHi?: boolean;
}

export function OrderDeliveryTracker({ order, isHi = false }: OrderDeliveryTrackerProps) {
  const isDelivery = order.orderType === 'delivery';
  const isTakeaway = order.orderType === 'takeaway';
  const isFulfilled = order.status === 'delivered' || order.status === 'served';
  const isCancelled = order.status === 'cancelled';

  // Active view tab: 'map' | 'timeline' | 'architecture' | 'radius'
  const [activeView, setActiveView] = useState<'map' | 'timeline' | 'architecture'>('map');
  const [showArchGuide, setShowArchGuide] = useState<boolean>(false);
  const [showRadiusSimulator, setShowRadiusSimulator] = useState<boolean>(false);

  // Base calculated ETA from order details
  const initialEta = useMemo(() => {
    return calculateOrderDeliveryEta(
      order.createdAt,
      order.deliveryAddress?.area,
      order.deliveryAddress?.street,
      order.items?.reduce((sum, it) => sum + it.quantity, 0) || 2
    );
  }, [order.createdAt, order.deliveryAddress?.area, order.deliveryAddress?.street, order.items]);

  const [customDistanceKm, setCustomDistanceKm] = useState<number>(initialEta.distanceKm);

  // Live ticking timer
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute live countdown and progress percentage
  const orderTimeMs = new Date(order.createdAt).getTime();
  const nowMs = now.getTime();
  const elapsedSeconds = Math.max(0, Math.floor((nowMs - orderTimeMs) / 1000));
  const totalDurationSeconds = (isTakeaway ? HARDCODED_BASE_PREPARATION_MINUTES : initialEta.totalEtaMinutes) * 60;

  let progressPercent = 0;
  if (isFulfilled) {
    progressPercent = 100;
  } else if (order.status === 'out_for_delivery') {
    progressPercent = Math.max(68, Math.min(96, Math.floor((elapsedSeconds / totalDurationSeconds) * 100)));
  } else if (order.status === 'ready') {
    progressPercent = Math.max(52, Math.min(68, Math.floor((elapsedSeconds / totalDurationSeconds) * 100)));
  } else if (order.status === 'preparing') {
    progressPercent = Math.max(20, Math.min(52, Math.floor((elapsedSeconds / totalDurationSeconds) * 100)));
  } else {
    // Received / Confirmed
    progressPercent = Math.min(95, Math.max(8, Math.floor((elapsedSeconds / totalDurationSeconds) * 100)));
  }

  const remainingSeconds = isFulfilled
    ? 0
    : Math.max(0, totalDurationSeconds - elapsedSeconds);

  const remainingMins = Math.floor(remainingSeconds / 60);
  const remainingSecs = remainingSeconds % 60;

  // Simulated road distance remaining during transit
  const simulatedDistanceRemaining = useMemo(() => {
    if (isFulfilled) return 0;
    if (progressPercent < 55) return initialEta.distanceKm;
    const transitProgress = (progressPercent - 55) / 45; // 0 to 1
    const dist = initialEta.distanceKm * (1 - Math.min(1, Math.max(0, transitProgress)));
    return Math.max(0.2, Number(dist.toFixed(1)));
  }, [isFulfilled, progressPercent, initialEta.distanceKm]);

  // Stage computation
  const currentStage = useMemo(() => {
    if (isCancelled) {
      return {
        stage: 'CANCELLED',
        badge: isHi ? 'ऑर्डर रद्द' : 'Order Cancelled',
        title: isHi ? 'ऑर्डर रद्द किया गया' : 'Order Cancelled',
        desc: isHi ? 'अधिक जानकारी के लिए पंजतारा टीम से संपर्क करें।' : 'Please contact Panjtara concierge for inquiries.',
        color: 'text-red-400',
        bg: 'bg-red-500/10 border-red-500/30',
        step: 0,
      };
    }
    if (isFulfilled) {
      return {
        stage: 'DELIVERED',
        badge: isHi ? 'डिलीवर हुआ' : 'Delivered Fresh',
        title: isHi ? (isDelivery ? 'गंतव्य पर सफलतापूर्वक डिलीवर हुआ' : 'भोजन परोसा गया') : (isDelivery ? 'Delivered at Doorstep' : 'Served at Table'),
        desc: isHi ? 'शाही स्वाद का आनंद लें! पंजतारा चुनने के लिए धन्यवाद।' : 'Royal meal delivered fresh and hot. Thank you for dining with Panjtara!',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/15 border-emerald-500/35',
        step: 5,
      };
    }
    if (order.status === 'out_for_delivery' || progressPercent >= 65) {
      return {
        stage: 'TRANSIT',
        badge: isHi ? 'रास्ते में है' : 'Out for Delivery',
        title: isHi ? 'राइडर रास्ते में है' : 'Rider En Route with Meal',
        desc: isHi
          ? `राइडर विक्रम शर्मा आपके पते से मात्र ~${simulatedDistanceRemaining} किमी दूर हैं।`
          : `Rider Vikram Sharma is ~${simulatedDistanceRemaining} km away with your thermal-sealed meal.`,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/15 border-cyan-500/35',
        step: 4,
      };
    }
    if (order.status === 'ready' || (progressPercent >= 50 && progressPercent < 65)) {
      return {
        stage: 'PACKED',
        badge: isHi ? 'पैकिंग पूर्ण' : 'Packed & Ready',
        title: isHi ? 'शाही पैकिंग पूर्ण • प्रेषण तैयार' : 'Hot Packaging Complete',
        desc: isHi
          ? 'स्पिल-प्रूफ शाही कंटेनर में पैक हो चुका है। राइडर को सौंपा जा रहा है।'
          : 'Sealed in tamper-evident royal insulated bags. Handing over to fleet rider.',
        color: 'text-amber-400',
        bg: 'bg-amber-500/15 border-amber-500/35',
        step: 3,
      };
    }
    if (order.status === 'preparing' || (progressPercent >= 20 && progressPercent < 50)) {
      return {
        stage: 'COOKING',
        badge: isHi ? 'रसोई में तैयारी' : 'Kitchen Cooking',
        title: isHi ? 'रसोई में ताज़ा तैयारी चालू' : 'Handi & Tandoor Cooking',
        desc: isHi
          ? `शाही शेफ ताज़ा सामग्री से आपके व्यंजन तैयार कर रहे हैं (~${HARDCODED_BASE_PREPARATION_MINUTES}m रसोई समय)।`
          : `Master chefs preparing dishes from scratch (${HARDCODED_BASE_PREPARATION_MINUTES}m fresh kitchen guarantee).`,
        color: 'text-[#C5A880]',
        bg: 'bg-[#C5A880]/15 border-[#C5A880]/35',
        step: 2,
      };
    }
    return {
      stage: 'CONFIRMED',
      badge: isHi ? 'स्वीकृत' : 'Confirmed',
      title: isHi ? 'ऑर्डर स्वीकृत' : 'Order Received & Confirmed',
      desc: isHi ? 'पंजतारा किचन ने आपका ऑर्डर स्वीकार कर लिया है।' : 'Order accepted by Panjtara head chef. Prep commencing.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/15 border-emerald-500/35',
      step: 1,
    };
  }, [isCancelled, isFulfilled, isDelivery, order.status, progressPercent, simulatedDistanceRemaining, isHi]);

  // Radius simulation
  const customSimResult = useMemo(() => {
    return simulateRadiusEta(customDistanceKm, HARDCODED_BASE_PREPARATION_MINUTES);
  }, [customDistanceKm]);

  // Simulated GPS position of rider along the path (0% = Restaurant, 100% = Customer)
  const riderPathPercent = isFulfilled ? 100 : Math.max(10, Math.min(92, progressPercent));

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#1E1B17] to-[#12110F] border border-[#C5A880]/30 shadow-2xl overflow-hidden text-[#FAF7F2]">
      {/* 1. HERO STATUS BAR */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#2A231C] via-[#1E1A16] to-[#151311] border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left: Stage Title & Subtitle */}
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#C5A880]/20 to-[#C5A880]/5 border border-[#C5A880]/40 flex items-center justify-center shrink-0 shadow-inner">
              {isFulfilled ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : currentStage.step === 4 ? (
                <Bike className="w-6 h-6 text-cyan-400 animate-pulse" />
              ) : currentStage.step === 2 || currentStage.step === 3 ? (
                <Flame className="w-6 h-6 text-amber-400 animate-bounce" style={{ animationDuration: '2s' }} />
              ) : (
                <ChefHat className="w-6 h-6 text-[#C5A880]" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${currentStage.bg} ${currentStage.color}`}>
                  {currentStage.badge}
                </span>
                {!isFulfilled && !isCancelled && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>{isHi ? 'लाइव ट्रैकिंग' : 'Live Tracking'}</span>
                  </span>
                )}
              </div>

              <h3 className="font-editorial-serif text-lg sm:text-xl font-medium text-white">
                {currentStage.title}
              </h3>
              <p className="text-xs text-white/70 max-w-md leading-relaxed">
                {currentStage.desc}
              </p>
            </div>
          </div>

          {/* Right: Big Prominent ETA Display */}
          {!isCancelled && (
            <div className="bg-black/50 border border-white/10 rounded-xl p-3 sm:p-3.5 sm:min-w-[190px] text-left sm:text-right shrink-0">
              {isFulfilled ? (
                <div>
                  <span className="text-[11px] text-white/50 uppercase font-mono tracking-wider block">
                    {isHi ? 'ऑर्डर स्थिति' : 'Order Status'}
                  </span>
                  <div className="text-emerald-400 font-bold text-base sm:text-lg flex items-center sm:justify-end gap-1.5 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{isHi ? 'सफलतापूर्वक पूर्ण' : 'Completed'}</span>
                  </div>
                  <span className="text-[11px] text-white/40 block mt-0.5 font-mono">
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ) : remainingSeconds > 0 ? (
                <div>
                  <div className="flex items-center sm:justify-end gap-1 text-[11px] text-white/60 uppercase font-mono tracking-wider">
                    <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
                    <span>{isHi ? 'अनुमानित आगमन (ETA)' : 'Estimated Arrival'}</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#C5A880] tracking-tight mt-0.5">
                    {remainingMins}:{remainingSecs < 10 ? `0${remainingSecs}` : remainingSecs}
                    <span className="text-xs font-normal text-white/60 ml-1.5 uppercase font-sans">
                      mins
                    </span>
                  </div>
                  <div className="text-xs text-white/60 mt-0.5 font-mono">
                    {isHi ? 'लगभग' : 'Est.'} {initialEta.estimatedArrivalFormatted} • ~{simulatedDistanceRemaining} km
                  </div>
                </div>
              ) : (
                <div className="text-cyan-400 font-bold text-sm flex items-center gap-1.5 animate-pulse">
                  <MapPin className="w-4 h-4" />
                  <span>{isHi ? 'आपके द्वार पर पहुंच चुका है' : 'Arriving At Your Doorstep'}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation View Switcher Tabs */}
        <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setActiveView('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'map'
                  ? 'bg-[#C5A880] text-black font-bold shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{isHi ? '🗺️ लाइव जीपीएस रडार' : '🗺️ Live GPS Radar Map'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'timeline'
                  ? 'bg-[#C5A880] text-black font-bold shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isHi ? '⏱️ समयरेखा (Timeline)' : '⏱️ Order Timeline'}</span>
            </button>
          </div>

          {/* Architecture info button */}
          <button
            type="button"
            onClick={() => setShowArchGuide(!showArchGuide)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#C5A880] hover:text-[#d8bf9a] bg-[#C5A880]/10 hover:bg-[#C5A880]/20 border border-[#C5A880]/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{isHi ? 'लाइव लोकेशन कैसे काम करता है?' : 'How Live Rider GPS Works'}</span>
            {showArchGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. ARCHITECTURAL EXPLAINER BANNER (Directly answers user's prompt question) */}
      {showArchGuide && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/40 via-stone-900/90 to-black/90 border-b border-[#C5A880]/30 space-y-3.5 text-xs text-white/90">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#C5A880] animate-pulse" />
              <span className="font-semibold text-sm text-[#C5A880]">
                {isHi ? 'डिलीवरी बॉय लाइव लोकेशन ट्रैकिंग आर्किटेक्चर गाइड' : 'Live Delivery Boy Location Tracking — Production Architecture'}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/30">
              API vs Build In-House
            </span>
          </div>

          <p className="text-white/80 leading-relaxed">
            {isHi
              ? 'डिलीवरी बॉय की लाइव लोकेशन ट्रैक करने के लिए इंडस्ट्री 3 मुख्य कंपोनेंट्स को मिलाती है:'
              : 'To track a real delivery executive live and stream it to the customer, production delivery platforms use a 4-part hybrid architecture:'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1.5">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                <span>📱 1. Rider Mobile App</span>
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed">
                Delivery boy has a mobile app (React Native / Android) that streams device GPS coordinates every 5s via <code className="text-[#C5A880]">navigator.geolocation.watchPosition</code> or Android FusedLocationProvider.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1.5">
              <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                <span>⚡ 2. Real-Time Cloud Pipe</span>
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed">
                Rider app pushes <code className="text-[#C5A880]">{'{ lat, lng, speed, heading }'}</code> to a WebSocket server (Socket.io) or Firebase Firestore real-time listener, broadcasting to the customer’s active order session.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1.5">
              <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <span>🗺️ 3. Google Maps APIs</span>
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed">
                Use <strong>Google Maps Routes API</strong> to draw the road polyline, <strong>Roads API</strong> to snap jittery GPS to road geometry, and <strong>Maps JavaScript API</strong> to smoothly animate the scooter icon.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#C5A880]/10 border border-[#C5A880]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px]">
            <div>
              <strong className="text-[#C5A880]">Do we build our own or use an API?</strong>
              <div className="text-white/80 mt-0.5">
                <strong>Recommended Hybrid:</strong> Use <strong>Google Maps API</strong> for map tiles, road routing & ETA, and build your own lightweight <strong>WebSocket / Firebase</strong> channel for rider GPS stream. Or use turnkey SDKs like <strong>HyperTrack</strong> or <strong>Radar.io</strong> for battery-saving background tracking.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowArchGuide(false)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg shrink-0 font-medium cursor-pointer"
            >
              {isHi ? 'समझ गया (Dismiss)' : 'Dismiss Guide'}
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN INTERACTIVE VIEWS */}
      {activeView === 'map' ? (
        /* TAB 1: VISUAL LIVE GPS RADAR MAP */
        <div className="p-4 sm:p-5 space-y-4">
          {/* Radar Map Canvas Simulation Container */}
          <div className="relative w-full h-64 sm:h-72 rounded-xl bg-[#0D0C0A] border border-white/15 overflow-hidden shadow-2xl flex flex-col justify-between p-4 select-none">
            {/* Dark Satellite Map Grid Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:20px_20px]" />
            
            {/* Simulated Road Arteries SVG Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C5A880" />
                  <stop offset="50%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>

              {/* City Road Network Lines */}
              <path d="M 0 180 Q 150 140 300 200 T 600 120" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none" />
              <path d="M 120 0 Q 160 120 220 240 T 400 320" stroke="rgba(255,255,255,0.06)" strokeWidth="5" fill="none" />
              <path d="M 40 220 Q 200 80 480 160 T 800 60" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" />

              {/* ACTIVE DELIVERY ROUTE POLYLINE (From Bypass origin to Customer Destination) */}
              <path
                d="M 60 210 C 130 200, 180 150, 270 140 S 390 100, 520 70"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 60 210 C 130 200, 180 150, 270 140 S 390 100, 520 70"
                stroke="url(#routeGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="8 6"
                className="animate-pulse"
                fill="none"
              />
            </svg>

            {/* Top Bar on Map: Telemetry & Connection */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] font-mono">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 font-semibold">{isHi ? 'जीपीएस कनेक्टेड' : 'Live Fleet Telemetry'}</span>
                <span className="text-white/40">|</span>
                <span className="text-white/70">Panjtara Bypass Sector</span>
              </div>

              <div className="bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 text-[11px] font-mono text-[#C5A880]">
                {isHi ? 'स्पीड' : 'Speed'}: <span className="font-bold text-white">28 km/h</span>
              </div>
            </div>

            {/* Map Landmark 1: PANJTARA RESTAURANT (Origin Pin) */}
            <div className="absolute left-6 bottom-8 z-10 flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#181614] border-2 border-[#C5A880] text-[#C5A880] flex items-center justify-center shadow-[0_0_15px_rgba(197,168,128,0.4)]">
                <ChefHat className="w-5 h-5" />
              </div>
              <div className="bg-black/90 px-2.5 py-1 rounded-md border border-[#C5A880]/40 text-left">
                <div className="text-[11px] font-bold text-[#C5A880]">{RESTAURANT_ORIGIN.name}</div>
                <div className="text-[9px] text-white/50">Indore Bypass (Origin)</div>
              </div>
            </div>

            {/* Map Landmark 2: MOVING RIDER SCOOTER WITH RADAR WAVES */}
            <div
              className="absolute z-20 transition-all duration-1000 ease-out"
              style={{
                left: `calc(15% + ${riderPathPercent * 0.65}%)`,
                top: `calc(70% - ${riderPathPercent * 0.48}%)`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Pulsing radar ripples */}
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-cyan-400 opacity-30" />
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-cyan-400 border-2 border-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.8)]">
                  <Bike className="w-5 h-5 text-black" />
                </div>
                {/* Tooltip callout over rider */}
                <div className="absolute bottom-11 whitespace-nowrap bg-cyan-950/95 border border-cyan-400/60 px-2 py-0.5 rounded shadow-lg text-[10px] font-mono text-cyan-200">
                  Vikram S. • ~{simulatedDistanceRemaining} km away
                </div>
              </div>
            </div>

            {/* Map Landmark 3: CUSTOMER DESTINATION (Destination Pin) */}
            <div className="absolute right-6 top-8 z-10 flex flex-col items-end">
              <div className="relative flex items-center justify-center mb-1">
                <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400 opacity-25" />
                <div className="w-9 h-9 rounded-full bg-[#181614] border-2 border-emerald-400 text-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>
              <div className="bg-black/90 px-2.5 py-1 rounded-md border border-emerald-500/40 text-right">
                <div className="text-[11px] font-bold text-emerald-400">
                  {order.deliveryAddress?.area || 'Customer Address'}
                </div>
                <div className="text-[9px] text-white/50">{initialEta.distanceKm} km from Kitchen</div>
              </div>
            </div>

            {/* Bottom Floating Delivery Stats Bar */}
            <div className="relative z-10 flex items-center justify-between bg-black/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <Route className="w-4 h-4 text-[#C5A880]" />
                <span className="text-white/80">
                  {isHi ? 'सड़क मार्ग दूरी:' : 'Live Distance remaining:'}{' '}
                  <strong className="text-cyan-300 font-mono text-sm">~{simulatedDistanceRemaining} km</strong>
                </span>
              </div>
              <div className="text-white/60 font-mono text-[11px]">
                {isHi ? 'रूट:' : 'Route:'} Indore Bypass Road ➔ {order.deliveryAddress?.area || initialEta.zoneName}
              </div>
            </div>
          </div>

          {/* RIDER PROFILE & DIRECT ACTION CARD */}
          {isDelivery && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-white/[0.04] to-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500/20 to-[#C5A880]/30 border-2 border-[#C5A880] flex items-center justify-center text-sm font-bold text-white shrink-0">
                  VS
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">Vikram Sharma</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                      ★ 4.9 (420+ rides)
                    </span>
                  </div>
                  <div className="text-xs text-white/60">
                    Panjtara Direct Fleet Partner • Royal Insulated EV Bag
                  </div>
                </div>
              </div>

              {/* Action Buttons: Call & WhatsApp */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="tel:+919826012345"
                  className="px-3.5 py-2 rounded-xl bg-[#C5A880] hover:bg-[#d8bf9a] text-black text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{isHi ? 'कॉल करें' : 'Call Rider'}</span>
                </a>
                <a
                  href={`https://wa.me/919826012345?text=Hello%20Vikram,%20regarding%20Panjtara%20order%20${order.orderNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* TAB 2: CULINARY TIMELINE (Single clean unified stepper) */
        <div className="p-4 sm:p-5 space-y-4">
          <div className="text-xs font-medium text-white/60 mb-2">
            {isHi ? 'रसोई से आपके द्वार तक के मुख्य चरण:' : 'Order Milestones & Real-Time Stages:'}
          </div>

          <div className="space-y-3">
            {[
              {
                stepNum: 1,
                title: isHi ? 'ऑर्डर प्राप्त व पुष्ट' : 'Order Placed & Confirmed',
                desc: isHi ? 'पंजतारा किचन द्वारा ऑर्डर स्वीकार किया गया।' : 'Received at Indore Bypass Kitchen. Handed to executive chef.',
                time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                done: progressPercent >= 10,
                active: progressPercent < 20,
              },
              {
                stepNum: 2,
                title: isHi ? 'ताज़ा हांडी व तंदूर पकाई' : 'Fresh Handi & Tandoor Preparation',
                desc: isHi ? '18 मिनट गारंटीकृत ताज़ा तंदूर पकाई जारी।' : 'Crafting dishes fresh from scratch using royal spices (~18m kitchen prep guarantee).',
                time: `+${HARDCODED_BASE_PREPARATION_MINUTES} mins`,
                done: progressPercent >= 50,
                active: progressPercent >= 20 && progressPercent < 50,
              },
              {
                stepNum: 3,
                title: isHi ? 'शाही इंसुलेटेड गर्म पैकिंग' : 'Thermal Spill-Proof Packaging',
                desc: isHi ? 'सील-बंद गर्म कंटेनर में पैक हो चुका है।' : 'Packed in sealed tamper-proof containers to keep food steaming hot.',
                time: 'Ready for rider',
                done: progressPercent >= 65,
                active: progressPercent >= 50 && progressPercent < 65,
              },
              {
                stepNum: 4,
                title: isHi ? 'डिलीवरी राइडर रास्ते में' : 'Rider Dispatched & En Route',
                desc: isHi ? `बायपास से आपके क्षेत्र (~${initialEta.distanceKm} किमी) की ओर प्रस्थान।` : `Rider Vikram S. en route to ${order.deliveryAddress?.area || 'your address'} (~${initialEta.transitMinutes} mins transit).`,
                time: `~${simulatedDistanceRemaining} km left`,
                done: progressPercent >= 95,
                active: progressPercent >= 65 && progressPercent < 95,
              },
              {
                stepNum: 5,
                title: isHi ? 'आपके द्वार पर आगमन' : 'Doorstep Handover',
                desc: isHi ? 'स्वादिष्ट शाही शाकाहारी भोजन का आनंद लें।' : 'Meal delivered piping hot at your doorstep. Enjoy the royal experience!',
                time: initialEta.estimatedArrivalFormatted,
                done: isFulfilled,
                active: isFulfilled,
              },
            ].map((st) => (
              <div
                key={st.stepNum}
                className={`p-3 sm:p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                  st.done
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-white'
                    : st.active
                    ? 'bg-[#C5A880]/10 border-[#C5A880]/50 text-white ring-1 ring-[#C5A880]/30 shadow-lg'
                    : 'bg-white/[0.02] border-white/5 text-white/40'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    st.done
                      ? 'bg-emerald-500 text-black'
                      : st.active
                      ? 'bg-[#C5A880] text-black animate-pulse'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {st.done ? '✓' : st.stepNum}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-semibold text-sm ${st.active ? 'text-[#C5A880]' : ''}`}>
                      {st.title}
                    </span>
                    <span className="text-[11px] font-mono text-white/50">{st.time}</span>
                  </div>
                  <p className="text-xs text-white/70 mt-0.5 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. DISTANCE & KITCHEN BREAKDOWN ACCORDION */}
      {isDelivery && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5">
          <div className="rounded-xl bg-black/40 border border-white/10 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#FAF7F2]">
                <Route className="w-4 h-4 text-[#C5A880]" />
                <span>{isHi ? 'दूरी एवं तैयारी का पारदर्शी विवरण' : 'Distance & Kitchen Preparation Breakdown'}</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded bg-[#C5A880]/15 text-[#C5A880] font-mono font-medium border border-[#C5A880]/30">
                {initialEta.zoneName}
              </span>
            </div>

            {/* 3 Metric Pills */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                <div className="text-[10px] text-white/50 uppercase font-mono">{isHi ? 'सड़क दूरी' : 'Radius Distance'}</div>
                <div className="text-base font-bold text-white font-mono mt-0.5">{initialEta.distanceKm} km</div>
                <div className="text-[10px] text-[#C5A880]">{isHi ? 'बायपास किचन से' : 'from Bypass'}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                <div className="text-[10px] text-white/50 uppercase font-mono">{isHi ? 'रसोई समय' : 'Kitchen Cooking'}</div>
                <div className="text-base font-bold text-amber-300 font-mono mt-0.5">{initialEta.prepMinutes} mins</div>
                <div className="text-[10px] text-white/50">{isHi ? '100% ताज़ा हांडी' : 'Guaranteed fresh'}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                <div className="text-[10px] text-white/50 uppercase font-mono">{isHi ? 'सड़क ट्रांज़िट' : 'Road Transit'}</div>
                <div className="text-base font-bold text-cyan-300 font-mono mt-0.5">~{initialEta.transitMinutes} mins</div>
                <div className="text-[10px] text-white/50">~24 km/h speed</div>
              </div>
            </div>

            {/* Toggle Radius Simulator */}
            <button
              type="button"
              onClick={() => setShowRadiusSimulator(!showRadiusSimulator)}
              className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-[#C5A880] text-xs font-medium flex items-center justify-between transition-colors border border-white/5 cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{isHi ? 'अन्य इंदौर क्षेत्रों की दूरी जांचें (सिम्युलेटर)' : 'Simulate Other Indore Delivery Radii'}</span>
              </span>
              {showRadiusSimulator ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showRadiusSimulator && (
              <div className="p-3 rounded-xl bg-black/60 border border-[#C5A880]/30 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">{isHi ? 'दूरी चुनें:' : 'Radius Distance:'}</span>
                  <span className="font-mono font-bold text-[#C5A880] text-sm">{customDistanceKm.toFixed(1)} km</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={15}
                  step={0.5}
                  value={customDistanceKm}
                  onChange={(e) => setCustomDistanceKm(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#C5A880]"
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                  {INDORE_RADIUS_ZONES.slice(0, 4).map((zone) => (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setCustomDistanceKm(zone.distanceKm)}
                      className={`px-2 py-1.5 rounded-lg text-xs text-left transition-all border ${
                        Math.abs(customDistanceKm - zone.distanceKm) < 0.2
                          ? 'bg-[#C5A880] text-black font-bold border-[#C5A880]'
                          : 'bg-white/5 text-white/70 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="truncate font-medium">{zone.name.split('&')[0]}</div>
                      <div className="font-mono text-[10px] opacity-75">{zone.distanceKm} km</div>
                    </button>
                  ))}
                </div>

                <div className="p-2.5 rounded-lg bg-gradient-to-r from-white/5 to-[#C5A880]/10 border border-[#C5A880]/20 flex justify-between items-center text-xs">
                  <span className="text-white/80">Simulated Total ETA:</span>
                  <span className="font-mono font-bold text-sm text-[#C5A880]">
                    ~{customSimResult.totalEtaMinutes} mins ({customSimResult.prepMinutes}m prep + {customSimResult.transitMinutes}m transit)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
