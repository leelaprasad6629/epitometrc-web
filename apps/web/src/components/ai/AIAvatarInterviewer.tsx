"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

interface AIAvatarInterviewerProps {
  isSpeaking: boolean;
  onBoundaryEvent?: (event: any) => void;
}

export default function AIAvatarInterviewer({ isSpeaking }: AIAvatarInterviewerProps) {
  const [isBlinking, setIsBlinking] = useState(false);

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

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Dynamic Avatar frame */}
      <div 
        className={`relative w-full aspect-square rounded-3xl border overflow-hidden bg-slate-950 shadow-lg transition-all duration-500 ${
          isSpeaking 
            ? "border-violet-500/50 shadow-[0_0_30px_rgba(139,92,246,0.25)]" 
            : "border-slate-800"
        }`}
      >
        {/* Pulsing glow ring backdrop when speaking */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ 
                opacity: [0.4, 0.7, 0.4],
                scale: [1, 1.03, 1],
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-violet-600/10 rounded-3xl pointer-events-none z-10 blur-xl"
            />
          )}
        </AnimatePresence>

        {/* Breathing Base Portrait */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url('/images/avatar_sophia.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            animation: isSpeaking ? "speakBob 3.5s ease-in-out infinite" : "idleBob 5s ease-in-out infinite",
          }}
        >
          {/* SVG Overlay for blinking eyes */}
          <svg 
            viewBox="0 0 100 100" 
            className="absolute inset-0 w-full h-full select-none pointer-events-none"
          >
            {/* Blinking Left Eyelid */}
            <AnimatePresence>
              {isBlinking && (
                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  d="M 41.5 43.5 Q 44.5 42 47.5 43.5 Q 44.5 45 41.5 43.5"
                  fill="#df9f84" 
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
                  d="M 52.5 43.5 Q 55.5 42 58.5 43.5 Q 55.5 45 52.5 43.5"
                  fill="#df9f84"
                  className="blur-[0.2px]"
                />
              )}
            </AnimatePresence>
          </svg>
        </div>

        {/* HUD Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-[9px] font-black text-slate-200 font-mono tracking-widest border border-slate-800 z-20">
          <div className={`h-1.5 w-1.5 rounded-full ${isSpeaking ? "bg-violet-500 animate-ping" : "bg-emerald-500 animate-pulse"}`} />
          {isSpeaking ? "AI SPEAKING" : "AI LISTENING"}
        </div>

        {/* HUD Indicator Bottom */}
        <div className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center border border-slate-800 shadow-md z-20">
          {isSpeaking ? (
            <Volume2 className="h-4 w-4 text-violet-400 animate-bounce" />
          ) : (
            <VolumeX className="h-4 w-4 text-slate-500" />
          )}
        </div>

        {/* Voice Waves Overlay (Siri Style) */}
        {isSpeaking && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-end gap-1.5 h-6 z-20 bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-full shadow-lg">
            {[1, 2, 3, 4, 5].map((item) => (
              <motion.div 
                key={item}
                animate={{ 
                  height: [6, 16, 6],
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 0.6 + item * 0.1,
                  ease: "easeInOut"
                }}
                className="w-1 rounded-full bg-violet-400"
              />
            ))}
          </div>
        )}
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
