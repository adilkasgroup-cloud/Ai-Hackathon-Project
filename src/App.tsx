/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header, AppTab } from './components/Header';
import { PhotoUploader } from './components/PhotoUploader';
import { DiagnosisResult } from './components/DiagnosisResult';
import { EscalationModal } from './components/EscalationModal';
import { ExtensionOfficerPortal } from './components/ExtensionOfficerPortal';
import { ExplanationModal } from './components/ExplanationModal';
import { CropChatbot } from './components/CropChatbot';
import { BioscienceWorkbench } from './components/BioscienceWorkbench';
import { AuthPage } from './components/AuthPage';
import { FarmerCaseReplies } from './components/FarmerCaseReplies';
import { DiagnosisResult as DiagnosisType, EscalationTicket, Language, SamplePhotoCase } from './types/crop';
import { TRANSLATIONS } from './data/translations';
import { applySafetyRules } from './utils/safetyFilter';
import { SAMPLE_CASES } from './data/sampleCases';
import { db } from './lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Sprout, BookmarkCheck } from 'lucide-react';

function CropDoctorApp() {
  const { farmerProfile, officerProfile, userRole, authView, openAuth, closeAuth, getAuthHeaders, phonePasswordPending } = useAuth();

  // The app is English only
  const currentLanguage: Language = 'en';

  const [activeTab, setActiveTab] = useState<AppTab>('diagnose');
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<DiagnosisType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzingStep, setAnalyzingStep] = useState<number>(0);
  const [isEscalationModalOpen, setIsEscalationModalOpen] = useState<boolean>(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [currentSampleCase, setCurrentSampleCase] = useState<SamplePhotoCase | null>(null);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string>('');

  const t = TRANSLATIONS[currentLanguage];

  useEffect(() => {
    const checkConfig = async () => {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const data = await res.json();
          setHasApiKey(data.hasGeminiKey);
          if (!data.hasGeminiKey) {
            setIsDemoMode(true);
          }
        }
      } catch (err) {
        setIsDemoMode(true);
      }
    };

    checkConfig();
  }, []);

  // Officers see how many cases are waiting (the queue is officers-only on the server)
  useEffect(() => {
    if (!officerProfile) {
      setPendingCount(0);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/escalations?status=pending', { headers: await getAuthHeaders() });
        if (res.ok && !cancelled) {
          const tickets: EscalationTicket[] = await res.json();
          setPendingCount(tickets.length);
        }
      } catch {
        // ignored
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [officerProfile?.uid]);

  // After signing in or finishing sign-up, close the sign-in page and land on the right screen.
  useEffect(() => {
    if (authView && userRole !== 'guest' && !phonePasswordPending) {
      closeAuth();
      setActiveTab(userRole === 'extension_officer' ? 'extension' : 'diagnose');
    }
  }, [authView, userRole, phonePasswordPending]);

  // Ensure cases & replies view is only accessible when logged into an officer account
  useEffect(() => {
    if (activeTab === 'extension' && !officerProfile) setActiveTab('diagnose');
    if (activeTab === 'farmer_replies' && userRole === 'extension_officer') setActiveTab('diagnose');
  }, [activeTab, officerProfile, userRole]);

  // Save diagnosis to farm history if farmer profile exists
  const saveDiagnosisToHistory = async (diag: DiagnosisType) => {
    if (farmerProfile) {
      try {
        await addDoc(collection(db, 'diagnoses'), {
          userId: farmerProfile.uid,
          id: diag.id,
          farmerPhone: farmerProfile.phone,
          farmerName: farmerProfile.name,
          district: farmerProfile.district,
          cropName: diag.cropName,
          primaryDiagnosis: diag.primaryDiagnosis,
          localDiagnosisName: diag.localDiagnosisName,
          confidenceScore: diag.confidenceScore,
          severity: diag.severity,
          category: diag.category,
          language: diag.language,
          createdAt: new Date().toISOString(),
        });
        setSavedSuccessMsg('Diagnosis saved to your farm field records!');
        setTimeout(() => setSavedSuccessMsg(''), 4000);
      } catch (err) {
        console.warn('Diagnosis history save note:', err);
      }
    }
  };

  // Open diagnosis available to everyone without an account!
  const handlePhotoSelected = async (base64Image: string, cropHint?: string, farmerNotes?: string) => {
    setIsAnalyzing(true);
    setAnalyzingStep(1);
    setCurrentSampleCase(null);

    const step2Timer = setTimeout(() => setAnalyzingStep(2), 700);
    const step3Timer = setTimeout(() => setAnalyzingStep(3), 1500);

    try {
      if (isDemoMode && !hasApiKey) {
        await new Promise((r) => setTimeout(r, 1200));
        const defaultSample = SAMPLE_CASES[0];
        const res = defaultSample.precomputedResult[currentLanguage];
        const customized: DiagnosisType = {
          ...res,
          id: 'diag-upload-' + Date.now(),
          imageUrl: base64Image,
          timestamp: new Date().toISOString(),
        };
        const finalDiag = applySafetyRules(customized);
        setCurrentDiagnosis(finalDiag);
        saveDiagnosisToHistory(finalDiag);
      } else {
        const response = await fetch('/api/diagnose', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64Image,
            language: currentLanguage,
            cropHint,
            farmerNotes,
          }),
        });

        if (!response.ok) {
          throw new Error('Server diagnosis request failed');
        }

        const data: DiagnosisType = await response.json();
        const finalDiag = applySafetyRules(data);
        setCurrentDiagnosis(finalDiag);
        saveDiagnosisToHistory(finalDiag);
      }
    } catch (err) {
      console.error('Diagnosis error, falling back to safe local analysis:', err);
      const fallback = SAMPLE_CASES[0].precomputedResult[currentLanguage];
      const finalFallback = applySafetyRules({
        ...fallback,
        id: 'diag-fallback-' + Date.now(),
        imageUrl: base64Image,
        timestamp: new Date().toISOString(),
      });
      setCurrentDiagnosis(finalFallback);
      saveDiagnosisToHistory(finalFallback);
    } finally {
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      setIsAnalyzing(false);
      setAnalyzingStep(0);
    }
  };

  const handleSampleCaseSelected = (sample: SamplePhotoCase) => {
    setCurrentSampleCase(sample);
    const result = sample.precomputedResult[currentLanguage];
    const finalDiag = applySafetyRules(result);
    setCurrentDiagnosis(finalDiag);
    saveDiagnosisToHistory(finalDiag);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setCurrentDiagnosis(null);
    setCurrentSampleCase(null);
  };

  const handleEscalationSubmitted = async (ticket: EscalationTicket) => {
    setPendingCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf5] text-[#1a2e1f]">
      {/* Persistent Navigation Header with Open Access Notice & Auth */}
      <Header
        currentLanguage={currentLanguage}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasApiKey={hasApiKey}
        isDemoMode={isDemoMode}
        onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
        pendingEscalationsCount={pendingCount}
        onOpenAuth={(view) => openAuth(view || 'signin')}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 space-y-4">
        {/* Farm History Saved Notification */}
        {savedSuccessMsg && (
          <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-2xl flex items-center gap-2 animate-in fade-in">
            <BookmarkCheck className="w-4 h-4 text-emerald-700" />
            <span>{savedSuccessMsg}</span>
          </div>
        )}

        {/* Tab 1: Diagnose Crop (100% Free & Open to Anyone without an Account) */}
        {activeTab === 'diagnose' && (
          <div>
            {isAnalyzing ? (
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm text-center max-w-md mx-auto my-10 space-y-5 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center animate-bounce">
                  <Sprout className="w-9 h-9 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900">
                    {t.analyzingTitle}
                  </h3>
                  <div className="mt-3 space-y-2 text-xs font-medium text-stone-600">
                    <p className={`transition-opacity ${analyzingStep >= 1 ? 'text-emerald-700 font-bold' : 'opacity-40'}`}>
                      {analyzingStep >= 1 ? '✓ ' : '• '} {t.analyzingStep1}
                    </p>
                    <p className={`transition-opacity ${analyzingStep >= 2 ? 'text-emerald-700 font-bold' : 'opacity-40'}`}>
                      {analyzingStep >= 2 ? '✓ ' : '• '} {t.analyzingStep2}
                    </p>
                    <p className={`transition-opacity ${analyzingStep >= 3 ? 'text-emerald-700 font-bold' : 'opacity-40'}`}>
                      {analyzingStep >= 3 ? '✓ ' : '• '} {t.analyzingStep3}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full transition-all duration-500 rounded-full"
                    style={{ width: analyzingStep === 1 ? '35%' : analyzingStep === 2 ? '70%' : '95%' }}
                  ></div>
                </div>
              </div>
            ) : currentDiagnosis ? (
              <DiagnosisResult
                diagnosis={currentDiagnosis}
                currentLanguage={currentLanguage}
                onSendToOfficer={() => setIsEscalationModalOpen(true)}
                onReset={handleReset}
              />
            ) : (
              <PhotoUploader
                currentLanguage={currentLanguage}
                onPhotoSelected={handlePhotoSelected}
                onSampleCaseSelected={handleSampleCaseSelected}
                isAnalyzing={isAnalyzing}
              />
            )}
          </div>
        )}

        {/* Tab 2: Gemini Chatbot & Search Grounding */}
        {activeTab === 'chat' && (
          <CropChatbot currentLanguage={currentLanguage} />
        )}

        {/* Tab 3: Bioscience & Pathogen Genomics Workbench */}
        {activeTab === 'science' && (
          <BioscienceWorkbench currentLanguage={currentLanguage} />
        )}

        {/* Tab 4: Extension Officer Cases & Replies Queue (Officer Account Protected) */}
        {activeTab === 'extension' && (
          <ExtensionOfficerPortal
            currentLanguage={currentLanguage}
            onSelectCaseToView={(diag) => {
              setCurrentDiagnosis(diag);
              setActiveTab('diagnose');
            }}
          />
        )}

        {/* Farmer: replies to the cases they sent to an officer */}
        {activeTab === 'farmer_replies' && (
          <FarmerCaseReplies currentLanguage={currentLanguage} onNavigateToDiagnose={() => setActiveTab('diagnose')} />
        )}

        {/* Tab 6: How It Works & Architecture Guide */}
        {activeTab === 'explainer' && (
          <ExplanationModal
            currentLanguage={currentLanguage}
            hasApiKey={hasApiKey}
            onClose={() => setActiveTab('diagnose')}
          />
        )}
      </main>

      {/* Escalation Modal Dialog (Lightweight sign-up + Consent line) */}
      {currentDiagnosis && (
        <EscalationModal
          isOpen={isEscalationModalOpen}
          onClose={() => setIsEscalationModalOpen(false)}
          diagnosis={currentDiagnosis}
          currentLanguage={currentLanguage}
          onSubmitted={handleEscalationSubmitted}
        />
      )}

      {/* Sign in / Sign up page (shown on top of the app when requested) */}
      {authView && <AuthPage currentLanguage={currentLanguage} onClose={closeAuth} />}

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200/80 bg-white py-6 text-stone-500 text-xs">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-stone-700">Crop Doctor Malawi</span>
            <span>•</span>
            <span>Free photo diagnosis for all smallholders</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-stone-500">
            <button
              onClick={() => setActiveTab('chat')}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              AI Chat
            </button>
            {officerProfile && (
              <>
                <span>•</span>
                <button
                  onClick={() => setActiveTab('extension')}
                  className="hover:text-emerald-700 font-semibold text-emerald-800 transition-colors cursor-pointer"
                >
                  Cases & Replies ({pendingCount})
                </button>
              </>
            )}
            <span>•</span>
            <button
              onClick={() => setActiveTab('science')}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Bioscience
            </button>
            <span>•</span>
            {!farmerProfile && !officerProfile && (
              <button
                onClick={() => openAuth('signin')}
                className="hover:text-emerald-700 transition-colors cursor-pointer font-semibold text-emerald-800"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CropDoctorApp />
    </AuthProvider>
  );
}
