import React from "react";
import Link from "next/link";
import { AlertOctagon, LogOut } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function SuspendedPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.account_status === "active") {
    redirect(`/${profile.role}`);
  }

  if (profile.account_status === "pending") {
    redirect("/pending");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-md text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
          <AlertOctagon className="h-7 w-7" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400 mb-3">
          Account Suspended
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white">
          Access Restricted
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Hello <span className="font-semibold text-white">{profile.full_name}</span>.
          Your MediAgent account has been suspended by the platform administrator.
          All clinical and medical operations are currently inaccessible.
        </p>

        <div className="mt-6 rounded-lg bg-slate-950/60 border border-slate-800 p-4 text-left text-xs text-slate-400">
          If you believe this suspension is in error or need assistance restoring
          access, please contact clinical support with your account identifier:
          <span className="block mt-1 font-mono text-slate-200">{profile.id}</span>
        </div>

        <div className="mt-6">
          <Link href="/login">
            <Button variant="outline" className="w-full text-slate-300">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
