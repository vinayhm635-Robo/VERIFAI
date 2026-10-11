import React, { useState } from 'react';
import {
  Plane,
  AlertOctagon,
  ShieldAlert,
  Building,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { UniversalVerdictCard } from '../components/UniversalVerdictCard';
import { AnalysisResult } from '../types';
import { Language } from '../i18n/translations';

interface OverseasCheckerProps {
  onAnalyze: (text: string, category: 'overseas', additionalData: Record<string, any>) => Promise<AnalysisResult>;
  onAskAssistant: (result: AnalysisResult, prompt: string) => void;
  lang: Language;
}

export const OverseasChecker: React.FC<OverseasCheckerProps> = ({
  onAnalyze,
  onAskAssistant,
  lang,
}) => {
  const [agentName, setAgentName] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('United Arab Emirates (UAE)');
  const [visaType, setVisaType] = useState<'tourist' | 'work' | 'unspecified'>('tourist');
  const [advanceFee, setAdvanceFee] = useState('₹75,000');
  const [raNumber, setRaNumber] = useState('');
  const [detailsText, setDetailsText] = useState(
    'Recruiting agency Gulf Gate HR promises warehouse supervisor job in Dubai. Advance fee of ₹75,000 required for travel arrangements. They say they will issue a 30-day visit visa first and convert it to work permit after arrival. No written employment contract provided yet.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailsText.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await onAnalyze(detailsText, 'overseas', {
        agentName,
        destinationCountry,
        visaType,
        advanceFee,
        raNumber,
      });
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
          <Plane className="w-3.5 h-3.5" />
          <span>Ministry of External Affairs (MEA) eMigrate &amp; PGE Check</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white">
          Overseas Job &amp; Recruitment Agent Checker
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Verify foreign employment offers in the Gulf (UAE, Saudi Arabia, Qatar, Kuwait), Europe, and Southeast Asia. Protect yourself from unlicensed agents, tourist-visa traps, and passport withholding.
        </p>
      </div>

      {/* Critical Emigration Act Warning Banner */}
      <div className="p-5 rounded-3xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs text-red-900 dark:text-red-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-red-700 dark:text-red-400">
          <AlertOctagon className="w-5 h-5 shrink-0" />
          <span>Critical Safety Warning: Never Travel on a Tourist/Visit Visa for Employment</span>
        </div>
        <p className="leading-relaxed">
          Under Indian law (Emigration Act, 1983), it is illegal for foreign employers or recruiting agents to deploy Indian citizens on visit or tourist visas. Thousands of workers get stranded without legal rights, pay, or the ability to return home. <strong>Only travel with a verified employment visa and written contract.</strong>
        </p>
      </div>

      {/* Verification Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Agency or Recruiter Name
            </label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="e.g. Gulf Gate Overseas HR"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Destination Country
            </label>
            <select
              value={destinationCountry}
              onChange={(e) => setDestinationCountry(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            >
              <option value="United Arab Emirates (UAE)">United Arab Emirates (UAE / Dubai)</option>
              <option value="Saudi Arabia">Saudi Arabia (KSA)</option>
              <option value="Qatar">Qatar</option>
              <option value="Kuwait">Kuwait</option>
              <option value="Oman">Oman</option>
              <option value="Bahrain">Bahrain</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Singapore">Singapore</option>
              <option value="Europe / Russia">Europe / Russia</option>
              <option value="Other">Other International</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              MEA RA Registration Number
            </label>
            <input
              type="text"
              value={raNumber}
              onChange={(e) => setRaNumber(e.target.value)}
              placeholder="Format: B-0123/MUM/PER/1000+/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 font-mono"
            />
          </div>
        </div>

        {/* Visa Type Radio */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            What type of visa has the agent promised or provided?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <label
              className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                visaType === 'tourist'
                  ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-900 dark:text-red-200 font-semibold'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <input
                type="radio"
                name="visa"
                checked={visaType === 'tourist'}
                onChange={() => setVisaType('tourist')}
              />
              <span>Tourist / Visit Visa (High Hazard)</span>
            </label>

            <label
              className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                visaType === 'work'
                  ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-900 dark:text-teal-200 font-semibold'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <input
                type="radio"
                name="visa"
                checked={visaType === 'work'}
                onChange={() => setVisaType('work')}
              />
              <span>Official Employment Visa</span>
            </label>

            <label
              className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                visaType === 'unspecified'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-200 font-semibold'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <input
                type="radio"
                name="visa"
                checked={visaType === 'unspecified'}
                onChange={() => setVisaType('unspecified')}
              />
              <span>Not Clarified Yet</span>
            </label>
          </div>
        </div>

        {/* Offer & Conversation Details */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Offer Description, WhatsApp Chat or Agent Demands
          </label>
          <textarea
            rows={5}
            value={detailsText}
            onChange={(e) => setDetailsText(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 font-mono leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="text-[11px] text-slate-500">
            Cross-checks against Protector General of Emigrants (PGE) advisories.
          </div>
          <button
            type="submit"
            disabled={isAnalyzing || !detailsText.trim()}
            className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isAnalyzing ? 'Checking eMigrate...' : 'Verify Overseas Offer'}</span>
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

      {/* Official MEA Portals & Anti-Trafficking Resources */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Building className="w-5 h-5 text-teal-600" />
          Official Government of India Emigration Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <a
            href="https://emigrate.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-teal-600 transition flex items-start justify-between gap-3 group"
          >
            <div>
              <span className="font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 flex items-center gap-1.5">
                eMigrate Portal (emigrate.gov.in)
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
              <p className="text-slate-500 mt-1">
                Verify active Recruiting Agents (RAs) registered with the Ministry of External Affairs.
              </p>
            </div>
          </a>

          <a
            href="https://mea.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-teal-600 transition flex items-start justify-between gap-3 group"
          >
            <div>
              <span className="font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 flex items-center gap-1.5">
                Indian Community Welfare Fund (ICWF)
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
              <p className="text-slate-500 mt-1">
                Emergency consular assistance provided by Indian Embassies and Consulates abroad.
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
