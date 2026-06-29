import { callAI } from '../../config/aiClient.js';
import { recruiterSystemPrompt, recruiterUserPrompt } from '../prompts/recruiter.prompt.js';

export const analyzeRecruiter = async (resume, analysis, scores) => {
  try {
    return await callAI(recruiterSystemPrompt, recruiterUserPrompt(resume, analysis, scores));
  } catch (error) {
    console.error('[Recruiter Agent] Error:', error.message);
    return {
      summary: 'Could not complete recruiter analysis at this time.',
      strengths: [],
      weaknesses: ['Analysis unavailable'],
      standout_points: [],
      red_flags: [],
      interview_readiness: 'needs_work',
    };
  }
};
