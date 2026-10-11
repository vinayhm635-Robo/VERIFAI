import React from 'react';
import {
  Home,
  Briefcase,
  GraduationCap,
  FileBadge2,
  BookOpenCheck,
  Plane,
  Award,
  Link2,
  Camera,
  Users2,
  AlertOctagon,
  Sparkles,
  HelpCircle,
  HelpCircle as LifeBuoy,
  FileCheck2,
  HeartHandshake,
  ShieldAlert,
  History,
  FileText,
  X
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  lang: Language;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  lang,
  mobileOpen,
  onCloseMobile
}) => {
  const t = translations[lang].nav;

  const checkers = [
    { id: 'job', label: t.jobChecker, icon: Briefcase, kicker: 'Recruitment & Offers' },
    { id: 'internship', label: t.internshipChecker, icon: GraduationCap, kicker: 'Stipends & Training' },
    { id: 'certificate', label: t.certificateScanner, icon: FileBadge2, kicker: 'Degree & Skill Seals' },
    { id: 'coaching', label: t.coachingChecker, icon: BookOpenCheck, kicker: '100% Selection Claims' },
    { id: 'overseas', label: t.overseasChecker, icon: Plane, kicker: 'eMigrate & PGE Agents' },
    { id: 'exam_admission', label: t.examAdmissionChecker, icon: Award, kicker: 'Paper Leak & Seat Scams' },
    { id: 'link_upi', label: t.linkUpiChecker, icon: Link2, kicker: 'Phishing & Fake VPAs' },
    { id: 'photo_scan', label: t.photoScan, icon: Camera, kicker: 'WhatsApp Screenshots' },
  ];

  const tools = [
    { id: 'skill_passport', label: t.skillPassport, icon: Users2, kicker: 'For Skilled Workers' },
    { id: 'community_reports', label: t.communityReports, icon: AlertOctagon, kicker: 'Public Scam Board' },
    { id: 'ai_assistant', label: t.aiAssistant, icon: Sparkles, kicker: 'Safety Companion' },
    { id: 'quiz', label: t.quiz, icon: FileCheck2, kicker: 'Awareness Test' },
    { id: 'parent_mode', label: t.parentMode, icon: HeartHandshake, kicker: 'सरल भाषा सहायता' },
    { id: 'help', label: t.help, icon: ShieldAlert, kicker: '1930 Cybercrime Portal' },
  ];

  const accountPages = [
    { id: 'history', label: t.history, icon: History },
    { id: 'privacy', label: 'Privacy & Disclaimer', icon: FileText },
  ];

  const handleItemClick = (pageId: string) => {
    onNavigate(pageId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header in drawer */}
        <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 lg:hidden">
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-lg text-teal-800 dark:text-teal-400">Verifai</span>
            <span className="text-xs text-slate-500">Navigation</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Main Home Link */}
          <div>
            <button
              onClick={() => handleItemClick('home')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                currentPage === 'home'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>{t.home}</span>
            </button>
          </div>

          {/* Verification Checkers Group */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span>Verification Checkers</span>
              <span className="text-[10px] font-mono">{checkers.length}</span>
            </div>
            <div className="space-y-1">
              {checkers.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-colors text-left ${
                      isActive
                        ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-semibold border border-teal-200/80 dark:border-teal-800'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-700 dark:text-teal-400' : 'text-slate-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tools & Community Group */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Community &amp; Safety Tools
            </div>
            <div className="space-y-1">
              {tools.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs transition-colors text-left ${
                      isActive
                        ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-semibold border border-teal-200/80 dark:border-teal-800'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-700 dark:text-teal-400' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Records & Legal */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Records &amp; Terms
            </div>
            <div className="space-y-1">
              {accountPages.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs transition-colors text-left ${
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Quick Help Card */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="p-3 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/70 dark:border-teal-900/50 space-y-1.5">
            <div className="flex items-center gap-1.5 text-teal-800 dark:text-teal-300 text-xs font-bold">
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>National Cyber Fraud (1930)</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              Immediate financial loss assistance 24x7 across all Indian states.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
