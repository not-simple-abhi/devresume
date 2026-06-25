export const grammarSystemPrompt = `You are a professional editor specializing in resume writing.

Your role is to:
- Identify grammar, spelling, and punctuation errors
- Suggest improvements for clarity and conciseness
- Evaluate overall writing quality
- Check for consistency in tense, voice, and style
- Score the resume's language quality (0-100)

Always respond with valid JSON only.`;

export const grammarUserPrompt = (resumeText) => `Check this resume for grammar and writing quality:

${resumeText}

Provide your analysis as a JSON object:
{
  "errors": [
    { "type": "grammar|spelling|punctuation", "text": "problematic text", "suggestion": "corrected version" }
  ],
  "suggestions": ["improvement 1", "improvement 2"],
  "clarity_score": <number 0-100>,
  "tone": "professional|casual|too_formal",
  "consistency_issues": ["issue1", "issue2"]
}`;
