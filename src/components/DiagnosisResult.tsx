import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Volume2,
  VolumeX,
  Send,
  Eye,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Building2,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DiagnosisResult as DiagnosisType, Language } from '../types/crop';
import { TRANSLATIONS } from '../data/translations';

interface DiagnosisResultProps {
  diagnosis: DiagnosisType;
  currentLanguage: Language;
  onSendToOfficer: () => void;
  onReset: () => void;
}

export const DiagnosisResult: React.FC<DiagnosisResultProps> = ({
  diagnosis,
  currentLanguage,
  onSendToOfficer,
  onReset,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showDifferentials, setShowDifferentials] = useState(false);

  // Text-to-speech for accessible listening in rural areas
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech audio is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    // Compile readable script
    const textToRead = [
      diagnosis.localDiagnosisName || diagnosis.primaryDiagnosis,
      `. Confidence is ${diagnosis.confidenceScore} percent.`,
      '. Visual observations:',
      ...diagnosis.visualObservations,
      '. Practical steps:',
      ...diagnosis.culturalSteps,
      '. Chemical safety:',
      diagnosis.chemicalAdvisory,
      '. Safety warning:',
      diagnosis.safetyWarning,
    ].join(' ');

    const utterance = new SpeechSynthesisUtterance(textToRead);
    // Select voice if available
    if (currentLanguage === 'en') {
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
    } else {
      // African/Swahili or default fallback voice
      utterance.lang = 'en-GB';
      utterance.rate = 0.9;
    }

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  // Determine color styling based on confidence
  const getConfidenceBadge = () => {
    if (diagnosis.confidenceScore >= 80) {
      return {
        bg: 'bg-emerald-50 border-emerald-300 text-emerald-800',
        dot: 'bg-emerald-600',
        icon: CheckCircle,
        label: t.confidenceHigh,
        tier: 'high',
      };
    } else if (diagnosis.confidenceScore >= 65) {
      return {
        bg: 'bg-amber-50 border-amber-300 text-amber-800',
        dot: 'bg-amber-600',
        icon: AlertTriangle,
        label: t.confidenceMedium,
        tier: 'medium',
      };
    } else {
      return {
        bg: 'bg-rose-50 border-rose-300 text-rose-800',
        dot: 'bg-rose-600',
        icon: ShieldAlert,
        label: t.confidenceLow,
        tier: 'low',
      };
    }
  };

  const conf = getConfidenceBadge();
  const ConfIcon = conf.icon;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top action header */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-emerald-800 py-1.5 px-3 rounded-lg hover:bg-white border border-stone-200 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t.resetPhotoBtn}</span>
        </button>

        {/* Audio read-aloud button */}
        <button
          onClick={toggleSpeech}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg transition-all border cursor-pointer ${
            isPlayingAudio
              ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
              : 'bg-emerald-100/80 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
          }`}
        >
          {isPlayingAudio ? (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>{t.stopAudioBtn}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.listenAdviceBtn}</span>
            </>
          )}
        </button>
      </div>

      {/* Forced Escalation Alert Banner if low confidence or high risk */}
      {diagnosis.requiresEscalation && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-2 flex-1">
              <div>
                <h4 className="text-sm font-bold text-rose-950">
                  {currentLanguage === 'ny'
                    ? 'Kutumiza kwa Katswiri wa za Ulimi (Chitsimikizo N\'chochepa)'
                    : currentLanguage === 'tum'
                    ? 'Kufumba kwa Mulara wa vya Ulimi (Chitsimikizgo Chili Pasi)'
                    : 'Human Extension Officer Review Required'}
                </h4>
                <p className="text-xs text-rose-900 mt-1 leading-relaxed">
                  {diagnosis.escalationReason || t.escalationRequiredBanner}
                </p>
              </div>

              <button
                onClick={onSendToOfficer}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-700 hover:bg-rose-800 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{t.sendToOfficerBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Diagnosis Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Photo + Primary Diagnosis Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border-b border-stone-200">
          {/* Photo thumbnail */}
          <div className="md:col-span-5 bg-stone-900 relative aspect-4/3 md:aspect-auto min-h-[220px]">
            <img
              src={diagnosis.imageUrl}
              alt={diagnosis.primaryDiagnosis}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-xs">
                {diagnosis.cropName}
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-lg">
              <span>Photo Analyzed</span>
              <span className="text-emerald-300 font-medium">Visual inspection</span>
            </div>
          </div>

          {/* Primary Diagnosis Info */}
          <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between">
            <div>
              {/* Confidence Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${conf.bg}`}
                >
                  <span className={`w-2 h-2 rounded-full ${conf.dot} animate-pulse`}></span>
                  <ConfIcon className="w-3.5 h-3.5" />
                  <span>
                    {conf.label}: {diagnosis.confidenceScore}%
                  </span>
                </div>

                <span className="text-[11px] text-stone-600 font-medium capitalize">
                  Category: <strong className="text-stone-800">{diagnosis.category}</strong>
                </span>
              </div>

              {/* Problem Names (Local Language + English) */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  {t.primaryDiagnosis}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                  {diagnosis.localDiagnosisName}
                </h3>
                {diagnosis.localDiagnosisName !== diagnosis.primaryDiagnosis && (
                  <p className="text-xs font-semibold text-emerald-800">
                    Scientific / English: {diagnosis.primaryDiagnosis}
                  </p>
                )}
              </div>
            </div>

            {/* Translation human review badge if Chichewa or Tumbuka */}
            {diagnosis.translationNeedsHumanReview && (
              <div className="mt-4 p-2.5 bg-amber-50/80 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <div className="leading-tight">
                  <span className="font-bold">{t.translationReviewBadge}:</span>{' '}
                  <span>{t.translationReviewNotice}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 1: "What the AI Sees in This Photo" (Strict physical description) */}
        <div className="p-5 sm:p-6 border-b border-stone-100 bg-stone-50/60">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider mb-2.5">
            <Eye className="w-4 h-4 text-emerald-700" />
            <span>{t.whatAiSees}</span>
          </div>
          <ul className="space-y-1.5">
            {diagnosis.visualObservations.map((obs, idx) => (
              <li
                key={idx}
                className="text-xs sm:text-sm text-stone-700 flex items-start gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 2: Differentials (Up to 2 other possibilities) */}
        {diagnosis.differentialDiagnoses && diagnosis.differentialDiagnoses.length > 0 && (
          <div className="p-5 sm:p-6 border-b border-stone-100">
            <button
              type="button"
              onClick={() => setShowDifferentials(!showDifferentials)}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-stone-800 uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-stone-600" />
                <span>
                  {t.differentialsTitle} ({diagnosis.differentialDiagnoses.length})
                </span>
              </div>
              <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <span>{showDifferentials ? 'Hide' : 'Show details'}</span>
                {showDifferentials ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </div>
            </button>

            {showDifferentials && (
              <div className="mt-3.5 space-y-3 pt-3 border-t border-stone-200/80">
                {diagnosis.differentialDiagnoses.map((diff, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200/70"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-stone-900">
                        {diff.localName ? `${diff.localName} (${diff.name})` : diff.name}
                      </span>
                      <span className="text-[11px] font-bold text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200">
                        {diff.probability}% likelihood
                      </span>
                    </div>
                    {/* Probability bar */}
                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mb-2">
                      <div
                        className="bg-stone-500 h-full rounded-full"
                        style={{ width: `${diff.probability}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      <strong className="text-stone-800">Distinguishing feature:</strong>{' '}
                      {diff.distinguishingFeature}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section 3: Recommended Steps (Low-risk cultural practices FIRST) */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Step 1: Low-Risk Practices */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-sm font-extrabold text-emerald-950 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>{t.culturalStepsTitle}</span>
                </h4>
                <p className="text-xs text-stone-500 mt-0.5 ml-8">
                  {t.culturalStepsSubtitle}
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                Safe & Low-Cost
              </span>
            </div>

            <div className="space-y-2 ml-1 sm:ml-8">
              {diagnosis.culturalSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs sm:text-sm text-stone-800 flex items-start gap-2.5"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Chemical Products (Directs to licensed agro-dealers, zero doses) */}
          <div className="space-y-3 pt-3 border-t border-stone-100">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-stone-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>{t.chemicalTitle}</span>
                </h4>
                <p className="text-xs text-stone-500 mt-0.5 ml-8">
                  {t.chemicalSubtitle}
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 shrink-0">
                Later Option
              </span>
            </div>

            <div className="ml-1 sm:ml-8 p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 space-y-2">
              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{diagnosis.chemicalAdvisory}</p>
              </div>

              {/* Zero-dose safety badge */}
              <div className="mt-2 pt-2 border-t border-stone-200/80 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800">
                <Lock className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t.dosageScrubbedBadge}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Safety Warning Note */}
          <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-amber-500 text-white shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4 stroke-[2.4]" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                  {t.safetyTitle}
                </h5>
                <p className="text-xs text-amber-900 leading-relaxed font-medium">
                  {diagnosis.safetyWarning}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Action: Send to Extension Officer */}
          <div className="pt-2">
            <button
              onClick={onSendToOfficer}
              className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{t.sendToOfficerBtn}</span>
            </button>
            <p className="text-[11px] text-stone-500 text-center mt-2">
              Sends photo, visual findings, and your location to an Agricultural Extension Development Officer (AEDO) for human validation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
