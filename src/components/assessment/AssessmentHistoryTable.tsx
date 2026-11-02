"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DiseaseAssessment } from "@/types/assessment";
import { deleteAssessmentAction } from "@/lib/assessment/assessment-actions";
import { Button } from "@/components/ui/Button";
import {
  Eye,
  Trash2,
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";

interface AssessmentHistoryTableProps {
  initialAssessments: DiseaseAssessment[];
}

export function AssessmentHistoryTable({
  initialAssessments,
}: AssessmentHistoryTableProps) {
  const [assessments, setAssessments] =
    useState<DiseaseAssessment[]>(initialAssessments);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this assessment record from your history?"
      )
    ) {
      return;
    }

    try {
      setIsDeletingId(id);
      const res = await deleteAssessmentAction(id);
      if (res.success) {
        setAssessments((prev) => prev.filter((a) => a.id !== id));
      } else {
        alert(res.error || "Failed to delete assessment.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeletingId(null);
    }
  };

  const getStatusBadge = (status: DiseaseAssessment["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        );
      case "requires_follow_up":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
            <Clock className="h-3 w-3" />
            Follow-up Needed
          </span>
        );
      case "emergency_escalated":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
            <AlertTriangle className="h-3 w-3" />
            Emergency
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
            In Progress
          </span>
        );
    }
  };

  if (assessments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-slate-500">
          <Stethoscope className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-300">
          No previous symptom assessments found
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Start your first assessment to evaluate symptoms, answer clarifying questions, and receive guided health next steps.
        </p>
        <div className="pt-2">
          <Link href="/patient/assessment/new">
            <Button variant="primary" size="sm">
              <span>Start Assessment</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-4 py-3.5 font-semibold">Assessment Title / Symptoms</th>
            <th className="px-4 py-3.5 font-semibold">Status</th>
            <th className="px-4 py-3.5 font-semibold">Care Level</th>
            <th className="px-4 py-3.5 font-semibold">Date</th>
            <th className="px-4 py-3.5 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80">
          {assessments.map((item) => (
            <tr key={item.id} className="hover:bg-slate-850/40 transition">
              <td className="px-4 py-3.5">
                <div className="font-semibold text-slate-100 max-w-xs truncate">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1">
                  {item.initial_symptoms?.description || "No custom note"}
                </div>
              </td>
              <td className="px-4 py-3.5">{getStatusBadge(item.status)}</td>
              <td className="px-4 py-3.5 capitalize font-medium text-slate-300">
                {item.urgency_level || "Routine"}
              </td>
              <td className="px-4 py-3.5 text-slate-400">
                {new Date(item.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3.5 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/patient/assessment/${item.id}`}>
                    <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs">
                      <Eye className="h-3.5 w-3.5 mr-1 text-teal-400" />
                      View
                    </Button>
                  </Link>

                  <button
                    type="button"
                    disabled={isDeletingId === item.id}
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer disabled:opacity-50"
                    title="Delete record"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AssessmentHistoryTable;
