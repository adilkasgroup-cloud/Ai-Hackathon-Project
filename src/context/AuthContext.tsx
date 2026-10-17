import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as fbSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, onSnapshot, writeBatch } from 'firebase/firestore';
import { auth, db, googleProvider, testConnection } from '../lib/firebase';

/**
 * How access works
 * ----------------
 * - Identity: Firebase Auth (Google).
 * - Role: stored on users/{uid}.role in Firestore. It is set to 'farmer' at sign-up and
 *   CANNOT be changed by the user (see firestore.rules). Only an admin can promote a user
 *   to 'extension_officer', and 'admin' is set by hand in the Firebase console.
 * - There is no role switcher: whatever the server says your role is, that is what you get.
 */

export type AppRole = 'farmer' | 'extension_officer' | 'admin';
export type UserRole = 'guest' | AppRole;

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  district: string;
  epa: string;
  role: AppRole;
  consentGiven: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OfficerRequest {
  uid: string;
  status: 'pending' | 'approved' | 'rejected';
  displayName: string;
  email: string;
  phone: string;
  district: string;
  epa: string;
  requestedAt: string;
}

// Views kept for the components that read these shapes
export interface FarmerProfile {
  uid: string;
  name: string;
  phone: string;
  district: string;
  epa?: string;
  consentGiven: boolean;
  createdAt: string;
}

export interface OfficerProfile {
  uid: string;
  name: string;
  district: string;
  epa: string;
  role: 'extension_officer';
}

export interface NewAccountInput {
  /** 'extension_officer' creates a normal account PLUS a request an admin must approve. */
  requestedRole: 'farmer' | 'extension_officer';
  name: string;
  phone: string;
  district: string;
  epa: string;
  consentGiven: boolean;
}

export type AuthView = 'signin' | 'signup' | null;

interface AuthContextType {
  firebaseUser: User | null;
  profile: UserProfile | null;
  farmerProfile: FarmerProfile | null;
  officerProfile: OfficerProfile | null;
  officerRequest: OfficerRequest | null;
  userRole: UserRole;
  /** Signed in with Google but has not finished creating their account yet */
  needsOnboarding: boolean;
  loading: boolean;

  signInWithGoogle: () => Promise<void>;
  /** Email + password: create the login (the profile form comes next) */
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  createAccount: (input: NewAccountInput) => Promise<void>;
  signOut: () => Promise<void>;
  /** Authorization header for calls to our own /api routes */
  getAuthHeaders: () => Promise<Record<string, string>>;

  authView: AuthView;
  openAuth: (view?: 'signin' | 'signup') => void;
  closeAuth: () => void;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  profile: null,
  farmerProfile: null,
  officerProfile: null,
  officerRequest: null,
  userRole: 'guest',
  needsOnboarding: false,
  loading: true,
  signInWithGoogle: async () => {},
  signUpWithEmail: async () => {},
  signInWithEmail: async () => {},
  sendPasswordReset: async () => {},
  createAccount: async () => {},
  signOut: async () => {},
  getAuthHeaders: async () => ({}),
  authView: null,
  openAuth: () => {},
  closeAuth: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileReady, setProfileReady] = useState(false);
  const [officerRequest, setOfficerRequest] = useState<OfficerRequest | null>(null);
  const [authView, setAuthView] = useState<AuthView>(null);

  // 1. Who is signed in?
  useEffect(() => {
    testConnection();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setFirebaseUser(u);
      setAuthReady(true);
      if (!u) {
        setProfile(null);
        setOfficerRequest(null);
        setProfileReady(true);
      } else {
        setProfileReady(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. What is their role? Live from Firestore, so approvals and removals apply immediately.
  const uid = firebaseUser?.uid;
  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(
      doc(db, 'users', uid),
      (snap) => {
        setProfile(snap.exists() ? (snap.data() as UserProfile) : null);
        setProfileReady(true);
      },
      (err) => {
        console.warn('Could not load profile:', err);
        setProfile(null);
        setProfileReady(true);
      }
    );
    return () => unsub();
  }, [uid]);

  // 3. Any pending request to become an extension officer?
  const role = profile?.role;
  useEffect(() => {
    if (!uid || role !== 'farmer') {
      setOfficerRequest(null);
      return;
    }
    const unsub = onSnapshot(
      doc(db, 'officerRequests', uid),
      (snap) => setOfficerRequest(snap.exists() ? (snap.data() as OfficerRequest) : null),
      () => setOfficerRequest(null)
    );
    return () => unsub();
  }, [uid, role]);

  const userRole: UserRole = profile?.role ?? 'guest';

  const farmerProfile = useMemo<FarmerProfile | null>(
    () =>
      profile && profile.role === 'farmer'
        ? {
            uid: profile.uid,
            name: profile.displayName,
            phone: profile.phone,
            district: profile.district,
            epa: profile.epa,
            consentGiven: profile.consentGiven,
            createdAt: profile.createdAt,
          }
        : null,
    [profile]
  );

  const officerProfile = useMemo<OfficerProfile | null>(
    () =>
      profile && profile.role === 'extension_officer'
        ? {
            uid: profile.uid,
            name: profile.displayName,
            district: profile.district,
            epa: profile.epa,
            role: 'extension_officer',
          }
        : null,
    [profile]
  );

  const loading = !authReady || !profileReady;
  const needsOnboarding = !loading && !!firebaseUser && !profile;

  const signInWithGoogle = useCallback(async () => {
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      // Some phone browsers block popups: fall back to a full-page redirect
      if (err?.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        return; // user changed their mind, not an error
      }
      throw err;
    }
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  }, []);

  const createAccount = useCallback(
    async (input: NewAccountInput) => {
      const user = auth.currentUser;
      if (!user) throw new Error('Please sign in with Google first.');
      const now = new Date().toISOString();
      const name = input.name.trim();
      const phone = input.phone.trim();
      const district = input.district.trim();
      const epa = input.epa.trim();

      const batch = writeBatch(db);

      // Everyone starts as a farmer. The rules reject any other role here.
      batch.set(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email || '',
        displayName: name,
        phone,
        district,
        epa,
        role: 'farmer',
        consentGiven: input.consentGiven,
        createdAt: now,
        updatedAt: now,
      });

      // Officers also file a request that an admin must approve
      if (input.requestedRole === 'extension_officer') {
        batch.set(doc(db, 'officerRequests', user.uid), {
          uid: user.uid,
          status: 'pending',
          displayName: name,
          email: user.email || '',
          phone,
          district,
          epa,
          requestedAt: now,
        });
      }

      await batch.commit();
      // onSnapshot picks up the new profile on its own
    },
    []
  );

  const signOut = useCallback(async () => {
    await fbSignOut(auth);
  }, []);

  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const token = await auth.currentUser?.getIdToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const openAuth = useCallback((view: 'signin' | 'signup' = 'signin') => setAuthView(view), []);
  const closeAuth = useCallback(() => setAuthView(null), []);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        profile,
        farmerProfile,
        officerProfile,
        officerRequest,
        userRole,
        needsOnboarding,
        loading,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        sendPasswordReset,
        createAccount,
        signOut,
        getAuthHeaders,
        authView,
        openAuth,
        closeAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
