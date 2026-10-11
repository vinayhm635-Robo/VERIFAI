import React, { useState } from 'react';
import {
  Briefcase,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Building2,
  Mail,
  IndianRupee,
  HelpCircle,
  ShieldCheck,
  Check
} from 'lucide-react';
import { UniversalVerdictCard } from '../components/UniversalVerdictCard';
import { AnalysisResult } from '../types';
import { Language, translations } from '../i18n/translations';

interface JobCheckerProps {
  onAnalyze: (text: string, category: 'job', additionalData: Record<string, any>) => Promise<AnalysisResult>;
  onAskAssistant: (result: AnalysisResult, prompt: string) => void;
  lang: Language;
  initialText?: string;
}

export const JobChecker: React.FC<JobCheckerProps> = ({
  onAnalyze,
  onAskAssistant,
  lang,
  initialText = ''
}) => {
  const [offerText, setOfferText] = useState(initialText);
  const [companyName, setCompanyName] = useState('');
  const [recruiterContact, setRecruiterContact] = useState('');
  const [offeredSalary, setOfferedSalary] = useState('');
  const [interviewOccurred, setInterviewOccurred] = useState<boolean | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerText.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await onAnalyze(offerText, 'job', {
        companyName,
        recruiterContact,
        offeredSalary,
        interviewOccurred,
      });
      setResult(res);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSample = (type: 'deposit_scam' | 'telegram_task' | 'genuine_offer') => {
    if (type === 'deposit_scam') {
      setOfferText(
        `Dear Candidate,\n\nYou have been shortlisted for the post of Senior Executive at Infosys BPM. You must submit a refundable laptop security deposit of Rs. 4,500 via UPI (hr-dept@okhdfc) within 24 hours to generate your digital gate pass and appointment ID. If you fail to pay, your candidature will be permanently cancelled.`
      );
      setCompanyName('Infosys BPM (Impersonator)');
      setRecruiterContact('careers-infosys@gmail.com');
      setOfferedSalary('₹65,000 / month');
      setInterviewOccurred(false);
    } else if (type === 'telegram_task') {
      setOfferText(
        `Hi! I am Priya from Global Recruiters. We have part-time work from home opportunity for you. Just like YouTube videos and rate hotels on Google Maps. Earn ₹2,500 to ₹5,000 daily payout. Contact our manager on Telegram @EarnFastIndia immediately to receive today's trial task.`
      );
      setCompanyName('Global Recruiters / FastEarn');
      setRecruiterContact('+91 98451 22345 (Telegram only)');
      setOfferedSalary('₹4,000 / day');
      setInterviewOccurred(false);
    } else {
      setOfferText(
        `Dear Priya,\n\nFollowing your technical discussion on Google Meet with our Engineering Lead and subsequent HR round, we are pleased to extend an offer for the role of Associate Software Engineer at Tata Consultancy Services.\n\nPlease find attached your formal offer letter detailing the compensation structure, 30-day acceptance window, and background verification guidelines. TCS never charges any registration fees during hiring.\n\nRegards,\nTCS Talent Acquisition Team`
      );
      setCompanyName('Tata Consultancy Services (TCS)');
      setRecruiterContact('careers@tcs.com');
      setOfferedSalary('₹4,50,000 / year');
      setInterviewOccurred(true);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Job Offer &amp; Recruitment Verification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white">
          Job Offer Scam Checker
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Paste offer letters, WhatsApp messages, Telegram chats or recruitment emails. Verifai scans for registration fees, fake interviews, impersonated corporate domains, and coercive threats.
        </p>
      </div>

      {/* Main Checker Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
        {/* Sample Loaders */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
          <span className="font-semibold text-slate-500">Quick Test Scenarios:</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => loadSample('deposit_scam')}
              className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50 hover:bg-red-100 transition"
            >
              Laptop Deposit Scam
            </button>
            <button
              type="button"
              onClick={() => loadSample('telegram_task')}
              className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 hover:bg-amber-100 transition"
            >
              Telegram Like &amp; Earn
            </button>
            <button
              type="button"
              onClick={() => loadSample('genuine_offer')}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-100 transition"
            >
              Legitimate Corporate Offer
            </button>
          </div>
        </div>

        {/* Textarea for Job Offer Content */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Offer Text, Email or Message Content *</span>
            <span className="text-[11px] font-normal text-slate-500">Min 20 characters</span>
          </label>
          <textarea
            rows={6}
            value={offerText}
            onChange={(e) => setOfferText(e.target.value)}
            placeholder="Paste the job message, email body, WhatsApp chat, or offer letter text here..."
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 font-mono leading-relaxed"
          />
        </div>

        {/* Optional Context Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>Company Name</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Infosys, Amazon, TCS"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>Recruiter Email / Contact</span>
            </label>
            <input
              type="text"
              value={recruiterContact}
              onChange={(e) => setRecruiterContact(e.target.value)}
              placeholder="e.g., hr@company.com or phone"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Offered Salary</span>
            </label>
            <input
              type="text"
              value={offeredSalary}
              onChange={(e) => setOfferedSalary(e.target.value)}
              placeholder="e.g., ₹40,000 / month"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />
          </div>
        </div>

        {/* Meaningful Interview Question */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Did you participate in a formal video/in-person interview before receiving this offer?
          </label>
          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => setInterviewOccurred(true)}
              className={`px-4 py-2 rounded-xl border transition ${
                interviewOccurred === true
                  ? 'bg-teal-700 text-white border-teal-700 font-semibold'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              Yes, I attended an interview
            </button>
            <button
              type="button"
              onClick={() => setInterviewOccurred(false)}
              className={`px-4 py-2 rounded-xl border transition ${
                interviewOccurred === false
                  ? 'bg-red-700 text-white border-red-700 font-semibold'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              No, selected directly without interview
            </button>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setOfferText('');
              setCompanyName('');
              setRecruiterContact('');
              setOfferedSalary('');
              setInterviewOccurred(null);
              setResult(null);
            }}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Clear Fields
          </button>

          <button
            type="submit"
            disabled={isAnalyzing || !offerText.trim()}
            className="px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Scanning Patterns...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Verify Job Offer</span>
              </>
            )}
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
