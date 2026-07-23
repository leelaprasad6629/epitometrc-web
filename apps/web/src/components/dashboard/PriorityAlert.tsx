"use client";

import { CheckCircle2, AlertCircle, PlayCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PriorityItem {
  id: string;
  title: string;
  type: "today" | "attention" | "next";
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface PriorityAlertProps {
  items: PriorityItem[];
  className?: string;
}

export default function PriorityAlert({ items, className }: PriorityAlertProps) {
  const sortedItems = [...items].sort((a, b) => {
    const priorityMap = { attention: 0, today: 1, next: 2 };
    return priorityMap[a.type] - priorityMap[b.type];
  });

  const badgeConfig = {
    attention: {
      label: "Requires Attention",
      bg: "bg-red-50 text-red-700 border-red-100",
      icon: AlertCircle
    },
    today: {
      label: "Do Today",
      bg: "bg-orange-50 text-orange-700 border-orange-100",
      icon: CheckCircle2
    },
    next: {
      label: "Next Recommended Action",
      bg: "bg-blue-50 text-blue-700 border-blue-100",
      icon: PlayCircle
    }
  };

  return (
    <div className={cn("space-y-3 font-sans text-xs", className)}>
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="font-bold text-slate-800 text-[12px] uppercase tracking-wider">
          Action Center
        </h3>
        <span className="text-[10px] text-slate-400 font-semibold uppercase">
          {items.length} items pending
        </span>
      </div>

      <div className="space-y-2.5">
        {sortedItems.length === 0 ? (
          <p className="text-center text-slate-400 py-6 font-semibold bg-slate-50 rounded-2xl border border-slate-100">
            All clear! You are fully caught up for today.
          </p>
        ) : (
          sortedItems.map((item) => {
            const config = badgeConfig[item.type];
            const Icon = config.icon;

            return (
              <div
                key={item.id}
                className={cn(
                  "p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3.5 transition-all duration-300 hover:shadow-sm bg-white"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("h-7 w-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5", config.bg)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className={cn("inline-block px-1.5 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-wider mb-1.5 border", config.bg)}>
                      {config.label}
                    </span>
                    <h4 className="font-bold text-slate-800 text-[11.5px] leading-tight">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-[10px] text-slate-400 mt-1 font-medium leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {item.actionLabel && (
                  <button
                    onClick={item.onAction}
                    className="h-8 px-3 rounded-lg bg-[#0b172a] text-white hover:bg-slate-800 font-bold transition-all text-[10px] flex items-center gap-1 shrink-0 self-start md:self-center shadow-sm"
                  >
                    {item.actionLabel} <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
