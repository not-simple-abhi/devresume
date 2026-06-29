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
import { orchestrate } from '../ai/orchestrator/agentManager.js';
import { analyzeResume } from '../intelligence/resumeAnalyzer.js';
import { calculateScore } from '../ruleEngine/calculateScore.js';
import { buildFinalReport } from '../ai/aggregator/aggregatorAgent.js';
import { analyzeForCompany, analyzeForMultipleCompanies, SUPPORTED_COMPANIES } from '../ai/agents/companyAgent.js';

// ─────────────────────────────────────────────────────────────
// CORE: Run all 5 AI agents in parallel on structured resume
// ─────────────────────────────────────────────────────────────

/**
 * runAgents(resume)
 *
 * New flow:
 *   1. Intelligence Engine — gathers facts deterministically (no AI)
 *   2. Rule Engine         — calculates scores from facts (no AI)
 *   3. AI Orchestrator     — explains, critiques, recommends (uses AI)
 *   4. Aggregator          — combines everything into final report
 */
const runAgents = async (resume) => {
  // Step 1 — Intelligence Engine (pure functions, instant, no API calls)
  console.log('[ReviewService] Running Intelligence Engine...');
  const analysis = analyzeResume(resume);

  // Step 2 — Rule Engine (pure math, instant, no API calls)
  console.log('[ReviewService] Calculating scores...');
  const scores = calculateScore(analysis);

  // Step 3 — AI Orchestrator (explain/recommend/critique using scores + facts)
  console.log('[ReviewService] Running AI agents...');
  const aiReport = await orchestrate(resume, analysis, scores);

  // Step 4 — Aggregator assembles the final report
  console.log('[ReviewService] Building final report...');
  return buildFinalReport(resume, analysis, scores, aiReport);
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
 * Runs Intelligence Engine first, passes analysis to company agent.
 * Analysis is the single source of truth — not the raw resume.
 */
export const analyzeForCompanyGuest = async (file, company) => {
  const resume   = await processUploadedResume(file);
  const analysis = analyzeResume(resume);          // single source of truth
  return await analyzeForCompany(analysis, company);
};

/**
 * analyzeForCompaniesGuest(file, companies)
 * Runs Intelligence Engine once, reuses analysis for all companies.
 * No login required. Max 5 companies per request.
 */
export const analyzeForCompaniesGuest = async (file, companies) => {
  const resume   = await processUploadedResume(file);
  const analysis = analyzeResume(resume);          // run once, reuse for all companies
  return await analyzeForMultipleCompanies(analysis, companies);
};

/**
 * getSupportedCompanies()
 * Returns the list of all supported company keys.
 */
export const getSupportedCompanies = () => {
  return SUPPORTED_COMPANIES;
};
