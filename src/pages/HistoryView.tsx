import React from 'react';
import {
  History,
  Trash2,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Printer
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { Language } from '../i18n/translations';

interface HistoryViewProps {
  history: AnalysisResult[];
  onSelectResult: (result: AnalysisResult) => void;
  onClearHistory: () => void;
  lang: Language;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectResult,
  onClearHistory,
  lang,
}) => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold">
            <History className="w-3.5 h-3.5" />
            <span>On-Device Verification Audit Trail</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white mt-1">
            Verification Scan History
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Stored privately in your browser local storage. Never uploaded to remote servers.
          </p>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition border border-red-200 dark:border-red-900/40 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* History Items */}
      {history.length === 0 ? (
        <div className="p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <History className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
            No scans recorded yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Run an analysis on any job offer, UPI ID, overseas contract, or certificate to review your historical safety verdicts here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => {
            let riskBadge = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
            let RiskIcon = ShieldCheck;
            if (item.riskScore >= 70) {
              riskBadge = 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
              RiskIcon = ShieldAlert;
            } else if (item.riskScore >= 30) {
              riskBadge = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
              RiskIcon = AlertTriangle;
            }

            return (
              <div
                key={item.id}
                onClick={() => onSelectResult(item)}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 dark:hover:border-teal-500 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-xs"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                    <RiskIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider text-[10px]">
                        {item.category}
                      </span>
                      <span aria-hidden="true">&middot;</span>
                      <span>{new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white mt-0.5 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 truncate max-w-md mt-0.5">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      {item.riskScore}/100
                    </span>
                    <span className={`block px-2 py-0.5 rounded text-[10px] font-semibold ${riskBadge}`}>
                      {item.riskLevel}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
