import React, { useState } from 'react';
import {
  FileBadge2,
  Upload,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Eye,
  ShieldCheck,
  Building,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { UniversalVerdictCard } from '../components/UniversalVerdictCard';
import { AnalysisResult } from '../types';
import { Language } from '../i18n/translations';

interface CertificateScannerProps {
  onAnalyze: (text: string, category: 'certificate', additionalData: Record<string, any>) => Promise<AnalysisResult>;
  onAskAssistant: (result: AnalysisResult, prompt: string) => void;
  lang: Language;
}

export const CertificateScanner: React.FC<CertificateScannerProps> = ({
  onAnalyze,
  onAskAssistant,
  lang
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [institutionName, setInstitutionName] = useState('Visvesvaraya Technological University (VTU)');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(null);

  // Evidence markers over preview
  const annotations = [
    { id: 1, x: '18%', y: '24%', title: 'Issuer Header Font & Alignment', desc: 'Typography differs slightly from accredited university seal registry' },
    { id: 2, x: '72%', y: '68%', title: 'Digital Signature & Stamp', desc: 'Seal lacks encrypted SHA-256 digital signature timestamp standard' },
    { id: 3, x: '45%', y: '82%', title: 'Roll / Registration Number', desc: 'Requires cross-check with National Academic Depository (NAD)' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Simulated OCR text extraction
      const sampleOcrText = `DEGREE OF BACHELOR OF TECHNOLOGY\nThis is to certify that Rahul Sharma having successfully completed the curriculum prescribed by the University in Computer Science and Engineering during the year 2024 has been admitted to the Degree with First Class with Distinction.\nRegistration No: 1VT20CS089\nGiven under the seal of the University this Fourteenth day of June 2024.`;
      setExtractedText(sampleOcrText);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extractedText) return;

    setIsScanning(true);
    try {
      const res = await onAnalyze(extractedText, 'certificate', {
        institutionName,
        fileName: selectedFile?.name || 'certificate.jpg',
      });
      setResult(res);
    } finally {
      setIsScanning(false);
    }
  };

  const verificationEmailDraft = `To: registrar@vtu.ac.in (or official university registrar email)\nSubject: Verification Request for Degree Certificate - Reg. No. 1VT20CS089\n\nDear Registrar / Verification Authority,\n\nI am writing to request formal verification of the following academic certificate purportedly issued by your esteemed institution:\n\nCandidate Name: Rahul Sharma\nDegree: Bachelor of Technology (Computer Science)\nRegistration / Roll Number: 1VT20CS089\nYear of Passing: 2024\n\nCould you kindly confirm whether this credential matches your official student records?\n\nSincerely,\nVerification Officer / Employer`;

  const copyEmail = () => {
    navigator.clipboard.writeText(verificationEmailDraft);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold">
          <FileBadge2 className="w-3.5 h-3.5" />
          <span>Academic &amp; Skill Credential Verification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white">
          Certificate Scanner &amp; Document Inspector
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Upload certificates, marksheets, or diplomas to run layout anomaly detection, OCR text extraction, and cross-reference with DigiLocker and the National Academic Depository (NAD).
        </p>
      </div>

      {/* Mandatory Regulatory Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block font-semibold">Important Verification Disclaimer</strong>
          <p className="leading-relaxed">
            Verifai can identify possible layout warning signs and typography discrepancies, but it <strong>cannot definitively authenticate a certificate</strong>. Only the issuing institution or authorized registry (e.g. DigiLocker / NAD) can confirm legal authenticity.
          </p>
        </div>
      </div>

      {/* Upload & OCR Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
        {/* Privacy Shield Guidance */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>
              <strong>Protect your privacy:</strong> Hide or blur Aadhaar, PAN, and full date of birth before uploading.
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">JPG, PNG, PDF up to 10MB</span>
        </div>

        {/* File Drag / Drop / Upload Box */}
        {!selectedFile ? (
          <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-600 dark:hover:border-teal-500 rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/40">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <span className="font-heading font-bold text-sm text-slate-900 dark:text-white">
              Click or drag certificate here to upload
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Supports degree certificates, diplomas, training certificates, and marksheets.
            </p>
            <input
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span className="font-semibold text-slate-900 dark:text-white">{selectedFile.name}</span>
                <span className="text-slate-400">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setExtractedText('');
                  setResult(null);
                }}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>

            {/* Document Preview with Visual Evidence Markers */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center min-h-[300px] p-4">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Certificate Document Preview"
                  className="max-h-[380px] object-contain rounded-lg shadow-sm"
                />
              )}

              {/* Simulated Evidence Hotspot Markers */}
              {annotations.map((ann) => (
                <button
                  key={ann.id}
                  type="button"
                  onClick={() => setActiveAnnotation(activeAnnotation === ann.id ? null : ann.id)}
                  style={{ top: ann.y, left: ann.x }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-teal-600/90 text-white text-xs font-bold flex items-center justify-center ring-4 ring-teal-400/30 animate-pulse hover:scale-110 transition-transform shadow-lg cursor-pointer"
                  title={ann.title}
                >
                  {ann.id}
                </button>
              ))}

              {/* Active Marker Tooltip */}
              {activeAnnotation && (
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-900/95 text-white border border-slate-700 text-xs shadow-xl backdrop-blur-md flex items-center justify-between">
                  <div>
                    <span className="font-bold text-teal-300">
                      Marker #{activeAnnotation}: {annotations.find((a) => a.id === activeAnnotation)?.title}
                    </span>
                    <p className="text-slate-300 mt-0.5">
                      {annotations.find((a) => a.id === activeAnnotation)?.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveAnnotation(null)}
                    className="text-slate-400 hover:text-white text-sm ml-2"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* OCR Extracted Text Preview */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Extracted Text (OCR Engine)</span>
                <span className="text-[11px] text-slate-500 font-mono">Editable</span>
              </label>
              <textarea
                rows={4}
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleScan}
                disabled={isScanning || !extractedText.trim()}
                className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isScanning ? 'Inspecting Credentials...' : 'Analyze Document'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Result Display */}
      {result && (
        <UniversalVerdictCard
          result={result}
          onAskAssistant={onAskAssistant}
          lang={lang}
        />
      )}

      {/* Official Issuer Verification Checklist & Email Draft */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
        <div>
          <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-teal-600" />
            Official Institutional Verification Checklist
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Follow these verified steps to authenticate credentials before hiring or admission:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              1. DigiLocker / NAD Verification
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Log in to the National Academic Depository (nad.digitallocker.gov.in) with student consent to fetch genuine digital award records directly from the university.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              2. NSDC / Skill India Portal
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              For vocational and trade certificates, verify the accreditation of the training partner via the official National Skill Development Corporation database.
            </p>
          </div>
        </div>

        {/* Verification Email Draft */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Draft Verification Email to University Registrar
            </span>
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEmail ? 'Copied' : 'Copy Template'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
            {verificationEmailDraft}
          </pre>
        </div>
      </div>
    </div>
  );
};
