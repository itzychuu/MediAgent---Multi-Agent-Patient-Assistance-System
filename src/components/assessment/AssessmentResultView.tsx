import React from "react";
import Link from "next/link";
import { AssessmentResult, UrgencyLevel } from "@/types/assessment";
import { Button } from "@/components/ui/Button";
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Stethoscope,
  Info,
  Sparkles,
  FileText,
  RotateCcw,
} from "lucide-react";

interface AssessmentResultViewProps {
  result: AssessmentResult;
  assessmentId: string;
}

export function AssessmentResultView({
  result,
  assessmentId,
}: AssessmentResultViewProps) {
  const urgencyStyles: Record<
    UrgencyLevel,
    { label: string; bg: string; text: string; border: string }
  > = {
    routine: {
      label: "Routine / Non-Urgent",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
    },
    prompt: {
      label: "Prompt Attention (Within 24-48 Hours)",
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
      border: "border-cyan-500/30",
    },
    urgent: {
      label: "Urgent Medical Evaluation Required",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/30",
    },
    emergency: {
      label: "Emergency Medical Attention",
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/30",
    },
  };

  const urgency = urgencyStyles[result.urgencyLevel] || urgencyStyles.routine;

  return (
    <div className="space-y-8">
      {/* Top Urgency and Summary Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 backdrop-blur-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${urgency.bg} ${urgency.text} ${urgency.border}`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Recommended Care Level: {urgency.label}</span>
          </div>

          <span className="text-xs text-slate-500 font-mono">
            ID: {assessmentId.slice(0, 8)}...
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Clinical Assessment Summary
        </h2>

        <p className="text-sm md:text-base leading-relaxed text-slate-200">
          {result.summary}
        </p>

        {result.reasoningSummary && (
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 block">
              Assessment Rationale:
            </span>
            <p className="leading-relaxed">{result.reasoningSummary}</p>
          </div>
        )}
      </div>

      {/* Red-Flag Warnings if present */}
      {result.redFlags && result.redFlags.length > 0 && (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-5 md:p-6 space-y-3">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
            <span>Warning Signs to Watch For:</span>
          </div>
          <p className="text-xs text-rose-200 leading-relaxed">
            If you develop any of the following symptoms, seek prompt or emergency medical care immediately:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-rose-200 font-medium">
            {result.redFlags.map((flag, idx) => (
              <li key={idx}>{flag}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Possible Conditions Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-teal-400" />
            <span>Possible Conditions Considered</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            These conditions match aspects of your reported symptoms. This is an informational differential review, not a formal diagnosis.
          </p>
        </div>

        {result.possibleConditions.length === 0 ? (
          <div className="rounded-xl border border-slate-800 p-6 text-center text-xs text-slate-400">
            No specific conditions could be reliably differentiated based on the limited information provided. Please consult a qualified clinician.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.possibleConditions.map((cond, idx) => {
              const probStyles = {
                high: "bg-amber-500/15 text-amber-300 border-amber-500/30",
                moderate: "bg-teal-500/15 text-teal-300 border-teal-500/30",
                low: "bg-slate-700/20 text-slate-300 border-slate-700/40",
              };

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm space-y-3 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-base font-bold text-white">
                      {cond.condition}
                    </h4>
                    <span
                      className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${
                        probStyles[cond.probability] || probStyles.moderate
                      }`}
                    >
                      {cond.probability} likelihood
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {cond.explanation}
                  </p>

                  {cond.matchedSymptoms && cond.matchedSymptoms.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                        Matching Symptoms:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cond.matchedSymptoms.map((symp, sIdx) => (
                          <span
                            key={sIdx}
                            className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-md"
                          >
                            {symp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Uncertainty & Limitations Statement */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 md:p-6 space-y-2">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
          <HelpCircle className="h-4 w-4" />
          <span>Clinical Uncertainty & Limitations</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {result.uncertainty}
        </p>
      </div>

      {/* Next Steps Checklist */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
        <h4 className="text-sm font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Recommended Next Steps</span>
        </h4>
        <ul className="space-y-2">
          {result.nextSteps.map((step, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-xs text-slate-200"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Medical Safety Disclaimer */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-200/90 flex items-start gap-3">
        <Info className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-amber-300 font-semibold">Medical Disclaimer: </strong>
          {result.disclaimer ||
            "MediAgent is an automated health intelligence platform designed for patient education. It does not provide medical diagnoses or prescribe medications. Please consult a qualified physician for clinical care."}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <Link href="/patient/assessment">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Back to Assessment Hub
          </Button>
        </Link>

        <Link href="/patient/assessment/new">
          <Button variant="primary" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Start New Assessment
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default AssessmentResultView;
