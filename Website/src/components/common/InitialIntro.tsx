import { useEffect } from 'react';

interface InitialIntroProps {
  onComplete?: () => void;
}

export function InitialIntro({ onComplete }: InitialIntroProps) {
  useEffect(() => {
    onComplete?.();
  }, [onComplete]);

  return null;
}
