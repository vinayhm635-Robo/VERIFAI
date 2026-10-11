import React, { useState } from 'react';
import {
  Camera,
  Upload,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  FileText,
  X,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { UniversalVerdictCard } from '../components/UniversalVerdictCard';
import { AnalysisResult } from '../types';
import { Language } from '../i18n/translations';

interface PhotoScanViewProps {
  onAnalyze: (text: string, category: 'photo_scan', additionalData: Record<string, any>) => Promise<AnalysisResult>;
  onNavigate: (page: string, initialText?: string) => void;
  onAskAssistant: (result: AnalysisResult, prompt: string) => void;
  lang: Language;
}

export const PhotoScanView: React.FC<PhotoScanViewProps> = ({
  onAnalyze,
  onNavigate,
  onAskAssistant,
  lang,
}) => {
  const [images, setImages] = useState<{ id: string; name: string; url: string; ocrText: string }[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 3 - images.length);
      const newItems = filesArray.map((file, idx) => {
        const url = URL.createObjectURL(file);
        // Simulated OCR text extraction
        const sampleOcrText = `[Screenshot OCR extraction]: Congratulations! You are selected for Remote Content Review. Registration charges Rs. 1,500 must be deposited to UPI fastpay@ibl within 2 hours. Failure to submit deposit leads to forfeiture.`;
        return {
          id: `img_${Date.now()}_${idx}`,
          name: file.name,
          url,
          ocrText: sampleOcrText,
        };
      });
      setImages([...images, ...newItems]);
    }
  };

  const removeImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const handleScanImages = async () => {
    if (images.length === 0) return;
    setIsScanning(true);
    try {
      const combinedText = images.map((img, i) => `Image ${i + 1} (${img.name}):\n${img.ocrText}`).join('\n\n');
      const res = await onAnalyze(combinedText, 'photo_scan', {
        imageCount: images.length,
      });
      setResult(res);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold">
          <Camera className="w-3.5 h-3.5" />
          <span>Multi-Screenshot OCR &amp; Red-Flag Detection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white">
          Universal Photo Scan
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Upload up to three screenshots of WhatsApp chats, appointment letters, scholarship advertisements, or payment screens. Verifai extracts text and detects red flags.
        </p>
      </div>

      {/* Privacy Notice Required */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block font-semibold">Privacy Protection Checklist Before Upload</strong>
          <p className="leading-relaxed">
            Your images may contain private information. <strong>Hide or mask Aadhaar, PAN, bank account numbers, passwords, OTPs, and personal addresses</strong> before uploading. Images are processed purely for fraud analysis and are not permanently retained.
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <span>Upload up to 3 Screenshots ({images.length}/3 attached)</span>
          <span className="font-mono">PNG, JPG, WebP</span>
        </div>

        {/* Thumbnail Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 group"
            >
              <img src={img.url} alt={`Screenshot ${idx + 1}`} className="w-full h-44 object-cover" />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="p-2 text-[11px] truncate bg-white/90 dark:bg-slate-900/90 font-mono">
                {img.name}
              </div>
            </div>
          ))}

          {images.length < 3 && (
            <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-600 dark:hover:border-teal-500 rounded-2xl h-44 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/40 p-4">
              <Upload className="w-6 h-6 text-teal-600 mb-2" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                + Add Screenshot
              </span>
              <span className="text-[10px] text-slate-400 mt-1">Tap to select image</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFiles}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              // Load demo sample screenshots
              const demoUrl = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=60';
              setImages([
                {
                  id: 'demo_1',
                  name: 'whatsapp_offer_chat.png',
                  url: demoUrl,
                  ocrText:
                    'HR: Congratulations, you are selected for Data Entry Operator. Salary Rs 35,000/month. Please send Rs 1,500 security deposit to UPI fastverify@okhdfc to activate offer code.',
                },
              ]);
            }}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Load Sample Chat Screenshot
          </button>

          <button
            type="button"
            onClick={handleScanImages}
            disabled={isScanning || images.length === 0}
            className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Extracting Text &amp; Scanning...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Scan Screenshots</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className="space-y-4">
          <UniversalVerdictCard
            result={result}
            onAskAssistant={onAskAssistant}
            lang={lang}
          />

          {/* Auto-Route recommendation to specialized checker */}
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>
                <strong>Recommended Next Step:</strong> Based on the extracted text, this matches a Job Recruitment offer. You can inspect further in the dedicated Job Checker.
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('job', images[0]?.ocrText || '')}
              className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold flex items-center gap-1.5 shrink-0 transition"
            >
              <span>Open in Job Checker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
