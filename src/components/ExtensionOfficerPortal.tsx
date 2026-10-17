import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Phone,
  MapPin,
  MessageSquare,
  ChevronRight,
  Filter,
  Check,
  Sparkles,
  RefreshCw,
  Search,
  Lock,
  LogOut,
} from 'lucide-react';
import { EscalationTicket, Language } from '../types/crop';
import { MALAWI_DISTRICTS } from '../data/translations';
import { useAuth } from '../context/AuthContext';

interface ExtensionOfficerPortalProps {
  currentLanguage: Language;
  onSelectCaseToView?: (diagnosis: any) => void;
}

export const ExtensionOfficerPortal: React.FC<ExtensionOfficerPortalProps> = ({
  currentLanguage,
  onSelectCaseToView,
}) => {
  const { officerProfile, logoutOfficer, openAuthModal, loginOfficerWithPin } = useAuth();
  const [tickets, setTickets] = useState<EscalationTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<EscalationTicket | null>(null);
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Quick inline PIN state for officers not yet logged in
  const [quickPin, setQuickPin] = useState('');
  const [quickOfficerName, setQuickOfficerName] = useState('AEDO J. Mwale');
  const [pinError, setPinError] = useState('');

  // Officer feedback form states
  const [officerNotes, setOfficerNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const url = new URL('/api/escalations', window.location.origin);
      if (districtFilter !== 'all') url.searchParams.set('district', districtFilter);
      if (statusFilter !== 'all') url.searchParams.set('status', statusFilter);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
        if (data.length > 0 && !selectedTicket) {
          setSelectedTicket(data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [districtFilter, statusFilter]);

  const handleUpdateStatus = async (ticketId: string, newStatus: 'pending' | 'in_review' | 'resolved') => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/escalations/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          officerName: officerProfile?.name || 'Agricultural Extension Development Officer (AEDO)',
          officerFeedback: officerNotes || (selectedTicket?.officerFeedback || ''),
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setTickets((prev) => prev.map((t) => (t.id === ticketId ? updated : t)));
        setSelectedTicket(updated);
        setOfficerNotes('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuickPinLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    try {
      await loginOfficerWithPin(quickPin, quickOfficerName, 'Lilongwe', 'Central EPA');
      setQuickPin('');
    } catch (err: any) {
      setPinError(err?.message || 'Invalid PIN. Try default PIN: 2026.');
    }
  };

  const getWhatsAppFarmerUrl = (ticket: EscalationTicket) => {
    const text = [
      `Moni ${ticket.farmerName},`,
      `This is ${officerProfile?.name || 'AEDO Extension Officer'} from Ministry of Agriculture Extension (EPA).`,
      `Regarding your crop photo for *${ticket.diagnosis.cropName}* (${ticket.diagnosis.localDiagnosisName}):`,
      officerNotes || ticket.officerFeedback || `We have reviewed your field photo. Please scout adjacent rows and avoid applying unverified chemicals.`,
      `Status: Case verified by Extension Officer.`,
    ].join('\n\n');

    const cleanPhone = ticket.farmerPhone.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  const pendingCount = tickets.filter((t) => t.status === 'pending').length;
  const criticalCount = tickets.filter((t) => t.diagnosis.severity === 'critical').length;

  // PIN GUARD: If not logged in as an officer, show PIN barrier
  if (!officerProfile) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-8 max-w-lg mx-auto my-8 space-y-6 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Extension Officer Portal (PIN Protected)
          </h2>
          <p className="text-xs text-stone-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
            Extension officers log in separately with a 4-digit staff PIN to review farmer cases, investigate outbreaks, and send official advice.
          </p>
        </div>

        {pinError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 text-left">
            {pinError}
          </div>
        )}

        <form onSubmit={handleQuickPinLogin} className="space-y-3.5 text-left max-w-sm mx-auto">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Officer Name:
            </label>
            <input
              type="text"
              required
              value={quickOfficerName}
              onChange={(e) => setQuickOfficerName(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-stone-700">Staff PIN:</label>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
                Default PIN: 2026
              </span>
            </div>
            <input
              type="password"
              required
              value={quickPin}
              onChange={(e) => setQuickPin(e.target.value)}
              placeholder="Enter PIN (e.g. 2026)"
              className="w-full text-sm font-mono tracking-widest text-center px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Unlock Extension Queue</span>
          </button>
        </form>

        <p className="text-[11px] text-stone-400">
          Smallholder farmers do not need a PIN and can freely use photo diagnosis anytime.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Officer Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-green-900 to-emerald-900 text-white p-5 sm:p-6 rounded-3xl shadow-sm border border-emerald-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
              <UserCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">
                  Extension Officer Queue (EPA / AEDO)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  PIN Verified
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Logged in as <strong>{officerProfile.name}</strong> • {officerProfile.epa} ({officerProfile.district})
              </p>
            </div>
          </div>

          {/* Quick Metrics & Logout */}
          <div className="flex items-center gap-2">
            <div className="bg-emerald-900/60 border border-emerald-700/60 rounded-xl px-3 py-2 text-center">
              <span className="block text-lg font-black text-white">{pendingCount}</span>
              <span className="text-[10px] text-emerald-300 uppercase font-bold">Needs Review</span>
            </div>
            <div className="bg-rose-950/60 border border-rose-800/60 rounded-xl px-3 py-2 text-center">
              <span className="block text-lg font-black text-rose-300">{criticalCount}</span>
              <span className="text-[10px] text-rose-200 uppercase font-bold">High Threat</span>
            </div>
            <button
              onClick={logoutOfficer}
              className="p-2 rounded-xl bg-emerald-950/80 hover:bg-rose-900/80 border border-emerald-700/60 text-emerald-200 hover:text-white transition-colors cursor-pointer"
              title="Log Out Officer Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter controls */}
      <div className="bg-white p-3.5 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-stone-500 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* District filter */}
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-medium text-stone-700 focus:outline-none"
          >
            <option value="all">All Malawi Districts</option>
            {MALAWI_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-medium text-stone-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Human Review</option>
            <option value="in_review">In Review</option>
            <option value="resolved">Resolved / Advised</option>
          </select>
        </div>

        <button
          onClick={fetchTickets}
          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Two-column layout: Queue list + Detail inspect */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Cases List */}
        <div className="lg:col-span-5 space-y-2.5">
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider px-1">
            Incoming Farmer Cases ({tickets.length})
          </h3>

          {tickets.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
              No cases matching current filter.
            </div>
          ) : (
            tickets.map((ticket) => {
              const isSelected = selectedTicket?.id === ticket.id;
              const isPending = ticket.status === 'pending';

              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={ticket.diagnosis.imageUrl}
                      alt={ticket.diagnosis.primaryDiagnosis}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            isPending
                              ? 'bg-amber-100 text-amber-800'
                              : ticket.status === 'in_review'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {ticket.status.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {ticket.diagnosis.localDiagnosisName}
                      </h4>
                      <p className="text-[11px] text-stone-600 truncate">
                        Mlimi: {ticket.farmerName} • {ticket.district}
                      </p>

                      <div className="mt-1 flex items-center justify-between text-[10px]">
                        <span className="text-stone-500">
                          AI Conf: <strong className="text-stone-700">{ticket.diagnosis.confidenceScore}%</strong>
                        </span>
                        <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                          <span>Inspect</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Case Inspection & Extension Officer Actions */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden sticky top-24">
              {/* Header */}
              <div className="p-5 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                    Case #{selectedTicket.id.slice(-6).toUpperCase()} • {selectedTicket.district} District
                  </span>
                  <h3 className="text-base font-bold text-stone-900 leading-snug">
                    {selectedTicket.diagnosis.localDiagnosisName}
                  </h3>
                  <p className="text-xs text-emerald-800 font-medium">
                    {selectedTicket.diagnosis.primaryDiagnosis} ({selectedTicket.diagnosis.cropName})
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      selectedTicket.diagnosis.confidenceScore >= 70
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    AI Confidence: {selectedTicket.diagnosis.confidenceScore}%
                  </span>
                </div>
              </div>

              {/* Case Body */}
              <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* Farmer Info Grid */}
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3.5 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-500 font-semibold uppercase block">Farmer Name</span>
                    <span className="font-bold text-stone-900">{selectedTicket.farmerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-semibold uppercase block">Phone / WhatsApp</span>
                    <a
                      href={`tel:${selectedTicket.farmerPhone}`}
                      className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{selectedTicket.farmerPhone}</span>
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-semibold uppercase block">Extension Area (EPA)</span>
                    <span className="font-medium text-stone-800">
                      {selectedTicket.epa || 'General EPA'}, {selectedTicket.village || 'Local Village'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-semibold uppercase block">Severity Risk</span>
                    <span className="font-bold uppercase text-stone-900">
                      {selectedTicket.diagnosis.severity}
                    </span>
                  </div>
                </div>

                {/* Farmer Notes if any */}
                {selectedTicket.additionalNotes && (
                  <div className="text-xs p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-bold text-stone-700 block mb-0.5">Farmer Notes:</span>
                    <p className="text-stone-600 italic">"{selectedTicket.additionalNotes}"</p>
                  </div>
                )}

                {/* Field Image inspection */}
                <div>
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5">
                    Farmer's Field Photo:
                  </span>
                  <div className="aspect-16/9 rounded-2xl overflow-hidden border border-stone-200 bg-stone-900">
                    <img
                      src={selectedTicket.diagnosis.imageUrl}
                      alt={selectedTicket.diagnosis.primaryDiagnosis}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* What the AI saw */}
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-stone-700 uppercase tracking-wider block">
                    AI Visual Observations:
                  </span>
                  <ul className="list-disc list-inside text-stone-600 space-y-1">
                    {selectedTicket.diagnosis.visualObservations.map((obs, i) => (
                      <li key={i}>{obs}</li>
                    ))}
                  </ul>
                </div>

                {/* Officer Action & Review Box */}
                <div className="pt-3 border-t border-stone-200 space-y-3">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Officer Decision & Direct Guidance
                  </h4>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Official Feedback for Farmer (Chichewa / Tumbuka / English):
                    </label>
                    <textarea
                      rows={3}
                      value={officerNotes}
                      onChange={(e) => setOfficerNotes(e.target.value)}
                      placeholder="e.g. Ndawona chithunzicho. Ndi mbozi ya chiwawa (buba). Yambani kutola ndi manja ndi kuthira phulusa. Ngati zachuluka pitani ku Farmers World..."
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => handleUpdateStatus(selectedTicket.id, 'resolved')}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Resolve Case</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedTicket.id, 'in_review')}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      <span>Mark In Review</span>
                    </button>

                    {/* WhatsApp direct response to farmer */}
                    <a
                      href={getWhatsAppFarmerUrl(selectedTicket)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors ml-auto"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp to Mlimi</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center text-stone-400 text-xs">
              Select an escalated ticket to inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
