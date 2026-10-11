import React, { useState } from 'react';
import {
  BookOpenCheck,
  Building,
  AlertTriangle,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { UniversalVerdictCard } from '../components/UniversalVerdictCard';
import { AnalysisResult } from '../types';
import { Language } from '../i18n/translations';

interface CoachingCheckerProps {
  onAnalyze: (text: string, category: 'coaching', additionalData: Record<string, any>) => Promise<AnalysisResult>;
  onAskAssistant: (result: AnalysisResult, prompt: string) => void;
  lang: Language;
}

export const CoachingChecker: React.FC<CoachingCheckerProps> = ({
  onAnalyze,
  onAskAssistant,
  lang,
}) => {
  const [instituteName, setInstituteName] = useState('');
  const [courseName, setCourseName] = useState('UPSC Civil Services Foundation');
  const [feesAmount, setFeesAmount] = useState('₹1,45,000');
  const [claimText, setClaimText] = useState(
    'Top IAS Academy in Delhi advertises: "100% Guaranteed Selection in UPSC Prelims or Full Refund. Top 10 rankers studied here." However, enrollment terms state fees are non-refundable under all circumstances and no batch timings are confirmed in writing.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copiedDraft, setCopiedDraft] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimText.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await onAnalyze(claimText, 'coaching', {
        instituteName,
        courseName,
        feesAmount,
      });
      setResult(res);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyText = (txt: string, label: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedDraft(label);
    setTimeout(() => setCopiedDraft(null), 2000);
  };

  const refundNoticeDraft = `To: The Director / Management, ${instituteName || '[Institute Name]'}\nSubject: Formal Request for Full Fee Refund under Consumer Protection Act (CCPA Guidelines)\n\nDear Sir/Madam,\n\nI enrolled in the ${courseName} based on your prominent advertisements guaranteeing selection and unconditional refund terms. However, your contradictory non-refundable clause violates the Central Consumer Protection Authority (CCPA) Guidelines for Prevention and Regulation of Misleading Advertisements, 2022.\n\nI hereby request an immediate refund of Rs. ${feesAmount} paid towards enrollment. Failing prompt resolution within 7 working days, I shall file a statutory grievance before the National Consumer Helpline (NCH Docket) and District Consumer Disputes Redressal Commission.\n\nSincerely,\nConsumer / Student`;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold">
          <BookOpenCheck className="w-3.5 h-3.5" />
          <span>CCPA Consumer Protection &amp; Ed-Tech Scrutiny</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white">
          Coaching &amp; Ed-Tech Claim Checker
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Screen misleading coaching advertisements, &quot;100% selection guarantees&quot;, unverified topper photographs, artificial seat scarcity, and illegal non-refundable clauses.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Coaching Institute / Platform Name
            </label>
            <input
              type="text"
              value={instituteName}
              onChange={(e) => setInstituteName(e.target.value)}
              placeholder="e.g. Apex IAS Academy"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Course / Competitive Exam
            </label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="e.g. NEET, JEE, UPSC, Banking"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Fees Charged (₹)
            </label>
            <input
              type="text"
              value={feesAmount}
              onChange={(e) => setFeesAmount(e.target.value)}
              placeholder="e.g. ₹95,000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Ad Copy, Pamphlet Text or Enrollment Conditions
          </label>
          <textarea
            rows={5}
            value={claimText}
            onChange={(e) => setClaimText(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 font-mono leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-500">
            Flags violations of Central Consumer Protection Authority (CCPA) standards.
          </span>
          <button
            type="submit"
            disabled={isAnalyzing || !claimText.trim()}
            className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isAnalyzing ? 'Scrutinizing Claims...' : 'Verify Coaching Claims'}</span>
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

      {/* Consumer Protection Drafts */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Draft Consumer Grievance / Refund Notice
            </h3>
            <p className="text-xs text-slate-500">
              Use this formal draft when an institute refuses a lawful refund or misrepresents selection rates.
            </p>
          </div>
          <button
            type="button"
            onClick={() => copyText(refundNoticeDraft, 'refund')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition flex items-center gap-1.5"
          >
            {copiedDraft === 'refund' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedDraft === 'refund' ? 'Copied' : 'Copy Draft'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
          {refundNoticeDraft}
        </pre>
      </div>
    </div>
  );
};
