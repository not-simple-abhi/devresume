const DEGREE_KEYWORDS = [
  // Indian formats
  'b.tech','btech','b.e','be ','bachelor','b.sc','bsc',
  'm.tech','mtech','m.e','master','m.sc','msc','mba','mca',
  'phd','ph.d','diploma','class xii','class x','12th','10th',
  'board','secondary','higher secondary',
  // International formats
  'bs ','b.s','b.s.','ba ','b.a','b.a.','beng','b.eng',
  'ms ','m.s','m.s.','ma ','m.a','m.a.','meng','m.eng',
  'bsc','bachelor of science','bachelor of arts','bachelor of engineering',
  'master of science','master of arts','master of engineering',
  'bachelor of computer','bachelor of technology','bachelor of information',
  'associate','associate degree','honours','honors','hons',
  'bca','b.ca','b.com','bcom',
  'undergraduate','graduate','postgraduate',
]

const INSTITUTION_KEYWORDS = [
  // Indian
  'university','college','institute','iit','nit','bits','nsut',
  'school','academy','vidyalaya','kendriya','tech','engineering',
  // International
  'mit','stanford','harvard','oxford','cambridge','caltech',
  'carnegie','mellon','toronto','waterloo','melbourne','sydney',
  'polytechnic','community college','state university',
  'technical university','of technology','of science',
  'of engineering','of computer',
]

const hasDegree      = (text) => DEGREE_KEYWORDS.some(k => text.toLowerCase().includes(k))
const hasInstitution = (text) => INSTITUTION_KEYWORDS.some(k => text.toLowerCase().includes(k))
const hasYear        = (text) => /\b(19|20)\d{2}\b/.test(text)
const hasGrade       = (text) => /(\d+\.?\d*\s*%|cgpa|gpa|\d\.\d{1,2}\/10|\d{2,3}%|\d\.\d{1,2}\/4)/i.test(text)

export const analyzeEducation = (resume) => {
  const entries    = resume.education || []
  const deductions = []
  let earnedScore  = 0

  const checks = {
    hasEntries:     entries.length > 0,
    hasDegree:      false,
    hasInstitution: false,
    hasYear:        false,
    hasGrade:       false,
  }

  if (!checks.hasEntries) {
    deductions.push({ reason: 'Education section is empty', points: -10 })
    return { maxScore: 10, earnedScore: 0, checks, entries, deductions }
  }

  earnedScore += 3
  const allText = entries.join(' ')

  checks.hasDegree      = hasDegree(allText)
  checks.hasInstitution = hasInstitution(allText)
  checks.hasYear        = hasYear(allText)
  checks.hasGrade       = hasGrade(allText)

  if (checks.hasDegree)      earnedScore += 2
  else deductions.push({ reason: 'Degree type not clearly mentioned', points: -2 })

  if (checks.hasInstitution) earnedScore += 2
  else deductions.push({ reason: 'Institution name missing or unclear', points: -2 })

  if (checks.hasYear)        earnedScore += 2
  else deductions.push({ reason: 'Graduation year not mentioned', points: -2 })

  if (checks.hasGrade)       earnedScore += 1
  else deductions.push({ reason: 'CGPA/GPA or percentage not mentioned', points: -1 })

  return {
    maxScore:    10,
    earnedScore: Math.min(earnedScore, 10),
    checks,
    entries,
    deductions,
  }
}
