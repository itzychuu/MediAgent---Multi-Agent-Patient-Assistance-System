import { z } from "zod";

export const selectedSymptomSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  severity: z.enum(["mild", "moderate", "severe"]),
  duration: z.string().min(1),
});

export const initialSymptomInputSchema = z.object({
  primarySymptoms: z
    .array(selectedSymptomSchema)
    .min(1, "Please select at least one primary symptom."),
  description: z
    .string()
    .max(2000, "Description cannot exceed 2000 characters.")
    .default(""),
  progression: z.enum(["improving", "stable", "worsening", "fluctuating"]),
  bodyLocation: z.string().max(100).optional(),
  patientAge: z
    .number()
    .min(0, "Age must be a positive number.")
    .max(125, "Age must be valid.")
    .optional(),
  patientGender: z.string().max(50).optional(),
  associatedSymptoms: z.array(z.string().max(100)).optional(),
});

export const followUpQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  type: z.enum(["text", "single_choice", "multiple_choice", "yes_no"]),
  options: z.array(z.string()).optional(),
  required: z.boolean().default(true),
});

export const possibleConditionSchema = z.object({
  condition: z.string().min(1),
  probability: z.enum(["low", "moderate", "high"]),
  explanation: z.string().min(1),
  matched_symptoms: z.array(z.string()).optional(),
  matchedSymptoms: z.array(z.string()).optional(),
});

export const aiAssessmentResponseSchema = z.object({
  status: z.enum(["requires_follow_up", "completed", "emergency_escalated"]),
  summary: z.string().min(1),
  follow_up_questions: z.array(followUpQuestionSchema).default([]),
  possible_conditions: z.array(possibleConditionSchema).default([]),
  reasoning_summary: z.string().default(""),
  uncertainty: z.string().min(1),
  next_steps: z.array(z.string()).default([]),
  red_flags: z.array(z.string()).default([]),
  urgency_level: z.enum(["routine", "prompt", "urgent", "emergency"]),
  disclaimer: z.string().min(1),
});

export type ValidatedAIAssessmentResponse = z.infer<
  typeof aiAssessmentResponseSchema
>;
