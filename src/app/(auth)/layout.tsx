import React from "react";
import Link from "next/link";
import { Activity, ShieldCheck, HeartPulse, Lock } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Left / Main form area */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-12 lg:w-1/2">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition opacity-90 hover:opacity-100"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Medi<span className="text-teal-400">Agent</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs font-medium text-slate-400 hover:text-teal-300 transition"
          >
            &larr; Back to home
          </Link>
        </header>

        <main className="my-auto mx-auto w-full max-w-md py-8">
          {children}
        </main>

        <footer className="text-center text-xs text-slate-500">
          <p>
            MediAgent is an AI-assisted healthcare information platform.
            <br />
            It does not replace certified professional medical diagnosis.
          </p>
        </footer>
      </div>

      {/* Right side decorative hero banner (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between bg-slate-900 border-l border-slate-800/80 p-12 overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-300">
            <HeartPulse className="h-3.5 w-3.5" />
            Clinical-Grade Security Architecture
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
            Secure Healthcare Intelligence with Patient-Controlled Privacy
          </h2>
          <p className="text-sm leading-relaxed text-slate-300">
            MediAgent connects patients, clinicians, and hospitals with verified
            identity management, role-based database security, and private memory
            controls.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <ShieldCheck className="h-5 w-5 text-teal-400 mb-2" />
              <h4 className="text-xs font-semibold text-white">Row Level Security</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                PostgreSQL database policies protect every patient and clinical record.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <Lock className="h-5 w-5 text-indigo-400 mb-2" />
              <h4 className="text-xs font-semibold text-white">Verified Roles</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Doctor and Hospital credentials undergo administrative approval.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          &copy; 2026 MediAgent Platform. All rights reserved.
        </div>
      </div>
    </div>
  );
}
