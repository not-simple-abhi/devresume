/**
 * skillsAnalyzer.js
 *
 * Categorizes skills and checks for quality/quantity.
 * Max score: 15 points
 *
 * Scoring:
 *   Has skills at all          → 3 pts
 *   5+ skills                  → 2 pts
 *   10+ skills                 → 2 pts
 *   Has programming languages  → 2 pts
 *   Has frameworks             → 2 pts
 *   Has databases              → 2 pts
 *   No duplicates              → 2 pts (deduction if found)
 */

// Categorization maps — order matters (first match wins)
const LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'c ',
  'go', 'rust', 'kotlin', 'swift', 'php', 'ruby', 'scala', 'dart',
  'r ', 'matlab', 'bash', 'shell', 'sql', 'html', 'css',
  'html5', 'css3',
];

const FRAMEWORKS = [
  'react', 'react.js', 'next.js', 'vue', 'vue.js', 'angular', 'nuxt',
  'express', 'express.js', 'node.js', 'fastapi', 'django', 'flask',
  'spring', 'spring boot', '.net', 'rails', 'laravel', 'tailwind',
  'bootstrap', 'redux', 'graphql', 'nest.js', 'svelte',
];

const DATABASES = [
  'mysql', 'postgresql', 'mongodb', 'sqlite', 'redis', 'cassandra',
  'dynamodb', 'firebase', 'oracle', 'mssql', 'elasticsearch',
  'supabase', 'planetscale', 'cockroachdb', 'database design',
];

const CLOUD_DEVOPS = [
  'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'ci/cd', 'github actions',
  'jenkins', 'terraform', 'ansible', 'nginx', 'linux', 'vercel', 'netlify',
  'heroku', 'digitalocean',
];

const TOOLS = [
  'git', 'github', 'gitlab', 'jira', 'figma', 'postman', 'vscode',
  'webpack', 'vite', 'jest', 'mocha', 'cypress', 'swagger', 'notion',
];

const categorizeSkill = (skill) => {
  const s = skill.toLowerCase().trim();

  if (LANGUAGES.some(l => s === l || s.startsWith(l))) return 'languages';
  if (FRAMEWORKS.some(f => s.includes(f))) return 'frameworks';
  if (DATABASES.some(d => s.includes(d))) return 'databases';
  if (CLOUD_DEVOPS.some(c => s.includes(c))) return 'cloud';
  if (TOOLS.some(t => s.includes(t))) return 'tools';
  return 'other';
};

export const analyzeSkills = (resume) => {
  const rawSkills = resume.skills || [];
  const deductions = [];

  // Detect duplicates (case-insensitive)
  const seen = new Set();
  const duplicates = [];
  const uniqueSkills = [];

  for (const skill of rawSkills) {
    const key = skill.toLowerCase().trim();
    if (seen.has(key)) {
      duplicates.push(skill);
    } else {
      seen.add(key);
      uniqueSkills.push(skill);
    }
  }

  // Categorize each unique skill
  const categorized = {
    languages:  [],
    frameworks: [],
    databases:  [],
    cloud:      [],
    tools:      [],
    other:      [],
  };

  for (const skill of uniqueSkills) {
    const category = categorizeSkill(skill);
    categorized[category].push(skill);
  }

  const checks = {
    hasSkills:     uniqueSkills.length > 0,
    hasFivePlus:   uniqueSkills.length >= 5,
    hasTenPlus:    uniqueSkills.length >= 10,
    hasLanguages:  categorized.languages.length > 0,
    hasFrameworks: categorized.frameworks.length > 0,
    hasDatabases:  categorized.databases.length > 0,
    hasDuplicates: duplicates.length > 0,
  };

  let earnedScore = 0;

  if (checks.hasSkills)     { earnedScore += 3; }
  else { deductions.push({ reason: 'No skills listed', points: -3 }); }

  if (checks.hasFivePlus)   { earnedScore += 2; }
  else { deductions.push({ reason: 'Fewer than 5 skills listed — add more', points: -2 }); }

  if (checks.hasTenPlus)    { earnedScore += 2; }
  else { deductions.push({ reason: 'Fewer than 10 skills — strong resumes have 10-20', points: -2 }); }

  if (checks.hasLanguages)  { earnedScore += 2; }
  else { deductions.push({ reason: 'No programming languages listed', points: -2 }); }

  if (checks.hasFrameworks) { earnedScore += 2; }
  else { deductions.push({ reason: 'No frameworks listed', points: -2 }); }

  if (checks.hasDatabases)  { earnedScore += 2; }
  else { deductions.push({ reason: 'No databases listed', points: -2 }); }

  if (checks.hasDuplicates) {
    deductions.push({ reason: `Duplicate skills found: ${duplicates.join(', ')}`, points: -2 });
  } else {
    earnedScore += 2;
  }

  return {
    maxScore: 15,
    earnedScore: Math.min(earnedScore, 15),
    checks,
    categorized,
    totalSkills: uniqueSkills.length,
    duplicates,
    deductions,
  };
};
