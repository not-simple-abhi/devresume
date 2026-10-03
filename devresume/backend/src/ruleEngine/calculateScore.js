import { SCORING_CONFIG, getScoreLabel } from './scoringConfig.js'
import { normalize, clamp, round }       from './scoreUtils.js'

export const calculateScore = (analysis) => {

  // ── Overall score (weighted sum across all sections) ──
  const breakdown = {
    contact:    round(clamp(normalize(analysis.contact.earnedScore,    analysis.contact.maxScore,    SCORING_CONFIG.contact.weight))),
    education:  round(clamp(normalize(analysis.education.earnedScore,  analysis.education.maxScore,  SCORING_CONFIG.education.weight))),
    skills:     round(clamp(normalize(analysis.skills.earnedScore,     analysis.skills.maxScore,     SCORING_CONFIG.skills.weight))),
    projects:   round(clamp(normalize(analysis.projects.earnedScore,   analysis.projects.maxScore,   SCORING_CONFIG.projects.weight))),
    experience: round(clamp(normalize(analysis.experience.earnedScore, analysis.experience.maxScore, SCORING_CONFIG.experience.weight))),
    keywords:   round(clamp(normalize(analysis.keywords.earnedScore,   analysis.keywords.maxScore,   SCORING_CONFIG.keywords.weight))),
  }

  const overall = clamp(round(Object.values(breakdown).reduce((s, v) => s + v, 0)))

  // ── Revised ATS score — actually measures ATS parse-ability ──
  //
  //  35% keyword match  (does the resume have the right domain keywords?)
  //  20% contact        (can ATS extract contact info?)
  //  15% skills         (are skills listed cleanly?)
  //  15% format signals (section headings, date formats, no columns)
  //  15% section detect (standard sections present + parseable structure)
  //
  const keywordsPct = analysis.keywords.earnedScore  / analysis.keywords.maxScore
  const contactPct  = analysis.contact.earnedScore   / analysis.contact.maxScore
  const skillsPct   = analysis.skills.earnedScore    / analysis.skills.maxScore

  // Format analysis (new)
  const atsFormat    = analysis.atsFormat || { earnedScore: 6, maxScore: 12 }
  const formatPct    = atsFormat.earnedScore / atsFormat.maxScore

  // Section structure — derived from how many main sections were found
  const sectionsFound = atsFormat.sectionsFound?.length ?? 0
  const sectionPct    = Math.min(sectionsFound / 4, 1)  // 4 standard sections = 100%

  const atsScore = clamp(round(
    keywordsPct * 35 +
    contactPct  * 20 +
    skillsPct   * 15 +
    formatPct   * 15 +
    sectionPct  * 15
  ))

  // ── Collect all deductions ──
  const allDeductions = [
    ...(analysis.contact.deductions    || []),
    ...(analysis.education.deductions  || []),
    ...(analysis.skills.deductions     || []),
    ...(analysis.projects.deductions   || []),
    ...(analysis.experience.deductions || []),
    ...(analysis.keywords.deductions   || []),
    ...(analysis.atsFormat?.deductions || []),
  ]

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
  }
}
