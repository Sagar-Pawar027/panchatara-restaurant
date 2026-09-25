import React, { useEffect, useState } from 'react';
import { CheckCircle2, Copy, Check, X, BookmarkCheck } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
  onViewBooking?: (refId: string) => void;
}

export const ToastNotification: React.FC<ToastProps> = ({ toast, onClose, onViewBooking }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 7000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const handleCopy = (refId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(refId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#121c16] border border-[#d4af37]/40 rounded-xl p-4 shadow-2xl backdrop-blur-md text-white flex items-start gap-3.5 relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[#d4af37]/20 to-transparent pointer-events-none" />

        <div className="p-2 rounded-full bg-[#1b2b21] text-[#d4af37] shrink-0 mt-0.5">
          <BookmarkCheck className="w-5 h-5 text-[#d4af37]" />
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-[#e8eaed]">{toast.title}</h4>
          </div>
          <p className="text-xs text-[#a0aec0] mt-1 leading-relaxed">{toast.message}</p>

          {toast.referenceId && (
            <div className="mt-2.5 flex items-center gap-2 p-2 rounded-lg bg-[#0b120e] border border-[#23352a]">
              <span className="text-[11px] text-[#8e9f94] font-medium">Booking ID:</span>
              <span className="text-xs font-mono font-bold text-[#d4af37] tracking-wider select-all">
                {toast.referenceId}
              </span>
              <button
                type="button"
                onClick={(e) => handleCopy(toast.referenceId!, e)}
                className="ml-auto inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-[#1b2b21] hover:bg-[#283f31] text-[#d4af37] transition-colors"
                title="Copy reference ID"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}

          {toast.referenceId && onViewBooking && (
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  onViewBooking(toast.referenceId!);
                  onClose();
                }}
                className="text-xs font-medium text-[#d4af37] hover:underline"
              >
                View Full Reservation Slip →
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-[#718096] hover:text-white p-1 rounded-md transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
