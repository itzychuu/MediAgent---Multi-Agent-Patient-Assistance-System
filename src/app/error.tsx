"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("MediAgent runtime error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-md text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
          <AlertCircle className="h-7 w-7" />
        </div>

        <span className="inline-block rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400">
          Application Error
        </span>

        <h1 className="text-2xl font-bold tracking-tight text-white">
          Something went wrong
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed">
          An unexpected system exception occurred while processing this request. Our error telemetry has logged the event.
        </p>

        <div className="pt-4 flex flex-col gap-2.5">
          <Button variant="primary" onClick={() => reset()} className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>

          <Link href="/">
            <Button variant="outline" className="w-full text-slate-300">
              <Home className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

