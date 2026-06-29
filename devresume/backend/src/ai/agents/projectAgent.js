import { callAI } from '../../config/aiClient.js';
import { projectSystemPrompt, projectUserPrompt } from '../prompts/project.prompt.js';

export const analyzeProjects = async (resume, analysis, scores) => {
  try {
    return await callAI(projectSystemPrompt, projectUserPrompt(resume, analysis, scores));
  } catch (error) {
    console.error('[Project Agent] Error:', error.message);
    return {
      project_suggestions: [],
      recommended_projects: [],
      quick_wins: ['Could not generate project suggestions at this time'],
    };
  }
};
