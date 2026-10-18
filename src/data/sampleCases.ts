import { SamplePhotoCase } from '../types/crop';

// Realistic inline SVG representations for agricultural samples
const fallArmywormIllustration = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2d5a27"/>
      <stop offset="50%" stop-color="#467c38"/>
      <stop offset="100%" stop-color="#1e3f1a"/>
    </linearGradient>
    <linearGradient id="leaf" x1="0%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#5fa343"/>
      <stop offset="50%" stop-color="#4b8932"/>
      <stop offset="100%" stop-color="#2e591c"/>
    </linearGradient>
    <radialGradient id="hole" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#422918"/>
      <stop offset="80%" stop-color="#7c5836"/>
      <stop offset="100%" stop-color="#2a4e1a"/>
    </radialGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg)"/>
  
  <!-- Maize stalk and whorl -->
  <path d="M 200,300 C 190,200 180,120 195,40 C 205,120 215,200 205,300 Z" fill="#3d6c29"/>
  <path d="M 195,150 Q 80,120 20,180 Q 90,220 195,190 Z" fill="url(#leaf)"/>
  <path d="M 205,130 Q 320,90 380,160 Q 310,210 205,170 Z" fill="url(#leaf)"/>
  <path d="M 200,90 Q 120,40 50,70 Q 130,110 198,110 Z" fill="url(#leaf)"/>
  <path d="M 202,70 Q 280,30 360,50 Q 270,90 202,95 Z" fill="url(#leaf)"/>

  <!-- Midrib lines -->
  <path d="M 195,170 Q 100,150 25,180" stroke="#8ec86c" stroke-width="3" fill="none"/>
  <path d="M 205,150 Q 300,125 375,160" stroke="#8ec86c" stroke-width="3" fill="none"/>

  <!-- Armyworm windowpane feeding & ragged holes -->
  <path d="M 110,140 Q 125,130 140,145 Q 120,160 110,140 Z" fill="url(#hole)" stroke="#a17c4b" stroke-width="1.5"/>
  <path d="M 70,160 Q 85,155 95,170 Q 80,180 70,160 Z" fill="url(#hole)"/>
  <path d="M 150,155 Q 170,150 165,165 Q 155,170 150,155 Z" fill="url(#hole)"/>
  <path d="M 240,125 Q 260,115 270,135 Q 250,145 240,125 Z" fill="url(#hole)" stroke="#a17c4b" stroke-width="1.5"/>
  <path d="M 290,135 Q 310,130 315,145 Q 300,155 290,135 Z" fill="url(#hole)"/>

  <!-- Yellowish "windowing" translucent leaf patches -->
  <ellipse cx="130" cy="150" rx="30" ry="12" fill="#d4c965" opacity="0.45"/>
  <ellipse cx="265" cy="130" rx="35" ry="14" fill="#d4c965" opacity="0.45"/>
  
  <!-- Frass (sawdust-like droppings in whorl) -->
  <circle cx="196" cy="115" r="2.5" fill="#785025"/>
  <circle cx="192" cy="120" r="3" fill="#603e1b"/>
  <circle cx="201" cy="118" r="2" fill="#503316"/>
  <circle cx="198" cy="125" r="3.5" fill="#69431d"/>
  <circle cx="204" cy="122" r="2.5" fill="#785025"/>

  <!-- Fall armyworm caterpillar visible in whorl -->
  <path d="M 188,105 Q 198,112 208,107 Q 212,111 202,118 Q 186,114 188,105 Z" fill="#5a6839" stroke="#37411f" stroke-width="1"/>
  <!-- Inverted Y-shape marking on head capsule -->
  <circle cx="187" cy="107" r="2.5" fill="#2b2015"/>
  <path d="M 186,106 L 187,108 M 187,108 L 188,106" stroke="#f6f3cc" stroke-width="0.8"/>
  
  <text x="14" y="28" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="bold" opacity="0.9">Field Photo: Maize Leaf &amp; Whorl</text>
  <rect x="12" y="260" width="130" height="26" rx="4" fill="rgba(0,0,0,0.6)"/>
  <text x="20" y="277" fill="#86efac" font-family="sans-serif" font-size="11" font-weight="bold">Lilongwe West EPA</text>
</svg>
`)}`;

