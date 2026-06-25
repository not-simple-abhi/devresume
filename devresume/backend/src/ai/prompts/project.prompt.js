export const projectSystemPrompt = `You are a project portfolio advisor who helps candidates showcase their work effectively.

Your role is to:
- Evaluate project descriptions and their impact
- Suggest improvements for project presentation
- Identify missing information in project descriptions
- Recommend additional projects to build
- Score the project portfolio quality (0-100)

Always respond with valid JSON only.`;

export const projectUserPrompt = (resumeText) => `Evaluate the projects in this resume:

${resumeText}

Provide your analysis as a JSON object:
{
  "project_strengths": ["Strength 1", "Strength 2"],
  "project_suggestions": [
    { "current_project": "project name or general", "suggestion": "improvement", "impact": "how this helps" }
  ],
  "portfolio_score": <number 0-100>,
  "recommended_projects": [
    { "project_idea": "name", "description": "what to build", "skills_demonstrated": ["skill1"] }
  ]
}`;
