import { InitialSymptomInput } from "@/types/assessment";

export interface SafetyCheckResult {
  isEmergency: boolean;
  hasRedFlags: boolean;
  redFlags: string[];
  urgencyLevel: "routine" | "prompt" | "urgent" | "emergency";
  emergencyTitle?: string;
  emergencyGuidance?: string;
}

interface RedFlagRule {
  id: string;
  name: string;
  urgency: "urgent" | "emergency";
  description: string;
  check: (input: InitialSymptomInput) => boolean;
}

const RED_FLAG_RULES: RedFlagRule[] = [
  // 1. Acute Cardiac / Myocardial Infarction indicators
  {
    id: "cardiac_chest_pain",
    name: "Possible Acute Cardiac Syndrome",
    urgency: "emergency",
    description: "Severe chest pain or pressure combined with radiation to arm/jaw, sweating, or severe shortness of breath.",
    check: (input) => {
      const hasChestPain = input.primarySymptoms.some(
        (s) => s.id === "chest_pain" || s.name.toLowerCase().includes("chest pain")
      );
      const desc = (input.description + " " + (input.associatedSymptoms?.join(" ") || "")).toLowerCase();
      
      if (!hasChestPain) return false;
      
      const hasRadiation = /radiat|left arm|jaw|neck|back|shoulder/.test(desc);
      const hasSweating = /sweat|diaphor|clammy|cold sweat/.test(desc);
      const hasSevereDyspnea = /breath|dyspnea|gasp|suffocat/.test(desc);
      const isSevere = input.primarySymptoms.some(
        (s) => s.id === "chest_pain" && s.severity === "severe"
      );

      return (isSevere && (hasRadiation || hasSweating || hasSevereDyspnea)) || (hasRadiation && hasSweating);
    },
  },

  // 2. Acute Stroke Warning Signs (FAST criteria)
  {
    id: "acute_stroke_signs",
    name: "Potential Acute Stroke (FAST Protocol)",
    urgency: "emergency",
    description: "Sudden one-sided weakness, facial drooping, numbness, or difficulty speaking/understanding speech.",
    check: (input) => {
      const hasNumbness = input.primarySymptoms.some(
        (s) => s.id === "numbness_weakness" || s.name.toLowerCase().includes("numbness")
      );
      const desc = (input.description + " " + (input.associatedSymptoms?.join(" ") || "")).toLowerCase();

      const strokeKeywords =
        /facial droop|face droop|slurr|speech difficul|one side|paraly|cannot speak|half of body|one arm/.test(
          desc
        );

      return (hasNumbness && strokeKeywords) || (input.progression === "worsening" && strokeKeywords);
    },
  },

  // 3. Acute Severe Respiratory Compromise
  {
    id: "severe_respiratory_distress",
    name: "Severe Respiratory Compromise",
    urgency: "emergency",
    description: "Acute inability to breathe adequately, blue coloration of lips/fingers, or gasping.",
    check: (input) => {
      const hasDyspnea = input.primarySymptoms.some(
        (s) => s.id === "shortness_of_breath" && s.severity === "severe"
      );
      const desc = (input.description + " " + (input.associatedSymptoms?.join(" ") || "")).toLowerCase();

      const distressSigns =
        /cannot breathe|gasping|blue lips|blue skin|cyanosis|inability to speak|struggling for air|stridor/.test(
          desc
        );

      return hasDyspnea && distressSigns;
    },
  },

  // 4. Anaphylaxis Warning Signs
  {
    id: "anaphylaxis_allergy",
    name: "Potential Anaphylactic Reaction",
    urgency: "emergency",
    description: "Throat swelling, difficulty breathing, tongue swelling, or collapse after allergen exposure.",
    check: (input) => {
      const desc = (input.description + " " + (input.associatedSymptoms?.join(" ") || "")).toLowerCase();
      const hasThroatSwelling = /throat clos|throat swell|tongue swell|lip swell|airway swell/.test(desc);
      const hasBreathingIssues = /breath|wheez|gasp|suffocat/.test(desc);
      const hasAllergyContext = /allerg|peanut|bee sting|medication|food/.test(desc);

      return hasThroatSwelling && (hasBreathingIssues || hasAllergyContext);
    },
  },

  // 5. Thunderclap / Severe Sudden Neurological Headache
  {
    id: "thunderclap_headache",
    name: "Thunderclap Headache / Possible Intracranial Hemorrhage",
    urgency: "emergency",
    description: "Sudden, explosive headache reaching maximum intensity within seconds to minutes ('worst headache of life').",
    check: (input) => {
      const hasHeadache = input.primarySymptoms.some(
        (s) => s.id === "headache" && s.severity === "severe"
      );
      const desc = (input.description + " " + (input.associatedSymptoms?.join(" ") || "")).toLowerCase();

      const thunderclapMarkers =
        /worst headache|thunderclap|sudden severe|exploded|instant peak|loss of consciousness/.test(
          desc
        );

      return hasHeadache && thunderclapMarkers;
    },
  },

  // 6. Acute Meningitis Triad
  {
    id: "meningitis_signs",
    name: "Possible Meningeal Infection",
    urgency: "emergency",
    description: "High fever accompanied by severe neck stiffness and confusion or photophobia.",
    check: (input) => {
      const hasFever = input.primarySymptoms.some((s) => s.id === "fever");
      const desc = (input.description + " " + (input.associatedSymptoms?.join(" ") || "")).toLowerCase();

      const hasStiffNeck = /stiff neck|neck rigid|cannot bend neck/.test(desc);
      const hasConfusion = /confusion|deliri|altered mental|hallucinat/.test(desc);

      return hasFever && hasStiffNeck && hasConfusion;
    },
  },

  // 7. Active Hemorrhage or Hemoptysis
  {
    id: "active_hemorrhage",
    name: "Acute Uncontrolled Bleeding or Significant Hemoptysis",
    urgency: "emergency",
    description: "Coughing up fresh blood or vomiting blood.",
    check: (input) => {
      const hasHemoptysis = input.primarySymptoms.some((s) => s.id === "hemoptysis");
      const desc = (input.description + " " + (input.associatedSymptoms?.join(" ") || "")).toLowerCase();

      const bloodMarkers = /coughing up blood|vomiting blood|coffee ground|black tarry/.test(desc);

      return hasHemoptysis || bloodMarkers;
    },
  },

  // 8. Acute Severe Abdomen (Peritonitis / Rupture)
  {
    id: "acute_rigid_abdomen",
    name: "Acute Surgical Abdomen",
    urgency: "emergency",
    description: "Sudden unbearable abdominal pain with board-like abdominal wall rigidity or fainting.",
    check: (input) => {
      const hasAbdoPain = input.primarySymptoms.some(
        (s) => s.id === "abdominal_pain" && s.severity === "severe"
      );
      const desc = (input.description + " " + (input.associatedSymptoms?.join(" ") || "")).toLowerCase();

      const acuteMarkers = /rigid|board-like|passed out|fainted|syncope|unbearable/.test(desc);

      return hasAbdoPain && acuteMarkers;
    },
  },

  // 9. Mental Health Crisis / Self-Harm
  {
    id: "self_harm_crisis",
    name: "Mental Health Crisis / Suicide Risk",
    urgency: "emergency",
    description: "Expressions of self-harm, suicidal thoughts, or immediate personal safety crisis.",
    check: (input) => {
      const desc = (input.description + " " + (input.associatedSymptoms?.join(" ") || "")).toLowerCase();
      return /suicid|kill myself|end my life|self-harm|want to die|hurt myself/.test(desc);
    },
  },
];

