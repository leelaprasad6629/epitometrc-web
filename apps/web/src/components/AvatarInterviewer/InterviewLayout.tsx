import React, { useEffect, useState } from "react";
import { AlertCircle, Terminal, Play, Loader2, VideoOff } from "lucide-react";
import AvatarCanvas from "./AvatarCanvas";
import AvatarStatus, { InterviewState } from "./AvatarStatus";
import AvatarControls from "./AvatarControls";

interface InterviewLayoutProps {
  // Session States
  question: string;
  answer: string;
  onAnswerChange: (val: string) => void;
  questionNumber: number;
  totalQuestions?: number;
  isLoading: boolean;
  errorMsg: string;
  violationAlert: string;
  violationCount: number;
  
  // Stream & Video Refs
  mediaStream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  
  // Speaking & Listening status
  isSpeaking: boolean;
  isListening: boolean;
  onToggleListening: () => void;
  onRepeatAudio: () => void;
  onSubmitAnswer: () => void;
  onExit: () => void;

  // Coding states
  isCodingQuestion: boolean;
  codeSubmission: string;
  onCodeChange: (val: string) => void;
  codeLanguage: string;
  onLanguageChange: (lang: string) => void;
  compilerOutput: string;
  compilerRunning: boolean;
  onRunCode: () => void;
}

