'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// ─── Question Bank ────────────────────────────────────────
const QUESTIONS: Record<string, string[]> = {
  technical: [
    "Explain the difference between let, const, and var in JavaScript. When would you use each?",
    "What is the time complexity of a binary search algorithm? Explain with an example.",
    "Design a URL shortening service like Bit.ly. Walk me through your high-level architecture.",
    "Explain how the event loop works in Node.js. What is the difference between the call stack and the callback queue?",
    "You have an array of integers. Find all pairs that sum to a target value. Write your approach in pseudocode and analyze complexity.",
    "What is the CAP theorem? How does it affect your database choice for a distributed system?",
    "Explain the difference between SQL joins: INNER, LEFT, RIGHT, and FULL OUTER JOIN.",
    "What are React hooks? Explain useState and useEffect with real-world use cases.",
    "How would you implement rate limiting in an API? Discuss at least two strategies.",
    "What is a REST API? How does it differ from GraphQL?",
    "Explain micro-frontends. When would you use this architecture over a monolith?",
    "Describe a time you optimized a slow database query. What was your debugging approach?",
  ],
  behavioral: [
    "Tell me about a time you had to deal with a very difficult teammate. How did you handle it?",
    "Describe a project where you had to learn a new technology under a tight deadline. What was your approach?",
    "Give me an example of a time when you disagreed with your manager's decision. What did you do?",
    "Tell me about your biggest professional failure. What did you learn from it?",
    "Describe a situation where you had to prioritize competing deadlines. How did you decide what to tackle first?",
    "Tell me about a time you mentored someone junior. What was your method?",
    "Describe a situation where you had to influence without authority.",
    "Give me an example of when you went above and beyond your job description.",
  ],
  hr: [
    "Tell me about yourself. Walk me through your career journey.",
    "Why are you leaving your current job?",
    "Where do you see yourself in 5 years?",
    "What is your expected salary range and why?",
    "Why do you want to work at our company specifically?",
    "How do you handle work-life balance during high-pressure sprints?",
    "Describe your ideal work environment and management style.",
    "What are your greatest strengths and weaknesses, and how are you working on the weakness?",
  ],
  stress: [
    "You have 30 seconds. Explain machine learning to a 5-year-old. Go.",
    "Your production database just went down at 3 AM. Walk me through your immediate next 15 actions.",
    "I'm not convinced by your last answer. Convince me more specifically right now.",
    "If you were CEO of this company for one day, what's the one thing you'd change and why?",
    "Quick: name 5 ways to improve the performance of a slow React application. Don't think, just answer.",
    "Your PR was just rejected by a senior engineer with harsh feedback. What do you do?",
  ],
  'system-design': [
    "Design Twitter's trending topics system. How do you compute and update it in real-time at scale?",
    "Design a distributed file storage system like Google Drive. Focus on consistency and availability tradeoffs.",
    "How would you design a notification system that sends millions of push notifications per day?",
    "Design YouTube's video upload and transcoding pipeline.",
    "Design a real-time collaborative document editing system like Google Docs.",
    "How would you design an e-commerce recommendation engine?",
  ],
  resume: [
    "Walk me through the most technically challenging project on your resume.",
    "In your last role, what were the top 3 technical decisions you made and what were their outcomes?",
    "I see you worked on a project. What would you do differently if you rebuilt it from scratch?",
    "What metrics improved because of your work? Give me specific numbers.",
    "Tell me about a production bug you caused and how you resolved it.",
    "What's a feature you're most proud of shipping?",
  ],
  dsa: [
    "Given a sorted array, find the first and last position of a given target. What's the optimal solution?",
    "Implement a LRU Cache with O(1) get and put operations. Explain your data structure choice.",
    "Find the minimum window substring that contains all characters of a pattern string.",
    "Given a binary tree, find the maximum path sum between any two nodes.",
    "Implement a trie (prefix tree) and explain its use cases.",
  ],
};

const AI_HINTS = [
  "Be specific — mention exact numbers, technologies, or outcomes.",
  "Use the STAR format: Situation, Task, Action, Result.",
  "Don't just describe what happened — explain your thought process.",
  "Quantify your impact. '40% faster' beats 'we made it faster'.",
  "Pause and structure before speaking. A 2-second pause sounds confident.",
  "Avoid passive voice — say 'I built', not 'it was built'.",
  "Connect your answer back to what the company needs.",
  "If you don't know, show your thinking — interviewers value reasoning.",
];

const MODE_LABELS: Record<string, string> = {
  technical: 'Technical Interview', behavioral: 'Behavioral Interview', hr: 'HR Round',
  stress: 'Stress Test', 'system-design': 'System Design', resume: 'Resume-Based', dsa: 'DSA Deep Dive'
};

interface Answer { q: string; answer: string; score: number; confidence: number; fillerWords: number; wordCount: number; }

