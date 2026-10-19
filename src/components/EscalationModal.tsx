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
import { TRANSLATIONS } from '../data/translations';
import { CONSENT_TEXT } from '../data/consent';

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
  const { farmerProfile, userRole, firebaseUser, openAuth, getAuthHeaders } = useAuth();

  // Send form states (name, phone and district come from the signed-in profile)
  const [fieldDescription, setFieldDescription] = useState('');
  const [village, setVillage] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<EscalationTicket | null>(null);

  // Reset when the modal closes
  useEffect(() => {
    if (!isOpen) {
      setSubmittedTicket(null);
      setFieldDescription('');
      setSubmitError('');
      setConsentChecked(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Final Submission of Escalation to Officer
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerProfile) return;

    if (!consentChecked) {
      alert('Please agree to the diagnostic data consent to send your photo to an extension officer.');
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await getAuthHeaders()) },
        // Name, phone, district and EPA are added by the server from your verified profile
        body: JSON.stringify({
          diagnosis,
          village,
          additionalNotes: fieldDescription,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit escalation');
      }

      const ticket: EscalationTicket = await response.json();
      setSubmittedTicket(ticket);
      onSubmitted(ticket);
    } catch (err: any) {
      // Do NOT pretend it was sent: the farmer must know it did not reach an officer
      console.error(err);
      setSubmitError(err?.message || 'Could not send your case. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppUrl = () => {
    if (!farmerProfile) return '#';
    const text = [
      `*Crop Doctor Malawi - Extension Request*`,
      `*Farmer:* ${farmerProfile.name}`,
      `*Phone:* ${farmerProfile.phone}`,
      `*District:* ${farmerProfile.district} (EPA: ${farmerProfile.epa || 'N/A'}, Village: ${village || 'N/A'})`,
      `*Crop:* ${diagnosis.cropName}`,
      `*AI Suspected Issue:* ${diagnosis.localDiagnosisName} (${diagnosis.primaryDiagnosis})`,
      `*Confidence:* ${diagnosis.confidenceScore}%`,
      `*Reason for review:* ${diagnosis.escalationReason || 'Low confidence or harvest risk'}`,
      `*Farmer Description:* ${fieldDescription || 'Please inspect attached photo'}`,
    ].join('\n');

    return `https://wa.me/?text=${encodeURIComponent(text)}`;
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
          {/* Not a signed-in farmer: ask them to sign in / sign up first */}
          {!farmerProfile ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                    {userRole === 'extension_officer' || userRole === 'admin' ? 'Farmer accounts only' : 'Sign in required'}
                  </h4>
                  <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                    {userRole === 'extension_officer' || userRole === 'admin'
                      ? 'Cases can only be sent by farmer accounts. Extension officers review cases from the Cases & Replies queue.'
                      : firebaseUser
                      ? 'You are signed in with Google but have not finished creating your account. It only takes a minute.'
                      : 'To send this case to an Extension Officer and receive their advice, please sign in or create a free account. Your diagnosis above stays free for everyone.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                {userRole !== 'extension_officer' && userRole !== 'admin' && (
                  <>
                    {!firebaseUser && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          openAuth('signin');
                        }}
                        className="px-4 py-2.5 text-xs font-bold text-emerald-800 border border-emerald-300 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                      >
                        Sign in
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        openAuth('signup');
                      }}
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <span>{firebaseUser ? 'Finish sign-up' : 'Create account'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
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
                    'Add a description for the extension officer: e.g. when symptoms started, affected field area, weather conditions, or specific questions...'}
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
                    {CONSENT_TEXT[currentLanguage]}
                  </div>
                </label>
              </div>

              {submitError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

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
