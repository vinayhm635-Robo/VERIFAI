import React from 'react';
import {
  ShieldAlert,
  PhoneCall,
  ExternalLink,
  Building,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { Language } from '../i18n/translations';

interface HelpResourcesViewProps {
  lang: Language;
}

export const HelpResourcesView: React.FC<HelpResourcesViewProps> = ({ lang }) => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Official Emergency Action Guide</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white">
          Cybercrime Helpline 1930 &amp; Official Portals
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Step-by-step instructions on what to do if you or someone you know has been defrauded online in India.
        </p>
      </div>

      {/* Golden Hour Emergency Action Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-red-600 text-white shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <PhoneCall className="w-8 h-8 animate-bounce" />
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold">
              Lost Money via UPI, NetBanking or Card? Act Within 2 Hours!
            </h2>
            <p className="text-xs sm:text-sm text-red-100 mt-0.5">
              Call national helpline <strong>1930</strong> immediately (Golden Hour Protocol).
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-black/20 border border-white/20 text-xs leading-relaxed space-y-2">
          <p>
            When you call 1930, the citizen financial cyber fraud management system (CFCFRMS) contacts both the victim and merchant banks in real time to freeze the beneficiary wallet or account before the criminal can withdraw the funds via ATM.
          </p>
          <div className="font-semibold text-amber-200">
            Keep ready: 1. Bank Account Number &middot; 2. Transaction UTR / Reference ID &middot; 3. Date &amp; exact time of debit &middot; 4. Beneficiary UPI ID or Mobile Number.
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <a
            href="tel:1930"
            className="px-6 py-3 rounded-2xl bg-white text-red-700 font-extrabold text-sm shadow-md hover:bg-red-50 transition"
          >
            Dial 1930 Now
          </a>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-white underline font-semibold hover:text-red-100"
          >
            <span>Visit cybercrime.gov.in</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Official Portals Directory */}
      <div className="space-y-4">
        <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
          Key Indian Regulatory &amp; Safety Portals
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'National Cyber Crime Reporting Portal',
              domain: 'cybercrime.gov.in',
              authority: 'Ministry of Home Affairs (MHA)',
              desc: 'Official platform to file complaints for financial cyber fraud, online identity theft, social media harassment, and job scams.',
              url: 'https://cybercrime.gov.in',
            },
            {
              title: 'Chakshu Portal (Sanchar Saathi)',
              domain: 'sancharsaathi.gov.in/sfc/',
              authority: 'Department of Telecommunications (DoT)',
              desc: 'Facility to report suspected fraudulent calls, WhatsApp extortion, SMS phishing, or fake SIM cards for telecom blacklisting.',
              url: 'https://sancharsaathi.gov.in/sfc/',
            },
            {
              title: 'eMigrate Portal (PGE Emigration Check)',
              domain: 'emigrate.gov.in',
              authority: 'Ministry of External Affairs (MEA)',
              desc: 'Verify registered overseas recruitment agents, check employer clearance, and verify legal foreign work contracts.',
              url: 'https://emigrate.gov.in',
            },
            {
              title: 'National Consumer Helpline (NCH)',
              domain: 'consumerhelpline.gov.in',
              authority: 'Department of Consumer Affairs',
              desc: 'File grievances against coaching institutes for fake selection guarantees or refusal of lawful fee refunds.',
              url: 'https://consumerhelpline.gov.in',
            },
            {
              title: 'National Academic Depository (NAD / DigiLocker)',
              domain: 'nad.digitallocker.gov.in',
              authority: 'Ministry of Education & MeitY',
              desc: 'Authenticate degrees, diplomas, and marksheets issued by UGC/AICTE accredited colleges and universities.',
              url: 'https://nad.digitallocker.gov.in',
            },
            {
              title: 'RBI Sachet Portal',
              domain: 'sachet.rbi.org.in',
              authority: 'Reserve Bank of India (RBI)',
              desc: 'Report unauthorized deposit-taking schemes, illegal Chinese loan apps, and fraudulent Ponzi investments.',
              url: 'https://sachet.rbi.org.in',
            },
          ].map((portal, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-teal-600 dark:text-teal-400 font-semibold">{portal.domain}</span>
                  <span>{portal.authority}</span>
                </div>
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                  {portal.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {portal.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline"
                >
                  <span>Open Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
