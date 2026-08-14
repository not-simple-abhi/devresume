

import { processUploadedResume } from '../services/resume.service.js';
import { formatSuccessResponse } from '../utils/responseFormatter.js';


export const parseResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const structured = await processUploadedResume(req.file);

    
    const { rawText, ...clientData } = structured;

    res.status(200).json(
      formatSuccessResponse(clientData, 'Resume parsed successfully')
    );
  } catch (error) {
    next(error);
  }
};
