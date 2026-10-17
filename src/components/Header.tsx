import React, { useState } from 'react';
import { Language } from '../types/crop';
import { TRANSLATIONS } from '../data/translations';
import { Sprout, UserCheck, HelpCircle, Sparkles, MessageSquare, Dna, Lock, User, FileText, Inbox, LogOut, ShieldCheck, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type AppTab = 'diagnose' | 'chat' | 'farmer_replies' | 'science' | 'extension' | 'admin' | 'explainer';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  hasApiKey: boolean;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  pendingEscalationsCount: number;
  onOpenAuth: (view?: 'signin' | 'signup') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  activeTab,
  onTabChange,
  hasApiKey,
  isDemoMode,
  onToggleDemoMode,
  pendingEscalationsCount,
  onOpenAuth,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const { profile, farmerProfile, officerProfile, userRole, needsOnboarding, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const firstName = (profile?.displayName || '').split(' ')[0] || 'Account';
  const roleLabel = userRole === 'extension_officer' ? 'Extension Officer' : userRole === 'admin' ? 'Administrator' : 'Farmer';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
      {/* Top micro-bar: Free open access notice + Auth status + Language */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden sm:inline">Crop Doctor Malawi • Open Photo Diagnosis (No Account Required)</span>
            <span className="sm:hidden">Open Photo Diagnosis</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Account: Sign in / Sign up for guests, account menu for signed-in users */}
            {loading ? null : profile ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-700/60 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {userRole === 'extension_officer' ? (
                    <Lock className="w-3 h-3 text-emerald-400" />
                  ) : userRole === 'admin' ? (
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <User className="w-3 h-3 text-emerald-400" />
                  )}
                  <span>{firstName}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-1.5 w-56 z-50 bg-white text-stone-800 rounded-xl border border-stone-200 shadow-lg p-3 space-y-2">
                      <div>
                        <p className="text-sm font-bold text-stone-900 truncate">{profile.displayName}</p>
                        <p className="text-[11px] text-stone-500 truncate">{profile.email}</p>
                        <p className="text-[11px] text-stone-500 mt-0.5">{profile.district} District</p>
                        <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {roleLabel}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : needsOnboarding ? (
              <button
                onClick={() => onOpenAuth('signup')}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-amber-950 border border-amber-500 text-xs font-bold transition-colors cursor-pointer"
              >
                <User className="w-3 h-3" />
                <span>Finish sign-up</span>
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="px-2.5 py-0.5 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Sign in
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-2.5 py-0.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white border border-emerald-400 text-xs font-bold transition-colors cursor-pointer"
                >
                  Sign up
                </button>
              </div>
            )}

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-emerald-950/70 p-0.5 rounded-lg border border-emerald-700/60 shrink-0">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 text-xs font-semibold rounded transition-all ${
                  currentLanguage === 'en'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('ny')}
                className={`px-2 py-0.5 text-xs font-semibold rounded transition-all ${
                  currentLanguage === 'ny'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="Chichewa"
              >
                Chichewa
              </button>
              <button
                onClick={() => onLanguageChange('tum')}
                className={`px-2 py-0.5 text-xs font-semibold rounded transition-all ${
                  currentLanguage === 'tum'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="Chitumbuka"
              >
                Tumbuka
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main branding & navigation bar */}
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo & title */}
          <div
            onClick={() => onTabChange('diagnose')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform shrink-0">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-emerald-950 leading-none">
                  {t.appTitle}
                </h1>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleDemoMode();
                  }}
                  className={`cursor-pointer inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                    isDemoMode
                      ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                      : hasApiKey
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  }`}
                  title="Click to toggle Demo mode vs Live API"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  {isDemoMode ? 'Demo Mode' : hasApiKey ? 'Gemini 3.8 Live' : 'Demo Ready'}
                </span>
              </div>
              <p className="text-xs text-stone-600 hidden sm:block mt-0.5">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {/* Free Diagnosis Tab */}
            <button
              onClick={() => onTabChange('diagnose')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors shrink-0 cursor-pointer ${
                activeTab === 'diagnose'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Sprout className="w-4 h-4 text-emerald-700" />
              <span>{t.diagnoseTab}</span>
            </button>

            {/* AI Chatbot & Search Grounding Tab */}
            <button
              onClick={() => onTabChange('chat')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors shrink-0 cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span>AI Chat & Search</span>
            </button>

            {/* Farmer Case Replies Tab (farmers and visitors only; officers have their own queue) */}
            {userRole !== 'extension_officer' && userRole !== 'admin' && (
              <button
                onClick={() => {
                  if (!farmerProfile) {
                    onOpenAuth('signin');
                  } else {
                    onTabChange('farmer_replies');
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'farmer_replies'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
                title="View extension officer replies and guidance on your submitted crop cases"
              >
                <Inbox className="w-4 h-4 text-emerald-700" />
                <span>My Case Replies</span>
              </button>
            )}

            {/* Bioscience Pathogen Genomics Tab */}
            <button
              onClick={() => onTabChange('science')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors shrink-0 cursor-pointer ${
                activeTab === 'science'
                  ? 'bg-teal-100 text-teal-900 border border-teal-300'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Dna className="w-4 h-4 text-teal-700" />
              <span>Bioscience</span>
            </button>

            {/* Officer Cases & Replies Queue - STRICTLY VISIBLE ONLY WHEN LOGGED INTO AN OFFICER ACCOUNT */}
            {officerProfile && (
              <button
                onClick={() => onTabChange('extension')}
                className={`relative flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'extension'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
                title="Cases and replies queue for extension officers"
              >
                <UserCheck className="w-4 h-4 text-emerald-700" />
                <span>Cases & Replies</span>
                {pendingEscalationsCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-4.5 h-4.5 text-[10px] font-bold text-white bg-rose-600 rounded-full px-1">
                    {pendingEscalationsCount}
                  </span>
                )}
              </button>
            )}

            {/* Admin: approve extension officers (admins only) */}
            {userRole === 'admin' && (
              <button
                onClick={() => onTabChange('admin')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-blue-100 text-blue-900 border border-blue-300'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>Approvals</span>
              </button>
            )}

            {/* Explainer Tab */}
            <button
              onClick={() => onTabChange('explainer')}
              className={`flex items-center gap-1 px-2.5 py-2 text-xs font-semibold rounded-xl transition-colors shrink-0 cursor-pointer ${
                activeTab === 'explainer'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
              title="How the AI diagnosis & setup works"
            >
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              <span className="hidden lg:inline">{t.howItWorksTab}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
