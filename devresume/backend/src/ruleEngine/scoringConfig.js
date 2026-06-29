/**
 * scoringConfig.js
 *
 * Single source of truth for all scoring weights.
 * Never hardcode these numbers anywhere else.
 * Total = 100
 */

export const SCORING_CONFIG = {
  contact:    { weight: 10,  label: 'Contact Information' },
  education:  { weight: 15,  label: 'Education' },
  skills:     { weight: 20,  label: 'Skills' },
  projects:   { weight: 25,  label: 'Projects' },
  experience: { weight: 20,  label: 'Experience' },
  keywords:   { weight: 10,  label: 'Keyword Coverage' },
};

// Score labels
export const getScoreLabel = (score) => {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Average';
  return 'Needs Work';
};
