import { PrismaClient } from '@prisma/client'

const prisma  = new PrismaClient()
const API_KEY = process.env.COHERE_API_KEY
const MODEL   = 'embed-english-v3.0'
const BATCH   = 96

if (!API_KEY) { console.error('COHERE_API_KEY not set'); process.exit(1) }

// Richer descriptions per category for better embedding quality
const describe = (keyword, category) => {
  const templates = {
    language:  `${keyword} programming language`,
    framework: `${keyword} software framework library`,
    database:  `${keyword} database data storage`,
    cloud:     `${keyword} cloud infrastructure devops`,
    tool:      `${keyword} developer tool software`,
    concept:   `${keyword} software engineering concept`,
  }
  return templates[category] || `${keyword} software technology`
}

async function embedBatch(texts) {
  const res = await fetch('https://api.cohere.com/v1/embed', {
    method:  'POST',
    headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts, model: MODEL, input_type: 'search_document' }),
  })
  if (!res.ok) throw new Error(`Cohere ${res.status}: ${await res.text()}`)
  return (await res.json()).embeddings
}

async function run() {
  // Re-embed ALL keywords with richer descriptions
  const keywords = await prisma.$queryRawUnsafe(
    `SELECT id, keyword, category FROM keywords ORDER BY id`
  )

  console.log(`🔢 Re-embedding ${keywords.length} keywords with richer descriptions...`)
  let done = 0

  for (let i = 0; i < keywords.length; i += BATCH) {
    const batch = keywords.slice(i, i + BATCH)
    const texts = batch.map(k => describe(k.keyword, k.category))

    const embeddings = await embedBatch(texts)

    for (let j = 0; j < batch.length; j++) {
      const vec = `[${embeddings[j].join(',')}]`
      await prisma.$executeRawUnsafe(
        `UPDATE keywords SET embedding = $1::vector WHERE id = $2`,
        vec, batch[j].id
      )
    }

    done += batch.length
    console.log(`  ✓ ${done}/${keywords.length}`)
    if (i + BATCH < keywords.length) await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\n✅ Done — ${done} keywords re-embedded`)
}

run()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
