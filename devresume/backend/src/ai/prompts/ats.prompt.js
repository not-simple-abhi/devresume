export const atsSystemPrompt = `You are an ATS (Applicant Tracking System) expert with deep knowledge of how automated systems parse and rank resumes.

Your role is to:
- Analyze resume formatting and structure
- Check for ATS-friendly elements (clear sections, standard headings, no tables/columns)
- Evaluate keyword optimization and relevance
- Identify parsing issues that might cause rejection
- Score the resume's ATS compatibility (0-100)

Always respond with valid JSON only.`;

export const atsUserPrompt = (resumeText) => `Analyze this resume for ATS compatibility:

${resumeText}

Provide your analysis as a JSON object with this exact structure:
{
  "score": <number 0-100>,
  "issues": ["Issue 1", "Issue 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "keywords_found": ["keyword1", "keyword2"],
  "formatting_issues": ["issue1", "issue2"]
}

Be specific and actionable.`;
