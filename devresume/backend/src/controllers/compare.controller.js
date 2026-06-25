import { compareReviews } from '../services/compare.service.js';
import { formatSuccessResponse } from '../utils/responseFormatter.js';

export const compare = async (req, res, next) => {
  try {
    const { reviewId1, reviewId2 } = req.body;

    if (!reviewId1 || !reviewId2) {
      return res.status(400).json({ success: false, message: 'Both review IDs are required' });
    }

    const comparison = await compareReviews(reviewId1, reviewId2, req.userId);
    res.status(200).json(formatSuccessResponse(comparison, 'Reviews compared successfully'));
  } catch (error) {
    next(error);
  }
};
