"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  SelectedSymptom,
  SymptomProgression,
  InitialSymptomInput,
} from "@/types/assessment";
import { PROGRESSION_OPTIONS } from "@/lib/medical/symptom-catalog";
import { createAssessmentAction } from "@/lib/assessment/assessment-actions";
import { SymptomCatalogPicker } from "./SymptomCatalogPicker";
import { ConfigAlert } from "./ConfigAlert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export function NewAssessmentWizard() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  // Form State
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptom[]>([]);
  const [progression, setProgression] = useState<SymptomProgression>("stable");
  const [description, setDescription] = useState("");
  const [bodyLocation, setBodyLocation] = useState("");
  const [patientAge, setPatientAge] = useState<string>("");
  const [patientGender, setPatientGender] = useState<string>("");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  const handleNextFromStep1 = () => {
    if (!disclaimerAccepted) {
      setError("Please acknowledge the medical disclaimer to proceed.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleNextFromStep2 = () => {
    if (selectedSymptoms.length === 0) {
      setError("Please select at least one symptom to evaluate.");
      return;
    }
    setError(null);
    setStep(3);
  };

  const handleSubmit = () => {
    setError(null);
    setConfigError(null);

    const inputData: InitialSymptomInput = {
      primarySymptoms: selectedSymptoms,
      description: description.trim(),
      progression,
      bodyLocation: bodyLocation.trim() || undefined,
      patientAge: patientAge ? parseInt(patientAge, 10) : undefined,
      patientGender: patientGender.trim() || undefined,
    };

    startTransition(async () => {
      const res = await createAssessmentAction(inputData);
      if (!res.success) {
        if (res.errorType === "CONFIGURATION") {
          setConfigError(res.error || "Missing API configuration");
        } else {
          setError(res.error || "Failed to create assessment.");
        }
      } else if (res.data?.assessmentId) {
        router.push(`/patient/assessment/${res.data.assessmentId}`);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Step Progress Tracker */}
      <div className="grid grid-cols-3 gap-2 border-b border-slate-800 pb-4">
        {[
          { num: 1, label: "Safety & Disclaimer" },
          { num: 2, label: "Select Symptoms" },
          { num: 3, label: "Details & Context" },
        ].map((s) => (
          <div
            key={s.num}
            className={`flex items-center gap-2 pb-1 border-b-2 text-xs font-semibold transition-all ${
              step === s.num
                ? "border-teal-400 text-teal-300"
                : step > s.num
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-500"
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                step === s.num
                  ? "bg-teal-500 text-slate-950 font-bold"
                  : step > s.num
                  ? "bg-emerald-500 text-slate-950 font-bold"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {step > s.num ? "✓" : s.num}
            </span>
            <span className="truncate hidden sm:inline">{s.label}</span>
          </div>
        ))}
      </div>

      {configError && <ConfigAlert message={configError} />}

      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Medical Disclaimer & Acknowledgment */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base">
              <ShieldAlert className="h-6 w-6" />
              <span>Essential Medical Safety Acknowledgment</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              MediAgent uses artificial intelligence to assess symptoms and provide
              general healthcare guidance. Before you begin, please review the following
              fundamental safety guidelines:
            </p>

            <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
              <li>
                <strong className="text-white">Not a medical diagnosis:</strong> This assessment is informational and does not constitute a certified physician diagnosis or treatment plan.
              </li>
              <li>
                <strong className="text-white">No medication prescribing:</strong> The system will never prescribe medicines or recommend alterations to existing prescriptions.
              </li>
              <li>
                <strong className="text-white">Medical Emergencies:</strong> If you are experiencing sudden chest crushing pain, facial drooping, inability to breathe, or severe bleeding, please call emergency services (911 / 999 / 112) immediately.
              </li>
            </ul>

            <div className="pt-4 border-t border-amber-500/20">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={disclaimerAccepted}
                  onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-teal-500 focus:ring-teal-500 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-200">
                  I understand that MediAgent is an educational and guidance assistant and does not replace in-person professional clinical evaluation.
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleNextFromStep1}
            >
              <span>Continue to Symptom Selection</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Symptom Selection */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Select Your Primary Symptoms
            </h3>
            <p className="text-xs text-slate-400">
              Choose one or more symptoms from the catalog below. You can adjust duration and severity for each.
            </p>
          </div>

          <SymptomCatalogPicker
            selectedSymptoms={selectedSymptoms}
            onChange={setSelectedSymptoms}
          />

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={handleNextFromStep2}
              disabled={selectedSymptoms.length === 0}
            >
              <span>Continue ({selectedSymptoms.length} selected)</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Context & Progression */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Provide Progression & Details
            </h3>
            <p className="text-xs text-slate-400">
              Help the AI agent contextualize your presentation by describing how your symptoms have evolved.
            </p>
          </div>

          {/* Progression Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              How are your symptoms progressing?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PROGRESSION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setProgression(opt.value as SymptomProgression)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer flex items-center justify-between ${
                    progression === opt.value
                      ? "bg-teal-500/15 border-teal-500 text-teal-200"
                      : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <span>{opt.label}</span>
                  {progression === opt.value && (
                    <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Natural Language Free-Text Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Describe your symptoms in your own words (Optional but recommended)
            </label>
            <textarea
              rows={4}
              placeholder="e.g., Started feeling a dull ache behind my right eye two days ago after working on the laptop. Worsened this morning with nausea..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-[11px] text-slate-500 block text-right">
              {description.length} / 2000 characters
            </span>
          </div>

          {/* Optional Health Context */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Optional Patient Context
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Approximate Age"
                type="number"
                placeholder="e.g. 32"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
              />
              <Input
                label="Biological Sex"
                placeholder="e.g. Male / Female"
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value)}
              />
              <Input
                label="Specific Body Location"
                placeholder="e.g. Lower right abdomen"
                value={bodyLocation}
                onChange={(e) => setBodyLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setStep(2)}
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back
            </Button>

            <Button
              type="button"
              variant="primary"
              size="lg"
              isLoading={isPending}
              onClick={handleSubmit}
              className="shadow-lg shadow-teal-500/20"
            >
              <Sparkles className="h-4 w-4 mr-1.5" />
              <span>Run AI Disease Assessment</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewAssessmentWizard;
