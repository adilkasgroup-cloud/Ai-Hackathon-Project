import { SamplePhotoCase } from '../types/crop';

// Real field photos for the preloaded sample cases (served from /public/samples)
const fallArmywormImg = '/samples/fall-armyworm.jpg';

const maizeStreakImg = '/samples/maize-streak.jpg';

const tobaccoCercosporaImg = '/samples/tobacco-frog-eye.jpg';

const blurryUnclearImg = '/samples/unclear-sample.jpg';

export const SAMPLE_CASES: SamplePhotoCase[] = [
  {
    id: 'case-fall-armyworm',
    crop: 'Maize',
    title: 'Fall Armyworm',
    category: 'pest',
    imageUrl: fallArmywormImg,
    thumbnailUrl: fallArmywormImg,
    previewDescription: 'Whorl feeding holes, sawdust frass, leaf windowing',
    precomputedResult: {
      en: {
        id: 'diag-faw-en',
        cropName: 'Maize',
        category: 'pest',
        primaryDiagnosis: 'Fall Armyworm (Spodoptera frugiperda)',
        localDiagnosisName: 'Fall Armyworm',
        confidenceScore: 92,
        confidenceLevel: 'high',
        visualObservations: [
          'Irregular "windowpane" feeding holes and ragged tears on the young whorl leaves',
          'Accumulation of coarse, moist, sawdust-like frass (excrement) inside the central funnel',
          'Visible dark head capsule with inverted Y-marking on a caterpillar hiding deep within the whorl',
        ],
        differentialDiagnoses: [
          {
            name: 'African Maize Stalk Borer (Busseola fusca)',
            probability: 34,
            distinguishingFeature: 'Stalk borer creates neat horizontal rows of pin-holes across unfolded leaves rather than large ragged tears.',
          },
          {
            name: 'Grasshopper or Locust Foliage Chewing',
            probability: 14,
            distinguishingFeature: 'Chews leaf edges from outside inward with no frass buildup inside the central whorl.',
          },
        ],
        severity: 'critical',
        requiresEscalation: false,
        culturalSteps: [
          'Scouting: Check 20 consecutive maize plants in 5 different parts of your field twice weekly.',
          'Hand-picking: In small gardens, hand-collect caterpillars and crush egg masses (covered in cream-colored fuzz) in early morning.',
          'Local bio-barrier: Drop a small pinch of clean fine soil, sand, or wood ash directly into the funnel of attacked plants to desiccate young caterpillars.',
          'Crop hygiene: Intercrop with legumes (beans or cowpeas) or desmodium (push-pull approach) to deter moths.',
        ],
        chemicalAdvisory:
          'If more than 20 out of 100 plants have active fresh frass, consult a registered agro-dealer (such as Farmers World, Agora, or ATC) for registered pest control products. Strictly follow the instructions and timing on the manufacturer packaging. We do not provide chemical dosages.',
        safetyWarning:
          'SAFETY NOTE: Always wear protective rubber gloves, face mask, and long clothing when handling agrochemicals. Wash your hands thoroughly with soap. Keep all chemicals away from children, livestock, and local drinking water wells.',
        language: 'en',
        timestamp: new Date().toISOString(),
        imageUrl: fallArmywormImg,
      },
    },
  },
  {
    id: 'case-maize-streak',
    crop: 'Maize',
    title: 'Maize Streak Virus (MSV)',
    category: 'disease',
    imageUrl: maizeStreakImg,
    thumbnailUrl: maizeStreakImg,
    previewDescription: 'Chlorotic parallel yellow-white streaks on leaves',
    precomputedResult: {
      en: {
        id: 'diag-msv-en',
        cropName: 'Maize',
        category: 'disease',
        primaryDiagnosis: 'Maize Streak Virus (MSV)',
        localDiagnosisName: 'Maize Streak Virus',
        confidenceScore: 88,
        confidenceLevel: 'high',
        visualObservations: [
          'Narrow, continuous yellow-to-white parallel streaks closely following leaf veins',
          'Interspersed healthy green tissue between elongated chlorotic bands',
          'Uniform pattern originating from the base of newly emerged leaves',
        ],
        differentialDiagnoses: [
          {
            name: 'Maize Dwarf Mosaic Virus (MDMV)',
            probability: 28,
            distinguishingFeature: 'MDMV produces mottled blotches and yellow flecks rather than continuous uniform stripes.',
          },
          {
            name: 'Zinc or Nitrogen Nutrient Deficiency',
            probability: 19,
            distinguishingFeature: 'Nutrient deficiency typically appears as wide interveinal yellow bands rather than distinct pinpoint continuous lines.',
          },
        ],
        severity: 'high',
        requiresEscalation: false,
        culturalSteps: [
          'Rogueing: Immediately uproot and deeply bury young infected plants to prevent leafhoppers (Cicadulina) from infecting neighboring plants.',
          'Weed sanitation: Clear wild grass weeds around field boundaries where vector leafhoppers shelter.',
          'Early planting: Plant maize simultaneously with the first consistent rains to allow crops to grow past the most vulnerable early seedling stage before leafhopper populations multiply.',
          'Next season planning: Obtain certified seed with genetic resistance to Maize Streak Virus from your local agro-dealer.',
        ],
        chemicalAdvisory:
          'Notice: Maize Streak Virus is a viral disease and CANNOT be cured by applying chemicals to infected plants. Do not waste money on fungicides. Chemical control is strictly restricted to seed dressing or early nursery leafhopper control as advised by your local extension officer. We do not provide chemical dosages.',
        safetyWarning:
          'SAFETY NOTE: Ensure rogued infected plants are buried deep in the soil away from water courses. Wash tools after clearing infected plots.',
        language: 'en',
        timestamp: new Date().toISOString(),
        imageUrl: maizeStreakImg,
      },
    },
  },
  {
    id: 'case-tobacco-frog-eye',
    crop: 'Tobacco',
    title: 'Cercospora Leaf Spot / Frog Eye',
    category: 'disease',
    imageUrl: tobaccoCercosporaImg,
    thumbnailUrl: tobaccoCercosporaImg,
    previewDescription: 'Circular brown lesions with pale grey centers on mature leaves',
    precomputedResult: {
      en: {
        id: 'diag-cerc-en',
        cropName: 'Tobacco',
        category: 'disease',
        primaryDiagnosis: 'Frog-Eye Leaf Spot (Cercospora nicotianae)',
        localDiagnosisName: 'Frog-Eye Leaf Spot',
        confidenceScore: 84,
        confidenceLevel: 'high',
        visualObservations: [
          'Distinct circular spots (2-5 mm) with pale parchment-grey centers and reddish-brown borders',
          'Slight chlorotic yellowish halo encircling the lesion margins on lower and middle leaves',
          'Characteristic "frog-eye" pattern typical of fungal sporulation during humid conditions',
        ],
        differentialDiagnoses: [
          {
            name: 'Brown Spot (Alternaria alternata)',
            probability: 39,
            distinguishingFeature: 'Alternaria spots exhibit prominent concentric target-like rings without the bleached white center.',
          },
          {
            name: 'Weather Fleck / Ozone Injury',
            probability: 17,
            distinguishingFeature: 'Irregular minute flecks concentrated along upper leaf surface without dark circular fungal margins.',
          },
        ],
        severity: 'moderate',
        requiresEscalation: false,
        culturalSteps: [
          'Priming: Harvest lower mature leaves promptly to improve airflow and stop spores from splashing upwards.',
          'Field hygiene: Avoid moving through wet tobacco fields in early morning or after rain to avoid spreading fungal spores.',
          'Crop rotation: Rotate tobacco plots with maize, sorghum, or grass for at least 2 seasons; avoid planting after tomato or potato.',
          'Residue management: Pluck off severely spotted lower leaves and bury or remove them from the field.',
        ],
        chemicalAdvisory:
          'If the disease appears early before curing, consult a licensed tobacco agro-dealer (such as ATC or certified auction floor supplier) for registered fungicide options suitable for cured leaf compliance. Strictly follow the manufacturer product label and required pre-harvest intervals. We do not provide chemical dosages.',
        safetyWarning:
          'SAFETY NOTE: Wear full protective gear including chemical-resistant overalls, gloves, and boots. Never eat, drink, or smoke when handling tobacco crop protection products. Dispose of rinse water away from wells.',
        language: 'en',
        timestamp: new Date().toISOString(),
        imageUrl: tobaccoCercosporaImg,
      },
    },
  },
  {
    id: 'case-unclear-escalation',
    crop: 'Maize / Other',
    title: 'Low Clarity Sample (Forces Escalation)',
    category: 'unclear',
    imageUrl: blurryUnclearImg,
    thumbnailUrl: blurryUnclearImg,
    previewDescription: 'Blurry low-contrast foliage (triggers mandatory AEDO review)',
    precomputedResult: {
      en: {
        id: 'diag-unclear-en',
        cropName: 'Maize / Unidentified Field Crop',
        category: 'unclear',
        primaryDiagnosis: 'Unclear Symptoms (Foliage discoloration)',
        localDiagnosisName: 'Unclear Photo (Retake Needed)',
        confidenceScore: 42,
        confidenceLevel: 'low',
        visualObservations: [
          'Image focus is blurry with excessive lighting glare on the foliage surface',
          'Vague discoloration visible, but leaf margins, lesions, and pest frass cannot be identified with certainty',
          'Insufficient fine visual resolution to distinguish bacterial wilt, fungal spot, or simple drought scorch',
        ],
        differentialDiagnoses: [
          {
            name: 'Severe Drought or Moisture Stress',
            probability: 30,
            distinguishingFeature: 'Uniform leaf wilting without localized bacterial lesions.',
          },
          {
            name: 'Bacterial Stalk or Leaf Rot',
            probability: 25,
            distinguishingFeature: 'Water-soaked soft rotting with foul smell at the plant base.',
          },
        ],
        severity: 'high',
        requiresEscalation: true,
        escalationReason: 'Confidence is below 70% (42%) and the photo is blurry. Agricultural safety rules require human review by an extension officer (AEDO) before applying any chemical treatment.',
        culturalSteps: [
          'Take a new photo: Move closer to a sharp leaf, avoid direct blinding sunlight, and steady the camera.',
          'Scout for physical signs: Inspect the base of the plant for rotting, soft stems, or insect boreholes.',
          'Do NOT spray chemicals: Without a verified diagnosis, spraying may waste money or harm healthy crops.',
          'Contact your local extension officer: Use the escalation button below to dispatch this case to your nearest EPA.',
        ],
        chemicalAdvisory:
          'DO NOT SPRAY. Because the diagnosis confidence is too low (42%), applying chemical pesticide or fungicide could damage your crop and waste hard-earned money. Wait for extension officer advice or visit an agro-dealer with an actual physical leaf cutting.',
        safetyWarning:
          'SAFETY NOTE: Never apply unidentified chemicals to uncertain crop symptoms. Improper chemical use can destroy beneficial soil microbes and endanger farm workers.',
        language: 'en',
        timestamp: new Date().toISOString(),
        imageUrl: blurryUnclearImg,
      },
    },
  },
];
