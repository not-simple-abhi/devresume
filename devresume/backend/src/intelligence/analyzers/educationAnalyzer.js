/**
 * educationAnalyzer.js
 *
 * Analyzes the education section for completeness and quality.
 * Max score: 10 points
 *
 * Scoring:
 *   Has education entries    → 3 pts
 *   Degree mentioned         → 2 pts
 *   Institution mentioned    → 2 pts
 *   Graduation year present  → 2 pts
 *   CGPA / percentage        → 1 pt
 */

// Keywords that indicate a degree
const DEGREE_KEYWORDS = [
  'b.tech', 'btech', 'b.e', 'be ', 'bachelor', 'b.sc', 'bsc',
  'm.tech', 'mtech', 'm.e', 'master', 'm.sc', 'msc', 'mba', 'mca',
  'phd', 'ph.d', 'diploma', 'class xii', 'class x', '12th', '10th',
  'board', 'secondary', 'higher secondary',
];

// Keywords that indicate an institution
const INSTITUTION_KEYWORDS = [
  'university', 'college', 'institute', 'iit', 'nit', 'bits', 'nsut',
  'school', 'academy', 'vidyalaya', 'kendriya', 'tech', 'engineering',
];

const hasDegree = (text) =>
  DEGREE_KEYWORDS.some(k => text.toLowerCase().includes(k));

const hasInstitution = (text) =>
  INSTITUTION_KEYWORDS.some(k => text.toLowerCase().includes(k));

const hasYear = (text) =>
  /\b(19|20)\d{2}\b/.test(text);

const hasGrade = (text) =>
  /(\d+\.?\d*\s*%|cgpa|gpa|\d\.\d{1,2}\/10|\d{2,3}%)/i.test(text);

export const analyzeEducation = (resume) => {
  const entries = resume.education || [];
  const deductions = [];
  let earnedScore = 0;

  const checks = {
    hasEntries:    entries.length > 0,
    hasDegree:     false,
    hasInstitution: false,
    hasYear:       false,
    hasGrade:      false,
  };

  // Has any education at all — 3 points
  if (checks.hasEntries) {
    earnedScore += 3;

    // Check each entry for quality
    const allText = entries.join(' ');

    checks.hasDegree = hasDegree(allText);
    checks.hasInstitution = hasInstitution(allText);
    checks.hasYear = hasYear(allText);
    checks.hasGrade = hasGrade(allText);

    if (checks.hasDegree) {
      earnedScore += 2;
    } else {
      deductions.push({ reason: 'Degree type not clearly mentioned', points: -2 });
    }

    if (checks.hasInstitution) {
      earnedScore += 2;
    } else {
      deductions.push({ reason: 'Institution name missing or unclear', points: -2 });
    }

    if (checks.hasYear) {
      earnedScore += 2;
    } else {
      deductions.push({ reason: 'Graduation year not mentioned', points: -2 });
    }

    if (checks.hasGrade) {
      earnedScore += 1;
    } else {
      deductions.push({ reason: 'CGPA or percentage not mentioned', points: -1 });
    }

  } else {
    deductions.push({ reason: 'Education section is empty', points: -10 });
  }

  return {
    maxScore: 10,
    earnedScore: Math.min(earnedScore, 10),
    checks,
    entries,
    deductions,
  };
};
