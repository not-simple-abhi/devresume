import { callAI } from '../../config/aiClient.js';
import { skillsSystemPrompt, skillsUserPrompt } from '../prompts/skills.prompt.js';

export const analyzeSkills = async (resume) => {
  try {
    return await callAI(skillsSystemPrompt, skillsUserPrompt(resume));
  } catch (error) {
    console.error('[Skills Agent] Error:', error.message);
    return {
      current_skills: {
        technical: resume.skills || [],
        soft: [],
        tools: [],
      },
      missing_skills: [],
      skill_relevance_score: 50,
      trending_skills_to_add: [],
    };
  }
};
