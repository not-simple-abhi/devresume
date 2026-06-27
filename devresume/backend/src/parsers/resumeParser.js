/**
 * resumeParser.js
 *
 * Converts raw resume text into a clean structured JSON object.
 * Uses regex patterns and simple heuristics — no AI required.
 *
 * Output shape:
 * {
 *   name, email, phone, linkedin, github,
 *   education: [],
 *   skills: [],
 *   experience: [],
 *   projects: [],
 *   achievements: []
 * }
 */

// ─────────────────────────────────────────────
// SECTION HEADER DETECTION
// Detects common resume section headings.
// ─────────────────────────────────────────────

const SECTION_PATTERNS = {
  education:    /^(education|academic|qualification|degree)/i,
  skills:       /^(skills|technologies|tech stack|tools|competencies|expertise)/i,
  experience:   /^(experience|work experience|employment|professional experience|internship|internships|work history)/i,
  projects:     /^(projects|personal projects|academic projects|side projects|portfolio)/i,
  achievements: /^(achievements|awards|honors|accomplishments|certifications|certificates|recognition)/i,
};

// ─────────────────────────────────────────────
// CONTACT INFO EXTRACTORS
// ─────────────────────────────────────────────

/**
 * Extracts email address from text.
 * Example: "john@gmail.com" → "john@gmail.com"
 */
const extractEmail = (text) => {
  const match = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : '';
};

/**
 * Extracts phone number from text.
 * Handles formats like +91-9876543210, (123) 456-7890, 9876543210
 */
const extractPhone = (text) => {
  const match = text.match(/(\+?\d{1,3}[\s\-]?)?(\(?\d{3}\)?[\s\-]?)?\d{3}[\s\-]?\d{4}/);
  return match ? match[0].trim() : '';
};

/**
 * Extracts LinkedIn profile URL.
 * Example: "linkedin.com/in/johndoe"
 */
const extractLinkedIn = (text) => {
  const match = text.match(/linkedin\.com\/in\/[a-zA-Z0-9\-_%]+/i);
  return match ? `https://${match[0]}` : '';
};

/**
 * Extracts GitHub profile URL.
 * Example: "github.com/johndoe"
 */
const extractGitHub = (text) => {
  const match = text.match(/github\.com\/[a-zA-Z0-9\-_%]+/i);
  return match ? `https://${match[0]}` : '';
};

/**
 * Extracts the candidate's name.
 *
 * Strategy:
 * 1. Look at the first few lines (name is almost always at the top).
 * 2. Pick the first line that looks like a real name:
 *    - Only letters (and spaces/hyphens/dots for names like "Mary-Jane")
 *    - Not an email, phone, or URL
 *    - Between 2 and 6 words
 */
