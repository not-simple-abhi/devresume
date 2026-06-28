import { callAI } from '../../config/aiClient.js';
import { grammarSystemPrompt, grammarUserPrompt } from '../prompts/grammar.prompt.js';
import { extractJsonFromText } from '../../utils/responseFormatter.js';

export const analyzeGrammar = async (resume) => {
  try {
    return await callAI(grammarSystemPrompt, grammarUserPrompt(resume));
  } catch (error) {
    console.error('[Grammar Agent] Error:', error.message);
    // Return safe default so other agents aren't blocked
    return {
      errors: [],
      suggestions: ['Could not analyze grammar at this time'],
      clarity_score: 50,
      tone: 'professional',
      consistency_issues: [],
    };
  }
};
