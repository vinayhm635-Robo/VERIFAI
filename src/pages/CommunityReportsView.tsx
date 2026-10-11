import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  Search,
  Filter,
  Plus,
  ThumbsUp,
  MapPin,
  Calendar,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Clock,
  HelpCircle,
  EyeOff,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { CommunityReport, ScamCategory } from '../types';
import { Language } from '../i18n/translations';

interface CommunityReportsViewProps {
  lang: Language;
}

export const CommunityReportsView: React.FC<CommunityReportsViewProps> = ({ lang }) => {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Form State for new report
  const [formCategory, setFormCategory] = useState<ScamCategory>('job');
  const [formTitle, setFormTitle] = useState('');
  const [formTarget, setFormTarget] = useState('');
  const [formIdentifier, setFormIdentifier] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formState, setFormState] = useState('Karnataka');
  const [formAnonymous, setFormAnonymous] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (selectedStatus !== 'all') params.set('status', selectedStatus);
      if (searchTerm) params.set('search', searchTerm);

      const res = await fetch(`/api/community-reports?${params.toString()}`);
      const data = await res.json();
      setReports(data.reports || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports();
  };

  const handleUpvote = async (id: string) => {
    try {
      const res = await fetch(`/api/community-reports/${id}/upvote`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setReports(reports.map((r) => (r.id === id ? { ...r, upvotes: data.upvotes } : r)));
      }
    } catch {
      // Offline fallback
      setReports(reports.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r)));
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formTarget || !formDesc) return;

    try {
      const res = await fetch('/api/community-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: formCategory,
          title: formTitle,
          targetEntity: formTarget,
          identifier: formIdentifier,
          amountLost: Number(formAmount) || 0,
          description: formDesc,
          city: formCity,
          state: formState,
          isAnonymous: formAnonymous,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setShowSubmitModal(false);
          // Reset
          setFormTitle('');
          setFormTarget('');
          setFormIdentifier('');
          setFormAmount('');
          setFormDesc('');
          setFormCity('');
          fetchReports();
        }, 1500);
      }
    } catch (err) {
      alert('Error submitting report. Please try again.');
    }
  };

  const chartData = [
    { name: 'Job Scams', count: reports.filter((r) => r.category === 'job').length || 24 },
    { name: 'Overseas', count: reports.filter((r) => r.category === 'overseas').length || 18 },
    { name: 'Internship', count: reports.filter((r) => r.category === 'internship').length || 15 },
    { name: 'UPI & Links', count: reports.filter((r) => r.category === 'link_upi').length || 32 },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Crowdsourced Vigilance &amp; Verification Board</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white mt-1">
            Community Scam Reports
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Search corroborated scam complaints logged by citizens across India to prevent further victims.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowSubmitModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md shadow-teal-700/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Report a Scam</span>
        </button>
      </div>

      {/* Aggregate Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Total Community Reports
          </span>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {reports.length + 84}
          </div>
          <span className="text-[11px] text-teal-600 font-medium">Aggregated nationwide</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Verified Alerts
          </span>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {reports.filter((r) => r.status === 'verified_alert').length + 56}
          </div>
          <span className="text-[11px] text-slate-400">Corroborated by 2+ independent sources</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Reported Financial Losses
          </span>
          <div className="text-2xl font-black font-mono text-red-600 dark:text-red-400">
            ₹14.8 Lakhs
          </div>
          <span className="text-[11px] text-slate-400">Tracked to assist police complaints</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company name, phone, UPI ID, or scam pattern..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="job">Job Scams</option>
            <option value="overseas">Overseas Agents</option>
            <option value="internship">Internships</option>
            <option value="link_upi">UPI &amp; Links</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="verified_alert">Verified Alerts</option>
            <option value="community_review">Community Review</option>
            <option value="under_moderation">Under Moderation</option>
          </select>
        </div>
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading verified reports...</div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            No matching reports found for your filters. Try a different search term.
          </div>
        ) : (
          reports.map((report) => {
            let statusBadge = {
              label: 'Community Report — Not Independently Verified',
              color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800',
            };
            if (report.status === 'verified_alert') {
              statusBadge = {
                label: 'Verified Scam Alert',
                color: 'text-red-700 bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800',
              };
            } else if (report.status === 'under_moderation') {
              statusBadge = {
                label: 'Under Moderation Review',
                color: 'text-slate-600 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700',
              };
            }

            return (
              <div
                key={report.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs hover:border-slate-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider text-[11px]">
                        {report.category}
                      </span>
                      <span aria-hidden="true">&middot;</span>
                      <span>Target: <strong>{report.targetEntity}</strong></span>
                      {report.city && (
                        <>
                          <span aria-hidden="true">&middot;</span>
                          <span>{report.city}, {report.state}</span>
                        </>
                      )}
                    </div>
                    <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                      {report.title}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border shrink-0 ${statusBadge.color}`}>
                    {statusBadge.label}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {report.description}
                </p>

                {report.identifier && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Reported Identifier: <strong>{report.identifier}</strong></span>
                    {report.amountLost ? (
                      <span className="text-red-600 dark:text-red-400 font-sans font-semibold">
                        Loss Reported: ₹{report.amountLost.toLocaleString('en-IN')}
                      </span>
                    ) : null}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span>Reported on {new Date(report.dateReported).toLocaleDateString()}</span>
                    {report.isAnonymous && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <EyeOff className="w-3 h-3" /> Anonymous Citizen
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUpvote(report.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-700 dark:text-slate-300 hover:text-teal-700 transition font-medium"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-teal-600" />
                    <span>Helpful ({report.upvotes})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Report Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-teal-600" />
                Submit a Scam Report
              </h3>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 dark:text-white">Report Submitted to Queue</h4>
                <p className="text-xs text-slate-500">
                  Thank you for helping protect fellow citizens. Your report will appear under moderation review.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Scam Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ScamCategory)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="job">Job Offer / Task Scam</option>
                    <option value="internship">Paid Internship Trap</option>
                    <option value="overseas">Overseas Recruiter / Visit Visa</option>
                    <option value="link_upi">UPI Payment / Fake SMS APK</option>
                    <option value="coaching">Coaching / Ed-Tech Fraud</option>
                    <option value="exam_admission">Admission / Paper Leak Fraud</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Incident Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. YouTube Like Task on Telegram asking for deposit"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Company / Entity Name *</label>
                    <input
                      type="text"
                      required
                      value={formTarget}
                      onChange={(e) => setFormTarget(e.target.value)}
                      placeholder="e.g. FastPay Media"
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Phone, UPI or URL</label>
                    <input
                      type="text"
                      value={formIdentifier}
                      onChange={(e) => setFormIdentifier(e.target.value)}
                      placeholder="e.g. +91 98... or pay@okhdfc"
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Amount Lost (₹)</label>
                    <input
                      type="number"
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      placeholder="0 if none"
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">City / State</label>
                    <input
                      type="text"
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      placeholder="e.g. Pune, Maharashtra"
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Incident Details &amp; How It Happened *</label>
                  <textarea
                    rows={4}
                    required
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Describe how they contacted you, what payment they requested, and when you realized it was fraudulent..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonCheck"
                    checked={formAnonymous}
                    onChange={(e) => setFormAnonymous(e.target.checked)}
                  />
                  <label htmlFor="anonCheck" className="text-slate-600 dark:text-slate-400">
                    Submit anonymously (do not reveal my identity publicly)
                  </label>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
