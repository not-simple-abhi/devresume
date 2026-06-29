export const COMPANY_PROFILES = {
  google: {
    name: 'Google',
    tier: 'FAANG',
    focus: ['algorithms', 'data structures', 'system design', 'scalability', 'open source contributions'],
    techStack: ['Python', 'Java', 'C++', 'Go', 'Kubernetes', 'TensorFlow', 'BigQuery', 'GCP'],
    softSkills: ['leadership', 'communication', 'googleyness', 'collaboration'],
    minCGPA: 0,
    expectations: [
      'Strong DSA fundamentals (LeetCode hard level)',
      'System design experience at scale',
      'Impactful projects with measurable results',
      'Open source or research contributions preferred',
      'Clear communication of complex ideas',
    ],
  },

  microsoft: {
    name: 'Microsoft',
    tier: 'FAANG',
    focus: ['problem solving', 'OOP', 'system design', 'cloud', 'growth mindset'],
    techStack: ['C#', 'TypeScript', 'Python', 'Azure', '.NET', 'SQL', 'PowerShell'],
    softSkills: ['growth mindset', 'collaboration', 'customer obsession'],
    minCGPA: 7.0,
    expectations: [
      'Solid OOP and design patterns knowledge',
      'Azure or cloud experience is a plus',
      'Collaborative projects and team contributions',
      'Strong problem solving with clean code',
      'Growth mindset demonstrated in projects',
    ],
  },

  amazon: {
    name: 'Amazon',
    tier: 'FAANG',
    focus: ['leadership principles', 'scalability', 'ownership', 'data driven decisions'],
    techStack: ['Java', 'Python', 'AWS', 'DynamoDB', 'Lambda', 'React', 'Node.js'],
    softSkills: ['ownership', 'bias for action', 'customer obsession', 'deliver results'],
    minCGPA: 7.0,
    expectations: [
      'Resume must reflect Amazon Leadership Principles',
      'Quantified achievements with metrics (%, $, users)',
      'AWS knowledge or cloud experience',
      'End-to-end project ownership',
      'Examples of delivering under constraints',
    ],
  },

  atlassian: {
    name: 'Atlassian',
    tier: 'Top Tech',
    focus: ['collaboration tools', 'agile', 'distributed systems', 'open source'],
    techStack: ['Java', 'Python', 'React', 'Kotlin', 'AWS', 'Bitbucket', 'Jira API'],
    softSkills: ['teamwork', 'open communication', 'balance', 'empathy'],
    minCGPA: 6.5,
    expectations: [
      'Experience with agile/scrum methodologies',
      'Contributions to team or open source projects',
      'Distributed systems or microservices exposure',
      'Strong collaboration skills evident in projects',
      'Product thinking alongside engineering',
    ],
  },

  uber: {
    name: 'Uber',
    tier: 'Top Tech',
    focus: ['real-time systems', 'maps/location', 'microservices', 'high availability'],
    techStack: ['Go', 'Python', 'Java', 'Node.js', 'Kafka', 'MySQL', 'Redis', 'gRPC'],
    softSkills: ['ownership', 'speed', 'customer focus', 'data driven'],
    minCGPA: 7.0,
    expectations: [
      'Real-time or high-throughput system experience',
      'Microservices architecture knowledge',
      'Strong backend fundamentals',
      'Experience with databases at scale',
      'Fast execution and ownership mindset',
    ],
  },

  cisco: {
    name: 'Cisco',
    tier: 'Top Tech',
    focus: ['networking', 'security', 'infrastructure', 'embedded systems'],
    techStack: ['C', 'C++', 'Python', 'Java', 'networking protocols', 'Linux', 'Docker'],
    softSkills: ['problem solving', 'teamwork', 'technical communication'],
    minCGPA: 6.5,
    expectations: [
      'Networking or systems programming knowledge',
      'Security fundamentals are a plus',
      'Low-level programming experience (C/C++)',
      'Infrastructure or DevOps exposure',
      'Strong fundamentals in OS and networking',
    ],
  },

  expedia: {
    name: 'Expedia',
    tier: 'Top Tech',
    focus: ['travel tech', 'distributed systems', 'API design', 'A/B testing'],
    techStack: ['Java', 'Node.js', 'React', 'AWS', 'Kafka', 'GraphQL', 'Python'],
    softSkills: ['customer focus', 'data driven', 'collaboration'],
    minCGPA: 6.5,
    expectations: [
      'RESTful API or GraphQL experience',
      'Data-driven development and A/B testing',
      'Cloud-native application development',
      'Frontend + backend full stack capability',
      'Experience with large datasets or analytics',
    ],
  },

  jpmorgan: {
    name: 'JP Morgan',
    tier: 'Finance Tech',
    focus: ['fintech', 'security', 'compliance', 'data analysis', 'reliability'],
    techStack: ['Java', 'Python', 'SQL', 'Spring Boot', 'React', 'AWS', 'Spark'],
    softSkills: ['integrity', 'attention to detail', 'risk awareness', 'professionalism'],
    minCGPA: 7.0,
    expectations: [
      'Strong understanding of data structures and algorithms',
      'Database and SQL proficiency',
      'Security and compliance awareness',
      'Financial domain knowledge is a plus',
      'Highly professional and detail-oriented resume',
    ],
  },

  wellsfargo: {
    name: 'Wells Fargo',
    tier: 'Finance Tech',
    focus: ['banking systems', 'data security', 'compliance', 'Java enterprise'],
    techStack: ['Java', 'SQL', 'Python', 'Spring', 'Oracle DB', 'AWS', 'REST APIs'],
    softSkills: ['integrity', 'risk management', 'teamwork', 'customer focus'],
    minCGPA: 6.5,
    expectations: [
      'Enterprise Java or Spring Boot experience',
      'Strong SQL and database skills',
      'Understanding of security and compliance',
      'Professional and clean resume presentation',
      'Financial or banking domain exposure is a plus',
    ],
  },

  hsbc: {
    name: 'HSBC',
    tier: 'Finance Tech',
    focus: ['global banking', 'fintech', 'data engineering', 'compliance', 'cloud migration'],
    techStack: ['Java', 'Python', 'SQL', 'AWS', 'Azure', 'Spark', 'Kafka'],
    softSkills: ['global mindset', 'integrity', 'adaptability', 'communication'],
    minCGPA: 6.5,
    expectations: [
      'Data engineering or analytics experience',
      'Cloud migration or hybrid cloud knowledge',
      'Strong SQL and big data tools',
      'Compliance and risk awareness',
      'Cross-cultural communication skills',
    ],
  },

  zomato: {
    name: 'Zomato',
    tier: 'Indian Unicorn',
    focus: ['hyperlocal delivery', 'real-time systems', 'product thinking', 'scale'],
    techStack: ['Python', 'Go', 'React', 'Node.js', 'MySQL', 'Redis', 'Kafka', 'AWS'],
    softSkills: ['hustle', 'ownership', 'product thinking', 'speed'],
    minCGPA: 6.0,
    expectations: [
      'Fast-paced startup project experience',
      'Product-oriented thinking in projects',
      'Real-time or location-based systems a plus',
      'Full stack capability preferred',
      'Demonstrated ability to ship fast',
    ],
  },

  meesho: {
    name: 'Meesho',
    tier: 'Indian Unicorn',
    focus: ['social commerce', 'vernacular tech', 'growth', 'supply chain'],
    techStack: ['Python', 'Java', 'React', 'Node.js', 'MySQL', 'Redis', 'GCP'],
    softSkills: ['entrepreneurial', 'customer first', 'hustle', 'data driven'],
    minCGPA: 6.0,
    expectations: [
      'Growth or product-led project experience',
      'E-commerce or marketplace domain knowledge is a plus',
      'Data-driven decision making in projects',
      'Full stack or backend strong preferred',
      'Startup mindset and ownership',
    ],
  },

  deshaw: {
    name: 'D.E. Shaw',
    tier: 'Quant Finance',
    focus: ['algorithms', 'quantitative analysis', 'high performance computing', 'research'],
    techStack: ['C++', 'Python', 'Java', 'Linux', 'distributed systems', 'SQL'],
    softSkills: ['analytical thinking', 'intellectual curiosity', 'precision', 'research'],
    minCGPA: 8.0,
    expectations: [
      'Exceptional DSA and problem-solving skills',
      'Strong mathematics or statistics background',
      'High-performance or low-latency system experience',
      'Research publications or competitive programming',
      'Top academic record preferred',
    ],
  },

  sprinklr: {
    name: 'Sprinklr',
    tier: 'SaaS',
    focus: ['enterprise SaaS', 'social media tech', 'AI/ML', 'microservices'],
    techStack: ['Java', 'React', 'Node.js', 'MongoDB', 'Kafka', 'AWS', 'Spring Boot'],
    softSkills: ['customer success', 'collaboration', 'innovation', 'ownership'],
    minCGPA: 6.5,
    expectations: [
      'Enterprise software or SaaS project experience',
      'Microservices and event-driven architecture',
      'Full stack development capability',
      'AI/ML integration experience is a plus',
      'Strong Java backend skills',
    ],
  },

  myuntura: {
    name: 'MyUntura',
    tier: 'Startup',
    focus: ['healthtech', 'patient care', 'data', 'mobile'],
    techStack: ['React', 'Node.js', 'Python', 'MongoDB', 'AWS', 'React Native'],
    softSkills: ['empathy', 'hustle', 'ownership', 'communication'],
    minCGPA: 6.0,
    expectations: [
      'Healthcare or social impact project experience',
      'Mobile or web app development',
      'Data handling and privacy awareness',
      'Startup experience or side projects',
      'Strong ownership and self-starter attitude',
    ],
  },
};

