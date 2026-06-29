import { callAI } from '../../config/aiClient.js';
import { grammarSystemPrompt, grammarUserPrompt } from '../prompts/grammar.prompt.js';

export const analyzeGrammar = async (resume, analysis, scores) => {
  try {
    return await callAI(grammarSystemPrompt, grammarUserPrompt(resume, analysis, scores));
  } catch (error) {
    console.error('[Grammar Agent] Error:', error.message);
    return {
      errors: [],
      writing_suggestions: ['Could not analyze grammar at this time'],
      tone: 'professional',
      tense_consistent: true,
      overall_writing_quality: 'average',
    };
  }
};
