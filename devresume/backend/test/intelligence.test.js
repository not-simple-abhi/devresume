/**
 * intelligence.test.js
 *
 * Tests the Intelligence Engine (all 6 analyzers + resumeAnalyzer).
 * No API calls, no DB — 100% deterministic.
 *
 * Run: node test/intelligence.test.js
 */

import { analyzeResume } from '../src/intelligence/resumeAnalyzer.js';

// Abhinav's actual resume data (from our parser output)
const RESUME = {
  name: 'Abhinav Kumar',
  email: 'abhinav.kumar.ug24@nsut.ac.in',
  phone: '+91-9205004103',
  linkedin: '',
  github: '',
  portfolio: '',

  education: [
    'B.Tech (Information Technology)   Netaji Subhas University of Technology   2028   7.17',
    'Board (Class XII)   Kendriya Vidyalaya   2023   85.4%',
    'Board (Class X)   Kendriya Vidyalaya   2021   94%',
  ],

  skills: [
    'C++', 'Python', 'JavaScript', 'SQL', 'HTML5',
    'Node.js', 'Express.js', 'Flask', 'Git', 'GitHub',
    'RESTful APIs', 'MongoDB', 'Database Design',
    'Database Management Systems', 'Computer Networks',
    'Data Structures & Algorithms',
  ],

  projects: [
    `Smart and Tamper-Proof Parking Management System
Built a full-stack real-time parking tracking prototype using MongoDB, Express.js, React.js, and Node.js.
Implemented a hashcode-based security algorithm in the backend to keep data safe and prevent tampering.
Designed role-based login workflows to make dashboard access simple for both admins and general users.`,

    `Student Management System
Created a complete web application with Flask, Python, and MySQL to digitize university academic logs.
Designed a clean relational database to cleanly track student profiles, daily attendance, and grading matrices.
Built a straightforward dashboard interface using HTML, CSS, and JavaScript for smooth data entry and updates.`,
  ],

  experience: [
    `Core Working Member | Open Mic Society, NSUT   Aug 2024 - Present
Helped organize multiple campus cultural events, handling backend planning and stage logistics smoothly.
Managed coordination between performers and technical crews to ensure scheduling ran on time.`,
  ],

  achievements: [
    'Achieved 98.625 percentile in JEE Mains out of more than 1 million participating students.',
    'Selected in the Top 215 out of 1,200 teams at the national level HACK4DELHI hackathon.',
    'Successfully solved over 260+ algorithmic questions on LeetCode.',
  ],

  rawText: 'Abhinav Kumar C++ Python JavaScript Node.js Express.js MongoDB React.js Flask MySQL Git GitHub REST API',
};

// ─────────────────────────────────────────────
// RUN TESTS
// ─────────────────────────────────────────────

let passed = 0;
let failed = 0;

function check(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.log(`  ❌ ${label}${detail ? ' → ' + detail : ''}`);
    failed++;
  }
}

console.log('\n🔍 Running Intelligence Engine tests...\n');

const result = analyzeResume(RESUME);

// ── Contact Analyzer ──────────────────────────
console.log('\n📋 Contact Analyzer');
check('has earnedScore',        typeof result.contact.earnedScore === 'number');
check('email detected',         result.contact.checks.email === true);
check('phone detected',         result.contact.checks.phone === true);
check('linkedin missing noted', result.contact.checks.linkedin === false);
check('github missing noted',   result.contact.checks.github === false);
check('score > 0',              result.contact.earnedScore > 0);
check('deductions array',       Array.isArray(result.contact.deductions));
console.log(`     Score: ${result.contact.earnedScore}/${result.contact.maxScore}`);

// ── Education Analyzer ────────────────────────
console.log('\n📋 Education Analyzer');
check('has entries',            result.education.entries.length > 0);
check('degree detected',        result.education.checks.hasDegree === true);
check('institution detected',   result.education.checks.hasInstitution === true);
check('year detected',          result.education.checks.hasYear === true);
check('grade detected',         result.education.checks.hasGrade === true);
check('score > 0',              result.education.earnedScore > 0);
console.log(`     Score: ${result.education.earnedScore}/${result.education.maxScore}`);

