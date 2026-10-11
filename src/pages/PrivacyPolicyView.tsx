import React from 'react';
import { ShieldCheck, Lock, FileText, AlertTriangle } from 'lucide-react';
import { Language } from '../i18n/translations';

interface PrivacyPolicyViewProps {
  lang: Language;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ lang }) => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>Privacy Architecture &amp; Legal Disclaimer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white">
          Privacy Policy, Terms &amp; Disclaimer
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Transparency on data handling, AI analysis models, and legal boundary limits.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {/* Core Heuristic Disclaimer */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-2">
          <strong className="font-heading font-bold text-base block flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Heuristic Risk Assessment Disclaimer
          </strong>
          <p>
            Verifai provides <strong>heuristic risk estimations</strong> based on observed patterns, keyword indicators, reported fraud registries, and contextual signals. Verifai is <strong>not a court of law, a law enforcement agency, or a definitive investigative authority</strong>. A score does not constitute legal proof of fraud or legitimacy.
          </p>
          <p>
            Citizens must independently cross-verify job offers, university credentials, and recruitment agents with authorized Government of India registries (eMigrate, DigiLocker, UGC, and DoT Chakshu) before making any payments or transferring personal identification.
          </p>
        </div>

        <section className="space-y-2">
          <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
            1. Zero-Retention Data Privacy Policy
          </h3>
          <p>
            When you paste messages, scan links, or inspect screenshots, the text is processed in-memory for pattern matching. <strong>Verifai does not sell, store permanently, or monetize user-submitted message excerpts.</strong> Scan histories are retained strictly within your local browser storage (localStorage) and can be permanently cleared by you at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
            2. Privacy Protection for Uploaded Documents &amp; Screenshots
          </h3>
          <p>
            Users are explicitly instructed to mask or redact Aadhaar numbers, Permanent Account Numbers (PAN), bank account details, and full dates of birth before uploading any screenshot or certificate. Uploaded image files are transiently processed for OCR text extraction and discarded immediately after inspection.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
            3. Community Reports and Moderation Standards
          </h3>
          <p>
            Community reports are submitted by ordinary citizens to warn peers of active fraud patterns. Unverified reports are clearly tagged with neutral labels such as &quot;Community Report — Not Independently Verified&quot;. Verifai adheres to strict abuse controls: defamatory personal allegations, private personal addresses, and sensitive financial credentials will never be published.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
            4. Limitation of Liability
          </h3>
          <p>
            Verifai, its engineers, and contributors shall not be held liable for any financial loss, missed opportunity, or adverse action arising from decisions made based on automated safety scores. Official verification must always take precedence.
          </p>
        </section>
      </div>
    </div>
  );
};
