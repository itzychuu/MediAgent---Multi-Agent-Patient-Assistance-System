"use server";

import { requireRole } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";
import {
  InitialSymptomInput,
  DiseaseAssessment,
  FollowUpAnswers,
  AssessmentResult,
} from "@/types/assessment";
import { initialSymptomInputSchema } from "@/lib/medical/schemas";
import { runSafetyScreening } from "@/lib/medical/safety-engine";
import {
  evaluateInitialSymptoms,
  refineAssessmentWithFollowUps,
} from "@/lib/ai/disease-assessment-agent";
import { AIConfigurationError } from "@/lib/ai/llm-provider";
import { revalidatePath } from "next/cache";

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errorType?: "CONFIGURATION" | "VALIDATION" | "EXECUTION" | "UNAUTHORIZED";
}

/**
 * Server Action: Initiates a new AI Disease Assessment
 */
export async function createAssessmentAction(
  rawInput: unknown
): Promise<ActionResponse<{ assessmentId: string; status: string }>> {
  try {
    const patient = await requireRole(["patient"]);

    // 1. Validate Input Schema
    const validation = initialSymptomInputSchema.safeParse(rawInput);
    if (!validation.success) {
      const firstIssue = validation.error.issues[0]?.message || "Invalid input";
      return {
        success: false,
        errorType: "VALIDATION",
        error: firstIssue,
      };
    }

    const symptomInput: InitialSymptomInput = validation.data;
    const title = symptomInput.primarySymptoms.map((s) => s.name).join(", ");

    // 2. Deterministic Medical Safety Screening
    const safetyResult = runSafetyScreening(symptomInput);

    const supabase = await createClient();

    // If critical emergency warning signs are detected, escalate immediately
    if (safetyResult.isEmergency) {
      const emergencyResult: AssessmentResult = {
        summary: `CRITICAL SAFETY ALERT: Patient presentation indicates potential medical emergency symptoms (${safetyResult.redFlags.join(
          "; "
        )}).`,
        possibleConditions: [],
        reasoningSummary:
          "Emergency safety screening detected high-priority warning criteria. Automated non-urgent evaluation was bypassed to avoid delaying life-saving clinical intervention.",
        uncertainty:
          "Emergency assessment mode. Online analysis cannot safely evaluate acute emergent conditions.",
        nextSteps: [
          "Call emergency medical dispatch immediately (e.g. 911, 999, 112).",
          "Go to the nearest Hospital Emergency Department right now.",
          "Do not drive yourself if you are feeling lightheaded, chest pain, or weakness.",
        ],
        redFlags: safetyResult.redFlags,
        urgencyLevel: "emergency",
        disclaimer:
          "EMERGENCY ADVICE: This system provides urgent navigational guidance and is not a medical diagnosis. Seek emergency assistance immediately.",
      };

      const { data: inserted, error: insertError } = await supabase
        .from("disease_assessments")
        .insert({
          patient_id: patient.id,
          title: `Emergency Evaluation: ${title}`,
          status: "emergency_escalated",
          initial_symptoms: symptomInput,
          follow_up_questions: [],
          follow_up_answers: {},
          result: emergencyResult,
          red_flags_detected: safetyResult.redFlags,
          urgency_level: "emergency",
          completed_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (insertError) {
        throw new Error(`Failed to store emergency assessment: ${insertError.message}`);
      }

      revalidatePath("/patient/assessment");
      return {
        success: true,
        data: {
          assessmentId: inserted.id,
          status: "emergency_escalated",
        },
      };
    }

    // 3. Normal Clinical Assessment Pipeline via AI Agent
    const agentOutput = await evaluateInitialSymptoms(symptomInput);

    // Merge safety flags if any non-emergency flags were caught
    const combinedRedFlags = Array.from(
      new Set([...safetyResult.redFlags, ...agentOutput.redFlags])
    );

    const { data: inserted, error: insertError } = await supabase
      .from("disease_assessments")
      .insert({
        patient_id: patient.id,
        title: title || "Symptom Assessment",
        status: agentOutput.status,
        initial_symptoms: symptomInput,
        follow_up_questions: agentOutput.followUpQuestions,
        follow_up_answers: {},
        result: agentOutput.result || null,
        red_flags_detected: combinedRedFlags,
        urgency_level: agentOutput.urgencyLevel,
        completed_at:
          agentOutput.status === "completed" ? new Date().toISOString() : null,
      })
      .select("id")
      .single();

    if (insertError) {
      throw new Error(`Failed to save assessment: ${insertError.message}`);
    }

    revalidatePath("/patient/assessment");
    return {
      success: true,
      data: {
        assessmentId: inserted.id,
        status: agentOutput.status,
      },
    };
  } catch (err: unknown) {
    console.error("Create Assessment Error:", err);
    if (err instanceof AIConfigurationError) {
      return {
        success: false,
        errorType: "CONFIGURATION",
        error: err.message,
      };
    }
    const message = err instanceof Error ? err.message : "Assessment generation failed.";
    return {
      success: false,
      errorType: "EXECUTION",
      error: message,
    };
  }
}

/**
 * Server Action: Submits follow-up answers and refines the assessment
 */
export async function submitFollowUpAnswersAction(
  assessmentId: string,
  answers: FollowUpAnswers
): Promise<ActionResponse<{ assessmentId: string; status: string }>> {
  try {
    const patient = await requireRole(["patient"]);

    if (!assessmentId || typeof assessmentId !== "string") {
      return {
        success: false,
        errorType: "VALIDATION",
        error: "Invalid assessment ID provided.",
      };
    }

    const supabase = await createClient();

    // 1. Fetch current assessment and verify ownership
    const { data: record, error: fetchError } = await supabase
      .from("disease_assessments")
      .select("*")
      .eq("id", assessmentId)
      .eq("patient_id", patient.id)
      .single();

    if (fetchError || !record) {
      return {
        success: false,
        errorType: "UNAUTHORIZED",
        error: "Assessment record not found or access denied.",
      };
    }

    const assessment = record as DiseaseAssessment;

    // 2. Refine assessment with AI Agent
    const agentOutput = await refineAssessmentWithFollowUps(
      assessment.initial_symptoms,
      assessment.follow_up_questions,
      answers
    );

    // 3. Update database record
    const { error: updateError } = await supabase
      .from("disease_assessments")
      .update({
        status: agentOutput.status,
        follow_up_answers: answers,
        result: agentOutput.result || null,
        red_flags_detected: agentOutput.redFlags,
        urgency_level: agentOutput.urgencyLevel,
        completed_at: new Date().toISOString(),
      })
      .eq("id", assessmentId)
      .eq("patient_id", patient.id);

    if (updateError) {
      throw new Error(`Failed to update assessment record: ${updateError.message}`);
    }

    revalidatePath("/patient/assessment");
    revalidatePath(`/patient/assessment/${assessmentId}`);

    return {
      success: true,
      data: {
        assessmentId,
        status: agentOutput.status,
      },
    };
  } catch (err: unknown) {
    console.error("Submit Follow-ups Error:", err);
    if (err instanceof AIConfigurationError) {
      return {
        success: false,
        errorType: "CONFIGURATION",
        error: err.message,
      };
    }
    const message = err instanceof Error ? err.message : "Failed to update assessment.";
    return {
      success: false,
      errorType: "EXECUTION",
      error: message,
    };
  }
}

/**
 * Server Action: Fetches an assessment by ID with strict patient ownership check
 */
export async function getAssessmentByIdAction(
  assessmentId: string
): Promise<ActionResponse<DiseaseAssessment>> {
  try {
    const patient = await requireRole(["patient"]);

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("disease_assessments")
      .select("*")
      .eq("id", assessmentId)
      .eq("patient_id", patient.id)
      .single();

    if (error || !data) {
      return {
        success: false,
        errorType: "UNAUTHORIZED",
        error: "Assessment not found or you do not have permission to view it.",
      };
    }

    return {
      success: true,
      data: data as DiseaseAssessment,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to retrieve assessment.";
    return {
      success: false,
      errorType: "EXECUTION",
      error: message,
    };
  }
}

/**
 * Server Action: Retrieves assessment history for the authenticated patient
 */
export async function getPatientAssessmentsAction(): Promise<
  ActionResponse<DiseaseAssessment[]>
> {
  try {
    const patient = await requireRole(["patient"]);

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("disease_assessments")
      .select("*")
      .eq("patient_id", patient.id)
      .order("created_at", { ascending: false });

    if (error) {
      // Check if table missing
      if (error.code === "PGRST205") {
        return {
          success: true,
          data: [],
        };
      }
      throw new Error(error.message);
    }

    return {
      success: true,
      data: (data as DiseaseAssessment[]) || [],
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch assessments.";
    return {
      success: false,
      errorType: "EXECUTION",
      error: message,
    };
  }
}

/**
 * Server Action: Deletes a specific assessment record owned by the patient
 */
export async function deleteAssessmentAction(
  assessmentId: string
): Promise<ActionResponse<boolean>> {
  try {
    const patient = await requireRole(["patient"]);

    const supabase = await createClient();

    const { error } = await supabase
      .from("disease_assessments")
      .delete()
      .eq("id", assessmentId)
      .eq("patient_id", patient.id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/patient/assessment");
    return {
      success: true,
      data: true,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete assessment.";
    return {
      success: false,
      errorType: "EXECUTION",
      error: message,
    };
  }
}
