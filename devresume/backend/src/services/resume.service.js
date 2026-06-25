import prisma from '../database/client.js';
import { parsePDF } from '../utils/pdfParser.js';
import { parseDOCX } from '../utils/docxParser.js';
import path from 'path';

export const createResume = async (userId, file) => {
  const ext = path.extname(file.originalname).toLowerCase();

  let resumeText;

  if (ext === '.pdf') {
    const parsed = await parsePDF(file.path);
    resumeText = parsed.text;
  } else if (ext === '.docx' || ext === '.doc') {
    const parsed = await parseDOCX(file.path);
    resumeText = parsed.text;
  } else {
    throw new Error('Unsupported file format');
  }

  return await prisma.resume.create({
    data: { userId, filename: file.originalname, resumeText },
  });
};

export const getUserResumes = async (userId) => {
  return await prisma.resume.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      reviews: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  });
};

export const getResumeById = async (resumeId, userId) => {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
    include: { reviews: { orderBy: { createdAt: 'desc' } } },
  });

  if (!resume) {
    const error = new Error('Resume not found');
    error.statusCode = 404;
    throw error;
  }

  return resume;
};

export const deleteResume = async (resumeId, userId) => {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
  });

  if (!resume) {
    const error = new Error('Resume not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.resume.delete({ where: { id: resumeId } });
  return { message: 'Resume deleted successfully' };
};
