import React, { useState } from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  AlertTriangle,
  PhoneCall,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Volume2,
  VolumeX,
  Languages
} from 'lucide-react';
import { Language } from '../i18n/translations';
import { speakText, stopSpeaking } from '../utils/speech';

interface ParentModeViewProps {
  lang: Language;
}

export const ParentModeView: React.FC<ParentModeViewProps> = ({ lang }) => {
  const [selectedLang, setSelectedLang] = useState<'hi' | 'en'>(lang);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const goldenRules = [
    {
      ruleEn: 'Rule 1: NEVER Pay Money to Get a Job',
      ruleHi: 'नियम 1: नौकरी या इंटरव्यू पाने के लिए कभी एक रुपया भी न दें',
      descEn: 'Authentic Indian companies (TCS, Infosys, Wipro, Railways, Banks) NEVER charge registration fees, interview gate pass fees, or laptop security deposits. If they ask for money, it is 100% a scam.',
      descHi: 'असली कंपनियां (जैसे टीसीएस, इंफोसिस, रेलवे या बैंक) कभी भी रजिस्ट्रेशन फीस, गेट पास या लैपटॉप की सिक्योरिटी के नाम पर पैसे नहीं मांगतीं। अगर कोई पैसे मांग रहा है, तो वह धोखा है।'
    },
    {
      ruleEn: 'Rule 2: Government Jobs are NEVER Given on WhatsApp or Telegram',
      ruleHi: 'नियम 2: सरकारी नौकरी कभी भी व्हाट्सएप या टेलीग्राम पर नहीं मिलती',
      descEn: 'Official government posts are published only in the Employment News (रोजगार समाचार) and on official .gov.in or .nic.in portals with competitive exams. No minister or officer can give direct backdoor seats via WhatsApp.',
      descHi: 'सरकारी नौकरी केवल आधिकारिक वेबसाइट (.gov.in या .nic.in) और सरकारी परीक्षा के जरिए मिलती है। कोई भी अधिकारी व्हाट्सएप पर पैसे लेकर सीधी भर्ती नहीं करा सकता।'
    },
    {
      ruleEn: 'Rule 3: NEVER Enter Your UPI PIN to Receive Money',
      ruleHi: 'नियम 3: पैसे प्राप्त करने के लिए कभी भी यूपीआई पिन (UPI PIN) न डालें',
      descEn: 'Entering your UPI PIN or scanning a QR code ALWAYS transfers money OUT of your bank account. To receive money, you do not need to enter any PIN or scan any QR code.',
      descHi: 'यूपीआई पिन डालने या क्यूआर कोड स्कैन करने से आपके बैंक खाते से पैसे कटते हैं। पैसे आने के लिए पिन डालने की कोई जरूरत नहीं होती।'
    },
    {
      ruleEn: 'Rule 4: Beware of "Tourist Visa" for Foreign Jobs',
      ruleHi: 'नियम 4: विदेश में नौकरी के लिए "टूरिस्ट वीजा" के धोखे से बचें',
      descEn: 'If an agent tells your child to fly to Dubai, Saudi Arabia, or Malaysia on a visit visa and promises to convert it later, do not send them. Under Indian law, they must have an official Ministry of External Affairs (eMigrate) work visa.',
      descHi: 'यदि कोई एजेंट विजिट या टूरिस्ट वीजा पर विदेश भेजकर नौकरी दिलाने का वादा करे, तो कतई न जाएं। यह अवैध है और मानव तस्करी का गंभीर खतरा है।'
    }
  ];

  const handleAudioSummary = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToSpeak = selectedLang === 'hi'
        ? 'अभिभावक सुरक्षा नियम: नियम एक: नौकरी के लिए कभी पैसे न दें। नियम दो: सरकारी नौकरी कभी व्हाट्सएप पर नहीं मिलती। नियम तीन: पैसे पाने के लिए कभी यूपीआई पिन न डालें। आपातकालीन साइबर हेल्पलाइन उन्नीस सौ तीस पर तुरंत कॉल करें।'
        : 'Parent safety advice: Rule one: never pay money for a job. Rule two: govt jobs are never offered on WhatsApp. Rule three: never enter your UPI PIN to receive money. For urgent fraud, call 1930.';
      speakText(textToSpeak, selectedLang, () => setIsPlayingAudio(false));
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-teal-500/10 border-2 border-amber-500/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
                {selectedLang === 'hi' ? 'अभिभावक सहायता मोड (Parent Mode)' : 'Parent & Family Guidance Mode'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {selectedLang === 'hi'
                  ? 'माता-पिता के लिए आसान और बड़े अक्षरों में सलाह'
                  : 'High-contrast, plain-language digital safety rules for parents'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedLang(selectedLang === 'hi' ? 'en' : 'hi')}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 shadow-sm"
            >
              <Languages className="w-4 h-4 text-amber-600" />
              <span>{selectedLang === 'hi' ? 'Switch to English' : 'हिंदी में पढ़ें'}</span>
            </button>

            <button
              type="button"
              onClick={handleAudioSummary}
              className="px-3.5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-amber-700 transition"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'Stop' : 'Listen Aloud'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Call Action */}
      <div className="p-6 rounded-3xl bg-red-600 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-lg font-heading font-bold">
            <PhoneCall className="w-6 h-6 animate-pulse" />
            <span>
              {selectedLang === 'hi'
                ? 'यदि किसी ने पैसे भेज दिए हैं, तो तुरंत 1930 पर कॉल करें'
                : 'If someone has already transferred money, dial 1930 immediately'}
            </span>
          </div>
          <p className="text-xs text-red-100 max-w-xl">
            {selectedLang === 'hi'
              ? 'यह भारत सरकार की राष्ट्रीय साइबर अपराध हेल्पलाइन है। घटना के 2 घंटे के अंदर कॉल करने से बैंक खाता तुरंत फ्रीज किया जा सकता है।'
              : 'National Cyber Crime Reporting Helpline. Calling within the golden hour helps police freeze the fraudulent bank account.'}
          </p>
        </div>
        <a
          href="tel:1930"
          className="px-6 py-3 rounded-2xl bg-white text-red-700 font-extrabold text-sm shadow-md hover:bg-red-50 transition shrink-0"
        >
          Call 1930 Now
        </a>
      </div>

      {/* Four Golden Rules in Large, High-Contrast Typography */}
      <div className="space-y-4">
        {goldenRules.map((rule, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 space-y-3 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center text-sm font-mono">
                {idx + 1}
              </span>
              <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">
                {selectedLang === 'hi' ? rule.ruleHi : rule.ruleEn}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-12">
              {selectedLang === 'hi' ? rule.descHi : rule.descEn}
            </p>
          </div>
        ))}
      </div>

      {/* Checklist Before Sending Any Document */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          {selectedLang === 'hi'
            ? 'बच्चों के दस्तावेज साझा करने से पहले की सावधानियां'
            : 'Precaution Checklist Before Sharing Documents'}
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-1" />
            <span>कभी भी आधार कार्ड की बिना मास्क वाली प्रति या बैंक पासबुक व्हाट्सएप पर अजनबी को न भेजें।</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-1" />
            <span>कॉलेज एडमिशन के लिए हमेशा कॉलेज के आधिकारिक कैंपस या राज्य की काउंसलिंग वेबसाइट से ही फीस भरें।</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-1" />
            <span>यदि कोई फोन पर डराए कि आपका बेटा/बेटी पुलिस कस्टडी में है, तो पहले सीधे अपने बच्चे को कॉल करके जांचें (डिजिटल अरेस्ट स्कैम)।</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