const maizeStreakIllustration = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <linearGradient id="msv_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1b4317"/>
      <stop offset="100%" stop-color="#0f290d"/>
    </linearGradient>
    <linearGradient id="msv_leaf" x1="0%" y1="0%" x2="100%" y2="80%">
      <stop offset="0%" stop-color="#559938"/>
      <stop offset="100%" stop-color="#3b7024"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#msv_bg)"/>

  <!-- Big close-up maize leaf diagonally -->
  <path d="M 30,290 C 80,180 180,100 380,20 C 370,110 300,220 180,290 Z" fill="url(#msv_leaf)"/>
  <path d="M 30,290 C 150,170 260,95 380,20" stroke="#a3d977" stroke-width="5" fill="none"/>

  <!-- Parallel chlorotic streak striations along leaf veins (classic MSV) -->
  <g stroke="#fef08a" stroke-width="1.8" opacity="0.9" stroke-linecap="round">
    <line x1="80" y1="230" x2="140" y2="190"/>
    <line x1="90" y1="245" x2="170" y2="190"/>
    <line x1="120" y1="210" x2="220" y2="145"/>
    <line x1="140" y1="230" x2="250" y2="150"/>
    <line x1="160" y1="180" x2="270" y2="110"/>
    <line x1="180" y1="205" x2="290" y2="130"/>
    <line x1="210" y1="160" x2="310" y2="90"/>
    <line x1="230" y1="185" x2="330" y2="115"/>
    <line x1="260" y1="130" x2="340" y2="70"/>
    <line x1="280" y1="150" x2="360" y2="95"/>
    <line x1="105" y1="220" x2="155" y2="185"/>
    <line x1="135" y1="195" x2="195" y2="150"/>
    <line x1="195" y1="145" x2="245" y2="110"/>
    <line x1="240" y1="110" x2="300" y2="70"/>
  </g>

  <g stroke="#fef9c3" stroke-width="1" opacity="0.6">
    <line x1="110" y1="260" x2="130" y2="245"/>
    <line x1="140" y1="250" x2="180" y2="220"/>
    <line x1="200" y1="220" x2="240" y2="190"/>
    <line x1="270" y1="170" x2="310" y2="140"/>
  </g>

  <text x="14" y="28" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="bold" opacity="0.9">Field Photo: Maize Leaf Vein Chlorosis</text>
  <rect x="12" y="260" width="125" height="26" rx="4" fill="rgba(0,0,0,0.6)"/>
  <text x="20" y="277" fill="#fde047" font-family="sans-serif" font-size="11" font-weight="bold">Dedza East EPA</text>
</svg>
`)}`;

const tobaccoCercosporaIllustration = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <linearGradient id="tob_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3d4a23"/>
      <stop offset="100%" stop-color="#232e13"/>
    </linearGradient>
    <linearGradient id="tob_leaf" x1="0%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="#739e3f"/>
      <stop offset="60%" stop-color="#5c8230"/>
      <stop offset="100%" stop-color="#486824"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#tob_bg)"/>

  <!-- Broad fleshy tobacco leaf -->
  <path d="M 200,285 C 60,250 30,120 120,40 C 200,10 280,30 350,110 C 380,210 290,270 200,285 Z" fill="url(#tob_leaf)"/>
  <!-- Main leaf vein -->
  <path d="M 200,280 C 190,180 185,110 180,45" stroke="#a4cb74" stroke-width="4.5" fill="none"/>
  <!-- Lateral veins -->
  <path d="M 195,220 C 130,200 80,180 65,160" stroke="#93ba64" stroke-width="2" fill="none"/>
  <path d="M 190,160 C 120,140 85,115 75,90" stroke="#93ba64" stroke-width="2" fill="none"/>
  <path d="M 197,200 C 260,185 310,165 335,145" stroke="#93ba64" stroke-width="2" fill="none"/>
  <path d="M 192,140 C 255,120 295,95 315,75" stroke="#93ba64" stroke-width="2" fill="none"/>

  <!-- Frog-eye leaf spot lesions: circular brown border with ash-grey center -->
  <!-- Spot 1 -->
  <circle cx="130" cy="120" r="14" fill="#543719" stroke="#36220e" stroke-width="1.5"/>
  <circle cx="130" cy="120" r="8" fill="#d1cbba"/>
  <circle cx="130" cy="120" r="2" fill="#4d3215"/>

  <!-- Spot 2 -->
  <circle cx="260" cy="110" r="16" fill="#543719" stroke="#36220e" stroke-width="1.5"/>
  <circle cx="260" cy="110" r="9" fill="#dcd7c9"/>
  <circle cx="260" cy="110" r="2.5" fill="#4d3215"/>

  <!-- Spot 3 -->
  <circle cx="160" cy="190" r="11" fill="#543719" stroke="#36220e" stroke-width="1.5"/>
  <circle cx="160" cy="190" r="6" fill="#d1cbba"/>

  <!-- Spot 4 -->
  <circle cx="230" cy="175" r="13" fill="#543719" stroke="#36220e" stroke-width="1.5"/>
  <circle cx="230" cy="175" r="7" fill="#dcd7c9"/>

  <!-- Spot 5 -->
  <circle cx="285" cy="170" r="10" fill="#543719"/>
  <circle cx="285" cy="170" r="5" fill="#d1cbba"/>

  <!-- Yellow halos around lesions -->
  <circle cx="130" cy="120" r="20" stroke="#d5d852" stroke-width="3" fill="none" opacity="0.45"/>
  <circle cx="260" cy="110" r="22" stroke="#d5d852" stroke-width="3" fill="none" opacity="0.45"/>
  <circle cx="230" cy="175" r="18" stroke="#d5d852" stroke-width="2" fill="none" opacity="0.45"/>

  <text x="14" y="28" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="bold" opacity="0.9">Field Photo: Tobacco Leaf Spots</text>
  <rect x="12" y="260" width="135" height="26" rx="4" fill="rgba(0,0,0,0.6)"/>
  <text x="20" y="277" fill="#facc15" font-family="sans-serif" font-size="11" font-weight="bold">Kasungu North EPA</text>
