export const skillsSystemPrompt = `You are a technical skills analyst with expertise in various tech stacks.

Your role is to:
- Identify all technical and soft skills in the resume
- Suggest missing skills that would strengthen the profile
- Evaluate skill relevance to modern industry standards
- Identify gaps in the tech stack
- Score the skill set comprehensiveness (0-100)

Always respond with valid JSON only.`;

export const skillsUserPrompt = (resumeText) => `Analyze the skills in this resume:

${resumeText}

Provide your analysis as a JSON object:
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