const extractName = (lines) => {
  for (let i = 0; i < Math.min(8, lines.length); i++) {
    const line = lines[i].trim();

    if (!line) continue;                          // skip blank lines
    if (line.includes('@')) continue;             // skip emails
    if (line.match(/\d{5,}/)) continue;           // skip lines with long numbers (phones)
    if (line.match(/https?:\/\//i)) continue;     // skip URLs
    if (line.match(/linkedin|github/i)) continue; // skip social links

    // A name: only letters, spaces, hyphens, dots — 2 to 6 words
    if (line.match(/^[a-zA-Z][a-zA-Z\s\-\.]{2,50}$/) && line.split(' ').length <= 6) {
      return line;
    }
  }
  return '';
};

// ─────────────────────────────────────────────
// SECTION SPLITTER
// Splits the full text into named sections.
// ─────────────────────────────────────────────

/**
 * Splits resume text into sections based on section headers.
 *
 * Returns an object like:
 * {
 *   header: "John Doe\njohn@email.com...",
 *   education: "B.Tech CSE...",
 *   skills: "React, Node.js...",
 *   ...
 * }
 */
const splitIntoSections = (text) => {
  const lines = text.split('\n');
  const sections = { header: [] };
  let currentSection = 'header';

  for (const line of lines) {
    const trimmed = line.trim();

    // Check if this line is a section heading
    let matchedSection = null;
    for (const [sectionName, pattern] of Object.entries(SECTION_PATTERNS)) {
      if (pattern.test(trimmed)) {
        matchedSection = sectionName;
        break;
      }
    }

    if (matchedSection) {
      // Start collecting under the new section
      currentSection = matchedSection;
      if (!sections[currentSection]) {
        sections[currentSection] = [];
      }
    } else {
      // Add line to current section
      if (!sections[currentSection]) {
        sections[currentSection] = [];
      }
      sections[currentSection].push(line);
    }
  }

  // Convert each section's array of lines back to a string
  const result = {};
  for (const [key, lines] of Object.entries(sections)) {
    result[key] = lines.join('\n').trim();
  }

  return result;
};

// ─────────────────────────────────────────────
// SECTION CONTENT PARSERS
// Each parses one section into an array of items.
// ─────────────────────────────────────────────

/**
 * Parses education section.
 * Splits by blank lines — each block = one education entry.
 *
 * Example output:
 * ["B.Tech in Computer Science, IIT Delhi, 2020–2024"]
 */
const parseEducation = (text) => {
  if (!text) return [];

  // Split by double newlines (blank lines separate entries)
  const entries = text.split(/\n\s*\n/).map(e => e.trim()).filter(Boolean);

  // If no blank-line separation, each non-empty line is an entry
  if (entries.length <= 1) {
    return text.split('\n').map(l => l.trim()).filter(Boolean);
  }

  return entries;
};

/**
 * Parses skills section into a flat array of skill strings.
 *
 * Handles comma-separated, pipe-separated, and newline-separated lists.
 * Also strips bullet characters.
 *
 * Example output:
 * ["React", "Node.js", "Python", "PostgreSQL"]
 */
const parseSkills = (text) => {
  if (!text) return [];

  // Remove common bullet characters
  const cleaned = text.replace(/[•·▪▸➢\-\*]/g, ',');

  // Split by comma, pipe, newline, or semicolon
  const skills = cleaned
    .split(/[,|\n;]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && s.length < 60); // ignore very long strings

  return [...new Set(skills)]; // remove duplicates
};

/**
 * Parses experience section.
 * Splits by blank lines — each block = one job entry.
 *
 * Example output:
 * ["Software Engineer at Google\nJan 2023 – Present\n- Built scalable APIs..."]
 */
const parseExperience = (text) => {
  if (!text) return [];

  const entries = text.split(/\n\s*\n/).map(e => e.trim()).filter(Boolean);

  if (entries.length <= 1) {
    return text.split('\n').map(l => l.trim()).filter(Boolean);
  }

  return entries;
};

/**
 * Parses projects section.
 * Splits by blank lines — each block = one project.
 *
 * Example output:
 * ["devresume | AI Resume Reviewer\nReact, Node.js, Gemini\n- Built multi-agent resume analysis..."]
 */
const parseProjects = (text) => {
  if (!text) return [];

  const entries = text.split(/\n\s*\n/).map(e => e.trim()).filter(Boolean);

  if (entries.length <= 1) {
    return text.split('\n').map(l => l.trim()).filter(Boolean);
  }

  return entries;
};

/**
 * Parses achievements section.
 * Each non-empty line = one achievement.
 *
 * Example output:
 * ["Winner – Smart India Hackathon 2023", "Top 10 at HackMIT"]
 */
const parseAchievements = (text) => {
  if (!text) return [];

  return text
    .split('\n')
    .map(l => l.replace(/^[•·▪▸➢\-\*]\s*/, '').trim()) // remove bullet chars
    .filter(l => l.length > 3);
};

// ─────────────────────────────────────────────
// MAIN PARSER FUNCTION
// ─────────────────────────────────────────────

/**
 * parseResume(rawText)
 *
 * Takes the raw extracted text from a PDF/DOCX and returns
 * a clean structured JSON object.
 *
 * @param {string} rawText - Raw text from PDF/DOCX parser
 * @returns {object} Structured resume data
 */
export const parseResume = (rawText) => {
  // Clean up the text a bit — remove excessive whitespace
  const cleanText = rawText
    .replace(/\r\n/g, '\n')   // normalize Windows line endings
    .replace(/\r/g, '\n')     // normalize old Mac line endings
    .replace(/\t/g, ' ')      // tabs → spaces
    .replace(/ {3,}/g, ' ');  // collapse 3+ spaces into one

  const lines = cleanText.split('\n').map(l => l.trim());

  // Split the full text into named sections
  const sections = splitIntoSections(cleanText);

  // Use the header section to extract contact info
  const headerText = sections.header || '';

  const structured = {
    // ── Contact Info ──────────────────────────
    name:         extractName(lines),
    email:        extractEmail(headerText),
    phone:        extractPhone(headerText),
    linkedin:     extractLinkedIn(cleanText),
    github:       extractGitHub(cleanText),

    // ── Resume Sections ───────────────────────
    education:    parseEducation(sections.education),
    skills:       parseSkills(sections.skills),
    experience:   parseExperience(sections.experience),
    projects:     parseProjects(sections.projects),
    achievements: parseAchievements(sections.achievements),

    // ── Raw text kept for AI agents ───────────
    // Agents receive this instead of raw PDF text
    rawText: cleanText,
  };

  return structured;
};
