/**
 * companyAgent.js
 * Receives structured resume JSON from resumeParser.
 */
import { callAI } from '../../config/aiClient.js';
import { companySystemPrompt, companyUserPrompt, COMPANY_PROFILES } from '../prompts/company.prompt.js';

// List of all supported company keys (e.g. "google", "amazon")
export const SUPPORTED_COMPANIES = Object.keys(COMPANY_PROFILES);

/**
 * analyzeForCompany(resume, company)
 *
 * Analyzes a structured resume against a specific company's hiring bar.
 *
 * @param {object} resume  - Structured resume object from resumeParser
 * @param {string} company - Company key e.g. "google", "amazon"
 */
export const analyzeForCompany = async (resume, company) => {
  const companyKey = company.toLowerCase().replace(/\s/g, '');

  if (!COMPANY_PROFILES[companyKey]) {
    throw new Error(
      `Company "${company}" not supported. Supported: ${SUPPORTED_COMPANIES.join(', ')}`
    );
  }

  try {
    const data = await callAI(companySystemPrompt, companyUserPrompt(resume, company));
    return data;
  } catch (error) {
    console.error(`[Company Agent] Error (${company}):`, error.message);
    throw new Error(`Company analysis failed for ${company}: ${error.message}`);
  }
};

/**
 * analyzeForMultipleCompanies(resume, companies)
 *
 * Analyzes a resume against multiple companies in parallel.
 * Uses Promise.allSettled so one failure doesn't block the rest.
 *
 * @param {object}   resume    - Structured resume object from resumeParser
 * @param {string[]} companies - Array of company keys
 */
export const analyzeForMultipleCompanies = async (resume, companies) => {
  const results = await Promise.allSettled(
    companies.map((company) => analyzeForCompany(resume, company))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      // Return a clean error object instead of crashing
      return {
        company: companies[index],
        error: result.reason.message,
        readiness_score: 0,
        is_ready: false,
        verdict: 'Analysis failed for this company',
      };
    }
  });
};
