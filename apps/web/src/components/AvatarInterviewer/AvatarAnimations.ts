import { useState, useEffect, useRef } from "react";

export interface AvatarAnimationState {
  shoulderY: number;
  headX: number;
  headY: number;
  headRotate: number;
  pupilX: number;
  pupilY: number;
  eyelidScaleY: number;
}

export function useAvatarAnimation() {
  const [state, setState] = useState<AvatarAnimationState>({
    shoulderY: 0,
    headX: 0,
    headY: 0,
    headRotate: 0,
    pupilX: 0,
    pupilY: 0,
    eyelidScaleY: 1,
  });

  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const nextBlinkTimeRef = useRef<number>(3000); // initial blink in 3s
  const blinkStartRef = useRef<number | null>(null);
  const isBlinkingRef = useRef<boolean>(false);

  useEffect(() => {
    const animate = (time: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = time;
      }
      const elapsed = time - startTimeRef.current;

      // 1. Idle Breathing: Slow 0.25Hz cycle (4s period)
      // Math.sin inputs are in radians. 4s period = 4000ms. Rads per ms = (2 * Math.PI) / 4000 = 0.00157
      const breathingAngle = elapsed * 0.00157;
      const shoulderY = Math.sin(breathingAngle) * 1.5; // moves chest/shoulders up/down 1.5px

      // 2. Head Movement: Layered sine waves for natural-looking slow drift
      // Prime number frequencies keep the cycle from repeating obviously
      const headRotate = 
        Math.sin(elapsed * 0.0006) * 1.0 + 
        Math.cos(elapsed * 0.00095) * 0.6; // rotation in degrees, max ~1.6 deg
      const headX = 
        Math.sin(elapsed * 0.0005) * 1.5 + 
        Math.cos(elapsed * 0.0008) * 1.0; // horizontal drift, max ~2.5px
      const headY = 
        Math.sin(elapsed * 0.0007) * 0.8 + 
        Math.cos(elapsed * 0.00045) * 0.6; // vertical drift, max ~1.4px

      // 3. Eye Pupil Movement: Subtle gaze adjustments
      const pupilX = Math.sin(elapsed * 0.0003) * 0.8;
      const pupilY = Math.cos(elapsed * 0.0004) * 0.4;

      // 4. Eyelid Blink state machine
      let eyelidScaleY = 1.0;
      if (elapsed > nextBlinkTimeRef.current && !isBlinkingRef.current) {
        // Start blink
        isBlinkingRef.current = true;
        blinkStartRef.current = elapsed;
      }

      if (isBlinkingRef.current && blinkStartRef.current !== null) {
        const blinkElapsed = elapsed - blinkStartRef.current;
        const blinkDuration = 160; // 160ms total blink duration
        
        if (blinkElapsed < blinkDuration) {
          // Half down, half up
          if (blinkElapsed < blinkDuration / 2) {
            eyelidScaleY = 1.0 - (blinkElapsed / (blinkDuration / 2));
          } else {
            eyelidScaleY = (blinkElapsed - (blinkDuration / 2)) / (blinkDuration / 2);
          }
          // Ensure within limits
          eyelidScaleY = Math.max(0, Math.min(1, eyelidScaleY));
        } else {
          // End blink
          isBlinkingRef.current = false;
          blinkStartRef.current = null;
          eyelidScaleY = 1.0;
          // Schedule next blink in 2.5 to 5.5 seconds
          nextBlinkTimeRef.current = elapsed + 2500 + Math.random() * 3000;
        }
      }

      setState({
        shoulderY,
        headX,
        headY,
        headRotate,
        pupilX,
        pupilY,
        eyelidScaleY,
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return state;
}
