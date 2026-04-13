// Core AI Analytics Strategy for Mock Interviewer Pro

export function analyzePersonalityMetrics(transcripts: string[]) {
  // Simulates deep NLP processing for the requested personality traits
  // In production, this data comes back parsed from OpenAI / Gemini
  
  return {
    confidence: calculateConfidence(transcripts),
    communicationClarity: 88,
    emotionalStability: "High (No stress markers detected)",
    problemSolvingMindset: "Analytical",
    introvertExtrovert: "Ambivert Bias",
  }
}

function calculateConfidence(transcripts: string[]) {
  // Mock logic: looking for declarative vs passive statements
  const fillerWords = ['uh', 'um', 'like', 'you know', 'sort of'];
  let breaks = 0;
  
  transcripts.forEach(t => {
    fillerWords.forEach(fw => {
      breaks += (t.toLowerCase().match(new RegExp(fw, 'g')) || []).length;
    });
  });

  return Math.max(0, 100 - (breaks * 4));
}

export function generateHiringProbability(techScore: number, perfScore: number) {
  // Combines multiple vectors into a final probabilistic rating
  const base = (techScore * 0.6) + (perfScore * 0.4);
  
  if (base > 90) return "Strong Hire (95% Probability)";
  if (base > 75) return "Hire (75% Probability)";
  if (base > 60) return "Borderline (40% Probability)";
  return "Do Not Hire (15% Probability)";
}
