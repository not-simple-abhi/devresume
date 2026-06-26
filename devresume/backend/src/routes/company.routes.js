import express from 'express';
import { uploadMiddleware } from '../middleware/upload.middleware.js';
import {
  listCompanies,
  analyzeOneCompany,
  analyzeMultipleCompanies,
} from '../controllers/company.controller.js';

const router = express.Router();

// All company routes are public — no login required
router.get('/list', listCompanies);
router.post('/analyze', uploadMiddleware.single('resume'), analyzeOneCompany);
router.post('/analyze/batch', uploadMiddleware.single('resume'), analyzeMultipleCompanies);

export default router;
