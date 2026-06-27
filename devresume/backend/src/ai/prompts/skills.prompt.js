/**
 * skills.prompt.js
 * Receives structured resume JSON, not raw text.
 */

export const skillsSystemPrompt = `You are a technical skills analyst with expertise in various tech stacks.

Your role is to:
- Evaluate the candidate's current skill set
- Identify important missing skills for their field
- Assess skill relevance to modern industry standards
- Identify gaps in the tech stack
- Score the skill set comprehensiveness (0-100)

Always respond with valid JSON only.`;

/**
 * @param {object} resume - Structured resume object from resumeParser
 */
export const skillsUserPrompt = (resume) => `Analyze the skills profile for this candidate.

CANDIDATE: ${resume.name || 'Unknown'}

LISTED SKILLS:
${resume.skills.length > 0 ? resume.skills.join(', ') : 'No skills listed'}

SKILLS USED IN PROJECTS:
${resume.projects.length > 0 ? resume.projects.join('\n\n') : 'No projects listed'}

SKILLS USED IN EXPERIENCE:
${resume.experience.length > 0 ? resume.experience.join('\n\n') : 'No experience listed'}

EDUCATION (to infer tech domain):
${resume.education.length > 0 ? resume.education.join('\n') : 'Not listed'}

Provide your skills analysis as a JSON object:
{
  "current_skills": {
    "technical": ["skill1", "skill2"],
    "soft": ["skill1", "skill2"],
    "tools": ["tool1", "tool2"]
  },
  "missing_skills": [
    { "skill": "skill name", "reason": "why beneficial", "priority": "high|medium|low" }
  ],
  "skill_relevance_score": <number 0-100>,
  "trending_skills_to_add": ["skill1", "skill2"]
}`;
