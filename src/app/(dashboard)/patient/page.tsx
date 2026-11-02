import React from "react";
import Link from "next/link";
import {
  Stethoscope,
  Brain,
  FileText,
  Search,
  Lock,
  ShieldCheck,
  User,
  Sparkles,
  HeartPulse,
} from "lucide-react";
import { requireRole } from "@/lib/auth/authorization";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { RoleBadge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function PatientDashboardPage() {
  const user = await requireRole(["patient"]);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
              Patient Portal
            </span>
            <RoleBadge role={user.role} />
            <StatusBadge status={user.account_status} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome back, {user.full_name}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Access healthcare guidance, manage clinical history, and control your AI health memory.
          </p>
        </div>

        <Link href="/profile">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <User className="h-4 w-4 mr-2 text-teal-400" />
            Manage Profile
          </Button>
        </Link>
      </div>

      {/* Profile Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-teal-500/20 bg-teal-500/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                Patient Account Status
              </span>
              <ShieldCheck className="h-5 w-5 text-teal-400" />
            </div>
            <CardTitle className="text-xl">Verified Identity</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-300 space-y-2">
            <p>
              Your personal health record workspace is active and isolated under PostgreSQL Row Level Security.
            </p>
            <div className="pt-2 border-t border-teal-500/20 text-slate-400">
              Email: <span className="text-slate-200">{user.email}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Privacy & AI Memory
              </span>
              <Lock className="h-5 w-5 text-indigo-400" />
            </div>
            <CardTitle className="text-xl">Sovereign Control</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-300 space-y-2">
            <p>
              You maintain full sovereignty over what information is retained by your AI health agents.
            </p>
            <div className="pt-2 border-t border-slate-800 text-slate-400">
              Zero unauthorized third-party sharing.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Care Coordination
              </span>
              <HeartPulse className="h-5 w-5 text-emerald-400" />
            </div>
            <CardTitle className="text-xl">Multi-Agent Support</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-300 space-y-2">
            <p>
              Your assistant coordinates with symptom assessors, pharmacological advisors, and hospital registries.
            </p>
            <div className="pt-2 border-t border-slate-800 text-slate-400">
              System Foundation: <span className="text-emerald-400">Phase 1 Active</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Navigation Cards (Placeholders for upcoming phases) */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            MediAgent Clinical Capabilities
          </h2>
          <p className="text-xs text-slate-400">
            Phase 1 provides system authentication and security foundation. Upcoming phases will unlock these interactive agents:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Disease Assessment */}
          <Card className="hover:border-teal-500/50 bg-slate-900/80 transition flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <span className="rounded bg-teal-500/15 border border-teal-500/30 px-2 py-0.5 text-[10px] font-semibold text-teal-300">
                  Phase 2 Active
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mt-4">
                AI Disease Assessment
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Interactive triage interviews that evaluate symptoms, assess risk factors, and recommend immediate care steps.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <Link
                href="/patient/assessment"
                className="font-semibold text-teal-400 hover:text-teal-300 inline-flex items-center gap-1"
              >
                <span>Launch Assessment</span>
                <Sparkles className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Card>

          {/* Card 2: Health Guidance */}
          <Card className="hover:border-slate-700 transition">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                <Brain className="h-5 w-5" />
              </div>
              <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400">
                Phase 2
              </span>
            </div>
            <h3 className="text-base font-semibold text-white mt-4">
              Health & Medicine Guidance
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Ask questions regarding prescriptions, over-the-counter interactions, and personalized wellness suggestions.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span>Pharmacological Knowledge Base</span>
              <Sparkles className="h-3.5 w-3.5 text-indigo-400/60" />
            </div>
          </Card>

          {/* Card 3: Medical Records */}
          <Card className="hover:border-slate-700 transition">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <FileText className="h-5 w-5" />
              </div>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                Phase 3
              </span>
            </div>
            <h3 className="text-base font-semibold text-white mt-4">
              Medical Record Management
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Store, view, and grant temporary cryptographic access to laboratory tests, discharge papers, and prescriptions.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span>Supabase Encrypted Storage</span>
              <Sparkles className="h-3.5 w-3.5 text-emerald-400/60" />
            </div>
          </Card>

          {/* Card 4: Doctor & Hospital Discovery */}
          <Card className="hover:border-slate-700 transition">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Search className="h-5 w-5" />
              </div>
              <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-400">
                Phase 4
              </span>
            </div>
            <h3 className="text-base font-semibold text-white mt-4">
              Provider Discovery & Booking
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Match your condition with certified hospital departments and specialized doctors in your geographic area.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span>Geocoded Clinical Registry</span>
              <Sparkles className="h-3.5 w-3.5 text-cyan-400/60" />
            </div>
          </Card>

          {/* Card 5: AI Memory Sovereignty */}
          <Card className="hover:border-slate-700 transition">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <Lock className="h-5 w-5" />
              </div>
              <span className="rounded bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-400">
                Phase 5
              </span>
            </div>
            <h3 className="text-base font-semibold text-white mt-4">
              AI Memory & Privacy Controls
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Inspect what the AI agents remember about your health history, redact individual memories, or reset state.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span>Granular Vector Memory Toggles</span>
              <Sparkles className="h-3.5 w-3.5 text-purple-400/60" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
