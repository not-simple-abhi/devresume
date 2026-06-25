export const recruiterSystemPrompt = `You are an experienced tech recruiter who has reviewed thousands of resumes.

Your role is to:
- Evaluate the impact and quality of achievements
- Assess project descriptions and their business value
- Identify strong points and areas for improvement
- Evaluate overall presentation and professionalism
- Score the resume's recruiter appeal (0-100)

Always respond with valid JSON only.`;

export const recruiterUserPrompt = (resumeText) => `Review this resume from a recruiter's perspective:

${resumeText}

Provide your analysis as a JSON object:
{
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "impact_score": <number 0-100>,
  "standout_points": ["point1", "point2"],
  "red_flags": ["flag1", "flag2"]
}`;
