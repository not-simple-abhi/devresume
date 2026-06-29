/**
 * projectAnalyzer.js
 *
 * This is the most important analyzer.
 * Each project is checked for title, description quality,
 * tech stack, action verbs, metrics, and links.
 * Max score: 25 points
 */

// Strong action verbs that show ownership and impact
const ACTION_VERBS = [
  'built', 'developed', 'created', 'designed', 'implemented', 'engineered',
  'architected', 'deployed', 'launched', 'optimized', 'improved', 'reduced',
  'increased', 'automated', 'integrated', 'migrated', 'refactored', 'led',
  'managed', 'collaborated', 'delivered', 'shipped', 'published', 'contributed',
];

// Metric patterns — numbers show real impact
const METRIC_PATTERNS = [
  /\d+\s*%/,          // "40% reduction"
  /\d+\+?\s*users?/i, // "500+ users"
  /\d+x\s/,           // "3x faster"
  /\$\d+/,            // "$50k revenue"
  /\d+\s*ms\b/i,      // "200ms response"
  /\d+\s*(k|m|b)\b/i, // "10k requests"
  /\d+\s*requests?/i, // "1000 requests"
  /\d+\s*stars?/i,    // "100 stars"
];

// Link patterns
const LINK_PATTERNS = {
  github: /github\.com/i,
  live:   /https?:\/\/(?!github)/i,
};

const hasActionVerb = (text) => {
  const lower = text.toLowerCase();
  return ACTION_VERBS.some(verb => lower.includes(verb));
};

const hasMetrics = (text) =>
  METRIC_PATTERNS.some(p => p.test(text));

const hasTechStack = (text) => {
  // A tech stack is mentioned if we see known tech words
  const techWords = [
    'react', 'node', 'python', 'java', 'mongodb', 'sql', 'aws', 'docker',
    'flask', 'django', 'express', 'html', 'css', 'javascript', 'typescript',
    'api', 'rest', 'graphql', 'redis', 'postgresql', 'mysql', 'firebase',
  ];
  const lower = text.toLowerCase();
  return techWords.filter(t => lower.includes(t)).length >= 1;
};

const hasLink = (text) => ({
  github: LINK_PATTERNS.github.test(text),
  live:   LINK_PATTERNS.live.test(text),
});

const analyzeOneProject = (projectText, index) => {
  const issues = [];
  let score = 0;

  // Title check — first line or first sentence
  const firstLine = projectText.split('\n')[0].trim();
  const hasTitle = firstLine.length > 3 && firstLine.length < 100;

  if (hasTitle) { score += 2; }
  else { issues.push('No clear project title'); }

  // Description length — meaningful description
  const hasDescription = projectText.length > 50;
  if (hasDescription) { score += 2; }
  else { issues.push('Description too short — explain what you built'); }

  // Action verbs
  const usesActionVerb = hasActionVerb(projectText);
  if (usesActionVerb) { score += 2; }
  else { issues.push('No action verbs — start with "Built", "Developed", "Designed" etc.'); }

  // Tech stack mentioned
  const usesTech = hasTechStack(projectText);
  if (usesTech) { score += 2; }
  else { issues.push('Tech stack not mentioned — add the technologies used'); }

  // Metrics / numbers
  const usesMetrics = hasMetrics(projectText);
  if (usesMetrics) { score += 3; }
  else { issues.push('No metrics — add numbers like "500+ users", "40% faster", "3000 requests/day"'); }

  // Links
  const links = hasLink(projectText);
  if (links.github) { score += 1; }
  else { issues.push('No GitHub link'); }

  if (links.live) { score += 1; }
  else { issues.push('No live demo link'); }

  return {
    index: index + 1,
    title: firstLine.substring(0, 60),
    score,         // out of 13 per project
    maxScore: 13,
    checks: {
      hasTitle,
      hasDescription,
      usesActionVerb,
      usesTech,
      usesMetrics,
      hasGitHub: links.github,
      hasLiveLink: links.live,
    },
    issues,
  };
};

export const analyzeProjects = (resume) => {
  const projects = resume.projects || [];
  const deductions = [];

  if (projects.length === 0) {
    return {
      maxScore: 25,
      earnedScore: 0,
      checks: { hasProjects: false },
      projects: [],
      deductions: [{ reason: 'No projects listed — projects are crucial for fresher/junior resumes', points: -25 }],
    };
  }

  // Analyze each project individually
  const analyzedProjects = projects.map((text, i) => analyzeOneProject(text, i));

  // Score: base points for having projects + quality of each project
  let earnedScore = 0;

  // 3 pts for having at least 1 project
  earnedScore += 3;

  // 3 pts for having 2+ projects
  if (projects.length >= 2) { earnedScore += 3; }
  else { deductions.push({ reason: 'Only 1 project — aim for 2-3 strong projects', points: -3 }); }

  // Up to 19 pts from individual project quality (averaged across projects)
  const avgProjectScore = analyzedProjects.reduce((sum, p) => sum + p.score, 0) / analyzedProjects.length;
  const qualityPoints = Math.round((avgProjectScore / 13) * 19);
  earnedScore += qualityPoints;

  // Collect deductions from individual projects
  analyzedProjects.forEach((p) => {
    p.issues.forEach((issue) => {
      deductions.push({ reason: `Project ${p.index}: ${issue}`, points: -1 });
    });
  });

  const checks = {
    hasProjects:    true,
    hasMultiple:    projects.length >= 2,
    hasActionVerbs: analyzedProjects.some(p => p.checks.usesActionVerb),
    hasMetrics:     analyzedProjects.some(p => p.checks.usesMetrics),
    hasGitHub:      analyzedProjects.some(p => p.checks.hasGitHub),
    hasLiveLinks:   analyzedProjects.some(p => p.checks.hasLiveLink),
  };

  return {
    maxScore: 25,
    earnedScore: Math.min(earnedScore, 25),
    checks,
    projects: analyzedProjects,
    deductions,
  };
};
