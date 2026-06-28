import { analyzeATS } from '../agents/atsAgent.js';
import { analyzeRecruiter } from '../agents/recruiterAgent.js';
import { analyzeGrammar } from '../agents/grammarAgent.js';
import { analyzeSkills } from '../agents/skillsAgent.js';
import { analyzeProjects } from '../agents/projectAgent.js';
import { aggregateReports } from '../aggregator/aggregatorAgent.js';

/**
 * Runs the ATS agent.
 * @param {object} resume - Structured resume data
 */
export const runATS = async (resume) => {
  return await analyzeATS(resume);
};

/**
 * Runs the Grammar agent.
 * @param {object} resume - Structured resume data
 */
export const runGrammar = async (resume) => {
  return await analyzeGrammar(resume);
};

/**
 * Runs the Recruiter agent.
 * @param {object} resume - Structured resume data
 */
export const runRecruiter = async (resume) => {
  return await analyzeRecruiter(resume);
};

/**
 * Runs the Skills agent.
 * @param {object} resume - Structured resume data
 */
export const runSkills = async (resume) => {
  return await analyzeSkills(resume);
};

/**
 * Runs the Projects agent.
 * @param {object} resume - Structured resume data
 */
export const runProjects = async (resume) => {
  return await analyzeProjects(resume);
};

/**
 * Aggregates all individual agent reports.
 * @param {object} agentResults - Combined results from all agents
 */
export const aggregate = async (agentResults) => {
  return await aggregateReports(agentResults);
};

/**
 * Main coordinator function. Runs all agents sequentially to respect rate limits
 * and returns the final aggregated report.
 * @param {object} resume - Structured resume data
 * @returns {object} Final aggregated report
 */
export const orchestrate = async (resume) => {
  console.log(`[AgentManager] Starting orchestration for: ${resume.name || 'Unknown'}`);

  const ats = await runATS(resume);
  console.log('[AgentManager] ATS agent analysis completed');

  const recruiter = await runRecruiter(resume);
  console.log('[AgentManager] Recruiter agent analysis completed');

  const grammar = await runGrammar(resume);
  console.log('[AgentManager] Grammar agent analysis completed');

  const skills = await runSkills(resume);
  console.log('[AgentManager] Skills agent analysis completed');

  const projects = await runProjects(resume);
  console.log('[AgentManager] Projects agent analysis completed');

  console.log('[AgentManager] Aggregating agent outputs...');
  const finalReport = await aggregate({
    ats,
    recruiter,
    grammar,
    skills,
    projects,
  });

  return finalReport;
};
