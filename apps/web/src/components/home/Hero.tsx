"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface HeroProps {
  persona: "student" | "corporate";
  setPersona: (persona: "student" | "corporate") => void;
}

export default function Hero({ persona, setPersona }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });

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

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Geometry parameters
    const R_torus = 160;  // Torus Major radius
    const r_torus = 55;   // Torus Minor radius
    const R_sphere = 75;  // Inner sphere radius

    // Create 3D points
    const points: {
      type: "torus" | "sphere" | "star";
      theta: number;
      phi: number;
      color: string;
      sizeOffset: number;
      // Stars background coordinates
      starX?: number;
      starY?: number;
      starZ?: number;
    }[] = [];

    // 1. Torus points (Outer Network) - 1200 points
    for (let i = 0; i < 1200; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      
      let color = "rgba(59, 130, 246, 0.45)"; // Electric Blue
      if (i % 3 === 1) color = "rgba(99, 102, 241, 0.45)"; // Indigo
      else if (i % 3 === 2) color = "rgba(139, 92, 246, 0.45)"; // Purple

      points.push({
        type: "torus",
        theta,
        phi,
        color,
        sizeOffset: Math.random() * Math.PI * 2,
      });
    }

    // 2. Inner Sphere points (AI Core) - 500 points
    for (let i = 0; i < 500; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      const color = i % 2 === 0 ? "rgba(249, 115, 22, 0.55)" : "rgba(239, 68, 68, 0.55)"; // Orange & Red-orange

      points.push({
        type: "sphere",
        theta,
        phi,
        color,
        sizeOffset: Math.random() * Math.PI * 2,
      });
    }

    // 3. Constellation Background Stars - 200 points
    for (let i = 0; i < 200; i++) {
      points.push({
        type: "star",
        theta: 0,
        phi: 0,
        starX: (Math.random() - 0.5) * width * 1.5,
        starY: (Math.random() - 0.5) * height * 1.5,
        starZ: (Math.random() - 0.5) * 400,
        color: "rgba(148, 163, 184, 0.2)",
        sizeOffset: Math.random() * Math.PI * 2,
      });
    }

    let angleX = 0;
    let angleY = 0;
    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      angleX += 0.005;
      angleY += 0.006;

      const innerAngleX = -angleX * 0.7;
      const innerAngleY = angleY * 1.2;

      // Gentle breathing idle animations
      const breathingFactor = 1 + 0.04 * Math.sin(time * 0.8);
      const currentR_torus = R_torus * breathingFactor;
      const currentR_sphere = R_sphere * (1 + 0.02 * Math.cos(time * 0.6));

      // Draw grid
      ctx.strokeStyle = "rgba(15, 23, 42, 0.012)";
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Store projected coordinates for drawing paths
      const screenCoords: { x: number; y: number; scale: number }[] = [];

      points.forEach((p, idx) => {
        let rx = 0;
        let ry = 0;
        let rz = 0;

        if (p.type === "torus") {
          const x3d = (currentR_torus + r_torus * Math.cos(p.theta)) * Math.cos(p.phi);
          const y3d = (currentR_torus + r_torus * Math.cos(p.theta)) * Math.sin(p.phi);
          const z3d = r_torus * Math.sin(p.theta);

          const y1 = y3d * Math.cos(angleX) - z3d * Math.sin(angleX);
          const z1 = y3d * Math.sin(angleX) + z3d * Math.cos(angleX);
          rx = x3d * Math.cos(angleY) - z1 * Math.sin(angleY);
          rz = x3d * Math.sin(angleY) + z1 * Math.cos(angleY);
          ry = y1;
        } else if (p.type === "sphere") {
          const x3d = currentR_sphere * Math.sin(p.phi) * Math.cos(p.theta);
          const y3d = currentR_sphere * Math.sin(p.phi) * Math.sin(p.theta);
          const z3d = currentR_sphere * Math.cos(p.phi);

          const y1 = y3d * Math.cos(innerAngleX) - z3d * Math.sin(innerAngleX);
          const z1 = y3d * Math.sin(innerAngleX) + z3d * Math.cos(innerAngleX);
          rx = x3d * Math.cos(innerAngleY) - z1 * Math.sin(innerAngleY);
          rz = x3d * Math.sin(innerAngleY) + z1 * Math.cos(innerAngleY);
          ry = y1;
        } else {
          rx = p.starX || 0;
          ry = p.starY || 0;
          rz = p.starZ || 0;
        }

        const perspective = 500;
        const scale = perspective / (perspective + rz);
        let projX = width / 2 + rx * scale;
        let projY = height / 2 - 35 + ry * scale;

        // Mouse gravity pull warp effect
        if (mouse.active) {
          const dx = mouse.x - projX;
          const dy = mouse.y - projY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220) {
            const pull = (1 - dist / 220) * 15 * scale;
            projX += (dx / dist) * pull;
            projY += (dy / dist) * pull;
          }
        }

        screenCoords[idx] = { x: projX, y: projY, scale };
      });

      // Draw Connections (Neural Pathways)
      const connectionDistance = 45;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < points.length; i += 4) {
        const p1 = points[i];
        if (p1.type === "star") continue;
        const screenP1 = screenCoords[i];
        if (!screenP1) continue;

        for (let j = i + 1; j < i + 15; j++) {
          if (j >= points.length) break;
          const p2 = points[j];
          if (p2.type !== p1.type) continue;
          const screenP2 = screenCoords[j];
          if (!screenP2) continue;

          const dx = screenP1.x - screenP2.x;
          const dy = screenP1.y - screenP2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.15;
            ctx.strokeStyle = p1.type === "torus" 
              ? `rgba(99, 102, 241, ${alpha})` // Indigo
              : `rgba(249, 115, 22, ${alpha})`; // Orange
            ctx.beginPath();
            ctx.moveTo(screenP1.x, screenP1.y);
            ctx.lineTo(screenP2.x, screenP2.y);
            ctx.stroke();
          }
        }
      }

      // Draw Traveling Data Pulses
      ctx.fillStyle = "rgba(249, 115, 22, 0.8)";
      for (let i = 0; i < points.length; i += 28) {
        const p = points[i];
        const screenP = screenCoords[i];
        if (!screenP) continue;
        
        const pulseOffset = (time * 2 + p.sizeOffset) % 1;
        const nextIdx = (i + 5) % points.length;
        const screenNext = screenCoords[nextIdx];
        if (!screenNext) continue;

        const pulseX = screenP.x + (screenNext.x - screenP.x) * pulseOffset;
        const pulseY = screenP.y + (screenNext.y - screenP.y) * pulseOffset;

        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 2 * screenP.scale, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Nodes
      points.forEach((p, idx) => {
        const screenP = screenCoords[idx];
        if (!screenP) return;

        if (screenP.x >= 0 && screenP.x <= width && screenP.y >= 0 && screenP.y <= height) {
          const pulse = 1.0 + 0.4 * Math.sin(time + p.sizeOffset);
          const baseSize = p.type === "torus" ? 1.6 : p.type === "sphere" ? 1.3 : 0.8;
          const size = baseSize * screenP.scale * pulse;

          ctx.beginPath();
          ctx.arc(screenP.x, screenP.y, size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
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
      {/* 3D Double Geometry Canvas HUD */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto cursor-crosshair opacity-95 z-0"
      />

      {/* Modern backdrop colors */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-[120px] pointer-events-none z-0" />
      
      {/* HUD circular radar lines for tech appeal */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[215px] w-[340px] h-[340px] border border-slate-200/20 rounded-full pointer-events-none z-0 border-dashed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[215px] w-[460px] h-[460px] border border-slate-200/10 rounded-full pointer-events-none z-0" />

      {/* Main Centered Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-4 relative z-10 space-y-6">
        
        {/* Persona Switcher Toggle Buttons */}
        <div className="flex bg-white/80 p-1.5 rounded-2xl border border-slate-200/50 shadow-sm z-10 w-fit backdrop-blur-sm">
          <button
            onClick={() => setPersona("student")}
            className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${
              persona === "student"
                ? "bg-[#0b172a] text-white shadow-md"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            For Students
          </button>
          <button
            onClick={() => setPersona("corporate")}
            className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${
              persona === "corporate"
                ? "bg-[#0b172a] text-white shadow-md"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            For Corporates & Recruiters
          </button>
        </div>

        <motion.div
          key={`header-${persona}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <span className="rounded-full bg-orange-50 border border-orange-100 px-3.5 py-0.5 text-[9px] font-black text-orange-500 uppercase tracking-widest inline-block shadow-sm">
            {persona === "student" ? "EpitomeTRC Career Portal" : "EpitomeTRC B2B Suite"}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight leading-tight select-none">
            {persona === "student" ? (
              <>
                Engineer Your Future, <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-orange-500 bg-clip-text text-transparent">
                  Build Your Dream Career.
                </span>
              </>
            ) : (
              <>
                Align People Strategy, <br />
                <span className="bg-gradient-to-r from-orange-500 via-rose-500 to-indigo-600 bg-clip-text text-transparent">
                  Drive Enterprise Velocity.
                </span>
              </>
            )}
          </h1>
        </motion.div>

        <motion.p
          key={`desc-${persona}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-slate-500 text-xs sm:text-sm font-medium max-w-2xl leading-relaxed"
        >
          {persona === "student"
            ? "Refine and optimize your resume with AI score insights, conduct verbal speech mock interviews, and match directly with verified top-tier tech vacancy channels."
            : "Qualify high-value project leads automatically, generate client-facing proposals with audit logs, and configure workforce training bootcamps."}
        </motion.p>

        <motion.div
          key={`buttons-${persona}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <Link
            href={persona === "student" ? "/student/resume-builder" : "/admin/dashboard"}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-orange-500 hover:to-orange-600 hover:shadow-lg hover:shadow-orange-500/20 transition-all uppercase tracking-wider px-5 py-2.5 rounded-xl"
          >
            {persona === "student" ? "Build AI Resume" : "Access Recruiter Workspace"} <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white/60 hover:bg-white transition-all uppercase tracking-wider px-5 py-2.5 rounded-xl border border-slate-200/80 shadow-sm"
          >
            Login to Dashboard
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