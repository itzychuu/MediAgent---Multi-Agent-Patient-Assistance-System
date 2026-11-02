export interface SymptomCatalogItem {
  id: string;
  name: string;
  category: SymptomCategory;
  description: string;
  bodyLocation: string;
  commonSeverities: ("mild" | "moderate" | "severe")[];
  redFlagTriggers?: string[];
}

export type SymptomCategory =
  | "General & Systemic"
  | "Head & Neurological"
  | "Chest & Cardiovascular"
  | "Respiratory"
  | "Abdominal & Digestive"
  | "Musculoskeletal"
  | "Skin & Dermatological"
  | "Throat & ENT";

export const SYMPTOM_CATEGORIES: SymptomCategory[] = [
  "General & Systemic",
  "Head & Neurological",
  "Chest & Cardiovascular",
  "Respiratory",
  "Abdominal & Digestive",
  "Musculoskeletal",
  "Skin & Dermatological",
  "Throat & ENT",
];

export const DURATION_OPTIONS = [
  "Less than 24 hours",
  "1 to 3 days",
  "4 to 7 days",
  "1 to 2 weeks",
  "More than 2 weeks",
  "Several months / Chronic",
];

export const PROGRESSION_OPTIONS = [
  { value: "improving", label: "Improving / Getting better" },
  { value: "stable", label: "Stable / About the same" },
  { value: "worsening", label: "Worsening / Getting progressively more intense" },
  { value: "fluctuating", label: "Fluctuating / Comes and goes in waves" },
] as const;

