import React, { useState } from 'react';
import {
  GraduationCap,
  AlertTriangle,
  Building,
  CheckCircle2,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { UniversalVerdictCard } from '../components/UniversalVerdictCard';
import { AnalysisResult } from '../types';
import { Language } from '../i18n/translations';

interface InternshipCheckerProps {
  onAnalyze: (text: string, category: 'internship', additionalData: Record<string, any>) => Promise<AnalysisResult>;
  onAskAssistant: (result: AnalysisResult, prompt: string) => void;
  lang: Language;
}

export const InternshipChecker: React.FC<InternshipCheckerProps> = ({
  onAnalyze,
  onAskAssistant,
  lang,
}) => {
  const [inputText, setInputText] = useState(
    'Congratulations! Selected for Web Development Virtual Internship at TechSkill Labs. Stipend: ₹15,000/month upon completion. To reserve your mentor slot and receive your official offer letter kit, pay a one-time onboarding fee of ₹1,999 on UPI.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await onAnalyze(inputText, 'internship', {});
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
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Pay-to-Intern Traps &amp; Fake Certificate Schemes</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white">
          Internship &amp; Certificate-Offer Checker
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Distinguish legitimate internships from paid training courses disguised as jobs. Uncover instant certificate mills, missing mentors, and deceptive placement guarantees.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Internship Offer Letter, Email or Advertisement Text
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
            Rule of thumb: Legitimate employers pay interns; they never charge interns to work.
          </span>
          <button
            type="submit"
            disabled={isAnalyzing || !inputText.trim()}
            className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isAnalyzing ? 'Analyzing Offer...' : 'Verify Internship'}</span>
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
