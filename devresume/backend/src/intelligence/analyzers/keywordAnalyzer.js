import {
  matchKeywordsInTextSync,
  matchKeywordsInText,
  getKeywordsForDomain,
  isCacheLoaded,
} from '../../config/keywordCache.js'

// ─── Fallback domain keywords (used only if cache not loaded) ─────────────────
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, join }  from 'path'
import fs                 from 'fs'

const __dirname     = dirname(fileURLToPath(import.meta.url))
const loadFallback  = () => {
  const dir = join(__dirname, '../../config/keywords')
  const domains = {}
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
    const data = JSON.parse(fs.readFileSync(join(dir, file), 'utf-8'))
    domains[data.domain] = data.keywords
  }
  return domains
}

// ─── Detect top-2 domains ─────────────────────────────────────────────────────
const detectDomains = (matchedKeywords) => {
  const scores = {}

  for (const kw of matchedKeywords) {
    for (const domain of kw.domains) {
      scores[domain] = (scores[domain] || 0) + kw.weight
    }
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const primary   = sorted[0]?.[0] || 'fullstack'
  const secondary = sorted[1]?.[0] || null

  return { primary, secondary, scores }
}

// ─── Weighted coverage calculation ────────────────────────────────────────────
const calcCoverage = (matchedKeywords, domainKeywords) => {
  if (domainKeywords.length === 0) return 0

  const domainIds   = new Set(domainKeywords.map(k => k.id))
  const matchedInDomain = matchedKeywords.filter(k => domainIds.has(k.id))

  const totalWeight   = domainKeywords.reduce((s, k) => s + k.weight, 0)
  const matchedWeight = matchedInDomain.reduce((s, k) => s + k.weight, 0)

  return totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0
}

// ─── Main export ──────────────────────────────────────────────────────────────
export const analyzeKeywords = (resume) => {

  // ── Build resume text corpus ──
  const resumeText = [
    resume.rawText || '',
    ...(resume.skills       || []),
    ...(resume.projects     || []),
    ...(resume.experience   || []),
  ].join(' ')

  // ── Use DB cache if available, fall back to JSON files ──
  if (!isCacheLoaded()) {
    console.warn('[KeywordAnalyzer] Cache not loaded — using fallback JSON files')
    return legacyAnalyze(resumeText)
  }

  // ── Match all keywords in the text ──
  const matchedKeywords = matchKeywordsInTextSync(resumeText)

  // ── Detect primary (and secondary) domain ──
  const { primary, secondary, scores: domainScores } = detectDomains(matchedKeywords)

  // ── Get domain keyword pools ──
  const primaryKeywords   = getKeywordsForDomain(primary)
  const secondaryKeywords = secondary ? getKeywordsForDomain(secondary) : []

  // ── Weighted coverage for primary domain ──
  const coveragePercent = calcCoverage(matchedKeywords, primaryKeywords)

  // ── Per-domain coverage map ──
  const coverage = {}
  for (const [domain, score] of Object.entries(domainScores)) {
    const domKws = getKeywordsForDomain(domain)
    coverage[domain] = calcCoverage(matchedKeywords, domKws)
  }

  // ── Missing keywords (top-weighted unmatched from primary domain) ──
  const matchedIds    = new Set(matchedKeywords.map(k => k.id))
  const missingKeywords = primaryKeywords
    .filter(k => !matchedIds.has(k.id))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 15)
    .map(k => k.keyword)

  // ── Score: weighted tiers ──
  let earnedScore = 0
  const deductions = []

  if (coveragePercent >= 65) {
    earnedScore = 20
  } else if (coveragePercent >= 50) {
    earnedScore = 16
    deductions.push({ reason: `Keyword coverage ${coveragePercent}% — aim for 65%+`, points: -4 })
  } else if (coveragePercent >= 35) {
    earnedScore = 12
    deductions.push({ reason: `Keyword coverage ${coveragePercent}% — add more ${primary} skills`, points: -8 })
  } else if (coveragePercent >= 20) {
    earnedScore = 7
    deductions.push({ reason: `Low keyword coverage (${coveragePercent}%) — major skill gaps in ${primary}`, points: -13 })
  } else {
    earnedScore = 3
    deductions.push({ reason: `Very low keyword coverage (${coveragePercent}%) — critical skill gaps`, points: -17 })
  }

  return {
    maxScore:         20,
    earnedScore:      Math.min(earnedScore, 20),
    detectedDomain:   primary,
    secondaryDomain:  secondary,
    coveragePercent,
    coverage,
    matchedKeywords:  matchedKeywords.map(k => k.keyword),
    missingKeywords,
    deductions,
  }
}

// ─── Legacy fallback (JSON files) ────────────────────────────────────────────
const legacyAnalyze = (resumeText) => {
  const allKeywords  = loadFallback()
  const lower        = resumeText.toLowerCase()
  const scores       = {}

  for (const [domain, keywords] of Object.entries(allKeywords)) {
    scores[domain] = keywords.filter(k => lower.includes(k.toLowerCase())).length
  }

  const detectedDomain  = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || 'fullstack'
  const domainKeywords  = allKeywords[detectedDomain] || []
  const matched         = domainKeywords.filter(k => lower.includes(k.toLowerCase()))
  const missing         = domainKeywords.filter(k => !lower.includes(k.toLowerCase()))
  const coveragePercent = Math.round((matched.length / domainKeywords.length) * 100)

  const coverage = {}
  for (const [domain, keywords] of Object.entries(allKeywords)) {
    const m = keywords.filter(k => lower.includes(k.toLowerCase())).length
    coverage[domain] = Math.round((m / keywords.length) * 100)
  }

  let earnedScore = coveragePercent >= 60 ? 20 : coveragePercent >= 40 ? 15 : coveragePercent >= 20 ? 10 : 5
  const deductions = earnedScore < 20
    ? [{ reason: `Keyword coverage is ${coveragePercent}% (fallback mode)`, points: 20 - earnedScore }]
    : []

  return {
    maxScore: 20, earnedScore,
    detectedDomain, secondaryDomain: null,
    coveragePercent, coverage,
    matchedKeywords: matched,
    missingKeywords: missing.slice(0, 15),
    deductions,
  }
}
