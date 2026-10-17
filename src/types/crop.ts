export type Language = 'en' | 'ny' | 'tum';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type CropCategory = 'disease' | 'pest' | 'deficiency' | 'stress' | 'healthy' | 'unclear';

export interface DifferentialDiagnosis {
  name: string;
  localName?: string;
  probability: number; // 0 - 100
  distinguishingFeature: string;
}

export interface DiagnosisResult {
  id: string;
  cropName: string;
  category: CropCategory;
  primaryDiagnosis: string;
  localDiagnosisName: string;
  confidenceScore: number; // 0 - 100
  confidenceLevel: ConfidenceLevel;
  visualObservations: string[]; // Strict physical description of what is visible in the photo
  differentialDiagnoses: DifferentialDiagnosis[]; // Up to 2 alternatives
  severity: 'low' | 'moderate' | 'high' | 'critical';
  requiresEscalation: boolean;
  escalationReason?: string;
  culturalSteps: string[]; // Low-risk practices FIRST: scouting, hand-picking, rogueing, rotation, bio-controls
  chemicalAdvisory: string; // Zero doses! Always directs to registered agro-dealer
  safetyWarning: string;
  language: Language;
  translationNeedsHumanReview: boolean; // Flagged for Chichewa/Tumbuka verification
  timestamp: string;
  imageUrl: string;
  rawDosagesRemovedCount?: number;
}

export interface EscalationTicket {
  id: string;
  userId?: string; // Firebase UID of the farmer who submitted it (absent on seeded demo tickets)
  diagnosis: DiagnosisResult;
  farmerName: string;
  farmerPhone: string;
  district: string;
  epa?: string; // Extension Planning Area in Malawi
  village?: string;
  additionalNotes?: string;
  status: 'pending' | 'in_review' | 'resolved';
  officerFeedback?: string;
  officerName?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface SamplePhotoCase {
  id: string;
  crop: string;
  cropChichewa: string;
  cropTumbuka: string;
  title: string;
  titleChichewa: string;
  titleTumbuka: string;
  category: CropCategory;
  imageUrl: string;
  thumbnailUrl: string;
  previewDescription: string;
  precomputedResult: Record<Language, DiagnosisResult>;
}
