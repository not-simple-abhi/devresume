import openai from '../../config/openai.js';
import { recruiterSystemPrompt, recruiterUserPrompt } from '../prompts/recruiter.prompt.js';
import { extractJsonFromText } from '../../utils/responseFormatter.js';

export const analyzeRecruiter = async (resumeText) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: recruiterSystemPrompt },
        { role: 'user', content: recruiterUserPrompt(resumeText) },
      ],
      temperature: 0.4,
      response_format: { type: 'json_object' },
    });
    return extractJsonFromText(response.choices[0].message.content);
  } catch (error) {
    console.error('Recruiter Agent Error:', error);
    throw new Error(`Recruiter analysis failed: ${error.message}`);
  }
};
