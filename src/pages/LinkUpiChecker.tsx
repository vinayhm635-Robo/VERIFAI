import React, { useState } from 'react';
import {
  Link2,
  Phone,
  CreditCard,
  AlertTriangle,
  ShieldCheck,
  Search,
  ExternalLink,
  Sparkles,
  Info
} from 'lucide-react';
import { UniversalVerdictCard } from '../components/UniversalVerdictCard';
import { AnalysisResult } from '../types';
import { Language } from '../i18n/translations';

interface LinkUpiCheckerProps {
  onAnalyze: (text: string, category: 'link_upi', additionalData: Record<string, any>) => Promise<AnalysisResult>;
  onAskAssistant: (result: AnalysisResult, prompt: string) => void;
  lang: Language;
}

export const LinkUpiChecker: React.FC<LinkUpiCheckerProps> = ({
  onAnalyze,
  onAskAssistant,
  lang,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [inputType, setInputType] = useState<'all' | 'url' | 'phone' | 'upi'>('all');
  const [contextNote, setContextNote] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setIsAnalyzing(true);
    try {
      const fullQuery = `${identifier} ${contextNote}`.trim();
      const res = await onAnalyze(fullQuery, 'link_upi', {
        identifier,
        inputType,
      });
      setResult(res);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSample = (val: string, note: string) => {
    setIdentifier(val);
    setContextNote(note);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold">
          <Link2 className="w-3.5 h-3.5" />
          <span>Phishing, Shortened URLs &amp; UPI VPA Inspection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white">
          Link, Phone Number &amp; UPI Checker
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Inspect suspicious payment requests, APK download links, electricity bill SMS alerts, and lookalike domains. Check for known scam reports logged across Indian telecommunications.
        </p>
      </div>

      {/* UPI Safety Notice */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Important Verification Notice:</strong> For UPI IDs and phone numbers, Verifai evaluates formatting, domain lookalikes, reported fraud patterns, and known threat databases. <strong>Automated checks cannot reveal personal account identities.</strong> You never need to enter your UPI PIN to receive money.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
        {/* Sample Loaders */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
          <span className="font-semibold text-slate-500">Quick Test Samples:</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => loadSample('http://tatamotors-jobs.site/verify-offer', 'SMS claiming appointment letter download via .site domain')}
              className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50 hover:bg-red-100 transition"
            >
              Lookalike Domain (.site)
            </button>
            <button
              type="button"
              onClick={() => loadSample('fastrefund@okhdfc', 'Requested ₹1 to verify refund, promised ₹5,000 credit')}
              className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 hover:bg-amber-100 transition"
            >
              UPI VPA Phishing
            </button>
            <button
              type="button"
              onClick={() => loadSample('https://bit.ly/update-bijli-bill-now', 'SMS claiming electricity will be cut off tonight at 9:30 PM')}
              className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50 hover:bg-purple-100 transition"
            >
              Shortened Electricity SMS
            </button>
          </div>
        </div>

        {/* Input Field */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Enter URL, Phone Number or UPI ID
          </label>
          <div className="relative">
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. https://careers-tcs.online, +91 98765 43210, or payment@okhdfc"
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 font-mono"
            />
          </div>
        </div>

        {/* Context Note */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Additional Context or Accompanying Message (Optional)
          </label>
          <textarea
            rows={3}
            value={contextNote}
            onChange={(e) => setContextNote(e.target.value)}
            placeholder="What did the sender say when they sent you this link or UPI ID?"
            className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isAnalyzing || !identifier.trim()}
            className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isAnalyzing ? 'Inspecting Link & VPA...' : 'Scan Link / Phone / UPI'}</span>
          </button>
        </div>
      </form>

      {/* Result Display */}
      {result && (
        <UniversalVerdictCard
          result={result}
          onAskAssistant={onAskAssistant}
          lang={lang}
        />
      )}

      {/* Sanchar Saathi & Chakshu Direct Portal Link */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
          Department of Telecommunications (DoT) Chakshu Facility
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Received a fraudulent SMS, WhatsApp call, or SIM block threat? Report it directly to the Government of India Chakshu portal to help authorities disconnect and blacklist fraudulent telecom resources.
        </p>
        <a
          href="https://sancharsaathi.gov.in/sfc/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline"
        >
          <span>Open Sanchar Saathi Chakshu Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
