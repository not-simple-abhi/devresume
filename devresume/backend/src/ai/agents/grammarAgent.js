import openai from '../../config/openai.js';
import { grammarSystemPrompt, grammarUserPrompt } from '../prompts/grammar.prompt.js';
import { extractJsonFromText } from '../../utils/responseFormatter.js';

export const analyzeGrammar = async (resumeText) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: grammarSystemPrompt },
        { role: 'user', content: grammarUserPrompt(resumeText) },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });
    return extractJsonFromText(response.choices[0].message.content);
  } catch (error) {
    console.error('Grammar Agent Error:', error);
    throw new Error(`Grammar analysis failed: ${error.message}`);
  }
};
