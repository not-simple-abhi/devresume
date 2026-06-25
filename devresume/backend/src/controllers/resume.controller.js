import { createResume, getUserResumes, getResumeById, deleteResume } from '../services/resume.service.js';
import { formatSuccessResponse } from '../utils/responseFormatter.js';

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const resume = await createResume(req.userId, req.file);
    res.status(201).json(formatSuccessResponse(resume, 'Resume uploaded successfully'));
  } catch (error) {
    next(error);
  }
};

export const getResumes = async (req, res, next) => {
  try {
    const resumes = await getUserResumes(req.userId);
    res.status(200).json(formatSuccessResponse(resumes, 'Resumes retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getResume = async (req, res, next) => {
  try {
    const resume = await getResumeById(req.params.id, req.userId);
    res.status(200).json(formatSuccessResponse(resume, 'Resume retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const removeResume = async (req, res, next) => {
  try {
    const result = await deleteResume(req.params.id, req.userId);
    res.status(200).json(formatSuccessResponse(result, 'Resume deleted successfully'));
  } catch (error) {
    next(error);
  }
};
