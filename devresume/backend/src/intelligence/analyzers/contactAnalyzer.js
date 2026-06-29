/**
 * contactAnalyzer.js
 *
 * Checks whether the resume has all required contact information.
 * Max score: 10 points
 *
 * Scoring:
 *   Email     → 4 pts (most important — recruiters need this)
 *   Phone     → 3 pts
 *   LinkedIn  → 2 pts
 *   GitHub    → 1 pt
 *   Portfolio → 1 pt (bonus, total can exceed 10 → capped)
 */

export const analyzeContact = (resume) => {
  const checks = {
    email:     Boolean(resume.email && resume.email.trim()),
    phone:     Boolean(resume.phone && resume.phone.trim()),
    linkedin:  Boolean(resume.linkedin && resume.linkedin.trim()),
    github:    Boolean(resume.github && resume.github.trim()),
    portfolio: Boolean(resume.portfolio && resume.portfolio.trim()),
  };

  const deductions = [];
  let earnedScore = 0;

  // Email — 4 points, most critical
  if (checks.email) {
    earnedScore += 4;
  } else {
    deductions.push({ reason: 'Email missing — recruiters cannot contact you', points: -4 });
  }

  // Phone — 3 points
  if (checks.phone) {
    earnedScore += 3;
  } else {
    deductions.push({ reason: 'Phone number missing', points: -3 });
  }

  // LinkedIn — 2 points
  if (checks.linkedin) {
    earnedScore += 2;
  } else {
    deductions.push({ reason: 'LinkedIn profile missing', points: -2 });
  }

  // GitHub — 1 point
  if (checks.github) {
    earnedScore += 1;
  } else {
    deductions.push({ reason: 'GitHub profile missing', points: -1 });
  }

  // Portfolio — bonus 1 point
  if (checks.portfolio) {
    earnedScore += 1;
  } else {
    deductions.push({ reason: 'Portfolio/website missing', points: -1 });
  }

  return {
    maxScore: 10,
    earnedScore: Math.min(earnedScore, 10), // cap at 10
    checks,
    deductions,
  };
};
