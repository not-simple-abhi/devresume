import { analyzeContact }    from './analyzers/contactAnalyzer.js'
import { analyzeEducation }  from './analyzers/educationAnalyzer.js'
import { analyzeSkills }     from './analyzers/skillsAnalyzer.js'
import { analyzeProjects }   from './analyzers/projectAnalyzer.js'
import { analyzeExperience } from './analyzers/experienceAnalyzer.js'
import { analyzeKeywords }   from './analyzers/keywordAnalyzer.js'
import { analyzeATSFormat }  from './analyzers/atsFormatAnalyzer.js'

export const analyzeResume = (resume) => {
  console.log(`[IntelligenceEngine] Analyzing resume for: ${resume.name || 'Unknown'}`)

  const contact    = analyzeContact(resume)
  const education  = analyzeEducation(resume)
  const skills     = analyzeSkills(resume)
  const projects   = analyzeProjects(resume)
  const experience = analyzeExperience(resume)
  const keywords   = analyzeKeywords(resume)
  const atsFormat  = analyzeATSFormat(resume)

  console.log(`[IntelligenceEngine] Done. Domain: ${keywords.detectedDomain}${keywords.secondaryDomain ? ' + ' + keywords.secondaryDomain : ''}, Keyword coverage: ${keywords.coveragePercent}%`)

  return {
    candidateName:  resume.name  || 'Unknown',
    candidateEmail: resume.email || '',
    contact,
    education,
    skills,
    projects,
    experience,
    keywords,
    atsFormat,
    summary: {
      totalSkills:      skills.totalSkills || 0,
      totalProjects:    projects.projects?.length || 0,
      totalExperience:  experience.entries?.length || 0,
      detectedDomain:   keywords.detectedDomain,
      secondaryDomain:  keywords.secondaryDomain,
      keywordCoverage:  keywords.coveragePercent,
    },
  }
}
