import openai from '../../config/openai.js';
import { atsSystemPrompt, atsUserPrompt } from '../prompts/ats.prompt.js';
import { extractJsonFromText } from '../../utils/responseFormatter.js';

export const analyzeATS = async (resumeText) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: atsSystemPrompt },
        { role: 'user', content: atsUserPrompt(resumeText) },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });
    return extractJsonFromText(response.choices[0].message.content);
  } catch (error) {
    console.error('ATS Agent Error:', error);
    throw new Error(`ATS analysis failed: ${error.message}`);
  }
};
