"use client";

import { useState } from "react";
import { Sparkles, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AIChatWindow from "./AIChatWindow";
import AIToast from "./AIToast";

export default function FloatingAIButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsOpen(false);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  return (
    <>
      <AnimatePresence>
        {/* Floating Button */}
        {(!isOpen || isMinimized) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 group"
          >
            {/* Tooltip */}
            <div className="absolute right-0 bottom-16 scale-0 rounded-lg bg-[#0b172a] px-3 py-1.5 text-[10px] font-bold text-white shadow-xl group-hover:scale-100 transition-all duration-200 origin-bottom pointer-events-none whitespace-nowrap border border-slate-800">
              Need Help? Ask AI
            </div>

            {/* Glowing Aura */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-orange-500 opacity-60 blur-md group-hover:opacity-100 transition-opacity animate-pulse" />

            <button
              onClick={handleOpen}
              className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-xl hover:scale-105 transition-transform"
            >
              {isMinimized ? (
                <Sparkles className="h-6 w-6 animate-pulse" />
              ) : (
                <MessageCircle className="h-6 w-6" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && !isMinimized && (
          <AIChatWindow
            onClose={handleClose}
            onMinimize={handleMinimize}
            showToast={triggerToast}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toastMessage && (
          <AIToast
            message={toastMessage}
            onClose={() => setToastMessage(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
