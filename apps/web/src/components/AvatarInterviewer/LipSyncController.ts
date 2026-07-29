import { useState, useEffect, useRef } from "react";

export interface LipSyncState {
  mouthScaleY: number;
  mouthScaleX: number;
}

export function useLipSync(isSpeaking: boolean) {
  const [mouthScales, setMouthScales] = useState<LipSyncState>({
    mouthScaleY: 0.15,
    mouthScaleX: 1.0,
  });

  const requestRef = useRef<number | null>(null);
  const targetHeightRef = useRef<number>(0.15);
  const targetWidthRef = useRef<number>(1.0);
  const currentHeightRef = useRef<number>(0.15);
  const currentWidthRef = useRef<number>(1.0);
  const lastTargetChangeRef = useRef<number>(0);

  useEffect(() => {
    const animate = (time: number) => {
      if (isSpeaking) {
        // Change viseme targets every 100-140ms for conversational pacing
        if (time - lastTargetChangeRef.current > 120) {
          // Speak targets: random height (between 0.2 and 1.0) and width (between 0.85 and 1.15)
          targetHeightRef.current = 0.2 + Math.random() * 0.8;
          targetWidthRef.current = 0.85 + Math.random() * 0.3;
          lastTargetChangeRef.current = time;
        }

        // Interpolate smoothly towards targets (lerp factor ~0.2)
        currentHeightRef.current += (targetHeightRef.current - currentHeightRef.current) * 0.22;
        currentWidthRef.current += (targetWidthRef.current - currentWidthRef.current) * 0.22;
      } else {
        // Return to standard smile / closed state immediately but smoothly (lerp factor ~0.3)
        targetHeightRef.current = 0.15;
        targetWidthRef.current = 1.0;
        
        currentHeightRef.current += (targetHeightRef.current - currentHeightRef.current) * 0.3;
        currentWidthRef.current += (targetWidthRef.current - currentWidthRef.current) * 0.3;
      }

      setMouthScales({
        mouthScaleY: currentHeightRef.current,
        mouthScaleX: currentWidthRef.current,
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isSpeaking]);

  return mouthScales;
}
