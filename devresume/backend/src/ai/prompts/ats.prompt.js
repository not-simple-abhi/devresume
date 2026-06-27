/**
 * ats.prompt.js
 * Receives structured resume JSON, not raw text.
 */

export const atsSystemPrompt = `You are an ATS (Applicant Tracking System) expert with deep knowledge of how automated systems parse and rank resumes.

Your role is to:
- Analyze the resume's skills, experience, and formatting signals for ATS compatibility
- Check for keyword density and relevance
- Identify what might cause an ATS to reject or downrank the resume
- Score the resume's ATS compatibility (0-100)

Always respond with valid JSON only.`;

/**
 * @param {object} resume - Structured resume object from resumeParser
 */
export const atsUserPrompt = (resume) => `Analyze this resume for ATS compatibility.

CANDIDATE: ${resume.name || 'Unknown'}
EMAIL: ${resume.email || 'Not found'}

SKILLS:
${resume.skills.length > 0 ? resume.skills.join(', ') : 'No skills listed'}

EXPERIENCE:
${resume.experience.length > 0 ? resume.experience.join('\n\n') : 'No experience listed'}

PROJECTS:
${resume.projects.length > 0 ? resume.projects.join('\n\n') : 'No projects listed'}

EDUCATION:
${resume.education.length > 0 ? resume.education.join('\n') : 'No education listed'}

ACHIEVEMENTS:
${resume.achievements.length > 0 ? resume.achievements.join('\n') : 'None listed'}

Based on this structured data, provide your ATS analysis as a JSON object:
{
  "score": <number 0-100>,
  "issues": ["Issue 1", "Issue 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "keywords_found": ["keyword1", "keyword2"],
  "formatting_issues": ["issue1", "issue2"]
}

Be specific and actionable.`;
