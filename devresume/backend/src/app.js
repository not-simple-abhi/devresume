import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import fs from 'fs';
import { config } from './config/env.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import {
  globalLimiter,
  authLimiter,
  analyzeLimiter,
  companyLimiter,
  parseLimiter,
} from './middleware/rateLimit.middleware.js';

import authRoutes    from './routes/auth.routes.js';
import reviewRoutes  from './routes/review.routes.js';
import compareRoutes from './routes/compare.routes.js';
import companyRoutes from './routes/company.routes.js';
import resumeRoutes  from './routes/resume.routes.js';

const app = express();

// ─── Security headers (helmet) ────────────────────────────────────────────────
// Sets X-Content-Type-Options, X-Frame-Options, HSTS, CSP, etc.
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));        // cap JSON body size
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── Global rate limiter — applied to ALL routes ──────────────────────────────
app.use(globalLimiter);

// ─── Trust proxy (needed if behind nginx/Cloudflare for real IP) ──────────────
app.set('trust proxy', 1);

// ─── Upload dir ───────────────────────────────────────────────────────────────
if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'devresume API',
    version: '1.0.0',
    endpoints: {
      auth:    '/api/auth',
      resume:  '/api/resume',
      review:  '/api/review',
      compare: '/api/compare',
      company: '/api/company',
    },
  });
});

// ─── Routes with per-route limiters ───────────────────────────────────────────
app.use('/api/auth',    authLimiter,    authRoutes);
app.use('/api/resume',  parseLimiter,   resumeRoutes);
app.use('/api/review',                  reviewRoutes);   // analyzeLimiter applied per-route inside
app.use('/api/compare',                 compareRoutes);  // protected by auth + global
app.use('/api/company', companyLimiter, companyRoutes);

// ─── Error handler ────────────────────────────────────────────────────────────
app.use(errorMiddleware);

export default app;
