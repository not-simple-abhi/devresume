/**
 * resumeAnalyzer.js
 *
 * The Intelligence Engine entry point.
 * Runs all 6 analyzers and returns a complete facts object.
 *
 * IMPORTANT: This module only GATHERS FACTS.
 * It does NOT calculate final scores — that's the Rule Engine's job.
 * It does NOT call AI — that's the AI Orchestrator's job.
 *
 * Input:  structured resume JSON (from resumeParser.js)
 * Output: analysis result (facts from all 6 analyzers)
 */

import { analyzeContact }    from './analyzers/contactAnalyzer.js';
import { analyzeEducation }  from './analyzers/educationAnalyzer.js';
import { analyzeSkills }     from './analyzers/skillsAnalyzer.js';
import { analyzeProjects }   from './analyzers/projectAnalyzer.js';
import { analyzeExperience } from './analyzers/experienceAnalyzer.js';
import { analyzeKeywords }   from './analyzers/keywordAnalyzer.js';

/**
 * analyzeResume(resume)
 *
 * @param {object} resume - Structured resume from resumeParser.js
 * @returns {object} Complete analysis facts from all 6 analyzers
 */
export const analyzeResume = (resume) => {
  console.log(`[IntelligenceEngine] Analyzing resume for: ${resume.name || 'Unknown'}`);

  // Run all 6 analyzers — pure functions, no AI, no async
  const contact    = analyzeContact(resume);
  const education  = analyzeEducation(resume);
  const skills     = analyzeSkills(resume);
  const projects   = analyzeProjects(resume);
  const experience = analyzeExperience(resume);
  const keywords   = analyzeKeywords(resume);

  console.log(`[IntelligenceEngine] Done. Domain detected: ${keywords.detectedDomain}, Keyword coverage: ${keywords.coveragePercent}%`);

  return {
    // Who the resume belongs to
    candidateName:  resume.name || 'Unknown',
    candidateEmail: resume.email || '',

    // All 6 analyzer results
    contact,
    education,
    skills,
    projects,
    experience,
    keywords,

    // Quick summary counts (useful for Rule Engine)
    summary: {
      totalSkills:      skills.totalSkills || 0,
      totalProjects:    projects.projects?.length || 0,
      totalExperience:  experience.entries?.length || 0,
      detectedDomain:   keywords.detectedDomain,
      keywordCoverage:  keywords.coveragePercent,
    },
  };
};
