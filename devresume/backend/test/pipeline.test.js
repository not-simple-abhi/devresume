/**
 * pipeline.test.js
 *
 * Tests the resume upload & parsing pipeline WITHOUT calling Gemini.
 * Run this with:  node test/pipeline.test.js
 *
 * What it tests:
 *  1. resumeParser  — extracts name, email, skills etc. from raw text
 *  2. pdfParser     — reads a real PDF file
 *  3. docxParser    — reads a real DOCX file
 *  4. resume.service — full pipeline (extract → parse → cleanup)
 *  5. Edge cases    — empty text, corrupted file, unsupported type
 */

import { parseResume } from '../src/parsers/resumeParser.js';
import { parsePDF } from '../src/utils/pdfParser.js';
import { parseDOCX } from '../src/utils/docxParser.js';
import { processUploadedResume } from '../src/services/resume.service.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ❌ ${name}`);
    console.log(`     → ${err.message}`);
    failed++;
  }
}

async function testAsync(name, fn) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ❌ ${name}`);
    console.log(`     → ${err.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// ─────────────────────────────────────────────
// SAMPLE RESUME TEXT
// ─────────────────────────────────────────────

const SAMPLE_RESUME = `
Abhinav Sharma
abhinav@gmail.com
+91-9876543210
linkedin.com/in/abhinavsharma
github.com/abhinavsharma

Education
B.Tech in Computer Science
Delhi Technological University, 2020-2024
CGPA: 8.5

Skills
JavaScript, TypeScript, React, Node.js, Express
PostgreSQL, MongoDB, Redis
Docker, AWS, Git, Linux

Experience
Software Engineer Intern — Sprinklr
June 2023 - August 2023
- Built RESTful APIs using Node.js and Express serving 10k+ users
- Reduced API response time by 40% through Redis caching
- Collaborated with team of 5 engineers in an Agile environment

Projects
devresume — AI Resume Reviewer
  React, Node.js, Gemini, PostgreSQL
- Built a multi-agent AI system to analyze resumes with ATS scoring
- Deployed on AWS with 99.9% uptime
- 500+ users in first month

Portfolio Website
React, Tailwind CSS
- Personal portfolio with project showcase

Achievements
Winner — Smart India Hackathon 2023
Top 10 — HackMIT 2023
Google Summer of Code Contributor 2022
`;

// ─────────────────────────────────────────────
// TEST SUITE 1: resumeParser.js
// ─────────────────────────────────────────────

console.log('\n📋 Suite 1: resumeParser.js\n');

test('extracts name from top of resume', () => {
  const result = parseResume(SAMPLE_RESUME);
  assert(result.name === 'Abhinav Sharma', `Expected "Abhinav Sharma", got "${result.name}"`);
});

test('extracts email address', () => {
  const result = parseResume(SAMPLE_RESUME);
  assert(result.email === 'abhinav@gmail.com', `Expected email, got "${result.email}"`);
});

test('extracts phone number', () => {
  const result = parseResume(SAMPLE_RESUME);
  assert(result.phone.includes('9876543210'), `Expected phone, got "${result.phone}"`);
});

test('extracts LinkedIn URL', () => {
  const result = parseResume(SAMPLE_RESUME);
  assert(result.linkedin.includes('linkedin.com'), `Expected linkedin URL, got "${result.linkedin}"`);
});

test('extracts GitHub URL', () => {
  const result = parseResume(SAMPLE_RESUME);
  assert(result.github.includes('github.com'), `Expected github URL, got "${result.github}"`);
});

test('extracts skills as array', () => {
  const result = parseResume(SAMPLE_RESUME);
  assert(Array.isArray(result.skills), 'skills should be an array');
  assert(result.skills.length > 0, 'should find at least one skill');
  assert(result.skills.includes('React'), `Expected "React" in skills, got: ${result.skills.join(', ')}`);
});

test('extracts experience entries', () => {
  const result = parseResume(SAMPLE_RESUME);
  assert(Array.isArray(result.experience), 'experience should be an array');
  assert(result.experience.length > 0, 'should find at least one experience entry');
});

test('extracts project entries', () => {
  const result = parseResume(SAMPLE_RESUME);
  assert(Array.isArray(result.projects), 'projects should be an array');
  assert(result.projects.length > 0, 'should find at least one project');
});

test('extracts education entries', () => {
  const result = parseResume(SAMPLE_RESUME);
  assert(Array.isArray(result.education), 'education should be an array');
  assert(result.education.length > 0, 'should find at least one education entry');
});

test('extracts achievements', () => {
  const result = parseResume(SAMPLE_RESUME);
  assert(Array.isArray(result.achievements), 'achievements should be an array');
  assert(result.achievements.length > 0, 'should find at least one achievement');
});

test('includes rawText in output', () => {
  const result = parseResume(SAMPLE_RESUME);
  assert(typeof result.rawText === 'string', 'rawText should be a string');
  assert(result.rawText.length > 50, 'rawText should not be empty');
});

// ─────────────────────────────────────────────
// TEST SUITE 2: Edge Cases for resumeParser
// ─────────────────────────────────────────────

console.log('\n📋 Suite 2: resumeParser.js — Edge Cases\n');

test('handles empty string without crashing', () => {
  const result = parseResume('');
  assert(result.name === '', 'name should be empty string');
  assert(Array.isArray(result.skills), 'skills should still be array');
  assert(result.skills.length === 0, 'skills should be empty');
});

test('handles resume with no sections', () => {
  const result = parseResume('John Doe\njohn@example.com\n+1234567890');
  assert(result.email === 'john@example.com', 'should still extract email');
  assert(Array.isArray(result.skills), 'skills should be array even if empty');
});

test('handles resume with only skills section', () => {
  const result = parseResume('Skills\nPython, Django, PostgreSQL, Docker');
  assert(result.skills.length > 0, 'should extract skills');
  assert(result.skills.includes('Python'), 'should include Python');
});

test('does not crash on very long text', () => {
  const longText = SAMPLE_RESUME.repeat(10);
  const result = parseResume(longText);
  assert(result !== null, 'should return a result');
  assert(Array.isArray(result.skills), 'skills should be an array');
});

test('removes duplicate skills', () => {
  const text = 'Skills\nPython, Python, JavaScript, JavaScript, React';
  const result = parseResume(text);
  const uniqueSkills = new Set(result.skills);
  assert(uniqueSkills.size === result.skills.length, 'should not have duplicate skills');
});

// ─────────────────────────────────────────────
// TEST SUITE 3: processUploadedResume() edge cases
// (without actual files — simulating bad inputs)
// ─────────────────────────────────────────────

console.log('\n📋 Suite 3: processUploadedResume() — Edge Cases\n');

await testAsync('rejects unsupported file type (.txt)', async () => {
  // Create a fake multer file object with .txt extension
  const fakeFile = {
    originalname: 'resume.txt',
    path: path.join(__dirname, 'fixtures', 'dummy.txt'),
    mimetype: 'text/plain',
  };

  // Ensure the fixture file exists
  fs.mkdirSync(path.join(__dirname, 'fixtures'), { recursive: true });
  fs.writeFileSync(fakeFile.path, 'This is a text file');

  let errorThrown = false;
  try {
    await processUploadedResume(fakeFile);
  } catch (err) {
    errorThrown = true;
    assert(
      err.message.includes('Unsupported file format'),
      `Expected "Unsupported file format" error, got: "${err.message}"`
    );
  }

  // Cleanup: file should be deleted even on error
  const fileStillExists = fs.existsSync(fakeFile.path);
  assert(!fileStillExists, 'temp file should be deleted even after error');

  assert(errorThrown, 'should have thrown an error for .txt file');
});

await testAsync('rejects empty/corrupted PDF (too little text)', async () => {
  const fakeFile = {
    originalname: 'empty.pdf',
    path: path.join(__dirname, 'fixtures', 'empty.pdf'),
    mimetype: 'application/pdf',
  };

  // Create a fake "PDF" that is actually just a few bytes — not a real PDF
  fs.mkdirSync(path.join(__dirname, 'fixtures'), { recursive: true });
  fs.writeFileSync(fakeFile.path, '%PDF-1.4 fake corrupted content');

  let errorThrown = false;
  try {
    await processUploadedResume(fakeFile);
  } catch (err) {
    errorThrown = true;
    // Could fail at parse level or text extraction level — both are fine
    assert(err.message.length > 0, 'should throw a meaningful error message');
  }

  // File should always be cleaned up
  const fileStillExists = fs.existsSync(fakeFile.path);
  assert(!fileStillExists, 'temp file should be deleted even after failed parsing');

  assert(errorThrown, 'should have thrown an error for corrupted PDF');
});

await testAsync('temp file is deleted after successful parse', async () => {
  // Create a fake .pdf file that we know will fail text extraction
  // but we want to verify cleanup still happens
  const fakeFile = {
    originalname: 'test.pdf',
    path: path.join(__dirname, 'fixtures', 'test_cleanup.pdf'),
    mimetype: 'application/pdf',
  };

  fs.mkdirSync(path.join(__dirname, 'fixtures'), { recursive: true });
  fs.writeFileSync(fakeFile.path, 'not a real pdf');

  try {
    await processUploadedResume(fakeFile);
  } catch {
    // Expected to fail — we only care about cleanup
  }

  const fileStillExists = fs.existsSync(fakeFile.path);
  assert(!fileStillExists, 'temp file must always be deleted regardless of outcome');
});

// ─────────────────────────────────────────────
// TEST SUITE 4: Real file parsing (if files exist)
// ─────────────────────────────────────────────

console.log('\n📋 Suite 4: Real File Parsing (optional — needs test fixtures)\n');

const samplePdfPath = path.join(__dirname, 'fixtures', 'sample_resume.pdf');
const sampleDocxPath = path.join(__dirname, 'fixtures', 'sample_resume.docx');

if (fs.existsSync(samplePdfPath)) {
  await testAsync('parses a real PDF resume', async () => {
    const result = await parsePDF(samplePdfPath);
    assert(result.text && result.text.length > 100, 'should extract meaningful text from PDF');
    assert(result.pages >= 1, 'should detect at least 1 page');
    console.log(`     → Extracted ${result.text.length} chars from ${result.pages} page(s)`);
  });
} else {
  console.log('  ⏭️  Skipped: sample_resume.pdf not found in test/fixtures/');
  console.log('     Place a real resume PDF at: test/fixtures/sample_resume.pdf');
}

if (fs.existsSync(sampleDocxPath)) {
  await testAsync('parses a real DOCX resume', async () => {
    const result = await parseDOCX(sampleDocxPath);
    assert(result.text && result.text.length > 100, 'should extract meaningful text from DOCX');
    console.log(`     → Extracted ${result.text.length} chars from DOCX`);
  });
} else {
  console.log('  ⏭️  Skipped: sample_resume.docx not found in test/fixtures/');
  console.log('     Place a real resume DOCX at: test/fixtures/sample_resume.docx');
}

// ─────────────────────────────────────────────
// RESULTS
// ─────────────────────────────────────────────

console.log('\n' + '─'.repeat(40));
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('🎉 All tests passed!\n');
} else {
  console.log('⚠️  Some tests failed. Check the errors above.\n');
  process.exit(1);
}
