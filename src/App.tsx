import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { ThemeSettingsModal } from './components/ThemeSettingsModal';
import { HomeView } from './pages/HomeView';
import { JobChecker } from './pages/JobChecker';
import { CertificateScanner } from './pages/CertificateScanner';
import { OverseasChecker } from './pages/OverseasChecker';
import { LinkUpiChecker } from './pages/LinkUpiChecker';
import { PhotoScanView } from './pages/PhotoScanView';
import { SkillPassportView } from './pages/SkillPassportView';
import { CommunityReportsView } from './pages/CommunityReportsView';
import { ParentModeView } from './pages/ParentModeView';
import { QuizView } from './pages/QuizView';
import { CoachingChecker } from './pages/CoachingChecker';
import { ExamAdmissionChecker } from './pages/ExamAdmissionChecker';
import { InternshipChecker } from './pages/InternshipChecker';
import { HistoryView } from './pages/HistoryView';
import { HelpResourcesView } from './pages/HelpResourcesView';
import { PrivacyPolicyView } from './pages/PrivacyPolicyView';
import { DashboardView } from './pages/DashboardView';
import { AnalysisResult, ScamCategory, UserPreferences } from './types';
import { Language } from './i18n/translations';
import { analyzeContent } from './utils/scamEngine';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [initialTextForPage, setInitialTextForPage] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);

  // User Authentication State
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem('verifai_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // User Preferences
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('verifai_prefs');
      return saved
        ? JSON.parse(saved)
        : {
            theme: 'light',
            accent: 'teal',
            language: 'en',
            fontSize: 'normal',
            parentMode: false,
            reducedMotion: false,
          };
    } catch {
      return {
        theme: 'light',
        accent: 'teal',
        language: 'en',
        fontSize: 'normal',
        parentMode: false,
        reducedMotion: false,
      };
    }
  });

  // Scan History
  const [history, setHistory] = useState<AnalysisResult[]>(() => {
    try {
      const saved = localStorage.getItem('verifai_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('verifai_history', JSON.stringify(history));
    } catch {
      // Storage limits
    }
  }, [history]);

  // Save preferences to localStorage and apply theme classes
  useEffect(() => {
    try {
      localStorage.setItem('verifai_prefs', JSON.stringify(preferences));
    } catch {
      // Ignore
    }

    const root = document.documentElement;
    // Dark mode class
    if (preferences.theme === 'dark') {
      root.classList.add('dark');
    } else if (preferences.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    // Accent color data attribute
    root.setAttribute('data-accent', preferences.accent);
  }, [preferences]);

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPrefs }));
  };

  const handleToggleDark = () => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    updatePreferences({ theme: isCurrentlyDark ? 'light' : 'dark' });
  };

  const handleToggleLang = () => {
    updatePreferences({ language: preferences.language === 'en' ? 'hi' : 'en' });
  };

  const handleNavigate = (page: string, initialText?: string) => {
    setCurrentPage(page);
    if (initialText !== undefined) {
      setInitialTextForPage(initialText);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (name: string, email: string) => {
    const u = { name, email };
    setUser(u);
    localStorage.setItem('verifai_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('verifai_user');
  };

  const handleGlobalSearch = (query: string) => {
    if (!query.trim()) return;
    handleNavigate('job', query);
  };

  // Primary analysis function connected to full-stack Express / Gemini API
  const handleAnalyze = async (
    text: string,
    category: ScamCategory = 'job',
    additionalData: Record<string, any> = {}
  ): Promise<AnalysisResult> => {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          category,
          additionalData,
        }),
      });

      if (!response.ok) {
        throw new Error('Server analysis error');
      }

      const result: AnalysisResult = await response.json();
      setCurrentResult(result);
      setHistory((prev) => [result, ...prev.slice(0, 49)]); // Keep last 50
      return result;
    } catch {
      // Graceful offline fallback
      const fallback = analyzeContent({ text, category, additionalData });
      setCurrentResult(fallback);
      setHistory((prev) => [fallback, ...prev.slice(0, 49)]);
      return fallback;
    }
  };

  const handleAskAssistant = (result: AnalysisResult, prompt: string) => {
    setCurrentResult(result);
    setAssistantOpen(true);
  };

  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors ${
        preferences.fontSize === 'large' ? 'text-base' : 'text-sm'
      }`}
    >
      {/* Top Header */}
      <Header
        currentLang={preferences.language}
        onToggleLang={handleToggleLang}
        onOpenThemeModal={() => setThemeModalOpen(true)}
        onNavigate={handleNavigate}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        onGlobalSearch={handleGlobalSearch}
        isDark={document.documentElement.classList.contains('dark')}
        onToggleDark={handleToggleDark}
        onOpenAuth={() => handleNavigate('dashboard')}
        user={user}
      />

      {/* Main Layout Container with Sidebar and Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop and Mobile Sidebar Navigation */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          lang={preferences.language}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Dynamic Page View Area */}
        <main className="flex-1 lg:pl-72 w-full p-4 sm:p-6 lg:p-8 min-w-0">
          {currentPage === 'home' && (
            <HomeView
              onNavigate={handleNavigate}
              lang={preferences.language}
              onQuickAnalyze={(txt) => handleAnalyze(txt, 'job')}
              onAskAssistant={handleAskAssistant}
            />
          )}

          {currentPage === 'job' && (
            <JobChecker
              onAnalyze={handleAnalyze}
              onAskAssistant={handleAskAssistant}
              lang={preferences.language}
              initialText={initialTextForPage}
            />
          )}

          {currentPage === 'certificate' && (
            <CertificateScanner
              onAnalyze={handleAnalyze}
              onAskAssistant={handleAskAssistant}
              lang={preferences.language}
            />
          )}

          {currentPage === 'overseas' && (
            <OverseasChecker
              onAnalyze={handleAnalyze}
              onAskAssistant={handleAskAssistant}
              lang={preferences.language}
            />
          )}

          {currentPage === 'link_upi' && (
            <LinkUpiChecker
              onAnalyze={handleAnalyze}
              onAskAssistant={handleAskAssistant}
              lang={preferences.language}
            />
          )}

          {currentPage === 'photo_scan' && (
            <PhotoScanView
              onAnalyze={handleAnalyze}
              onNavigate={handleNavigate}
              onAskAssistant={handleAskAssistant}
              lang={preferences.language}
            />
          )}

          {currentPage === 'coaching' && (
            <CoachingChecker
              onAnalyze={handleAnalyze}
              onAskAssistant={handleAskAssistant}
              lang={preferences.language}
            />
          )}

          {currentPage === 'internship' && (
            <InternshipChecker
              onAnalyze={handleAnalyze}
              onAskAssistant={handleAskAssistant}
              lang={preferences.language}
            />
          )}

          {currentPage === 'exam_admission' && (
            <ExamAdmissionChecker
              onAnalyze={handleAnalyze}
              onAskAssistant={handleAskAssistant}
              lang={preferences.language}
            />
          )}

          {currentPage === 'skill_passport' && (
            <SkillPassportView lang={preferences.language} />
          )}

          {currentPage === 'community_reports' && (
            <CommunityReportsView lang={preferences.language} />
          )}

          {currentPage === 'parent_mode' && (
            <ParentModeView lang={preferences.language} />
          )}

          {currentPage === 'quiz' && (
            <QuizView lang={preferences.language} />
          )}

          {currentPage === 'history' && (
            <HistoryView
              history={history}
              onSelectResult={(item) => {
                setCurrentResult(item);
                handleNavigate(item.category);
              }}
              onClearHistory={() => setHistory([])}
              lang={preferences.language}
            />
          )}

          {currentPage === 'help' && (
            <HelpResourcesView lang={preferences.language} />
          )}

          {currentPage === 'privacy' && (
            <PrivacyPolicyView lang={preferences.language} />
          )}

          {currentPage === 'dashboard' && (
            <DashboardView
              user={user}
              onLogin={handleLogin}
              onLogout={handleLogout}
              history={history}
              onNavigate={handleNavigate}
              lang={preferences.language}
            />
          )}
        </main>
      </div>

      {/* Persistent Accessible AI Assistant Drawer */}
      <AiAssistantDrawer
        currentResult={currentResult}
        isOpen={assistantOpen}
        onToggle={() => setAssistantOpen(!assistantOpen)}
        lang={preferences.language}
      />

      {/* Appearance & Accent Settings Modal */}
      <ThemeSettingsModal
        isOpen={themeModalOpen}
        onClose={() => setThemeModalOpen(false)}
        preferences={preferences}
        onUpdatePreferences={updatePreferences}
      />
    </div>
  );
}
