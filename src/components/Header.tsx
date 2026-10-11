import React from 'react';
import {
  ShieldCheck,
  Search,
  Languages,
  Moon,
  Sun,
  Palette,
  PhoneCall,
  History,
  Menu,
  X,
  UserCheck
} from 'lucide-react';
import { Language } from '../i18n/translations';

interface HeaderProps {
  currentLang: Language;
  onToggleLang: () => void;
  onOpenThemeModal: () => void;
  onNavigate: (page: string) => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onGlobalSearch: (query: string) => void;
  isDark: boolean;
  onToggleDark: () => void;
  onOpenAuth: () => void;
  user: { name: string; email: string } | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onToggleLang,
  onOpenThemeModal,
  onNavigate,
  mobileMenuOpen,
  onToggleMobileMenu,
  onGlobalSearch,
  isDark,
  onToggleDark,
  onOpenAuth,
  user
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      {/* 1930 Cybercrime Emergency Helpline Bar */}
      <div className="bg-gradient-to-r from-red-600 via-amber-600 to-teal-700 text-white text-[11px] sm:text-xs py-1 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium">
          <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
          <span>
            {currentLang === 'hi'
              ? 'राष्ट्रीय साइबर अपराध हेल्पलाइन: 1930 (वित्तीय धोखाधड़ी पर तुरंत कॉल करें)'
              : 'National Cyber Crime Helpline: 1930 (Call immediately for financial fraud / cybercrime)'}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline font-semibold"
          >
            cybercrime.gov.in
          </a>
          <span aria-hidden="true">·</span>
          <span>Sanchar Saathi (Chakshu)</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle + Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-md shadow-teal-700/20 group-hover:bg-teal-800 transition-colors ring-1 ring-teal-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-black text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
                Verifai
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight block">
                Verify Before You Trust
              </span>
            </div>
          </button>
        </div>

        {/* Center: Global Quick Search Input */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                currentLang === 'hi'
                  ? 'नौकरी, कंपनी, UPI आईडी या फोन नंबर खोजें...'
                  : 'Search company, phone, UPI ID or scam alert...'
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onGlobalSearch((e.target as HTMLInputElement).value);
                }
              }}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-600 transition"
            />
          </div>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Toggle Button */}
          <button
            type="button"
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
            title="Toggle English / Hindi"
          >
            <Languages className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            <span>{currentLang === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Scan History Shortcut */}
          <button
            type="button"
            onClick={() => onNavigate('history')}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
            title="Scan History"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span className="hidden lg:inline">History</span>
          </button>

          {/* Theme Palette Modal */}
          <button
            type="button"
            onClick={onOpenThemeModal}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
            title="Theme & Accent Settings"
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDark}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
            title="Toggle Dark / Light Mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* User Sign In / Profile */}
          {user ? (
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs font-medium text-teal-900 dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-teal-900/60 transition"
            >
              <UserCheck className="w-4 h-4 text-teal-600" />
              <span className="truncate max-w-[100px]">{user.name}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-sm transition"
            >
              {currentLang === 'hi' ? 'लॉगिन' : 'Sign In'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
