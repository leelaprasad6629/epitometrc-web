import React from "react";
import { Sparkles, Mic, Radio, Loader2, RefreshCw, HelpCircle } from "lucide-react";

export type InterviewState = "Speaking" | "Listening" | "Recording" | "Evaluating" | "Preparing" | "Idle";

interface AvatarStatusProps {
  state: InterviewState;
}

export default function AvatarStatus({ state }: AvatarStatusProps) {
  const getStatusConfig = () => {
    switch (state) {
      case "Speaking":
        return {
          label: "Speaking",
          description: "AI Interviewer is asking the question...",
          colorClass: "bg-violet-50 text-violet-700 border-violet-200",
          icon: <Sparkles className="h-3.5 w-3.5 text-violet-600 animate-spin" />,
          dotClass: "bg-violet-500 animate-ping",
        };
      case "Listening":
        return {
          label: "Listening",
          description: "Microphone active. Speak your response now.",
          colorClass: "bg-orange-50 text-orange-700 border-orange-200",
          icon: <Mic className="h-3.5 w-3.5 text-orange-600 animate-bounce" />,
          dotClass: "bg-orange-500 animate-ping",
        };
      case "Recording":
        return {
          label: "Recording Live",
          description: "Capturing your video & voice answer...",
          colorClass: "bg-red-50 text-red-700 border-red-200",
          icon: <Radio className="h-3.5 w-3.5 text-red-650 animate-pulse" />,
          dotClass: "bg-red-600 animate-ping",
        };
      case "Evaluating":
        return {
          label: "Evaluating Response",
          description: "AI is analyzing your response & code correctness...",
          colorClass: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Loader2 className="h-3.5 w-3.5 text-blue-600 animate-spin" />,
          dotClass: "bg-blue-500 animate-pulse",
        };
      case "Preparing":
        return {
          label: "Preparing Question",
          description: "AI is formulating the next adaptive question...",
          colorClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <RefreshCw className="h-3.5 w-3.5 text-emerald-600 animate-spin" />,
          dotClass: "bg-emerald-500 animate-pulse",
        };
      default:
        return {
          label: "Idle / Standing By",
          description: "Click Start/Speak to begin the mock interview session.",
          colorClass: "bg-slate-50 text-slate-605 text-slate-600 border-slate-205",
          icon: <HelpCircle className="h-3.5 w-3.5 text-slate-500" />,
          dotClass: "bg-slate-400",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex flex-col items-start gap-1 w-full text-left font-sans transition-all duration-300">
      <div className="flex items-center justify-between w-full">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
          System Status
        </span>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black tracking-wide ${config.colorClass}`}>
          {/* Status Indicator Dot */}
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dotClass}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dotClass.split(" ")[0]}`} />
          </span>
          {config.icon}
          <span>{config.label}</span>
        </div>
      </div>
      <p className="text-[11px] font-semibold text-slate-450 mt-0.5">{config.description}</p>
    </div>
  );
}
