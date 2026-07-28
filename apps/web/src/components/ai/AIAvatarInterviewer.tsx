"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Sparkles } from "lucide-react";

interface AIAvatarInterviewerProps {
  isSpeaking: boolean;
  onBoundaryEvent?: (event: any) => void;
}

// Viseme SVG path coordinates mapped to a 100x100 grid matching avatar_sophia.jpg
const VISEMES = {
  closed: "M 44 62 Q 50 62 56 62 Q 50 63 44 62",
  openA: "M 44 61 Q 50 55 56 61 Q 50 67 44 61",
  wideE: "M 42 62 Q 50 59 58 62 Q 50 64 42 62",
  roundO: "M 46 62 Q 50 57 54 62 Q 50 66 46 62",
};

export default function AIAvatarInterviewer({ isSpeaking }: AIAvatarInterviewerProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [currentViseme, setCurrentViseme] = useState<keyof typeof VISEMES>("closed");
  const speakIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Blinking loop (natural eyes blink every 3 to 6 seconds)
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 150); // Blink duration 150ms

      const nextDelay = 3000 + Math.random() * 3000;
      blinkTimeout = setTimeout(triggerBlink, nextDelay);
    };

    blinkTimeout = setTimeout(triggerBlink, 3000);
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Lip-sync speech animation loop
  useEffect(() => {
    if (isSpeaking) {
      const visemeKeys: (keyof typeof VISEMES)[] = ["openA", "wideE", "roundO"];
      
      speakIntervalRef.current = setInterval(() => {
        const randomViseme = visemeKeys[Math.floor(Math.random() * visemeKeys.length)];
        setCurrentViseme(randomViseme);
      }, 120); // Sync rate (conversational syllable frequency)
    } else {
      if (speakIntervalRef.current) {
        clearInterval(speakIntervalRef.current);
      }
      setCurrentViseme("closed");
    }

    return () => {
      if (speakIntervalRef.current) {
        clearInterval(speakIntervalRef.current);
      }
    };
  }, [isSpeaking]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Dynamic Avatar frame */}
      <div 
        className={`relative w-full aspect-square rounded-3xl border overflow-hidden bg-slate-950 shadow-lg transition-all duration-500 ${
          isSpeaking 
            ? "border-violet-500/40 shadow-[0_0_20px_rgba(139,92,246,0.15)]" 
            : "border-slate-800"
        }`}
      >
        {/* Breathing Base Portrait */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url('/images/avatar_sophia.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            animation: isSpeaking ? "speakBob 3s ease-in-out infinite" : "idleBob 5s ease-in-out infinite",
          }}
        >
          {/* SVG Overlay for blinking eyes and lip-syncing mouth */}
          <svg 
            viewBox="0 0 100 100" 
            className="absolute inset-0 w-full h-full select-none pointer-events-none"
            style={{
              animation: isSpeaking ? "speakBob 3s ease-in-out infinite" : "idleBob 5s ease-in-out infinite",
            }}
          >
            {/* Blinking Left Eyelid */}
            <AnimatePresence>
              {isBlinking && (
                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  d="M 40.5 43 Q 43.5 41.5 46.5 43 Q 43.5 44.5 40.5 43"
                  fill="#de9e83" 
                  className="blur-[0.2px]"
                />
              )}
            </AnimatePresence>

            {/* Blinking Right Eyelid */}
            <AnimatePresence>
              {isBlinking && (
                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  d="M 53.5 43 Q 56.5 41.5 59.5 43 Q 56.5 44.5 53.5 43"
                  fill="#de9e83"
                  className="blur-[0.2px]"
                />
              )}
            </AnimatePresence>

            {/* Lip-Synced Talking Mouth */}
            <motion.path
              animate={{ d: VISEMES[currentViseme] }}
              transition={{ duration: 0.08, ease: "easeInOut" }}
              fill="#421217"
              stroke="#be7f6d"
              strokeWidth="0.8"
              className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
            />
          </svg>
        </div>

        {/* HUD Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-[9px] font-black text-slate-200 font-mono tracking-widest border border-slate-800">
          <div className={`h-1.5 w-1.5 rounded-full ${isSpeaking ? "bg-violet-500 animate-ping" : "bg-emerald-500 animate-pulse"}`} />
          {isSpeaking ? "AI SPEAKING" : "AI LISTENING"}
        </div>

        {/* HUD Indicator Bottom */}
        <div className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center border border-slate-800 shadow-md">
          {isSpeaking ? (
            <Volume2 className="h-4 w-4 text-violet-400 animate-bounce" />
          ) : (
            <VolumeX className="h-4 w-4 text-slate-500" />
          )}
        </div>
      </div>

      {/* Styled animation keyframes */}
      <style jsx global>{`
        @keyframes idleBob {
          0% { transform: scale(1) translateY(0px); }
          50% { transform: scale(1.008) translateY(-0.8px); }
          100% { transform: scale(1) translateY(0px); }
        }
        @keyframes speakBob {
          0% { transform: scale(1.005) translateY(0px) rotate(0deg); }
          25% { transform: scale(1.01) translateY(-0.5px) rotate(0.15deg); }
          75% { transform: scale(1.005) translateY(0.5px) rotate(-0.15deg); }
          100% { transform: scale(1.005) translateY(0px) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
