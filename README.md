# DevResume — Resume Analyzer & AI Review

A privacy-first resume analysis service that extracts structured data from uploaded resumes, scores them deterministically, and augments the results with targeted AI explanations and improvements.

Quick overview
- Upload PDF/DOCX resumes → deterministic analyzers (contact, education, skills, projects, experience, keywords) produce a single analysis object.
- Rule Engine converts analysis into ATS-friendly and overall scores.
- Lightweight AI agents (grammar, recruiter, ATS, skills, projects, company) explain and recommend — they never recalculate scores.
- Resume text is not stored by design.

Getting started
1. Install
   npm install

2. Configure environment (example)
   - DATABASE_URL=postgresql://...
   - JWT_SECRET=your_jwt_secret
   - PORT=3000
   - NODE_ENV=production|development

3. Run (development)
   npm run dev

Entry points
- index.js — starts the server, connects Prisma (Supabase/Postgres), graceful shutdown.
- app.js — Express app: middleware, routes, uploads directory, global error handler.

What’s included (short)
- Parsers: pdfParser, docxParser — extract text safely.
- Resume parser & analyzers: resumeParser.js + analyzers (contact, education, skills, projects, experience, keywords).
- Rule Engine: scoringConfig.js + calculateScore.js — deterministic scoring.
- AI Layer: small, focused agents that explain results (atsAgent, recruiterAgent, grammarAgent, skillsAgent, projectAgent, companyAgent).
- Services: resume.service.js, review.service.js, auth.service.js.
- Middleware: auth (JWT), uploads (Multer), error handler.

Design highlights
- Privacy by default — raw resume text is not persisted.
- Deterministic scoring before AI — prevents hallucinations and ensures consistent results.
- Single source of truth — resumeAnalyzer.js output flows to everything.
- bcrypt → bcryptjs swap to eliminate a supply chain vulnerability
- Sequential small agents — predictable costs and focused outputs.
- Defensive parsing (extractJsonFromText) to reliably parse AI responses.

Security & ops notes
- Require JWT_SECRET in production (do not use development fallback).
- Disable open registration or protect with invite flow for production deployments.
- Add rate limiting and strong input validation for public endpoints.

Want this README committed to the repo?
I can create README.md in the repo for you — tell me the repository (owner/name) and confirm and I’ll create it.