// ── Skills Analyzer ───────────────────────────
console.log('\n📋 Skills Analyzer');
check('has skills',             result.skills.checks.hasSkills === true);
check('10+ skills detected',    result.skills.checks.hasTenPlus === true);
check('languages categorized',  result.skills.categorized.languages.length > 0);
check('frameworks categorized', result.skills.categorized.frameworks.length > 0);
check('databases categorized',  result.skills.categorized.databases.length > 0);
check('no duplicates',          result.skills.checks.hasDuplicates === false);
check('score > 0',              result.skills.earnedScore > 0);
console.log(`     Score: ${result.skills.earnedScore}/${result.skills.maxScore}`);
console.log(`     Languages: ${result.skills.categorized.languages.join(', ')}`);
console.log(`     Frameworks: ${result.skills.categorized.frameworks.join(', ')}`);
console.log(`     Databases: ${result.skills.categorized.databases.join(', ')}`);

// ── Project Analyzer ──────────────────────────
console.log('\n📋 Project Analyzer');
check('has projects',           result.projects.checks.hasProjects === true);
check('multiple projects',      result.projects.checks.hasMultiple === true);
check('action verbs found',     result.projects.checks.hasActionVerbs === true);
check('projects array',         result.projects.projects.length >= 2);
check('score > 0',              result.projects.earnedScore > 0);
console.log(`     Score: ${result.projects.earnedScore}/${result.projects.maxScore}`);
result.projects.projects.forEach(p => {
  console.log(`     Project ${p.index}: "${p.title}" → ${p.score}/${p.maxScore}`);
});

// ── Experience Analyzer ───────────────────────
console.log('\n📋 Experience Analyzer');
check('has entries',            result.experience.checks.hasEntries === true);
check('dates detected',         result.experience.checks.hasDates === true);
check('action verbs',           result.experience.checks.hasActionVerbs === true);
check('score > 0',              result.experience.earnedScore > 0);
console.log(`     Score: ${result.experience.earnedScore}/${result.experience.maxScore}`);

// ── Keyword Analyzer ──────────────────────────
console.log('\n📋 Keyword Analyzer');
check('domain detected',        result.keywords.detectedDomain !== '');
check('coverage > 0',           result.keywords.coveragePercent > 0);
check('matched keywords',       result.keywords.matchedKeywords.length > 0);
check('missing keywords',       Array.isArray(result.keywords.missingKeywords));
check('coverage object',        typeof result.keywords.coverage === 'object');
check('score > 0',              result.keywords.earnedScore > 0);
console.log(`     Domain: ${result.keywords.detectedDomain}`);
console.log(`     Coverage: ${result.keywords.coveragePercent}%`);
console.log(`     Matched: ${result.keywords.matchedKeywords.slice(0, 5).join(', ')}...`);
console.log(`     Missing: ${result.keywords.missingKeywords.slice(0, 5).join(', ')}...`);
console.log(`     Score: ${result.keywords.earnedScore}/${result.keywords.maxScore}`);

// ── Summary ───────────────────────────────────
console.log('\n📋 Overall Summary');
check('candidateName set',      result.candidateName === 'Abhinav Kumar');
check('summary exists',         typeof result.summary === 'object');
check('totalSkills in summary', result.summary.totalSkills > 0);
check('totalProjects in summary', result.summary.totalProjects >= 2);

const total = result.contact.earnedScore + result.education.earnedScore +
              result.skills.earnedScore + result.projects.earnedScore +
              result.experience.earnedScore + result.keywords.earnedScore;

const maxTotal = result.contact.maxScore + result.education.maxScore +
                 result.skills.maxScore + result.projects.maxScore +
                 result.experience.maxScore + result.keywords.maxScore;

console.log(`\n📊 Total Raw Score: ${total}/${maxTotal}`);

// ─────────────────────────────────────────────
console.log('\n' + '─'.repeat(40));
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('🎉 All Intelligence Engine tests passed!\n');
} else {
  console.log('⚠️  Some tests failed.\n');
  process.exit(1);
}
