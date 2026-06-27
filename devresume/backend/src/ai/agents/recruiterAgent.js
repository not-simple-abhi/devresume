import { callAI } from '../../config/aiClient.js';
import { recruiterSystemPrompt, recruiterUserPrompt } from '../prompts/recruiter.prompt.js';

export const analyzeRecruiter = async (resume) => {
  try {
    return await callAI(recruiterSystemPrompt, recruiterUserPrompt(resume));
  } catch (error) {
    console.error('[Recruiter Agent] Error:', error.message);
    throw new Error(`Recruiter analysis failed: ${error.message}`);
  }
};
