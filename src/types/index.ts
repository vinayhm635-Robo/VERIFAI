export type ScamCategory =
  | 'job'
  | 'internship'
  | 'certificate'
  | 'coaching'
  | 'overseas'
  | 'exam_admission'
  | 'link_upi'
  | 'photo_scan';

export type RiskLevel = 'safe' | 'caution' | 'danger' | 'insufficient_info';

export interface SuspiciousPhrase {
  text: string;
  reason: string;
  severity: 'high' | 'medium' | 'low';
}

export interface VerificationLink {
  title: string;
  url: string;
  source: string;
  description: string;
}

export interface AnalysisResult {
  id: string;
  category: ScamCategory;
  title: string;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  verdictLabel: string;
  verdictLabelHi: string;
  summary: string;
  summaryHi: string;
  confidence: 'High' | 'Medium' | 'Low' | 'Insufficient';
  evidenceFound: string[];
  evidenceFoundHi?: string[];
  suspiciousPhrases: SuspiciousPhrase[];
  recommendedSteps: string[];
  recommendedStepsHi?: string[];
  officialLinks: VerificationLink[];
  submittedText?: string;
  imageUrl?: string;
  timestamp: string;
  safeReplyDraft: string;
  cybercrimeComplaintDraft: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface CommunityReport {
  id: string;
  category: ScamCategory;
  title: string;
  targetEntity: string; // Company, agent or brand name
  identifier?: string; // Phone, UPI ID, or URL
  amountLost?: number;
  description: string;
  dateReported: string;
  incidentDate: string;
  status: 'verified_alert' | 'community_review' | 'under_moderation';
  evidenceCount: number;
  upvotes: number;
  city?: string;
  state?: string;
  isAnonymous: boolean;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Skilled' | 'Master';
  badgeStatus: 'not_recorded' | 'video_submitted' | 'verified_by_trainer';
  verifiedBy?: string;
  verifiedAt?: string;
  practicalTips: string[];
}

export interface WorkerProfile {
  id: string;
  displayName: string;
  displayNameHi?: string;
  occupation: string;
  experienceYears: number;
  preferredLanguage: 'en' | 'hi' | 'kn';
  city: string;
  state: string;
  skills: SkillItem[];
  summaryEn: string;
  summaryHi: string;
  isPublicPassport: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  accent: 'teal' | 'blue' | 'violet' | 'green' | 'rose';
  language: 'en' | 'hi';
  fontSize: 'normal' | 'large';
  parentMode: boolean;
  reducedMotion: boolean;
}

export interface QuizQuestion {
  id: number;
  scenario: string;
  scenarioHi: string;
  options: {
    id: string;
    text: string;
    textHi: string;
    isCorrect: boolean;
    explanation: string;
    explanationHi: string;
  }[];
}
