import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  ExternalLink,
  Volume2,
  VolumeX,
  Languages,
  Share2,
  Printer,
  Copy,
  Check,
  MessageSquare,
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { speakText, stopSpeaking, isSpeechSupported } from '../utils/speech';

interface UniversalVerdictCardProps {
  result: AnalysisResult;
  onAskAssistant?: (result: AnalysisResult, contextPrompt: string) => void;
  lang?: 'en' | 'hi';
}

export const UniversalVerdictCard: React.FC<UniversalVerdictCardProps> = ({
  result,
  onAskAssistant,
  lang = 'en'
}) => {
  const [showHindi, setShowHindi] = useState(lang === 'hi');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState<string | null>(null);
  const [showDraftModal, setShowDraftModal] = useState<'reply' | 'complaint' | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    riskScore,
    riskLevel,
    verdictLabel,
    verdictLabelHi,
    summary,
    summaryHi,
    confidence,
    evidenceFound,
    suspiciousPhrases,
    recommendedSteps,
    officialLinks,
    safeReplyDraft,
    cybercrimeComplaintDraft
  } = result;

  // Determine color accents
  let colorTheme = {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    text: 'text-emerald-800 dark:text-emerald-300',
    gaugeColor: '#15803D',
    icon: ShieldCheck,
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
  };

  if (riskLevel === 'danger') {
    colorTheme = {
      bg: 'bg-red-50 dark:bg-red-950/30',
      border: 'border-red-200 dark:border-red-800/50',
      text: 'text-red-800 dark:text-red-300',
      gaugeColor: '#DC2626',
      icon: ShieldAlert,
      badgeBg: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
    };
  } else if (riskLevel === 'caution') {
    colorTheme = {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-800/50',
      text: 'text-amber-800 dark:text-amber-300',
      gaugeColor: '#D97706',
      icon: AlertTriangle,
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
    };
  } else if (riskLevel === 'insufficient_info') {
    colorTheme = {
      bg: 'bg-slate-50 dark:bg-slate-900/40',
      border: 'border-slate-200 dark:border-slate-800',
      text: 'text-slate-800 dark:text-slate-300',
      gaugeColor: '#64748B',
      icon: Info,
      badgeBg: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    };
  }

  const IconComponent = colorTheme.icon;

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      const textToRead = showHindi
        ? `${verdictLabelHi}. ${summaryHi}`
        : `${verdictLabel}. ${summary}`;
      setIsPlayingAudio(true);
      speakText(textToRead, showHindi ? 'hi' : 'en', () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleShare = async () => {
    const text = `Verifai Safety Scan: ${verdictLabel} (Risk Score: ${riskScore}/100). Check before you trust: ${window.location.origin}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Verifai Safety Scan',
          text,
          url: window.location.href,
        });
      } catch {
        // Fallback to clipboard
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopiedDraft('share');
      setTimeout(() => setCopiedDraft(null), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const copyText = (txt: string, label: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedDraft(label);
    setTimeout(() => setCopiedDraft(null), 2000);
  };

  // SVG Gauge calculations (circumference for semi-circle)
  const radius = 45;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  return (
    <div className={`rounded-2xl border transition-all duration-300 shadow-sm ${colorTheme.border} ${colorTheme.bg} overflow-hidden my-6`}>
      {/* Top Banner */}
      <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/60 dark:border-slate-800 shrink-0">
            <IconComponent className={`w-8 h-8 ${colorTheme.text}`} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Confidence: {confidence}</span>
              <span aria-hidden="true">·</span>
              <span>Heuristic Analysis</span>
              <span aria-hidden="true">·</span>
              <span>{new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {showHindi ? verdictLabelHi : verdictLabel}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {showHindi ? summaryHi : summary}
            </p>
          </div>
        </div>

        {/* Animated Semicircular Gauge */}
        <div className="flex flex-col items-center shrink-0 self-center md:self-auto bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="relative w-32 h-20 flex items-end justify-center overflow-hidden">
            <svg className="w-32 h-32 -rotate-180 transform" viewBox="0 0 100 100">
              {/* Background Arc */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth="9"
                strokeDasharray={`${circumference} ${circumference}`}
                className="text-slate-200 dark:text-slate-800"
              />
              {/* Dynamic Score Arc */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={colorTheme.gaugeColor}
                strokeWidth="9"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
              <span className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {riskScore}
                <span className="text-xs font-normal text-slate-500">/100</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Risk Score
              </span>
            </div>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 text-center">
            {riskScore < 30 ? 'Low Risk' : riskScore < 70 ? 'Moderate Caution' : 'Critical Hazard'}
          </span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="px-6 py-3 border-t border-b border-slate-200/70 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {/* Hindi Toggle */}
          <button
            type="button"
            onClick={() => setShowHindi(!showHindi)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              showHindi
                ? 'bg-teal-700 text-white border-teal-700'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{showHindi ? 'English में देखें' : 'हिंदी में समझें (Hindi)'}</span>
          </button>

          {/* Audio Readout */}
          {isSpeechSupported() && (
            <button
              type="button"
              onClick={handleToggleAudio}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                isPlayingAudio
                  ? 'bg-amber-600 text-white border-amber-600 animate-pulse'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isPlayingAudio ? 'Stop Audio' : 'Listen Aloud'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 transition-colors"
          >
            {copiedDraft === 'share' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedDraft === 'share' ? 'Link Copied' : 'Share'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            aria-label="Toggle details"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collapsible Details Body */}
      {isExpanded && (
        <div className="p-6 md:p-8 space-y-6 bg-white dark:bg-slate-900">
          {/* Evidence and Highlighted Red Flags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Evidence */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Key Evidence Observed ({evidenceFound.length})
              </h4>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {evidenceFound.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suspicious Phrases */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Flagged Phrases &amp; Why
              </h4>
              {suspiciousPhrases.length > 0 ? (
                <div className="space-y-2">
                  {suspiciousPhrases.map((phrase, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1"
                    >
                      <span className="font-mono font-semibold text-red-600 dark:text-red-400 block">
                        &quot;{phrase.text}&quot;
                      </span>
                      <p className="text-slate-600 dark:text-slate-300">{phrase.reason}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                  No explicitly hazardous phrases triggered keyword filters.
                </p>
              )}
            </div>
          </div>

          {/* Recommended Next Steps */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Recommended Next Steps
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700 dark:text-slate-300">
              {recommendedSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <span className="font-bold text-teal-700 dark:text-teal-400 text-xs shrink-0">{idx + 1}.</span>
                  <span className="text-xs md:text-sm leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Verification Portals */}
          {officialLinks && officialLinks.length > 0 && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Official Verification Portals
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {officialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-teal-600 dark:hover:border-teal-500 transition-colors group flex items-start justify-between gap-3"
                  >
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors flex items-center gap-1.5">
                        {link.title}
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {link.description}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {link.source}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDraftModal('reply')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                <span>Draft Safe Reply</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDraftModal('complaint')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 transition border border-red-200/50 dark:border-red-800/40"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Draft 1930 Cybercrime Complaint</span>
              </button>
            </div>

            {onAskAssistant && (
              <button
                type="button"
                onClick={() => onAskAssistant(result, `Explain why this ${result.category} scored ${result.riskScore}/100 and how I can verify the company.`)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI Assistant About This Result</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal for Drafts */}
      {showDraftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {showDraftModal === 'reply' ? 'Draft a Safe Verification Reply' : 'Draft 1930 Cybercrime Complaint'}
              </h3>
              <button
                type="button"
                onClick={() => setShowDraftModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              {showDraftModal === 'reply'
                ? 'Send this polite but firm response to the recruiter. It requires them to communicate via an official company channel without provoking hostility.'
                : 'Copy this summary when reporting to the National Cyber Crime Portal (cybercrime.gov.in) or calling 1930.'}
            </p>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap max-h-60 overflow-y-auto">
              {showDraftModal === 'reply' ? safeReplyDraft : cybercrimeComplaintDraft}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDraftModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => copyText(showDraftModal === 'reply' ? safeReplyDraft : cybercrimeComplaintDraft, 'draftModal')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white transition"
              >
                {copiedDraft === 'draftModal' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDraft === 'draftModal' ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