function escapeHTML(str: string) {
  const d = document.createElement('div');
  d.textContent = String(str);
  return d.innerHTML;
}

function analyzeAnswer(text: string) {
  const words = text.split(/\s+/).filter(w => w).length;
  const fillers = ['uh', 'um', 'like', 'you know', 'sort of', 'basically', 'kind of'];
  let fillerCount = 0;
  fillers.forEach(f => {
    const matches = text.toLowerCase().match(new RegExp('\\b' + f + '\\b', 'g'));
    if (matches) fillerCount += matches.length;
  });
  const lengthScore = Math.min(100, (words / 80) * 100);
  const fillerPenalty = Math.min(30, fillerCount * 5);
  const hasActions = /(I built|I designed|I led|I implemented|I achieved|I improved)/.test(text) ? 10 : 0;
  const hasBullets = /\d+\.|•|-/.test(text) ? 10 : 0;
  const confidence = Math.max(40, 90 - fillerPenalty + hasActions);
  const score = Math.min(100, Math.round(lengthScore * 0.5 + confidence * 0.4 + hasBullets + hasActions));
  return { score, confidence, fillerWords: fillerCount, wordCount: words };
}

function InterviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load config
  const [config] = useState(() => {
    try { return JSON.parse(localStorage.getItem('interviewConfig') || '{}'); } catch { return {}; }
  });
  const mode = config.mode || searchParams.get('mode') || 'technical';
  const numQTarget = config.numQ || 8;

  // Questions
  const [questions] = useState(() => {
    const pool = QUESTIONS[mode] || QUESTIONS.technical;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(numQTarget, shuffled.length));
  });

  // State
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [textAnswer, setTextAnswer] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'voice'>('text');
  const [elapsed, setElapsed] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiHint, setAiHint] = useState(AI_HINTS[0]);
  const [fillerCount, setFillerCount] = useState(0);
  const [telemetry, setTelemetry] = useState({ words: 0, lengthPct: 0, lengthLabel: 'Too Short', lengthColor: 'var(--yellow)', confPct: 82, fillers: 0 });
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: string }[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const toastIdRef = useRef(0);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => { clearInterval(timerRef.current); if (recognitionRef.current && isRecording) { try { recognitionRef.current.stop(); } catch {} } };
  }, []);

  // Lucide
  useEffect(() => {
    if (typeof window !== 'undefined' && window.lucide) window.lucide.createIcons();
  });

  // Speech init
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setVoiceSupported(false); return; }
    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = 'en-US';
    r.onresult = (e: any) => {
      let final = '', interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setTranscript(t => {
        const next = t + final;
        updateTelemetryFromWords(next.split(/\s+/).filter(w => w).length);
        return next;
      });
      // Filler detection
      const fillerWords = ['uh', 'um', 'like', 'you know'];
      fillerWords.forEach(f => { if (final.toLowerCase().includes(f)) setFillerCount(c => c + 1); });
    };
    r.onerror = (e: any) => {
      if (e.error === 'not-allowed') showToast('Microphone permission denied.', 'warning');
      else if (e.error === 'no-speech') showToast('No speech detected.', 'info');
      stopRecording();
    };
    r.onend = () => { if (isRecording) { try { r.start(); } catch {} } };
    recognitionRef.current = r;
  }, []);

  const updateTelemetryFromWords = (words: number) => {
    const pct = Math.min(100, (words / 80) * 100);
    const label = words < 20 ? 'Too Short' : words < 50 ? 'Good Length' : 'Excellent';
    const color = words < 20 ? 'var(--yellow)' : 'var(--green)';
    setTelemetry(t => ({ ...t, words, lengthPct: pct, lengthLabel: label, lengthColor: color }));
    if (words > 0 && words < 25) setAiHint('Your answer is too brief. Aim for at least 60–80 words. Add specific examples and numbers.');
    else if (words >= 25 && words < 60) setAiHint("Good start! Now go deeper — explain the 'why' behind your decisions.");
    else if (words >= 60) setAiHint('Solid length. Ensure you\'ve quantified your impact and tied it to the role requirements.');
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setTextAnswer(val);
    const words = val.split(/\s+/).filter(w => w).length;
    updateTelemetryFromWords(words);
  };

  const showToast = (msg: string, type = 'info') => {
    const id = ++toastIdRef.current;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3800);
  };

  const startRecording = () => {
    if (!recognitionRef.current) return;
    setIsRecording(true);
    setTranscript('');
    try { recognitionRef.current.start(); } catch {}
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} }
  };

  const toggleRecording = () => {
    if (!voiceSupported) { showToast('Voice input requires a Chromium-based browser.', 'warning'); return; }
    if (isRecording) stopRecording(); else startRecording();
  };

  const submitAnswer = () => {
    const answer = (activeTab === 'text' ? textAnswer : transcript).trim();
    if (!answer) { showToast('Please provide an answer before submitting.', 'warning'); return; }
    const analysis = analyzeAnswer(answer);
    const newAnswers = [...answers, { q: questions[currentQ], answer, ...analysis }];
    setAnswers(newAnswers);

    const quality = analysis.score >= 80 ? '✅ Great answer!' : analysis.score >= 60 ? '👍 Good attempt' : '⚠️ Try to elaborate more';
    showToast(`${quality} Score: ${analysis.score}/100`, analysis.score >= 80 ? 'success' : 'info');

    setTimeout(() => {
      if (currentQ + 1 >= questions.length) endSession(newAnswers);
      else { setCurrentQ(q => q + 1); setTextAnswer(''); setTranscript(''); setFillerCount(0); setAiHint(AI_HINTS[(currentQ + 1) % AI_HINTS.length]); updateTelemetryFromWords(0); }
    }, 2000);
  };

  const skipQuestion = () => {
    const newAnswers = [...answers, { q: questions[currentQ], answer: '[Skipped]', score: 0, confidence: 0, fillerWords: 0, wordCount: 0 }];
    setAnswers(newAnswers);
    showToast('Question skipped.', 'info');
    if (currentQ + 1 >= questions.length) endSession(newAnswers);
    else { setCurrentQ(q => q + 1); setTextAnswer(''); setTranscript(''); setFillerCount(0); }
  };

  const endSession = (finalAnswers = answers) => {
    clearInterval(timerRef.current);
    if (recognitionRef.current && isRecording) { try { recognitionRef.current.stop(); } catch {} }
    const totalScore = finalAnswers.length > 0 ? Math.round(finalAnswers.reduce((s, a) => s + (a.score || 0), 0) / finalAnswers.length) : 0;
    const avgConf = finalAnswers.length > 0 ? Math.round(finalAnswers.reduce((s, a) => s + (a.confidence || 0), 0) / finalAnswers.length) : 0;
    const totalFillers = finalAnswers.reduce((s, a) => s + (a.fillerWords || 0), 0);
    const report = { mode, questions, answers: finalAnswers, totalScore, avgConf, totalFillers, duration: elapsed, date: new Date().toISOString() };
    localStorage.setItem('lastReport', JSON.stringify(report));
    const stats = JSON.parse(localStorage.getItem('interviewStats') || '{"totalSessions":0,"totalXP":0}');
    stats.totalSessions = (stats.totalSessions || 0) + 1;
    stats.totalXP = (stats.totalXP || 0) + Math.round(totalScore * 2 + 50);
    localStorage.setItem('interviewStats', JSON.stringify(stats));
    router.push('/report');
  };

  const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const s = (elapsed % 60).toString().padStart(2, '0');
  const modeLabel = MODE_LABELS[mode] || mode;

  return (
    <>
      <div className="ambient-bg"><div className="ambient-orb orb-1" /><div className="ambient-orb orb-2" /></div>

      <div className="interview-page">
        {/* Topbar */}
        <div className="interview-topbar">
          <div className="interview-topbar-left">
            <div className="recording-dot" />
            <div className="interview-meta">
              <strong id="modeLabel">{modeLabel}</strong>
              <span> · </span>
              <span>{config.role || 'Software Engineer'}</span>
            </div>
          </div>
          <div className="timer">{m}:{s}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" onClick={skipQuestion} style={{ padding: '7px 14px', fontSize: '0.8rem' }}>Skip →</button>
            <button className="btn btn-danger" onClick={() => endSession()} style={{ padding: '7px 14px', fontSize: '0.8rem' }}>End Session</button>
          </div>
        </div>

        {/* Body */}
        <div className="interview-body">
          <div className="interview-main">
            {/* Breadcrumb */}
            <div className="q-breadcrumb">
              {questions.map((_, i) => (
                <div key={i} className={`q-dot${i < currentQ ? ' answered' : i === currentQ ? ' current' : ''}`} />
              ))}
            </div>

            {/* Question Box */}
            <div className="question-box">
              <div className="q-meta">
                <span className="q-number">Question {currentQ + 1} of {questions.length}</span>
                <span className="q-type-badge">{modeLabel}</span>
                <div className="q-ai-indicator"><div className="ai-pulse" /><span>AI Adaptive Mode</span></div>
              </div>
              <div className="question-text">{questions[currentQ]}</div>
            </div>

            {/* Answer Section */}
            <div className="answer-section">
              <div className="answer-tabs">
                <button className={`answer-tab${activeTab === 'text' ? ' active' : ''}`} onClick={() => setActiveTab('text')}>
                  <i data-lucide="type" /> Type Answer
                </button>
                <button
                  className={`answer-tab${activeTab === 'voice' ? ' active' : ''}`}
                  onClick={() => setActiveTab('voice')}
                  disabled={!voiceSupported}
                  title={!voiceSupported ? 'Requires Chrome/Edge' : undefined}
                  style={!voiceSupported ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
                >
                  <i data-lucide="mic" /> Voice Answer
                </button>
              </div>

              {activeTab === 'text' ? (
                <div className="answer-area">
                  <textarea className="answer-textarea" value={textAnswer} onChange={handleTextChange}
                    placeholder="Type your answer here... Be detailed and structured. Use the STAR method for behavioral questions." />
                </div>
              ) : (
                <div className={`voice-ui${activeTab === 'voice' ? ' active' : ''}`}>
                  <div className="voice-waveform">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="wave-bar" style={isRecording ? { animation: `wave ${0.8 + i * 0.1}s ease-in-out infinite alternate` } : { height: 8 }} />
                    ))}
                  </div>
                  <button className={`mic-button${isRecording ? ' recording' : ''}`} onClick={toggleRecording} aria-label="Toggle microphone">
                    <i data-lucide={isRecording ? 'square' : 'mic'} />
                  </button>
                  <div className="transcript-preview">
                    {transcript || (isRecording ? 'Listening...' : 'Press the microphone button to start speaking')}
                  </div>
                </div>
              )}

              <div className="answer-controls">
                <div className="answer-controls-left">
                  <button className="btn btn-ghost" onClick={() => { setTextAnswer(''); setTranscript(''); updateTelemetryFromWords(0); }}>
                    <i data-lucide="rotate-ccw" /> Clear
                  </button>
                </div>
                <button className="btn btn-primary glow" onClick={submitAnswer}>
                  Submit Answer <i data-lucide="send" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Telemetry */}
          <div className="interview-sidebar">
            <div className="sidebar-section">
              <div className="sidebar-section-title">Live Telemetry</div>
              <div className="telemetry">
                <div className="tele-item">
                  <div className="tele-head">
                    <span className="tele-name">Speaking Pace</span>
                    <span className="tele-val tele-ok">Optimal</span>
                  </div>
                  <div className="tele-track"><div className="tele-fill" style={{ width: '70%', background: 'var(--green)' }} /></div>
                </div>
                <div className="tele-item">
                  <div className="tele-head">
                    <span className="tele-name">Answer Length</span>
                    <span className={`tele-val ${telemetry.lengthLabel === 'Excellent' ? 'tele-ok' : 'tele-warn'}`}>{telemetry.lengthLabel}</span>
                  </div>
                  <div className="tele-track"><div className="tele-fill" style={{ width: `${telemetry.lengthPct}%`, background: telemetry.lengthColor }} /></div>
                </div>
                <div className="tele-item">
                  <div className="tele-head">
                    <span className="tele-name">Confidence Signal</span>
                    <span className="tele-val tele-ok">High</span>
                  </div>
                  <div className="tele-track"><div className="tele-fill" style={{ width: '82%', background: 'var(--primary)' }} /></div>
                </div>
                <div className="tele-item">
                  <div className="tele-head">
                    <span className="tele-name">Filler Words</span>
                    <span className={`tele-val ${fillerCount > 2 ? 'tele-warn' : 'tele-ok'}`}>{fillerCount} detected</span>
                  </div>
                  <div className="filler-timeline">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className={`filler-blip${i < fillerCount ? ' hit' : ''}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="sidebar-section" style={{ flex: 1, overflowY: 'auto' }}>
              <div className="sidebar-section-title">AI Real-time Hint</div>
              <div className="ai-hint">
                <div className="ai-hint-label">💡 AI Suggestion</div>
                {aiHint}
              </div>
              <div style={{ marginTop: 20 }}>
                <div className="sidebar-section-title">Question History</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {answers.slice().reverse().slice(0, 3).map((a, i) => {
                    const qIdx = answers.length - 1 - i;
                    return (
                      <div key={i} style={{ padding: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '0.78rem', color: 'var(--text-2)' }}>
                        <div style={{ color: 'var(--text-1)', fontWeight: 600, marginBottom: 4 }}>Q{qIdx + 1}: {questions[qIdx]?.substring(0, 40)}...</div>
                        <span style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--green)', padding: '2px 6px', borderRadius: 4, fontSize: '0.7rem' }}>Answered ✓</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toasts */}
      <div className="toast-stack">
        {toasts.map(t => {
          const icon = t.type === 'success' ? '✅' : t.type === 'warning' ? '⚠️' : 'ℹ️';
          const color = t.type === 'success' ? 'var(--green)' : t.type === 'warning' ? 'var(--yellow)' : 'var(--primary)';
          return (
            <div key={t.id} className="toast" style={{ borderLeftColor: color }}>
              <span>{icon}</span><span>{t.msg}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function InterviewPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><p>Loading interview...</p></div>}>
      <InterviewContent />
    </Suspense>
  );
}
