import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Key, Languages, Cpu, CheckCircle2, ChevronRight, BookOpen, AlertCircle } from 'lucide-react';
import { Language } from '../types/crop';

interface ExplanationModalProps {
  currentLanguage: Language;
  hasApiKey: boolean;
  onClose?: () => void;
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({ currentLanguage, hasApiKey, onClose }) => {
  const [activeSection, setActiveSection] = useState<'ai' | 'safety' | 'translation' | 'setup'>('ai');

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-emerald-900 to-green-950 text-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>Technical & Agronomic Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              How Crop Doctor Works & Setup Guide
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
              Full breakdown of the multimodal vision model, agronomic safety guardrails, localization, and configuration.
            </p>
          </div>

          <div className="hidden sm:block text-right shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                hasApiKey
                  ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/30'
                  : 'bg-amber-500/30 text-amber-200 border border-amber-400/30'
              }`}
            >
              <Key className="w-3 h-3" />
              <span>{hasApiKey ? 'Live Gemini 3.8 Flash Active' : 'Demo Mode Active'}</span>
            </span>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1.5 mt-5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveSection('ai')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              activeSection === 'ai'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
            }`}
          >
            1. Multimodal AI Vision
          </button>
          <button
            onClick={() => setActiveSection('safety')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              activeSection === 'safety'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
            }`}
          >
            2. Safety & Zero-Dose Rules
          </button>
          <button
            onClick={() => setActiveSection('translation')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              activeSection === 'translation'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
            }`}
          >
            3. Chichewa & Tumbuka Review
          </button>
          <button
            onClick={() => setActiveSection('setup')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              activeSection === 'setup'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
            }`}
          >
            4. Setup & API Keys
          </button>
        </div>
      </div>

      {/* Content panel */}
      <div className="p-6 text-stone-800 space-y-6">
        {activeSection === 'ai' && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Multimodal Vision Model Architecture
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Crop Doctor uses Google's latest multimodal model (<strong>gemini-3.8-flash</strong> via the <code>@google/genai</code> TypeScript SDK on the server). It analyzes farmer photos taken with basic smartphone cameras under rural field conditions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-emerald-700 block">Strict Grounding</span>
                <h4 className="text-xs font-bold text-stone-900">Visual Evidence Only</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  The model is prompted to describe <em>strictly what it can physically see</em> in the photo (e.g. whorl frass, frog-eye brown rings, parallel yellow streaks) rather than inventing invisible symptoms.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-emerald-700 block">Differential Diagnosis</span>
                <h4 className="text-xs font-bold text-stone-900">Up to 2 Alternatives</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  In addition to the primary diagnosis, the model returns up to two differential conditions (e.g., distinguishing African Stalk Borer from Fall Armyworm) with distinguishing features.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-emerald-700 block">Confidence Scoring</span>
                <h4 className="text-xs font-bold text-stone-900">Color-Coded Tiers</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Diagnoses are calibrated into High (&gt;=80%), Medium (65–79%), and Low (&lt;65%). Any score under 70% automatically triggers human extension officer escalation.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'safety' && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Built-in Safety Checks & Agronomic Guardrails
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Smallholder farming communities in Malawi can face acute pesticide poisonings if dangerous dosages are circulated. Crop Doctor enforces hard-coded safeguards at both server and client layers:
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-emerald-950 block">1. Low-Risk Cultural Practices Always Come First:</strong>
                  <span className="text-emerald-900 leading-relaxed">
                    Scouting, hand-picking caterpillars/eggs, removing and deeply burying infected plants (rogueing), applying a pinch of clean sand or wood ash to whorls, and intercropping with legumes are prioritized before any chemical option is mentioned.
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-rose-950 block">2. Automatic Dosage Sanitizer (Zero-Dose Policy):</strong>
                  <span className="text-rose-900 leading-relaxed">
                    A multi-pattern regex engine scrubs any concentration, mixing ratio, or volume (ml/L, g/ha, spoons per knapsack) from the AI's advice. The app strictly directs farmers to registered agro-dealers (such as Farmers World, Agora, or ATC) and instructs them to follow the exact package label.
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-amber-950 block">3. Forced Extension Officer Escalation:</strong>
                  <span className="text-amber-900 leading-relaxed">
                    If AI confidence is below 70%, if the photo is blurry or unclear, or if the threat is high/critical, the app forces an alert and offers a 1-click dispatch to local Agricultural Extension Development Officers (AEDO) via EPA queues or WhatsApp.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'translation' && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-800 shrink-0 mt-0.5">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Chichewa & Tumbuka Language Localization & Review Flag
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Most smallholder farmers in Malawi speak Chichewa (central/southern) or Chitumbuka (northern). Advice is delivered in everyday agricultural terminology.
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>Human Review Notice (Flagged as requested):</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                Every Chichewa and Tumbuka diagnosis includes an explicit warning badge: <strong>"AI Translation — Review Recommended"</strong>. Before farmers rely on novel AI advice in the field, local Agricultural Extension Officers and native agricultural translators review the generated phrasing to ensure cultural and agronomic accuracy.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="font-bold text-stone-800 block mb-1">Common Chichewa Field Terms:</span>
                <ul className="text-stone-600 space-y-0.5">
                  <li>• Fall Armyworm: <em>Mbozi ya Chiwawa / Buba / Nsomba yachilendo</em></li>
                  <li>• Maize Streak: <em>Nthenda ya Mizere ya Chimanga</em></li>
                  <li>• Stalk Borer: <em>Kafadala / Mbozi ya m'tsinde</em></li>
                  <li>• Extension Officer: <em>Mlangizi wa za Ulimi (AEDO)</em></li>
                </ul>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="font-bold text-stone-800 block mb-1">Common Chitumbuka Field Terms:</span>
                <ul className="text-stone-600 space-y-0.5">
                  <li>• Fall Armyworm: <em>Nthuchi ya Chiwawa</em></li>
                  <li>• Maize: <em>Ngoma</em></li>
                  <li>• Tobacco: <em>Hona</em></li>
                  <li>• Extension Officer: <em>Mulara wa Vyaulimi</em></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'setup' && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-800 shrink-0 mt-0.5">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Setup Guide & Configuration Checklist
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Everything you need to run, test, and deploy Crop Doctor in development and production.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">1</span>
                    <span>Demo Mode (Zero Setup Required)</span>
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Ready Now
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  The application is already demo-ready out of the box! You can click any of the preloaded field cases (Fall Armyworm, Maize Streak Virus, Tobacco Frog-eye, or Unclear sample) to test the entire diagnosis and escalation flow without requiring any API keys.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">2</span>
                    <span>Live Gemini API Key (Optional for Custom Live Photos)</span>
                  </h4>
                  <span className="text-[10px] font-bold text-stone-600 bg-stone-200 px-2 py-0.5 rounded">
                    {hasApiKey ? 'Connected' : 'Optional'}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  To test with brand-new real-world photos taken directly with your smartphone camera, set the <code>GEMINI_API_KEY</code> secret in AI Studio (under <strong>Settings &gt; Secrets</strong>) or in your <code>.env</code> file:
                </p>
                <pre className="text-[11px] p-2.5 bg-stone-900 text-emerald-400 rounded-lg overflow-x-auto font-mono">
                  GEMINI_API_KEY="your-api-key-here"
                </pre>
                <p className="text-[11px] text-stone-500">
                  Calls are made securely server-side from <code>server.ts</code> using <code>gemini-3.8-flash</code>. The key is never exposed to the client browser.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">3</span>
                    <span>Mobile Access on Basic Smartphones</span>
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Responsive PWA Ready
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Open the shared URL on any Android or smartphone browser. The interface uses high contrast, large touch targets, low bandwidth SVG previews, and native camera access via HTML5 <code>capture="environment"</code>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
