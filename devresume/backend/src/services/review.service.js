

import prisma from '../database/client.js';
import { processUploadedResume } from './resume.service.js';
import { orchestrate } from '../ai/orchestrator/agentManager.js';
import { analyzeResume } from '../intelligence/resumeAnalyzer.js';
import { calculateScore } from '../ruleEngine/calculateScore.js';
import { buildFinalReport } from '../ai/aggregator/aggregatorAgent.js';
import { analyzeForCompany, analyzeForMultipleCompanies, SUPPORTED_COMPANIES } from '../ai/agents/companyAgent.js';






const runAgents = async (resume) => {
  
  console.log('[ReviewService] Running Intelligence Engine...');
  const analysis = analyzeResume(resume);

  
  console.log('[ReviewService] Calculating scores...');
  const scores = calculateScore(analysis);

  
  console.log('[ReviewService] Running AI agents...');
  const aiReport = await orchestrate(resume, analysis, scores);

  
  console.log('[ReviewService] Building final report...');
  return buildFinalReport(resume, analysis, scores, aiReport);
};






export const analyzeGuest = async (file) => {
  
  const resume = await processUploadedResume(file);

  
  const report = await runAgents(resume);

  
  return {
    ...report,
    parsedInfo: {
      name: resume.name,
      email: resume.email,
      phone: resume.phone,
      skillsFound: resume.skills.length,
      projectsFound: resume.projects.length,
      experienceFound: resume.experience.length,
    },
  };
};






export const analyzeAndSave = async (file, userId) => {
  
  const resume = await processUploadedResume(file);

  
  const report = await runAgents(resume);

  
  const saved = await prisma.review.create({
    data: {
      userId,
      resumeName: file.originalname,
      atsScore:   report.atsScore,
      overallScore: report.overallScore,
      reportJson: report,
    },
  });

  return {
    ...report,
    reviewId: saved.id,
    parsedInfo: {
      name: resume.name,
      email: resume.email,
      phone: resume.phone,
      skillsFound: resume.skills.length,
      projectsFound: resume.projects.length,
      experienceFound: resume.experience.length,
    },
  };
};






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






export const analyzeForCompanyGuest = async (file, company) => {
  const resume   = await processUploadedResume(file);
  const analysis = analyzeResume(resume);          
  return await analyzeForCompany(analysis, company);
};


export const analyzeForCompaniesGuest = async (file, companies) => {
  const resume   = await processUploadedResume(file);
  const analysis = analyzeResume(resume);          
  return await analyzeForMultipleCompanies(analysis, companies);
};


export const getSupportedCompanies = () => {
  return SUPPORTED_COMPANIES;
};
