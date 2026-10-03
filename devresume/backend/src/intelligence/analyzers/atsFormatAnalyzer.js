/**
 * Checks ATS parse-ability signals that no other analyzer covers:
 * - Standard section headings detectable
 * - Dates in parseable format
 * - No column/table layout signals
 * - Contact info in header (not buried)
 */

const STANDARD_SECTIONS = ['education','experience','skills','projects','work','internship','summary','objective']
const DATE_REGEX         = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}\b|\b\d{4}\s*[-–]\s*(\d{4}|present)\b/gi
const COLUMN_SIGNALS     = /(.{5,40})\s{4,}(.{5,40})/g  // two blocks separated by lots of spaces → likely columns

export const analyzeATSFormat = (resume) => {
  const rawText    = resume.rawText || ''
  const lower      = rawText.toLowerCase()
  const deductions = []
  let earnedScore  = 0

  // ── Section heading detection ──
  const sectionsFound = STANDARD_SECTIONS.filter(s => lower.includes(s))
  const sectionScore  = Math.min(sectionsFound.length, 4)  // max 4 points
  earnedScore += sectionScore
  if (sectionScore < 2) {
    deductions.push({ reason: 'Few recognisable section headings — ATS may not parse correctly', points: -4 })
  }

  // ── Parseable dates ──
  const dateMatches = rawText.match(DATE_REGEX) || []
  if (dateMatches.length > 0) {
    earnedScore += 3
  } else {
    deductions.push({ reason: 'No parseable dates found — use "Jan 2022 – Present" format', points: -3 })
  }

  // ── Column/table layout signal ──
  const columnLines = rawText.split('\n').filter(l => COLUMN_SIGNALS.test(l))
  if (columnLines.length > 3) {
    deductions.push({ reason: 'Possible multi-column layout — ATS systems often fail on columns', points: -3 })
  } else {
    earnedScore += 3
  }

  // ── Contact in first 10 lines ──
  const firstBlock = rawText.split('\n').slice(0, 10).join(' ')
  const hasContactInHeader =
    /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/.test(firstBlock) ||
    /(\+?\d[\d\s\-]{8,})/.test(firstBlock)

  if (hasContactInHeader) {
    earnedScore += 2
  } else {
    deductions.push({ reason: 'Contact info not found near top of resume', points: -2 })
  }

  return {
    maxScore:       12,
    earnedScore:    Math.min(earnedScore, 12),
    sectionsFound,
    dateMatches:    dateMatches.length,
    hasColumnLayout: columnLines.length > 3,
    hasContactInHeader,
    deductions,
  }
}
