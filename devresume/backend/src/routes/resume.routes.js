

import express from 'express';
import { uploadMiddleware } from '../middleware/upload.middleware.js';
import { parseResume } from '../controllers/resume.controller.js';

const router = express.Router();


router.post('/parse', uploadMiddleware.single('resume'), parseResume);

export default router;
