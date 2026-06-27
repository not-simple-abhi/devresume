/**
 * resume.service.js
 *
 * Handles the complete resume upload and parsing pipeline:
 *
 *   Uploaded File (PDF / DOCX)
 *        ↓
 *   Text Extraction  (pdfParser / docxParser)
 *        ↓
 *   Resume Parser    (resumeParser.js)
 *        ↓
 *   Structured JSON  { name, email, skills, projects, ... }
 *        ↓
 *   Temp file deleted
 *
 * This structured JSON is what all AI agents receive.
 */

import fs from 'fs/promises';
import path from 'path';
import { parsePDF } from '../utils/pdfParser.js';
import { parseDOCX } from '../utils/docxParser.js';
import { parseResume } from '../parsers/resumeParser.js';

/**
 * processUploadedResume(file)
 *
 * Main pipeline function. Call this with the multer file object.
 * Returns the structured resume JSON.
 *
 * @param {object} file - Multer file object (has .path, .originalname, etc.)
 * @returns {object} Structured resume data
 */
export const processUploadedResume = async (file) => {

  // ── Step 1: Detect file type ─────────────────────────────────
  const ext = path.extname(file.originalname).toLowerCase();

  // ── Step 2: Extract raw text from the file ───────────────────
  let rawText = '';

  try {
    if (ext === '.pdf') {
      console.log(`[ResumeService] Parsing PDF: ${file.originalname}`);
      const result = await parsePDF(file.path);
      rawText = result.text;

    } else if (ext === '.docx' || ext === '.doc') {
      console.log(`[ResumeService] Parsing DOCX: ${file.originalname}`);
      const result = await parseDOCX(file.path);
      rawText = result.text;

    } else {
      throw new Error(`Unsupported file format "${ext}". Please upload a PDF or DOCX.`);
    }

  } finally {
    // ── Step 3: Delete temp file (always, even if parsing failed) ─
    await fs.unlink(file.path).catch((err) => {
      // Log but don't crash — file might already be gone
      console.warn(`[ResumeService] Could not delete temp file: ${err.message}`);
    });
  }

  // ── Step 4: Check we actually got text ───────────────────────
  if (!rawText || rawText.trim().length < 50) {
    throw new Error('Could not extract readable text from the resume. Please check the file.');
  }

  // ── Step 5: Parse raw text into structured JSON ──────────────
  console.log(`[ResumeService] Structuring resume data...`);
  const structuredResume = parseResume(rawText);

  console.log(`[ResumeService] Done. Found: ${structuredResume.skills.length} skills, ${structuredResume.projects.length} projects, ${structuredResume.experience.length} experience entries`);

  return structuredResume;
};
