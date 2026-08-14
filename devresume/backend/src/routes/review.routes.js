import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';
import {
  analyzeResume,
  analyzeAndSaveResume,
  getHistory,
  getReview,
  removeReview,
} from '../controllers/review.controller.js';

const router = express.Router();


router.post('/analyze', uploadMiddleware.single('resume'), analyzeResume);


router.post('/analyze/save', authMiddleware, uploadMiddleware.single('resume'), analyzeAndSaveResume);
router.get('/history', authMiddleware, getHistory);
router.get('/:id', authMiddleware, getReview);
router.delete('/:id', authMiddleware, removeReview);

export default router;
