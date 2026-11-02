import {
  InitialSymptomInput,
  FollowUpQuestion,
  FollowUpAnswers,
  AssessmentResult,
  AssessmentStatus,
  UrgencyLevel,
} from "@/types/assessment";
import { callLLMProvider } from "./llm-provider";
import {
  aiAssessmentResponseSchema,
  ValidatedAIAssessmentResponse,
} from "@/lib/medical/schemas";

const ASSESSMENT_SYSTEM_PROMPT = `You are MediAgent's AI Disease Assessment Agent, an evidence-based clinical reasoning assistant.
Your goal is to provide careful, non-diagnostic symptom evaluations to inform patients and help them navigate appropriate clinical care.

MANDATORY MEDICAL SAFETY & ETHICAL BOUNDARIES:
1. You are NOT a doctor and do NOT provide definitive diagnoses. You provide POSSIBLE health conditions for patient education and discussion with a healthcare provider.
2. NEVER prescribe medications, change dosages, or suggest specific prescription pharmaceuticals.
3. NEVER claim 100% certainty. Always communicate clinical uncertainty and limitations of remote self-reported assessments.
4. If symptoms indicate potential medical emergencies (e.g., myocardial infarction, stroke, severe respiratory distress, acute surgical abdomen, uncontrolled bleeding, sepsis, meningitis), flag them immediately under "red_flags" and set "urgency_level" to "emergency".
5. Never invent medical facts or assume unstated laboratory results.
6. Provide concise, patient-friendly explanations without clinical jargon or hidden reasoning traces.

INTERACTION STAGES:
- If the patient's symptom description lacks key details needed to evaluate potential causes safely (such as character of pain, precise onset, associated triggers, or related localized symptoms), return:
  "status": "requires_follow_up"
  and provide 2 to 4 concise, targeted "follow_up_questions".
  Each question must have: "id" (unique string), "question" (clear text), "type" ("single_choice" | "multiple_choice" | "yes_no" | "text"), "options" (array of strings if choice type), and "required" (true).
- If the information provided is already sufficient to form a responsible overview (or if this is a second-stage evaluation with follow-up answers provided), return:
  "status": "completed"
  and include "possible_conditions" (2 to 4 items with condition name, probability ("low" | "moderate" | "high"), clear explanation of relevance, and matched symptoms).

OUTPUT FORMAT:
You MUST respond with a single valid JSON object strictly matching this JSON schema:
{
  "status": "requires_follow_up" | "completed" | "emergency_escalated",
  "summary": "1-2 sentence objective clinical summary of the patient presentation",
  "follow_up_questions": [
    {
      "id": "q1",
      "question": "question text",
      "type": "single_choice" | "multiple_choice" | "yes_no" | "text",
      "options": ["opt1", "opt2"],
      "required": true
    }
  ],
  "possible_conditions": [
    {
      "condition": "Condition Name",
      "probability": "low" | "moderate" | "high",
      "explanation": "Why this condition is consistent with the patient's symptoms",
      "matched_symptoms": ["symptom 1", "symptom 2"]
    }
  ],
  "reasoning_summary": "Concise summary of factors considered (patient-facing, no private scratchpad)",
  "uncertainty": "Explicit explanation of clinical limitations, why alternative causes exist, and what tests would be required in person",
  "next_steps": ["Actionable step 1", "Actionable step 2 (e.g. recommended physician specialty, monitoring parameters)"],
  "red_flags": ["Specific warning signs that would require immediate emergency care if they occur"],
  "urgency_level": "routine" | "prompt" | "urgent" | "emergency",
  "disclaimer": "MediAgent provides automated health information and is not a medical diagnosis. Consult a qualified physician for evaluation."
}`;

export interface AgentAssessmentOutput {
  status: AssessmentStatus;
  followUpQuestions: FollowUpQuestion[];
  result?: AssessmentResult;
  urgencyLevel: UrgencyLevel;
  redFlags: string[];
}

export async function evaluateInitialSymptoms(
  input: InitialSymptomInput
): Promise<AgentAssessmentOutput> {
  const userPrompt = buildInitialUserPrompt(input);

  const rawJson = await callLLMProvider({
    systemPrompt: ASSESSMENT_SYSTEM_PROMPT,
    userPrompt,
    temperature: 0.2,
  });

  const parsed = parseAndValidateAIResponse(rawJson);
  return formatAgentOutput(parsed);
}

