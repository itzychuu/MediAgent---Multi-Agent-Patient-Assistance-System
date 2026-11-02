export type AssessmentStatus =
  | "in_progress"
  | "requires_follow_up"
  | "completed"
  | "emergency_escalated"
  | "abandoned";

export type UrgencyLevel = "routine" | "prompt" | "urgent" | "emergency";

export type SymptomSeverity = "mild" | "moderate" | "severe";

export type SymptomProgression =
  | "improving"
  | "stable"
  | "worsening"
  | "fluctuating";

export interface SelectedSymptom {
  id: string;
  name: string;
  category: string;
  severity: SymptomSeverity;
  duration: string;
}

export interface InitialSymptomInput {
  primarySymptoms: SelectedSymptom[];
  description: string;
  progression: SymptomProgression;
  bodyLocation?: string;
  patientAge?: number;
  patientGender?: string;
  associatedSymptoms?: string[];
}

export type FollowUpQuestionType =
  | "text"
  | "single_choice"
  | "multiple_choice"
  | "yes_no";

export interface FollowUpQuestion {
  id: string;
  question: string;
  type: FollowUpQuestionType;
  options?: string[];
  required: boolean;
}

export type FollowUpAnswers = Record<string, string | string[]>;

export interface PossibleCondition {
  condition: string;
  probability: "low" | "moderate" | "high";
  explanation: string;
  matchedSymptoms: string[];
}

export interface AssessmentResult {
  summary: string;
  possibleConditions: PossibleCondition[];
  reasoningSummary: string;
  uncertainty: string;
  nextSteps: string[];
  redFlags: string[];
  urgencyLevel: UrgencyLevel;
  disclaimer: string;
}

export interface DiseaseAssessment {
  id: string;
  patient_id: string;
  title: string;
  status: AssessmentStatus;
  initial_symptoms: InitialSymptomInput;
  follow_up_questions: FollowUpQuestion[];
  follow_up_answers: FollowUpAnswers;
  result?: AssessmentResult | null;
  red_flags_detected: string[];
  urgency_level?: UrgencyLevel | null;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
}
