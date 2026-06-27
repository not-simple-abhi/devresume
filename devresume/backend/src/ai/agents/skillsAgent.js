/**
 * skillsAgent.js
 * Receives structured resume JSON from resumeParser.
 */
import { callAI } from '../../config/aiClient.js';
import { skillsSystemPrompt, skillsUserPrompt } from '../prompts/skills.prompt.js';

/**
 * @param {object} resume - Structured resume object from resumeParser
 */
export const analyzeSkills = async (resume) => {
  try {
    const data = await callAI(skillsSystemPrompt, skillsUserPrompt(resume));
    return data;
  } catch (error) {
    console.error('[Skills Agent] Error:', error.message);
    throw new Error(`Skills analysis failed: ${error.message}`);
  }
};
