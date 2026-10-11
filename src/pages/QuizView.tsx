import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../types';
import { Language } from '../i18n/translations';

interface QuizViewProps {
  lang: Language;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    scenario: 'You receive a WhatsApp message from a recruiter claiming to be from Amazon India offering ₹3,500/day for liking YouTube videos. They ask you to deposit a ₹1,200 "activation fee" on Telegram. What should you do?',
    scenarioHi: 'आपको अमेज़न इंडिया के नाम से व्हाट्सएप पर मैसेज आता है कि यूट्यूब वीडियो लाइक करने के ₹3,500 प्रतिदिन मिलेंगे, लेकिन शुरू करने के लिए टेलीग्राम पर ₹1,200 जमा करने होंगे। आपको क्या करना चाहिए?',
    options: [
      {
        id: 'a',
        text: 'Pay the ₹1,200 because it is a small amount and you will recover it on the first day.',
        textHi: '₹1,200 दे दें क्योंकि यह छोटी रकम है और पहले दिन ही वापस मिल जाएगी।',
        isCorrect: false,
        explanation: 'Paying opens you to continuous extortion; they will request larger deposits before disappearing.',
        explanationHi: 'पैसे देने से वे बाद में और बड़ी रकम मांगेंगे और गायब हो जाएंगे।'
      },
      {
        id: 'b',
        text: 'Block the sender immediately and report the number on Chakshu (sancharsaathi.gov.in).',
        textHi: 'तुरंत नंबर ब्लॉक करें और चक्षु पोर्टल (sancharsaathi.gov.in) पर रिपोर्ट करें।',
        isCorrect: true,
        explanation: 'Correct! This is a classic "task scam". Legitimate companies never hire on Telegram or demand upfront activation fees.',
        explanationHi: 'बिल्कुल सही! असली कंपनियां टेलीग्राम पर पैसे लेकर काम नहीं देतीं।'
      },
      {
        id: 'c',
        text: 'Ask them to deduct ₹1,200 from your first salary payout.',
        textHi: 'उनसे कहें कि ₹1,200 पहले वेतन में से काट लें।',
        isCorrect: false,
        explanation: 'Scammers will refuse because their entire objective is extracting advance UPI payments.',
        explanationHi: 'धोखेबाज ऐसा नहीं करेंगे क्योंकि उनका मुख्य मकसद आपसे अग्रिम पैसे लेना है।'
      }
    ]
  },
  {
    id: 2,
    scenario: 'A buyer on OLX wants to purchase your old sofa and sends a QR code via WhatsApp saying: "Scan this QR and enter your UPI PIN to receive ₹8,000 into your bank account." What happens if you scan and enter your PIN?',
    scenarioHi: 'ओएलएक्स पर कोई व्यक्ति आपका पुराना सोफा खरीदना चाहता है और कहता है: "पैसे पाने के लिए यह क्यूआर कोड स्कैन करके अपना यूपीआई पिन डालें।" ऐसा करने पर क्या होगा?',
    options: [
      {
        id: 'a',
        text: '₹8,000 will be credited directly to your bank account.',
        textHi: '₹8,000 सीधे आपके बैंक खाते में जमा हो जाएंगे।',
        isCorrect: false,
        explanation: 'You never enter your UPI PIN to receive money.',
        explanationHi: 'पैसे पाने के लिए कभी यूपीआई पिन की जरूरत नहीं होती।'
      },
      {
        id: 'b',
        text: '₹8,000 will be DEDUCTED from your bank account immediately.',
        textHi: 'तुरंत आपके बैंक खाते से ₹8,000 कट जाएंगे।',
        isCorrect: true,
        explanation: 'Entering your UPI PIN authorizes a withdrawal. You NEVER enter a PIN to receive funds in India.',
        explanationHi: 'सही! यूपीआई पिन डालते ही आपके खाते से पैसे कट जाते हैं। पैसे प्राप्त करने के लिए पिन नहीं डाला जाता।'
      },
      {
        id: 'c',
        text: 'Your bank will hold the transaction until you confirm OTP.',
        textHi: 'बैंक इसे तब तक रोके रखेगा जब तक आप ओटीपी नहीं देते।',
        isCorrect: false,
        explanation: 'UPI PIN is the final authentication factor; funds are debited instantly without a secondary OTP.',
        explanationHi: 'यूपीआई पिन ही अंतिम मंजूरी है, तुरंत पैसे कट जाते हैं।'
      }
    ]
  },
  {
    id: 3,
    scenario: 'An overseas agent promises a hotel job in Dubai with ₹75,000 salary, asking for ₹40,000 advance. They state you will travel on a 30-day Tourist/Visit visa and convert it after reaching Dubai. Is this safe?',
    scenarioHi: 'एक एजेंट दुबई में ₹75,000 वेतन का होटल जॉब देकर ₹40,000 एडवांस मांगता है और कहता है कि विजिट वीजा पर जाकर बाद में वर्क परमिट में बदल देंगे। क्या यह सुरक्षित है?',
    options: [
      {
        id: 'a',
        text: 'Dangerous and illegal. Travelling for employment on a visit visa violates Indian law and risks deportation.',
        textHi: 'अत्यंत खतरनाक और अवैध। विजिट वीजा पर नौकरी करने जाना कानूनन गलत है और मानव तस्करी का खतरा है।',
        isCorrect: true,
        explanation: 'Under the Emigration Act, workers must travel on valid employment visas verified by MEA eMigrate.',
        explanationHi: 'विदेश में काम करने के लिए केवल विदेश मंत्रालय (MEA) द्वारा पंजीकृत वर्क वीजा ही मान्य होता है।'
      },
      {
        id: 'b',
        text: 'Safe if the agent provides their Aadhaar card.',
        textHi: 'सुरक्षित है यदि एजेंट अपना आधार कार्ड दे दे।',
        isCorrect: false,
        explanation: 'Aadhaar cards can be forged or stolen; only an active MEA eMigrate license protects workers.',
        explanationHi: 'आधार कार्ड फर्जी भी हो सकता है, सिर्फ eMigrate लाइसेंस ही मान्य है।'
      }
    ]
  },
  {
    id: 4,
    scenario: 'An Ed-tech coaching institute advertises "100% Guaranteed Selection in UPSC Prelims or 100% Refund", but the enrollment form fine print states: "Fees once paid are non-refundable under any circumstances." What is this practice called?',
    scenarioHi: 'एक कोचिंग संस्थान "100% यूपीएससी चयन या पूरा पैसा वापस" का दावा करता है, लेकिन फॉर्म में लिखता है "किसी भी स्थिति में फीस वापस नहीं होगी।" यह क्या है?',
    options: [
      {
        id: 'a',
        text: 'Misleading and unfair trade practice prohibited under Central Consumer Protection Authority (CCPA) guidelines.',
        textHi: 'केंद्रीय उपभोक्ता संरक्षण प्राधिकरण (CCPA) के नियमों के तहत प्रतिबंधित भ्रामक विज्ञापन।',
        isCorrect: true,
        explanation: 'CCPA strictly prohibits absolute selection guarantees and conflicting refund disclaimers.',
        explanationHi: 'उपभोक्ता संरक्षण नियमों के अनुसार 100% चयन की गारंटी देना गैरकानूनी है।'
      },
      {
        id: 'b',
        text: 'Standard legal marketing accepted across coaching hubs.',
        textHi: 'कोचिंग संस्थानों में चलने वाला सामान्य मार्केटिंग तरीका।',
        isCorrect: false,
        explanation: 'Regulatory bodies issue penalty notices for such misleading claims.',
        explanationHi: 'सरकार ऐसे भ्रामक दावों पर भारी जुर्माना लगाती है।'
      }
    ]
  },
  {
    id: 5,
    scenario: 'An SMS arrives: "Dear consumer, your electricity will be disconnected tonight at 9:30 PM due to unpaid bill. Immediately download our update APK at bit.ly/bijli-update". What is the true danger of this APK?',
    scenarioHi: 'एसएमएस आता है: "प्रिय उपभोक्ता, बिजली बिल न भरने के कारण आज रात 9:30 बजे बिजली काट दी जाएगी। तुरंत bit.ly/bijli-update से ऐप डाउनलोड करें।" इस ऐप का असली खतरा क्या है?',
    options: [
      {
        id: 'a',
        text: 'It is a malicious trojan APK that accesses your SMS messages and steals banking OTPs to drain your account.',
        textHi: 'यह एक खतरनाक मैलवेयर ऐप है जो आपके एसएमएस पढ़कर बैंकिंग ओटीपी चुराता है और खाता खाली कर देता है।',
        isCorrect: true,
        explanation: 'Electricity boards never distribute APK files via SMS shorteners or threaten immediate night disconnections.',
        explanationHi: 'बिजली विभाग कभी भी ऐसे लिंक से ऐप डाउनलोड करने को नहीं कहता।'
      },
      {
        id: 'b',
        text: 'It only checks your meter reading.',
        textHi: 'यह केवल मीटर रीडिंग की जांच करता है।',
        isCorrect: false,
        explanation: 'Power disconnections follow statutory written notices, never instant WhatsApp/SMS APK threats.',
        explanationHi: 'यह एक प्रमाणित साइबर हमला है।'
      }
    ]
  }
];

