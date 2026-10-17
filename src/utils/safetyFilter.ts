import { DiagnosisResult, ConfidenceLevel } from '../types/crop';

/**
 * Regex patterns matching dangerous dosages, mixing ratios, and chemical quantities
 * that should NEVER be given directly to smallholder farmers without on-package inspection.
 */
const DOSAGE_PATTERNS = [
  /\b\d+(\.\d+)?\s*(ml|millilitres?|liters?|litres?|l|kg|kilograms?|grams?|g|teaspoons?|tbsp|tablespoons?|cups?|bottles?|caps?|measures?)\s*(per|\/)\s*(\d+\s*)?(l|liters?|litres?|ha|hectare|acre|knapsack|bucket|drum|water)?\b/gi,
  /\b\d+\s*[-–to]+\s*\d+\s*(ml|litres?|l|kg|g|teaspoons?|grams?)\b/gi,
  /\b\d+(\.\d+)?\s*(ml|kg|grams?|litres?|teaspoons?)\s*(of\s+pesticide|of\s+chemical|of\s+fungicide|per\s+pump|per\s+knapsack|per\s+sprayer)\b/gi,
  /\bmix\s+\d+(\.\d+)?\s*(ml|g|teaspoon|tablespoon)\b/gi,
  /\bapply\s+\d+(\.\d+)?\s*(kg|litres?|ml|grams?)\b/gi,
  /\b\d+\s*%\s*(solution|concentration)\b/gi
];

/**
 * Strips specific numeric dosages and enforces licensed agro-dealer label adherence.
 */
export function sanitizeAdviceText(text: string): { cleanedText: string; dosagesRemoved: number } {
  if (!text) return { cleanedText: '', dosagesRemoved: 0 };

  let cleaned = text;
  let dosagesRemoved = 0;

  for (const pattern of DOSAGE_PATTERNS) {
    const matches = cleaned.match(pattern);
    if (matches && matches.length > 0) {
      dosagesRemoved += matches.length;
      cleaned = cleaned.replace(pattern, '[Consult agro-dealer for label dosage]');
    }
  }

  return { cleanedText: cleaned, dosagesRemoved };
}

/**
 * Strict post-processing sanitizer for any diagnosis result (AI-generated or uploaded)
 * Enforces:
 * 1. Low-risk cultural practices come first.
 * 2. Complete absence of unverified chemical dosages.
 * 3. Enforces registered agro-dealer instruction (e.g. Farmers World, ATC, Agora).
 * 4. Automatic escalation trigger when confidence < 70% or image is unclear.
 */
