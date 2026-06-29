/**
 * calculateScore.js
 *
 * The Rule Engine — takes analyzer output, returns final scores.
 *
 * IMPORTANT:
 *   - Never inspects the resume directly
 *   - Only reads analysis.contact.earnedScore, analysis.skills.earnedScore etc.
 *   - All weights come from scoringConfig.js — never hardcoded here
 *
 * Input:  analysis object from resumeAnalyzer.js
 * Output: { overall, breakdown, label, deductions }
 */

import { SCORING_CONFIG, getScoreLabel } from './scoringConfig.js';
import { normalize, clamp, round }       from './scoreUtils.js';

/**
 * calculateScore(analysis)
 *
 * @param {object} analysis - Output from resumeAnalyzer.js
 * @returns {object} Final scores
 */
export const calculateScore = (analysis) => {

  // ── Calculate each section's weighted score ─────────────────
  // Formula: (earnedScore / maxScore) * weight
  // This maps any analyzer's scale to our target weight cleanly.

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

  // ── Overall score = sum of all weighted section scores ───────
  const overall = clamp(
    round(Object.values(breakdown).reduce((sum, s) => sum + s, 0))
  );

  // ── Collect all deductions across all analyzers ──────────────
  const allDeductions = [
    ...(analysis.contact.deductions    || []),
    ...(analysis.education.deductions  || []),
    ...(analysis.skills.deductions     || []),
    ...(analysis.projects.deductions   || []),
    ...(analysis.experience.deductions || []),
    ...(analysis.keywords.deductions   || []),
  ];

  // ── ATS score — based on keywords + contact + skills ─────────
  // Each section score is already on its weight scale, so convert to 0-100 first
  const contactPct  = analysis.contact.earnedScore  / analysis.contact.maxScore;
  const skillsPct   = analysis.skills.earnedScore   / analysis.skills.maxScore;
  const keywordsPct = analysis.keywords.earnedScore / analysis.keywords.maxScore;

  const atsScore = clamp(round(
    (keywordsPct * 50) +   // 50% weight on keywords
    (contactPct  * 30) +   // 30% weight on contact info
    (skillsPct   * 20)     // 20% weight on skills
  ));

  return {
    overall,                         // 0-100 final score
    atsScore,                        // 0-100 ATS-specific score
    label: getScoreLabel(overall),   // "Excellent" / "Good" / "Average" / "Needs Work"

    breakdown,                       // section-by-section scores

    // Config labels for each section (useful for frontend)
    sectionLabels: Object.fromEntries(
      Object.entries(SCORING_CONFIG).map(([k, v]) => [k, v.label])
    ),

    // Top deductions — most impactful issues
    topDeductions: allDeductions
      .sort((a, b) => (a.points || 0) - (b.points || 0)) // most negative first
      .slice(0, 8),

    // Max possible per section (for progress bars in frontend)
    maxBreakdown: Object.fromEntries(
      Object.entries(SCORING_CONFIG).map(([k, v]) => [k, v.weight])
    ),
  };
};
