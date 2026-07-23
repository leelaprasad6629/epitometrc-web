"use client";

import { useEffect, useRef } from "react";

export default function DnaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 500;
    let height = 700;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 500;
      height = canvas.height = canvas.offsetHeight || 700;
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

    // Create 3D points
    const points: {
      type: "head" | "torso" | "limb" | "hand" | "star";
      x3d: number;
      y3d: number;
      z3d: number;
      baseX: number;
      baseY: number;
      baseZ: number;
      color: string;
      size: number;
      sizeOffset: number;
    }[] = [];

    // Helpers
    const addSphere = (cx: number, cy: number, cz: number, r: number, count: number, color: string, type: any) => {
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const x = cx + r * Math.sin(phi) * Math.cos(theta);
        const y = cy + r * Math.sin(phi) * Math.sin(theta);
        const z = cz + r * Math.cos(phi);
        points.push({ x3d: x, y3d: y, z3d: z, baseX: x, baseY: y, baseZ: z, color, size: 1.5, sizeOffset: Math.random() * Math.PI * 2, type });
      }
    };

    const addCylinder = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, r: number, count: number, color: string) => {
      for (let i = 0; i < count; i++) {
        const t = Math.random();
        const angle = Math.random() * Math.PI * 2;
        const cx = x1 + (x2 - x1) * t;
        const cy = y1 + (y2 - y1) * t;
        const cz = z1 + (z2 - z1) * t;
        const px = cx + r * Math.cos(angle);
        const pz = cz + r * Math.sin(angle);
        points.push({ x3d: px, y3d: cy, z3d: pz, baseX: px, baseY: cy, baseZ: pz, color, size: 1.2, sizeOffset: Math.random() * Math.PI * 2, type: "limb" });
      }
    };

    // Generate Waving Humanoid skeletal mesh
    // 1. Head
    addSphere(0, 95, 0, 24, 180, "rgba(59, 130, 246, 0.65)", "head"); // Electric Blue

    // 2. Torso (Ellipsoid)
    for (let i = 0; i < 350; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(Math.random() * 2 - 1);
      const x = 28 * Math.sin(v) * Math.cos(u);
      const y = 15 + 40 * Math.sin(v) * Math.sin(u);
      const z = 18 * Math.cos(v);
      let color = "rgba(99, 102, 241, 0.65)"; // Indigo Torso
      if (i % 3 === 0) color = "rgba(139, 92, 246, 0.65)"; // Purple
      points.push({ x3d: x, y3d: y, z3d: z, baseX: x, baseY: y, baseZ: z, color, size: 1.4, sizeOffset: Math.random() * Math.PI * 2, type: "torus" as any });
    }

    // 3. Waving Right Arm (Shoulder -> Elbow -> Waving Hand)
    addCylinder(28, 45, 0, 48, 65, 10, 5, 60, "rgba(99, 102, 241, 0.65)");
    addCylinder(48, 65, 10, 55, 95, 20, 4, 60, "rgba(139, 92, 246, 0.65)");
    addSphere(55, 95, 20, 10, 45, "rgba(249, 115, 22, 0.8)", "hand"); // Orange Waving Hand

    // 4. Left Arm (Downwards)
    addCylinder(-28, 45, 0, -42, 15, -5, 5, 60, "rgba(59, 130, 246, 0.65)");
    addCylinder(-42, 15, -5, -45, -15, -10, 4, 60, "rgba(59, 130, 246, 0.65)");

    // 5. Left Leg
    addCylinder(-16, -30, 0, -18, -75, 5, 5.5, 60, "rgba(59, 130, 246, 0.55)");
    addCylinder(-18, -75, 5, -20, -120, 15, 4.5, 60, "rgba(99, 102, 241, 0.55)");

    // 6. Right Leg
    addCylinder(16, -30, 0, 18, -75, 5, 5.5, 60, "rgba(59, 130, 246, 0.55)");
    addCylinder(18, -75, 5, 20, -120, 15, 4.5, 60, "rgba(99, 102, 241, 0.55)");

    // 7. Background space stars (using relative positions)
    for (let i = 0; i < 150; i++) {
      points.push({
        x3d: 0,
        y3d: 0,
        z3d: 0,
        baseX: Math.random() - 0.5,
        baseY: Math.random() - 0.5,
        baseZ: (Math.random() - 0.5) * 300,
        color: "rgba(249, 115, 22, 0.15)", // subtle orange stars
        size: 1.0,
        sizeOffset: Math.random() * Math.PI * 2,
        type: "star"
      });
    }

    let angleX = 0;
    let angleY = 0.4;
    let time = 0;

    const render = () => {
      // Dynamic resolution sync
      const currentWidth = canvas.clientWidth || canvas.offsetWidth || 500;
      const currentHeight = canvas.clientHeight || canvas.offsetHeight || 700;
      if (canvas.width !== currentWidth || canvas.height !== currentHeight) {
        canvas.width = currentWidth;
        canvas.height = currentHeight;
        width = currentWidth;
        height = currentHeight;
      }

      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      angleY += 0.003; 

      const breath = Math.sin(time * 0.8) * 1.5;
      const sway = Math.sin(time * 0.5) * 3;

      const screenCoords: { x: number; y: number; scale: number }[] = [];

      points.forEach((p, idx) => {
        let rx = p.baseX;
        let ry = p.baseY;
        let rz = p.baseZ;

        if (p.type === "star") {
          rx = p.baseX * width;
          ry = p.baseY * height;
        } else {
          // Breathing scale
          ry += (p.baseY > 0 ? breath : -breath) * 0.4;
          // Upper body sway
          rx += sway * ((p.baseY + 120) / 240);
        }

        // Y-rotation
        const x1 = rx * Math.cos(angleY) - rz * Math.sin(angleY);
        const z1 = rx * Math.sin(angleY) + rz * Math.cos(angleY);

        const perspective = 400;
        const scale = perspective / (perspective + z1);
        let projX = width / 2 + x1 * scale * 1.6;
        let projY = height / 2 - 10 + ry * scale * 1.6;

        // Mouse gravity pull warp effect
        if (mouse.active && p.type !== "star") {
          const dx = mouse.x - projX;
          const dy = mouse.y - projY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const pull = (1 - dist / 150) * 10 * scale;
            projX += (dx / dist) * pull;
            projY += (dy / dist) * pull;
          }
        }

        screenCoords[idx] = { x: projX, y: projY, scale };
      });

      // Draw structural paths
      ctx.lineWidth = 0.5;
      for (let i = 0; i < points.length; i += 3) {
        const p1 = points[i];
        if (p1.type === "star") continue;
        const screenP1 = screenCoords[i];
        if (!screenP1) continue;

        for (let j = i + 1; j < i + 10; j++) {
          if (j >= points.length) break;
          const p2 = points[j];
          if (p2.type === "star" || p2.type !== p1.type) continue;
          const screenP2 = screenCoords[j];
          if (!screenP2) continue;

          const dx = screenP1.x - screenP2.x;
          const dy = screenP1.y - screenP2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 28) {
            const alpha = (1 - dist / 28) * 0.18;
            ctx.strokeStyle = p1.type === "hand" 
              ? `rgba(249, 115, 22, ${alpha})` // Orange waving hand glow
              : `rgba(99, 102, 241, ${alpha})`; // Indigo body glow
            ctx.beginPath();
            ctx.moveTo(screenP1.x, screenP1.y);
            ctx.lineTo(screenP2.x, screenP2.y);
            ctx.stroke();
          }
        }
      }

      // Draw Nodes
      points.forEach((p, idx) => {
        const screenP = screenCoords[idx];
        if (!screenP) return;

        if (screenP.x >= 0 && screenP.x <= width && screenP.y >= 0 && screenP.y <= height) {
          const pulse = 1.0 + 0.3 * Math.sin(time + p.sizeOffset);
          const size = p.size * screenP.scale * pulse;

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
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-80 pointer-events-none select-none z-0"
    />
  );
}
