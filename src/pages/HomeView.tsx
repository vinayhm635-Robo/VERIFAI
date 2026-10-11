import React, { useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  FileBadge2,
  BookOpenCheck,
  Plane,
  Award,
  Link2,
  Camera,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Users2,
  HeartHandshake,
  TrendingUp,
  FileText,
  Search,
  ExternalLink,
  Sparkles,
  PhoneCall,
  Eye,
  Lock
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ThreeShieldCanvas } from '../components/ThreeShieldCanvas';
import { UniversalVerdictCard } from '../components/UniversalVerdictCard';
import { Language, translations } from '../i18n/translations';
import { AnalysisResult } from '../types';

interface HomeViewProps {
  onNavigate: (page: string, initialText?: string) => void;
  lang: Language;
  onQuickAnalyze: (text: string) => Promise<AnalysisResult>;
  onAskAssistant: (result: AnalysisResult, prompt: string) => void;
}

// Sample aggregated trend data for the community chart
const SCAM_TREND_DATA = [
  { category: 'Part-Time Tasks', count: 142 },
  { category: 'Telegram Jobs', count: 188 },
  { category: 'Fake Offers & Fees', count: 215 },
  { category: 'UPI QR Phishing', count: 164 },
  { category: 'Overseas Visas', count: 96 },
  { category: 'Exam Leaks/Seats', count: 72 },
  { category: 'Ed-Tech Guarantees', count: 54 },
];

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  lang,
  onQuickAnalyze,
  onAskAssistant,
}) => {
  const t = translations[lang];
  const [quickInput, setQuickInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [quickResult, setQuickResult] = useState<AnalysisResult | null>(null);

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await onQuickAnalyze(quickInput);
      setQuickResult(res);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const checkerCards = [
    {
      id: 'job',
      title: 'Job Offers',
      titleHi: 'नौकरी के ऑफर',
      desc: 'Detect registration fees, Telegram task scams, WhatsApp-only interviews and fake appointment letters.',
      descHi: 'पंजीकरण शुल्क, टेलीग्राम टास्क फ्रॉड, व्हाट्सएप इंटरव्यू और फर्जी नियुक्ति पत्र की जांच करें।',
      icon: Briefcase,
      color: 'text-teal-700 dark:text-teal-400',
      tag: 'High Scams',
    },
    {
      id: 'internship',
      title: 'Internships & Certificates',
      titleHi: 'इंटर्नशिप व सर्टिफिकेट',
      desc: 'Identify paid courses disguised as internships, fee-to-intern traps and unverified placement guarantees.',
      descHi: 'इंटर्नशिप के नाम पर पैसे ऐंठने और बिना मेंटर वाले फर्जी प्रमाण पत्रों की पहचान करें।',
      icon: GraduationCap,
      color: 'text-sky-600 dark:text-sky-400',
      tag: 'Freshers',
    },
    {
      id: 'certificate',
      title: 'Certificate Scanner',
      titleHi: 'सर्टिफिकेट स्कैनर',
      desc: 'Inspect degree, marksheet, or skill certificates for layout anomalies and check DigiLocker / NAD portals.',
      descHi: 'डिग्री और मार्कशीट के फॉन्ट, सील व तारीखों की विसंगतियों की जांच करें।',
      icon: FileBadge2,
      color: 'text-indigo-600 dark:text-indigo-400',
      tag: 'OCR & Visual',
    },
    {
      id: 'coaching',
      title: 'Coaching & Courses',
      titleHi: 'कोचिंग व कोर्स दावे',
      desc: 'Evaluate 100% selection claims, unverified topper ads, unfair non-refundable clauses and deceptive fees.',
      descHi: '100% चयन की झूठी गारंटी, टॉपर के भ्रामक विज्ञापनों और नो-रिफंड शर्तों की समीक्षा करें।',
      icon: BookOpenCheck,
      color: 'text-purple-600 dark:text-purple-400',
      tag: 'CCPA Guidelines',
    },
    {
      id: 'overseas',
      title: 'Overseas Jobs & Agents',
      titleHi: 'विदेश की नौकरी व एजेंट',
      desc: 'Verify MEA eMigrate PGE licensing, tourist-visa-for-work traps, passport withholding and trafficking risks.',
      descHi: 'विदेश मंत्रालय (MEA) eMigrate लाइसेंस, विजिट वीजा के धोखे और मानव तस्करी जोखिमों को रोकें।',
      icon: Plane,
      color: 'text-amber-600 dark:text-amber-400',
      tag: 'eMigrate Check',
    },
    {
      id: 'exam_admission',
      title: 'Exams & Admissions',
      titleHi: 'परीक्षा व प्रवेश धोखाधड़ी',
      desc: 'Spot fake paper leak sellers, management quota cash demands, lookalike university portals and scholarship fees.',
      descHi: 'पेपर लीक के झांसे, मैनेजमेंट कोटा डोनेशन फ्रॉड और फर्जी स्कॉलरशिप पोर्टल को पहचानें।',
      icon: Award,
      color: 'text-rose-600 dark:text-rose-400',
      tag: 'Academic Safety',
    },
    {
      id: 'link_upi',
      title: 'Links, Phone & UPI',
      titleHi: 'लिंक, फोन व UPI जांच',
      desc: 'Screen lookalike URLs, shortened phishing links, electricity bill SMS APKs and suspicious payment VPAs.',
      descHi: 'फर्जी बैंक/बिजली बिल लिंक, शॉर्ट यूआरएल और संदिग्ध यूपीआई आईडी की तुरंत जांच करें।',
      icon: Link2,
      color: 'text-blue-600 dark:text-blue-400',
      tag: 'Phishing Shield',
    },
    {
      id: 'photo_scan',
      title: 'Photo Scan',
      titleHi: 'फोटो व स्क्रीनशॉट स्कैन',
      desc: 'Upload up to 3 screenshots of WhatsApp chats, appointment letters or ads for automatic multi-point OCR analysis.',
      descHi: 'व्हाट्सएप चैट, नियुक्ति पत्र या विज्ञापन के 3 स्क्रीनशॉट अपलोड कर एक साथ जांचें।',
      icon: Camera,
      color: 'text-emerald-600 dark:text-emerald-400',
      tag: 'Multi-image OCR',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section with Real-Time 3D Shield Background */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 rounded-3xl bg-gradient-to-b from-teal-950/10 via-slate-50 to-white dark:from-teal-950/40 dark:via-slate-900 dark:to-slate-950 border border-slate-200/80 dark:border-slate-800">
        {/* Interactive Three.js Shield Canvas */}
        <ThreeShieldCanvas isAnalyzing={isAnalyzing} />

        {/* Foreground Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-teal-600/30 text-teal-800 dark:text-teal-300 text-xs font-semibold shadow-xs backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>{t.tagline}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 dark:text-slate-400 font-normal">{t.freeAndPrivate}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            {t.heroTitle}{' '}
            <span className="text-teal-700 dark:text-teal-400 underline decoration-teal-500/40 underline-offset-8">
              {t.heroTitleAccent}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Prominent Search & Paste Input Box */}
          <form
            onSubmit={handleHeroSubmit}
            className="max-w-2xl mx-auto mt-4 p-2 rounded-2xl bg-white dark:bg-slate-900 border-2 border-teal-600/40 dark:border-teal-500/50 shadow-xl shadow-teal-950/5 flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex-1 w-full flex items-center gap-3 px-3">
              <Search className="w-5 h-5 text-teal-600 shrink-0" />
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder={t.pastePlaceholder}
                className="w-full py-2.5 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="submit"
                disabled={isAnalyzing || !quickInput.trim()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>{t.common.analyzing}</span>
                  </>
                ) : (
                  <>
                    <span>{t.checkNow}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Sample Starter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs pt-1 text-slate-500 dark:text-slate-400">
            <span className="font-medium">Try Sample Scams:</span>
            <button
              type="button"
              onClick={() => {
                const sampleText = 'Congratulations! You are selected for Amazon Part-time Data Reviewer. Salary ₹3,500 daily. Pay ₹1,200 refundable registration fee on Telegram to start immediately.';
                setQuickInput(sampleText);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition"
            >
              Part-Time Telegram Job
            </button>
            <button
              type="button"
              onClick={() => {
                const sampleText = 'Urgent hiring in Dubai Hotel. No interview, salary ₹85,000. Send ₹45,000 for tourist visit visa. We will convert to work permit after reaching.';
                setQuickInput(sampleText);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition"
            >
              Dubai Tourist Visa Trap
            </button>
            <button
              type="button"
              onClick={() => {
                const sampleText = 'Dear Sir, following our technical round on Microsoft Teams, please review the formal employment offer from @tcs.com with standard 30-day notice period and CIN registration.';
                setQuickInput(sampleText);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition"
            >
              Genuine Corporate Offer
            </button>
          </div>

          {/* Quick Result if submitted in hero */}
          {quickResult && (
            <div className="text-left mt-8 max-w-3xl mx-auto">
              <UniversalVerdictCard
                result={quickResult}
                onAskAssistant={onAskAssistant}
                lang={lang}
              />
            </div>
          )}
        </div>
      </section>

      {/* 2. Grid of Eight Large Checker Cards */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">
              {lang === 'hi' ? 'विशेष सत्यापन मॉड्यूल' : 'Specialized Verification Checkers'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select the appropriate tool for targeted evidence cross-referencing and official portal checks.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">8 Modules Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {checkerCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 dark:hover:border-teal-500 transition-all duration-200 shadow-xs hover:shadow-lg cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 font-mono">
                      {card.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                      {lang === 'hi' ? card.titleHi : card.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {lang === 'hi' ? card.descHi : card.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-teal-700 dark:text-teal-400">
                  <span>Verify Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Community Scam Trends & Recent Alerts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scam Trends Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-700 dark:text-teal-400" />
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                Community Scam Trends Across India
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Sample Community Aggregates</span>
          </div>
          <p className="text-xs text-slate-500">
            Frequency of verified user reports logged over the past 30 days by scam pattern.
          </p>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SCAM_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="category" angle={-15} textAnchor="end" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    border: '1px solid #1E293B',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#0F766E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Safety Tips & Warning Highlights */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-amber-500" />
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                Golden Safety Rules
              </h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>No Fee For Jobs:</strong> Genuine companies never demand registration or interview charges.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Never Enter UPI PIN to Receive:</strong> Entering your PIN always deducts funds from your account.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>No Work on Visit Visa:</strong> Overseas employment requires a registered MEA work permit.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Check DigiLocker / NAD:</strong> Authentic degree certificates can be authenticated online.</span>
              </li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs text-red-800 dark:text-red-300">
            <strong>Lost money to cyber fraud?</strong> Call <strong>1930</strong> immediately within the golden hour to freeze payment gateways.
          </div>
        </div>
      </section>

      {/* 4. How Verifai Works in 3 Steps */}
      <section className="p-8 rounded-3xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center space-y-8">
        <div className="max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">
            How Verifai Verifies in 3 Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Transparent, multi-layer verification combining AI heuristics and official databases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
              1
            </span>
            <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
              Pattern &amp; Keyword Extraction
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Scans message headers, lookalike domains, salary sanity, and coercive language against thousands of documented Indian scams.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
              2
            </span>
            <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
              Official Registry Cross-Check
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Maps claims directly to Government of India portals: MEA eMigrate, DoT Chakshu, CCPA advisories, and DigiLocker / NAD.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
              3
            </span>
            <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
              Actionable Defense Drafts
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Delivers instant risk gauges, highlighted phrases, safe inquiry replies, and 1930 cybercrime reporting formats.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Special Promotional Banners (Skill Passport & Parent Mode) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skill Passport for Skilled Workers */}
        <div
          onClick={() => onNavigate('skill_passport')}
          className="p-6 rounded-2xl bg-gradient-to-br from-teal-900 to-slate-950 text-white border border-teal-800/60 shadow-lg cursor-pointer hover:border-teal-500 transition group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users2 className="w-6 h-6 text-teal-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-teal-300">
                For Skilled Workers
              </span>
            </div>
            <h3 className="text-xl font-heading font-bold group-hover:text-teal-300 transition-colors">
              Skill Passport for Technicians &amp; Workers
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Showcase verified hands-on trade skills (electricians, welders, plumbers) with tamper-proof QR codes and AI coaching without fake certificates.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-teal-300">
            <span>Explore Skill Passport</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Parent Mode Quick Banner */}
        <div
          onClick={() => onNavigate('parent_mode')}
          className="p-6 rounded-2xl bg-gradient-to-br from-amber-900/60 via-slate-900 to-slate-950 text-white border border-amber-800/50 shadow-lg cursor-pointer hover:border-amber-500 transition group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-6 h-6 text-amber-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-amber-300">
                अभिभावक मोड (Parent Mode)
              </span>
            </div>
            <h3 className="text-xl font-heading font-bold group-hover:text-amber-300 transition-colors">
              Simple Guidance for Parents &amp; Families
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Clear, large-font advice in simple English &amp; Hindi to help parents determine if their child’s job or college admission offer is legitimate.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-amber-300">
            <span>Open Parent Mode</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* 6. Sample Community Testimonials */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
            Community Experiences
          </h3>
          <span className="text-xs text-slate-500 font-mono">Sample User Feedback (Demo)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: 'Aakash Verma',
              role: 'B.Tech Graduate, Jaipur',
              quote: 'Verifai stopped me from paying ₹3,500 for a fake "laptop security fee" from an impersonator claiming to be TCS. The safe reply draft made them stop messaging immediately.',
            },
            {
              name: 'Sunita Mehra',
              role: 'Parent, Delhi NCR',
              quote: 'My son received a WhatsApp message guaranteeing a medical seat under "special quota". Parent Mode explained clearly why official counseling never works through WhatsApp.',
            },
            {
              name: 'Mohammed Rizwan',
              role: 'Certified Welder, Hyderabad',
              quote: 'An overseas agent asked for ₹75,000 to fly to Qatar on a visit visa. The eMigrate check revealed the agent had no PGE registration. Verifai saved my hard-earned savings.',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                &quot;{item.quote}&quot;
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-bold text-xs text-slate-900 dark:text-white block">{item.name}</span>
                <span className="text-[11px] text-slate-500">{item.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Official Indian Citizen Safety Resources Footer */}
      <footer className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6 text-xs text-slate-500">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Cybercrime Helplines</h5>
            <ul className="space-y-1.5">
              <li><a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">National Portal (1930) <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://sancharsaathi.gov.in" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">Chakshu Portal <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://consumerhelpline.gov.in" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">National Consumer Line <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Official Registries</h5>
            <ul className="space-y-1.5">
              <li><a href="https://emigrate.gov.in" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">MEA eMigrate Portal <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://nad.digitallocker.gov.in" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">NAD DigiLocker <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://nsdcindia.org" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">NSDC Skill India <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Platform Tools</h5>
            <ul className="space-y-1.5">
              <li><button onClick={() => onNavigate('job')} className="hover:underline text-left">Job Offer Checker</button></li>
              <li><button onClick={() => onNavigate('community_reports')} className="hover:underline text-left">Community Scam Board</button></li>
              <li><button onClick={() => onNavigate('quiz')} className="hover:underline text-left">Scam Awareness Quiz</button></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Legal &amp; Heuristic Notice</h5>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Verifai provides heuristic risk estimations based on known scam patterns and does not issue legal determinations. Always independently verify offers with official authorities.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Verifai &middot; Verify Before You Trust &middot; Built for Digital Safety in India</span>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('privacy')} className="hover:underline">Privacy Policy &amp; Terms</button>
            <button onClick={() => onNavigate('help')} className="hover:underline">Helpline 1930 Guide</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
