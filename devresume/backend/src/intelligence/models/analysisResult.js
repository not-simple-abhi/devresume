

export const createAnalysisResult = () => ({
  
  contact: {
    maxScore: 0,
    earnedScore: 0,
    checks: {},
    deductions: [],
  },

  
  education: {
    maxScore: 0,
    earnedScore: 0,
    checks: {},
    entries: [],
    deductions: [],
  },

  
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

  
  projects: {
    maxScore: 0,
    earnedScore: 0,
    checks: {},
    projects: [],
    deductions: [],
  },

  
  experience: {
    maxScore: 0,
    earnedScore: 0,
    checks: {},
    entries: [],
    deductions: [],
  },

  
  keywords: {
    maxScore: 0,
    earnedScore: 0,
    detectedDomain: '',
    coverage: {},       
    matchedKeywords: [],
    missingKeywords: [],
    deductions: [],
  },
});
