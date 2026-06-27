import { callAI } from '../../config/aiClient.js';
import { grammarSystemPrompt, grammarUserPrompt } from '../prompts/grammar.prompt.js';

export const analyzeGrammar = async (resume) => {
  try {
    return await callAI(grammarSystemPrompt, grammarUserPrompt(resume));
  } catch (error) {
    console.error('[Grammar Agent] Error:', error.message);
    throw new Error(`Grammar analysis failed: ${error.message}`);
  }
};
