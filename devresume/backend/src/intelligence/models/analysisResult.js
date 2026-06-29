/**
 * analysisResult.js
 *
 * Defines the shape of what the Intelligence Engine returns.
 * This is a factory function — call createAnalysisResult() to get
 * a clean empty result object that all analyzers fill in.
 *
 * The Rule Engine reads this object to calculate final scores.
 * The AI Orchestrator reads this object to generate explanations.
 */

export const createAnalysisResult = () => ({
  // Contact section analysis
  contact: {
    maxScore: 0,
    earnedScore: 0,
    checks: {},
    deductions: [],
  },

  // Education section analysis
  education: {
    maxScore: 0,
    earnedScore: 0,
    checks: {},
    entries: [],
    deductions: [],
  },

  // Skills section analysis
  skills: {
    maxScore: 0,
    earnedScore: 0,
    checks: {},
    categorized: {
      languages: [],
      frameworks: [],
      databases: [],
      tools: [],
      cloud: [],
      other: [],
    },
    deductions: [],
  },

  // Projects section analysis
  projects: {
    maxScore: 0,
    earnedScore: 0,
    checks: {},
    projects: [],
    deductions: [],
  },

  // Experience section analysis
  experience: {
    maxScore: 0,
    earnedScore: 0,
    checks: {},
    entries: [],
    deductions: [],
  },

  // Keyword coverage analysis
  keywords: {
    maxScore: 0,
    earnedScore: 0,
    detectedDomain: '',
    coverage: {},       // { backend: 65, frontend: 40 }
    matchedKeywords: [],
    missingKeywords: [],
    deductions: [],
  },
});
