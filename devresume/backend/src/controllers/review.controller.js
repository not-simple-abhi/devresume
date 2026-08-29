import {
  analyzeGuest,
  analyzeAndSave,
  getUserHistory,
  getReviewById,
  deleteReview,
  getTotalReviewCount,
} from '../services/review.service.js';
import { formatSuccessResponse } from '../utils/responseFormatter.js';


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


export const getHistory = async (req, res, next) => {
  try {
    const history = await getUserHistory(req.userId);
    res.status(200).json(formatSuccessResponse(history, 'History retrieved'));
  } catch (error) {
    next(error);
  }
};


export const getReview = async (req, res, next) => {
  try {
    const review = await getReviewById(req.params.id, req.userId);
    res.status(200).json(formatSuccessResponse(review, 'Review retrieved'));
  } catch (error) {
    next(error);
  }
};


export const removeReview = async (req, res, next) => {
  try {
    const result = await deleteReview(req.params.id, req.userId);
    res.status(200).json(formatSuccessResponse(result, 'Review deleted'));
  } catch (error) {
    next(error);
  }
};


export const getStats = async (req, res, next) => {
  try {
    const totalReviews = await getTotalReviewCount();
    res.status(200).json(formatSuccessResponse({ totalReviews }, 'Stats retrieved'));
  } catch (error) {
    next(error);
  }
};
