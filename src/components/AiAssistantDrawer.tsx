import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  FileText,
  ShieldAlert,
  MessageSquare,
  Languages,
  Maximize2,
  Minimize2,
  ChevronRight
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { speakText, stopSpeaking, isSpeechSupported, createSpeechRecognizer, isSpeechRecognitionSupported } from '../utils/speech';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AiAssistantDrawerProps {
  currentResult: AnalysisResult | null;
  isOpen: boolean;
  onToggle: () => void;
  lang?: 'en' | 'hi';
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  currentResult,
  isOpen,
  onToggle,
  lang = 'en'
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: lang === 'hi'
        ? 'नमस्ते! मैं वेरीफाई (Verifai) एआई सुरक्षा सहायक हूँ। किसी भी नौकरी, मैसेज या पेमेंट लिंक के बारे में पूछें।'
        : 'Hello! I am your Verifai safety assistant. Ask me to verify an offer, draft a safe response, or explain red flags.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // When a new result comes in, provide contextual prompt
  useEffect(() => {
    if (currentResult) {
      setMessages((prev) => [
        ...prev,
        {
          id: `res_${Date.now()}`,
          sender: 'assistant',
          text: lang === 'hi'
            ? `मैंने "${currentResult.title}" की जांच की है (जोखिम स्कोर: ${currentResult.riskScore}/100)। क्या आप सुरक्षित उत्तर का ड्राफ्ट चाहते हैं या शिकायत दर्ज करना चाहते हैं?`
            : `I have the context for your "${currentResult.title}" scan (Risk Score: ${currentResult.riskScore}/100 - ${currentResult.verdictLabel}). Would you like me to explain the red flags or draft a safe inquiry?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [currentResult, lang]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text
          })),
          context: currentResult
            ? {
                title: currentResult.title,
                category: currentResult.category,
                riskScore: currentResult.riskScore,
                verdict: currentResult.verdictLabel,
                evidence: currentResult.evidenceFound
              }
            : null
        })
      });

      const data = await response.json();
      const assistantReply = data.reply || 'Please proceed with caution and verify via official portals.';

      setMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          sender: 'assistant',
          text: assistantReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      // Offline fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `a_err_${Date.now()}`,
          sender: 'assistant',
          text: lang === 'hi'
            ? 'क्षमा करें, कनेक्शन में रुकावट है। कृपया 1930 पर कॉल करें या आधिकारिक पोर्टल पर जांचें।'
            : 'Remember: Never pay upfront registration fees for jobs or internships. For urgent cyber fraud, call 1930.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (actionType: string) => {
    switch (actionType) {
      case 'reply':
        handleSendMessage('Please draft a polite and safe reply asking the recruiter to verify their company domain and official registration number.');
        break;
      case 'complaint':
        handleSendMessage('How do I submit an official cybercrime report on cybercrime.gov.in or call 1930 for this incident?');
        break;
      case 'hindi':
        handleSendMessage('कृपया इस परिणाम को आसान हिंदी में समझाइए।');
        break;
      case 'simple':
        handleSendMessage('Explain the main warning signs in simple plain words as if explaining to a beginner.');
        break;
      default:
        break;
    }
  };

  const handleVoiceInput = () => {
    if (!isSpeechRecognitionSupported()) {
      alert('Speech input is not supported in this browser. Please type.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    createSpeechRecognizer(
      lang,
      (transcript) => {
        setInputValue(transcript);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );
  };

  const handleReadLastMessage = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    const lastAssistantMsg = [...messages].reverse().find((m) => m.sender === 'assistant');
    if (lastAssistantMsg) {
      setIsPlayingAudio(true);
      speakText(lastAssistantMsg.text, lang, () => setIsPlayingAudio(false));
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white shadow-xl shadow-teal-700/30 ring-2 ring-teal-500/30 transition-all hover:scale-105 group font-medium text-xs sm:text-sm"
          aria-label="Open AI Safety Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="font-semibold">AI Assistant</span>
        </button>
      )}

      {/* Floating Panel / Drawer */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 z-50 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
            isExpanded
              ? 'w-[95vw] sm:w-[540px] h-[85vh] max-h-[750px]'
              : 'w-[95vw] sm:w-[400px] h-[550px]'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-teal-800 to-teal-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm leading-tight flex items-center gap-1.5">
                  Verifai Assistant
                  <span className="text-[10px] bg-teal-700/80 px-1.5 py-0.5 rounded text-teal-200 font-mono">
                    24/7 AI
                  </span>
                </h4>
                <p className="text-[10px] text-teal-200">
                  {currentResult ? `Context: ${currentResult.category}` : 'Digital Scam Guidance'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-teal-200">
              {isSpeechSupported() && (
                <button
                  type="button"
                  onClick={handleReadLastMessage}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition"
                  title="Listen to latest response"
                >
                  {isPlayingAudio ? <VolumeX className="w-4 h-4 text-amber-300" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition"
                title="Expand / Collapse"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={onToggle}
                className="p-1.5 rounded-lg hover:bg-white/10 transition"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Chips */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            <button
              onClick={() => handleQuickAction('reply')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-600 shrink-0 font-medium transition"
            >
              <MessageSquare className="w-3 h-3 text-teal-600" />
              <span>Safe Reply</span>
            </button>
            <button
              onClick={() => handleQuickAction('complaint')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-600 shrink-0 font-medium transition"
            >
              <ShieldAlert className="w-3 h-3 text-red-600" />
              <span>1930 Guide</span>
            </button>
            <button
              onClick={() => handleQuickAction('hindi')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-600 shrink-0 font-medium transition"
            >
              <Languages className="w-3 h-3 text-teal-600" />
              <span>हिंदी में</span>
            </button>
            <button
              onClick={() => handleQuickAction('simple')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-600 shrink-0 font-medium transition"
            >
              <FileText className="w-3 h-3 text-teal-600" />
              <span>Simple Terms</span>
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-teal-700 text-white rounded-tr-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs border border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 px-1">{m.timestamp}</span>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
                <span>Checking scam database &amp; analyzing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2.5 rounded-xl border transition ${
                isRecording
                  ? 'bg-red-500 text-white border-red-500 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
              title="Speak voice input"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={lang === 'hi' ? 'सवाल पूछें या मैसेज पेस्ट करें...' : 'Ask a question or paste message...'}
              className="flex-1 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />

            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputValue.trim()}
              className="p-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white transition shadow-sm"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