export const companySystemPrompt = `You are an expert technical recruiter with deep knowledge of what top tech companies look for.

Your role is to:
- Evaluate the candidate's analyzed profile against a specific company's hiring bar
- Check skill alignment using the already-categorized skill data
- Assess readiness based on keyword coverage and project quality
- Give a realistic readiness score (0-100)
- Provide specific, actionable improvements

You must NOT re-analyze the resume — use the structured analysis provided.
Always respond with valid JSON only.`;

/**
 * @param {object} analysis - Output from resumeAnalyzer.js (single source of truth)
 * @param {string} company  - Company key (e.g. "google", "amazon")
 */
export const companyUserPrompt = (analysis, company) => {
  const profile = COMPANY_PROFILES[company.toLowerCase().replace(/\s/g, '')];

  if (!profile) {
    throw new Error(`Company profile not found for: ${company}`);
  }

  // Use analysis as the single source of truth — not raw resume
  const { skills, projects, experience, keywords, education } = analysis;

  // Calculate how many company tech stack items the candidate already has
  const allCandidateSkills = [
    ...skills.categorized.languages,
    ...skills.categorized.frameworks,
    ...skills.categorized.databases,
    ...skills.categorized.tools,
    ...skills.categorized.cloud,
    ...skills.categorized.other,
  ].map(s => s.toLowerCase());

  const matchingTech = profile.techStack.filter(t =>
    allCandidateSkills.some(s => s.includes(t.toLowerCase()))
  );

  const missingTech = profile.techStack.filter(t =>
    !allCandidateSkills.some(s => s.includes(t.toLowerCase()))
  );

  return `Evaluate this candidate for a role at ${profile.name}.

COMPANY PROFILE:
- Tier: ${profile.tier}
- Key Focus Areas: ${profile.focus.join(', ')}
- Required Tech Stack: ${profile.techStack.join(', ')}
- Soft Skills Valued: ${profile.softSkills.join(', ')}
- What ${profile.name} looks for:
${profile.expectations.map(e => `  • ${e}`).join('\n')}

CANDIDATE ANALYSIS (pre-analyzed — use this, do not re-analyze):

Skills by category:
- Languages:  ${skills.categorized.languages.join(', ')  || 'none'}
- Frameworks: ${skills.categorized.frameworks.join(', ') || 'none'}
- Databases:  ${skills.categorized.databases.join(', ')  || 'none'}
- Tools:      ${skills.categorized.tools.join(', ')      || 'none'}
- Cloud:      ${skills.categorized.cloud.join(', ')      || 'none'}
Total skills: ${skills.totalSkills || 0}

Tech stack match:
- Already has: ${matchingTech.join(', ') || 'none from required stack'}
- Missing:     ${missingTech.join(', ')  || 'none'}

Keyword coverage: ${keywords.coveragePercent}% (${keywords.detectedDomain} domain)
Missing keywords: ${keywords.missingKeywords.slice(0, 8).join(', ')}

Projects: ${projects.projects?.length || 0} total
${(projects.projects || []).map(p => `- "${p.title}" scored ${p.score}/${p.maxScore} (issues: ${p.issues.join(', ') || 'none'})`).join('\n')}

Experience entries: ${experience.entries?.length || 0}
Has metrics in experience: ${experience.checks?.hasMetrics || false}

Education: ${education.entries?.join(', ') || 'not listed'}

Evaluate readiness for ${profile.name} and respond with this JSON:
{
  "company": "${profile.name}",
  "tier": "${profile.tier}",
  "readiness_score": <number 0-100>,
  "is_ready": <true if score >= 70>,
  "verdict": "one line summary",
  "matching_skills": ["skills candidate has that align with ${profile.name}"],
  "missing_skills": ["important skills missing for ${profile.name}"],
  "gaps": ["specific gaps holding the candidate back"],
  "suggestions": [
    { "area": "area", "action": "specific action", "priority": "high|medium|low" }
  ],
  "resume_improvements": ["specific resume changes to target ${profile.name}"]
}`;
};
