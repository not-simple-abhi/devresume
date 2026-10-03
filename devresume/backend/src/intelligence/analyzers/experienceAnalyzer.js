import { hasAnyKeyword, isCacheLoaded } from '../../config/keywordCache.js'

const ACTION_VERBS = [
  'built','developed','created','designed','implemented','engineered',
  'led','managed','collaborated','delivered','optimized','improved',
  'reduced','increased','automated','integrated','contributed','shipped',
  'maintained','supported','resolved','handled','analyzed','researched',
  'coordinated','organized','presented','helped','architected','deployed',
  'launched','migrated','refactored','scaled','modernized','owned',
  'established','streamlined','accelerated','enabled','drove','spearheaded',
]

// Fallback tech words (used when cache not loaded)
const FALLBACK_TECH = [
  'react','node','python','java','sql','api','aws','docker','javascript',
  'typescript','flask','django','express','mongodb','redis','postgresql',
  'mysql','git','linux','cloud','kubernetes','terraform','go','rust',
  'kafka','graphql','microservice','ci/cd','devops','azure','gcp',
]

const DATE_PATTERNS = [
  /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{4}/i,
  /\d{4}\s*[-–]\s*(present|\d{4})/i,
  /\b(present|current|ongoing)\b/i,
]

const METRIC_PATTERNS = [
  /\d+\s*%/,
  /\d+\+?\s*users?/i,
  /\d+x\s/,
  /\$\d+/,
  /\d+\s*(k|m)\b/i,
  /\d+\s*ms\b/i,
  /\d+\s*requests?/i,
  /\d+\s*stars?/i,
  /\d+\s*(million|billion|thousand)/i,
]

const hasActionVerb = (text) => {
  const lower = text.toLowerCase()
  return ACTION_VERBS.some(v => lower.includes(v))
}

const hasTech = (text) => {
  // Use DB cache when loaded, otherwise fallback list
  if (isCacheLoaded()) return hasAnyKeyword(text)
  const lower = text.toLowerCase()
  return FALLBACK_TECH.filter(t => lower.includes(t)).length >= 1
}

const hasDates   = (text) => DATE_PATTERNS.some(p => p.test(text))
const hasMetrics = (text) => METRIC_PATTERNS.some(p => p.test(text))

export const analyzeExperience = (resume) => {
  const entries    = resume.experience || []
  const deductions = []
  let earnedScore  = 0

  const checks = {
    hasEntries:     entries.length > 0,
    hasMultiple:    entries.length >= 2,
    hasDates:       false,
    hasActionVerbs: false,
    hasTech:        false,
    hasMetrics:     false,
  }

  if (!checks.hasEntries) {
    deductions.push({ reason: 'No work experience or internships listed', points: -4 })
    return { maxScore: 20, earnedScore: 0, checks, entries: [], deductions }
  }

  earnedScore += 4

  if (checks.hasMultiple) earnedScore += 3
  else deductions.push({ reason: 'Only 1 experience entry — add more or expand it', points: -3 })

  const allText = entries.join(' ')

  checks.hasDates = hasDates(allText)
  if (checks.hasDates) earnedScore += 3
  else deductions.push({ reason: 'No dates in experience — always add start/end dates', points: -3 })

  checks.hasActionVerbs = hasActionVerb(allText)
  if (checks.hasActionVerbs) earnedScore += 4
  else deductions.push({ reason: 'No action verbs — use "Led", "Built", "Developed"', points: -4 })

  checks.hasTech = hasTech(allText)
  if (checks.hasTech) earnedScore += 3
  else deductions.push({ reason: 'Technologies not mentioned in experience section', points: -3 })

  checks.hasMetrics = hasMetrics(allText)
  if (checks.hasMetrics) earnedScore += 3
  else deductions.push({ reason: 'No metrics — add numbers like "reduced load by 30%"', points: -3 })

  return {
    maxScore:    20,
    earnedScore: Math.min(earnedScore, 20),
    checks,
    entries,
    deductions,
  }
}
