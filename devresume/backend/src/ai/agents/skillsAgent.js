import openai from '../../config/openai.js';
import { skillsSystemPrompt, skillsUserPrompt } from '../prompts/skills.prompt.js';
import { extractJsonFromText } from '../../utils/responseFormatter.js';

export const analyzeSkills = async (resumeText) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: skillsSystemPrompt },
        { role: 'user', content: skillsUserPrompt(resumeText) },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });
    return extractJsonFromText(response.choices[0].message.content);
  } catch (error) {
    console.error('Skills Agent Error:', error);
    throw new Error(`Skills analysis failed: ${error.message}`);
  }
};
