import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { compare } from '../controllers/compare.controller.js';

const router = express.Router();

router.post('/', authMiddleware, compare);

export default router;
