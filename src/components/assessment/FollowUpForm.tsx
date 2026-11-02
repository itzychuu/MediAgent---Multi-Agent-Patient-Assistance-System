"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FollowUpQuestion, FollowUpAnswers } from "@/types/assessment";
import { submitFollowUpAnswersAction } from "@/lib/assessment/assessment-actions";
import { Button } from "@/components/ui/Button";
import { ConfigAlert } from "./ConfigAlert";
import {
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface FollowUpFormProps {
  assessmentId: string;
  questions: FollowUpQuestion[];
}

export function FollowUpForm({ assessmentId, questions }: FollowUpFormProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<FollowUpAnswers>({});
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  const handleTextChange = (questionId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  const handleSingleChoice = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleMultipleChoice = (questionId: string, option: string) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[questionId])
        ? (prev[questionId] as string[])
        : [];
      const updated = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [questionId]: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setConfigError(null);

    // Validate that required questions have answers
    for (const q of questions) {
      if (q.required) {
        const ans = answers[q.id];
        if (
          !ans ||
          (typeof ans === "string" && !ans.trim()) ||
          (Array.isArray(ans) && ans.length === 0)
        ) {
          setError(`Please answer the required question: "${q.question}"`);
          return;
        }
      }
    }

    startTransition(async () => {
      const res = await submitFollowUpAnswersAction(assessmentId, answers);
      if (!res.success) {
        if (res.errorType === "CONFIGURATION") {
          setConfigError(res.error || "Missing API configuration");
        } else {
          setError(res.error || "Failed to process follow-up questions.");
        }
      } else {
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {configError && <ConfigAlert message={configError} />}

      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:p-6 backdrop-blur-sm space-y-4"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/15 border border-teal-500/30 text-xs font-bold text-teal-400">
                {idx + 1}
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white leading-relaxed">
                  {q.question}
                </h4>
                {q.required && (
                  <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block mt-0.5">
                    Required for safe evaluation
                  </span>
                )}
              </div>
            </div>

            {/* Render input based on question type */}
            {q.type === "yes_no" && (
              <div className="flex gap-3 pt-1">
                {["Yes", "No", "Uncertain / Not sure"].map((opt) => {
                  const selected = answers[q.id] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={isPending}
                      onClick={() => handleSingleChoice(q.id, opt)}
                      className={`px-4 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        selected
                          ? "bg-teal-500 text-slate-950 border-teal-400 shadow-sm"
                          : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === "single_choice" && q.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt) => {
                  const selected = answers[q.id] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={isPending}
                      onClick={() => handleSingleChoice(q.id, opt)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer flex items-center justify-between ${
                        selected
                          ? "bg-teal-500/15 border-teal-500 text-teal-200 shadow-sm"
                          : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <span>{opt}</span>
                      {selected && <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === "multiple_choice" && q.options && (
              <div className="space-y-2 pt-1">
                <p className="text-[11px] text-slate-400">Select all that apply:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt) => {
                    const currentArr = Array.isArray(answers[q.id])
                      ? (answers[q.id] as string[])
                      : [];
                    const selected = currentArr.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        disabled={isPending}
                        onClick={() => handleMultipleChoice(q.id, opt)}
                        className={`p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer flex items-center justify-between ${
                          selected
                            ? "bg-teal-500/15 border-teal-500 text-teal-200 shadow-sm"
                            : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:text-white"
                        }`}
                      >
                        <span>{opt}</span>
                        {selected && <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {q.type === "text" && (
              <textarea
                rows={2}
                placeholder="Type your answer here..."
                value={(answers[q.id] as string) || ""}
                disabled={isPending}
                onChange={(e) => handleTextChange(q.id, e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            )}
          </div>
        ))}
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-400 text-center sm:text-left">
          Your answers will be analyzed by the clinical assessment engine to formulate non-diagnostic condition insights.
        </p>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isPending}
          className="w-full sm:w-auto shadow-lg shadow-teal-500/20"
        >
          <span>Complete Assessment</span>
          <ArrowRight className="h-4 w-4 ml-1.5" />
        </Button>
      </div>
    </form>
  );
}

export default FollowUpForm;
