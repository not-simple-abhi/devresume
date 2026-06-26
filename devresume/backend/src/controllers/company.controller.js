import {
  analyzeForCompanyGuest,
  analyzeForCompaniesGuest,
  getSupportedCompanies,
} from '../services/review.service.js';
import { formatSuccessResponse } from '../utils/responseFormatter.js';

// GET /api/company/list — returns all supported companies
export const listCompanies = (req, res) => {
  const companies = getSupportedCompanies();
  res.status(200).json(formatSuccessResponse(companies, 'Supported companies'));
};

// POST /api/company/analyze — analyze against a single company
export const analyzeOneCompany = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { company } = req.body;

    if (!company) {
      return res.status(400).json({ success: false, message: 'Company name is required' });
    }

    const result = await analyzeForCompanyGuest(req.file, company);
    res.status(200).json(formatSuccessResponse(result, `Resume analyzed for ${company}`));
  } catch (error) {
    next(error);
  }
};

// POST /api/company/analyze/batch — analyze against multiple companies at once
export const analyzeMultipleCompanies = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    let { companies } = req.body;

    if (!companies) {
      return res.status(400).json({ success: false, message: 'Companies list is required' });
    }

    // Accept both comma-separated string and JSON array
    if (typeof companies === 'string') {
      companies = companies.split(',').map((c) => c.trim());
    }

    if (companies.length > 5) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 5 companies allowed per request',
      });
    }

    const results = await analyzeForCompaniesGuest(req.file, companies);

    // Sort by readiness score descending
    const sorted = results.sort((a, b) => (b.readiness_score || 0) - (a.readiness_score || 0));

    res.status(200).json(
      formatSuccessResponse(
        { results: sorted, total: sorted.length },
        'Resume analyzed for multiple companies'
      )
    );
  } catch (error) {
    next(error);
  }
};
