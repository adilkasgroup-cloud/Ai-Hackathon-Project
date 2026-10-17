import React, { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, query, where, writeBatch } from 'firebase/firestore';
import { UserCheck, Check, X, Phone, MapPin, Mail, ShieldCheck, AlertCircle, Inbox } from 'lucide-react';
import { db } from '../lib/firebase';
import { OfficerRequest, useAuth } from '../context/AuthContext';

/**
 * Admin-only screen: approve or reject requests to become an extension officer.
 * Approving sets users/{uid}.role = 'extension_officer'. The rules only allow an admin to do that.
 */
export const AdminApprovals: React.FC = () => {
  const { userRole, firebaseUser } = useAuth();
  const [requests, setRequests] = useState<OfficerRequest[]>([]);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (userRole !== 'admin') return;
    const q = query(collection(db, 'officerRequests'), where('status', '==', 'pending'));
    return onSnapshot(
      q,
      (snap) => setRequests(snap.docs.map((d) => d.data() as OfficerRequest)),
      (err) => setError(err.message)
    );
  }, [userRole]);

  const decide = async (req: OfficerRequest, decision: 'approved' | 'rejected') => {
    setError('');
    setBusyId(req.uid);
    try {
      const now = new Date().toISOString();
      const batch = writeBatch(db);
      batch.update(doc(db, 'officerRequests', req.uid), {
        status: decision,
        reviewedAt: now,
        reviewedBy: firebaseUser?.uid || '',
      });
      if (decision === 'approved') {
        batch.update(doc(db, 'users', req.uid), { role: 'extension_officer', updatedAt: now });
      }
      await batch.commit();
    } catch (err: any) {
      setError(err?.message || 'Could not save your decision.');
    } finally {
      setBusyId(null);
    }
  };

  if (userRole !== 'admin') {
    return (
      <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center text-sm text-stone-500">
        This page is for administrators only.
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900">Extension officer approvals</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Only approve people you can verify as Ministry of Agriculture (or partner NGO) extension staff.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
            <Inbox className="w-7 h-7" />
          </div>
          <p className="text-sm font-semibold text-stone-700">No pending requests</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {requests.map((r) => (
            <div key={r.uid} className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 text-xs min-w-0">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span className="truncate">{r.displayName}</span>
                </h3>
                <p className="text-stone-600 flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-stone-400" /> {r.email}
                </p>
                <p className="text-stone-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" /> {r.phone}
                </p>
                <p className="text-stone-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" /> {r.district} • {r.epa}
                </p>
                <p className="text-[10px] text-stone-400">Requested {new Date(r.requestedAt).toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => decide(r, 'rejected')}
                  disabled={busyId === r.uid}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5" /> Reject
                </button>
                <button
                  onClick={() => decide(r, 'approved')}
                  disabled={busyId === r.uid}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
