


const ACTION_VERBS = [
  'built', 'developed', 'created', 'designed', 'implemented', 'engineered',
  'architected', 'deployed', 'launched', 'optimized', 'improved', 'reduced',
  'increased', 'automated', 'integrated', 'migrated', 'refactored', 'led',
  'managed', 'collaborated', 'delivered', 'shipped', 'published', 'contributed',
];


const METRIC_PATTERNS = [
  /\d+\s*%/,          
  /\d+\+?\s*users?/i, 
  /\d+x\s/,           
  /\$\d+/,            
  /\d+\s*ms\b/i,      
  /\d+\s*(k|m|b)\b/i, 
  /\d+\s*requests?/i, 
  /\d+\s*stars?/i,    
];


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

  
  const firstLine = projectText.split('\n')[0].trim();
  const hasTitle = firstLine.length > 3 && firstLine.length < 100;

  if (hasTitle) { score += 2; }
  else { issues.push('No clear project title'); }

  
  const hasDescription = projectText.length > 50;
  if (hasDescription) { score += 2; }
  else { issues.push('Description too short — explain what you built'); }

  
  const usesActionVerb = hasActionVerb(projectText);
  if (usesActionVerb) { score += 2; }
  else { issues.push('No action verbs — start with "Built", "Developed", "Designed" etc.'); }

  
  const usesTech = hasTechStack(projectText);
  if (usesTech) { score += 2; }
  else { issues.push('Tech stack not mentioned — add the technologies used'); }

  
  const usesMetrics = hasMetrics(projectText);
  if (usesMetrics) { score += 3; }
  else { issues.push('No metrics — add numbers like "500+ users", "40% faster", "3000 requests/day"'); }

  
  const links = hasLink(projectText);
  if (links.github) { score += 1; }
  else { issues.push('No GitHub link'); }

  if (links.live) { score += 1; }
  else { issues.push('No live demo link'); }

  return {
    index: index + 1,
    title: firstLine.substring(0, 60),
    score,         
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

  
  const analyzedProjects = projects.map((text, i) => analyzeOneProject(text, i));

  
  let earnedScore = 0;

  
  earnedScore += 3;

  
  if (projects.length >= 2) { earnedScore += 3; }
  else { deductions.push({ reason: 'Only 1 project — aim for 2-3 strong projects', points: -3 }); }

  
  const avgProjectScore = analyzedProjects.reduce((sum, p) => sum + p.score, 0) / analyzedProjects.length;
  const qualityPoints = Math.round((avgProjectScore / 13) * 19);
  earnedScore += qualityPoints;

  
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
