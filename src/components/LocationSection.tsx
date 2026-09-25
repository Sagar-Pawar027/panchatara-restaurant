import React from 'react';
import { MapPin, Clock, Phone, Car, Compass, Mail } from 'lucide-react';

export const LocationSection: React.FC = () => {
  return (
    <section id="location" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0b100d] border-t border-[#1d2d23]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Information Particulars */}
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">How to Reach Us</span>
              <h2 className="text-3xl sm:text-4xl font-royal font-bold text-white mt-1">
                Indore Bypass Destination
              </h2>
              <p className="text-sm text-[#a0aec0] mt-2 leading-relaxed">
                Directly accessible from National Highway 52 / Indore Bypass. Wide service road entry with dedicated valet attendants and EV fast charging stations.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#121c16] border border-[#23352a]">
                <MapPin className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Address & Landmark</h4>
                  <p className="text-xs text-[#a0aec0] mt-1 leading-relaxed">
                    Panchtara Pure Veg Restaurant, Survey 142/1, Indore Bypass Road, Near Bicholi Mardana Flyover, Indore, Madhya Pradesh 452016
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#121c16] border border-[#23352a]">
                <Clock className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Operating Hours</h4>
                  <p className="text-xs text-[#a0aec0] mt-1">
                    Monday to Sunday: <strong>11:00 AM – 11:30 PM</strong> (Non-stop dining)
                  </p>
                  <p className="text-[11px] text-[#718096] mt-0.5">Lunch Buffet: 12:30 PM - 3:30 PM · Dinner Service: 7:00 PM - 11:30 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#121c16] border border-[#23352a]">
                <Phone className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Reservations & Host Desk</h4>
                  <p className="text-xs text-[#a0aec0] mt-1">
                    Direct Concierge: <strong className="text-white">+91 731 298 4500</strong> / <strong className="text-white">+91 98260 74120</strong>
                  </p>
                  <p className="text-[11px] text-[#718096] mt-0.5">WhatsApp Bookings & Corporate Feasts: reservations@panchtara.in</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#121c16] border border-[#23352a]">
                <Car className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Guest Parking & EV Charging</h4>
                  <p className="text-xs text-[#a0aec0] mt-1">
                    Complimentary secure valet for 120+ cars, designated tour coach parking, and two 60kW DC fast EV chargers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Styled Bypass Map Visual Card */}
          <div className="relative rounded-2xl overflow-hidden bg-[#121c16] border border-[#263c2e] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#23352a] mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#d4af37]" />
                <span className="text-xs font-semibold text-white">Indore Bypass Landmark Map</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">Bicholi Mardana Flyover Exit</span>
            </div>

            <div className="aspect-video w-full rounded-xl bg-[#0b120e] border border-[#1f3125] flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-[#1e3325] border border-[#d4af37] text-[#d4af37] flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <MapPin className="w-6 h-6 text-[#d4af37]" />
                </div>
                <h4 className="font-royal text-lg font-bold text-white">Panchtara Pure Veg</h4>
                <p className="text-xs text-[#d4af37] font-medium mt-0.5">NH-52 Indore Bypass</p>
                <p className="text-xs text-[#a0aec0] mt-2 max-w-xs mx-auto">
                  Only 15 mins from Vijay Nagar & 20 mins from Indore Airport via Super Corridor Bypass.
                </p>

                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#182a1f] hover:bg-[#233c2c] border border-[#2e4c37] text-xs font-semibold text-[#e2d5b6] transition-all"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                  Open in Google Maps
                </a>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-[#0b120e] border border-[#1d2d23]">
                <p className="text-[11px] text-[#8e9f94]">From Vijay Nagar</p>
                <p className="font-semibold text-white mt-0.5">~15 mins</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0b120e] border border-[#1d2d23]">
                <p className="text-[11px] text-[#8e9f94]">From Rau Circle</p>
                <p className="font-semibold text-white mt-0.5">~10 mins</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
