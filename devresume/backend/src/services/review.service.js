import fs from 'fs/promises';
import prisma from '../database/client.js';
import { parsePDF } from '../utils/pdfParser.js';
import { parseDOCX } from '../utils/docxParser.js';
import { analyzeATS } from '../ai/agents/atsAgent.js';
import { analyzeRecruiter } from '../ai/agents/recruiterAgent.js';
import { analyzeGrammar } from '../ai/agents/grammarAgent.js';
import { analyzeSkills } from '../ai/agents/skillsAgent.js';
import { analyzeProjects } from '../ai/agents/projectAgent.js';
import { aggregateReports } from '../ai/aggregator/aggregatorAgent.js';
import path from 'path';

// Parse the uploaded file and delete it after — resume text never stored
const parseAndCleanup = async (file) => {
  const ext = path.extname(file.originalname).toLowerCase();
  let result;

  try {
    if (ext === '.pdf') {
      result = await parsePDF(file.path);
    } else if (ext === '.docx' || ext === '.doc') {
      result = await parseDOCX(file.path);
    } else {
      throw new Error('Unsupported file format. Use PDF or DOCX.');
    }
  } finally {
    // Always delete the temp file regardless of success/failure
    await fs.unlink(file.path).catch(() => {});
  }

  return result.text;
};

// Run all agents in parallel
const runAgents = async (resumeText) => {
  console.log('Running multi-agent analysis...');

  const [ats, recruiter, grammar, skills, projects] = await Promise.all([
    analyzeATS(resumeText),
    analyzeRecruiter(resumeText),
    analyzeGrammar(resumeText),
    analyzeSkills(resumeText),
    analyzeProjects(resumeText),
  ]);

  return aggregateReports({ ats, recruiter, grammar, skills, projects });
};

// Guest analysis — no login required, nothing saved
export const analyzeGuest = async (file) => {
  const resumeText = await parseAndCleanup(file);
  const report = await runAgents(resumeText);
  return report;
};

// Logged-in analysis — saves only scores + report, not resume text
export const analyzeAndSave = async (file, userId) => {
  const resumeText = await parseAndCleanup(file);
  const report = await runAgents(resumeText);

  // Save only the result, not the resume
  const saved = await prisma.review.create({
    data: {
      userId,
      resumeName: file.originalname,
      atsScore: report.atsScore,
      overallScore: report.summary.overallScore,
      reportJson: report,
    },
  });

  return { ...report, reviewId: saved.id };
};

// Get user's review history (for graphs/dashboard)
export const getUserHistory = async (userId) => {
  return await prisma.review.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      resumeName: true,
      atsScore: true,
      overallScore: true,
      reportJson: true,
      createdAt: true,
    },
  });
};

// Get a single review by ID
export const getReviewById = async (reviewId, userId) => {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, userId },
  });

  if (!review) {
    const error = new Error('Review not found');
    error.statusCode = 404;
    throw error;
  }

  return review;
};

// Delete a review
export const deleteReview = async (reviewId, userId) => {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, userId },
  });

  if (!review) {
    const error = new Error('Review not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.review.delete({ where: { id: reviewId } });
  return { message: 'Review deleted' };
};
