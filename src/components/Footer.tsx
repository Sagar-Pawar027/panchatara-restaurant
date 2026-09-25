import React from 'react';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="location" className="bg-[#090705] border-t border-[#1F1710] text-[#8C8273] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <span className="text-xl font-bold font-display text-[#F7E7CE] tracking-wider block">
              PANCHTARA
            </span>
            <p className="text-xs leading-relaxed text-[#A89F91]">
              Panchtara Pure Veg Dining Hall & Royal Garden Court. Authentic vegetarian delicacies on Indore Bypass, Madhya Pradesh.
            </p>
            <div className="pt-2">
              <span className="text-[11px] text-[#C9A24D] font-mono">100% Satvik Pure Veg Certification</span>
            </div>
          </div>

          {/* Location & Directions */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-[#E8DFD0] uppercase tracking-wider">Location</h4>
            <div className="flex items-start gap-2 text-xs">
              <MapPin className="w-4 h-4 text-[#C9A24D] shrink-0 mt-0.5" />
              <span>Indore Bypass Road, Near Silicon City / Ralamandal Junction, Indore, MP 452016</span>
            </div>
            <p className="text-[11px] text-[#6E6557]">Ample dedicated valet parking & EV charging stations available.</p>
          </div>

          {/* Operating Hours */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-[#E8DFD0] uppercase tracking-wider">Dining Hours</h4>
            <div className="flex items-start gap-2 text-xs">
              <Clock className="w-4 h-4 text-[#C9A24D] shrink-0 mt-0.5" />
              <div>
                <span className="block text-[#E8DFD0]">Lunch: 12:00 PM – 03:45 PM</span>
                <span className="block text-[#E8DFD0]">Dinner: 07:00 PM – 11:45 PM</span>
                <span className="block text-[11px] text-[#6E6557] mt-1">Open All 7 Days (No Weekly Off)</span>
              </div>
            </div>
          </div>

          {/* Direct Concierge Contact */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-[#E8DFD0] uppercase tracking-wider">Direct Concierge</h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C9A24D] shrink-0" />
                <span className="text-[#E8DFD0] font-mono">+91 731 498 7720</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C9A24D] shrink-0" />
                <span>reservations@panchtaradining.in</span>
              </div>
            </div>
            <p className="text-[11px] text-[#6E6557] pt-1">
              For banquet & large family celebrations (&gt;25 guests), contact our manager directly.
            </p>
          </div>

        </div>

        {/* Quiet Copyright and Links */}
        <div className="border-t border-[#17120C] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} Panchtara Dining. All rights reserved.</span>
            <span aria-hidden="true">·</span>
            <span>Pure Vegetarian Excellence</span>
          </div>
          <div className="flex items-center gap-4 text-[#6E6557]">
            <a href="#reservations" className="hover:text-[#C9A24D] transition-colors">Advance Booking</a>
            <a href="#menu" className="hover:text-[#C9A24D] transition-colors">Direct Kitchen Order</a>
            <a href="#experience" className="hover:text-[#C9A24D] transition-colors">Dining Philosophy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