export default function InterviewLayout({
  question,
  answer,
  onAnswerChange,
  questionNumber,
  totalQuestions = 5,
  isLoading,
  errorMsg,
  violationAlert,
  violationCount,
  mediaStream,
  videoRef,
  isSpeaking,
  isListening,
  onRepeatAudio,
  onToggleListening,
  onSubmitAnswer,
  onExit,
  isCodingQuestion,
  codeSubmission,
  onCodeChange,
  codeLanguage,
  onLanguageChange,
  compilerOutput,
  compilerRunning,
  onRunCode,
}: InterviewLayoutProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // local timer for elapsed session duration
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Compute overall state enum for Status component
  const deriveInterviewState = (): InterviewState => {
    if (isLoading) return "Evaluating";
    if (isSpeaking) return "Speaking";
    if (isListening) return "Listening";
    if (mediaStream) return "Recording";
    return "Idle";
  };

  const currentStatusState = deriveInterviewState();
  const progressPercent = Math.min(100, Math.round(((questionNumber - 1) / totalQuestions) * 100));

  return (
    <div className="flex flex-col gap-5 w-full bg-slate-950 p-4 md:p-6 rounded-3xl border border-slate-900 shadow-2xl relative min-h-[600px] text-left font-sans text-xs">
      
      {/* 1. Header Progress Bar & Timer */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black bg-violet-950/80 text-violet-400 border border-violet-900/50 px-2 py-0.5 rounded-md uppercase tracking-wider font-mono">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className="text-[10px] font-black bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded-md uppercase tracking-wider font-mono">
              Elapsed: {formatTime(elapsedSeconds)}
            </span>
          </div>
          {/* Progress Bar background */}
          <div className="w-48 bg-slate-900 rounded-full h-1.5 border border-slate-800/80 overflow-hidden">
            <div
              className="bg-gradient-to-r from-violet-500 to-indigo-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* System state display */}
        <div className="w-full md:w-80">
          <AvatarStatus state={currentStatusState} />
        </div>
      </div>

      {/* 2. Security Alerts */}
      {violationAlert && (
        <div className="p-3.5 bg-red-950/40 border border-red-900/50 rounded-2xl text-[10.5px] text-red-300 font-bold flex items-start gap-2 shadow-inner">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5 animate-bounce" />
          <div className="space-y-0.5">
            <span>{violationAlert}</span>
            <span className="block text-[9.5px] font-normal text-slate-450">
              Integrity Warnings: {violationCount} of 3. Leaving full-screen results in session cancellation.
            </span>
          </div>
        </div>
      )}

      {/* 3. Main Workspace Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch flex-1">
        
        {/* Left Focus Column: AI Avatar & Candidate Video */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* Main Visual: AI Avatar Canvas */}
          <div className="flex-1 min-h-[300px] relative rounded-3xl overflow-hidden shadow-lg border border-slate-850">
            <AvatarCanvas isSpeaking={isSpeaking} stateName={currentStatusState} />
          </div>

          {/* Picture-in-Picture: Candidate Webcam Feed */}
          <div className="relative h-44 rounded-2xl border border-slate-850 bg-slate-900 overflow-hidden shadow-inner flex items-center justify-center">
            {mediaStream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="flex flex-col items-center gap-1 text-slate-600 font-mono text-[10px]">
                <VideoOff className="h-6 w-6 text-slate-700 animate-pulse" />
                <span>Webcam feed disabled</span>
              </div>
            )}
            
            {/* Live recording indicator badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-black text-slate-200 font-mono tracking-widest uppercase">
              <div className={`h-1.5 w-1.5 rounded-full ${mediaStream ? "bg-red-500 animate-ping" : "bg-slate-500"}`} />
              {mediaStream ? "REC LIVE" : "STANDBY"}
            </div>
          </div>
        </div>

        {/* Right Column: Q&A Text Areas or Code Workspace */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          
          {/* Question Text Box (Subtitles style) */}
          <div className="bg-slate-900 border border-slate-850 p-4.5 rounded-2xl shadow-xs space-y-1.5">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-mono">
              AI Interviewer
            </span>
            <p className="text-xs font-semibold text-slate-100 leading-relaxed font-sans select-all">
              {question}
            </p>
          </div>

          {/* Conditional Workspace: Code Editor vs Standard text input */}
          {isCodingQuestion ? (
            /* TECHNICAL SPLIT EDITOR */
            <div className="flex-1 flex flex-col rounded-3xl border border-slate-900 bg-slate-950 overflow-hidden shadow-lg min-h-[350px]">
              {/* Editor Tab Bar */}
              <div className="bg-slate-900/50 border-b border-slate-900 px-4 py-2 flex items-center justify-between">
                <span className="text-[9px] font-mono text-slate-400 font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="h-4 w-4 text-violet-500" />
                  <span>coding_workspace.{codeLanguage === "python" ? "py" : codeLanguage === "javascript" ? "js" : "cpp"}</span>
                </span>
                
                <select
                  value={codeLanguage}
                  onChange={(e) => onLanguageChange(e.target.value)}
                  className="h-7 rounded-lg bg-slate-900 border border-slate-850 px-2.5 py-0.5 text-[9.5px] text-slate-300 font-bold outline-none cursor-pointer focus:border-slate-700"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>

              {/* Textarea Code Block Editor */}
              <div className="flex-1 flex font-mono text-[11px] p-3.5 bg-slate-950/80">
                {/* Simulated line numbers */}
                <div className="text-slate-700 select-none text-right pr-3.5 border-r border-slate-900 leading-relaxed font-mono">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <textarea
                  value={codeSubmission}
                  onChange={(e) => onCodeChange(e.target.value)}
                  placeholder="// Write your technical solution code here..."
                  className="flex-1 bg-transparent text-slate-200 outline-none resize-none pl-3.5 leading-relaxed font-mono focus:ring-0 focus:outline-none placeholder-slate-700"
                  aria-label="Code Editor Submission Area"
                />
              </div>

              {/* Dynamic compiler output console */}
              {compilerOutput && (
                <div className="bg-slate-950 border-t border-slate-900 p-3.5 font-mono text-[10px] text-slate-300 text-left space-y-1">
                  <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest block">Console Output</span>
                  <pre className="whitespace-pre-wrap leading-relaxed max-h-24 overflow-y-auto">{compilerOutput}</pre>
                </div>
              )}

              {/* Action Bar inside editor */}
              <div className="bg-slate-900/60 border-t border-slate-900 p-3.5 flex justify-end">
                <button
                  disabled={compilerRunning}
                  onClick={onRunCode}
                  className="h-8.5 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 text-[10px] font-bold tracking-wider transition-all flex items-center gap-1"
                >
                  {compilerRunning ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Compiling...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 fill-current" />
                      <span>Run Test Cases</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* STANDARD TEXT RESPONSE */
            <div className="flex-1 flex flex-col gap-3 min-h-[250px]">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-mono">
                Your Verbal Response
              </span>
              <textarea
                placeholder="Click 'Speak Response' to dictate, or type your technical response details here..."
                value={answer}
                onChange={(e) => onAnswerChange(e.target.value)}
                className="w-full flex-1 rounded-2xl border border-slate-900 bg-slate-900/40 p-4 text-xs text-slate-200 leading-relaxed font-sans placeholder-slate-600 focus:outline-none focus:border-slate-800 transition-all focus:bg-slate-900/80"
                aria-label="Text Answer Input Area"
              />
            </div>
          )}

          {/* Technical Coding: Verbal explanation overlay */}
          {isCodingQuestion && (
            <div className="space-y-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-mono">
                Explain your solution details
              </span>
              <textarea
                placeholder="Provide a verbal summary explaining the time/space complexity and logic of your code solution..."
                value={answer}
                onChange={(e) => onAnswerChange(e.target.value)}
                className="w-full rounded-2xl border border-slate-900 bg-slate-900/40 p-3.5 text-xs text-slate-200 h-24 focus:outline-none focus:border-slate-800 transition-all placeholder-slate-700"
                aria-label="Explanation Text Answer Input Area"
              />
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-[10px] text-red-300 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Bottom Controls Bar */}
      <div className="border-t border-slate-900 pt-4">
        <AvatarControls
          isListening={isListening}
          isLoading={isLoading}
          canSubmit={answer.trim().length > 0 || (isCodingQuestion && codeSubmission.trim().length > 0)}
          onToggleListening={onToggleListening}
          onRepeatAudio={onRepeatAudio}
          onSubmitResponse={onSubmitAnswer}
          onExit={onExit}
          isCodingQuestion={isCodingQuestion}
        />
      </div>
    </div>
  );
}
