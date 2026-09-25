import React from 'react';

export const ThemeStickers: React.FC = () => {
  return (
    <aside aria-label="Authenticity badge" className="fixed top-24 right-4 sm:right-8 z-30 pointer-events-none hidden lg:block">
      <div className="relative w-28 h-28 rounded-full border border-[#C5A880]/40 bg-[#12110F]/80 backdrop-blur-md p-2 flex items-center justify-center text-center shadow-2xl animate-[spin_40s_linear_infinite]">
        {/* Outer Circular SVG Text */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <path
            id="textPath"
            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
            fill="none"
          />
          <text className="text-[7.5px] uppercase tracking-[0.22em] fill-[#C5A880] font-mono">
            <textPath href="#textPath" startOffset="0%">
              ★ PANCHTARA PURE VEG ★ INDORE BYPASS ★ ESTD
            </textPath>
          </text>
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 m-auto w-16 h-16 rounded-full border border-[#C5A880]/30 flex flex-col items-center justify-center bg-[#1A1815]/90">
          <div className="flex items-center gap-0.5 text-[8px] text-[#C5A880] leading-none mb-0.5">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>
          <span className="font-editorial-serif text-[8.5px] font-bold text-[#FAF7F2] tracking-wider uppercase leading-tight">
            PANCHTARA
          </span>
          <span className="text-[6.5px] font-mono text-[#C5A880] tracking-widest uppercase">
            ROYAL VEG
          </span>
        </div>
      </div>
    </aside>
  );
};
