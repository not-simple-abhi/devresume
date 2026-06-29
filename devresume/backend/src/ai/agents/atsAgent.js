import { callAI } from '../../config/aiClient.js';
import { atsSystemPrompt, atsUserPrompt } from '../prompts/ats.prompt.js';

export const analyzeATS = async (resume, analysis, scores) => {
  try {
    return await callAI(atsSystemPrompt, atsUserPrompt(resume, analysis, scores));
  } catch (error) {
    console.error('[ATS Agent] Error:', error.message);
    return {
      score_explanation: 'Could not generate ATS explanation at this time.',
      ats_issues: [],
      keyword_recommendations: (analysis?.keywords?.missingKeywords || [])
        .slice(0, 5)
        .map(k => `Add '${k}' to your skills section`),
      formatting_recommendations: [],
      quick_wins: [],
    };
  }
};
