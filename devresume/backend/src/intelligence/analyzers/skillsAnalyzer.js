import { categorizeSkill, isCacheLoaded } from '../../config/keywordCache.js'

// ─── Hardcoded fallback categorizer (used when cache not loaded) ──────────────
const LANGUAGES  = ['javascript','typescript','python','java','c++','c#','c ','go','rust','kotlin','swift','php','ruby','scala','dart','r ','matlab','bash','shell','sql','html','css','html5','css3','elixir','clojure','solidity','groovy','julia','zig']
const FRAMEWORKS = ['react','react.js','next.js','vue','vue.js','angular','nuxt','express','express.js','node.js','fastapi','django','flask','spring','spring boot','.net','rails','laravel','tailwind','bootstrap','redux','graphql','nest.js','svelte','fastify','hono','nestjs','remix','astro','solid.js','sveltekit']
const DATABASES  = ['mysql','postgresql','mongodb','sqlite','redis','cassandra','dynamodb','firebase','oracle','mssql','elasticsearch','supabase','planetscale','cockroachdb','neon','turso','fauna','pocketbase','pinecone','weaviate','chroma','faiss','qdrant','milvus','drizzle','prisma','mongoose','sequelize','typeorm']
const CLOUD      = ['aws','gcp','azure','docker','kubernetes','ci/cd','github actions','jenkins','terraform','ansible','nginx','linux','vercel','netlify','heroku','digitalocean','cloudflare','render','railway','bun','deno']
const TOOLS      = ['git','github','gitlab','jira','figma','postman','vscode','webpack','vite','jest','mocha','cypress','swagger','notion','eslint','prettier','playwright','storybook','bitbucket','turbo','nx','pnpm','yarn']

const fallbackCategorize = (skill) => {
  const s = skill.toLowerCase().trim()
  if (LANGUAGES.some(l  => s === l || s.startsWith(l))) return 'language'
  if (FRAMEWORKS.some(f => s.includes(f)))               return 'framework'
  if (DATABASES.some(d  => s.includes(d)))               return 'database'
  if (CLOUD.some(c      => s.includes(c)))               return 'cloud'
  if (TOOLS.some(t      => s.includes(t)))               return 'tools'
  return 'other'
}

// ─── Category mapping → display keys ─────────────────────────────────────────
const toDisplayKey = (category) => {
  const map = {
    language:  'languages',
    framework: 'frameworks',
    database:  'databases',
    cloud:     'cloud',
    tool:      'tools',
    tools:     'tools',
    concept:   'other',
    other:     'other',
  }
  return map[category] || 'other'
}

export const analyzeSkills = (resume) => {
  const rawSkills  = resume.skills || []
  const deductions = []

  // Deduplicate
  const seen       = new Set()
  const duplicates = []
  const uniqueSkills = []

  for (const skill of rawSkills) {
    const key = skill.toLowerCase().trim()
    if (seen.has(key)) duplicates.push(skill)
    else { seen.add(key); uniqueSkills.push(skill) }
  }

  // Categorize — use DB cache when available, fallback otherwise
  const categorized = { languages: [], frameworks: [], databases: [], cloud: [], tools: [], other: [] }

  for (const skill of uniqueSkills) {
    const raw      = isCacheLoaded() ? categorizeSkill(skill) : fallbackCategorize(skill)
    const dispKey  = toDisplayKey(raw)
    categorized[dispKey].push(skill)
  }

  // Scoring
  const checks = {
    hasSkills:     uniqueSkills.length > 0,
    hasFivePlus:   uniqueSkills.length >= 5,
    hasTenPlus:    uniqueSkills.length >= 10,
    hasLanguages:  categorized.languages.length > 0,
    hasFrameworks: categorized.frameworks.length > 0,
    hasDatabases:  categorized.databases.length > 0,
    hasDuplicates: duplicates.length > 0,
  }

  let earnedScore = 0

  if (checks.hasSkills)     earnedScore += 3
  else deductions.push({ reason: 'No skills listed', points: -3 })

  if (checks.hasFivePlus)   earnedScore += 2
  else deductions.push({ reason: 'Fewer than 5 skills — add more', points: -2 })

  if (checks.hasTenPlus)    earnedScore += 2
  else deductions.push({ reason: 'Fewer than 10 skills — strong resumes have 10-20', points: -2 })

  if (checks.hasLanguages)  earnedScore += 2
  else deductions.push({ reason: 'No programming languages listed', points: -2 })

  if (checks.hasFrameworks) earnedScore += 2
  else deductions.push({ reason: 'No frameworks listed', points: -2 })

  if (checks.hasDatabases)  earnedScore += 2
  else deductions.push({ reason: 'No databases listed', points: -2 })

  if (checks.hasDuplicates)
    deductions.push({ reason: `Duplicate skills: ${duplicates.join(', ')}`, points: -2 })
  else
    earnedScore += 2

  return {
    maxScore:    15,
    earnedScore: Math.min(earnedScore, 15),
    checks,
    categorized,
    totalSkills: uniqueSkills.length,
    duplicates,
    deductions,
  }
}
