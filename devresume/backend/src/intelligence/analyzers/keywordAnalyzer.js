

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));


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


const detectDomain = (allKeywords, resumeText) => {
  const lower = resumeText.toLowerCase();
  const scores = {};

  for (const [domain, keywords] of Object.entries(allKeywords)) {
    scores[domain] = keywords.filter(k => lower.includes(k.toLowerCase())).length;
  }

  
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || 'fullstack';
};

export const analyzeKeywords = (resume) => {
  const allKeywords = loadKeywords();

  
  const resumeText = [
    resume.rawText || '',
    ...(resume.skills || []),
    ...(resume.projects || []),
    ...(resume.experience || []),
  ].join(' ').toLowerCase();

  
  const detectedDomain = detectDomain(allKeywords, resumeText);
  const domainKeywords = allKeywords[detectedDomain] || [];

  
  const matchedKeywords = domainKeywords.filter(k =>
    resumeText.includes(k.toLowerCase())
  );

  const missingKeywords = domainKeywords.filter(k =>
    !resumeText.includes(k.toLowerCase())
  );

  
  const coverage = {};
  for (const [domain, keywords] of Object.entries(allKeywords)) {
    const matched = keywords.filter(k => resumeText.includes(k.toLowerCase())).length;
    coverage[domain] = Math.round((matched / keywords.length) * 100);
  }

  const coveragePercent = Math.round((matchedKeywords.length / domainKeywords.length) * 100);

  
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
    coverage,          
    matchedKeywords,
    missingKeywords: missingKeywords.slice(0, 15), 
    deductions,
  };
};
