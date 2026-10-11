import React, { useState } from 'react';
import {
  UserCheck,
  ShieldCheck,
  Bell,
  Clock,
  LogOut,
  Sliders,
  Award,
  Key,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { AnalysisResult, UserPreferences } from '../types';
import { Language } from '../i18n/translations';

interface DashboardViewProps {
  user: { name: string; email: string } | null;
  onLogin: (name: string, email: string) => void;
  onLogout: () => void;
  history: AnalysisResult[];
  onNavigate: (page: string) => void;
  lang: Language;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onLogin,
  onLogout,
  history,
  onNavigate,
  lang,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    const displayName = nameInput.trim() || emailInput.split('@')[0];
    onLogin(displayName, emailInput.trim());
  };

  const handleDemoLogin = () => {
    onLogin('Arjun Sharma', 'arjun.sharma@example.com');
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center mx-auto shadow-md">
            <UserCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">
            {authMode === 'signin' ? 'Sign In to Verifai' : 'Create Verifai Account'}
          </h1>
          <p className="text-xs text-slate-500">
            Sync scan history across devices and manage your Skill Passport.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
          <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
            {authMode === 'signup' && (
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Rahul Verma"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@example.com"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition"
            >
              {authMode === 'signin' ? 'Sign In with Email' : 'Create Free Account'}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
            <span className="flex-shrink mx-4 text-slate-400 text-[11px] uppercase tracking-wider font-mono">
              or demo access
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs hover:bg-slate-200 transition"
          >
            Sign In with 1-Click Demo Profile
          </button>

          <div className="text-center pt-2 text-xs text-slate-500">
            {authMode === 'signin' ? (
              <span>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-teal-700 dark:text-teal-400 font-bold hover:underline"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="text-teal-700 dark:text-teal-400 font-bold hover:underline"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Signed In User Dashboard
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-heading font-bold text-2xl shadow-md">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 dark:text-white">
              {user.name}
            </h1>
            <p className="text-xs text-slate-500">{user.email}</p>
            <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              Active Verified Account
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 border border-red-200 dark:border-red-900/40 transition self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Total Scans Run
          </span>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {history.length}
          </div>
          <span className="text-[11px] text-teal-600 font-medium">Logged on this device</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            High Risk Scams Blocked
          </span>
          <div className="text-2xl font-black font-mono text-red-600 dark:text-red-400">
            {history.filter((h) => h.riskScore >= 70).length}
          </div>
          <span className="text-[11px] text-slate-400">Alerted with safe replies</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Skill Passport Status
          </span>
          <div className="text-sm font-bold text-slate-900 dark:text-white pt-1">
            Active Profile
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Ready for sharing</span>
        </div>
      </div>

      {/* Quick Access Actions */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <button
            onClick={() => onNavigate('job')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-600 flex items-center justify-between text-left group"
          >
            <div>
              <span className="font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400">
                Run New Job Offer Check
              </span>
              <p className="text-slate-500 text-[11px]">Paste new recruitment offer or email</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('skill_passport')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-600 flex items-center justify-between text-left group"
          >
            <div>
              <span className="font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400">
                View &amp; Edit Skill Passport
              </span>
              <p className="text-slate-500 text-[11px]">Generate shareable QR codes for employers</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
