import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  UserCheck,
  Send,
  RefreshCw,
  Search,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { EscalationTicket, Language } from '../types/crop';

interface FarmerCasesRepliesProps {
  currentLanguage: Language;
  onOpenLightweightSignUp: () => void;
  onSelectCaseToView?: (diagnosis: any) => void;
}

export const FarmerCasesReplies: React.FC<FarmerCasesRepliesProps> = ({
  currentLanguage,
  onOpenLightweightSignUp,
  onSelectCaseToView,
}) => {
  const { farmerProfile } = useAuth();
  const [phoneQuery, setPhoneQuery] = useState(farmerProfile?.phone || '');
  const [cases, setCases] = useState<EscalationTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState<EscalationTicket | null>(null);

  const fetchFarmerCases = async (phoneToQuery: string) => {
    if (!phoneToQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/farmer-cases?phone=${encodeURIComponent(phoneToQuery.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setCases(data);
        if (data.length > 0 && !selectedCase) {
          setSelectedCase(data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (farmerProfile?.phone) {
      setPhoneQuery(farmerProfile.phone);
      fetchFarmerCases(farmerProfile.phone);
    }
  }, [farmerProfile]);

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden animate-in fade-in duration-300 p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-stone-100 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <UserCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900">
                {currentLanguage === 'ny'
                  ? 'Milandu Yanga & Mayankho a Alangizi'
                  : currentLanguage === 'tum'
                  ? 'Milandu Yane & Mazgo gha Ŵalara'
                  : 'My Submitted Cases & Officer Replies'}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Track your field photo submissions and view official feedback from your local EPA extension officer.
              </p>
            </div>
          </div>

          {!farmerProfile ? (
            <button
              onClick={onOpenLightweightSignUp}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
            >
              Sign up as Farmer (No Password)
            </button>
          ) : (
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl shrink-0">
              Mlimi: <strong>{farmerProfile.name}</strong> ({farmerProfile.district})
            </span>
          )}
        </div>

        {/* Lookup bar by phone number if farmer wants to check from another device */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchFarmerCases(phoneQuery);
          }}
          className="mt-4 flex items-center gap-2 max-w-md"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={phoneQuery}
              onChange={(e) => setPhoneQuery(e.target.value)}
              placeholder="Search by your phone number (e.g. +265...)"
              className="w-full text-xs pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-3.5 py-2 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Find My Cases'}
          </button>
        </form>
      </div>

      {/* Main cases layout */}
      {cases.length === 0 ? (
        <div className="p-10 text-center bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
          <MessageSquare className="w-10 h-10 text-stone-300 mx-auto" />
          <h4 className="text-sm font-bold text-stone-700">No Cases Found for this Phone Number</h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            When you diagnose a sick plant and tap "Send to Extension Officer", your cases and the officer's written advice will show up here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* List of cases */}
          <div className="lg:col-span-5 space-y-2.5">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Your Submissions ({cases.length})
            </span>

            {cases.map((t) => {
              const isSelected = selectedCase?.id === t.id;
              const hasReply = !!t.officerFeedback;

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedCase(t)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={t.diagnosis.imageUrl}
                      alt={t.diagnosis.primaryDiagnosis}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-200"
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
                          {hasReply ? 'Officer Replied ✓' : 'Awaiting Review'}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {t.diagnosis.localDiagnosisName}
                      </h4>
                      <p className="text-[11px] text-stone-500 truncate">
                        {t.diagnosis.cropName} • {t.district}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed view of selected case with Officer Reply */}
          <div className="lg:col-span-7">
            {selectedCase ? (
              <div className="bg-stone-50/70 rounded-3xl border border-stone-200 p-5 space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-stone-200/80 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                      Case #{selectedCase.id.slice(-6).toUpperCase()}
                    </span>
                    <h3 className="text-base font-bold text-stone-900">
                      {selectedCase.diagnosis.localDiagnosisName}
                    </h3>
                    <p className="text-xs text-stone-600">
                      Crop: {selectedCase.diagnosis.cropName} • Submitted on{' '}
                      {new Date(selectedCase.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      selectedCase.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedCase.status === 'in_review'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedCase.status === 'resolved'
                      ? 'Resolved'
                      : selectedCase.status === 'in_review'
                      ? 'In Review'
                      : 'Pending Review'}
                  </span>
                </div>

                {/* Photo preview */}
                <div className="aspect-16/9 rounded-2xl overflow-hidden border border-stone-200 bg-stone-900">
                  <img
                    src={selectedCase.diagnosis.imageUrl}
                    alt={selectedCase.diagnosis.primaryDiagnosis}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* OFFICIAL EXTENSION OFFICER FEEDBACK BOX */}
                <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-700" />
                      <span>Official Agricultural Extension Officer Advice:</span>
                    </span>
                    {selectedCase.officerName && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                        {selectedCase.officerName}
                      </span>
                    )}
                  </div>

                  {selectedCase.officerFeedback ? (
                    <div className="text-xs sm:text-sm text-stone-800 leading-relaxed bg-white p-3.5 rounded-xl border border-emerald-200">
                      <p className="whitespace-pre-wrap">{selectedCase.officerFeedback}</p>
                      {selectedCase.reviewedAt && (
                        <span className="text-[10px] text-stone-400 block mt-2 text-right">
                          Reviewed: {new Date(selectedCase.reviewedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-800 italic bg-white/60 p-3 rounded-xl border border-emerald-200">
                      An agricultural extension officer has received your photo and is reviewing the symptoms. Check back here or watch for an SMS/WhatsApp on your phone (+265).
                    </div>
                  )}
                </div>

                {/* AI Visual finding summary */}
                <div className="text-xs text-stone-600 bg-white p-3.5 rounded-2xl border border-stone-200 space-y-1">
                  <span className="font-bold text-stone-800 block">AI Photo Symptoms:</span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {selectedCase.diagnosis.visualObservations.map((obs, i) => (
                      <li key={i}>{obs}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
