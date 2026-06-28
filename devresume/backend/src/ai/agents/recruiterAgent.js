import { callAI } from '../../config/aiClient.js';
import { recruiterSystemPrompt, recruiterUserPrompt } from '../prompts/recruiter.prompt.js';

export const analyzeRecruiter = async (resume) => {
  try {
    return await callAI(recruiterSystemPrompt, recruiterUserPrompt(resume));
  } catch (error) {
    console.error('[Recruiter Agent] Error:', error.message);
    return {
      strengths: [],
      weaknesses: ['Could not complete recruiter analysis at this time'],
      impact_score: 50,
      standout_points: [],
      red_flags: [],
    };
  }
};
