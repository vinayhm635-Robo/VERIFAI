import React from 'react';
import { X, Check, Sun, Moon, Monitor, Sliders, Eye } from 'lucide-react';
import { UserPreferences } from '../types';

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (newPrefs: Partial<UserPreferences>) => void;
}

export const ThemeSettingsModal: React.FC<ThemeSettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
}) => {
  if (!isOpen) return null;

  const accents: { id: UserPreferences['accent']; name: string; color: string }[] = [
    { id: 'teal', name: 'Indian Deep Teal', color: '#0F766E' },
    { id: 'blue', name: 'Sky Tech Blue', color: '#0284C7' },
    { id: 'violet', name: 'Royal Violet', color: '#7C3AED' },
    { id: 'green', name: 'Forest Shield Green', color: '#15803D' },
    { id: 'rose', name: 'Coral Rose', color: '#E11D48' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-teal-600" />
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Appearance &amp; Accessibility
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Mode Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Interface Theme
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Monitor },
            ].map((theme) => {
              const Icon = theme.icon;
              const isSelected = preferences.theme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => onUpdatePreferences({ theme: theme.id as any })}
                  className={`flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-2xl border text-xs font-medium transition ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-600 text-teal-900 dark:text-teal-200 shadow-sm ring-1 ring-teal-500/20'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{theme.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accent Color Presets */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Brand Accent Color
          </label>
          <div className="grid grid-cols-5 gap-2">
            {accents.map((acc) => {
              const isSelected = preferences.accent === acc.id;
              return (
                <button
                  key={acc.id}
                  onClick={() => onUpdatePreferences({ accent: acc.id })}
                  className={`group relative flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition ${
                    isSelected
                      ? 'border-slate-900 dark:border-white shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                  title={acc.name}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm"
                    style={{ backgroundColor: acc.color }}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 capitalize truncate max-w-full">
                    {acc.id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Size & Motion Settings */}
        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                Large Text (Elder / Accessible)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Increases readable text size across forms and reports
              </span>
            </div>
            <button
              onClick={() => onUpdatePreferences({ fontSize: preferences.fontSize === 'large' ? 'normal' : 'large' })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                preferences.fontSize === 'large' ? 'bg-teal-700' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  preferences.fontSize === 'large' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                Reduced Motion
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Disables 3D shield spins and dynamic transitions
              </span>
            </div>
            <button
              onClick={() => onUpdatePreferences({ reducedMotion: !preferences.reducedMotion })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                preferences.reducedMotion ? 'bg-teal-700' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  preferences.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition"
          >
            Apply &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
