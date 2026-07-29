import React from "react";
import { Mic, MicOff, Volume2, Send, LogOut, Loader2 } from "lucide-react";

interface AvatarControlsProps {
  isListening: boolean;
  isLoading: boolean;
  canSubmit: boolean;
  onToggleListening: () => void;
  onRepeatAudio: () => void;
  onSubmitResponse: () => void;
  onExit: () => void;
  isCodingQuestion?: boolean;
}

export default function AvatarControls({
  isListening,
  isLoading,
  canSubmit,
  onToggleListening,
  onRepeatAudio,
  onSubmitResponse,
  onExit,
  isCodingQuestion = false,
}: AvatarControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full bg-slate-50 border border-slate-200/60 p-4.5 rounded-2xl shadow-xs font-sans">
      {/* Secondary Controls (Left) */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          onClick={onExit}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 h-9.5 px-4 rounded-xl border border-slate-205 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-800 text-xs font-bold transition-all"
          title="Exit Session"
        >
          <LogOut className="h-4 w-4" />
          <span>Exit Screen</span>
        </button>

        <button
          onClick={onRepeatAudio}
          className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-205 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all"
          title="Repeat Question Audio"
        >
          <Volume2 className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Main Mic / Action Controls (Center/Right) */}
      <div className="flex items-center gap-2.5 w-full sm:w-auto">
        {/* Toggle Listening Mic Button */}
        <button
          onClick={onToggleListening}
          className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl border text-xs font-black tracking-wide shadow-xs transition-all duration-300 ${
            isListening
              ? "bg-orange-500 border-orange-600 hover:bg-orange-550 text-white animate-pulse"
              : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="h-4.5 w-4.5 text-white" />
              <span>Mute Voice Stream</span>
            </>
          ) : (
            <>
              <Mic className="h-4.5 w-4.5 text-violet-500" />
              <span>Speak Response</span>
            </>
          )}
        </button>

        {/* Submit Response Button */}
        <button
          disabled={isLoading || !canSubmit}
          onClick={onSubmitResponse}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black tracking-wide shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
              <span>Evaluating...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>{isCodingQuestion ? "Submit Solution" : "Submit Answer"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
