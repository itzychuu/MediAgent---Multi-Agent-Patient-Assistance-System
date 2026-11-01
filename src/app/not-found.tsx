import React from "react";
import Link from "next/link";
import { Activity, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-md text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
          <Activity className="h-7 w-7" />
        </div>

        <span className="inline-block rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-400">
          404 Error
        </span>

        <h1 className="text-2xl font-bold tracking-tight text-white">
          Page Not Located
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed">
          The healthcare resource, dashboard module, or route you requested does not exist or has been relocated.
        </p>

        <div className="pt-4 flex flex-col gap-2.5">
          <Link href="/">
            <Button variant="primary" className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Return to MediAgent Home
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="w-full text-slate-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

