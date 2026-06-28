import { callAI } from '../../config/aiClient.js';
import { atsSystemPrompt, atsUserPrompt } from '../prompts/ats.prompt.js';

export const analyzeATS = async (resume) => {
  try {
    return await callAI(atsSystemPrompt, atsUserPrompt(resume));
  } catch (error) {
    console.error('[ATS Agent] Error:', error.message);
    return {
      score: 50,
      issues: ['Could not complete ATS analysis at this time'],
      recommendations: [],
      keywords_found: resume.skills || [],
      formatting_issues: [],
    };
  }
};
