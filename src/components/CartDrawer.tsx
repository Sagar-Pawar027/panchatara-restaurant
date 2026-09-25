import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>('dine-in');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderRef, setOrderRef] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const estimatedSavings = Math.round(subtotal * 0.18); // ~18% savings vs third party delivery markups
  const gst = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = subtotal + gst;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    const ref = `PANJ-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderRef(ref);
    setOrderConfirmed(true);
  };

  const handleResetOrder = () => {
    setOrderConfirmed(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-[#130F0C] border-l border-[#2B231B] text-[#E8DFD0] h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#261E14] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold font-display text-[#F7E7CE]">Direct Kitchen Order</h3>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
              0% Markup
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8C8273] hover:text-white rounded-lg hover:bg-[#201A14] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {orderConfirmed ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold font-display text-[#F7E7CE]">Order Received by Kitchen!</h4>
              <p className="text-xs text-[#A89F91]">
                Thank you, {customerName}. The chefs at Panchtara Indore Bypass are preparing your dishes fresh in clay handis.
              </p>
              
              <div className="p-4 rounded-xl bg-[#0D0A08] border border-[#C9A24D]/30 max-w-xs mx-auto">
                <span className="text-[10px] uppercase text-[#8C8273] block">Order Token Number</span>
                <span className="text-xl font-mono font-bold text-[#E6C687]">{orderRef}</span>
              </div>

              <div className="text-xs text-[#8C8273]">
                Total Paid / Payable: <strong className="text-[#F7E7CE]">₹{grandTotal}</strong> ({orderType === 'dine-in' ? 'Dine-In Table' : 'Highway Takeaway'})
              </div>

              <button
                type="button"
                onClick={handleResetOrder}
                className="w-full py-3 px-4 rounded-xl bg-[#C9A24D] text-[#0D0B08] font-bold text-xs uppercase tracking-wider"
              >
                Back to Restaurant Menu
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#1C1610] text-[#8C8273] flex items-center justify-center mx-auto">
                <X className="w-6 h-6" />
              </div>
              <p className="text-sm text-[#A89F91]">Your order bag is empty.</p>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#C9A24D]/15 text-[#C9A24D] hover:bg-[#C9A24D]/25 text-xs font-semibold"
              >
                Browse Signature Dishes
              </button>
            </div>
          ) : (
            <>
              {/* Savings Highlight */}
              <div className="p-3 rounded-xl bg-[#C9A24D]/10 border border-[#C9A24D]/20 text-xs text-[#E6C687] flex items-center justify-between">
                <span>Direct Kitchen Advantage</span>
                <span className="font-bold">You save ~₹{estimatedSavings}</span>
              </div>

              {/* Order Mode */}
              <div className="flex items-center gap-2 p-1 bg-[#17130E] border border-[#2B231B] rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setOrderType('dine-in')}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                    orderType === 'dine-in' ? 'bg-[#C9A24D] text-[#0D0B08] font-bold' : 'text-[#A89F91]'
                  }`}
                >
                  Serve at Reserved Table
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('takeaway')}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                    orderType === 'takeaway' ? 'bg-[#C9A24D] text-[#0D0B08] font-bold' : 'text-[#A89F91]'
                  }`}
                >
                  Highway Express Takeaway
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#17130E] border border-[#261E14] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-[#E8DFD0] truncate">{item.name}</h4>
                      <span className="text-xs font-mono text-[#C9A24D]">₹{item.price * item.quantity}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-[#33271A] rounded-lg bg-[#0F0C09]">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 hover:text-white text-[#8C8273]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-[#E8DFD0]">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 hover:text-white text-[#8C8273]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 text-[#8C8273] hover:text-red-400"
                        title="Remove dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Checkout Form */}
              <form onSubmit={handleCheckout} id="cart-form" className="space-y-3 pt-3 border-t border-[#261E14]">
                <h4 className="text-xs font-semibold text-[#C4B9A7] uppercase tracking-wider">
                  Contact for Kitchen Prep
                </h4>
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#0D0A08] border border-[#2B231B] text-[#E8DFD0] focus:outline-none focus:border-[#C9A24D]"
                  required
                />
                <input
                  type="tel"
                  placeholder="WhatsApp Mobile Number *"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#0D0A08] border border-[#2B231B] text-[#E8DFD0] focus:outline-none focus:border-[#C9A24D]"
                  required
                />
              </form>
            </>
          )}
        </div>

        {/* Footer & Checkout Bar */}
        {!orderConfirmed && items.length > 0 && (
          <div className="p-5 border-t border-[#261E14] bg-[#0F0C09] space-y-3">
            <div className="space-y-1.5 text-xs text-[#A89F91]">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items):</span>
                <span className="text-[#E8DFD0] font-mono tabular-nums">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5% Satvik Kitchen):</span>
                <span className="text-[#E8DFD0] font-mono tabular-nums">₹{gst}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#F7E7CE] pt-1.5 border-t border-[#221A12]">
                <span>Total Amount:</span>
                <span className="text-[#C9A24D] font-mono tabular-nums">₹{grandTotal}</span>
              </div>
            </div>

            <button
              form="cart-form"
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C9A24D] to-[#9E7726] hover:from-[#D8B45E] hover:to-[#B38A34] text-[#0D0B08] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-98"
            >
              <span>Transmit Order to Kitchen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
