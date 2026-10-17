import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Inbox,
  UserCheck,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  MessageSquare,
  Lock,
  RefreshCw,
  Search,
  Sprout,
  AlertCircle,
  FileText,
  LogOut,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { EscalationTicket, Language } from '../types/crop';
import { MALAWI_DISTRICTS } from '../data/translations';

interface FarmerCaseRepliesProps {
  currentLanguage: Language;
  onNavigateToDiagnose: () => void;
}

export const FarmerCaseReplies: React.FC<FarmerCaseRepliesProps> = ({
  currentLanguage,
  onNavigateToDiagnose,
}) => {
  const { farmerProfile, loginFarmerWithPassword, registerFarmer, logoutFarmer } = useAuth();

  // Login form state (if farmer not yet logged in)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [phone, setPhone] = useState('+265 888 234 567');
  const [password, setPassword] = useState('farmer2026');
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('Lilongwe');
  const [epa, setEpa] = useState('');
  const [consent, setConsent] = useState(true);
  const [authError, setAuthError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Cases state
  const [cases, setCases] = useState<EscalationTicket[]>([]);
  const [isLoadingCases, setIsLoadingCases] = useState(false);
  const [selectedCase, setSelectedCase] = useState<EscalationTicket | null>(null);

  // Fetch farmer cases
  const fetchFarmerCases = async (farmerPhone: string) => {
    setIsLoadingCases(true);
    try {
      const res = await fetch(`/api/farmer-cases?phone=${encodeURIComponent(farmerPhone)}`);
      if (res.ok) {
        const data: EscalationTicket[] = await res.json();
        setCases(data);
        if (data.length > 0 && !selectedCase) {
          setSelectedCase(data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingCases(false);
    }
  };

  useEffect(() => {
    if (farmerProfile?.phone) {
      fetchFarmerCases(farmerProfile.phone);
    }
  }, [farmerProfile]);

  // Handle Farmer Login with Password
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmittingAuth(true);

    try {
      if (authMode === 'login') {
        await loginFarmerWithPassword(phone, password);
      } else {
        if (!name.trim()) {
          throw new Error('Please enter your full name');
        }
        await registerFarmer(name, phone, district, epa, password, consent);
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication failed. Please check your phone number and password.');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const getWhatsAppOfficerUrl = (ticket: EscalationTicket) => {
    const text = [
      `Moni Bwana / Extension Officer,`,
      `This is farmer ${farmerProfile?.name || ticket.farmerName} from ${ticket.district} (${ticket.epa || 'EPA'}).`,
      `Regarding my crop case #${ticket.id.slice(-6).toUpperCase()} for *${ticket.diagnosis.cropName}*:`,
      `Thank you for your guidance. I have a question about next steps.`,
    ].join('\n\n');

    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  // IF FARMER IS NOT LOGGED IN: Show secure Password-protected Login Screen
  if (!farmerProfile) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10 max-w-md mx-auto my-6 space-y-6 animate-in fade-in duration-300">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8 text-emerald-700" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Farmer Case Replies Portal
          </h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            Log in with your phone number and password to view official advice and recommendations sent by your local extension officer.
          </p>
        </div>

        {/* Tab Toggle: Log In vs Sign Up */}
        <div className="bg-stone-100 p-1 rounded-2xl grid grid-cols-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setAuthError('');
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              authMode === 'login'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Log In (Existing)
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setAuthError('');
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              authMode === 'signup'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Sign Up (New Account)
          </button>
        </div>

        {authError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
          {authMode === 'signup' && (
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                Full Name (Dzina Lanu):
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kondwani Phiri"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block font-bold text-stone-800 mb-1">
              Phone / WhatsApp Number (+265):
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+265 888 123 456"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-stone-800">Password:</label>
              <span className="text-[10px] text-emerald-800 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                Demo: farmer2026
              </span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your account password"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          {authMode === 'signup' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  District:
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-2.5 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {MALAWI_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  EPA (Optional):
                </label>
                <input
                  type="text"
                  value={epa}
                  onChange={(e) => setEpa(e.target.value)}
                  placeholder="e.g. Chulu EPA"
                  className="w-full px-2.5 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmittingAuth}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>
              {isSubmittingAuth
                ? 'Verifying...'
                : authMode === 'login'
                ? 'Log In to View Replies'
                : 'Create Account & View Replies'}
            </span>
          </button>
        </form>

        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-[11px] text-stone-500">
          <strong>Demo Farmer Account:</strong> You can test using pre-seeded phone <code>+265 888 234 567</code> with password <code>farmer2026</code>.
        </div>
      </div>
    );
  }

  // IF FARMER IS LOGGED IN: Render their case replies
  const answeredCount = cases.filter((c) => c.status === 'resolved' || !!c.officerFeedback).length;
  const pendingCount = cases.filter((c) => c.status === 'pending').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Farmer Profile Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Inbox className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900">
                {currentLanguage === 'ny'
                  ? 'Mayankho a Milandu Yanu'
                  : currentLanguage === 'tum'
                  ? 'Mazgo gha Milandu Yinu'
                  : 'My Case Replies & Officer Guidance'}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Logged In
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Mlimi: <strong>{farmerProfile.name}</strong> • Phone: {farmerProfile.phone} • {farmerProfile.district} District
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => fetchFarmerCases(farmerProfile.phone)}
            className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
            title="Refresh Cases"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingCases ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={logoutFarmer}
            className="px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div className="bg-white p-3.5 rounded-2xl border border-stone-200">
          <span className="block text-xl font-black text-stone-900">{cases.length}</span>
          <span className="text-[10px] text-stone-500 font-bold uppercase">Total Submitted</span>
        </div>
        <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
          <span className="block text-xl font-black text-emerald-800">{answeredCount}</span>
          <span className="text-[10px] text-emerald-700 font-bold uppercase">Officer Replies</span>
        </div>
        <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
          <span className="block text-xl font-black text-amber-800">{pendingCount}</span>
          <span className="text-[10px] text-amber-700 font-bold uppercase">Awaiting Review</span>
        </div>
      </div>

      {/* Main Content Area: Cases List + Detail */}
      {cases.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-800">
              No Cases Submitted Yet
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              You haven't escalated any crop cases to an extension officer under phone number {farmerProfile.phone}.
            </p>
          </div>
          <button
            onClick={onNavigateToDiagnose}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Sprout className="w-4 h-4" />
            <span>Diagnose a Crop Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: List of Cases */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider px-1">
              Your Submitted Cases ({cases.length})
            </h3>

            {cases.map((c) => {
              const isSelected = selectedCase?.id === c.id;
              const hasReply = !!c.officerFeedback || c.status === 'resolved';

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={c.diagnosis.imageUrl}
                      alt={c.diagnosis.primaryDiagnosis}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            hasReply
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {hasReply ? '✓ Replied' : 'Pending'}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {c.diagnosis.localDiagnosisName}
                      </h4>
                      <p className="text-[11px] text-emerald-800 font-medium truncate">
                        {c.diagnosis.cropName}
                      </p>

                      <div className="mt-1 flex items-center justify-between text-[10px]">
                        <span className="text-stone-500">
                          Ref: #{c.id.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                          <span>View Reply</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Case & Extension Officer Reply */}
          <div className="lg:col-span-7">
            {selectedCase ? (
              <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden sticky top-24">
                {/* Header */}
                <div className="p-5 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                      Case #{selectedCase.id.slice(-6).toUpperCase()} • {selectedCase.district}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 leading-snug">
                      {selectedCase.diagnosis.localDiagnosisName}
                    </h3>
                    <p className="text-xs text-emerald-800 font-medium">
                      {selectedCase.diagnosis.primaryDiagnosis} ({selectedCase.diagnosis.cropName})
                    </p>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      selectedCase.status === 'resolved' || selectedCase.officerFeedback
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedCase.status === 'resolved'
                      ? 'Resolved'
                      : selectedCase.status === 'in_review'
                      ? 'In Review'
                      : 'Awaiting AEDO'}
                  </span>
                </div>

                {/* Case Details */}
                <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                  {/* OFFICER REPLY SECTION - PROMINENT HIGHLIGHT */}
                  {selectedCase.officerFeedback ? (
                    <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-emerald-700" />
                          <span>Official Extension Officer Guidance</span>
                        </span>
                        {selectedCase.reviewedAt && (
                          <span className="text-[10px] text-emerald-800 font-mono">
                            {new Date(selectedCase.reviewedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-emerald-950 font-medium bg-white p-3.5 rounded-xl border border-emerald-200 leading-relaxed shadow-2xs whitespace-pre-line">
                        {selectedCase.officerFeedback}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-emerald-900 pt-1">
                        <span>
                          Verified by: <strong>{selectedCase.officerName || 'Local AEDO Officer'}</strong>
                        </span>

                        <a
                          href={getWhatsAppOfficerUrl(selectedCase)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Reply via WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                      <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-amber-950">
                          Pending Extension Officer Review
                        </h4>
                        <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                          Your case has been queued for your local EPA Extension Development Officer. They will examine your photo and description and send feedback here and to your WhatsApp/SMS.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Photo & Description Submitted by Farmer */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                        Photo You Submitted:
                      </span>
                      <img
                        src={selectedCase.diagnosis.imageUrl}
                        alt={selectedCase.diagnosis.primaryDiagnosis}
                        className="w-full aspect-4/3 object-cover rounded-xl border border-stone-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                          Your Description & Notes:
                        </span>
                        <p className="text-stone-700 italic">
                          "{selectedCase.additionalNotes || 'No extra notes provided.'}"
                        </p>
                      </div>

                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                          Location Submitted:
                        </span>
                        <p className="text-stone-800 font-medium">
                          {selectedCase.district} District • {selectedCase.epa || 'General EPA'}
                          {selectedCase.village ? ` (${selectedCase.village})` : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AI Initial Assessment Summary */}
                  <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs space-y-1.5">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                      AI Initial Diagnostic Finding:
                    </span>
                    <p className="text-stone-800 font-semibold">
                      {selectedCase.diagnosis.localDiagnosisName} ({selectedCase.diagnosis.primaryDiagnosis})
                    </p>
                    <p className="text-stone-500 text-[11px]">
                      Confidence: {selectedCase.diagnosis.confidenceScore}% • Severity: {selectedCase.diagnosis.severity}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center text-stone-400 text-xs">
                Select a case from the left to view the extension officer's reply.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
