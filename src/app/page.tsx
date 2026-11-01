import React from "react";
import Link from "next/link";
import {
  Activity,
  ShieldCheck,
  Stethoscope,
  Building2,
  FileText,
  Lock,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Database,
  CheckCircle2,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-white">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Medi<span className="text-teal-400">Agent</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-teal-400 transition-colors">
              Platform Features
            </a>
            <a href="#security" className="hover:text-teal-400 transition-colors">
              Security & Privacy
            </a>
            <a href="#disclaimer" className="hover:text-teal-400 transition-colors">
              Medical Disclaimer
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                <span>Get Started</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-semibold text-teal-300 mb-8">
            <Sparkles className="h-4 w-4" />
            Next-Generation Healthcare Intelligence Platform
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-white max-w-4xl mx-auto leading-[1.1]">
            Multi-Agent Hospital Assistant with{" "}
            <span className="bg-gradient-to-r from-teal-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Patient-Controlled Privacy
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Understand your symptoms, explore verified health guidance, coordinate
            hospital discovery, and maintain sovereign control over your medical
            records.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" variant="primary" className="shadow-lg shadow-teal-500/20">
                <span>Create Free Account</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>

            <Link href="/login">
              <Button size="lg" variant="secondary">
                Sign In to Portal
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-400" />
              <span>Row-Level Encrypted Isolation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Multi-Role Access Control</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-indigo-400" />
              <span>Patient Memory Sovereignty</span>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Safety Disclaimer Banner */}
      <section id="disclaimer" className="border-y border-amber-500/20 bg-amber-500/5 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-amber-300">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5 sm:mt-0" />
            <p className="text-xs sm:text-sm leading-relaxed text-amber-200/90">
              <strong className="font-semibold text-amber-300">Important Medical Safety Notice:</strong>{" "}
              MediAgent provides health guidance, hospital discovery, and care navigation for
              informational and workflow support. MediAgent is not a replacement for professional
              medical advice, clinical diagnosis, or emergency intervention. If you are experiencing
              a medical emergency, please call your local emergency services immediately.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Overview */}
      <section id="features" className="py-24 border-b border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-2">
              Integrated Multi-Agent Ecosystem
            </h2>
            <h3 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Engineered for Patients, Clinicians & Healthcare Networks
            </h3>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              A unified architecture supporting four core stakeholders with dedicated workflows,
              granular permissions, and verified credential management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm hover:border-slate-700 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mb-5">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h4 className="text-base font-semibold text-white">AI Disease Assessment</h4>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Triage and analyze symptoms interactively to understand potential health conditions
                and urgency levels before scheduling appointments.
              </p>
              <span className="mt-4 inline-block text-[10px] font-semibold tracking-wider text-teal-400 uppercase">
                Phase 2 Architecture
              </span>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm hover:border-slate-700 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-5">
                <Bot className="h-6 w-6" />
              </div>
              <h4 className="text-base font-semibold text-white">Health & Medicine Guidance</h4>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Query medication information, potential contraindications, and wellness guidance
                powered by specialized clinical AI models.
              </p>
              <span className="mt-4 inline-block text-[10px] font-semibold tracking-wider text-indigo-400 uppercase">
                Phase 2 Architecture
              </span>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm hover:border-slate-700 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-5">
                <FileText className="h-6 w-6" />
              </div>
              <h4 className="text-base font-semibold text-white">Medical Record Storage</h4>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Centralize lab results, imaging reports, and prescriptions with end-to-end access
                logs and patient-revocable sharing keys.
              </p>
              <span className="mt-4 inline-block text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
                Phase 3 Architecture
              </span>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm hover:border-slate-700 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-5">
                <Building2 className="h-6 w-6" />
              </div>
              <h4 className="text-base font-semibold text-white">Provider Discovery</h4>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Locate verified specialist physicians and certified hospital networks based on
                clinical specialty, vicinity, and availability.
              </p>
              <span className="mt-4 inline-block text-[10px] font-semibold tracking-wider text-cyan-400 uppercase">
                Phase 4 Architecture
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section id="security" className="py-24 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-300 mb-4">
                <Lock className="h-3.5 w-3.5" />
                Zero Compromise Privacy
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Patient-Controlled AI Memory & Data Sovereignty
              </h3>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300">
                Traditional healthcare platforms lock your information away in proprietary silos.
                MediAgent introduces patient-controlled AI memory: you decide what your agents
                remember, what is shared with consulting doctors, and what is deleted forever.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-500/10 text-teal-400 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-white">Database Row Level Security</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      PostgreSQL RLS ensures that profile data is mathematically isolated by session token.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-500/10 text-teal-400 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-white">Privileged Admin Workflow</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Doctor and Hospital registrations are segregated into a review queue to avoid unverified credentials.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-500/10 text-teal-400 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-white">Instant Memory Purge</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Patients retain one-click controls to wipe consultation summaries and memory vectors.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
              <h4 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Database className="h-5 w-5 text-teal-400" />
                Phase 1 Foundation Security Matrix
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs">
                  <span className="font-medium text-slate-300">Public Administrator Signup</span>
                  <span className="font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                    Disabled & Blocked
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs">
                  <span className="font-medium text-slate-300">Doctor / Hospital Review</span>
                  <span className="font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                    Required Approval State
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs">
                  <span className="font-medium text-slate-300">Session Security</span>
                  <span className="font-semibold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded">
                    HttpOnly Supabase SSR
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs">
                  <span className="font-medium text-slate-300">Role Privilege Escalation</span>
                  <span className="font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    Prevented via Database Trigger
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Activity className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-white">
              Medi<span className="text-teal-400">Agent</span>
            </span>
            <span className="text-xs text-slate-500 ml-2">
              Final Year Engineering Project &bull; Phase 1
            </span>
          </div>

          <p className="text-xs text-slate-500 text-center sm:text-right">
            &copy; 2026 MediAgent — Multi-Agent Hospital Assistant. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
