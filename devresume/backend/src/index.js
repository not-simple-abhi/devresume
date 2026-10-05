import app from './app.js'
import { config } from './config/env.js'
import prisma from './database/client.js'
import { loadKeywordCache } from './config/keywordCache.js'

const PORT = config.port

// ─── DB connect with retry (handles Supabase auto-pause on free tier) ─────────
const connectWithRetry = async (retries = 5, delayMs = 5000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await prisma.$connect()
      console.log('✓ Database connected')
      return
    } catch (err) {
      const isLastAttempt = attempt === retries
      console.error(`✗ DB connection attempt ${attempt}/${retries} failed: ${err.message}`)
      if (isLastAttempt) throw err
      console.log(`  Retrying in ${delayMs / 1000}s...`)
      await new Promise(r => setTimeout(r, delayMs))
      // Increase delay each attempt: 5s, 10s, 20s, 40s
      delayMs = Math.min(delayMs * 2, 40000)
    }
  }
}

const startServer = async () => {
  try {
    await connectWithRetry()

    await loadKeywordCache()

    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`)
      console.log(`✓ Environment: ${config.nodeEnv}`)
      console.log(`✓ API URL: http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server after all retries:', error.message)
    process.exit(1)
  }
}

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

startServer()
