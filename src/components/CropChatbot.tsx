import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Globe,
  Bot,
  User,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import { Language } from '../types/crop';
import { useAuth } from '../context/AuthContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  groundingSources?: Array<{ title: string; url: string }>;
  searchQueries?: string[];
}

interface CropChatbotProps {
  currentLanguage: Language;
}

export const CropChatbot: React.FC<CropChatbotProps> = ({ currentLanguage }) => {
  const { userRole, getAuthHeaders } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-msg',
      role: 'model',
      text:
        currentLanguage === 'ny'
          ? 'Moni! Ndine Wothandizira wanu wa za Ulimi wa Crop Doctor AI. Kodi muli ndi funso lokhudza matenda a mbeu zanu, chitetezo cha chimanga, kapena njira zachilengedwe zotetezera munda wanu ku Malawi?'
          : currentLanguage === 'tum'
          ? 'Moni! Ndine Mulara wa vya Ulimi wa Crop Doctor AI. Kasi muli na fumbo lakukhwaskana na vyomela vinu, ngoma panji hona mu Malawi?'
          : 'Hello! I am your Crop Doctor AI Agronomic Assistant. How can I assist you with your maize, tobacco, or field crop pest management today in Malawi?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon'>('gemini-3.8-flash');
  const [enableSearch, setEnableSearch] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const historyPayload = [...messages, userMsg].map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          model: selectedModel,
          enableSearch,
          language: currentLanguage,
          userRole: userRole === 'extension_officer' ? 'extension_officer' : 'farmer',
        }),
      });

      if (!res.ok) {
        throw new Error('Chat request failed');
      }

      const data = await res.json();
      const modelMsg: ChatMessage = {
        id: 'reply-' + Date.now(),
        role: 'model',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundingSources: data.groundingSources || [],
        searchQueries: data.searchQueries || [],
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: 'reply-err-' + Date.now(),
        role: 'model',
        text:
          currentLanguage === 'ny'
            ? 'Pepani, panopa sitinathe kulumikizana ndi makina. Koma kumbukirani: yambani ndi kutola mbozi ndi manja, kusalira munda, ndi kufunsa Mlangizi wa za Ulimi wa ku EPA wanu.'
            : 'I encountered a connection delay. Remember: always prioritize low-risk scouting, manual caterpillar picking, and consult your local EPA Extension Officer before applying chemicals.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    {
      label: currentLanguage === 'ny' ? 'Kutola mbozi ya chiwawa (Buba)' : 'Scouting Fall Armyworm',
      query: 'How to scout and hand-pick Fall Armyworm in smallholder maize?',
    },
    {
      label: currentLanguage === 'ny' ? 'Mbeu zotsutsana ndi matenda' : 'Maize Streak Prevention',
      query: 'What cultural practices prevent Maize Streak Virus transmission by leafhoppers?',
    },
    {
      label: currentLanguage === 'ny' ? 'Kapezedwe ka mankhwala ku Sitolo' : 'Agro-dealer Certified Products',
      query: 'What certified bio-rational options exist at licensed agro-dealers in Malawi?',
    },
    {
      label: currentLanguage === 'ny' ? 'Kusakaniza mbewu (Push-Pull)' : 'Intercropping with Legumes',
      query: 'How does intercropping maize with beans or desmodium deter pests?',
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[75vh] max-h-[750px] animate-in fade-in duration-300">
      {/* Chat Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-950 text-white flex flex-wrap items-center justify-between gap-3 border-b border-emerald-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
            <Bot className="w-5 h-5 stroke-[2.3]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white leading-tight">
                Crop Doctor AI Advisor
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Multi-Turn
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80">
              Zero-dose safety compliant agronomic guidance in {currentLanguage === 'ny' ? 'Chichewa' : currentLanguage === 'tum' ? 'Chitumbuka' : 'English'}
            </p>
          </div>
        </div>

        {/* Model switcher & Google Search toggle */}
        <div className="flex items-center gap-2 text-xs">
          {/* Model picker */}
          <select
            value={selectedModel}
            onChange={(e: any) => setSelectedModel(e.target.value)}
            className="bg-emerald-900/80 border border-emerald-700 text-emerald-100 rounded-lg px-2 py-1 text-[11px] font-semibold focus:outline-none"
            title="Select Gemini Model for task complexity"
          >
            <option value="gemini-3.8-flash">Gemini 3.8 Flash (General Tasks)</option>
            <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Fast Q&A)</option>
            <option value="gemini-4-argon">Gemini 4 Argon (Complex Reasoning)</option>
          </select>

          {/* Google Search toggle */}
          <button
            onClick={() => setEnableSearch(!enableSearch)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
              enableSearch
                ? 'bg-blue-600/90 text-white border-blue-400 shadow-xs'
                : 'bg-emerald-900/60 text-emerald-300 border-emerald-700 hover:text-white'
            }`}
            title="Toggle Google Search Grounding for live agricultural research"
          >
            <Globe className="w-3 h-3" />
            <span>Search Grounding: {enableSearch ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Messages Scrollable Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-stone-50/50">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 max-w-[85%] ${
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white border border-stone-200 text-emerald-800 shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-1.5">
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-emerald-700 text-white rounded-tr-none'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>

                  {/* Grounding Sources Badge */}
                  {m.groundingSources && m.groundingSources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-stone-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-blue-700 flex items-center gap-1 uppercase tracking-wider">
                        <Globe className="w-3 h-3" />
                        <span>Google Search Grounded References:</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.groundingSources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-md transition-colors"
                          >
                            <span className="truncate max-w-[180px]">{source.title}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`text-[10px] text-stone-400 px-1 ${
                    isUser ? 'text-right' : 'text-left'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 mr-auto text-stone-500 text-xs p-3 bg-white rounded-2xl border border-stone-200">
            <Bot className="w-4 h-4 text-emerald-600 animate-spin" />
            <span>Consulting agronomic knowledge base & checking safety guardrails...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 border-t border-stone-100 bg-white flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[10px] font-bold text-stone-500 uppercase shrink-0">Quick Topics:</span>
        {sampleQuestions.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq.query)}
            disabled={isLoading}
            className="text-[11px] font-medium text-stone-700 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 border border-stone-200 rounded-full px-2.5 py-1 whitespace-nowrap transition-colors cursor-pointer shrink-0"
          >
            {sq.label}
          </button>
        ))}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            currentLanguage === 'ny'
              ? 'Lembani funso lanu la za ulimi apa (mwachitsanzo: Kodi ndingateteze bwanji fodya ku mawanga?)...'
              : currentLanguage === 'tum'
              ? 'Lembani fumbo linu la za ulimi pano...'
              : 'Ask an agricultural question (e.g. How to manage Fall Armyworm without high chemicals?)...'
          }
          className="flex-1 text-xs sm:text-sm px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