</svg>
`)}`;

const blurryUnclearSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <filter id="blurFilter" x="0" y="0">
      <feGaussianBlur in="SourceGraphic" stdDeviation="7" />
    </filter>
  </defs>
  <rect width="400" height="300" fill="#2d3b24"/>
  <g filter="url(#blurFilter)">
    <circle cx="200" cy="150" r="90" fill="#75993b"/>
    <path d="M 120,200 Q 220,90 320,180" stroke="#927640" stroke-width="20" fill="none"/>
    <circle cx="180" cy="130" r="25" fill="#38210f"/>
    <ellipse cx="230" cy="170" rx="40" ry="25" fill="#d6c65b"/>
  </g>
  <rect x="0" y="0" width="400" height="300" fill="rgba(255,255,255,0.08)"/>
  <text x="14" y="28" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="bold" opacity="0.9">Field Photo: Blurry / Unclear Foliage</text>
  <rect x="12" y="255" width="220" height="32" rx="4" fill="rgba(185,28,28,0.85)"/>
  <text x="20" y="276" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">⚠️ Low Clarity Sample (Triggers Review)</text>
</svg>
`)}`;

/**
 * Real sample photos
 * ------------------
 * Put real photos in src/assets/samples/ using these file names (jpg, jpeg, png or webp):
 *   fall-armyworm.jpg   maize-streak.jpg   tobacco-frog-eye.jpg
 * When a file exists it is used. When it is missing, the drawn illustration below is used,
 * so the app never shows a broken image. See src/assets/samples/ATTRIBUTION.md.
 */
const photoFiles = import.meta.glob('../assets/samples/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const samplePhoto = (name: string, fallback: string): string => {
  const hit = Object.entries(photoFiles).find(
    ([path]) => path.split('/').pop()!.replace(/\.[^.]+$/, '') === name
  );
  return hit ? hit[1] : fallback;
};

const fallArmywormImage = samplePhoto('fall-armyworm', fallArmywormIllustration);
const maizeStreakImage = samplePhoto('maize-streak', maizeStreakIllustration);
const tobaccoCercosporaImage = samplePhoto('tobacco-frog-eye', tobaccoCercosporaIllustration);

