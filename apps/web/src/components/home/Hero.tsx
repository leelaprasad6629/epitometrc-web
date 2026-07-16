"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
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
      x3d: number;
      y3d: number;
      z3d: number;
      theta: number;
      phi: number;
      color: string;
      sizeOffset: number;
    }[] = [];

    // 1. Torus points (Outer Shell) - 1500 points
    for (let i = 0; i < 1500; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      const color = i % 2 === 0 ? "rgba(59, 130, 246, 0.48)" : "rgba(249, 115, 22, 0.48)";
      
      const x3d = (R_torus + r_torus * Math.cos(theta)) * Math.cos(phi);
      const y3d = (R_torus + r_torus * Math.cos(theta)) * Math.sin(phi);
      const z3d = r_torus * Math.sin(theta);

      points.push({
        type: "torus",
        x3d,
        y3d,
        z3d,
        theta,
        phi,
        color,
        sizeOffset: Math.random() * Math.PI * 2,
      });
    }

    // 2. Inner Sphere points (AI Core Core) - 800 points
    for (let i = 0; i < 800; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const color = i % 3 === 0 ? "rgba(239, 68, 68, 0.55)" : "rgba(245, 158, 11, 0.55)";
      
      const x3d = R_sphere * Math.sin(phi) * Math.cos(theta);
      const y3d = R_sphere * Math.sin(phi) * Math.sin(theta);
      const z3d = R_sphere * Math.cos(phi);

      points.push({
        type: "sphere",
        x3d,
        y3d,
        z3d,
        theta,
        phi,
        color,
        sizeOffset: Math.random() * Math.PI * 2,
      });
    }

    // 3. Constellation Background Stars - 300 points
    for (let i = 0; i < 300; i++) {
      points.push({
        type: "star",
        x3d: (Math.random() - 0.5) * width * 1.5,
        y3d: (Math.random() - 0.5) * height * 1.5,
        z3d: (Math.random() - 0.5) * 400,
        theta: 0,
        phi: 0,
        color: "rgba(148, 163, 184, 0.25)",
        sizeOffset: Math.random() * Math.PI * 2,
      });
    }

    let angleX = 0;
    let angleY = 0;
    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse tracking interpolation
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      // Base rotations (faster velocity)
      angleX += 0.007;
      angleY += 0.009;

      // Slower inner rotation factor
      const innerAngleX = -angleX * 0.7;
      const innerAngleY = angleY * 1.2;

      // Draw background grid pattern for high-tech HUD look
      ctx.strokeStyle = "rgba(15, 23, 42, 0.015)";
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

      points.forEach((p) => {
        let rx = p.x3d;
        let ry = p.y3d;
        let rz = p.z3d;

        // Apply distinct rotation based on geometry category
        if (p.type === "torus") {
          // X rotation
          const y1 = ry * Math.cos(angleX) - rz * Math.sin(angleX);
          const z1 = ry * Math.sin(angleX) + rz * Math.cos(angleX);
          // Y rotation
          rx = rx * Math.cos(angleY) - z1 * Math.sin(angleY);
          rz = rx * Math.sin(angleY) + z1 * Math.cos(angleY);
          ry = y1;
        } else if (p.type === "sphere") {
          // X rotation
          const y1 = ry * Math.cos(innerAngleX) - rz * Math.sin(innerAngleX);
          const z1 = ry * Math.sin(innerAngleX) + rz * Math.cos(innerAngleX);
          // Y rotation
          rx = rx * Math.cos(innerAngleY) - z1 * Math.sin(innerAngleY);
          rz = rx * Math.sin(innerAngleY) + z1 * Math.cos(innerAngleY);
          ry = y1;
        }

        // Perspective projections
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

        if (projX >= 0 && projX <= width && projY >= 0 && projY <= height) {
          // Pulsing sizing logic
          const pulse = 1.0 + 0.4 * Math.sin(time + p.sizeOffset);
          const baseSize = p.type === "torus" ? 1.6 : p.type === "sphere" ? 1.3 : 0.8;
          const size = baseSize * scale * pulse;

          ctx.beginPath();
          ctx.arc(projX, projY, size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();

          // Connect stars with fine constellation lines if they are close
          if (p.type === "star" && Math.random() < 0.0003) {
            ctx.beginPath();
            ctx.arc(projX, projY, size * 2, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(59, 130, 246, 0.08)";
            ctx.stroke();
          }
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] block">
            EPITOMETRC PLATFORM
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extralight text-slate-900 tracking-[0.25em] leading-tight select-none uppercase">
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
          className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <Link
            href="/consulting"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#0b172a] hover:bg-orange-500 transition-colors uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md"
          >
            Explore AI Solutions <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white/60 hover:bg-white transition-all uppercase tracking-wider px-5 py-2.5 rounded-xl border border-slate-200/80 shadow-sm"
          >
            Access Dashboards
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