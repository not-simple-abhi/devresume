
import { callAI } from '../../config/aiClient.js';
import { companySystemPrompt, companyUserPrompt, COMPANY_PROFILES } from '../prompts/company.prompt.js';

export const SUPPORTED_COMPANIES = Object.keys(COMPANY_PROFILES);


export const analyzeForCompany = async (analysis, company) => {
  const companyKey = company.toLowerCase().replace(/\s/g, '');

  if (!COMPANY_PROFILES[companyKey]) {
    throw new Error(
      `Company "${company}" not supported. Supported: ${SUPPORTED_COMPANIES.join(', ')}`
    );
  }

  try {
    return await callAI(companySystemPrompt, companyUserPrompt(analysis, company));
  } catch (error) {
    console.error(`[Company Agent] Error (${company}):`, error.message);
    throw new Error(`Company analysis failed for ${company}: ${error.message}`);
  }
};


export const analyzeForMultipleCompanies = async (analysis, companies) => {
  const results = await Promise.allSettled(
    companies.map(company => analyzeForCompany(analysis, company))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') return result.value;
    return {
      company:         companies[index],
      error:           result.reason.message,
      readiness_score: 0,
      is_ready:        false,
      verdict:         'Analysis failed for this company',
    };
  });
};
