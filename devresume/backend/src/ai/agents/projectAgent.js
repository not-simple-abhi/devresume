import { callAI } from '../../config/aiClient.js';
import { projectSystemPrompt, projectUserPrompt } from '../prompts/project.prompt.js';

export const analyzeProjects = async (resume) => {
  try {
    return await callAI(projectSystemPrompt, projectUserPrompt(resume));
  } catch (error) {
    console.error('[Project Agent] Error:', error.message);
    return {
      project_strengths: [],
      project_suggestions: [],
      portfolio_score: 50,
      recommended_projects: [],
    };
  }
};
