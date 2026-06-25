export const aggregateReports = async (agentResults) => {
  const { ats, recruiter, grammar, skills, projects } = agentResults;

  const finalReport = {
    atsScore: ats.score || 0,

    summary: {
      overallScore: calculateOverallScore(agentResults),
      keyHighlights: (recruiter.standout_points || []).slice(0, 3),
      criticalIssues: [
        ...(ats.issues || []).slice(0, 2),
        ...(grammar.errors || []).slice(0, 2).map((e) => e.text),
      ],
    },

    strengths: recruiter.strengths || [],
    weaknesses: recruiter.weaknesses || [],

    missingSkills: (skills.missing_skills || []).map((s) => ({
      skill: s.skill,
      reason: s.reason,
      priority: s.priority,
    })),

    grammarSuggestions: (grammar.errors || []).map((e) => ({
      type: e.type,
      issue: e.text,
      fix: e.suggestion,
    })),

    projectSuggestions: projects.project_suggestions || [],
    recommendedProjects: projects.recommended_projects || [],

    detailedScores: {
      ats: ats.score || 0,
      recruiter: recruiter.impact_score || 0,
      grammar: grammar.clarity_score || 0,
      skills: skills.skill_relevance_score || 0,
      projects: projects.portfolio_score || 0,
    },

    actionableSteps: generateActionableSteps(agentResults),
  };

  return finalReport;
};

const calculateOverallScore = ({ ats, recruiter, grammar, skills, projects }) => {
  const scores = [
    ats.score || 0,
    recruiter.impact_score || 0,
    grammar.clarity_score || 0,
    skills.skill_relevance_score || 0,
    projects.portfolio_score || 0,
  ];
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
};

const generateActionableSteps = ({ ats, grammar, skills }) => {
  const steps = [];

  if ((ats.score || 0) < 70) {
    steps.push('Improve ATS compatibility by fixing formatting issues');
  }
  if (grammar.errors && grammar.errors.length > 0) {
    steps.push('Fix grammar and spelling errors in your resume');
  }
  if (skills.missing_skills && skills.missing_skills.length > 0) {
    const top3 = skills.missing_skills.slice(0, 3).map((s) => s.skill).join(', ');
    steps.push(`Add in-demand missing skills: ${top3}`);
  }

  return steps;
};
