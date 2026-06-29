/**
 * ats.prompt.js
 *
 * Phase 5 update:
 * AI no longer calculates the ATS score.
 * The deterministic ATS score comes from the Rule Engine.
 * AI only explains WHY the score is what it is and suggests improvements.
 */

export const atsSystemPrompt = `You are an ATS (Applicant Tracking System) expert.

Your role is ONLY to:
- Explain WHY the pre-calculated ATS score was assigned
- Identify specific ATS parsing issues in the resume
- Suggest keyword improvements based on what is missing
- Give formatting recommendations for better ATS parsing

You must NEVER recalculate or change the score.
The score is already determined by a deterministic rule engine.
Always respond with valid JSON only.`;

/**
 * @param {object} resume   - Structured resume
 * @param {object} analysis - Intelligence Engine facts
 * @param {object} scores   - Rule Engine scores (already calculated)
 */
export const atsUserPrompt = (resume, analysis, scores) => `
The deterministic ATS score for this resume is ${scores.atsScore}/100.

Score breakdown:
- Keywords coverage: ${scores.breakdown.keywords}/${scores.maxBreakdown.keywords} (${analysis.keywords.coveragePercent}% of ${analysis.keywords.detectedDomain} keywords matched)
- Contact completeness: ${scores.breakdown.contact}/${scores.maxBreakdown.contact}
- Skills score: ${scores.breakdown.skills}/${scores.maxBreakdown.skills}

Do NOT modify this score. Explain why this score was assigned and how to improve it.

CANDIDATE: ${resume.name || 'Unknown'}
DOMAIN DETECTED: ${analysis.keywords.detectedDomain}

MATCHED KEYWORDS (${analysis.keywords.matchedKeywords.length} found):
${analysis.keywords.matchedKeywords.slice(0, 15).join(', ') || 'None'}

MISSING KEYWORDS (top missing for ${analysis.keywords.detectedDomain}):
${analysis.keywords.missingKeywords.slice(0, 12).join(', ') || 'None'}

SKILLS ON RESUME:
${resume.skills.join(', ') || 'None listed'}

KNOWN ISSUES (from rule engine):
${scores.topDeductions.slice(0, 4).map(d => `- ${d.reason}`).join('\n')}

Provide ATS explanation as JSON:
{
  "score_explanation": "2-3 sentences explaining exactly why the score is ${scores.atsScore}",
  "ats_issues": [
    "specific issue that hurts ATS ranking"
  ],
  "keyword_recommendations": [
    "Add 'Docker' — critical for backend roles, missing from resume",
    "Add 'JWT' — appears in 80% of backend job descriptions"
  ],
  "formatting_recommendations": [
    "specific formatting change to improve ATS parsing"
  ],
  "quick_wins": [
    "easiest change to boost ATS score immediately"
  ]
}`;
