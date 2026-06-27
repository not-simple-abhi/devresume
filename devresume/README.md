# devresume

AI-powered resume reviewer — upload your resume and get instant feedback.

## Project Structure

```
devresume/
├── backend/          ← Express API + Multi-Agent AI
├── frontend/         ← React UI (coming soon)
└── docs/             ← Documentation
```

## Features

- Resume upload (PDF & DOCX)
- AI multi-agent analysis (ATS, Recruiter, Grammar, Skills, Projects)
- JWT authentication
- Save & compare resume reports
- PostgreSQL database via Prisma

## Quick Start

```bash
# Backend
cd backend
npm install
cp .env.example .env   # fill in your values
npm run prisma:migrate
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/resume/upload` | Upload resume |
| GET | `/api/resume` | Get all resumes |
| GET | `/api/resume/:id` | Get resume by ID |
| DELETE | `/api/resume/:id` | Delete resume |
| POST | `/api/review/:resumeId` | Analyze resume |
| GET | `/api/review/:resumeId` | Get all reviews |
| GET | `/api/review/latest/:resumeId` | Get latest review |
| POST | `/api/compare` | Compare two resumes |
