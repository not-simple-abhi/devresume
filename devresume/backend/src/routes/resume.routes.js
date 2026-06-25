import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';
import { uploadResume, getResumes, getResume, removeResume } from '../controllers/resume.controller.js';

const router = express.Router();

router.post('/upload', authMiddleware, uploadMiddleware.single('resume'), uploadResume);
router.get('/', authMiddleware, getResumes);
router.get('/:id', authMiddleware, getResume);
router.delete('/:id', authMiddleware, removeResume);

export default router;
