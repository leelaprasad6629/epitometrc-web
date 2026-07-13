"use client";

import { useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AIToastProps {
  message: string;
  onClose: () => void;
}

export default function AIToast({ message, onClose }: AIToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-24 right-6 z-50 flex items-center gap-3 rounded-2xl border border-red-100 bg-white p-4 shadow-xl shadow-red-500/5 max-w-sm"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="flex-1 space-y-0.5">
          <h4 className="text-xs font-bold text-[#0b172a] font-display">System Connection Alert</h4>
          <p className="text-[10.5px] font-semibold text-slate-500 leading-snug">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
