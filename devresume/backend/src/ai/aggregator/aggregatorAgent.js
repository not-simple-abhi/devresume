

export const buildFinalReport = (resume, analysis, scores, aiReport) => {
  const { ats, recruiter, grammar, skills, projects } = aiReport;

  return {

    
    
    

    deterministicAnalysis: {

      
      overall:  scores.overall,
      atsScore: scores.atsScore,
      label:    scores.label,

      
      breakdown: scores.breakdown,

      
      maxBreakdown: scores.maxBreakdown,

      
      candidate: {
        name:  resume.name  || 'Unknown',
        email: resume.email || '',
        phone: resume.phone || '',
      },

      
      deductions: scores.topDeductions.map(d => d.reason),

      
      intelligence: {
        domain:           analysis.keywords.detectedDomain,
        keywordCoverage:  analysis.keywords.coveragePercent,
        coverageByDomain: analysis.keywords.coverage,
        matchedKeywords:  analysis.keywords.matchedKeywords,
        missingKeywords:  analysis.keywords.missingKeywords.slice(0, 10),
        skillCategories:  analysis.skills.categorized,
        totalSkills:      analysis.summary.totalSkills,
        totalProjects:    analysis.summary.totalProjects,
        totalExperience:  analysis.summary.totalExperience,
        projectScores:    (analysis.projects.projects || []).map(p => ({
          title:    p.title,
          score:    p.score,
          maxScore: p.maxScore,
          issues:   p.issues,
        })),
      },

      
      actionableSteps: generateActionableSteps(scores, analysis),
    },

    
    
    

    aiAnalysis: {

      ats: {
        scoreExplanation:          ats.score_explanation             || '',
        issues:                    ats.ats_issues                    || [],
        keywordRecommendations:    ats.keyword_recommendations       || [],
        formattingRecommendations: ats.formatting_recommendations    || [],
        quickWins:                 ats.quick_wins                    || [],
      },

      recruiter: {
        summary:            recruiter.summary             || '',
        strengths:          recruiter.strengths           || [],
        weaknesses:         recruiter.weaknesses          || [],
        standoutPoints:     recruiter.standout_points     || [],
        redFlags:           recruiter.red_flags           || [],
        interviewReadiness: recruiter.interview_readiness || 'needs_work',
      },

      grammar: {
        errors:             grammar.errors                || [],
        suggestions:        grammar.writing_suggestions   || [],
        tone:               grammar.tone                  || 'professional',
        tenseConsistent:    grammar.tense_consistent      ?? true,
        writingQuality:     grammar.overall_writing_quality || 'average',
      },

      skills: {
        missingSkills:   skills.missing_skills   || [],
        learningRoadmap: skills.learning_roadmap || [],
        quickWins:       skills.quick_wins       || [],
        longTermGoals:   skills.long_term_goals  || [],
      },

      projects: {
        suggestions:         projects.project_suggestions  || [],
        recommendedProjects: projects.recommended_projects || [],
        quickWins:           projects.quick_wins           || [],
      },
    },
  };
};


const generateActionableSteps = (scores, analysis) => {
  const steps = [
    ...scores.topDeductions
      .sort((a, b) => (a.points || 0) - (b.points || 0))
      .map(d => d.reason),
  ];

  if (analysis.keywords.coveragePercent < 40) {
    const missing = analysis.keywords.missingKeywords.slice(0, 3).join(', ');
    if (missing) steps.push(`Add these high-impact keywords: ${missing}`);
  }

  return [...new Set(steps)].slice(0, 5);
};
