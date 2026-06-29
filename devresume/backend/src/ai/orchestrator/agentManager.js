/**
 * agentManager.js
 *
 * AI Orchestrator — coordinates all AI agents.
 *
 * IMPORTANT: AI agents NO LONGER calculate scores.
 * Scores come from the Rule Engine (calculateScore.js).
 * AI agents only: Explain, Critique, Recommend, Rewrite.
 *
 * Input:
 *   resume   — structured resume JSON
 *   analysis — facts from Intelligence Engine
 *   scores   — calculated scores from Rule Engine
 *
 * Output: AI explanations and recommendations
 */

import { analyzeATS }      from '../agents/atsAgent.js';
import { analyzeRecruiter } from '../agents/recruiterAgent.js';
import { analyzeGrammar }   from '../agents/grammarAgent.js';
import { analyzeSkills }    from '../agents/skillsAgent.js';
import { analyzeProjects }  from '../agents/projectAgent.js';

/**
 * orchestrate(resume, analysis, scores)
 *
 * Runs AI agents sequentially (to respect free tier rate limits).
 * Each agent receives the pre-calculated scores + facts so it
 * focuses on explanation, not calculation.
 *
 * @param {object} resume   - Structured resume from resumeParser
 * @param {object} analysis - Facts from Intelligence Engine
 * @param {object} scores   - Scores from Rule Engine
 */
export const orchestrate = async (resume, analysis, scores) => {
  console.log(`[AgentManager] Starting AI orchestration for: ${resume.name || 'Unknown'}`);

  // ATS agent — explain the ATS score, keyword gaps, formatting
  const ats = await analyzeATS(resume, analysis, scores);
  console.log('[AgentManager] ATS done');

  // Recruiter agent — overall impression, strengths, weaknesses
  const recruiter = await analyzeRecruiter(resume, analysis, scores);
  console.log('[AgentManager] Recruiter done');

  // Grammar agent — writing quality, tone, clarity
  const grammar = await analyzeGrammar(resume, analysis, scores);
  console.log('[AgentManager] Grammar done');

  // Skills agent — missing skills, recommendations
  const skills = await analyzeSkills(resume, analysis, scores);
  console.log('[AgentManager] Skills done');

  // Projects agent — project improvement suggestions
  const projects = await analyzeProjects(resume, analysis, scores);
  console.log('[AgentManager] Projects done');

  console.log('[AgentManager] All AI agents done');

  return {
    ats,
    recruiter,
    grammar,
    skills,
    projects,
  };
};
