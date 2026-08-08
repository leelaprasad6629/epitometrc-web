import React from "react";
import { useAvatarAnimation } from "./AvatarAnimations";
import { useLipSync } from "./LipSyncController";

interface AvatarCanvasProps {
  isSpeaking: boolean;
  stateName?: "Speaking" | "Listening" | "Recording" | "Evaluating" | "Preparing" | "Idle";
}

export default function AvatarCanvas({ isSpeaking, stateName = "Idle" }: AvatarCanvasProps) {
  const animations = useAvatarAnimation();
  const lipSync = useLipSync(isSpeaking);

  // Derive active halo/pulse colors based on status state
  const getHaloColor = () => {
    switch (stateName) {
      case "Speaking":
        return "rgba(249, 115, 22, 0.4)"; // Orange
      case "Listening":
        return "rgba(217, 119, 6, 0.4)"; // Gold/Amber
      case "Recording":
        return "rgba(239, 68, 68, 0.4)"; // Red
      case "Evaluating":
        return "rgba(99, 102, 241, 0.4)"; // Indigo
      case "Preparing":
        return "rgba(16, 185, 129, 0.4)"; // Emerald
      default:
        return "rgba(148, 163, 184, 0.2)"; // Slate
    }
  };

  const getHaloRadius = () => {
    if (isSpeaking) {
      // expand and contract with mouth scale for dynamic voice impact
      return 28 + lipSync.mouthScaleY * 4;
    }
    if (stateName === "Listening" || stateName === "Recording") {
      return 28;
    }
    return 26;
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#F5F5F4] rounded-3xl overflow-hidden shadow-inner border border-slate-200">
      {/* Background Gradient */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="bg-grad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FAF9F6" />
            <stop offset="60%" stopColor="#F5F4F0" />
            <stop offset="100%" stopColor="#EFEFE9" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#bg-grad)" />
      </svg>

      {/* Floating high-tech particle grid backdrop */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Main Avatar SVG */}
      <svg
        className="w-full h-full max-h-[460px] z-10 drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradients and Filters for realistic styling */}
          <linearGradient id="skin-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffeedd" />
            <stop offset="100%" stopColor="#ffd8c0" />
          </linearGradient>
          
          <linearGradient id="suit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          <linearGradient id="hair-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#221e1d" />
            <stop offset="100%" stopColor="#0e0d0c" />
          </linearGradient>

          <linearGradient id="tie-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>

          <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.25" />
          </filter>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* 1. Dynamic Halo Background Ring (glowing status indicator) */}
        <circle
          cx="50"
          cy="48"
          r={getHaloRadius()}
          className={(stateName === "Listening" || stateName === "Recording") ? "animate-pulse" : ""}
          fill="none"
          stroke={getHaloColor()}
          strokeWidth="1.5"
          filter="url(#glow)"
          style={{ transition: "stroke 0.4s ease, stroke-width 0.4s ease" }}
        />
        <circle
          cx="50"
          cy="48"
          r={getHaloRadius() + 4}
          fill="none"
          stroke={getHaloColor()}
          strokeWidth="0.5"
          strokeDasharray="4 6"
          opacity="0.6"
          style={{ transformOrigin: "50px 48px", animation: "spin 25s linear infinite" }}
        />

        {/* 2. Neck connection (behind head and suit) */}
        <path
          d={`M 45 62 L 45 76 C 45 76, 50 78, 55 76 L 55 62 Z`}
          fill="#ffd0b4"
          stroke="#e0ab8e"
          strokeWidth="0.2"
          transform={`translate(${animations.headX * 0.5}, ${animations.headY * 0.5}) rotate(${animations.headRotate * 0.5}, 50, 68)`}
        />
        <path
          d={`M 45 69 Q 50 71 55 69 L 55 76 Q 50 78 45 76 Z`}
          fill="#ffd0b4"
          opacity="0.85"
          transform={`translate(${animations.headX * 0.5}, ${animations.headY * 0.5}) rotate(${animations.headRotate * 0.5}, 50, 68)`}
        />

        {/* 3. Shoulders and Corporate Attire (Breathing Shift) */}
        <g transform={`translate(0, ${animations.shoulderY})`}>
          {/* Suit Jacket */}
          <path
            d="M 12 100 C 16 80, 26 71, 50 71 C 74 71, 84 80, 88 100 Z"
            fill="url(#suit-grad)"
            stroke="#0b1329"
            strokeWidth="0.5"
          />

          {/* White Shirt Collar V */}
          <path
            d="M 40 71 L 50 86 L 60 71 Z"
            fill="#ffffff"
            stroke="#e2e8f0"
            strokeWidth="0.25"
          />

          {/* Red Professional Tie */}
          <path
            d="M 47.5 86 L 52.5 86 L 54 99 L 50 100 L 46 99 Z"
            fill="url(#tie-grad)"
            filter="url(#soft-shadow)"
          />

          {/* Suit Lapels */}
          <path d="M 28 73 L 42 85 L 43 90" fill="none" stroke="#334155" strokeWidth="0.75" />
          <path d="M 72 73 L 58 85 L 57 90" fill="none" stroke="#334155" strokeWidth="0.75" />
        </g>

        {/* 4. Head Group (Rotates and shifts randomly for natural posture) */}
        <g transform={`translate(${animations.headX}, ${animations.headY}) rotate(${animations.headRotate}, 50, 48)`}>
          
          {/* Ears */}
          <ellipse cx="32" cy="48" rx="2" ry="3.5" fill="#f8c8a8" stroke="#dfb094" strokeWidth="0.2" />
          <ellipse cx="68" cy="48" rx="2" ry="3.5" fill="#f8c8a8" stroke="#dfb094" strokeWidth="0.2" />

          {/* Face Base */}
          <path
            d="M 33 46 C 33 60, 39 67, 50 67 C 61 67, 67 60, 67 46 C 67 33, 61 29, 50 29 C 39 29, 33 33, 33 46 Z"
            fill="url(#skin-grad)"
            stroke="#dfb094"
            strokeWidth="0.2"
          />

          {/* Cheeks blush (subtle, friendly) */}
          <ellipse cx="38" cy="51" rx="2.5" ry="1.5" fill="#ef4444" opacity="0.08" />
          <ellipse cx="62" cy="51" rx="2.5" ry="1.5" fill="#ef4444" opacity="0.08" />

          {/* Nose Bridge and Tip */}
          <path
            d="M 48.5 44 Q 50 51 50.5 51 Q 50 52 49 51"
            fill="none"
            stroke="#dfb094"
            strokeWidth="0.65"
            strokeLinecap="round"
          />

          {/* Eyes Group (includes pupil shifts and blinks) */}
          {/* Left Eye */}
          <g transform="translate(42, 44)">
            {/* Eye White */}
            <ellipse cx="0" cy="0" rx="3.2" ry="1.8" fill="#ffffff" stroke="#c7ad99" strokeWidth="0.15" />
            {/* Eyelid Scale Container (Blinks by shrinking vertically) */}
            <g transform={`scale(1, ${animations.eyelidScaleY})`}>
              {/* Colored Iris */}
              <circle cx={animations.pupilX} cy={animations.pupilY} r="1.4" fill="#ea580c" />
              {/* Pupil */}
              <circle cx={animations.pupilX} cy={animations.pupilY} r="0.85" fill="#0f172a" />
              {/* Glare/Highlight */}
              <circle cx={animations.pupilX - 0.4} cy={animations.pupilY - 0.4} r="0.3" fill="#ffffff" />
            </g>
            {/* Top lash line */}
            <path d="M -3.5 -0.5 Q 0 -1.8 3.5 -0.5" fill="none" stroke="#2c2725" strokeWidth="0.45" />
          </g>

          {/* Right Eye */}
          <g transform="translate(58, 44)">
            {/* Eye White */}
            <ellipse cx="0" cy="0" rx="3.2" ry="1.8" fill="#ffffff" stroke="#c7ad99" strokeWidth="0.15" />
            {/* Eyelid Scale Container */}
            <g transform={`scale(1, ${animations.eyelidScaleY})`}>
              {/* Colored Iris */}
              <circle cx={animations.pupilX} cy={animations.pupilY} r="1.4" fill="#ea580c" />
              {/* Pupil */}
              <circle cx={animations.pupilX} cy={animations.pupilY} r="0.85" fill="#0f172a" />
              {/* Glare/Highlight */}
              <circle cx={animations.pupilX - 0.4} cy={animations.pupilY - 0.4} r="0.3" fill="#ffffff" />
            </g>
            {/* Top lash line */}
            <path d="M -3.5 -0.5 Q 0 -1.8 3.5 -0.5" fill="none" stroke="#2c2725" strokeWidth="0.45" />
          </g>

          {/* Eyebrows (raise slightly when speaking) */}
          <path
            d="M 37.5 40.5 Q 42 38.5 45.5 41"
            fill="none"
            stroke="#221e1d"
            strokeWidth="0.6"
            strokeLinecap="round"
            transform={`translate(0, ${isSpeaking ? -0.4 : 0})`}
          />
          <path
            d="M 62.5 40.5 Q 58 38.5 54.5 41"
            fill="none"
            stroke="#221e1d"
            strokeWidth="0.6"
            strokeLinecap="round"
            transform={`translate(0, ${isSpeaking ? -0.4 : 0})`}
          />

          {/* Mouth (Lip-Synced) */}
          <g transform="translate(50, 57)">
            {/* Inner mouth cavity (visible only when speaking/open) */}
            <ellipse
              cx="0"
              cy="0.5"
              rx="4"
              ry={Math.max(0.1, lipSync.mouthScaleY * 2)}
              fill="#5c1a1a"
              opacity={lipSync.mouthScaleY > 0.18 ? 1 : 0}
            />
            {/* Upper Teeth */}
            <rect
              x="-2"
              y={-Math.max(0, lipSync.mouthScaleY * 0.2)}
              width="4"
              height="0.65"
              fill="#ffffff"
              opacity={lipSync.mouthScaleY > 0.3 ? 0.95 : 0}
            />
            {/* Lower Teeth */}
            <rect
              x="-1.5"
              y={Math.max(0.1, lipSync.mouthScaleY * 0.9)}
              width="3"
              height="0.45"
              fill="#ffffff"
              opacity={lipSync.mouthScaleY > 0.5 ? 0.95 : 0}
            />
            {/* Lips path: scales width (scaleX) and height (scaleY) */}
            <path
              d={`M -4.5 0 Q 0 ${lipSync.mouthScaleY * 2.8} 4.5 0 Q 0 ${-lipSync.mouthScaleY * 0.8} -4.5 0`}
              fill="none"
              stroke="#ca8a78"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Smile lines */}
            <path d="M -5.2 -0.2 Q -4.5 0 -4 0.2" fill="none" stroke="#ca8a78" strokeWidth="0.35" opacity="0.6" />
            <path d="M 5.2 -0.2 Q 4.5 0 4 0.2" fill="none" stroke="#ca8a78" strokeWidth="0.35" opacity="0.6" />
          </g>

          {/* Hair & Fringe (Placed last to layer over face) */}
          <path
            d="M 31 43 C 30 29, 39 23, 50 23 C 61 23, 70 29, 69 43 C 71 41, 70.5 34, 66.5 30 C 61 24, 39 24, 33.5 30 C 29.5 34, 29 41, 31 43 Z"
            fill="url(#hair-grad)"
            filter="url(#soft-shadow)"
          />
          {/* Sideburns */}
          <path d="M 32.5 42 L 33.5 48 L 35 48 Z" fill="url(#hair-grad)" />
          <path d="M 67.5 42 L 66.5 48 L 65 48 Z" fill="url(#hair-grad)" />
          
        </g>
      </svg>
    </div>
  );
}
