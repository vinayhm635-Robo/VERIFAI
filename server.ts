import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { analyzeContent } from './src/utils/scamEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initial sample community scam reports
let communityReports = [
  {
    id: 'rep_1',
    category: 'job',
    title: 'Part-Time Telegram Video Liking Scam',
    targetEntity: 'Apex Digital Media / FastEarn',
    identifier: '+91 98231 44521',
    amountLost: 45000,
    description: 'Promised ₹150 per YouTube like. After completing 5 tasks, asked for ₹3,000 "merchant deposit", then ₹42,000 to release earnings. Blocked immediately on Telegram.',
    dateReported: '2026-03-28T14:30:00Z',
    incidentDate: '2026-03-27',
    status: 'verified_alert',
    evidenceCount: 4,
    upvotes: 42,
    city: 'Bengaluru',
    state: 'Karnataka',
    isAnonymous: false
  },
  {
    id: 'rep_2',
    category: 'overseas',
    title: 'Unregistered Dubai Warehouse Job on Tourist Visa',
    targetEntity: 'Gulf Overseas Global HR',
    identifier: 'gulfjobs-visa.site',
    amountLost: 85000,
    description: 'Agent promised Dubai warehouse helper visa for ₹85,000 advance. Provided a 30-day visit visa instead of an employment contract. Agent has no PGE license number.',
    dateReported: '2026-04-02T09:15:00Z',
    incidentDate: '2026-04-01',
    status: 'verified_alert',
    evidenceCount: 3,
    upvotes: 68,
    city: 'Kochi',
    state: 'Kerala',
    isAnonymous: true
  },
  {
    id: 'rep_3',
    category: 'internship',
    title: 'Paid Certificate Disguised as AI Internship',
    targetEntity: 'NextGen Tech Edutech',
    identifier: 'internship@nextgen-tech-cert.in',
    amountLost: 2499,
    description: 'Offered data science internship with "₹25,000 stipend", but required ₹2,499 upfront for a "registration toolkit". No mentor or project assigned—only a generic template PDF.',
    dateReported: '2026-04-05T11:20:00Z',
    incidentDate: '2026-04-04',
    status: 'community_review',
    evidenceCount: 2,
    upvotes: 29,
    city: 'Pune',
    state: 'Maharashtra',
    isAnonymous: false
  },
  {
    id: 'rep_4',
    category: 'link_upi',
    title: 'Electricity Bill Disconnection SMS with APK Link',
    targetEntity: 'State Power Board Impersonator',
    identifier: 'update-bijli-bill.xyz',
    amountLost: 12000,
    description: 'SMS claimed power supply would be disconnected tonight. Asked to download an APK file which requested SMS read permissions and forwarded OTPs to steal money.',
    dateReported: '2026-04-08T18:45:00Z',
    incidentDate: '2026-04-08',
    status: 'verified_alert',
    evidenceCount: 5,
    upvotes: 112,
    city: 'Delhi NCR',
    state: 'Delhi',
    isAnonymous: true
  }
];

// Initialize Gemini client if key is configured
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI();
  } catch (err) {
    console.warn('Gemini SDK initialization note:', err);
  }
}

// 1. Analyze Endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { text, category, additionalData } = req.body;
    
    // Always compute baseline heuristic scan
    const heuristicResult = analyzeContent({
      text: text || '',
      category: category || 'job',
      additionalData: additionalData || {}
    });

    // If Gemini is available, enhance with AI reasoning
    if (ai && process.env.GEMINI_API_KEY && text && text.trim().length > 25) {
      try {
        const prompt = `You are Verifai, an AI scam detection system in India. Analyze the following user submitted message for scam indicators, fraud patterns, or phishing risk.
Category: ${category}
Text: """${text}"""
Additional context: ${JSON.stringify(additionalData || {})}

Return a concise JSON object with:
- aiInsight (string: 2 sentences explaining why this fits or avoids Indian scam patterns)
- aiInsightHi (string: Hindi translation of the insight)
- suggestedQuestions (array of 2 short follow-up questions user might ask)`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const parsed = JSON.parse(response.text || '{}');
        if (parsed.aiInsight) {
          heuristicResult.summary = `${heuristicResult.summary} ${parsed.aiInsight}`;
        }
        if (parsed.aiInsightHi) {
          heuristicResult.summaryHi = `${heuristicResult.summaryHi} ${parsed.aiInsightHi}`;
        }
      } catch (aiErr) {
        // Fall back gracefully to heuristic output
        console.warn('AI enhancement fallback used:', (aiErr as Error).message);
      }
    }

    return res.json(heuristicResult);
  } catch (error) {
    console.error('Error in /api/analyze:', error);
    return res.status(500).json({ error: 'Internal analysis error' });
  }
});

