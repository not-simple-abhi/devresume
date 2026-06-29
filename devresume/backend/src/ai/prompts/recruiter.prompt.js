/**
 * recruiter.prompt.js
 *
 * AI role: Explain WHY the scores are what they are.
 * Do NOT calculate scores — those come from the Rule Engine.
 */

export const recruiterSystemPrompt = `You are an experienced tech recruiter reviewing resumes.

Your role is ONLY to:
- Explain the candidate's overall impression as a recruiter
- Identify specific strengths with examples from their resume
- Identify specific weaknesses with actionable fixes
- Give a one-paragraph recruiter summary

You must NOT calculate or mention scores — scores are already calculated.
Always respond with valid JSON only.`;

/**
 * @param {object} resume   - Structured resume
 * @param {object} analysis - Intelligence Engine facts
 * @param {object} scores   - Rule Engine scores (already calculated)
 */
export const recruiterUserPrompt = (resume, analysis, scores) => `
Review this candidate's profile as an experienced recruiter.

CANDIDATE: ${resume.name || 'Unknown'}

PRE-CALCULATED SCORES (do not recalculate):
- Overall Score: ${scores.overall}/100 (${scores.label})
- Projects Score: ${scores.breakdown.projects}/${scores.maxBreakdown.projects}
- Experience Score: ${scores.breakdown.experience}/${scores.maxBreakdown.experience}
- Skills Score: ${scores.breakdown.skills}/${scores.maxBreakdown.skills}

KNOWN ISSUES (from rule engine):
${scores.topDeductions.slice(0, 5).map(d => `- ${d.reason}`).join('\n')}

SKILLS: ${resume.skills.join(', ') || 'None listed'}

EXPERIENCE:
${resume.experience.join('\n') || 'None listed'}

PROJECTS:
${resume.projects.join('\n\n') || 'None listed'}

ACHIEVEMENTS:
${resume.achievements.join('\n') || 'None listed'}

Based on all the above, provide your recruiter analysis as JSON:
{
  "summary": "2-3 sentence overall recruiter impression",
  "strengths": ["specific strength with example", "another strength"],
  "weaknesses": ["specific weakness with fix", "another weakness"],
  "standout_points": ["what makes this candidate memorable"],
  "red_flags": ["anything that concerns a recruiter"],
  "interview_readiness": "ready|needs_work|not_ready"
}`;
