/**
 * review.service.js
 *
 * Orchestrates the full analysis pipeline:
 *
 *   Uploaded File
 *        ↓
 *   processUploadedResume()   ← resume.service.js handles extraction + parsing
 *        ↓
 *   Structured Resume JSON    { name, email, skills, projects, experience, ... }
 *        ↓
 *   AI Agents (run in parallel)
 *        ↓
 *   Aggregator                combines all agent results
 *        ↓
 *   Final Report              saved to DB (logged-in) or returned (guest)
 */

import prisma from '../database/client.js';
import { processUploadedResume } from './resume.service.js';
import { analyzeATS } from '../ai/agents/atsAgent.js';
import { analyzeRecruiter } from '../ai/agents/recruiterAgent.js';
import { analyzeGrammar } from '../ai/agents/grammarAgent.js';
import { analyzeSkills } from '../ai/agents/skillsAgent.js';
import { analyzeProjects } from '../ai/agents/projectAgent.js';
import { aggregateReports } from '../ai/aggregator/aggregatorAgent.js';
import { analyzeForCompany, analyzeForMultipleCompanies, SUPPORTED_COMPANIES } from '../ai/agents/companyAgent.js';

// ─────────────────────────────────────────────────────────────
// CORE: Run all 5 AI agents in parallel on structured resume
// ─────────────────────────────────────────────────────────────

/**
 * runAgents(resume)
 *
 * Runs all 5 agents SEQUENTIALLY to avoid rate limiting on free tier.
 * Each agent waits for the previous one to finish before starting.
 *
 * @param {object} resume - Structured resume from resumeParser
 * @returns {object} Aggregated final report
 */
const runAgents = async (resume) => {
  console.log(`[ReviewService] Running agents for: ${resume.name || 'Unknown'}`);

  // Sequential — one at a time to respect free tier rate limits
  const ats       = await analyzeATS(resume);
  console.log('[ReviewService] ATS done');

  const recruiter = await analyzeRecruiter(resume);
  console.log('[ReviewService] Recruiter done');

  const grammar   = await analyzeGrammar(resume);
  console.log('[ReviewService] Grammar done');

  const skills    = await analyzeSkills(resume);
  console.log('[ReviewService] Skills done');

  const projects  = await analyzeProjects(resume);
  console.log('[ReviewService] Projects done');

  console.log('[ReviewService] All agents done. Aggregating...');
  return aggregateReports({ ats, recruiter, grammar, skills, projects });
};

// ─────────────────────────────────────────────────────────────
// GUEST ANALYSIS — No login required, nothing saved to DB
// ─────────────────────────────────────────────────────────────

/**
 * analyzeGuest(file)
 *
 * Full pipeline for an unauthenticated user.
 * Returns the analysis report. Nothing is saved.
 *
 * @param {object} file - Multer file object
 */
export const analyzeGuest = async (file) => {
  // Step 1: Extract text + parse into structured JSON
  const resume = await processUploadedResume(file);

  // Step 2: Run AI agents on structured data
  const report = await runAgents(resume);

  // Step 3: Include parsed info in the response (useful for the frontend)
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

// ─────────────────────────────────────────────────────────────
// AUTHENTICATED ANALYSIS — Login required, result saved to DB
// ─────────────────────────────────────────────────────────────

/**
 * analyzeAndSave(file, userId)
 *
 * Full pipeline for a logged-in user.
 * Saves only the scores + report to DB — resume text is never stored.
 *
 * @param {object} file - Multer file object
 * @param {string} userId - Authenticated user's ID
 */
export const analyzeAndSave = async (file, userId) => {
  // Step 1: Extract text + parse into structured JSON
  const resume = await processUploadedResume(file);

  // Step 2: Run AI agents on structured data
  const report = await runAgents(resume);

  // Step 3: Save only the result to DB (NOT the resume text)
  const saved = await prisma.review.create({
    data: {
      userId,
      resumeName: file.originalname,
      atsScore: report.atsScore,
      overallScore: report.summary.overallScore,
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

// ─────────────────────────────────────────────────────────────
// HISTORY & SAVED REVIEWS
// ─────────────────────────────────────────────────────────────

/**
 * getUserHistory(userId)
 * Returns all past reviews for a user — used for graphs/dashboard.
 */
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

/**
 * getReviewById(reviewId, userId)
 * Returns a single saved review. Ensures the review belongs to this user.
 */
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

/**
 * deleteReview(reviewId, userId)
 * Deletes a saved review. Ensures the review belongs to this user.
 */
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

// ─────────────────────────────────────────────────────────────
// COMPANY ANALYSIS
// ─────────────────────────────────────────────────────────────

/**
 * analyzeForCompanyGuest(file, company)
 * Analyzes resume against a specific company's hiring bar.
 * No login required.
 */
export const analyzeForCompanyGuest = async (file, company) => {
  const resume = await processUploadedResume(file);
  return await analyzeForCompany(resume, company);
};

/**
 * analyzeForCompaniesGuest(file, companies)
 * Analyzes resume against multiple companies at once.
 * No login required. Max 5 companies per request.
 */
export const analyzeForCompaniesGuest = async (file, companies) => {
  const resume = await processUploadedResume(file);
  return await analyzeForMultipleCompanies(resume, companies);
};

/**
 * getSupportedCompanies()
 * Returns the list of all supported company keys.
 */
export const getSupportedCompanies = () => {
  return SUPPORTED_COMPANIES;
};
