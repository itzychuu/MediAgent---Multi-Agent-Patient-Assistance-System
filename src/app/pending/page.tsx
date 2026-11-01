import React from "react";
import Link from "next/link";
import { Clock, ShieldAlert, LogOut, RefreshCw } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getDashboardForRole } from "@/lib/auth/roles";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function PendingPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  // If already active, send directly to role dashboard
  if (profile.account_status === "active") {
    redirect(getDashboardForRole(profile.role));
  }

  if (profile.account_status === "suspended") {
    redirect("/suspended");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-amber-500/30 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-md text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <Clock className="h-7 w-7 animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 mb-3">
          Verification Pending
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white">
          Account Under Review
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Hello <span className="font-semibold text-white">{profile.full_name}</span>.
          Your registration as a{" "}
          <span className="font-semibold text-amber-300 capitalize">
            {profile.role}
          </span>{" "}
          has been submitted. To ensure patient safety and clinical compliance,
          provider accounts require review by a MediAgent administrator before
          clinical operations can be accessed.
        </p>

        <div className="mt-6 rounded-lg bg-slate-950/60 border border-slate-800 p-4 text-left space-y-2">
          <div className="flex items-start gap-2.5 text-xs text-slate-400">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <span>
              Once approved by the hospital admin team, your dashboard features will
              activate automatically.
            </span>
          </div>
          <div className="text-xs text-slate-500 border-t border-slate-800/80 pt-2">
            Registered Email: <span className="text-slate-300">{profile.email}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link href={`/${profile.role}`}>
            <Button variant="primary" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Status
            </Button>
          </Link>

          <Link href="/login">
            <Button variant="outline" className="w-full text-slate-300">
              <LogOut className="h-4 w-4 mr-2" />
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
