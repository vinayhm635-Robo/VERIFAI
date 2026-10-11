import React, { useState } from 'react';
import {
  Award,
  AlertTriangle,
  Building,
  GraduationCap,
  ExternalLink,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { UniversalVerdictCard } from '../components/UniversalVerdictCard';
import { AnalysisResult } from '../types';
import { Language } from '../i18n/translations';

interface ExamAdmissionCheckerProps {
  onAnalyze: (text: string, category: 'exam_admission', additionalData: Record<string, any>) => Promise<AnalysisResult>;
  onAskAssistant: (result: AnalysisResult, prompt: string) => void;
  lang: Language;
}

export const ExamAdmissionChecker: React.FC<ExamAdmissionCheckerProps> = ({
  onAnalyze,
  onAskAssistant,
  lang,
}) => {
  const [inputText, setInputText] = useState(
    'Telegram seller @NEET_Question_Paper_2026 claims to have leaked NEET UG question papers with 100% answer keys available 12 hours before examination. Demands ₹25,000 via UPI (advance token ₹5,000) for private Telegram group access.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await onAnalyze(inputText, 'exam_admission', {});
      setResult(res);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>Paper Leak &amp; College Admission Quota Scrutiny</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white">
          Exam, Scholarship &amp; Admission Fraud Checker
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Detect fraudulent paper leak peddlers on Telegram, fake scholarship registration charges, lookalike university portals, and &quot;management quota&quot; cash traps.
        </p>
      </div>

      {/* Critical Legal Warning */}
      <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs text-red-900 dark:text-red-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Public Examinations (Prevention of Unfair Means) Act:</strong> Buying, distributing, or selling leaked question papers is a non-bailable criminal offense punishable with up to 10 years imprisonment. 100% of online paper leak offers are financial scams that rob students of their money.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Paste Advertisement, Telegram Link, Scholarship Offer or Admission Letter
          </label>
          <textarea
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 font-mono leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-500">
            Cross-checks against National Testing Agency (NTA) &amp; state counseling portals.
          </span>
          <button
            type="submit"
            disabled={isAnalyzing || !inputText.trim()}
            className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isAnalyzing ? 'Inspecting Offer...' : 'Verify Academic Offer'}</span>
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
    </div>
  );
};
