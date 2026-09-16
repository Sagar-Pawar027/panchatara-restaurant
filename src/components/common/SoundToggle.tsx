import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export function SoundToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const stopAudio = () => {
    try {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
      }
      setTimeout(() => {
        oscillatorsRef.current.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // ignore if already stopped
          }
        });
        oscillatorsRef.current = [];
        if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.close();
          audioCtxRef.current = null;
        }
      }, 600);
    } catch {
      // ignore cleanup errors
    }
    setIsPlaying(false);
  };

  const startAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 2);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Soft meditative warm Indian drone frequencies (Tanpura C# fundamental harmonic notes: 138.59 Hz, 207.65 Hz, 277.18 Hz)
      const frequencies = [138.59, 207.65, 277.18, 415.3];
      const oscs: OscillatorNode[] = [];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const oscGain = ctx.createGain();
        oscGain.gain.value = idx === 0 ? 0.6 : 0.25;
        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start();
        oscs.push(osc);
      });

      oscillatorsRef.current = oscs;
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <button
      id="sound-ambient-toggle-btn"
      onClick={toggleSound}
      aria-label={isPlaying ? 'Mute ambient restaurant soundscape' : 'Play ambient restaurant soundscape'}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs uppercase tracking-widest text-[#FAF7F2]/80 hover:text-[#C5A880] transition-colors rounded-full border border-white/10 hover:border-[#C5A880]/40 bg-black/30 backdrop-blur-sm"
      title={isPlaying ? 'Mute ambient soundscape' : 'Listen to ambient Tanpura soundscape'}
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-[#C5A880] animate-pulse" />
          <span className="hidden sm:inline text-[10px]">Ambient On</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-white/50" />
          <span className="hidden sm:inline text-[10px] text-white/50">Ambience</span>
        </>
      )}
    </button>
  );
}
