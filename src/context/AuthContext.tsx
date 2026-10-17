import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, testConnection } from '../lib/firebase';

export interface FarmerProfile {
  name: string;
  phone: string;
  district: string;
  epa?: string;
  consentGiven: boolean;
  createdAt: string;
}

export interface OfficerProfile {
  name: string;
  district: string;
  epa: string;
  role: 'extension_officer';
  authenticatedAt: string;
}

interface AuthContextType {
  // Access state
  farmerProfile: FarmerProfile | null;
  officerProfile: OfficerProfile | null;
  userRole: 'guest' | 'farmer' | 'extension_officer';
  firebaseUser: User | null;
  loading: boolean;

  // Actions
  registerFarmer: (name: string, phone: string, district: string, epa?: string, consentGiven?: boolean) => Promise<FarmerProfile>;
  loginOfficerWithPin: (pin: string, name: string, district: string, epa: string) => Promise<boolean>;
  logoutFarmer: () => void;
  logoutOfficer: () => void;
  logoutAll: () => void;

  // Modals & UI triggers
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalInitialTab: 'farmer' | 'officer';
  openAuthModal: (tab?: 'farmer' | 'officer') => void;
}

const AuthContext = createContext<AuthContextType>({
  farmerProfile: null,
  officerProfile: null,
  userRole: 'guest',
  firebaseUser: null,
  loading: true,
  registerFarmer: async () => ({} as FarmerProfile),
  loginOfficerWithPin: async () => false,
  logoutFarmer: () => {},
  logoutOfficer: () => {},
  logoutAll: () => {},
  isAuthModalOpen: false,
  setIsAuthModalOpen: () => {},
  authModalInitialTab: 'farmer',
  openAuthModal: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'farmer' | 'officer'>('farmer');

  // Lightweight farmer profile (no password needed)
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(() => {
    try {
      const saved = localStorage.getItem('crop_doctor_farmer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Officer profile (PIN authenticated)
  const [officerProfile, setOfficerProfile] = useState<OfficerProfile | null>(() => {
    try {
      const saved = sessionStorage.getItem('crop_doctor_officer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setFirebaseUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Determine current active role
  const userRole: 'guest' | 'farmer' | 'extension_officer' = officerProfile
    ? 'extension_officer'
    : farmerProfile
    ? 'farmer'
    : 'guest';

  // Lightweight Farmer Sign-up (Name, Phone, District, Consent - NO PASSWORD)
  const registerFarmer = async (
    name: string,
    phone: string,
    district: string,
    epa?: string,
    consentGiven: boolean = true
  ): Promise<FarmerProfile> => {
    const profile: FarmerProfile = {
      name: name.trim(),
      phone: phone.trim(),
      district: district.trim(),
      epa: epa ? epa.trim() : 'Local EPA',
      consentGiven,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('crop_doctor_farmer', JSON.stringify(profile));
    setFarmerProfile(profile);

    // Save to Firestore if available
    try {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      if (cleanPhone) {
        await setDoc(doc(db, 'users', `farmer_${cleanPhone}`), {
          uid: `farmer_${cleanPhone}`,
          displayName: name,
          phone,
          district,
          epa: epa || '',
          role: 'farmer',
          consentGiven,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn('Firestore optional sync note:', e);
    }

    return profile;
  };

  // Extension Officer PIN-based Login
  const loginOfficerWithPin = async (
    pin: string,
    name: string,
    district: string,
    epa: string
  ): Promise<boolean> => {
    try {
      const res = await fetch('/api/officer/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, officerName: name, district, epa }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Invalid PIN');
      }

      const data = await res.json();
      const profile: OfficerProfile = {
        name: data.officer.name,
        district: data.officer.district,
        epa: data.officer.epa,
        role: 'extension_officer',
        authenticatedAt: data.officer.authenticatedAt,
      };

      sessionStorage.setItem('crop_doctor_officer', JSON.stringify(profile));
      setOfficerProfile(profile);
      return true;
    } catch (err: any) {
      throw err;
    }
  };

  const logoutFarmer = () => {
    localStorage.removeItem('crop_doctor_farmer');
    setFarmerProfile(null);
  };

  const logoutOfficer = () => {
    sessionStorage.removeItem('crop_doctor_officer');
    setOfficerProfile(null);
  };

  const logoutAll = async () => {
    logoutFarmer();
    logoutOfficer();
    try {
      await fbSignOut(auth);
    } catch {}
  };

  const openAuthModal = (tab: 'farmer' | 'officer' = 'farmer') => {
    setAuthModalInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        farmerProfile,
        officerProfile,
        userRole,
        firebaseUser,
        loading,
        registerFarmer,
        loginOfficerWithPin,
        logoutFarmer,
        logoutOfficer,
        logoutAll,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalInitialTab,
        openAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
