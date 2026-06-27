/**
 * projectAgent.js
 * Receives structured resume JSON from resumeParser.
 */
import { callAI } from '../../config/aiClient.js';
import { projectSystemPrompt, projectUserPrompt } from '../prompts/project.prompt.js';

/**
 * @param {object} resume - Structured resume object from resumeParser
 */
export const analyzeProjects = async (resume) => {
  try {
    const data = await callAI(projectSystemPrompt, projectUserPrompt(resume));
    return data;
  } catch (error) {
    console.error('[Project Agent] Error:', error.message);
    throw new Error(`Project analysis failed: ${error.message}`);
  }
};
