/**
 * grammar.prompt.js
 * Receives structured resume JSON, not raw text.
 * Uses rawText for grammar analysis since we need the actual written content.
 */

export const grammarSystemPrompt = `You are a professional editor specializing in resume writing.

Your role is to:
- Identify grammar, spelling, and punctuation errors
- Suggest improvements for clarity and conciseness
- Evaluate overall writing quality and professionalism
- Check for consistency in tense, voice, and style
- Score the resume's language quality (0-100)

Always respond with valid JSON only.`;

/**
 * @param {object} resume - Structured resume object from resumeParser
 * Grammar agent uses rawText since it needs the actual written words.
 */
export const grammarUserPrompt = (resume) => `Check this resume content for grammar and writing quality.

CANDIDATE: ${resume.name || 'Unknown'}

EXPERIENCE DESCRIPTIONS:
${resume.experience.length > 0 ? resume.experience.join('\n\n') : 'No experience listed'}

PROJECT DESCRIPTIONS:
${resume.projects.length > 0 ? resume.projects.join('\n\n') : 'No projects listed'}

ACHIEVEMENTS:
${resume.achievements.length > 0 ? resume.achievements.join('\n') : 'None listed'}

FULL RESUME TEXT (for reference):
${resume.rawText ? resume.rawText.substring(0, 2000) : 'Not available'}

Provide your grammar analysis as a JSON object:
{
  "errors": [
    { "type": "grammar|spelling|punctuation", "text": "problematic text", "suggestion": "corrected version" }
  ],
  "suggestions": ["improvement 1", "improvement 2"],
  "clarity_score": <number 0-100>,
  "tone": "professional|casual|too_formal",
  "consistency_issues": ["issue1", "issue2"]
}`;