export function applySafetyRules(result: DiagnosisResult): DiagnosisResult {
  let totalDosagesRemoved = 0;

  // Sanitize cultural steps
  const sanitizedCulturalSteps = result.culturalSteps.map((step) => {
    const { cleanedText, dosagesRemoved } = sanitizeAdviceText(step);
    totalDosagesRemoved += dosagesRemoved;
    return cleanedText;
  });

  // Sanitize chemical advisory
  let sanitizedChemical = result.chemicalAdvisory || '';
  const { cleanedText, dosagesRemoved } = sanitizeAdviceText(sanitizedChemical);
  totalDosagesRemoved += dosagesRemoved;
  sanitizedChemical = cleanedText;

  // Mandatory registered agro-dealer reminder in chemical advisory
  if (
    result.category !== 'healthy' &&
    sanitizedChemical &&
    !sanitizedChemical.toLowerCase().includes('agro-dealer') &&
    !sanitizedChemical.toLowerCase().includes('sitolo') &&
    !sanitizedChemical.toLowerCase().includes('mankhwala ovomerezeka')
  ) {
    if (result.language === 'ny') {
      sanitizedChemical += ' Gwiritsani ntchito mankhwala ovomerezeka ochokera ku sitolo yovomerezeka (Agro-dealer monga Farmers World kapena ATC) ndipo tsatirani malangizo a pa chikalata cha paketi mosamalitsa. Osapereka kapena kuyeza mankhwala popanda kuwerenga paketi.';
    } else if (result.language === 'tum') {
      sanitizedChemical += ' Mukhale maso kugwiliska ntchito munkhwala wakuzomerezgeka kufuma ku sitolo ya vyakurya (Agro-dealer) ndipo lekani kusintha masiku panji mapimo ghakulembeka pa paketi.';
    } else {
      sanitizedChemical += ' Always buy registered crop protection products from a licensed agro-dealer (such as Farmers World, Agora, or ATC). Strictly follow the manufacturer label for exact application instructions and safety gear.';
    }
  }

  // Safety Warning check
  let safetyWarning = result.safetyWarning;
  if (!safetyWarning || safetyWarning.trim().length === 0) {
    if (result.language === 'ny') {
      safetyWarning = "CHENJEZO: Valani zoteteza kumaso, mkamwa, ndi m'manja popopera mankhwala alionse. Osathira mankhwala pafupi ndi zitsime za madzi, ana, kapena ziweto.";
    } else if (result.language === 'tum') {
      safetyWarning = 'CHENJEZGO: Vwalani vyakujivikilira pa maso na minwe para mukupopera munkhwala. Lekani kuthira munkhwala pafupi na maji ghakumwa, ŵana, panji viŵeto.';
    } else {
      safetyWarning = 'SAFETY NOTE: Wear protective gear (mask, gloves, boots) when handling any treatment. Keep away from water sources, children, and livestock. Never reuse chemical containers for food or water.';
    }
  }

  // Determine Confidence Level
  let confidenceLevel: ConfidenceLevel = 'low';
  if (result.confidenceScore >= 80) {
    confidenceLevel = 'high';
  } else if (result.confidenceScore >= 65) {
    confidenceLevel = 'medium';
  } else {
    confidenceLevel = 'low';
  }

  // Confidence check and forced escalation:
  // If confidence < 70%, photo unclear, or severity high/critical
  const confidenceBelowThreshold = result.confidenceScore < 70;
  const isUnclear = result.category === 'unclear';
  const isCriticalSeverity = result.severity === 'critical';

  let requiresEscalation = result.requiresEscalation || confidenceBelowThreshold || isUnclear || isCriticalSeverity;
  let escalationReason = result.escalationReason;

  if (!escalationReason) {
    if (confidenceBelowThreshold) {
      escalationReason = result.language === 'ny'
        ? `Chitsimikizo ndi chochepa (${result.confidenceScore}%). Tikulimbikitsa kutumiza chithunzichi kwa Mlangizi wa za Ulimi kuti mupeze chithandizo chodalirika.`
        : result.language === 'tum'
        ? `Chitsimikizgo chili pasi (${result.confidenceScore}%). Tumizgani chithuzithuzi ichi kwa Mulara wa Vyaulimi kuti muwovwirike makora.`
        : `AI confidence is below 70% (${result.confidenceScore}%). Human extension officer review is strongly advised before taking major action.`;
    } else if (isCriticalSeverity) {
      escalationReason = result.language === 'ny'
        ? 'Vuto ili litha kuwononga kwambiri zokolola mwamsanga. Lumikizanani ndi Mlangizi wa za Ulimi wanu.'
        : result.language === 'tum'
        ? 'Suzu iyi yingasakaza vyakurya vinandi mwaluŵiro. Phalirani Mulara wa Vyaulimi mwakwimikika.'
        : 'This issue poses an immediate harvest-threatening risk. Direct consultation with your local agricultural officer is advised.';
    }
  }

  return {
    ...result,
    confidenceLevel,
    culturalSteps: sanitizedCulturalSteps,
    chemicalAdvisory: sanitizedChemical,
    safetyWarning,
    requiresEscalation,
    escalationReason,
    rawDosagesRemovedCount: totalDosagesRemoved,
    translationNeedsHumanReview: result.language !== 'en',
  };
}
