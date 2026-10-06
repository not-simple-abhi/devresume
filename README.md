<div align="center">

# DevResume

### AI-Powered Resume Intelligence Platform for Developers

**Analyze your resume like an engineer. Get ATS scores, recruiter feedback, skill gap analysis, and company fit scores — all in seconds.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-devresume--three.vercel.app-6d28d9?style=for-the-badge)](https://devresume-three.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend_API-onrender.com-10b981?style=for-the-badge)](https://devresume-backend-ur2q.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## What is DevResume?

DevResume is a full-stack AI resume analysis platform built for software engineers. Unlike generic resume checkers, it understands technical depth — parsing architecture decisions, quantifying project impact, benchmarking against FAANG standards, and telling you exactly what is missing.

---

## Links

| | |
|---|---|
| Live App | [https://devresume-three.vercel.app](https://devresume-three.vercel.app) |
| API | [https://devresume-backend-ur2q.onrender.com](https://devresume-backend-ur2q.onrender.com) |
| GitHub | [https://github.com/not-simple-abhi/devresume](https://github.com/not-simple-abhi/devresume) |

---

## Features

### Deterministic Analysis Engine
- **ATS Score** — section headings, date formats, column layout, contact completeness
- **Overall Score** — weighted across 6 dimensions: contact, education, skills, projects, experience, keywords
- **276-keyword database** with 770 aliases — `nodejs`, `sklearn`, `k8s` all correctly recognized
- **Multi-domain detection** — backend, frontend, AI, DevOps, mobile, data
- **Weighted coverage** — React (weight 10) counts more than "Git Flow" (weight 2)
- **pgvector semantic search** — Cohere 1024-dim embeddings for concept-level matching

### 5 Specialized AI Agents

| Agent | What it does |
|---|---|
| **ATS Agent** | ATS issues, keyword recommendations, formatting fixes, quick wins |
| **Recruiter Agent** | Summary, strengths, weaknesses, red flags, interview readiness |
| **Grammar Agent** | Grammar errors, tone analysis, writing quality |
| **Skills Agent** | Missing skills, learning roadmap, quick wins |
| **Projects Agent** | Project suggestions, recommended side projects |

### Company Fit Analysis

Check readiness for 15 top companies — Google, Amazon, Microsoft, Zomato, D.E. Shaw, JP Morgan, Stripe, Uber and more. Each has a curated profile with required tech stack, focus areas, and hiring bar expectations.

### pgvector Semantic Search

- Cohere `embed-english-v3.0` embeddings (1024 dims) in Supabase pgvector
- HNSW index for millisecond cosine similarity search
- Two-layer matching: alias map (instant, zero API calls) then vector fallback (semantic)

### Dashboard and History

- Save unlimited analyses (authenticated users)
- Score history chart with gradient area fills
- Stats bar: total reviews, best overall, best ATS, average score
- Side-by-side resume comparison

---

## Architecture

```
Frontend (Vercel)  —  React 19 + TypeScript + Tailwind v4 + Vite
         | HTTPS API calls
Backend (Render)   —  Node.js + Express (ESM)
  |-- Resume Parser       (pdfjs-dist / mammoth)
  |-- Intelligence Engine (6 deterministic analyzers)
  |-- AI Orchestrator     (5 LLM agents: Groq -> OpenRouter fallback)
  |-- Keyword Cache       (276 keywords x 770 aliases, in-memory)
         |
Supabase PostgreSQL + pgvector
  |-- keywords table: vector(1024) embeddings + HNSW index
```

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Tailwind CSS v4 | Styling |
| Vite | Build tool |
| Zustand | State management |
| TanStack Query | Server state + caching |
| React Router v7 | Routing |
| Axios | HTTP client |

### Backend
| Technology | Purpose |
|---|---|
| Node.js 20+ (ESM) | Runtime |
| Express.js | HTTP server |
| Prisma ORM | Database client |
| pdfjs-dist | PDF text extraction |
| mammoth | DOCX text extraction |
| bcryptjs + jsonwebtoken | Auth |
| helmet + cors | Security |

### AI and Data
| Technology | Purpose |
|---|---|
| Groq API | Primary LLM (fast inference) |
| OpenRouter / Nemotron Ultra | LLM fallback |
| Cohere embed-english-v3.0 | 1024-dim keyword embeddings |
| Supabase pgvector | Vector similarity search |
| HNSW index | Fast approximate nearest neighbor |

### Infrastructure
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting + CDN |
| Render | Backend hosting |
| Supabase | PostgreSQL + pgvector database |
| GitHub | Source control + auto deploy |

---

## Local Development

### Prerequisites
- Node.js 20+
- Supabase project — [supabase.com](https://supabase.com) (free tier)
- Groq API key — [console.groq.com](https://console.groq.com) (free)
- Cohere API key — [dashboard.cohere.com](https://dashboard.cohere.com) (free)

### 1. Clone
```bash
git clone https://github.com/not-simple-abhi/devresume.git
cd devresume
```

### 2. Backend
```bash
cd devresume/backend && npm install
```

Create `devresume/backend/.env`:
```env
PORT=5001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres
JWT_SECRET=your-64-char-random-secret
JWT_REFRESH_SECRET=another-64-char-random-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
GROQ_API_KEY=gsk_...
OPENROUTER_API_KEY=sk-or-v1-...
COHERE_API_KEY=cohere_...
MAX_FILE_SIZE=5242880
UPLOAD_DIR=uploads
```

```bash
npx prisma migrate dev
node scripts/seedKeywords.js
node scripts/generateEmbeddings.js
npm run dev
```

### 3. Frontend
```bash
cd devresume/frontend && npm install
```

Create `devresume/frontend/.env.local`:
```env
VITE_API_BASE_URL=http://localhost:5001/api
```
```bash
npm run dev
```

---

## API Reference

```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/refresh

POST   /api/review/analyze          Guest analysis (not saved)
POST   /api/review/analyze-save     Analyze + save (auth required)
GET    /api/review/history          Saved reviews (auth required)
GET    /api/review/:id              Single review (auth required)
DELETE /api/review/:id              Delete review (auth required)
GET    /api/review/stats            Public stats

GET    /api/company/list            List 15 supported companies
POST   /api/company/analyze         Single company fit check
POST   /api/company/analyze-batch   Up to 5 companies at once

POST   /api/compare                 Compare two saved reviews (auth required)
```

---

## Analysis Pipeline

```
Upload PDF/DOCX
  1. PARSE    pdfjs/mammoth + regex section extraction
  2. ANALYZE  6 deterministic analyzers (zero AI calls)
              contact(10) + education(10) + skills(15) +
              projects(25) + experience(20) + keywords(20)
  3. SCORE    Overall 0-100
              ATS = keywords(35%) + contact(20%) + skills(15%)
                  + format(15%) + sections(15%)
  4. AI       5 LLM agents on structured input
              Groq primary -> OpenRouter fallback
  5. MERGE    aggregatorAgent -> unified JSON report
```

---

## Environment Variables

### Backend (Render)
| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase pooler URL port 6543 + `?pgbouncer=true` |
| `DIRECT_URL` | Supabase direct URL port 5432 |
| `JWT_SECRET` | 64+ char random string |
| `JWT_REFRESH_SECRET` | Different 64+ char random string |
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) |
| `OPENROUTER_API_KEY` | [openrouter.ai/keys](https://openrouter.ai/keys) |
| `COHERE_API_KEY` | [dashboard.cohere.com](https://dashboard.cohere.com/api-keys) |
| `ALLOWED_ORIGIN` | Your Vercel frontend URL |
| `NODE_ENV` | `production` |

### Frontend (Vercel)
| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Your Render backend URL + `/api` |

---

## Contributing

1. Fork the repo
2. `git checkout -b feat/your-feature`
3. `git commit -m "feat: your change"`
4. `git push origin feat/your-feature`
5. Open a Pull Request

---

## License

MIT — free to use, modify, and distribute.

---

<div align="center">

Built by [Abhinav](https://github.com/not-simple-abhi)

**[Live Demo](https://devresume-three.vercel.app) · [API](https://devresume-backend-ur2q.onrender.com) · [Report Bug](https://github.com/not-simple-abhi/devresume/issues)**

</div>
