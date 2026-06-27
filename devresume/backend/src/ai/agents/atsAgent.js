import { callAI } from '../../config/aiClient.js';
import { atsSystemPrompt, atsUserPrompt } from '../prompts/ats.prompt.js';

export const analyzeATS = async (resume) => {
  try {
    return await callAI(atsSystemPrompt, atsUserPrompt(resume));
  } catch (error) {
    console.error('[ATS Agent] Error:', error.message);
    throw new Error(`ATS analysis failed: ${error.message}`);
  }
};
