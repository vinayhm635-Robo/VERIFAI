import { AnalysisResult, ScamCategory, SuspiciousPhrase, VerificationLink } from '../types';

interface AnalysisOptions {
  text: string;
  category: ScamCategory;
  additionalData?: Record<string, any>;
}

// Indian scam red-flag keywords and heuristics
const HIGH_RISK_PATTERNS = [
  { pattern: /(registration|interview|gate|security|laptop|documentation|processing)\s+(fee|deposit|charges?|amount)/i, reason: 'Legitimate employers never demand registration, processing, or laptop deposits before or during hiring.' },
  { pattern: /pay\s+(rs\.?|inr|₹)?\s*\d+\s*(first|advance|before|to get)/i, reason: 'Demanding upfront money to receive an offer letter or job is a classic recruitment scam pattern.' },
  { pattern: /(telegram|whatsapp\s+only|message\s+on\s+telegram)/i, reason: 'Conducting official hiring strictly via Telegram or informal WhatsApp groups is a major indicator of task fraud.' },
  { pattern: /(youtube\s+like|subscribe\s+channel|hotel\s+review|rating\s+task|daily\s+income\s+₹?[0-9]{3,5})/i, reason: 'Known part-time task scam: promises money for liking YouTube videos or writing reviews, later locking your funds.' },
  { pattern: /(100%\s*(job\s*guarantee|placement\s*guarantee|selection\s*guarantee))/i, reason: 'No legitimate institute or coaching center can legally guarantee 100% govt. or corporate selection.' },
  { pattern: /(paper\s*leak|question\s*paper\s*before\s*exam|confirm\s*neet|direct\s*admission\s*management\s*quota)/i, reason: 'Selling leaked exam question papers or unverified backdoor admissions is illegal and fraudulent.' },
  { pattern: /(tourist\s*visa|visit\s*visa)\s*(to|for)?\s*work/i, reason: 'Working on a tourist or visit visa abroad is illegal and a dangerous human-trafficking trap.' },
  { pattern: /(hold\s*passport|deposit\s*original\s*passport)/i, reason: 'Withholding an employee passport is prohibited under Indian law (Emigration Act) and international labour standards.' },
  { pattern: /(otp|upi\s*pin|send\s*screenshot\s*of\s*qr|scan\s*to\s*receive\s*money)/i, reason: 'You never need to enter your UPI PIN or scan a QR code to RECEIVE money. This is an active theft attempt.' },
  { pattern: /(@gmail\.com|@yahoo\.com|@outlook\.com|@hotmail\.com)/i, reason: 'Large corporate recruiters (TCS, Infosys, Amazon, etc.) use custom corporate domains, not free webmail.' }
];

