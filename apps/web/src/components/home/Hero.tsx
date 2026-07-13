"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Torus coordinates parameters
    const R = 150; // Major radius
    const r = 60;  // Minor radius
    const numPoints = 800;
    const points: { theta: number; phi: number; color: string }[] = [];

    for (let i = 0; i < numPoints; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      // Blue to orange gradient color map
      const color = i % 2 === 0 ? "rgba(59, 130, 246, 0.45)" : "rgba(249, 115, 22, 0.45)";
      points.push({ theta, phi, color });
    }

    let angleX = 0;
    let angleY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Rotate torus
      angleX += 0.003;
      angleY += 0.005;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      points.forEach((p) => {
        // Calculate torus coordinates
        const x = (R + r * Math.cos(p.theta)) * Math.cos(p.phi);
        const y = (R + r * Math.cos(p.theta)) * Math.sin(p.phi);
        const z = r * Math.sin(p.theta);

        // 3D Rotations
        // X rotation
        const y1 = y * cosX - z * sinX;
        const z1 = y * sinX + z * cosX;

        // Y rotation
        const x2 = x * cosY - z1 * sinY;
        const z2 = x * sinY + z1 * cosY;

        // Perspective projection scale
        const perspective = 400;
        const scale = perspective / (perspective + z2);
        
        const projX = width / 2 + x2 * scale;
        const projY = height / 2 - 30 + y1 * scale; // Centered slightly higher than middle

        // Renders only visible coordinates within canvas boundary
        if (projX >= 0 && projX <= width && projY >= 0 && projY <= height) {
          ctx.beginPath();
          ctx.arc(projX, projY, 1.8 * scale, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const categories = [
    { name: "PEOPLE AND ORGANISATION CONSULTING", href: "/consulting" },
    { name: "LEADERSHIP ACADEMY", href: "/training" },
    { name: "GREAT MANAGER AWARDS", href: "/careers" },
    { name: "GREAT MANAGER ACADEMY", href: "/courses" },
  ];

  return (
    <section className="relative h-[85vh] md:h-screen w-full bg-[#f8fafd] flex flex-col justify-between overflow-hidden font-sans border-b border-slate-100">
      {/* 3D Particle Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-90"
      />

      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Centered Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-4 relative z-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] block">
            EPITOMETRC PLATFORM
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-light text-slate-900 tracking-[0.25em] leading-tight select-none uppercase">
            IMPACTING INDIVIDUALS
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-500 text-[11px] sm:text-xs font-black uppercase tracking-[0.22em] max-w-2xl leading-loose"
        >
          INTEGRATING PEOPLE STRATEGY WITH YOUR BUSINESS STRATEGY
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="pt-4"
        >
          <Link
            href="/consulting"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b172a] hover:text-orange-500 transition-colors uppercase tracking-wider"
          >
            Explore AI Solutions <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>

      {/* Bottom Menu Items */}
      <div className="relative z-10 w-full bg-white/70 backdrop-blur-md border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-left font-sans">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="group p-6 flex flex-col justify-between hover:bg-slate-50/50 transition-all duration-300 min-h-[120px]"
            >
              <div className="flex justify-between items-start gap-4">
                <span className="text-[11px] font-bold text-slate-700 tracking-wider group-hover:text-orange-500 transition-colors">
                  {cat.name}
                </span>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div className="h-[2px] w-0 bg-orange-500 group-hover:w-full transition-all duration-300 mt-4" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}