export async function refineAssessmentWithFollowUps(
  initialInput: InitialSymptomInput,
  questions: FollowUpQuestion[],
  answers: FollowUpAnswers
): Promise<AgentAssessmentOutput> {
  const userPrompt = buildRefinementUserPrompt(
    initialInput,
    questions,
    answers
  );

  const rawJson = await callLLMProvider({
    systemPrompt: `${ASSESSMENT_SYSTEM_PROMPT}\n\nIMPORTANT: The patient has now answered your follow-up questions. You must now finalize the evaluation and return "status": "completed" with the full list of "possible_conditions", "next_steps", and "uncertainty". Do not ask additional questions unless an urgent emergency has surfaced.`,
    userPrompt,
    temperature: 0.2,
  });

  const parsed = parseAndValidateAIResponse(rawJson);
  return formatAgentOutput(parsed);
}

function buildInitialUserPrompt(input: InitialSymptomInput): string {
  const symptomsText = input.primarySymptoms
    .map(
      (s) =>
        `- ${s.name} (${s.category}): Severity = ${s.severity}, Duration = ${s.duration}`
    )
    .join("\n");

  const associatedText =
    input.associatedSymptoms && input.associatedSymptoms.length > 0
      ? input.associatedSymptoms.join(", ")
      : "None reported";

  return `PATIENT PRESENTATION:
Primary Symptoms:
${symptomsText}

Symptom Progression: ${input.progression}
Body Location: ${input.bodyLocation || "Not specifically localized"}
Patient Age: ${input.patientAge !== undefined ? `${input.patientAge} years` : "Unspecified"}
Patient Gender: ${input.patientGender || "Unspecified"}
Associated Symptoms: ${associatedText}

Patient's Description in their own words:
"${input.description || "No additional text provided."}"

TASK:
Evaluate whether there is sufficient information to assess potential causes safely. If essential clarifying information is absent, return status "requires_follow_up" with 2-3 specific questions. If adequate, return "status": "completed" with possible conditions and safety guidance. Respond in JSON.`;
}

function buildRefinementUserPrompt(
  initialInput: InitialSymptomInput,
  questions: FollowUpQuestion[],
  answers: FollowUpAnswers
): string {
  const initialPrompt = buildInitialUserPrompt(initialInput);

  const qaText = questions
    .map((q) => {
      const ans = answers[q.id];
      const ansStr = Array.isArray(ans) ? ans.join(", ") : ans || "No answer provided";
      return `Q: ${q.question}\nA: ${ansStr}`;
    })
    .join("\n\n");

  return `${initialPrompt}

PATIENT ANSWERS TO PREVIOUS FOLLOW-UP QUESTIONS:
${qaText}

TASK:
Incorporate these patient answers into the clinical assessment. Synthesize the findings and provide the finalized assessment with status "completed", possible conditions, uncertainty, next steps, and red flags. Respond in JSON.`;
}

function parseAndValidateAIResponse(
  rawText: string
): ValidatedAIAssessmentResponse {
  let cleaned = rawText.trim();
  // Strip markdown code fences if model enclosed JSON in ```json ... ```
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(cleaned);
  } catch {
    // Attempt extracting the first JSON object using regex
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        parsedJson = JSON.parse(match[0]);
      } catch {
        throw new Error("Unable to parse AI response as valid JSON.");
      }
    } else {
      throw new Error("Unable to parse AI response as valid JSON.");
    }
  }

  const validation = aiAssessmentResponseSchema.safeParse(parsedJson);

  if (!validation.success) {
    console.error("AI Schema Validation Error:", validation.error.format());
    throw new Error(
      "The AI assessment produced an output that did not match the required safety format."
    );
  }

  return validation.data;
}

function formatAgentOutput(
  validated: ValidatedAIAssessmentResponse
): AgentAssessmentOutput {
  const status: AssessmentStatus =
    validated.status === "requires_follow_up"
      ? "requires_follow_up"
      : validated.status === "emergency_escalated"
      ? "emergency_escalated"
      : "completed";

  let result: AssessmentResult | undefined = undefined;

  if (status === "completed" || status === "emergency_escalated") {
    result = {
      summary: validated.summary,
      possibleConditions: validated.possible_conditions.map((c) => ({
        condition: c.condition,
        probability: c.probability,
        explanation: c.explanation,
        matchedSymptoms: c.matched_symptoms || c.matchedSymptoms || [],
      })),
      reasoningSummary: validated.reasoning_summary,
      uncertainty: validated.uncertainty,
      nextSteps: validated.next_steps,
      redFlags: validated.red_flags,
      urgencyLevel: validated.urgency_level,
      disclaimer: validated.disclaimer,
    };
  }

  return {
    status,
    followUpQuestions: validated.follow_up_questions || [],
    result,
    urgencyLevel: validated.urgency_level,
    redFlags: validated.red_flags,
  };
}
