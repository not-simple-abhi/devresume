export interface Candidate {
  name: string
  email: string
  phone: string
}

export interface ProjectScore {
  title: string
  score: number
  maxScore: number
  issues: string[]
}

export interface Intelligence {
  domain: string
  keywordCoverage: number
  coverageByDomain: Record<string, number>
  matchedKeywords: string[]
  missingKeywords: string[]
  skillCategories: Record<string, string[]>
  totalSkills: number
  totalProjects: number
  totalExperience: number
  projectScores: ProjectScore[]
}

export interface DeterministicAnalysis {
  overall: number
  atsScore: number
  label: string
  breakdown: Record<string, number>
  maxBreakdown: Record<string, number>
  candidate: Candidate
  deductions: string[]
  intelligence: Intelligence
  actionableSteps: string[]
}

export interface ATSAnalysis {
  scoreExplanation: string
  issues: string[]
  keywordRecommendations: string[]
  formattingRecommendations: string[]
  quickWins: string[]
}

export interface RecruiterAnalysis {
  summary: string
  strengths: string[]
  weaknesses: string[]
  standoutPoints: string[]
  redFlags: string[]
  interviewReadiness: 'ready' | 'needs_work' | 'not_ready'
}

export interface GrammarError {
  original?: string
  suggestion?: string
  text?: string
  message?: string
}

export interface GrammarAnalysis {
  errors: GrammarError[]
  suggestions: string[]
  tone: string
  tenseConsistent: boolean
  writingQuality: 'excellent' | 'good' | 'average' | 'poor'
}

export interface SkillsAnalysis {
  missingSkills: string[]
  learningRoadmap: string[]
  quickWins: string[]
  longTermGoals: string[]
}

export interface ProjectsAnalysis {
  suggestions: string[]
  recommendedProjects: string[]
  quickWins: string[]
}

export interface AIAnalysis {
  ats: ATSAnalysis
  recruiter: RecruiterAnalysis
  grammar: GrammarAnalysis
  skills: SkillsAnalysis
  projects: ProjectsAnalysis
}

export interface ParsedInfo {
  name: string
  email: string
  phone: string
  skillsFound: number
  projectsFound: number
  experienceFound: number
}

export interface ReviewReport {
  deterministicAnalysis: DeterministicAnalysis
  aiAnalysis: AIAnalysis
  parsedInfo: ParsedInfo
  reviewId?: string
}

export interface SavedReview {
  id: string
  resumeName: string
  atsScore: number
  overallScore: number
  reportJson: ReviewReport
  createdAt: string
}

export interface CompareResult {
  review1: {
    id: string
    resumeName: string
    atsScore: number
    overallScore: number
    detailedScores: Record<string, number>
    date: string
  }
  review2: {
    id: string
    resumeName: string
    atsScore: number
    overallScore: number
    detailedScores: Record<string, number>
    date: string
  }
  differences: {
    atsScore: number
    overallScore: number
  }
  recommendation: string
}
