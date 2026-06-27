/**
 * project.prompt.js
 * Receives structured resume JSON, not raw text.
 */

export const projectSystemPrompt = `You are a project portfolio advisor who helps candidates showcase their work effectively.

Your role is to:
- Evaluate each project description for clarity and impact
- Suggest specific improvements to project descriptions
- Identify missing information (metrics, tech stack, impact)
- Recommend additional projects based on the candidate's skill set
- Score the overall project portfolio quality (0-100)

Always respond with valid JSON only.`;

/**
 * @param {object} resume - Structured resume object from resumeParser
 */
export const projectUserPrompt = (resume) => `Evaluate the project portfolio for this candidate.

CANDIDATE: ${resume.name || 'Unknown'}

PROJECTS:
${resume.projects.length > 0
  ? resume.projects.map((p, i) => `Project ${i + 1}:\n${p}`).join('\n\n')
  : 'No projects listed'}

SKILLS AVAILABLE:
${resume.skills.length > 0 ? resume.skills.join(', ') : 'Not listed'}

EXPERIENCE (for context):
${resume.experience.length > 0 ? resume.experience.join('\n\n') : 'No experience listed'}

Provide your project portfolio analysis as a JSON object:
{
  "project_strengths": ["Strength 1", "Strength 2"],
  "project_suggestions": [
    { "current_project": "project name or general", "suggestion": "specific improvement", "impact": "how this helps" }
  ],
  "portfolio_score": <number 0-100>,
  "recommended_projects": [
    { "project_idea": "name", "description": "what to build", "skills_demonstrated": ["skill1"] }
  ]
}`;
