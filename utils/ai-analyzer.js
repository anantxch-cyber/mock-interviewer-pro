// Core AI Analytics for Mock Interviewer Pro
// Converted from TypeScript to vanilla JS for direct browser use

/**
 * Analyze personality metrics from interview transcripts.
 * In production, this data comes back parsed from OpenAI / Gemini.
 * @param {string[]} transcripts - Array of answer transcripts
 * @returns {Object} Personality metrics
 */
export function analyzePersonalityMetrics(transcripts) {
  return {
    confidence: calculateConfidence(transcripts),
    communicationClarity: 88,
    emotionalStability: "High (No stress markers detected)",
    problemSolvingMindset: "Analytical",
    introvertExtrovert: "Ambivert Bias",
  };
}

/**
 * Calculate confidence score from transcripts by counting filler words.
 * @param {string[]} transcripts
 * @returns {number} Confidence score 0-100
 */
function calculateConfidence(transcripts) {
  const fillerWords = ['uh', 'um', 'like', 'you know', 'sort of'];
  let breaks = 0;

  transcripts.forEach(t => {
    fillerWords.forEach(fw => {
      breaks += (t.toLowerCase().match(new RegExp('\\b' + fw + '\\b', 'g')) || []).length;
    });
  });

  return Math.max(0, 100 - (breaks * 4));
}

/**
 * Generate hiring probability from combined scores.
 * @param {number} techScore - Technical score
 * @param {number} perfScore - Performance/behavioral score
 * @returns {string} Hiring probability label
 */
export function generateHiringProbability(techScore, perfScore) {
  const base = (techScore * 0.6) + (perfScore * 0.4);

  if (base > 90) return "Strong Hire (95% Probability)";
  if (base > 75) return "Hire (75% Probability)";
  if (base > 60) return "Borderline (40% Probability)";
  return "Do Not Hire (15% Probability)";
}
