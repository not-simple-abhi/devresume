

import fs from 'fs/promises';
import path from 'path';
import { parsePDF } from '../utils/pdfParser.js';
import { parseDOCX } from '../utils/docxParser.js';
import { parseResume } from '../parsers/resumeParser.js';


export const processUploadedResume = async (file) => {

  
  const ext = path.extname(file.originalname).toLowerCase();

  
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
    
    await fs.unlink(file.path).catch((err) => {
      
      console.warn(`[ResumeService] Could not delete temp file: ${err.message}`);
    });
  }

  
  if (!rawText || rawText.trim().length < 50) {
    throw new Error('Could not extract readable text from the resume. Please check the file.');
  }

  
  console.log(`[ResumeService] Structuring resume data...`);
  const structuredResume = parseResume(rawText);

  console.log(`[ResumeService] Done. Found: ${structuredResume.skills.length} skills, ${structuredResume.projects.length} projects, ${structuredResume.experience.length} experience entries`);

  return structuredResume;
};
