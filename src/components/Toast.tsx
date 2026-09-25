import React from 'react';
import { CheckCircle2, Copy, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  title: string;
  message: string;
  referenceId?: string;
  onClose: (id: string) => void;
  onCopyReference?: (ref: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  referenceId,
  onClose,
  onCopyReference,
}) => {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 w-full max-w-md p-4 rounded-xl bg-[#16130E] border border-[#C9A24D]/40 text-[#E8DFD0] shadow-2xl shadow-black/80 transition-all duration-300 pointer-events-auto"
    >
      <div className="p-1 rounded-full bg-[#C9A24D]/15 text-[#C9A24D] shrink-0 mt-0.5">
        <CheckCircle2 className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-[#F7E7CE] tracking-wide">{title}</h4>
        <p className="text-xs text-[#A89F91] mt-0.5 leading-relaxed">{message}</p>
        
        {referenceId && (
          <div className="mt-2.5 flex items-center justify-between gap-2 p-2 rounded-lg bg-[#0D0B08] border border-[#C9A24D]/20">
            <div className="text-xs">
              <span className="text-[#8C8273] block text-[10px] uppercase tracking-wider">Booking Reference</span>
              <span className="font-mono font-bold text-[#E6C687] text-xs sm:text-sm tracking-wider">{referenceId}</span>
            </div>
            {onCopyReference && (
              <button
                type="button"
                onClick={() => onCopyReference(referenceId)}
                className="px-2 py-1 text-xs font-medium text-[#C9A24D] hover:text-white bg-[#C9A24D]/10 hover:bg-[#C9A24D]/25 rounded transition-colors flex items-center gap-1 shrink-0"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
            )}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onClose(id)}
        className="text-[#8C8273] hover:text-white p-1 rounded-md transition-colors shrink-0"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
