"use client";

import { useEffect, useRef } from "react";

type AudioVisualizerProps = {
  isListening: boolean;
};

export default function AudioVisualizer({ isListening }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let useRealMic = false;

    // Attempt to initialize microphone analyzer
    const setupMicrophone = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("getUserMedia not supported");
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        audioContextRef.current = audioCtx;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        useRealMic = true;
      } catch (err) {
        console.warn("Microphone not available, using high-fidelity math simulation instead:", err);
        useRealMic = false;
      }
    };

    if (isListening) {
      setupMicrophone();
    }

    // Mathematical simulation variables
    let phase = 0;

    const render = () => {
      const width = rect.width;
      const height = rect.height;

      // Clear with soft premium transparent backdrop
      ctx.clearRect(0, 0, width, height);

      if (useRealMic && analyserRef.current) {
        // Real mic data rendering
        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        // Draw multiple layered waves from time domain data
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(16, 185, 129, 0.7)"; // Emerald theme green
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(16, 185, 129, 0.4)";
        ctx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0; // normalized
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();

        // Layer 2: Frequency bars
        const freqArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(freqArray);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(59, 130, 246, 0.15)"; // Soft blue glowing bars
        
        const barWidth = (width / bufferLength) * 1.5;
        let barX = 0;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (freqArray[i] / 255) * (height / 2);
          ctx.fillRect(barX, height / 2 - barHeight / 2, barWidth - 2, barHeight);
          barX += barWidth;
        }

      } else {
        // High fidelity math-simulation (resembles advanced voice systems)
        phase += 0.1;
        ctx.shadowBlur = 12;

        const drawSineWave = (amplitude: number, color: string, frequency: number, offset: number) => {
          ctx.strokeStyle = color;
          ctx.shadowColor = color;
          ctx.lineWidth = 1.8;
          ctx.beginPath();

          for (let x = 0; x < width; x++) {
            const angle = (x / width) * Math.PI * frequency + phase + offset;
            // Dampen amplitude at boundaries (ends of the visualizer card)
            const dampening = Math.sin((x / width) * Math.PI); 
            const y = height / 2 + Math.sin(angle) * amplitude * dampening * (isListening ? 1.0 : 0.08);

            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        };

        // Draw three distinct colorful layers with matching offset speeds
        drawSineWave(22, "rgba(6, 182, 212, 0.65)", 3, 0);       // Cyan Wave
        drawSineWave(15, "rgba(99, 102, 241, 0.5)", 4.5, Math.PI / 3); // Indigo Wave
        drawSineWave(8, "rgba(236, 72, 153, 0.45)", 6, -Math.PI / 4);  // Pink Wave
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    // Clean up connections on release
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isListening]);

  return (
    <div className="relative w-full h-20 rounded-xl overflow-hidden bg-slate-900/90 border border-slate-800 p-2 shadow-inner flex items-center justify-center">
      <div className="absolute top-2 left-3 flex items-center gap-1.5 z-10">
        <span className={`h-1.5 w-1.5 rounded-full ${isListening ? "bg-emerald-500 animate-ping" : "bg-slate-500"}`} />
        <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider">
          {isListening ? "Analyzing Speech Frequencies" : "Microphone Idle"}
        </span>
      </div>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
