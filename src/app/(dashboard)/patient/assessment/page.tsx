import React from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/authorization";
import { getPatientAssessmentsAction } from "@/lib/assessment/assessment-actions";
import { AssessmentHistoryTable } from "@/components/assessment/AssessmentHistoryTable";
import { Button } from "@/components/ui/Button";
import {
  Stethoscope,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  History,
  ArrowRight,
  Clock,
  AlertTriangle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AssessmentHubPage() {
  await requireRole(["patient"]);
  const historyRes = await getPatientAssessmentsAction();
  const assessments = historyRes.data || [];

  // Check if there is an in-progress or follow-up needed assessment
  const activeAssessment = assessments.find(
    (a) => a.status === "requires_follow_up" || a.status === "in_progress"
  );

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-300 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            AI Disease Assessment Engine &bull; Phase 2
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Symptom Assessment Hub
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Evaluate symptoms, receive non-diagnostic clinical guidance, and understand potential health conditions with patient-controlled privacy.
          </p>
        </div>

        <Link href="/patient/assessment/new">
          <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-teal-500/20">
            <PlusCircle className="h-4 w-4 mr-2" />
            Start New Assessment
          </Button>
        </Link>
      </div>

      {/* Active In-Progress Assessment Banner if any */}
      {activeAssessment && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 md:p-6 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                Follow-up Questions Pending
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                {activeAssessment.title}
              </h3>
              <p className="text-xs text-amber-200/80 mt-1">
                Started on {new Date(activeAssessment.created_at).toLocaleDateString()}. The AI agent asked clarifying questions to refine your assessment.
              </p>
            </div>
          </div>

          <Link href={`/patient/assessment/${activeAssessment.id}`}>
            <Button variant="primary" size="sm" className="bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold">
              <span>Resume Assessment</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      )}

      {/* Feature Capabilities Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
            <Stethoscope className="h-4 w-4" />
            <span>Structured Triage</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Searchable catalog spanning cardiovascular, respiratory, gastrointestinal, neurological, and musculoskeletal systems.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>Two-Stage Refinement</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Targeted clarifying questions generated only when medically necessary, avoiding unneeded repetition.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            <span>Deterministic Red-Flag Gate</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Immediate emergency escalation checks for stroke, acute coronary syndrome, and respiratory compromise.
          </p>
        </div>
      </div>

      {/* Past Assessments History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-teal-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Assessment History
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {assessments.length} {assessments.length === 1 ? "assessment" : "assessments"} recorded
          </span>
        </div>

        <AssessmentHistoryTable initialAssessments={assessments} />
      </div>

      {/* Medical Safety Disclaimer Footer Banner */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 text-xs text-slate-400 flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
        <p className="leading-relaxed">
          MediAgent provides clinical health information for patient guidance and education. It does not replace a certified physician or clinician. In the event of a medical emergency, immediately contact your local emergency number (e.g. 911, 999, 112).
        </p>
      </div>
    </div>
  );
}
