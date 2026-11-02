import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/authorization";
import { getAssessmentByIdAction } from "@/lib/assessment/assessment-actions";
import { EmergencyAlertBanner } from "@/components/assessment/EmergencyAlertBanner";
import { FollowUpForm } from "@/components/assessment/FollowUpForm";
import { AssessmentResultView } from "@/components/assessment/AssessmentResultView";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  Calendar,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface AssessmentPageProps {
  params: Promise<{ id: string }>;
}

export default async function AssessmentDetailPage({
  params,
}: AssessmentPageProps) {
  await requireRole(["patient"]);
  const { id } = await params;

  const res = await getAssessmentByIdAction(id);

  if (!res.success || !res.data) {
    notFound();
  }

  const assessment = res.data;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <Link
            href="/patient/assessment"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-teal-300 transition mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Assessment Hub</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>{assessment.title}</span>
          </h1>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-teal-400" />
              {new Date(assessment.created_at).toLocaleString()}
            </span>
            <span>&bull;</span>
            <span className="capitalize text-slate-300 font-medium">
              Status: {assessment.status.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        <Link href="/patient/assessment/new">
          <Button variant="outline" size="sm">
            <RotateCcw className="h-3.5 w-3.5 mr-1.5 text-teal-400" />
            New Assessment
          </Button>
        </Link>
      </div>

      {/* CASE 1: Emergency Escalation Screen */}
      {assessment.status === "emergency_escalated" && (
        <div className="space-y-6">
          <EmergencyAlertBanner
            redFlags={assessment.red_flags_detected}
            guidance="Your symptom presentation triggered critical medical safety indicators. Please seek immediate professional emergency evaluation right away."
          />

          {/* Initial reported symptoms context */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Reported Symptoms Context
            </h3>
            <div className="flex flex-wrap gap-2">
              {assessment.initial_symptoms?.primarySymptoms?.map((s) => (
                <span
                  key={s.id}
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200"
                >
                  {s.name} ({s.severity}, {s.duration})
                </span>
              ))}
            </div>
            {assessment.initial_symptoms?.description && (
              <p className="text-xs text-slate-400 italic mt-2">
                &ldquo;{assessment.initial_symptoms.description}&rdquo;
              </p>
            )}
          </div>
        </div>
      )}

      {/* CASE 2: Requires Follow-up Questionnaire */}
      {assessment.status === "requires_follow_up" && (
        <div className="space-y-6">
          {/* Summary Box */}
          <div className="rounded-2xl border border-teal-500/30 bg-teal-500/5 p-6 space-y-2">
            <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Assessment In Progress &bull; Clarification Needed</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              The AI agent evaluated your initial symptoms. To provide a safe and helpful differential assessment, please answer the targeted questions below:
            </p>
          </div>

          <FollowUpForm
            assessmentId={assessment.id}
            questions={assessment.follow_up_questions}
          />
        </div>
      )}

      {/* CASE 3: Completed Assessment Results */}
      {assessment.status === "completed" && assessment.result && (
        <AssessmentResultView
          result={assessment.result}
          assessmentId={assessment.id}
        />
      )}
    </div>
  );
}
