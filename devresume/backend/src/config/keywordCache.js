import prisma from '../database/client.js'

// ─── In-memory cache ──────────────────────────────────────────────────────────
let aliasMap  = new Map()   // alias (lowercase) → keyword obj
let domainMap = new Map()   // domain → [ keyword objs ]
let loaded    = false

// ─── Load from DB ─────────────────────────────────────────────────────────────
export const loadKeywordCache = async () => {
  console.log('[KeywordCache] Loading keywords from database...')

  const keywords = await prisma.keyword.findMany({
    include: { domains: true, aliases: true },
  })

  aliasMap.clear()
  domainMap.clear()

  for (const kw of keywords) {
    const obj = {
      id:       kw.id,
      keyword:  kw.keyword,
      category: kw.category,
      weight:   kw.weight,
      domains:  kw.domains.map(d => d.domain),
    }

    aliasMap.set(kw.keyword.toLowerCase(), obj)
    for (const a of kw.aliases) aliasMap.set(a.alias.toLowerCase(), obj)

    for (const d of kw.domains) {
      if (!domainMap.has(d.domain)) domainMap.set(d.domain, [])
      domainMap.get(d.domain).push(obj)
    }
  }

  loaded = true
  console.log(`[KeywordCache] Loaded ${keywords.length} keywords, ${aliasMap.size} alias entries, ${domainMap.size} domains`)
}

// ─── Tokenizer ────────────────────────────────────────────────────────────────
const tokenize = (text) => {
  const lower = text.toLowerCase()
  const words = lower.split(/[\s,|\/\(\)\[\]\.]+/).filter(w => w.length > 1)
  const tokens = new Set(words)
  for (let i = 0; i < words.length - 1; i++) tokens.add(`${words[i]} ${words[i+1]}`)
  for (let i = 0; i < words.length - 2; i++) tokens.add(`${words[i]} ${words[i+1]} ${words[i+2]}`)
  return tokens
}

// ─── Cohere embedding for a single short text ─────────────────────────────────
const embedText = async (text) => {
  const key = process.env.COHERE_API_KEY
  if (!key) return null

  try {
    const res = await fetch('https://api.cohere.com/v1/embed', {
      method:  'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        texts:      [`${text} is a technology used in software development`],
        model:      'embed-english-v3.0',
        input_type: 'search_query',   // query mode for runtime lookups
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.embeddings?.[0] ?? null
  } catch {
    return null
  }
}

// ─── Vector similarity search ─────────────────────────────────────────────────
const vectorSearch = async (text, threshold = 0.40, limit = 3) => {
  const embedding = await embedText(text)
  if (!embedding) return []

  const vec = `[${embedding.join(',')}]`

  try {
    const results = await prisma.$queryRawUnsafe(`
      SELECT id, keyword, category, weight,
             1 - (embedding <=> $1::vector) AS similarity
      FROM   keywords
      WHERE  embedding IS NOT NULL
        AND  1 - (embedding <=> $1::vector) >= $2
      ORDER  BY embedding <=> $1::vector
      LIMIT  $3
    `, vec, threshold, limit)

    return results.map(r => ({
      id:         r.id,
      keyword:    r.keyword,
      category:   r.category,
      weight:     r.weight,
      similarity: parseFloat(r.similarity),
      domains:    domainMap.get(r.keyword.toLowerCase())
                    ? [...new Set(domainMap.get(r.keyword.toLowerCase())?.map(x => x) ?? [])]
                    : [],
    }))
  } catch {
    return []
  }
}

// ─── Fix domainMap lookup for vector results ──────────────────────────────────
const getDomainsForId = (id) => {
  for (const [, obj] of aliasMap) {
    if (obj.id === id) return obj.domains
  }
  return []
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Match all keywords in a text.
 * Strategy: alias map first (fast, zero API calls) → vector fallback for unknowns.
 * useVector=false skips vector search (for hot-path resume analysis to keep it fast).
 */
export const matchKeywordsInText = async (text, useVector = false) => {
  if (!loaded) return []

  const tokens  = tokenize(text)
  const matched = new Map()  // id → obj

  // ── Pass 1: alias map (instant) ──
  for (const token of tokens) {
    const obj = aliasMap.get(token)
    if (obj && !matched.has(obj.id)) matched.set(obj.id, obj)
  }

  // ── Pass 2: vector search for unrecognised tokens (optional) ──
  if (useVector) {
    const words = [...tokens].filter(t =>
      t.length > 2 &&
      !t.match(/^(the|and|for|with|using|built|created|led|managed|developed|implemented|a|an|in|on|at|to|of|is|was|are|were|have|has|been|be)$/)
    )

    // Only vector-search tokens that didn't already hit the alias map
    const unknowns = words.filter(w => !aliasMap.has(w))

    // Deduplicate by taking unique 1-2 word tokens
    const candidates = [...new Set(unknowns)].slice(0, 20)

    for (const candidate of candidates) {
      const results = await vectorSearch(candidate, 0.82)
      for (const r of results) {
        if (!matched.has(r.id)) {
          matched.set(r.id, {
            id:       r.id,
            keyword:  r.keyword,
            category: r.category,
            weight:   r.weight,
            domains:  getDomainsForId(r.id),
            viaVector: true,
            similarity: r.similarity,
          })
        }
      }
    }
  }

  return [...matched.values()]
}

// ─── Sync version (alias-only, for hot path) ──────────────────────────────────
export const matchKeywordsInTextSync = (text) => {
  if (!loaded) return []
  const tokens  = tokenize(text)
  const matched = new Map()
  for (const token of tokens) {
    const obj = aliasMap.get(token)
    if (obj && !matched.has(obj.id)) matched.set(obj.id, obj)
  }
  return [...matched.values()]
}

export const getKeywordsForDomain = (domain) => {
  if (!loaded) return []
  return domainMap.get(domain) || []
}

export const hasAnyKeyword = (text) => {
  if (!loaded) return false
  const tokens = tokenize(text)
  for (const token of tokens) { if (aliasMap.has(token)) return true }
  return false
}

export const categorizeSkill = (skill) => {
  if (!loaded) return 'other'
  const tokens = tokenize(skill)
  for (const token of tokens) {
    const obj = aliasMap.get(token)
    if (obj) return obj.category
  }
  return 'other'
}

export const getAllDomains  = () => [...domainMap.keys()]
export const isCacheLoaded = () => loaded

/**
 * Vector-only search — for external use (e.g. RAG retrieval).
 * Returns top-N semantically similar keywords for a query.
 */
export const semanticKeywordSearch = async (query, threshold = 0.40, limit = 5) => {
  const results = await vectorSearch(query, threshold, limit)
  return results.map(r => ({
    ...r,
    domains: getDomainsForId(r.id),
  }))
}
