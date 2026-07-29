"use client";

import { useEffect } from "react";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0b172a] text-white relative overflow-hidden font-sans pt-28 pb-16">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      <Container className="text-center space-y-6 relative z-10 max-w-xl">
        <div className="text-8xl font-black text-rose-500 tracking-widest animate-pulse">500</div>
        <h1 className="text-3xl font-bold font-display">System Disruption Encountered</h1>
        <p className="text-slate-350 text-sm max-w-md mx-auto leading-relaxed">
          An unexpected server error occurred during transaction processing. Our team has been notified.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={() => reset()}
            className="h-11 rounded-xl px-6 font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all active:scale-[0.98]"
            type="button"
          >
            Retry Execution
          </button>
          <Button href="/" variant="outline" className="h-11 rounded-xl px-6 font-bold bg-transparent text-white border-white/20 hover:bg-white/10 hover:border-white">
            Return Home
          </Button>
        </div>
      </Container>
    </main>
  );
}
