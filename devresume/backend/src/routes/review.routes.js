import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';
import { analyzeLimiter } from '../middleware/rateLimit.middleware.js';
import {
  analyzeResume,
  analyzeAndSaveResume,
  getHistory,
  getReview,
  removeReview,
  getStats,
} from '../controllers/review.controller.js';

const router = express.Router();

// Public stats — used by landing page
router.get('/stats', getStats);

// Analysis — rate limited (expensive AI + DB operations)
router.post('/analyze',      analyzeLimiter, uploadMiddleware.single('resume'), analyzeResume);
router.post('/analyze/save', analyzeLimiter, authMiddleware, uploadMiddleware.single('resume'), analyzeAndSaveResume);

// Auth-protected reads/deletes — NOT rate limited beyond global limiter
router.get('/history', authMiddleware, getHistory);
router.get('/:id',     authMiddleware, getReview);
router.delete('/:id',  authMiddleware, removeReview);

export default router;