export function analyzeContent(options: AnalysisOptions): AnalysisResult {
  const { text, category, additionalData } = options;
  const lowerText = (text || '').toLowerCase();
  const id = `scan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();

  // If input is practically empty
  if (!text || text.trim().length < 15) {
    return {
      id,
      category,
      title: 'Insufficient Data for Analysis',
      riskScore: 25,
      riskLevel: 'insufficient_info',
      verdictLabel: 'Not Enough Information to Assess',
      verdictLabelHi: 'सटीक आकलन के लिए पर्याप्त जानकारी नहीं है',
      summary: 'Please provide more message details, email contents, company names, or website links to perform a reliable analysis.',
      summaryHi: 'कृपया सटीक जांच के लिए मैसेज का पूरा विवरण, ईमेल सामग्री या कंपनी का नाम दर्ज करें।',
      confidence: 'Insufficient',
      evidenceFound: ['Input contains fewer than 15 characters', 'No identifiable recruiter, institution or payment details'],
      evidenceFoundHi: ['इनपुट बहुत संक्षिप्त है', 'सत्यापन योग्य कोई विवरण नहीं मिला'],
      suspiciousPhrases: [],
      recommendedSteps: [
        'Ask the recruiter or sender for a formal offer letter with corporate registration (CIN) details.',
        'Obtain an official corporate email address.'
      ],
      officialLinks: getOfficialLinksForCategory(category),
      submittedText: text,
      timestamp,
      safeReplyDraft: 'Hello, could you please send the official employment offer from your corporate email domain and specify your company CIN registration number?',
      cybercrimeComplaintDraft: 'N/A'
    };
  }

  let baseScore = 15;
  const evidence: string[] = [];
  const evidenceHi: string[] = [];
  const phrases: SuspiciousPhrase[] = [];

  // 1. Check High Risk Patterns
  for (const item of HIGH_RISK_PATTERNS) {
    if (item.pattern.test(text)) {
      const match = text.match(item.pattern);
      const matchedString = match ? match[0] : '';
      baseScore += 22;
      evidence.push(item.reason);
      if (matchedString) {
        phrases.push({
          text: matchedString,
          reason: item.reason,
          severity: 'high'
        });
      }
    }
  }

  // 2. Category Specific Checks
  if (category === 'job') {
    if (/urgent|immediate\s+joining|today\s+only|offer\s+expires\s+in\s+\d+\s+hours?/i.test(text)) {
      baseScore += 12;
      evidence.push('Artificial urgency: Forcing you to decide within hours to prevent background checking.');
    }
    if (additionalData?.interviewOccurred === false || /no\s+interview|direct\s+selection/i.test(text)) {
      baseScore += 25;
      evidence.push('Direct job selection without technical interview or HR verification.');
    }
    if (/salary\s*:\s*(₹|rs\.?)?\s*([5-9]\d{4}|[1-9]\d{5,})\s*(per\s*day|daily)/i.test(text)) {
      baseScore += 28;
      evidence.push('Unrealistic remuneration: Daily wages promised are absurdly above market standard for entry-level work.');
    }
  } else if (category === 'internship') {
    if (/certificate\s*(fee|charges?)|pay\s*₹?\d+\s*for\s*(internship|certificate)/i.test(text)) {
      baseScore += 35;
      evidence.push('Pay-to-intern scam: charging candidates to work rather than providing genuine mentorship and stipend.');
    }
    if (/guaranteed\s*(placement|stipend\s*of\s*₹?\d+)/i.test(text)) {
      baseScore += 18;
      evidence.push('Unverified placement guarantee attached to paid certificate issuance.');
    }
  } else if (category === 'overseas') {
    if (/tourist\s*visa|visit\s*visa/i.test(text) || additionalData?.visaType === 'tourist') {
      baseScore += 45;
      evidence.push('CRITICAL: Deploying workers abroad on Tourist/Visit Visa violates Indian Emigration Act and risks detention/deportation.');
    }
    if (/advance\s*(cash|fee|charges?)|processing\s*fee\s*₹?\d{5,}/i.test(text)) {
      baseScore += 30;
      evidence.push('Demanding large upfront cash fees without written protector-general compliant agreement.');
    }
    if (!additionalData?.raNumber && !/ra\s*no|b-\d{4}/i.test(text)) {
      baseScore += 20;
      evidence.push('No Ministry of External Affairs (MEA) Recruiting Agent (RA) registration number provided.');
    }
  } else if (category === 'link_upi') {
    if (/@(paytm|okaxis|okhdfc|oksbi|ibl|ybl|upi|apl)/i.test(text)) {
      evidence.push('Personal or merchant UPI Virtual Payment Address (VPA) detected.');
    }
    if (/(bit\.ly|tinyurl|is\.gd|cutt\.ly|t\.co|wa\.me)/i.test(text)) {
      baseScore += 25;
      evidence.push('Obfuscated URL / Shortener: masks the actual destination website to evade security scanners.');
    }
    if (/(\.xyz|\.top|\.club|\.online|\.site|\.vip|\.click|\.live)/i.test(text)) {
      baseScore += 20;
      evidence.push('High-risk top-level domain frequently utilized in phishing operations.');
    }
    if (/(kyc|pan\s*update|sim\s*block|electricity\s*bill|apk|download\s*app)/i.test(text)) {
      baseScore += 35;
      evidence.push('Impersonation phishing keywords targeting Indian banking/telecom customers.');
    }
  } else if (category === 'coaching') {
    if (/100%\s*(selection|selection\s*in\s*upsc|guaranteed\s*seat)/i.test(text)) {
      baseScore += 30;
      evidence.push('Prohibited advertisement claim under Central Consumer Protection Authority (CCPA) guidelines.');
    }
    if (/no\s*refund|fees\s*once\s*paid\s*never\s*refunded/i.test(text)) {
      baseScore += 15;
      evidence.push('Blanket non-refundable clauses without statutory cooling-off periods.');
    }
  } else if (category === 'certificate') {
    evidence.push('Document text parsed. Verification against National Academic Depository (NAD) / DigiLocker required.');
    if (/issued\s*instantly|no\s*exam\s*needed|backdated/i.test(text)) {
      baseScore += 45;
      evidence.push('Claims of backdated or instant issuance without academic session records.');
    }
  } else if (category === 'exam_admission') {
    if (/direct\s*admission|management\s*quota\s*advance|leak/i.test(text)) {
      baseScore += 40;
      evidence.push('Fraudulent seat allocation or paper leak solicitation.');
    }
  }

  // Cap score between 5 and 98
  const riskScore = Math.min(98, Math.max(8, baseScore));
  
  let riskLevel: 'safe' | 'caution' | 'danger' = 'safe';
  let verdictLabel = 'Likely Genuine — Still Verify';
  let verdictLabelHi = 'संभवतः असली — फिर भी पुष्टि करें';

  if (riskScore >= 70) {
    riskLevel = 'danger';
    verdictLabel = 'Likely Fake / High Risk — Do Not Pay';
    verdictLabelHi = 'अत्यधिक जोखिम / संभावित फर्जीवाड़ा — पैसे न दें';
  } else if (riskScore >= 30) {
    riskLevel = 'caution';
    verdictLabel = 'Be Careful — Verify Before Proceeding';
    verdictLabelHi = 'सावधान रहें — आगे बढ़ने से पहले जांचें';
  }

  const confidence = evidence.length >= 3 ? 'High' : evidence.length >= 1 ? 'Medium' : 'Low';

  // Summaries
  let summary = '';
  let summaryHi = '';
  if (riskLevel === 'danger') {
    summary = `Multiple high-severity warning signs detected (${evidence.length} red flags). This matches documented scam patterns reported across India. Under no circumstances should you transfer money, share your Aadhaar/PAN, or install third-party APKs.`;
    summaryHi = `इस प्रस्ताव में कई गंभीर लाल झंडे (${evidence.length} चेतावनियां) पाए गए हैं। यह भारत में प्रचलित फर्जीवाड़े के तरीकों से मेल खाता है। किसी भी स्थिति में पैसे न दें, आधार/पैन कार्ड न भेजें और कोई ऐप डाउनलोड न करें।`;
  } else if (riskLevel === 'caution') {
    summary = `Some cautionary elements were identified. While it may not be an overt scam, critical information is either unverified or atypical for professional organizations. Seek written confirmation through official channels.`;
    summaryHi = `कुछ संदिग्ध बातें सामने आई हैं। यह पूरी तरह फर्जी न भी हो, लेकिन महत्वपूर्ण जानकारियां सत्यापित नहीं हैं। आगे बढ़ने से पहले आधिकारिक माध्यम से लिखित पुष्टि प्राप्त करें।`;
  } else {
    summary = `No overt scam indicators were detected in the provided excerpt. However, automated heuristic scans cannot replace official institutional verification. Always verify credentials via official portals before signing contracts.`;
    summaryHi = `दिए गए विवरण में कोई स्पष्ट फर्जीवाड़ा नहीं मिला। फिर भी, किसी भी अनुबंध पर हस्ताक्षर करने से पहले आधिकारिक वेबसाइट पर जाकर पुष्टि अवश्य करें।`;
  }

  // Recommended next steps
  const recommendedSteps: string[] = [
    'Do NOT pay any registration, interview, kit or processing fees under any circumstances.',
    'Never provide OTP, UPI PIN or banking passwords to any recruiter.',
    'Check official company website directly via search engine rather than clicking links in messages.',
    'Report suspicious phone numbers and SMS to Department of Telecom Chakshu Portal (sancharsaathi.gov.in).'
  ];

  if (category === 'overseas') {
    recommendedSteps.unshift('Verify the recruiting agency on Ministry of External Affairs eMigrate portal (emigrate.gov.in).');
  } else if (category === 'certificate') {
    recommendedSteps.unshift('Search and verify credential via DigiLocker (digilocker.gov.in) or National Academic Depository.');
  }

  // Draft replies and complaints
  const safeReplyDraft = `Dear Sender,\n\nThank you for reaching out. To proceed formally, please send the official employment offer and job specification from your corporate email domain (e.g., @company.com), along with the Corporate Identification Number (CIN) or MEA Registration number. Under Indian employment regulations and guidelines, I do not make payments for job applications or interviews.\n\nRegards,\nApplicant`;

  const cybercrimeComplaintDraft = `Subject: Complaint regarding suspected cyber fraud / employment scam\n\nIncident Summary:\nI was contacted via message/email regarding a ${category} opportunity involving the entity "${additionalData?.companyName || 'Unknown Entity'}". The sender exhibited scam indicators including requesting advance funds and unofficial channels.\n\nSender details:\nPhone / ID: ${additionalData?.phone || 'Provided in message'}\nEvidence excerpt: "${text.substring(0, 150)}..."\n\nPlease investigate this activity under the Information Technology Act.`;

  return {
    id,
    category,
    title: getCategoryTitle(category),
    riskScore,
    riskLevel,
    verdictLabel,
    verdictLabelHi,
    summary,
    summaryHi,
    confidence,
    evidenceFound: evidence.length > 0 ? evidence : ['No overt high-risk terms matched our database patterns.'],
    evidenceFoundHi: evidenceHi.length > 0 ? evidenceHi : ['कोई संदिग्ध पैटर्न नहीं मिला।'],
    suspiciousPhrases: phrases,
    recommendedSteps,
    officialLinks: getOfficialLinksForCategory(category),
    submittedText: text,
    timestamp,
    safeReplyDraft,
    cybercrimeComplaintDraft
  };
}

function getCategoryTitle(cat: ScamCategory): string {
  switch (cat) {
    case 'job': return 'Job Offer Analysis';
    case 'internship': return 'Internship & Certificate Offer Analysis';
    case 'certificate': return 'Academic & Skill Certificate Scan';
    case 'coaching': return 'Coaching & Ed-Tech Claim Assessment';
    case 'overseas': return 'Overseas Recruitment Agent Verification';
    case 'exam_admission': return 'Admission & Scholarship Fraud Check';
    case 'link_upi': return 'Link, Phone & UPI Reputation Check';
    case 'photo_scan': return 'Screenshot OCR & Scam Scan';
    default: return 'Safety Assessment';
  }
}

export function getOfficialLinksForCategory(cat: ScamCategory): VerificationLink[] {
  const commonLinks: VerificationLink[] = [
    {
      title: 'National Cyber Crime Reporting Portal (1930)',
      url: 'https://cybercrime.gov.in',
      source: 'Ministry of Home Affairs (MHA)',
      description: 'Official Indian portal to report financial cyber fraud, online scams and harassment.'
    },
    {
      title: 'Chakshu Portal (Sanchar Saathi)',
      url: 'https://sancharsaathi.gov.in/sfc/',
      source: 'Department of Telecommunications (DoT)',
      description: 'Report suspected fraudulent communications received via SMS, WhatsApp, or calls.'
    }
  ];

  if (cat === 'overseas') {
    return [
      {
        title: 'eMigrate Portal (PGE Registered Agents)',
        url: 'https://emigrate.gov.in',
        source: 'Ministry of External Affairs (MEA)',
        description: 'Check active list of legally authorized recruitment agents for overseas employment.'
      },
      ...commonLinks
    ];
  }

  if (cat === 'certificate') {
    return [
      {
        title: 'National Academic Depository (NAD) / DigiLocker',
        url: 'https://nad.digitallocker.gov.in',
        source: 'Ministry of Education / MeitY',
        description: 'Verify 24x7 online store house of all academic awards duly digitalized and logged.'
      },
      {
        title: 'National Skill Development Corporation (NSDC)',
        url: 'https://nsdcindia.org',
        source: 'Ministry of Skill Development',
        description: 'Verify accredited training partners and authorized assessment agencies.'
      },
      ...commonLinks
    ];
  }

  if (cat === 'coaching') {
    return [
      {
        title: 'National Consumer Helpline (NCH)',
        url: 'https://consumerhelpline.gov.in',
        source: 'Department of Consumer Affairs',
        description: 'File consumer grievance for misleading coaching advertisements and refund disputes.'
      },
      ...commonLinks
    ];
  }

  return commonLinks;
}
