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

    // Create Grid nodes
    const cols = 20;
    const rows = 20;
    const points: {
      gridX: number;
      gridY: number;
      phase: number;
      color: string;
    }[] = [];

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        let color = "rgba(59, 130, 246, 0.45)"; // Blue
        if ((c + r) % 3 === 1) color = "rgba(99, 102, 241, 0.45)"; // Indigo
        else if ((c + r) % 3 === 2) color = "rgba(139, 92, 246, 0.45)"; // Purple

        points.push({
          gridX: c - cols / 2,
          gridY: r - rows / 2,
          phase: Math.random() * Math.PI * 2,
          color,
        });
      }
    }

    // Add some random floating nodes for depth (Orange highlights)
    const floaters: {
      x3d: number;
      y3d: number;
      z3d: number;
      size: number;
      speed: number;
      color: string;
    }[] = [];
    for (let i = 0; i < 40; i++) {
      floaters.push({
        x3d: (Math.random() - 0.5) * 350,
        y3d: (Math.random() - 0.5) * 350,
        z3d: (Math.random() - 0.5) * 150,
        size: 1.5 + Math.random() * 2.0,
        speed: 0.2 + Math.random() * 0.4,
        color: i % 2 === 0 ? "rgba(249, 115, 22, 0.65)" : "rgba(236, 72, 153, 0.65)", // Orange / Pink
      });
    }

    const angleX = 1.0; // Pitch angle to tilt the landscape
    const angleZ = 0.5; // Yaw angle to twist it
    let time = 0;

    const render = () => {
      // Sync canvas dimensions
      const currentWidth = canvas.clientWidth || canvas.offsetWidth || 500;
      const currentHeight = canvas.clientHeight || canvas.offsetHeight || 700;
      if (canvas.width !== currentWidth || canvas.height !== currentHeight) {
        canvas.width = currentWidth;
        canvas.height = currentHeight;
        width = currentWidth;
        height = currentHeight;
      }

      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // Project grid points
      const screenGrid: { x: number; y: number; scale: number; z2: number }[] = [];

      points.forEach((p) => {
        // Base 3D position
        const x3d = p.gridX * 24;
        const y3d = p.gridY * 24;
        
        // Wave calculation
        const distanceToCenter = Math.sqrt(p.gridX * p.gridX + p.gridY * p.gridY);
        let z3d = Math.sin(distanceToCenter * 0.4 - time * 2) * 22;

        // Dynamic 3D rotation
        // Yaw
        const x1 = x3d * Math.cos(angleZ) - y3d * Math.sin(angleZ);
        const y1 = x3d * Math.sin(angleZ) + y3d * Math.cos(angleZ);

        // Pitch
        const y2 = y1 * Math.cos(angleX) - z3d * Math.sin(angleX);
        const z2 = y1 * Math.sin(angleX) + z3d * Math.cos(angleX);

        // Projection
        const perspective = 500;
        const scale = perspective / (perspective + z2);
        let projX = width / 2 + x1 * scale * 1.3;
        let projY = height * 0.65 + y2 * scale * 1.3;

        // Mouse influence: warping Z height
        if (mouse.active) {
          const dx = mouse.x - projX;
          const dy = mouse.y - projY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const pull = (1 - dist / 160) * 45;
            // Recalculate with heightened Z
            const newZ = z3d - pull;
            const newY2 = y1 * Math.cos(angleX) - newZ * Math.sin(angleX);
            const newZ2 = y1 * Math.sin(angleX) + newZ * Math.cos(angleX);
            const newScale = perspective / (perspective + newZ2);
            projX = width / 2 + x1 * newScale * 1.3;
            projY = height * 0.65 + newY2 * newScale * 1.3;
          }
        }

        screenGrid.push({ x: projX, y: projY, scale, z2 });
      });

      // Draw Grid lines (Indigo wireframe network)
      ctx.lineWidth = 0.5;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const idx = c * rows + r;
          const p1 = screenGrid[idx];
          if (!p1) continue;

          // Connect to right neighbor
          if (c < cols - 1) {
            const rightIdx = (c + 1) * rows + r;
            const p2 = screenGrid[rightIdx];
            if (p2) {
              const alpha = Math.min(0.25, Math.max(0.02, p1.scale * 0.12));
              ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }

          // Connect to neighbor down
          if (r < rows - 1) {
            const downIdx = c * rows + (r + 1);
            const p2 = screenGrid[downIdx];
            if (p2) {
              const alpha = Math.min(0.25, Math.max(0.02, p1.scale * 0.12));
              ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw Grid nodes
      points.forEach((p, idx) => {
        const screenP = screenGrid[idx];
        if (!screenP) return;

        if (screenP.x >= 0 && screenP.x <= width && screenP.y >= 0 && screenP.y <= height) {
          const pulse = 1.0 + 0.3 * Math.sin(time * 2 + p.phase);
          const size = 1.2 * screenP.scale * pulse;

          ctx.beginPath();
          ctx.arc(screenP.x, screenP.y, size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();

          // Highlight some glowing nodes
          if (idx % 27 === 0) {
            ctx.beginPath();
            ctx.arc(screenP.x, screenP.y, size * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
            ctx.fill();
          }
        }
      });

      // Update and draw floating packets
      floaters.forEach((f) => {
        // Floating motion upwards
        f.y3d -= f.speed;
        if (f.y3d < -200) {
          f.y3d = 200;
          f.x3d = (Math.random() - 0.5) * 350;
        }

        // Project
        const x1 = f.x3d * Math.cos(angleZ) - f.y3d * Math.sin(angleZ);
        const y1 = f.x3d * Math.sin(angleZ) + f.y3d * Math.cos(angleZ);
        const y2 = y1 * Math.cos(angleX) - f.z3d * Math.sin(angleX);
        const z2 = y1 * Math.sin(angleX) + f.z3d * Math.cos(angleX);

        const perspective = 500;
        const scale = perspective / (perspective + z2);
        const projX = width / 2 + x1 * scale * 1.3;
        const projY = height * 0.65 + y2 * scale * 1.3;

        if (projX >= 0 && projX <= width && projY >= 0 && projY <= height) {
          ctx.beginPath();
          ctx.arc(projX, projY, f.size * scale, 0, Math.PI * 2);
          ctx.fillStyle = f.color;
          ctx.fill();

          // Outer pulse glow ring
          ctx.beginPath();
          ctx.arc(projX, projY, f.size * scale * 2.2, 0, Math.PI * 2);
          ctx.strokeStyle = f.color.replace("0.65", "0.1");
          ctx.lineWidth = 1;
          ctx.stroke();
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
      className="absolute inset-0 h-full w-full opacity-70 pointer-events-none select-none z-0"
    />
  );
}
