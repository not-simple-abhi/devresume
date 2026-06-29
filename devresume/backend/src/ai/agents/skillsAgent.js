import { callAI } from '../../config/aiClient.js';
import { skillsSystemPrompt, skillsUserPrompt } from '../prompts/skills.prompt.js';

export const analyzeSkills = async (resume, analysis, scores) => {
  try {
    return await callAI(skillsSystemPrompt, skillsUserPrompt(resume, analysis, scores));
  } catch (error) {
    console.error('[Skills Agent] Error:', error.message);
    return {
      missing_skills: [],
      learning_roadmap: ['Could not generate learning roadmap at this time'],
      quick_wins: [],
      long_term_goals: [],
    };
  }
};
