/**
 * resume.routes.js
 *
 * POST /api/resume/parse  → parse resume file, return structured JSON
 *                           (no AI, no DB — just extraction + parsing)
 */

import express from 'express';
import { uploadMiddleware } from '../middleware/upload.middleware.js';
import { parseResume } from '../controllers/resume.controller.js';

const router = express.Router();

// Public — no login needed to parse a resume
router.post('/parse', uploadMiddleware.single('resume'), parseResume);

export default router;
