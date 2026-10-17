import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Sprout,
  UserCheck,
  ShieldCheck,
  Lock,
  Phone,
  User,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { MALAWI_DISTRICTS } from '../data/translations';
import { Language } from '../types/crop';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, currentLanguage }) => {
  const {
    farmerProfile,
    officerProfile,
    userRole,
    registerFarmer,
    loginOfficerWithPin,
    logoutFarmer,
    logoutOfficer,
    authModalInitialTab,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'farmer' | 'officer'>(authModalInitialTab);

  // Farmer form state (Lightweight, No password)
  const [farmerName, setFarmerName] = useState(farmerProfile?.name || '');
  const [farmerPhone, setFarmerPhone] = useState(farmerProfile?.phone || '+265 ');
  const [farmerDistrict, setFarmerDistrict] = useState(farmerProfile?.district || 'Lilongwe');
  const [farmerEpa, setFarmerEpa] = useState(farmerProfile?.epa || '');
  const [consentChecked, setConsentChecked] = useState(true);

  // Officer form state (PIN login)
  const [officerName, setOfficerName] = useState(officerProfile?.name || 'AEDO J. Banda');
  const [officerDistrict, setOfficerDistrict] = useState(officerProfile?.district || 'Lilongwe');
  const [officerEpa, setOfficerEpa] = useState(officerProfile?.epa || 'Lilongwe West EPA');
  const [officerPin, setOfficerPin] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setActiveTab(authModalInitialTab);
  }, [authModalInitialTab, isOpen]);

  useEffect(() => {
    if (farmerProfile) {
      setFarmerName(farmerProfile.name);
      setFarmerPhone(farmerProfile.phone);
      setFarmerDistrict(farmerProfile.district);
      setFarmerEpa(farmerProfile.epa || '');
    }
  }, [farmerProfile]);

  if (!isOpen) return null;

  // Handle Lightweight Farmer Registration
  const handleFarmerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!farmerName.trim() || !farmerPhone.trim()) {
      setErrorMsg('Please provide your name and phone number.');
      return;
    }

    if (!consentChecked) {
      setErrorMsg('Please confirm the consent checkbox to share your case with extension officers.');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerFarmer(farmerName, farmerPhone, farmerDistrict, farmerEpa, consentChecked);
      setSuccessMsg('Profile saved! You can now send cases to Extension Officers and track their replies.');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to save farmer profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Officer PIN Login
  const handleOfficerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!officerPin.trim()) {
      setErrorMsg('Please enter your extension officer PIN (Default PIN: 2026).');
      return;
    }

    setIsSubmitting(true);
    try {
      await loginOfficerWithPin(officerPin, officerName, officerDistrict, officerEpa);
      setSuccessMsg('Authenticated as Agricultural Extension Officer! Queue unlocked.');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Invalid officer PIN. Please check with your EPA supervisor (Default: 2026).');
    } finally {
      setIsSubmitting(false);
    }
  };

  const consentText = {
    en: 'Consent: Your phone number and crop photos will be shared solely with local agricultural extension officers to diagnose your field and text you guidance. They will never be shared with third parties or used for advertising.',
    ny: 'Chilolezo: Nambala yanu ya foni ndi zithunzi za mbeu zanu zidzagawidwa kwa alangizi a za ulimi (AEDO) okha kuti akuthandizeni pa vuto lanu la m\'munda. Sizidzagulitsidwa kapena kuperekedwa kwina.',
    tum: 'Chizomerezgo: Nambala yinu ya foni na vithuzi vya vyomela vigawikenge ku ŵalara ŵa vya ulimi (AEDO) pera kuti ŵamovwirani. Vingaperekeka ku ŵanthu ŵanyake yayi.',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 leading-tight">
                Crop Doctor Access
              </h3>
              <p className="text-xs text-stone-500">
                Diagnosis is free for all • Sign up for officer features
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Access Notice Banner */}
        <div className="bg-emerald-50 px-5 py-2.5 border-b border-emerald-100 flex items-center gap-2 text-xs text-emerald-900 shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Open Access:</strong> Anyone can take photos & diagnose sick crops without an account.
          </span>
        </div>

        {/* Tab Toggle: Farmer vs Extension Officer */}
        <div className="p-3 bg-stone-100 border-b border-stone-200 grid grid-cols-2 gap-2 text-xs font-bold shrink-0">
          <button
            onClick={() => {
              setActiveTab('farmer');
              setErrorMsg('');
            }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'farmer'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span>🌾 Farmer (No Password)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('officer');
              setErrorMsg('');
            }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'officer'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-700" />
            <span>🧑‍🌾 Officer Login (PIN)</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: FARMER LIGHTWEIGHT SIGN-UP */}
          {activeTab === 'farmer' && (
            <form onSubmit={handleFarmerSubmit} className="space-y-4">
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs text-stone-600 leading-relaxed">
                <strong className="text-stone-900 block mb-0.5">Lightweight Farmer Sign-up</strong>
                Provide your name and phone number to send sick crop photos to an Extension Officer, track their replies, or save your field diagnosis history. <strong>No password required!</strong>
              </div>

              {/* Farmer Name */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-stone-500" />
                  <span>Your Name (Dzina Lanu):</span>
                </label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="e.g. Kondwani Banda"
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Farmer Phone */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-stone-500" />
                  <span>Phone / WhatsApp Number:</span>
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
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-500" />
                    <span>District (Boma):</span>
                  </label>
                  <select
                    value={farmerDistrict}
                    onChange={(e) => setFarmerDistrict(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                    value={farmerEpa}
                    onChange={(e) => setFarmerEpa(e.target.value)}
                    placeholder="e.g. Chulu EPA"
                    className="w-full text-xs px-2.5 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* MANDATORY CONSENT LINE */}
              <div className="p-3 bg-amber-50/80 border border-amber-300 rounded-2xl space-y-2">
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
              <div className="pt-2 flex items-center justify-between gap-2">
                {farmerProfile && (
                  <button
                    type="button"
                    onClick={logoutFarmer}
                    className="px-3 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                  >
                    Clear Saved Details
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : farmerProfile ? 'Update Details' : 'Save & Continue'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: EXTENSION OFFICER LOGIN (PIN PROTECTED) */}
          {activeTab === 'officer' && (
            <form onSubmit={handleOfficerSubmit} className="space-y-4">
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs text-stone-600 leading-relaxed">
                <strong className="text-stone-900 block mb-0.5">Official Extension Service Login</strong>
                Enter your assigned Extension Officer PIN to triage incoming farmer cases, write official EPA recommendations, and send verified WhatsApp advisories.
              </div>

              {/* Officer Name */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-stone-500" />
                  <span>Officer Name & Title:</span>
                </label>
                <input
                  type="text"
                  required
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder="e.g. AEDO J. Mwale"
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* District & EPA */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    District:
                  </label>
                  <select
                    value={officerDistrict}
                    onChange={(e) => setOfficerDistrict(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                    Assigned EPA:
                  </label>
                  <input
                    type="text"
                    required
                    value={officerEpa}
                    onChange={(e) => setOfficerEpa(e.target.value)}
                    placeholder="e.g. Nambuma EPA"
                    className="w-full text-xs px-2.5 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Officer PIN */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Extension Officer PIN:</span>
                  </label>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-mono font-bold">
                    Demo PIN: 2026
                  </span>
                </div>
                <input
                  type="password"
                  required
                  value={officerPin}
                  onChange={(e) => setOfficerPin(e.target.value)}
                  placeholder="Enter 4-digit staff PIN (e.g. 2026)"
                  className="w-full text-sm font-mono tracking-widest px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-center"
                />
              </div>

              {/* Submit & Officer Logout */}
              <div className="pt-2 flex items-center justify-between gap-2">
                {officerProfile && (
                  <button
                    type="button"
                    onClick={logoutOfficer}
                    className="px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out Officer</span>
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isSubmitting ? 'Verifying PIN...' : officerProfile ? 'Re-verify PIN' : 'Unlock Officer Queue'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
