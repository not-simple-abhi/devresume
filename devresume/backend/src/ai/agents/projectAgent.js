import openai from '../../config/openai.js';
import { projectSystemPrompt, projectUserPrompt } from '../prompts/project.prompt.js';
import { extractJsonFromText } from '../../utils/responseFormatter.js';

export const analyzeProjects = async (resumeText) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: projectSystemPrompt },
        { role: 'user', content: projectUserPrompt(resumeText) },
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });
    return extractJsonFromText(response.choices[0].message.content);
  } catch (error) {
    console.error('Project Agent Error:', error);
    throw new Error(`Project analysis failed: ${error.message}`);
  }
};
