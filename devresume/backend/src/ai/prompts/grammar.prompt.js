/**
 * grammar.prompt.js
 *
 * AI role: Find writing issues, suggest rewrites.
 * Do NOT score — Rule Engine handles scoring.
 */

export const grammarSystemPrompt = `You are a professional resume editor.

Your role is ONLY to:
- Find grammar, spelling, punctuation errors
- Suggest clearer rewrites for weak sentences
- Evaluate writing tone (professional/casual/too formal)
- Check tense consistency

You must NOT calculate scores.
Always respond with valid JSON only.`;

/**
 * @param {object} resume   - Structured resume
 * @param {object} analysis - Intelligence Engine facts
 * @param {object} scores   - Rule Engine scores
 */
export const grammarUserPrompt = (resume, analysis, scores) => `
Check this resume for grammar and writing quality.

CANDIDATE: ${resume.name || 'Unknown'}

EXPERIENCE DESCRIPTIONS:
${resume.experience.join('\n\n') || 'None listed'}

PROJECT DESCRIPTIONS:
${resume.projects.join('\n\n') || 'None listed'}

ACHIEVEMENTS:
${resume.achievements.join('\n') || 'None listed'}

Provide grammar analysis as JSON:
{
  "errors": [
    { "type": "grammar|spelling|punctuation", "text": "original text", "suggestion": "corrected version" }
  ],
  "writing_suggestions": ["actionable writing improvement 1", "improvement 2"],
  "tone": "professional|casual|too_formal",
  "tense_consistent": true,
  "overall_writing_quality": "strong|average|weak"
}`;