export const SAMPLE_CASES: SamplePhotoCase[] = [
  {
    id: 'case-fall-armyworm',
    crop: 'Maize',
    cropChichewa: 'Chimanga',
    cropTumbuka: 'Ngoma',
    title: 'Fall Armyworm (Buba)',
    titleChichewa: 'Mbozi ya Chiwawa (Buba)',
    titleTumbuka: 'Nthuchi ya Chiwawa (Buba)',
    category: 'pest',
    imageUrl: fallArmywormImage,
    thumbnailUrl: fallArmywormImage,
    previewDescription: 'Whorl feeding holes, sawdust frass, leaf windowing',
    precomputedResult: {
      en: {
        id: 'diag-faw-en',
        cropName: 'Maize',
        category: 'pest',
        primaryDiagnosis: 'Fall Armyworm (Spodoptera frugiperda)',
        localDiagnosisName: 'Mbozi ya Chiwawa / Buba',
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
            localName: 'Kafadala',
            probability: 34,
            distinguishingFeature: 'Stalk borer creates neat horizontal rows of pin-holes across unfolded leaves rather than large ragged tears.',
          },
          {
            name: 'Grasshopper or Locust Foliage Chewing',
            localName: 'Dzombe kapena Ziwala',
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
        translationNeedsHumanReview: false,
        timestamp: new Date().toISOString(),
        imageUrl: fallArmywormImage,
      },
      ny: {
        id: 'diag-faw-ny',
        cropName: 'Chimanga',
        category: 'pest',
        primaryDiagnosis: 'Fall Armyworm (Spodoptera frugiperda)',
        localDiagnosisName: 'Mbozi ya Chiwawa (Buba / Nsomba yachilendo)',
        confidenceScore: 92,
        confidenceLevel: 'high',
        visualObservations: [
          'Mabowo osongoka ndi ong\'ambika m\'masamba achichepere a m\'kati mwa chimanga',
          'Kudzaza kwa zonyansa zonga mankhusu (chimbuzi cha mbozi) m\'kati mwa nsonga ya chimanga',
          'Mbozi yomwe ili ndi chizindikiro cha Y wogubuduzika pamutu ikuonekera m\'kati mwake',
        ],
        differentialDiagnoses: [
          {
            name: 'African Maize Stalk Borer (Busseola fusca)',
            localName: 'Kafadala / Mbozi ya m\'tsinde',
            probability: 34,
            distinguishingFeature: 'Kafadala amapanga mizere yoyalidwa ya timabowo tating\'onoting\'ono masamba asanatambasuke.',
          },
          {
            name: 'Ziwala kapena Dzombe',
            localName: 'Kudya kwa ziwala',
            probability: 14,
            distinguishingFeature: 'Ziwala zimadya masamba kuchokera kunja kulowa m\'kati ndipo sizisiya zonyansa m\'kati mwa mtima wa chimanga.',
          },
        ],
        severity: 'critical',
        requiresEscalation: false,
        culturalSteps: [
          'Kuyang\'ana munda: Yenderani munda wanu kawiri pa sabata, kuyang\'ana miphukira ya chimanga 20 m\'malo 5 osiyanasiyana.',
          'Kutola ndi manja: M\'minda ing\'onoang\'ono, tolani mbozizo ndi manja m\'mawa kwambiri ndi kuphwanya mazira awo.',
          'Njira yachikhalidwe ya mchenga kapena phulusa: Thirani mchenga wosalala kapena phulusa lophikira pang\'ono m\'kati mwa nsonga ya chimanga chovulala kuti mbozi zife.',
          'Kusakaniza mbeu: Limani chimanga posakaniza ndi nyemba kapena nandolo kuti agulugufe asamawononge chimanga.',
        ],
        chemicalAdvisory:
          'Ngati mbeu zopitilira 20 pa mbeu 100 zili ndi mbozizi, pitani ku sitolo yovomerezeka ya mankhwala a za ulimi (Agro-dealer monga Farmers World, Agora kapena ATC). Gulani mankhwala ovomerezeka ndipo tsatirani chikalata cha pa phukusi mosamalitsa. Sitipereka miyezo ya mankhwala.',
        safetyWarning:
          'CHENJEZO LA CHITETEZO: Valani zoteteza kumaso, magolovesi a mphira, ndi zovala zamanja aatali popopera mankhwala. Sambani m\'manja ndi sopo bwino lomwe. Sungani mankhwala kutali ndi ana, ziweto, ndi madzi akumwa.',
        language: 'ny',
        translationNeedsHumanReview: true,
        timestamp: new Date().toISOString(),
        imageUrl: fallArmywormImage,
      },
      tum: {
        id: 'diag-faw-tum',
        cropName: 'Ngoma',
        category: 'pest',
        primaryDiagnosis: 'Fall Armyworm (Spodoptera frugiperda)',
        localDiagnosisName: 'Nthuchi ya Chiwawa (Buba)',
        confidenceScore: 92,
        confidenceLevel: 'high',
        visualObservations: [
          'Mabowo ghakusweka na ghakukotoka pa majani gha m\'katikati mwa ngoma',
          'Vinthu vyakuwoneka nga nthethe (viswaswa vya nthuchi) mukati mwa mphukira ya ngoma',
          'Nthuchi yenecho yikuwoneka mukati mwa mphukira ndipo yili na chimanyikwiro cha Y wakupindika pa mutu',
        ],
        differentialDiagnoses: [
          {
            name: 'African Maize Stalk Borer (Busseola fusca)',
            localName: 'Kafadala',
            probability: 34,
            distinguishingFeature: 'Kafadala wakudumura munjira yakudunjika mabowo ghachokoghachoko pa jani.',
          },
          {
            name: 'Nkhululu panji Chombe',
            localName: 'Kusakaza kwa chombe',
            probability: 14,
            distinguishingFeature: 'Vikurya kufuma ku mumphete kuluta mukati, kulije nthethe mukati.',
          },
        ],
        severity: 'critical',
        requiresEscalation: false,
        culturalSteps: [
          'Kupenda munda: Yendani mu munda kawiri pa sabata, kupenda vyomela 20 pa malo 5 ghakupambana.',
          'Kutora na mawoko: Mu viminda vichoko, torani nthuchi na kuphyonyora masira ghawo mulenjilenji.',
          'Kugwiliskira ntchito mchenga panji jito: Thirani jito la pa moto lachoko mukati mwa ngoma yeneiyo yalwaliskika.',
          'Kupanda mbeu zakusazga: Pandilani pamoza na nchana panji ntchana zakusiyana.',
        ],
        chemicalAdvisory:
          'Para vyakuvunda vyajumpha ngoma 20 pa 100, lutani ku sitolo yakuzomerezgeka ya munkhwala wa vyakurya (Agro-dealer). Gulani munkhwala wakuzomerezgeka ndipo ŵerengani chikalata cha pa paketi mwakupwererera. Tindapereke mapimo gha munkhwala.',
        safetyWarning:
          'CHENJEZGO: Vwalani vyakujivikilira pa maso na pa minwe para mukukhwaska munkhwala. Gezani na sopo para mwamala. Sungani munkhwala kutali na ŵana, viŵeto na visimi vya maji ghakumwa.',
        language: 'tum',
        translationNeedsHumanReview: true,
        timestamp: new Date().toISOString(),
        imageUrl: fallArmywormImage,
      },
    },
  },
  {
    id: 'case-maize-streak',
    crop: 'Maize',
    cropChichewa: 'Chimanga',
    cropTumbuka: 'Ngoma',
    title: 'Maize Streak Virus (MSV)',
    titleChichewa: 'Nthenda ya Mizere ya Chimanga',
    titleTumbuka: 'Nthenda ya Mizere mu Ngoma',
    category: 'disease',
    imageUrl: maizeStreakImage,
    thumbnailUrl: maizeStreakImage,
    previewDescription: 'Chlorotic parallel yellow-white streaks on leaves',
    precomputedResult: {
      en: {
        id: 'diag-msv-en',
        cropName: 'Maize',
        category: 'disease',
        primaryDiagnosis: 'Maize Streak Virus (MSV)',
        localDiagnosisName: 'Nthenda ya Mizere ya Chimanga',
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
            localName: 'Nthenda ya Matenda a Dzungu',
            probability: 28,
            distinguishingFeature: 'MDMV produces mottled blotches and yellow flecks rather than continuous uniform stripes.',
          },
          {
            name: 'Zinc or Nitrogen Nutrient Deficiency',
            localName: 'Kusowa kwa Mchere wa m\'nthaka',
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
        translationNeedsHumanReview: false,
        timestamp: new Date().toISOString(),
        imageUrl: maizeStreakImage,
      },
      ny: {
        id: 'diag-msv-ny',
        cropName: 'Chimanga',
        category: 'disease',
        primaryDiagnosis: 'Maize Streak Virus (MSV)',
        localDiagnosisName: 'Nthenda ya Mizere ya Chimanga',
        confidenceScore: 88,
        confidenceLevel: 'high',
        visualObservations: [
          'Mizere yachikasu ndi yoyera yopyapyala yomwe ikutsatira mitsempha ya tsamba la chimanga',
          'Kutsala kwa malo obiriwira pakati pa mizere yovulalayi',
          'Mizereyi ikuchokera pansi pa tsamba kupita m\'mwamba mwadongosolo',
        ],
        differentialDiagnoses: [
          {
            name: 'Maize Dwarf Mosaic Virus',
            localName: 'Matenda a mawanga',
            probability: 28,
            distinguishingFeature: 'Izi zimapanga mawanga osakanikirana osati mizere yowongoka yotsatira mitsempha.',
          },
          {
            name: 'Kusowa kwa feteleza kapena mchere m\'nthaka',
            localName: 'Njala ya mbeu',
            probability: 19,
            distinguishingFeature: 'Kusowa feteleza kumaonetsa tsamba lonse kukhala lachikasu osati mizere yoyera yowoneka bwino chonchi.',
          },
        ],
        severity: 'high',
        requiresEscalation: false,
        culturalSteps: [
          'Kuzula mbeu zodwala (Rogueing): Zulani mbeu zochepa zomwe zayamba kudwalazi ndipo zikwirireni pansi mwachangu kuti tizirombo tosanyamula matenda ku mbeu zathanzi.',
          'Kusalira maudzu: Salirani maudzu onse m\'mbali mwa munda komwe tizirombo timabisala.',
          'Kudzala msanga: Dzalani chimanga mvula yoyamba kugwa kuti chimanga chikulirepo tizirombo tisanachuluke.',
          'Mbeu zotsutsana ndi matenda: Nyengo ikubwerayi, gulani mbeu yovomerezeka yolimbana ndi matenda a mizere ku sitolo.',
        ],
        chemicalAdvisory:
          'Chenjezo: Matenda a mizere ndi kachilombo (Virus) motero PALIBE mankhwala opopera omwe angachize tsamba lodwala kale. Musagwiritse ntchito ndalama pogula mankhwala a poizoni. Funsani Mlangizi wanu wa za Ulimi za njira zovomerezeka za kudzala. Sitipereka miyezo ya mankhwala.',
        safetyWarning:
          'CHENJEZO LA CHITETEZO: Posamalira munda, sambani manja ndi zida za ulimi bwinobwino. Osawotcha kapena kutaya mbeu zodwala pafupi ndi zitsime za madzi.',
        language: 'ny',
        translationNeedsHumanReview: true,
        timestamp: new Date().toISOString(),
        imageUrl: maizeStreakImage,
      },
      tum: {
        id: 'diag-msv-tum',
        cropName: 'Ngoma',
        category: 'disease',
        primaryDiagnosis: 'Maize Streak Virus (MSV)',
        localDiagnosisName: 'Nthenda ya Mizere mu Ngoma',
        confidenceScore: 88,
        confidenceLevel: 'high',
        visualObservations: [
          'Mizere yafyoloka yoyera na yachitukutu yakudunjika pa mitsempha ya jani la ngoma',
          'Vigawa vyakubiriwira vyachali pawukati pa mizere iyi',
          'Mizere iyi yikwambira pasi pa jani kufika pachanya',
        ],
        differentialDiagnoses: [
          {
            name: 'Maize Dwarf Mosaic',
            localName: 'Matenda gha Mawanga',
            probability: 28,
            distinguishingFeature: 'Ghakupanga mawanga ghachokoghachoko m\'malo mwa mizere yakudunjika.',
          },
          {
            name: 'Kusoŵa Feteleza',
            localName: 'Njala ya chomela',
            probability: 19,
            distinguishingFeature: 'Kusowa kwa chakurya mu dongo kukuŵazga jani lose kukhala lachitukutu.',
          },
        ],
        severity: 'high',
        requiresEscalation: false,
        culturalSteps: [
          'Kukuzula vyomela vyolwala: Zulani ngoma zakulwala mwaluŵiro na kuzisunga pasi pa dongo kuti tumphembedzu tuleke kutolera matenda ku ngoma zinyake.',
          'Kuwusyapo vyuti: Fyenyani vyuti mumphete mwa munda uko tumphembedzu tukukhala.',
          'Kupanda mwaluŵiro: Pandani ngoma pa nyengo yakwamba ya vula.',
          'Mbeu zakukhora: Pa nyengo yakulondezgapo, gulani mbeu zakukhwima zakulimbana na nthenda iyi kufuma ku sitolo.',
        ],
        chemicalAdvisory:
          'Chenjezgo: Nthenda iyi njakufuma ku kachilombo (Virus), palije munkhwala wakupopera uwo ungachizga jani ilo laphya kale. Lekani kunanga ndalama pa munkhwala wambura kukhumbikwa. Fumbani kwa Mulara wa vya Ulimi.',
        safetyWarning:
          'CHENJEZGO: Mukuzule ngoma na kuzikwirira pasi pa dongo. Sambani mawoko na sipo mukamara kuseŵera mu munda.',
        language: 'tum',
        translationNeedsHumanReview: true,
        timestamp: new Date().toISOString(),
        imageUrl: maizeStreakImage,
      },
    },
  },
  {
    id: 'case-tobacco-frog-eye',
    crop: 'Tobacco',
    cropChichewa: 'Fodya',
    cropTumbuka: 'Hona',
    title: 'Cercospora Leaf Spot / Frog Eye',
    titleChichewa: 'Mawanga a Masamba a Fodya (Frog Eye)',
    titleTumbuka: 'Mawanga gha Hona (Frog Eye)',
    category: 'disease',
    imageUrl: tobaccoCercosporaImage,
    thumbnailUrl: tobaccoCercosporaImage,
    previewDescription: 'Circular brown lesions with pale grey centers on mature leaves',
    precomputedResult: {
      en: {
        id: 'diag-cerc-en',
        cropName: 'Tobacco',
        category: 'disease',
        primaryDiagnosis: 'Frog-Eye Leaf Spot (Cercospora nicotianae)',
        localDiagnosisName: 'Mawanga a Masamba a Fodya',
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
            localName: 'Mawanga a Brown Spot',
            probability: 39,
            distinguishingFeature: 'Alternaria spots exhibit prominent concentric target-like rings without the bleached white center.',
          },
          {
            name: 'Weather Fleck / Ozone Injury',
            localName: 'Kuvulala ndi nyengo',
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
        translationNeedsHumanReview: false,
        timestamp: new Date().toISOString(),
        imageUrl: tobaccoCercosporaImage,
      },
      ny: {
        id: 'diag-cerc-ny',
        cropName: 'Fodya',
        category: 'disease',
        primaryDiagnosis: 'Frog-Eye Leaf Spot (Cercospora nicotianae)',
        localDiagnosisName: 'Mawanga a Masamba a Fodya (Frog Eye)',
        confidenceScore: 84,
        confidenceLevel: 'high',
        visualObservations: [
          'Mawanga ozungulira okhala ndi pakati pathuwa kapena poyera komanso mkombero wa mtundu wa khofi',
          'Kuwala kwachikasu mozungulira mawanga m\'masamba apansi a fodya',
          'Zizindikiro zofala kwambiri nthawi ya chinyezi kapena mvula ikagwa',
        ],
        differentialDiagnoses: [
          {
            name: 'Brown Spot (Alternaria alternata)',
            localName: 'Mawanga a Brown Spot',
            probability: 39,
            distinguishingFeature: 'Mawanga amenewa amakhala ndi mizere yozungulirana monga cholinga m\'malo mwa pakati poyera.',
          },
          {
            name: 'Kuvulala chifukwa cha mphepo/nyengo',
            localName: 'Mawanga a dzuwa',
            probability: 17,
            distinguishingFeature: 'Mawanga ang\'onoang\'ono opanda mkombero wokhazikika.',
          },
        ],
        severity: 'moderate',
        requiresEscalation: false,
        culturalSteps: [
          'Kusolola masamba apansi (Priming): Sololani masamba akuluakulu apansi mwamsanga kuti mpweya uziyenda bwino komanso kuchepetsa kufala kwa matenda.',
          'Ukhondo wa m\'munda: Pewani kuyenda m\'munda wa fodya kuli chinyezi kapena dzuwa lisanatulukidwe bwino.',
          'Kusinthanitsa mbewu: Musadzalenso fodya pomwepo; dzalanipo chimanga kapena mtedza pa nyengo yotsatira.',
          'Kuchotsa zinyalala: Masamba ovunda achotseni m\'munda ndi kuwakwirira.',
        ],
        chemicalAdvisory:
          'Ngati matenda aonekera nthawi yosolola isanafike, pitani ku sitolo yovomerezeka ya za ulimi (Agro-dealer wa fodya monga ATC kapena Farmers World). Funsani mankhwala ovomerezeka a fodya ndipo tsatirani chikalata cha pa phukusi mwatsatanetsatane. Sitipereka miyezo ya mankhwala.',
        safetyWarning:
          'CHENJEZO LA CHITETEZO: Valani zoteteza thupi lonse (magolovesi, chophimba kumaso ndi nsapato za mphira). Osadya, kumwa, kapena kusuta fodya pogwira mankhwala. Sambani bwino ndi madzi abwino.',
        language: 'ny',
        translationNeedsHumanReview: true,
        timestamp: new Date().toISOString(),
        imageUrl: tobaccoCercosporaImage,
      },
      tum: {
        id: 'diag-cerc-tum',
        cropName: 'Hona',
        category: 'disease',
        primaryDiagnosis: 'Frog-Eye Leaf Spot (Cercospora nicotianae)',
        localDiagnosisName: 'Mawanga gha Hona (Frog Eye)',
        confidenceScore: 84,
        confidenceLevel: 'high',
        visualObservations: [
          'Mawanga ghazingilira ghali na mukati mwake mwayera panji mwa chifuwa na mumphete mwa fufuzi',
          'Kuwala kwachitukutu mumphete mwa mawanga pa majani gha pasi gha hona',
          'Chizindikiro chakuwoneka chomene para kuli chithukivu na vula',
        ],
        differentialDiagnoses: [
          {
            name: 'Brown Spot (Alternaria)',
            localName: 'Mawanga gha Brown Spot',
            probability: 39,
            distinguishingFeature: 'Mawanga gha Brown Spot ghakukhala na vizukuzuku mukati m\'malo mwa chigaŵa chakutuŵa.',
          },
          {
            name: 'Kusakazika na Mpepo',
            localName: 'Kutentheka',
            probability: 17,
            distinguishingFeature: 'Utumawanga tuchokotuchoko twambura malire ghakutowa.',
          },
        ],
        severity: 'moderate',
        requiresEscalation: false,
        culturalSteps: [
          'Kusolola majani gha pasi: Sololani majani ghakukhwima gha pasi mwaluŵiro kuti mpepo yiputenge makora.',
          'Chivikiliro mu munda: Lekani kwenda mu munda wa hona para majani ghachali na mame panji madzi.',
          'Kusinthana vyomela: Pandanipo ngoma panji syaba pa chaka chakulondezgapo.',
          'Kuphyora majani ghakulwala: Majani ghakulwala ghawusyenimo mu munda na kughakwirira.',
        ],
        chemicalAdvisory:
          'Para matenda ghakukhumba kuthereskeka mwaluŵiro, fumbani ku sitolo ya vyakurya yakuzomerezgeka (Agro-dealer). Gulani munkhwala wakuzomerezgeka wa hona ndipo ŵerengani chikalata cha paketi. Tindapereke mapimo gha munkhwala.',
        safetyWarning:
          'CHENJEZGO: Vwalani vyakujivikilira vyakukwana. Lekani kurya panji kumwa maji para mukugwira munkhwala. Gezani na sopo para mwamala.',
        language: 'tum',
        translationNeedsHumanReview: true,
        timestamp: new Date().toISOString(),
        imageUrl: tobaccoCercosporaImage,
      },
    },
  },
  {
    id: 'case-unclear-escalation',
    crop: 'Maize / Other',
    cropChichewa: 'Chimanga / Zina',
    cropTumbuka: 'Ngoma / Vinyake',
    title: 'Low Clarity Sample (Forces Escalation)',
    titleChichewa: 'Chithunzi Chosamveka (Kutumiza kwa Mlangizi)',
    titleTumbuka: 'Chithuzi Chosawoneka Makora (Ku Mulara)',
    category: 'unclear',
    imageUrl: blurryUnclearSvg,
    thumbnailUrl: blurryUnclearSvg,
    previewDescription: 'Blurry low-contrast foliage (triggers mandatory AEDO review)',
    precomputedResult: {
      en: {
        id: 'diag-unclear-en',
        cropName: 'Maize / Unidentified Field Crop',
        category: 'unclear',
        primaryDiagnosis: 'Unclear Symptoms (Foliage discoloration)',
        localDiagnosisName: 'Kufooka kwa Mbeu (Chithunzi Chosamveka)',
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
            localName: 'Chilala kapena Nkhungu',
            probability: 30,
            distinguishingFeature: 'Uniform leaf wilting without localized bacterial lesions.',
          },
          {
            name: 'Bacterial Stalk or Leaf Rot',
            localName: 'Chiboliboli cha tsinde',
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
        translationNeedsHumanReview: false,
        timestamp: new Date().toISOString(),
        imageUrl: blurryUnclearSvg,
      },
      ny: {
        id: 'diag-unclear-ny',
        cropName: 'Chimanga / Mbeu Yosadziwika',
        category: 'unclear',
        primaryDiagnosis: 'Zizindikiro Zosatsimikizika (Chithunzi Chosamveka)',
        localDiagnosisName: 'Zizindikiro Zosadziwika Bwino',
        confidenceScore: 42,
        confidenceLevel: 'low',
        visualObservations: [
          'Chithunzi chikugwedezeka ndipo dzuwa lawalitsa kwambiri masamba moti sizikuoneka bwino',
          'Mawanga akuoneka mwachisawawa koma sitingatsimikize ngati ndi matenda a bakiteriya kapena tizilombo',
          'Sikungatsimikizidwe bwinobwino popanda chithunzi chowoneka bwino cha tsamba',
        ],
        differentialDiagnoses: [
          {
            name: 'Kufooka chifukwa cha chilala',
            localName: 'Kufota chifukwa cha dzuwa',
            probability: 30,
            distinguishingFeature: 'Masamba amangofota onse pamodzi popanda mabowo a tizilombo.',
          },
          {
            name: 'Chiboliboli cha tsinde (Bacterial Rot)',
            localName: 'Kuola kwa tsinde',
            probability: 25,
            distinguishingFeature: 'Tsinde limafewa ndi kukhala ndi fungo loipa pafupi ndi nthaka.',
          },
        ],
        severity: 'high',
        requiresEscalation: true,
        escalationReason: 'Chitsimikizo n\'chochepa kwambiri (42%) ndipo chithunzi sichikuoneka bwino. Malangizo a za ulimi akuti mutumize chithunzichi kwa Mlangizi wa za Ulimi musanapopeze mankhwala alionse.',
        culturalSteps: [
          'Jambulani chithunzi china: Yandikirani tsamba labwino, onetsetsani kuti foni siikugwedezeka.',
          'Yang\'anitsitsani m\'tsinde: Onani ngati tsinde lili lozizira kapena loonongeka ndi nyongolotsi.',
          'Musapopeze mankhwala: Musanatsimikize vuto, kupopera mankhwala kumatha kuwononga ndalama kapena kupha mbeu zanu.',
          'Lankhulani ndi Mlangizi wa za Ulimi: Dinani batani lomwe lili pansipa kuti mutumize mlandu wanu kwa AEDO wa ku EPA.',
        ],
        chemicalAdvisory:
          'MUSAPOPEZE MANKHWALA. Popeza sitikudziwa bwino vuto ili (chitsimikizo ndi 42%), mankhwala angakuwonongereni ndalama kapena kuononga mbeu. Dikirani upangiri wa Mlangizi kapena pitani ku sitolo yovomerezeka ndi tsamba lachiwerewere lonyamula m\'manja.',
        safetyWarning:
          'CHENJEZO: Musagwiritse ntchito mankhwala alionse popanda kudziwa matenda enieni. Zitha kukhala poizoni kwa anthu ndi nthaka.',
        language: 'ny',
        translationNeedsHumanReview: true,
        timestamp: new Date().toISOString(),
        imageUrl: blurryUnclearSvg,
      },
      tum: {
        id: 'diag-unclear-tum',
        cropName: 'Ngoma / Vyomela Vinyake',
        category: 'unclear',
        primaryDiagnosis: 'Vimanyikwiro Vyakuleka Kumanyikwa Makora',
        localDiagnosisName: 'Chithuzi Chosawoneka Bwino',
        confidenceScore: 42,
        confidenceLevel: 'low',
        visualObservations: [
          'Chithuzi chasunkhunyika ndipo ungweru wa dzuŵa ngwakujumpha',
          'Majani ghakuwoneka ghakuvunda pachoko kweni palije ukaboni wakufikapo wa matenda enecho',
          'Pangasoŵa chithuzi chakufikapo chakulongora jani lakusuzgika',
        ],
        differentialDiagnoses: [
          {
            name: 'Chilala na Dzuŵa',
            localName: 'Kufota na dzuŵa',
            probability: 30,
            distinguishingFeature: 'Majani ghakufota waka na dzuŵa kwambura mabowo.',
          },
          {
            name: 'Kuvunda kwa Chitindi',
            localName: 'Chiboliboli',
            probability: 25,
            distinguishingFeature: 'Chitindi chikuŵa chakufewa na fungo liheni pafupi na dongo.',
          },
        ],
        severity: 'high',
        requiresEscalation: true,
        escalationReason: 'Chitsimikizgo chili pasi chomene (42%) ndipo chithuzi ntchosawoneka. Tikukhumba kuti mufumbe ku Mulara wa vya Ulimi mwaluŵiro pambere mundapope munkhwala.',
        culturalSteps: [
          'Torani chithuzi chinyake: Sendelerani ku jani, woneseskani kuti foni yikuleka kusunkhunyika.',
          'Penjerezgani pa chitindi: Wonani usange chitindi chikuvunda panji pali vilombo.',
          'Lekani kupopera munkhwala: Mungapopera munkhwala wambura kumanyikwa mungasakaza ndalama zinu panji kupyosya vyomela.',
          'Phalanani na Mulara wa vya Ulimi: Finyani batani la pasi apa kuti mutumizge nkhani iyi kwa AEDO.',
        ],
        chemicalAdvisory:
          'LEKANI KUPOPERA MANKHWALA. Pakuti chitsimikizgo chili pasi pa 70%, munkhwala ungatondeka kugwira ntchito na kunanga ndalama. Lindizgani ulongozgi wa Mulara wa vya Ulimi.',
        safetyWarning:
          'CHENJEZGO: Lekani kugwiliskira ntchito munkhwala pa suzu yambura kumanyikwa.',
        language: 'tum',
        translationNeedsHumanReview: true,
        timestamp: new Date().toISOString(),
        imageUrl: blurryUnclearSvg,
      },
    },
  },
];