export function runSafetyScreening(input: InitialSymptomInput): SafetyCheckResult {
  const triggeredRules = RED_FLAG_RULES.filter((rule) => rule.check(input));

  if (triggeredRules.length === 0) {
    // Check if any individual symptom was rated severe with worsening progression (urgent prompt)
    const hasSevereWorsening = input.primarySymptoms.some(
      (s) => s.severity === "severe" && input.progression === "worsening"
    );

    return {
      isEmergency: false,
      hasRedFlags: hasSevereWorsening,
      redFlags: hasSevereWorsening
        ? ["One or more symptoms are marked as severe and progressively worsening."]
        : [],
      urgencyLevel: hasSevereWorsening ? "urgent" : "routine",
    };
  }

  const redFlags = triggeredRules.map((r) => `${r.name}: ${r.description}`);
  const hasEmergency = triggeredRules.some((r) => r.urgency === "emergency");

  return {
    isEmergency: hasEmergency,
    hasRedFlags: true,
    redFlags,
    urgencyLevel: hasEmergency ? "emergency" : "urgent",
    emergencyTitle: "CRITICAL MEDICAL WARNING: Immediate Evaluation Required",
    emergencyGuidance:
      "Your reported symptoms match warning indicators that require immediate emergency medical evaluation. Please do not wait for online analysis. Call your local emergency services (e.g. 911, 999, 112) or go immediately to the nearest hospital Emergency Room.",
  };
}
