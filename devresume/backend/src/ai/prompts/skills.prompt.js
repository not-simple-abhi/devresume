/**
 * skills.prompt.js
 *
 * AI role: Recommend missing skills, explain why they matter.
 * Do NOT score — Rule Engine handles scoring.
 */

export const skillsSystemPrompt = `You are a technical skills advisor for software engineers.

Your role is ONLY to:
- Recommend specific skills the candidate should learn
- Explain WHY each skill matters for their domain
- Suggest a learning roadmap based on their current skills
- Identify which skills to prioritize

You must NOT calculate scores.
Always respond with valid JSON only.`;

/**
 * @param {object} resume   - Structured resume
 * @param {object} analysis - Intelligence Engine facts
 * @param {object} scores   - Rule Engine scores
 */
export const skillsUserPrompt = (resume, analysis, scores) => `
Analyze this candidate's skills and recommend what to add.

CANDIDATE: ${resume.name || 'Unknown'}
DOMAIN: ${analysis.keywords.detectedDomain}
KEYWORD COVERAGE: ${analysis.keywords.coveragePercent}%

CURRENT SKILLS:
${resume.skills.join(', ') || 'None listed'}

SKILLS ALREADY CATEGORIZED:
- Languages: ${analysis.skills.categorized.languages.join(', ') || 'none'}
- Frameworks: ${analysis.skills.categorized.frameworks.join(', ') || 'none'}
- Databases: ${analysis.skills.categorized.databases.join(', ') || 'none'}
- Tools: ${analysis.skills.categorized.tools.join(', ') || 'none'}

TOP MISSING KEYWORDS FOR ${analysis.keywords.detectedDomain.toUpperCase()}:
${analysis.keywords.missingKeywords.slice(0, 10).join(', ')}

Provide skills recommendations as JSON:
{
  "missing_skills": [
    { "skill": "Docker", "reason": "why it matters", "priority": "high|medium|low" }
  ],
  "learning_roadmap": ["Step 1: Learn X because...", "Step 2: ..."],
  "quick_wins": ["skills easy to add that boost score immediately"],
  "long_term_goals": ["skills worth investing 3-6 months in"]
}`;
