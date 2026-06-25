import {
  analyzeGuest,
  analyzeAndSave,
  getUserHistory,
  getReviewById,
  deleteReview,
} from '../services/review.service.js';
import { formatSuccessResponse } from '../utils/responseFormatter.js';

// POST /api/review/analyze — no login required
export const analyzeResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const report = await analyzeGuest(req.file);
    res.status(200).json(formatSuccessResponse(report, 'Resume analyzed successfully'));
  } catch (error) {
    next(error);
  }
};

// POST /api/review/analyze/save — login required, saves result
export const analyzeAndSaveResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const report = await analyzeAndSave(req.file, req.userId);
    res.status(200).json(formatSuccessResponse(report, 'Resume analyzed and saved'));
  } catch (error) {
    next(error);
  }
};

// GET /api/review/history — login required
export const getHistory = async (req, res, next) => {
  try {
    const history = await getUserHistory(req.userId);
    res.status(200).json(formatSuccessResponse(history, 'History retrieved'));
  } catch (error) {
    next(error);
  }
};

// GET /api/review/:id — login required
export const getReview = async (req, res, next) => {
  try {
    const review = await getReviewById(req.params.id, req.userId);
    res.status(200).json(formatSuccessResponse(review, 'Review retrieved'));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/review/:id — login required
export const removeReview = async (req, res, next) => {
  try {
    const result = await deleteReview(req.params.id, req.userId);
    res.status(200).json(formatSuccessResponse(result, 'Review deleted'));
  } catch (error) {
    next(error);
  }
};
