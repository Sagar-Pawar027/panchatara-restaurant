import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Award, ShieldCheck, Flame, Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';

/**
 * 1. Royal Rotating Crest Sticker
 * Features a continuously rotating circular typographic ring with 5 royal stars,
 * golden wax seal edge, gentle 3D floating bob, and interactive hover response.
 */
export function RoyalCrestSticker({
  className = '',
  size = 'md',
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const { language } = useLanguage();
  const isHi = language === 'hi';
  const [isTapped, setIsTapped] = useState(false);

  const sizeClasses = {
    sm: 'w-24 h-24 text-[8px]',
    md: 'w-32 h-32 sm:w-36 sm:h-36 text-[10px]',
    lg: 'w-40 h-40 sm:w-44 sm:h-44 text-[11px]',
  }[size];

  return (
    <motion.div
      animate={{
        y: [-5, 6, -5],
        rotate: [-1.5, 2, -1.5],
      }}
      transition={{
        y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
      }}
      whileHover={{ scale: 1.08, rotate: 0 }}
      whileTap={{ scale: 0.94 }}
      onClick={() => setIsTapped(!isTapped)}
      className={`relative select-none cursor-pointer rounded-full ${sizeClasses} ${className}`}
      title="Panchtara Royal Heritage Certified"
    >
      {/* Outer Golden Glow & Wax Shadow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#C5A880]/30 to-[#F5E7CC]/40 blur-md pointer-events-none opacity-60" />

      {/* Main Sticker Disc */}
      <div className="relative w-full h-full rounded-full bg-[#161411] border-2 border-[#C5A880] shadow-[0_12px_30px_rgba(0,0,0,0.7),inset_0_1px_3px_rgba(255,255,255,0.2)] p-1.5 flex items-center justify-center overflow-hidden">
        {/* Shimmer Light Bar */}
        <motion.div
          animate={{
            x: ['-140%', '160%'],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            repeatDelay: 2,
            ease: 'easeInOut',
          }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
        />

        {/* Outer Rotating SVG Circular Text */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <svg viewBox="0 0 140 140" className="w-full h-full">
            <path
              id="sticker-text-path"
              d="M 70, 70 m -52, 0 a 52,52 0 1,1 104,0 a 52,52 0 1,1 -104,0"
              fill="none"
            />
            <text
              fill="#C5A880"
              fontSize="9"
              letterSpacing="2.2"
              fontWeight="600"
              className="uppercase font-serif"
            >
              <textPath href="#sticker-text-path" startOffset="0%">
                ★ PANCHTARA PURE VEG ★ INDORE BYPASS ★ ESTD 2024 ★
              </textPath>
            </text>
          </svg>
        </motion.div>

        {/* Center Golden Core */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#2A231B] via-[#1A1713] to-[#12100E] border border-[#C5A880]/50 flex flex-col items-center justify-center p-2 text-center shadow-inner relative z-10">
          <div className="flex items-center gap-0.5 text-[#E6CBA3] mb-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5 fill-[#C5A880] text-[#C5A880]" />
            ))}
          </div>

          <span className="font-editorial-serif text-[11px] sm:text-xs font-bold text-[#FAF7F2] tracking-wider leading-none">
            {isHi ? 'पंचतारा' : 'PANCHTARA'}
          </span>

          <span className="text-[7px] sm:text-[8px] uppercase tracking-widest text-[#C5A880] font-medium mt-0.5">
            {isHi ? 'शाही स्वाद' : 'ROYAL VEG'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 2. Pure Desi Ghee & Slow Handi Badge Sticker
 * Vintage postage-stamp serrated style with subtle hover tilt and gleaming flame.
 */
export function DesiGheeSealSticker({
  className = '',
}: {
  className?: string;
}) {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  return (
    <motion.div
      animate={{
        y: [0, -7, 0],
        rotate: [1, -2, 1],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      whileHover={{ scale: 1.07, rotate: 0 }}
      whileTap={{ scale: 0.95 }}
      className={`relative select-none cursor-pointer inline-block ${className}`}
    >
      {/* Ambient shadow */}
      <div className="absolute inset-0 bg-[#C5A880]/15 rounded-xl blur-lg pointer-events-none" />

      {/* Serrated Postage/Wax Stamp Container */}
      <div className="relative px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#181512] border-2 border-[#C5A880]/80 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-md overflow-hidden">
        {/* Subtle Diagonal Gold Ribbons */}
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-14 h-14 bg-gradient-to-br from-[#C5A880]/25 to-transparent rotate-45 pointer-events-none" />

        <div className="flex items-center gap-2.5">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-900/60 via-amber-700/40 to-amber-500/30 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0 shadow-sm"
          >
            <Flame className="w-4 h-4 fill-amber-400 text-amber-300" />
          </motion.div>

          <div className="space-y-0.5 text-left">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-amber-300">
                {isHi ? 'शुद्ध देशी घी' : 'PURE DESI GHEE'}
              </span>
            </div>

            <p className="font-editorial-serif text-xs text-[#FAF7F2] font-semibold tracking-wide">
              {isHi ? 'धीमी आंच पर पकी हांडी' : 'Slow Clay Handi Simmered'}
            </p>

            <span className="text-[8px] text-white/50 block font-light tracking-wider uppercase">
              100% Shuddh Shakahari • Bicholi Bypass
            </span>
          </div>
        </div>

        {/* Shimmer sweep */}
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 1.5 }}
          className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
        />
      </div>
    </motion.div>
  );
}

/**
 * 3. Satvik & Jain Heritage Seal Sticker
 * Pure green and antique gold certification badge with floating animation.
 */
export function SatvikBadgeSticker({
  className = '',
}: {
  className?: string;
}) {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  return (
    <motion.div
      animate={{
        y: [0, 6, 0],
        rotate: [-2, 1.5, -2],
      }}
      transition={{
        duration: 4.8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      whileHover={{ scale: 1.06, rotate: 0 }}
      whileTap={{ scale: 0.95 }}
      className={`relative select-none cursor-pointer inline-block ${className}`}
    >
      <div className="relative px-3 py-2 sm:px-3.5 sm:py-2.5 bg-[#0e1712] border border-emerald-500/50 rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.5)] flex items-center gap-2 text-left backdrop-blur-md">
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-emerald-400 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-400">
              {isHi ? '100% शुद्ध शाकाहारी' : 'STRICTLY PURE VEG'}
            </span>
            <span className="text-[8px] px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 font-semibold border border-emerald-500/30">
              {isHi ? 'जैन उपलब्ध' : 'JAIN READY'}
            </span>
          </div>
          <p className="text-[8px] sm:text-[9px] text-white/60 tracking-wider font-light">
            No Onion • No Garlic Options Available
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 4. Heritage Malwa Recipe Sticker (Tilted Vintage Stamp)
 */
export function HeritageStampSticker({
  className = '',
}: {
  className?: string;
}) {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  return (
    <motion.div
      animate={{
        y: [-4, 4, -4],
        rotate: [3, 6, 3],
      }}
      transition={{
        duration: 4.2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      whileHover={{ scale: 1.1, rotate: 0 }}
      whileTap={{ scale: 0.95 }}
      className={`relative select-none cursor-pointer inline-block ${className}`}
    >
      <div className="px-3.5 py-2 bg-[#201A14]/90 border border-[#C5A880]/70 rounded-md shadow-xl text-center backdrop-blur-sm relative overflow-hidden">
        <div className="flex items-center justify-center gap-1 text-[#C5A880] mb-0.5">
          <Sparkles className="w-3 h-3 text-[#C5A880]" />
          <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#C5A880]">
            {isHi ? 'शाही विरासत' : 'ROYAL HERITAGE'}
          </span>
        </div>
        <div className="font-editorial-serif text-xs font-bold text-[#FAF7F2] tracking-wide">
          {isHi ? 'मालवा के पारंपरिक मसाले' : 'Artisanal Malwa Spices'}
        </div>
        <span className="text-[7.5px] uppercase tracking-widest text-[#C5A880]/70 block mt-0.5">
          Hand-Pounded Daily
        </span>
      </div>
    </motion.div>
  );
}
