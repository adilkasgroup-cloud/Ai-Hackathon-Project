import React, { useEffect, useState } from 'react';
import { X, Sprout, UserCheck, AlertCircle, CheckCircle2, RefreshCw, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MALAWI_DISTRICTS } from '../data/translations';
import { CONSENT_TEXT } from '../data/consent';
import { Language } from '../types/crop';

interface AuthPageProps {
  currentLanguage: Language;
  onClose: () => void;
}

const GoogleLogo = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
  </svg>
);

/**
 * Full-page Sign in / Sign up.
 *
 *  - Sign in  : returning users. Google, then straight to their dashboard (no role picker).
 *  - Sign up  : new users. Google, then a ONE-TIME form (role + details).
 *
 * The role chosen here is only a request: everyone starts as a farmer, and extension
 * officer access has to be approved by an admin.
 */
export const AuthPage: React.FC<AuthPageProps> = ({ currentLanguage, onClose }) => {
  const { firebaseUser, profile, needsOnboarding, loading, authView, openAuth, signInWithGoogle, createAccount, signOut } =
    useAuth();

  const [requestedRole, setRequestedRole] = useState<'farmer' | 'extension_officer'>('farmer');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Lilongwe');
  const [epa, setEpa] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Pre-fill the name from Google once
  useEffect(() => {
    if (firebaseUser?.displayName && !name) setName(firebaseUser.displayName);
  }, [firebaseUser]);

  const handleGoogle = async () => {
    setError('');
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(
        err?.code === 'auth/unauthorized-domain'
          ? 'This website address has not been allowed for Google sign-in yet. Add it under Firebase > Authentication > Settings > Authorized domains.'
          : err?.code === 'auth/operation-not-allowed'
          ? 'Google sign-in is not switched on yet. Enable it in Firebase > Authentication > Sign-in method.'
          : err?.message || 'Google sign-in failed. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Please enter your full name.');
    if (phone.replace(/\D/g, '').length < 9) return setError('Please enter a valid phone number, e.g. +265 888 123 456.');
    if (requestedRole === 'extension_officer' && !epa.trim()) return setError('Please enter the EPA you are assigned to.');
    if (!consent) return setError('Please tick the privacy consent box to continue.');

    setBusy(true);
    try {
      await createAccount({ requestedRole, name, phone, district, epa, consentGiven: consent });
    } catch (err: any) {
      setError(err?.message || 'Could not create your account. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    'w-full text-sm px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f8faf5]">
      <div className="min-h-full flex flex-col items-center px-4 py-6 sm:py-12">
        <div className="w-full max-w-md">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
                <Sprout className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="font-bold text-lg text-emerald-950 tracking-tight">Crop Doctor Malawi</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 transition-colors cursor-pointer"
              aria-label="Close and continue without an account"
              title="Continue without an account"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-5">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Checking who is signed in */}
            {loading && (
              <div className="py-10 text-center text-sm text-stone-500 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Checking your account…</span>
              </div>
            )}

            {/* Signed in and set up: App closes this page automatically */}
            {!loading && firebaseUser && profile && (
              <div className="py-10 text-center text-sm text-emerald-800 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Signed in. Taking you to your dashboard…</span>
              </div>
            )}

            {/* STEP 1: Not signed in => Sign in OR Sign up */}
            {!loading && !firebaseUser && (
              <>
                <div className="text-center space-y-1.5">
                  <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
                    {authView === 'signup' ? 'Create your account' : 'Welcome back'}
                  </h1>
                  <p className="text-sm text-stone-500">
                    {authView === 'signup'
                      ? 'Set up once, then send tricky crop cases to an extension officer.'
                      : 'Sign in to see replies from your extension officer.'}
                  </p>
                </div>

                <button
                  onClick={handleGoogle}
                  disabled={busy}
                  className="w-full py-3 px-4 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl font-semibold text-sm text-stone-800 flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <GoogleLogo />
                  <span>{busy ? 'Opening Google…' : authView === 'signup' ? 'Sign up with Google' : 'Continue with Google'}</span>
                </button>

                <p className="text-center text-sm text-stone-600">
                  {authView === 'signup' ? (
                    <>
                      Already have an account?{' '}
                      <button onClick={() => openAuth('signin')} className="font-bold text-emerald-700 hover:underline cursor-pointer">
                        Sign in
                      </button>
                    </>
                  ) : (
                    <>
                      New to Crop Doctor?{' '}
                      <button onClick={() => openAuth('signup')} className="font-bold text-emerald-700 hover:underline cursor-pointer">
                        Create an account
                      </button>
                    </>
                  )}
                </p>

                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    You <strong>don't need an account</strong> to diagnose a crop. An account is only needed to send a case to an
                    extension officer and see their reply.
                  </span>
                </div>
              </>
            )}

            {/* STEP 2: Signed in with Google but no Crop Doctor account yet => one-time set-up */}
            {needsOnboarding && (
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1.5">
                  <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
                    {authView === 'signin' ? 'Finish creating your account' : 'Tell us about you'}
                  </h1>
                  <p className="text-sm text-stone-500">
                    Signed in as <strong className="text-stone-700">{firebaseUser?.email}</strong>.{' '}
                    <button type="button" onClick={signOut} className="text-emerald-700 font-semibold hover:underline cursor-pointer">
                      Use a different account
                    </button>
                  </p>
                </div>

                {authView === 'signin' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                    We couldn't find a Crop Doctor account for this Google account yet. Fill in the details below to create one
                    (you only do this once).
                  </div>
                )}

                {/* Account type */}
                <fieldset className="space-y-2">
                  <legend className="text-xs font-bold text-stone-800 mb-1">I am a…</legend>
                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      requestedRole === 'farmer' ? 'border-emerald-600 bg-emerald-50/60' : 'border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    <input type="radio" name="role" checked={requestedRole === 'farmer'} onChange={() => setRequestedRole('farmer')} className="mt-1" />
                    <span className="text-sm">
                      <span className="font-bold text-stone-900 flex items-center gap-1.5">
                        <Sprout className="w-4 h-4 text-emerald-700" /> Farmer
                      </span>
                      <span className="text-xs text-stone-500 block mt-0.5">Send crop cases to an officer and see their replies.</span>
                    </span>
                  </label>
                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      requestedRole === 'extension_officer' ? 'border-emerald-600 bg-emerald-50/60' : 'border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      checked={requestedRole === 'extension_officer'}
                      onChange={() => setRequestedRole('extension_officer')}
                      className="mt-1"
                    />
                    <span className="text-sm">
                      <span className="font-bold text-stone-900 flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-emerald-700" /> Extension officer
                      </span>
                      <span className="text-xs text-stone-500 block mt-0.5">Review farmers' cases and send guidance.</span>
                    </span>
                  </label>
                </fieldset>

                {requestedRole === 'extension_officer' && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <span>
                      Officer accounts are <strong>approved by an administrator</strong>. Until then you'll have normal farmer access.
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Full name (Dzina Lanu)</label>
                  <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kondwani Phiri" required />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Phone / WhatsApp number</label>
                  <input
                    className={`${inputClass} font-mono`}
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+265 888 123 456"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">District (Boma)</label>
                    <select className={inputClass} value={district} onChange={(e) => setDistrict(e.target.value)}>
                      {MALAWI_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      EPA {requestedRole === 'extension_officer' ? '' : '(optional)'}
                    </label>
                    <input className={inputClass} value={epa} onChange={(e) => setEpa(e.target.value)} placeholder="e.g. Chulu EPA" />
                  </div>
                </div>

                <label className="flex items-start gap-2.5 p-3 bg-amber-50/80 border border-amber-300 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 w-4 h-4" />
                  <span className="text-[11px] text-amber-950 leading-relaxed font-medium">
                    <span className="font-bold block text-amber-900 mb-0.5">Privacy consent</span>
                    {CONSENT_TEXT[currentLanguage]}
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {busy ? 'Creating your account…' : 'Create account'}
                </button>
              </form>
            )}
          </div>

          <button onClick={onClose} className="mt-5 w-full text-center text-sm text-stone-500 hover:text-stone-800 cursor-pointer">
            Continue without an account
          </button>
        </div>
      </div>
    </div>
  );
};
