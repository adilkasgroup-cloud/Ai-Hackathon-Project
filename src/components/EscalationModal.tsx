import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Send,
  MessageSquare,
  CheckCircle,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  FileText,
  Lock,
  AlertCircle,
  Sprout,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { DiagnosisResult, EscalationTicket, Language } from '../types/crop';
import { TRANSLATIONS, MALAWI_DISTRICTS } from '../data/translations';

interface EscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosis: DiagnosisResult;
  currentLanguage: Language;
  onSubmitted: (ticket: EscalationTicket) => void;
}

export const EscalationModal: React.FC<EscalationModalProps> = ({
  isOpen,
  onClose,
  diagnosis,
  currentLanguage,
  onSubmitted,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const { farmerProfile, registerFarmer, loginFarmerWithPassword } = useAuth();

  // Login / Registration form states (used if not yet logged in)
  const [escalationAuthMode, setEscalationAuthMode] = useState<'login' | 'signup'>('login');
  const [loginName, setLoginName] = useState('');
  const [loginPhone, setLoginPhone] = useState('+265 888 234 567');
  const [loginPassword, setLoginPassword] = useState('farmer2026');
  const [loginDistrict, setLoginDistrict] = useState('Lilongwe');
  const [loginEpa, setLoginEpa] = useState('');
  const [loginConsent, setLoginConsent] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Send form states (used once logged in, information is taken from profile)
  const [fieldDescription, setFieldDescription] = useState('');
  const [village, setVillage] = useState('');
  const [consentChecked, setConsentChecked] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<EscalationTicket | null>(null);

  // Sync state if farmer profile changes or modal opens
  useEffect(() => {
    if (farmerProfile) {
      setLoginName(farmerProfile.name);
      setLoginPhone(farmerProfile.phone);
      setLoginDistrict(farmerProfile.district);
      setLoginEpa(farmerProfile.epa || '');
    }
    if (!isOpen) {
      setSubmittedTicket(null);
      setFieldDescription('');
    }
  }, [farmerProfile, isOpen]);

  if (!isOpen) return null;

  // Handle Farmer Login/Registration within the modal with password
  const handleFarmerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginPhone.trim()) {
      setLoginError('Please enter your phone number.');
      return;
    }

    if (!loginPassword.trim()) {
      setLoginError('Please enter your password.');
      return;
    }

    setIsLoggingIn(true);
    try {
      if (escalationAuthMode === 'login') {
        await loginFarmerWithPassword(loginPhone, loginPassword);
      } else {
        if (!loginName.trim()) {
          setLoginError('Please enter your full name.');
          setIsLoggingIn(false);
          return;
        }
        if (!loginConsent) {
          setLoginError('Please agree to the privacy consent to share your crop photo with extension officers.');
          setIsLoggingIn(false);
          return;
        }
        await registerFarmer(loginName, loginPhone, loginDistrict, loginEpa, loginPassword, loginConsent);
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Authentication failed. Please verify your credentials or sign up.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Final Submission of Escalation to Officer
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerProfile) return;

    if (!consentChecked) {
      alert('Please agree to the diagnostic data consent to send your photo to an extension officer.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagnosis,
          farmerName: farmerProfile.name,
          farmerPhone: farmerProfile.phone,
          district: farmerProfile.district,
          epa: farmerProfile.epa || 'Local EPA',
          village,
          additionalNotes: fieldDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit escalation');
      }

      const ticket: EscalationTicket = await response.json();
      setSubmittedTicket(ticket);
      onSubmitted(ticket);
    } catch (err) {
      console.error(err);
      const fallbackTicket: EscalationTicket = {
        id: 'esc-local-' + Date.now(),
        diagnosis,
        farmerName: farmerProfile.name,
        farmerPhone: farmerProfile.phone,
        district: farmerProfile.district,
        epa: farmerProfile.epa || 'Local EPA',
        village,
        additionalNotes: fieldDescription,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      setSubmittedTicket(fallbackTicket);
      onSubmitted(fallbackTicket);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppUrl = () => {
    if (!farmerProfile) return '#';
    const text = [
      `*Crop Doctor Malawi - Extension Request*`,
      `*Mlimi / Farmer:* ${farmerProfile.name}`,
      `*Phone:* ${farmerProfile.phone}`,
      `*District / Boma:* ${farmerProfile.district} (EPA: ${farmerProfile.epa || 'N/A'}, Village: ${village || 'N/A'})`,
      `*Crop:* ${diagnosis.cropName}`,
      `*AI Suspected Issue:* ${diagnosis.localDiagnosisName} (${diagnosis.primaryDiagnosis})`,
      `*Confidence:* ${diagnosis.confidenceScore}%`,
      `*Reason for review:* ${diagnosis.escalationReason || 'Low confidence or harvest risk'}`,
      `*Farmer Description:* ${fieldDescription || 'Please inspect attached photo'}`,
    ].join('\n');

    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const consentText = {
    en: 'Consent: Your phone number and crop photos will be shared solely with local agricultural extension officers to diagnose your field and text you guidance. They will never be shared with third parties or used for advertising.',
    ny: 'Chilolezo: Nambala yanu ya foni ndi zithunzi za mbeu zanu zidzagawidwa kwa alangizi a za ulimi (AEDO) okha kuti akuthandizeni pa vuto lanu la m\'munda. Sizidzagulitsidwa kapena kuperekedwa kwina.',
    tum: 'Chizomerezgo: Nambala yinu ya foni na vithuzi vya vyomela vigawikenge ku ŵalara ŵa vya ulimi (AEDO) pera kuti ŵamovwirani. Vingaperekeka ku ŵanthu ŵanyake yayi.',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 leading-tight">
                Send to Extension Officer
              </h3>
              <p className="text-xs text-stone-500">Ministry of Agriculture EPA Extension</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 flex-1">
          {/* STEP 1: If not logged in, ask the user to log in / sign up first */}
          {!farmerProfile ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                    Farmer Sign In Required
                  </h4>
                  <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                    To send this case to an Extension Officer and receive their advice, please enter your details below. 
                    <strong> No password needed</strong> — your profile will be saved so you won't have to enter it again!
                  </p>
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleFarmerLogin} className="space-y-3.5">
                {/* Farmer Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Your Full Name (Dzina Lanu):</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    placeholder="e.g. Kondwani Phiri"
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Phone / WhatsApp (+265):</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="+265 888 123 456"
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none font-mono"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    Extension officers will text or WhatsApp advice to this number.
                  </p>
                </div>

                {/* District & EPA */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      District (Boma):
                    </label>
                    <select
                      value={loginDistrict}
                      onChange={(e) => setLoginDistrict(e.target.value)}
                      className="w-full text-xs px-2.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {MALAWI_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      EPA (Optional):
                    </label>
                    <input
                      type="text"
                      value={loginEpa}
                      onChange={(e) => setLoginEpa(e.target.value)}
                      placeholder="e.g. Chulu EPA"
                      className="w-full text-xs px-2.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Consent checkbox */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={loginConsent}
                      onChange={(e) => setLoginConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-stone-400 focus:ring-emerald-500"
                    />
                    <div className="text-[11px] text-stone-700 leading-relaxed font-medium">
                      <span className="font-bold text-stone-900 block mb-0.5">Privacy Consent:</span>
                      {currentLanguage === 'ny'
                        ? consentText.ny
                        : currentLanguage === 'tum'
                        ? consentText.tum
                        : consentText.en}
                    </div>
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span>{isLoggingIn ? 'Logging in...' : 'Sign In & Continue'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          ) : submittedTicket ? (
            /* Success confirmation */
            <div className="text-center py-6 space-y-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-emerald-950">
                  {t.escalationSuccess}
                </h4>
                <p className="text-xs text-stone-600 mt-1 max-w-xs mx-auto">
                  Case reference #{submittedTicket.id.slice(-6).toUpperCase()} sent for district{' '}
                  <strong>{submittedTicket.district}</strong>. An Extension Officer will review your symptoms.
                </p>
              </div>

              {/* Direct WhatsApp Share Option */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left space-y-2 mt-4">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <span>Also Dispatch Directly to Your AEDO on WhatsApp:</span>
                </span>
                <p className="text-xs text-emerald-900">
                  You can send this exact diagnostic summary straight to your local AEDO or farmer group WhatsApp:
                </p>
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send via WhatsApp (+265)</span>
                </a>
              </div>

              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
              >
                {t.cancelBtn}
              </button>
            </div>
          ) : (
            /* Submission Form: Information taken directly from profile, farmer does NOT re-enter information, but can add description */
            <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-200">
              {/* Profile Card: Read-only info taken from profile */}
              <div className="p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-2xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Information Taken From Your Profile</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium">No re-entry required</span>
                </div>

                <div className="font-bold text-stone-900 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{farmerProfile.name}</span>
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{farmerProfile.phone}</span>
                  </span>
                </div>

                <div className="text-[11px] text-stone-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-700" />
                  <span>
                    {farmerProfile.district} District {farmerProfile.epa ? `(${farmerProfile.epa})` : ''}
                  </span>
                </div>
              </div>

              {/* Crop & Diagnosis summary */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 flex items-center gap-3">
                <img
                  src={diagnosis.imageUrl}
                  alt={diagnosis.primaryDiagnosis}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-300"
                />
                <div className="text-xs min-w-0">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">
                    {diagnosis.cropName} Case
                  </span>
                  <h4 className="font-bold text-stone-900 truncate">
                    {diagnosis.localDiagnosisName}
                  </h4>
                  <p className="text-stone-500 text-[11px]">
                    Confidence: {diagnosis.confidenceScore}% • Severity: {diagnosis.severity}
                  </p>
                </div>
              </div>

              {/* Field Description: Farmer adds description when sending */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Add Description & Field Observations:</span>
                </label>
                <textarea
                  rows={3}
                  value={fieldDescription}
                  onChange={(e) => setFieldDescription(e.target.value)}
                  placeholder={
                    currentLanguage === 'ny'
                      ? 'Fotokozani mwachidule vuto la m\'munda: mwachitsanzo nthawi imene mbeu zayamba kudwala, kapena kukula kwa munda umene wawonongeka...'
                      : currentLanguage === 'tum'
                      ? 'Lembani umo vyomela vikuwonekera mu munda, na nyengo iyo vyayambira...'
                      : 'Add a description for the extension officer: e.g. when symptoms started, affected field area, weather conditions, or specific questions...'
                  }
                  className="w-full text-xs p-3.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Village / Section (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Village / Section (Optional):
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Mtenje Village, TA Mwase"
                  className="w-full text-xs px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Privacy Consent Line */}
              <div className="p-3 bg-amber-50/90 border border-amber-300 rounded-2xl space-y-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-amber-400 focus:ring-emerald-500"
                  />
                  <div className="text-[11px] text-amber-950 leading-relaxed font-medium">
                    <span className="font-bold block text-amber-900 mb-0.5">Privacy & Diagnostic Consent:</span>
                    {currentLanguage === 'ny'
                      ? consentText.ny
                      : currentLanguage === 'tum'
                      ? consentText.tum
                      : consentText.en}
                  </div>
                </label>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending to Officer...' : 'Send Case to Extension Officer'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
