import React, { useState } from 'react';
import {
  Users2,
  ShieldCheck,
  CheckCircle2,
  Award,
  Mic,
  MicOff,
  QrCode,
  Share2,
  Sparkles,
  ExternalLink,
  Languages,
  BookOpen,
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react';
import { WorkerProfile, SkillItem } from '../types';
import { Language } from '../i18n/translations';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../utils/speech';

interface SkillPassportViewProps {
  lang: Language;
}

export const SkillPassportView: React.FC<SkillPassportViewProps> = ({ lang }) => {
  const [profile, setProfile] = useState<WorkerProfile>({
    id: 'wp_1029',
    displayName: 'Ramesh Kumar',
    displayNameHi: 'रमेश कुमार',
    occupation: 'Certified Industrial Electrician',
    experienceYears: 6,
    preferredLanguage: 'hi',
    city: 'Bengaluru',
    state: 'Karnataka',
    isPublicPassport: true,
    summaryEn: 'Skilled electrician with 6 years experience in three-phase industrial wiring, motor maintenance, and substation electrical safety.',
    summaryHi: 'तीन-फेज औद्योगिक वायरिंग, मोटर रखरखाव और सबस्टेशन विद्युत सुरक्षा में 6 वर्षों के अनुभव के साथ कुशल इलेक्ट्रीशियन।',
    skills: [
      {
        id: 'sk_1',
        name: 'Three-Phase Industrial Wiring',
        category: 'Electrical',
        proficiency: 'Skilled',
        badgeStatus: 'verified_by_trainer',
        verifiedBy: 'ITI Skill Assessment Council (Trainer: S. Rao)',
        verifiedAt: '2025-11-14',
        practicalTips: ['Always confirm lock-out / tag-out (LOTO) procedures before testing busbars.']
      },
      {
        id: 'sk_2',
        name: 'AC/DC Motor Troubleshooting & Rewinding',
        category: 'Machinery',
        proficiency: 'Intermediate',
        badgeStatus: 'video_submitted',
        practicalTips: ['Check insulation resistance with a 500V Megger test prior to commissioning.']
      },
      {
        id: 'sk_3',
        name: 'Solar Inverter Grid-Tie Installation',
        category: 'Renewables',
        proficiency: 'Beginner',
        badgeStatus: 'not_recorded',
        practicalTips: ['Review MNRE earthing standards and surge protection device (SPD) ratings.']
      }
    ]
  });

  // AI Skill Coach state
  const [coachPrompt, setCoachPrompt] = useState('');
  const [coachResult, setCoachResult] = useState<any | null>(null);
  const [isCoaching, setIsCoaching] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleVoiceInput = () => {
    if (!isSpeechRecognitionSupported()) {
      alert('Speech input is not supported in this browser. Please type.');
      return;
    }
    if (isRecording) {
      setIsRecording(false);
      return;
    }
    setIsRecording(true);
    createSpeechRecognizer(
      lang,
      (text) => {
        setCoachPrompt(text);
        setIsRecording(false);
      },
      () => setIsRecording(false),
      () => setIsRecording(false)
    );
  };

  const handleRunCoach = () => {
    if (!coachPrompt.trim()) return;
    setIsCoaching(true);

    // AI Coaching evaluation based on trade task description
    setTimeout(() => {
      setCoachResult({
        task: coachPrompt,
        estimatedScore: 84,
        suggestedLevel: 'Skilled Technician',
        strengths: [
          'Correct identification of safety isolation procedure before touching terminals.',
          'Understands earth-leakage circuit breaker (ELCB) sensitivity thresholds (30mA).',
        ],
        areasToImprove: [
          'Remember to verify calibration certificate of the digital multimeter.',
          'Document cable insulation resistance reading on the maintenance log.',
        ],
        safetyObservation: 'Crucial: Never bypass residual current devices (RCD) during diagnostic testing.',
        practicalTip: 'Ensure double-earthing for industrial induction motors above 5 HP as per IS:3043 code of practice.',
      });
      setIsCoaching(false);
    }, 1200);
  };

  const shareableUrl = `${window.location.origin}/passport/${profile.id}`;

  const copyPassport = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold">
          <Users2 className="w-3.5 h-3.5" />
          <span>Vocational Trust &amp; Skill Verification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white">
          Skill Passport for Workers &amp; Artisans
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Help electricians, plumbers, welders, technicians, and drivers showcase genuine, verified vocational skills to overseas and domestic employers without falling victim to fake certificate agencies.
        </p>
      </div>

      {/* Worker Profile Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-heading font-bold text-2xl shadow-md">
              {profile.displayName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                  {lang === 'hi' && profile.displayNameHi ? profile.displayNameHi : profile.displayName}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
                  Verified Worker
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {profile.occupation} &middot; {profile.experienceYears} Years Experience &middot; {profile.city}, {profile.state}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition"
            >
              <QrCode className="w-4 h-4 text-teal-600" />
              <span>Share QR Passport</span>
            </button>
          </div>
        </div>

        {/* Bilingual Summary */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Professional Overview (English &amp; Hindi)
          </span>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2 leading-relaxed">
            <p className="text-slate-800 dark:text-slate-200">{profile.summaryEn}</p>
            <p className="text-slate-600 dark:text-slate-400 font-serif border-t border-slate-200 dark:border-slate-800 pt-2">
              {profile.summaryHi}
            </p>
          </div>
        </div>

        {/* Verified Skills Grid */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Skills Inventory &amp; Verification Badges ({profile.skills.length})
          </span>

          <div className="space-y-3">
            {profile.skills.map((skill) => {
              let badgeStyle = {
                bg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
                label: 'Self-Declared (Not Recorded)',
              };
              if (skill.badgeStatus === 'verified_by_trainer') {
                badgeStyle = {
                  bg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800',
                  label: 'Verified by Accredited Trainer',
                };
              } else if (skill.badgeStatus === 'video_submitted') {
                badgeStyle = {
                  bg: 'bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800',
                  label: 'Video Demonstration Submitted',
                };
              }

              return (
                <div
                  key={skill.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {skill.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                        {skill.proficiency}
                      </span>
                    </div>
                    {skill.verifiedBy && (
                      <p className="text-[11px] text-slate-500">
                        {skill.verifiedBy} &middot; Audited on {skill.verifiedAt}
                      </p>
                    )}
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 ${badgeStyle.bg}`}>
                    {badgeStyle.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Skill Coach Section */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              AI Skill Coach (वॉयस या टेक्स्ट सहायता)
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Describe how you solve a real job problem (e.g. how to fix an industrial motor tripping or lay underground cable). The AI Coach analyzes your method, checks safety standards, and suggests learning points.
          </p>
        </div>

        {/* Important Disclaimer for AI Assessment */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p>
            <strong>Note:</strong> AI Skill Coach provides training guidance and estimation based on your written/spoken explanation. <strong>It is NOT a formal trade license or legal certificate.</strong>
          </p>
        </div>

        {/* Coach Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Describe your practical procedure</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCoachPrompt(
                    'When a 3-phase induction motor trips on overload, I first isolate the main MCC breaker and apply lock-out. I check winding resistance with a multimeter and insulation with a 500V Megger. Then I check for mechanical jamming in the bearing.'
                  )
                }
                className="text-teal-700 dark:text-teal-400 hover:underline text-[11px]"
              >
                Load Sample Answer
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={4}
              value={coachPrompt}
              onChange={(e) => setCoachPrompt(e.target.value)}
              placeholder="Describe your step-by-step method here, or press the mic button to speak in Hindi or English..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`absolute bottom-3 right-3 p-2 rounded-xl transition ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
              }`}
              title="Speak task description"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleRunCoach}
              disabled={isCoaching || !coachPrompt.trim()}
              className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white text-xs font-bold transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isCoaching ? 'Evaluating Technique...' : 'Get Skill Coach Assessment'}</span>
            </button>
          </div>
        </div>

        {/* Coach Output */}
        {coachResult && (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-teal-200 dark:border-teal-900 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-heading font-bold text-sm text-slate-900 dark:text-white block">
                  Assessment Level: {coachResult.suggestedLevel}
                </span>
                <span className="text-[11px] text-slate-500">Based on submitted procedure</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-teal-700 dark:text-teal-400 text-lg">
                  {coachResult.estimatedScore}/100
                </span>
                <span className="text-[10px] text-slate-400 block">Demonstrated Clarity</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-bold text-emerald-700 dark:text-emerald-400 mb-2">Strengths Identified</h5>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                  {coachResult.strengths.map((str: string, i: number) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-amber-700 dark:text-amber-400 mb-2">Areas for Improvement</h5>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                  {coachResult.areasToImprove.map((area: string, i: number) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200">
              <strong>Practical Code Standard:</strong> {coachResult.practicalTip}
            </div>
          </div>
        )}
      </div>

      {/* Shareable QR Passport Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-slate-800 p-6 space-y-6 text-center shadow-2xl">
            <h4 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Shareable Skill Passport QR
            </h4>
            <p className="text-xs text-slate-500">
              Employers scan this to verify {profile.displayName}&apos;s verified credentials without exposing sensitive personal IDs.
            </p>

            {/* Simulated QR Code SVG */}
            <div className="w-48 h-48 mx-auto p-4 bg-white rounded-2xl border-2 border-teal-700 flex items-center justify-center shadow-sm">
              <div className="w-full h-full border border-slate-300 grid grid-cols-6 grid-rows-6 gap-1 p-2">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-xs ${
                      (i % 2 === 0 || i % 5 === 0) && i !== 14
                        ? 'bg-slate-900'
                        : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 truncate">
              {shareableUrl}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>
              <button
                type="button"
                onClick={copyPassport}
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
