






const SECTION_KEYWORDS = [
  'EDUCATION',
  'PROJECT',
  'PROJECTS',
  'EXPERIENCE',
  'WORK EXPERIENCE',
  'INTERNSHIP',
  'INTERNSHIPS',
  'SKILLS',
  'TECHNICAL SKILLS',
  'OTHER INFORMATION',
  'ACADEMIC ACHIEVEMENTS',
  'ACHIEVEMENTS',
  'POSITIONS OF RESPONSIBILITY',
  'CERTIFICATIONS',
  'AWARDS',
  'ACTIVITIES',
  'SUMMARY',
  'OBJECTIVE',
  'ABOUT',
];


const normalizeText = (rawText) => {
  let text = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ');

  
  
  for (const keyword of SECTION_KEYWORDS) {
    
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(?<![\\n])\\s+(${escaped})\\s`, 'g');
    text = text.replace(pattern, `\n$1\n`);
  }

  
  text = text.replace(/(?<!\n)\s*([•◦▪·■★♦❖▲▶►◆●])\s*/g, '\n$1 ');

  return text;
};

const SECTION_PATTERNS = {
  education: /^(education|academic background|academics|qualification)/i,

  skills: /^(skills|technical skills|technologies|tech stack|tools|competencies|expertise|other information|languages|programming|key skills)/i,

  experience: /^(experience|work experience|employment|professional experience|internship|internships|work history|positions? of responsibility|volunteering|leadership)/i,

  projects: /^(projects?|personal projects?|academic projects?|side projects?|portfolio|key projects?)/i,

  achievements: /^(achievements?|awards?|honors?|honours?|accomplishments?|certifications?|certificates?|recognition|academic achievements?|competitive|extra)/i,
};





const extractEmail = (text) => {
  const match = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : '';
};

const extractPhone = (text) => {
  const match = text.match(/(\+?\d{1,3}[\s\-]?)?\d{10}/);
  return match ? match[0].trim() : '';
};

const extractLinkedIn = (text) => {
  const match = text.match(/linkedin\.com\/in\/[a-zA-Z0-9\-_%]+/i);
  return match ? `https://${match[0]}` : '';
};

const extractGitHub = (text) => {
  const match = text.match(/github\.com\/[a-zA-Z0-9\-_%]+/i);
  return match ? `https://${match[0]}` : '';
};


const extractName = (text) => {
  const lines = text.split('\n');

  for (let i = 0; i < Math.min(5, lines.length); i++) {
    
    
    
    const line = lines[i].trim();
    if (!line) continue;

    
    const namePart = line
      .split(/\s{2,}|\||\+91|\+1/)[0]
      .trim();

    if (!namePart) continue;
    if (namePart.includes('@')) continue;
    if (namePart.match(/\d{5,}/)) continue;
    if (namePart.match(/https?:\/\//i)) continue;
    if (namePart.match(/linkedin|github|leetcode/i)) continue;
    if (namePart.length < 2 || namePart.length > 60) continue;

    
    if (namePart.match(/^[a-zA-Z][a-zA-Z\s\-\.]{1,40}$/)) {
      return namePart;
    }
  }
  return '';
};





const splitIntoSections = (text) => {
  const lines = text.split('\n');
  const sections = { header: [] };
  let currentSection = 'header';

  for (const line of lines) {
    const trimmed = line.trim();

    
    
    if (trimmed.length > 0 && trimmed.length <= 60) {
      let matchedSection = null;

      for (const [sectionName, pattern] of Object.entries(SECTION_PATTERNS)) {
        if (pattern.test(trimmed)) {
          matchedSection = sectionName;
          break;
        }
      }

      if (matchedSection) {
        currentSection = matchedSection;
        if (!sections[currentSection]) {
          sections[currentSection] = [];
        }
        continue; 
      }
    }

    if (!sections[currentSection]) {
      sections[currentSection] = [];
    }
    sections[currentSection].push(line);
  }

  const result = {};
  for (const [key, linesArr] of Object.entries(sections)) {
    result[key] = linesArr.join('\n').trim();
  }

  return result;
};





const splitSectionIntoItems = (text) => {
  if (!text) return [];

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const items = [];
  let current = [];

  for (const line of lines) {
    
    const isMainBullet = line.match(/^[•■★♦❖▲▶►▪◆●]/);
    
    
    const hasPipelineDelimiter = line.includes(' | ');
    const hasDateRange = line.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|20\d{2})\b.*(-|to)\b.*(Present|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|20\d{2})\b/i);

    
    const isCleanTitle =
      line.length > 3 &&
      line.length < 80 &&
      line.match(/^[A-Z]/) &&
      !line.match(/^(Built|Created|Designed|Implemented|Developed|Managed|Helped|Presented|Achieved|Selected|Successfully)/i) &&
      !line.match(/^[•·◦◦*+\-\u25E6]/);

    const startsNewItem = isMainBullet || hasPipelineDelimiter || hasDateRange || isCleanTitle;

    if (startsNewItem && current.length > 0) {
      items.push(current.join('\n').trim());
      current = [line];
    } else {
      current.push(line);
    }
  }

  if (current.length > 0) {
    items.push(current.join('\n').trim());
  }

  return items.filter(item => item.length > 10);
};

const parseEducation = (text) => {
  if (!text) return [];

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  
  const filtered = lines.filter(line => {
    const isHeader = line.match(/(course|college|university|cgpa|percentage|\b%\b)/i) && 
                     (line.match(/college/i) || line.match(/university/i) || line.match(/course/i));
    return !isHeader;
  });

  
  const entries = filtered.filter(l => l.match(/\b(20\d{2}|19\d{2}|20[xX]{2})\b/));

  if (entries.length > 0) return entries;

  
  const blocks = text.split(/\n\s*\n/).map(e => e.trim()).filter(Boolean);
  return blocks.length > 0 ? blocks : filtered;
};


const parseSkills = (text) => {
  if (!text) return [];

  const skills = new Set();

  
  const labeledMatches = text.matchAll(/(?:languages?|frameworks?.*?|tools?|databases?|core cs concepts?|skills?)[:\s]+([^\n]+)/gi);
  for (const match of labeledMatches) {
    const items = match[1]
      .split(/[,|]/)
      .map(s => s.trim())
      
      .map(s => s.split(/\s{2,}[A-Za-z ]+:/)[0].trim())
      .filter(s => s.length > 0 && s.length < 40);
    items.forEach(s => skills.add(s));
  }

  
  if (skills.size === 0) {
    const items = text
      .split(/[,|\n]/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && s.length < 40);
    items.forEach(s => skills.add(s));
  }

  
  const cleaned = [...skills]
    .filter(s => s.length > 1)
    .filter(s => !s.match(/^[\d\s◦•▪]+$/))         
    .filter(s => !s.match(/frameworks?\s*&?\s*tools?/i)) 
    .filter(s => !s.match(/core cs concepts?/i))
    .filter(s => !s.match(/databases?:?$/i))
    .filter(s => !s.match(/languages?:?$/i))
    .map(s => s.replace(/\(.*?\)/g, '').trim())     
    .filter(s => s.length > 1 && s.length < 40);

  return [...new Set(cleaned)];
};

const parseExperience = (text) => {
  if (!text) return [];
  
  const items = splitSectionIntoItems(text);
  if (items.length > 0) return items;

  const blocks = text.split(/\n\s*\n/).map(e => e.trim()).filter(Boolean);
  if (blocks.length > 0) return blocks;
  return text.split('\n').map(l => l.trim()).filter(Boolean);
};

const parseProjects = (text) => {
  if (!text) return [];

  const items = splitSectionIntoItems(text);
  if (items.length > 0) return items;

  
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const projects = [];
  let current = [];

  for (const line of lines) {
    const isNewProjectTitle =
      line.length < 80 &&
      line.match(/^[A-Z]/) &&
      !line.match(/^(Built|Created|Designed|Implemented|Developed|Managed|Helped|Presented|Achieved|Selected|Successfully)/i) &&
      !line.match(/^[•·▪▸➢►▶\-\*◦]/);

    if (isNewProjectTitle && current.length > 0) {
      projects.push(current.join('\n').trim());
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) projects.push(current.join('\n').trim());

  return projects.filter(p => p.length > 10);
};

const parseAchievements = (text) => {
  if (!text) return [];
  return text
    .split('\n')
    .map(l => l.replace(/^[•·▪▸➢►▶\-\*✓✔◦]\s*/, '').trim())
    .filter(l => l.length > 5);
};





export const parseResume = (rawText) => {
  
  
  const cleanText = normalizeText(rawText)
    .replace(/ {4,}/g, '   '); 

  const sections = splitIntoSections(cleanText);

  
  const found = Object.entries(sections)
    .filter(([k, v]) => k !== 'header' && v.trim().length > 0)
    .map(([k]) => k);
  console.log(`[ResumeParser] Sections found: ${found.length > 0 ? found.join(', ') : 'NONE'}`);

  return {
    name:         extractName(cleanText),
    email:        extractEmail(cleanText),
    phone:        extractPhone(cleanText),
    linkedin:     extractLinkedIn(cleanText),
    github:       extractGitHub(cleanText),

    education:    parseEducation(sections.education),
    skills:       parseSkills(sections.skills),
    experience:   parseExperience(sections.experience),
    projects:     parseProjects(sections.projects),
    achievements: parseAchievements(sections.achievements),

    rawText:      cleanText,
  };
};
