/**
 * project.prompt.js
 *
 * AI role: Suggest how to improve project descriptions.
 * Do NOT score — Rule Engine handles scoring.
 */

export const projectSystemPrompt = `You are a project portfolio advisor for software engineers.

Your role is ONLY to:
- Suggest specific improvements to each project description
- Recommend adding metrics, links, tech stack mentions
- Suggest new project ideas based on candidate's skill gaps
- Help rewrite weak project descriptions

You must NOT calculate scores — scores are already calculated.
Always respond with valid JSON only.`;

/**
 * @param {object} resume   - Structured resume
 * @param {object} analysis - Intelligence Engine facts
 * @param {object} scores   - Rule Engine scores
 */
export const projectUserPrompt = (resume, analysis, scores) => `
Help improve this candidate's project portfolio.

CANDIDATE: ${resume.name || 'Unknown'}

PRE-CALCULATED PROJECT SCORE: ${scores.breakdown.projects}/${scores.maxBreakdown.projects}

PROJECT ANALYSIS (from rule engine):
${(analysis.projects.projects || []).map(p =>
  `- "${p.title}": ${p.score}/${p.maxScore} — Issues: ${p.issues.join(', ') || 'none'}`
).join('\n') || 'No project data'}

CURRENT PROJECTS:
${resume.projects.map((p, i) => `Project ${i + 1}:\n${p}`).join('\n\n') || 'No projects listed'}

SKILLS AVAILABLE: ${resume.skills.join(', ') || 'None'}

MISSING KEYWORDS: ${(analysis.keywords.missingKeywords || []).slice(0, 8).join(', ')}

Provide project improvement advice as JSON:
{
  "project_suggestions": [
    {
      "project_name": "project title",
      "current_issue": "what is weak",
      "improved_description": "rewritten 1-2 line description with action verb + tech + metric",
      "missing_elements": ["metric", "github link", "live link"]
    }
  ],
  "recommended_projects": [
    {
      "project_idea": "name",
      "description": "what to build in 1 sentence",
      "skills_demonstrated": ["skill1", "skill2"],
      "why_valuable": "why this helps the candidate"
    }
  ],
  "quick_wins": ["immediate things to add to existing projects"]
}`;