// 2. Community Reports Endpoints
app.get('/api/community-reports', (req, res) => {
  const { category, search, status } = req.query;
  let filtered = [...communityReports];

  if (category && category !== 'all') {
    filtered = filtered.filter(r => r.category === category);
  }

  if (status && status !== 'all') {
    filtered = filtered.filter(r => r.status === status);
  }

  if (search && typeof search === 'string') {
    const s = search.toLowerCase();
    filtered = filtered.filter(r =>
      r.title.toLowerCase().includes(s) ||
      r.targetEntity.toLowerCase().includes(s) ||
      (r.identifier && r.identifier.toLowerCase().includes(s)) ||
      r.description.toLowerCase().includes(s)
    );
  }

  // Aggregate stats
  const totalReports = communityReports.length;
  const verifiedAlerts = communityReports.filter(r => r.status === 'verified_alert').length;
  const totalReportedLoss = communityReports.reduce((acc, r) => acc + (r.amountLost || 0), 0);

  return res.json({
    reports: filtered,
    stats: {
      totalReports,
      verifiedAlerts,
      totalReportedLoss
    }
  });
});

app.post('/api/community-reports', (req, res) => {
  try {
    const { category, title, targetEntity, identifier, amountLost, description, incidentDate, city, state, isAnonymous } = req.body;

    if (!title || !description || !targetEntity) {
      return res.status(400).json({ error: 'Missing required report fields' });
    }

    const newReport = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      category: category || 'job',
      title,
      targetEntity,
      identifier: identifier || '',
      amountLost: Number(amountLost) || 0,
      description,
      dateReported: new Date().toISOString(),
      incidentDate: incidentDate || new Date().toISOString().split('T')[0],
      status: 'under_moderation', // Requires review before marked verified_alert
      evidenceCount: 1,
      upvotes: 1,
      city: city || 'Not specified',
      state: state || 'India',
      isAnonymous: Boolean(isAnonymous)
    };

    communityReports.unshift(newReport);
    return res.status(201).json({ success: true, report: newReport });
  } catch (error) {
    return res.status(500).json({ error: 'Could not submit report' });
  }
});

// Upvote report
app.post('/api/community-reports/:id/upvote', (req, res) => {
  const { id } = req.params;
  const report = communityReports.find(r => r.id === id);
  if (report) {
    report.upvotes += 1;
    return res.json({ success: true, upvotes: report.upvotes });
  }
  return res.status(404).json({ error: 'Report not found' });
});

// 3. AI Assistant Chat Endpoint
app.post('/api/ai-chat', async (req, res) => {
  try {
    const { messages, context } = req.body;
    const lastUserMessage = messages && messages.length > 0 ? messages[messages.length - 1].content : '';

    if (ai && process.env.GEMINI_API_KEY) {
      try {
        const systemPrompt = `You are Verifai AI Assistant, an empathetic, vigilant digital safety advisor for India.
Help users verify jobs, internships, certificates, overseas recruitment agents, college admissions, and UPI payments.
Cite official Indian resources when relevant:
- Cybercrime Helpline: 1930 / cybercrime.gov.in
- Chakshu / Sanchar Saathi: sancharsaathi.gov.in
- eMigrate (PGE registered recruiting agents): emigrate.gov.in
- DigiLocker / NAD: nad.digitallocker.gov.in
Context of current scan: ${JSON.stringify(context || {})}
Provide clear, actionable, friendly advice. Support Hindi if the user speaks in Hindi.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${systemPrompt}\n\nUser Question: ${lastUserMessage}`
        });

        return res.json({
          reply: response.text || 'I analyzed your request. Never transfer funds or share your Aadhaar/PAN before official verification.'
        });
      } catch (geminiError) {
        console.warn('Gemini chat fallback:', geminiError);
      }
    }

    // Heuristic assistant response fallback
    let fallbackReply = `In India, genuine employers never ask for registration fees, laptop security deposits, or gift cards before hiring.`;
    if (lastUserMessage.toLowerCase().includes('hindi') || lastUserMessage.includes('हिंदी')) {
      fallbackReply = `नमस्ते! यदि कोई व्यक्ति नौकरी या इंटरव्यू के नाम पर पैसे या यूपीआई से फीस मांग रहा है, तो तुरंत रुक जाएं। असली कंपनियां कभी पैसे नहीं मांगतीं। साइबर धोखाधड़ी होने पर तुरंत 1930 पर कॉल करें।`;
    } else if (lastUserMessage.toLowerCase().includes('complaint') || lastUserMessage.toLowerCase().includes('1930')) {
      fallbackReply = `To report this scam, visit cybercrime.gov.in or call national helpline 1930 immediately. Preserve all screenshots, UPI transaction reference numbers, and WhatsApp chat exports as evidence.`;
    } else if (lastUserMessage.toLowerCase().includes('overseas') || lastUserMessage.toLowerCase().includes('dubai') || lastUserMessage.toLowerCase().includes('gulf')) {
      fallbackReply = `For overseas jobs, always check if the recruitment agency has an active license on the Ministry of External Affairs eMigrate portal (emigrate.gov.in). Never travel for work on a Tourist or Visit visa.`;
    }

    return res.json({ reply: fallbackReply });
  } catch (error) {
    return res.status(500).json({ reply: 'Sorry, I encountered an issue. Please call 1930 for urgent cyber fraud assistance.' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Verifai server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
