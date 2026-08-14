

import { analyzeATS }      from '../agents/atsAgent.js';
import { analyzeRecruiter } from '../agents/recruiterAgent.js';
import { analyzeGrammar }   from '../agents/grammarAgent.js';
import { analyzeSkills }    from '../agents/skillsAgent.js';
import { analyzeProjects }  from '../agents/projectAgent.js';


export const orchestrate = async (resume, analysis, scores) => {
  console.log(`[AgentManager] Starting AI orchestration for: ${resume.name || 'Unknown'}`);

  
  const ats = await analyzeATS(resume, analysis, scores);
  console.log('[AgentManager] ATS done');

  
  const recruiter = await analyzeRecruiter(resume, analysis, scores);
  console.log('[AgentManager] Recruiter done');

  
  const grammar = await analyzeGrammar(resume, analysis, scores);
  console.log('[AgentManager] Grammar done');

  
  const skills = await analyzeSkills(resume, analysis, scores);
  console.log('[AgentManager] Skills done');

  
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
