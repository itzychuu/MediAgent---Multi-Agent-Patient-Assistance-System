import React from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/authorization";
import { NewAssessmentWizard } from "@/components/assessment/NewAssessmentWizard";
import { ArrowLeft, Stethoscope } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewAssessmentPage() {
  await requireRole(["patient"]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with back navigation */}
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
            <Stethoscope className="h-7 w-7 text-teal-400" />
            <span>New Symptom Assessment</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete the questionnaire below to evaluate your health concerns.
          </p>
        </div>
      </div>

      {/* Assessment Wizard */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 backdrop-blur-md">
        <NewAssessmentWizard />
      </div>
    </div>
  );
}
