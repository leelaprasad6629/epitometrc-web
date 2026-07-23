"use client";

import { useState, useEffect, useRef } from "react";
import { Edit2, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InlineEditInputProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  placeholder?: string;
  className?: string;
  label?: string;
}

export default function InlineEditInput({
  value,
  onSave,
  placeholder = "Click to edit...",
  className,
  label
}: InlineEditInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (currentValue === value) {
      setIsEditing(false);
      return;
    }
    
    setSaving(true);
    try {
      await onSave(currentValue);
      setIsEditing(false);
    } catch (err) {
      console.error("Save failed:", err);
      setCurrentValue(value); // revert
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  return (
    <div className={cn("space-y-1 font-sans text-xs w-full", className)}>
      {label && (
        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
          {label}
        </label>
      )}
      <div className="relative group min-h-[38px] flex items-center">
        {isEditing ? (
          <div className="flex items-center gap-2 w-full">
            <input
              ref={inputRef}
              type="text"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              disabled={saving}
              className="w-full h-9 px-3 rounded-xl border border-blue-400 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-xs"
            />
            {saving ? (
              <Loader2 className="h-4.5 w-4.5 animate-spin text-blue-500 shrink-0" />
            ) : (
              <button
                onClick={handleSave}
                className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center border border-emerald-100 shrink-0 transition-colors"
              >
                <Check className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="w-full h-9 px-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white flex items-center justify-between cursor-pointer group transition-all text-xs font-semibold text-slate-600"
          >
            <span className={cn(!currentValue && "text-slate-400 font-normal")}>
              {currentValue || placeholder}
            </span>
            <Edit2 className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-2 shrink-0" />
          </div>
        )}
      </div>
    </div>
  );
}
