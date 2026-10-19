import { Language } from '../types/crop';

export interface TranslationDictionary {
  appTitle: string;
  appSubtitle: string;
  tagline: string;
  forFarmersInMalawi: string;
  cameraBtn: string;
  galleryBtn: string;
  demoCasesTitle: string;
  demoCasesSubtitle: string;
  demoActiveBadge: string;
  apiKeyActiveBadge: string;
  languageSelect: string;
  photoTipsTitle: string;
  photoTip1: string;
  photoTip2: string;
  photoTip3: string;
  analyzingTitle: string;
  analyzingStep1: string;
  analyzingStep2: string;
  analyzingStep3: string;
  confidenceHigh: string;
  confidenceMedium: string;
  confidenceLow: string;
  whatAiSees: string;
  primaryDiagnosis: string;
  differentialsTitle: string;
  culturalStepsTitle: string;
  culturalStepsSubtitle: string;
  chemicalTitle: string;
  chemicalSubtitle: string;
  safetyTitle: string;
  sendToOfficerBtn: string;
  escalationRequiredBanner: string;
  escalationRecommendedBanner: string;
  listenAdviceBtn: string;
  listeningBtn: string;
  stopAudioBtn: string;
  extensionPortalTab: string;
  diagnoseTab: string;
  howItWorksTab: string;
  resetPhotoBtn: string;
  officerModalTitle: string;
  officerModalDesc: string;
  farmerNameLabel: string;
  farmerPhoneLabel: string;
  districtLabel: string;
  epaLabel: string;
  notesLabel: string;
  sendCaseBtn: string;
  cancelBtn: string;
  escalationSuccess: string;
  dosageScrubbedBadge: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    appTitle: 'Crop Doctor Malawi',
    appSubtitle: 'Instant pest & disease diagnosis for smallholder farmers',
    tagline: 'Protect your maize, tobacco and field harvest',
    forFarmersInMalawi: 'Designed for Malawian Agriculture (EPA & Field Extension)',
    cameraBtn: 'Take Photo of Sick Crop',
    galleryBtn: 'Upload from Phone',
    demoCasesTitle: 'Or Try Sample Field Photos',
    demoCasesSubtitle: 'Tap an authentic Malawi field sample to see how diagnosis works',
    demoActiveBadge: 'Demo Mode (No API key needed)',
    apiKeyActiveBadge: 'Gemini 3.8 Flash Vision Connected',
    languageSelect: 'Language / Chilankhulo / Chiyowoyero',
    photoTipsTitle: 'Tips for best results:',
    photoTip1: 'Get close to the affected leaf, stem, or cob',
    photoTip2: 'Make sure daylight is clear and avoid blurry blur',
    photoTip3: 'Show both the damaged spot and the green area',
    analyzingTitle: 'Examining your crop photo...',
    analyzingStep1: 'Scanning leaf patterns & pest markings...',
    analyzingStep2: 'Translating diagnosis into everyday language...',
    analyzingStep3: 'Applying safety checks & dosage filters...',
    confidenceHigh: 'High Confidence',
    confidenceMedium: 'Medium Confidence',
    confidenceLow: 'Low Confidence (Review Advised)',
    whatAiSees: 'What the AI Sees in This Photo',
    primaryDiagnosis: 'Most Likely Problem',
    differentialsTitle: 'Other Possibilities Considered',
    culturalStepsTitle: 'Step 1: Low-Risk Practices (Start Here)',
    culturalStepsSubtitle: 'Safe, affordable cultural methods that protect your field without high expense',
    chemicalTitle: 'Step 2: Chemical Products (If Severe)',
    chemicalSubtitle: 'Consult licensed agro-dealers only. We do not provide chemical dosages.',
    safetyTitle: 'Health & Safety Warning',
    sendToOfficerBtn: 'Send to Extension Officer (AEDO)',
    escalationRequiredBanner: 'Action Needed: AI confidence is low or risk is severe. Please consult an extension officer before spraying.',
    escalationRecommendedBanner: 'We recommend verifying this case with your local Agricultural Extension Development Officer (AEDO).',
    listenAdviceBtn: 'Listen to Advice (Audio)',
    listeningBtn: 'Reading aloud...',
    stopAudioBtn: 'Stop Audio',
    extensionPortalTab: 'Extension Officer Queue',
    diagnoseTab: 'Diagnose Crop',
    howItWorksTab: 'How AI Works',
    resetPhotoBtn: 'Examine Another Crop',
    officerModalTitle: 'Connect with an Agricultural Extension Officer',
    officerModalDesc: 'Send this photo, symptoms, and your farm details to your local EPA / AEDO officer for direct human guidance.',
    farmerNameLabel: 'Your Name',
    farmerPhoneLabel: 'Phone / WhatsApp Number',
    districtLabel: 'District in Malawi',
    epaLabel: 'EPA / Extension Area (Optional)',
    notesLabel: 'Additional notes or field observations',
    sendCaseBtn: 'Submit to Extension Officer',
    cancelBtn: 'Close',
    escalationSuccess: 'Case submitted successfully! An extension officer will review your photo.',
    dosageScrubbedBadge: 'Safety Check Active: Any unverified chemical dosages were stripped for farmer safety.',
  },
};

export const MALAWI_DISTRICTS = [
  'Balaka',
  'Blantyre',
  'Chikwawa',
  'Chiradzulu',
  'Chitipa',
  'Dedza',
  'Dowa',
  'Karonga',
  'Kasungu',
  'Likoma',
  'Lilongwe',
  'Machinga',
  'Mangochi',
  'Mchinji',
  'Mulanje',
  'Mwanza',
  'Mzimba',
  'Neno',
  'Nkhata Bay',
  'Nkhotakota',
  'Nsanje',
  'Ntcheu',
  'Ntchisi',
  'Phalombe',
  'Rumphi',
  'Salima',
  'Thyolo',
  'Zomba',
];