export const QuizView: React.FC<QuizViewProps> = ({ lang }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelect = (optId: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(optId);

    const chosen = currentQ.options.find((o) => o.id === optId);
    if (chosen?.isCorrect) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsCompleted(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold">
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Interactive Digital Safety Evaluation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white">
          Indian Scam Awareness Quiz
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Test your ability to spot real-world scams circulating on WhatsApp, OLX, Telegram, and recruitment portals.
        </p>
      </div>

      {!isCompleted ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          {/* Progress Tracker */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>
              Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <span>Current Score: {score}</span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-teal-600 h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Scenario Text */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Scenario #{currentIdx + 1}
            </span>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-slate-900 dark:text-white leading-relaxed">
              {lang === 'hi' ? currentQ.scenarioHi : currentQ.scenario}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((opt) => {
              const isChosen = selectedOption === opt.id;
              let btnStyle = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60';

              if (selectedOption !== null) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
                } else if (isChosen && !opt.isCorrect) {
                  btnStyle = 'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-900 dark:text-red-200';
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelect(opt.id)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition flex items-start gap-3 ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 font-bold flex items-center justify-center shrink-0 uppercase text-xs">
                    {opt.id}
                  </span>
                  <span className="leading-relaxed flex-1">
                    {lang === 'hi' ? opt.textHi : opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explanation if answered */}
          {selectedOption !== null && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-white">Explanation:</span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentQ.options.find((o) => o.id === selectedOption)?.explanation}
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold flex items-center gap-1.5 transition"
                >
                  <span>{currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Final Score'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Completion Screen */
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-6 shadow-sm">
          <div className="w-20 h-20 rounded-3xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 mx-auto flex items-center justify-center shadow-lg">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              Quiz Completed!
            </h3>
            <p className="text-slate-500 text-sm">
              You scored <strong className="text-teal-700 dark:text-teal-400 text-lg">{score}</strong> out of {QUIZ_QUESTIONS.length}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 max-w-md mx-auto leading-relaxed">
            {score === 5
              ? 'Outstanding! You have expert-level scam vigilance and understand Indian cyber regulations thoroughly.'
              : score >= 3
              ? 'Good awareness! Keep remembering the golden rules: never pay for jobs and never enter UPI PIN to receive money.'
              : 'Review the golden rules in Parent Mode to strengthen your defense against common digital scams.'}
          </div>

          <div className="pt-2 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={restartQuiz}
              className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
