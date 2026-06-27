/**
 * resume.controller.js
 *
 * Handles resume upload and parsing only (no AI analysis).
 * Use /api/review/analyze for full AI analysis.
 *
 * POST /api/resume/parse → upload file, get structured JSON back
 */

import { processUploadedResume } from '../services/resume.service.js';
import { formatSuccessResponse } from '../utils/responseFormatter.js';

/**
 * POST /api/resume/parse
 * Uploads a resume and returns the structured parsed data.
 * Useful for previewing what was extracted before running AI.
 */
export const parseResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const structured = await processUploadedResume(req.file);

    // Don't send rawText to the client — it's large and not needed
    const { rawText, ...clientData } = structured;

    res.status(200).json(
      formatSuccessResponse(clientData, 'Resume parsed successfully')
    );
  } catch (error) {
    next(error);
  }
};
