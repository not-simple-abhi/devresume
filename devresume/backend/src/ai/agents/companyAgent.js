import openai from '../../config/openai.js';
import { companySystemPrompt, companyUserPrompt, COMPANY_PROFILES } from '../prompts/company.prompt.js';
import { extractJsonFromText } from '../../utils/responseFormatter.js';

export const SUPPORTED_COMPANIES = Object.keys(COMPANY_PROFILES);

export const analyzeForCompany = async (resumeText, company) => {
  const companyKey = company.toLowerCase().replace(/\s/g, '');

  if (!COMPANY_PROFILES[companyKey]) {
    throw new Error(
      `Company "${company}" not supported. Supported companies: ${SUPPORTED_COMPANIES.join(', ')}`
    );
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: companySystemPrompt },
        { role: 'user', content: companyUserPrompt(resumeText, company) },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    return extractJsonFromText(response.choices[0].message.content);
  } catch (error) {
    console.error(`Company Agent Error (${company}):`, error);
    throw new Error(`Company analysis failed for ${company}: ${error.message}`);
  }
};

// Analyze against multiple companies at once
export const analyzeForMultipleCompanies = async (resumeText, companies) => {
  const results = await Promise.allSettled(
    companies.map((company) => analyzeForCompany(resumeText, company))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        company: companies[index],
        error: result.reason.message,
        readiness_score: 0,
        is_ready: false,
      };
    }
  });
};
