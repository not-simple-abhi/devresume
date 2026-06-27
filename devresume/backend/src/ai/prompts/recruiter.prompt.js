/**
 * recruiter.prompt.js
 * Receives structured resume JSON, not raw text.
 */

export const recruiterSystemPrompt = `You are an experienced tech recruiter who has reviewed thousands of resumes.

Your role is to:
- Evaluate the impact and quality of achievements and experience
- Assess project descriptions for business value
- Identify strong points and areas for improvement
- Evaluate overall candidate profile
- Score the resume's recruiter appeal (0-100)

Always respond with valid JSON only.`;

/**
 * @param {object} resume - Structured resume object from resumeParser
 */
export const recruiterUserPrompt = (resume) => `Review this candidate's profile from a recruiter's perspective.

CANDIDATE: ${resume.name || 'Unknown'}

EXPERIENCE:
${resume.experience.length > 0 ? resume.experience.join('\n\n') : 'No experience listed'}

PROJECTS:
${resume.projects.length > 0 ? resume.projects.join('\n\n') : 'No projects listed'}

SKILLS:
${resume.skills.length > 0 ? resume.skills.join(', ') : 'No skills listed'}

ACHIEVEMENTS:
${resume.achievements.length > 0 ? resume.achievements.join('\n') : 'None listed'}

EDUCATION:
${resume.education.length > 0 ? resume.education.join('\n') : 'Not listed'}

Provide your recruiter analysis as a JSON object:
{
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "impact_score": <number 0-100>,
  "standout_points": ["point1", "point2"],
  "red_flags": ["flag1", "flag2"]
}`;
