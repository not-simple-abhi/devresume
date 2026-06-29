/**
 * keywordAnalyzer.js
 *
 * No AI involved. Compares resume skills/text against
 * domain-specific keyword lists to calculate coverage %.
 * Max score: 20 points
 *
 * Steps:
 * 1. Detect which domain the resume targets (backend/frontend/fullstack/ai)
 * 2. Compare resume skills against that domain's keywords
 * 3. Calculate coverage percentage
 * 4. Score based on coverage
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load all keyword files
const loadKeywords = () => {
  const keywordsDir = join(__dirname, '../../config/keywords');
  const domains = {};

  const files = fs.readdirSync(keywordsDir).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(join(keywordsDir, file), 'utf-8'));
    domains[data.domain] = data.keywords;
  }

  return domains;
};

/**
 * detectDomain(resume)
 *
 * Figures out which domain the resume is targeting
 * by counting keyword matches across all domains.
 * Returns the domain with the highest match count.
 */
const detectDomain = (allKeywords, resumeText) => {
  const lower = resumeText.toLowerCase();
  const scores = {};

  for (const [domain, keywords] of Object.entries(allKeywords)) {
    scores[domain] = keywords.filter(k => lower.includes(k.toLowerCase())).length;
  }

  // Return the domain with the highest match count
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || 'fullstack';
};

export const analyzeKeywords = (resume) => {
  const allKeywords = loadKeywords();

  // Build a single text blob from all resume sections for matching
  const resumeText = [
    resume.rawText || '',
    ...(resume.skills || []),
    ...(resume.projects || []),
    ...(resume.experience || []),
  ].join(' ').toLowerCase();

  // Detect domain
  const detectedDomain = detectDomain(allKeywords, resumeText);
  const domainKeywords = allKeywords[detectedDomain] || [];

  // Find which keywords match and which are missing
  const matchedKeywords = domainKeywords.filter(k =>
    resumeText.includes(k.toLowerCase())
  );

  const missingKeywords = domainKeywords.filter(k =>
    !resumeText.includes(k.toLowerCase())
  );

  // Calculate coverage for all domains (useful for frontend display)
  const coverage = {};
  for (const [domain, keywords] of Object.entries(allKeywords)) {
    const matched = keywords.filter(k => resumeText.includes(k.toLowerCase())).length;
    coverage[domain] = Math.round((matched / keywords.length) * 100);
  }

  const coveragePercent = Math.round((matchedKeywords.length / domainKeywords.length) * 100);

  // Score based on coverage percentage
  let earnedScore = 0;
  const deductions = [];

  if (coveragePercent >= 60) {
    earnedScore = 20;
  } else if (coveragePercent >= 40) {
    earnedScore = 15;
    deductions.push({ reason: `Keyword coverage is ${coveragePercent}% — aim for 60%+`, points: -5 });
  } else if (coveragePercent >= 20) {
    earnedScore = 10;
    deductions.push({ reason: `Low keyword coverage (${coveragePercent}%) — add more relevant skills`, points: -10 });
  } else {
    earnedScore = 5;
    deductions.push({ reason: `Very low keyword coverage (${coveragePercent}%) — major gaps in ${detectedDomain}`, points: -15 });
  }

  return {
    maxScore: 20,
    earnedScore: Math.min(earnedScore, 20),
    detectedDomain,
    coveragePercent,
    coverage,          // all domains coverage
    matchedKeywords,
    missingKeywords: missingKeywords.slice(0, 15), // top 15 missing
    deductions,
  };
};