export const SYMPTOM_CATALOG: SymptomCatalogItem[] = [
  // General & Systemic
  {
    id: "fever",
    name: "Fever",
    category: "General & Systemic",
    description: "Elevated body temperature above 38°C (100.4°F), often accompanied by chills.",
    bodyLocation: "Entire Body",
    commonSeverities: ["mild", "moderate", "severe"],
    redFlagTriggers: ["fever above 40C", "fever with stiff neck", "fever with confusion"],
  },
  {
    id: "fatigue",
    name: "Severe Fatigue / Malaise",
    category: "General & Systemic",
    description: "Extreme persistent exhaustion not relieved by sleep or rest.",
    bodyLocation: "Entire Body",
    commonSeverities: ["mild", "moderate", "severe"],
  },
  {
    id: "unexplained_weight_loss",
    name: "Unexplained Weight Loss",
    category: "General & Systemic",
    description: "Significant unintentional loss of body weight over recent weeks or months.",
    bodyLocation: "Entire Body",
    commonSeverities: ["moderate", "severe"],
  },
  {
    id: "chills_sweats",
    name: "Chills and Night Sweats",
    category: "General & Systemic",
    description: "Drenching nighttime sweating or intense shivering episodes.",
    bodyLocation: "Entire Body",
    commonSeverities: ["mild", "moderate", "severe"],
  },

  // Head & Neurological
  {
    id: "headache",
    name: "Headache",
    category: "Head & Neurological",
    description: "Ache, throbbing, or pressure anywhere in the head or temples.",
    bodyLocation: "Head",
    commonSeverities: ["mild", "moderate", "severe"],
    redFlagTriggers: ["thunderclap headache", "sudden worst headache", "headache with vision loss"],
  },
  {
    id: "dizziness_vertigo",
    name: "Dizziness or Vertigo",
    category: "Head & Neurological",
    description: "Feeling faint, lightheaded, or a spinning sensation of the surroundings.",
    bodyLocation: "Head",
    commonSeverities: ["mild", "moderate", "severe"],
  },
  {
    id: "numbness_weakness",
    name: "Sudden Numbness or Weakness",
    category: "Head & Neurological",
    description: "Loss of sensation or motor strength, particularly on one side of face, arm, or leg.",
    bodyLocation: "Face or Limbs",
    commonSeverities: ["moderate", "severe"],
    redFlagTriggers: ["facial drooping", "arm weakness", "slurred speech"],
  },
  {
    id: "confusion_disorientation",
    name: "Acute Confusion / Altered Mental State",
    category: "Head & Neurological",
    description: "Sudden difficulty focusing, disorientation, or inability to communicate clearly.",
    bodyLocation: "Brain / Cognitive",
    commonSeverities: ["severe"],
    redFlagTriggers: ["sudden confusion", "lethargy", "disorientation"],
  },

  // Chest & Cardiovascular
  {
    id: "chest_pain",
    name: "Chest Pain / Pressure",
    category: "Chest & Cardiovascular",
    description: "Discomfort, heaviness, crushing tightness, or stabbing pain in the chest area.",
    bodyLocation: "Chest",
    commonSeverities: ["mild", "moderate", "severe"],
    redFlagTriggers: ["crushing chest pressure", "radiating pain to left arm or jaw", "sweating with chest pain"],
  },
  {
    id: "palpitations",
    name: "Heart Palpitations",
    category: "Chest & Cardiovascular",
    description: "Feeling of rapid, fluttering, pounding, or irregular heartbeats.",
    bodyLocation: "Chest",
    commonSeverities: ["mild", "moderate", "severe"],
  },
  {
    id: "swollen_ankles",
    name: "Swollen Ankles / Peripheral Edema",
    category: "Chest & Cardiovascular",
    description: "Puffy fluid buildup in the feet, ankles, or lower extremities.",
    bodyLocation: "Lower Limbs",
    commonSeverities: ["mild", "moderate"],
  },

  // Respiratory
  {
    id: "shortness_of_breath",
    name: "Shortness of Breath (Dyspnea)",
    category: "Respiratory",
    description: "Difficulty catching breath, tightness in lungs, or gasping during rest or light exertion.",
    bodyLocation: "Chest / Lungs",
    commonSeverities: ["mild", "moderate", "severe"],
    redFlagTriggers: ["inability to speak full sentences", "blue lips", "gasping for air"],
  },
  {
    id: "persistent_cough",
    name: "Persistent Cough",
    category: "Respiratory",
    description: "Dry, hacking, or productive mucus-producing cough.",
    bodyLocation: "Lungs / Airway",
    commonSeverities: ["mild", "moderate", "severe"],
  },
  {
    id: "wheezing",
    name: "Wheezing or Stridor",
    category: "Respiratory",
    description: "High-pitched whistling sound when breathing in or out.",
    bodyLocation: "Lungs / Airway",
    commonSeverities: ["mild", "moderate", "severe"],
  },
  {
    id: "hemoptysis",
    name: "Coughing up Blood (Hemoptysis)",
    category: "Respiratory",
    description: "Blood-tinged sputum or coughing up noticeable amounts of red blood.",
    bodyLocation: "Lungs / Airway",
    commonSeverities: ["severe"],
    redFlagTriggers: ["coughing up blood", "active airway bleeding"],
  },

  // Abdominal & Digestive
  {
    id: "abdominal_pain",
    name: "Abdominal Pain / Cramping",
    category: "Abdominal & Digestive",
    description: "Sharp, dull, cramping, or persistent pain in the stomach or pelvic area.",
    bodyLocation: "Abdomen",
    commonSeverities: ["mild", "moderate", "severe"],
    redFlagTriggers: ["rigid abdomen", "unbearable acute abdominal pain", "rebound tenderness"],
  },
  {
    id: "nausea_vomiting",
    name: "Nausea and Vomiting",
    category: "Abdominal & Digestive",
    description: "Upset stomach with an urge to vomit or repeated vomiting episodes.",
    bodyLocation: "Stomach",
    commonSeverities: ["mild", "moderate", "severe"],
    redFlagTriggers: ["vomiting blood", "coffee ground emesis"],
  },
  {
    id: "diarrhea",
    name: "Diarrhea",
    category: "Abdominal & Digestive",
    description: "Frequent loose, watery bowel movements.",
    bodyLocation: "Digestive Tract",
    commonSeverities: ["mild", "moderate", "severe"],
    redFlagTriggers: ["black tarry stools", "bloody diarrhea with fever"],
  },
  {
    id: "heartburn",
    name: "Acid Reflux / Heartburn",
    category: "Abdominal & Digestive",
    description: "Burning sensation in upper chest, acid regurgitation, or sour taste in throat.",
    bodyLocation: "Esophagus / Upper Chest",
    commonSeverities: ["mild", "moderate"],
  },

  // Musculoskeletal
  {
    id: "joint_pain_swelling",
    name: "Joint Pain and Stiffness",
    category: "Musculoskeletal",
    description: "Painful, swollen, warm, or stiff joints (e.g. knees, hips, wrists, fingers).",
    bodyLocation: "Joints",
    commonSeverities: ["mild", "moderate", "severe"],
  },
  {
    id: "back_pain",
    name: "Lower Back Pain",
    category: "Musculoskeletal",
    description: "Aching, sharp, or radiating pain along the lumbar spine or buttocks.",
    bodyLocation: "Lower Back",
    commonSeverities: ["mild", "moderate", "severe"],
    redFlagTriggers: ["loss of bowel or bladder control", "numbness in groin area"],
  },
  {
    id: "muscle_weakness",
    name: "Generalized Muscle Aches (Myalgia)",
    category: "Musculoskeletal",
    description: "Diffuse muscular soreness, tenderness, or stiffness throughout limbs.",
    bodyLocation: "Muscles",
    commonSeverities: ["mild", "moderate"],
  },

  // Skin & Dermatological
  {
    id: "skin_rash",
    name: "Skin Rash or Hives",
    category: "Skin & Dermatological",
    description: "Red, raised, bumpy, or spreading patches across skin, with or without itching.",
    bodyLocation: "Skin",
    commonSeverities: ["mild", "moderate", "severe"],
    redFlagTriggers: ["rapidly spreading purple rash", "rash with facial or lip swelling"],
  },
  {
    id: "severe_itching",
    name: "Severe Itching (Pruritus)",
    category: "Skin & Dermatological",
    description: "Intense, distressing urge to scratch skin without visible localized bite.",
    bodyLocation: "Skin",
    commonSeverities: ["mild", "moderate"],
  },

  // Throat & ENT
  {
    id: "sore_throat",
    name: "Sore Throat / Painful Swallowing",
    category: "Throat & ENT",
    description: "Scratchy, painful, or burning sensation in throat when speaking or swallowing.",
    bodyLocation: "Throat",
    commonSeverities: ["mild", "moderate", "severe"],
  },
  {
    id: "sinus_congestion",
    name: "Sinus Congestion & Facial Pressure",
    category: "Throat & ENT",
    description: "Stuffy nasal passages, facial tenderness around cheeks/eyes, and thick drainage.",
    bodyLocation: "Face & Sinuses",
    commonSeverities: ["mild", "moderate"],
  },
  {
    id: "ear_pain",
    name: "Earache or Hearing Muffled",
    category: "Throat & ENT",
    description: "Sharp or throbbing pain in one or both ears with pressure or drainage.",
    bodyLocation: "Ears",
    commonSeverities: ["mild", "moderate"],
  },
];

export function searchSymptomCatalog(query: string, category?: string): SymptomCatalogItem[] {
  const normalized = query.trim().toLowerCase();
  return SYMPTOM_CATALOG.filter((item) => {
    const matchesCategory = !category || category === "All" || item.category === category;
    if (!matchesCategory) return false;
    if (!normalized) return true;
    return (
      item.name.toLowerCase().includes(normalized) ||
      item.description.toLowerCase().includes(normalized) ||
      item.bodyLocation.toLowerCase().includes(normalized)
    );
  });
}
