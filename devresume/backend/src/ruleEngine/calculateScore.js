

import { SCORING_CONFIG, getScoreLabel } from './scoringConfig.js';
import { normalize, clamp, round }       from './scoreUtils.js';


export const calculateScore = (analysis) => {

  
  
  

  const breakdown = {
    contact: round(
      clamp(normalize(
        analysis.contact.earnedScore,
        analysis.contact.maxScore,
        SCORING_CONFIG.contact.weight
      ))
    ),

    education: round(
      clamp(normalize(
        analysis.education.earnedScore,
        analysis.education.maxScore,
        SCORING_CONFIG.education.weight
      ))
    ),

    skills: round(
      clamp(normalize(
        analysis.skills.earnedScore,
        analysis.skills.maxScore,
        SCORING_CONFIG.skills.weight
      ))
    ),

    projects: round(
      clamp(normalize(
        analysis.projects.earnedScore,
        analysis.projects.maxScore,
        SCORING_CONFIG.projects.weight
      ))
    ),

    experience: round(
      clamp(normalize(
        analysis.experience.earnedScore,
        analysis.experience.maxScore,
        SCORING_CONFIG.experience.weight
      ))
    ),

    keywords: round(
      clamp(normalize(
        analysis.keywords.earnedScore,
        analysis.keywords.maxScore,
        SCORING_CONFIG.keywords.weight
      ))
    ),
  };

  
  const overall = clamp(
    round(Object.values(breakdown).reduce((sum, s) => sum + s, 0))
  );

  
  const allDeductions = [
    ...(analysis.contact.deductions    || []),
    ...(analysis.education.deductions  || []),
    ...(analysis.skills.deductions     || []),
    ...(analysis.projects.deductions   || []),
    ...(analysis.experience.deductions || []),
    ...(analysis.keywords.deductions   || []),
  ];

  
  
  const contactPct  = analysis.contact.earnedScore  / analysis.contact.maxScore;
  const skillsPct   = analysis.skills.earnedScore   / analysis.skills.maxScore;
  const keywordsPct = analysis.keywords.earnedScore / analysis.keywords.maxScore;

  const atsScore = clamp(round(
    (keywordsPct * 50) +   
    (contactPct  * 30) +   
    (skillsPct   * 20)     
  ));

  return {
    overall,                         
    atsScore,                        
    label: getScoreLabel(overall),   

    breakdown,                       

    
    sectionLabels: Object.fromEntries(
      Object.entries(SCORING_CONFIG).map(([k, v]) => [k, v.label])
    ),

    
    topDeductions: allDeductions
      .sort((a, b) => (a.points || 0) - (b.points || 0)) 
      .slice(0, 8),

    
    maxBreakdown: Object.fromEntries(
      Object.entries(SCORING_CONFIG).map(([k, v]) => [k, v.weight])
    ),
  };
};
