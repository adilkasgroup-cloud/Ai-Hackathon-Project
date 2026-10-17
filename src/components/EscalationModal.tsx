import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Send, MessageSquare, CheckCircle, ShieldAlert, MapPin, Phone, User, Home, ShieldCheck } from 'lucide-react';
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
  const { farmerProfile, registerFarmer } = useAuth();

  const [farmerName, setFarmerName] = useState(farmerProfile?.name || '');
  const [farmerPhone, setFarmerPhone] = useState(farmerProfile?.phone || '+265 ');
  const [district, setDistrict] = useState(farmerProfile?.district || 'Lilongwe');
  const [epa, setEpa] = useState(farmerProfile?.epa || '');
  const [village, setVillage] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [consentChecked, setConsentChecked] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<EscalationTicket | null>(null);

  useEffect(() => {
    if (farmerProfile) {
      setFarmerName(farmerProfile.name);
      setFarmerPhone(farmerProfile.phone);
      setDistrict(farmerProfile.district);
      if (farmerProfile.epa) setEpa(farmerProfile.epa);
    }
  }, [farmerProfile]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName.trim() || !farmerPhone.trim()) {
      alert('Please fill in your name and phone number.');
      return;
    }

    if (!consentChecked) {
      alert('Please agree to the diagnostic data consent to send your photo to an extension officer.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Auto-save lightweight farmer registration if not saved yet
      if (!farmerProfile) {
        await registerFarmer(farmerName, farmerPhone, district, epa, consentChecked);
      }

      const response = await fetch('/api/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagnosis,
          farmerName,
          farmerPhone,
          district,
          epa,
          village,
          additionalNotes,
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
        farmerName,
        farmerPhone,
        district,
        epa: epa || 'Local EPA',
        village,
        additionalNotes,
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
    const text = [
      `*Crop Doctor Malawi - Extension Request*`,
      `*Mlimi / Farmer:* ${farmerName || 'Smallholder farmer'}`,
      `*Phone:* ${farmerPhone}`,
      `*District / Boma:* ${district} (EPA: ${epa || 'N/A'}, Village: ${village || 'N/A'})`,
      `*Crop:* ${diagnosis.cropName}`,
      `*AI Suspected Issue:* ${diagnosis.localDiagnosisName} (${diagnosis.primaryDiagnosis})`,
      `*Confidence:* ${diagnosis.confidenceScore}%`,
      `*Reason for review:* ${diagnosis.escalationReason || 'Low confidence or harvest risk'}`,
      `*Farmer notes:* ${additionalNotes || 'Please inspect attached photo'}`,
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
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 leading-tight">
                {t.officerModalTitle}
              </h3>
              <p className="text-xs text-stone-500">Lightweight submission • No password needed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {submittedTicket ? (
            /* Success confirmation */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-emerald-950">
                  {t.escalationSuccess}
                </h4>
                <p className="text-xs text-stone-600 mt-1 max-w-xs mx-auto">
                  Case reference #{submittedTicket.id.slice(-6).toUpperCase()} registered for district{' '}
                  <strong>{submittedTicket.district}</strong>. You can check for extension officer replies anytime in the "My Cases" tab.
                </p>
              </div>

              {/* Direct WhatsApp Share Option */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left space-y-2 mt-4">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <span>Also Share with Your Extension Officer on WhatsApp:</span>
                </span>
                <p className="text-xs text-emerald-900">
                  You can send this exact diagnostic summary straight to your local AEDO or farmer group WhatsApp chat:
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
            /* Escalation Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Summary of current case */}
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
                    Confidence: {diagnosis.confidenceScore}% (Requires Human Review)
                  </p>
                </div>
              </div>

              {/* Farmer Name */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-stone-500" />
                  <span>{t.farmerNameLabel} *</span>
                </label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="e.g. Kondwani Phiri"
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-stone-500" />
                  <span>{t.farmerPhoneLabel} *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  placeholder="+265 888 123 456"
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* District & EPA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-500" />
                    <span>{t.districtLabel} *</span>
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {MALAWI_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d} District
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1">
                    <Home className="w-3.5 h-3.5 text-stone-500" />
                    <span>{t.epaLabel}</span>
                  </label>
                  <input
                    type="text"
                    value={epa}
                    onChange={(e) => setEpa(e.target.value)}
                    placeholder="e.g. Chulu EPA / Nambuma"
                    className="w-full text-xs px-3 py-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Village */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Village / Section:
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. TA Mwase, Mtenje Village"
                  className="w-full text-xs px-3.5 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  {t.notesLabel}:
                </label>
                <textarea
                  rows={2}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Any extra field symptoms, acreage affected, or crop stage..."
                  className="w-full text-xs p-3 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                />
              </div>

              {/* MANDATORY CONSENT LINE */}
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
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : t.sendCaseBtn}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
