/**
 * ruleEngine.test.js
 * Run: node test/ruleEngine.test.js
 */

import { analyzeResume }   from '../src/intelligence/resumeAnalyzer.js';
import { calculateScore }  from '../src/ruleEngine/calculateScore.js';

const RESUME = {
  name: 'Abhinav Kumar',
  email: 'abhinav.kumar.ug24@nsut.ac.in',
  phone: '+91-9205004103',
  linkedin: '', github: '', portfolio: '',
  education: [
    'B.Tech (Information Technology) Netaji Subhas University of Technology 2028 7.17',
    'Board (Class XII) Kendriya Vidyalaya 2023 85.4%',
  ],
  skills: ['C++','Python','JavaScript','SQL','HTML5','Node.js','Express.js','Flask','Git','GitHub','RESTful APIs','MongoDB','Database Design','Data Structures & Algorithms','Computer Networks'],
  projects: [
    'Smart and Tamper-Proof Parking Management System\nBuilt a full-stack prototype using MongoDB, Express.js, React.js, Node.js.\nImplemented hashcode-based security algorithm.',
    'Student Management System\nCreated a web app with Flask, Python, MySQL.\nDesigned relational database for 500+ student records.',
  ],
  experience: [
    'Core Working Member | Open Mic Society Aug 2024 - Present\nManaged coordination between performers and technical crews.',
  ],
  achievements: ['98.625 percentile JEE Mains', 'Top 215 HACK4DELHI hackathon'],
  rawText: 'Node.js Express.js MongoDB React.js Python Flask MySQL Git REST API JavaScript TypeScript',
};

let passed = 0;
let failed = 0;

const check = (label, condition, detail = '') => {
  if (condition) { console.log(`  ✅ ${label}`); passed++; }
  else { console.log(`  ❌ ${label}${detail ? ' → ' + detail : ''}`); failed++; }
};

console.log('\n🔍 Rule Engine Test\n');

const analysis = analyzeResume(RESUME);
const score    = calculateScore(analysis);

console.log('\n📊 Score Breakdown:');
console.log(`   Contact:    ${score.breakdown.contact}/${score.maxBreakdown.contact}`);
console.log(`   Education:  ${score.breakdown.education}/${score.maxBreakdown.education}`);
console.log(`   Skills:     ${score.breakdown.skills}/${score.maxBreakdown.skills}`);
console.log(`   Projects:   ${score.breakdown.projects}/${score.maxBreakdown.projects}`);
console.log(`   Experience: ${score.breakdown.experience}/${score.maxBreakdown.experience}`);
console.log(`   Keywords:   ${score.breakdown.keywords}/${score.maxBreakdown.keywords}`);
console.log(`   ─────────────────`);
console.log(`   Overall:    ${score.overall}/100  (${score.label})`);
console.log(`   ATS Score:  ${score.atsScore}/100`);

console.log('\n📋 Checks:');
check('overall is number 0-100',     typeof score.overall === 'number' && score.overall >= 0 && score.overall <= 100);
check('atsScore is number 0-100',    typeof score.atsScore === 'number' && score.atsScore >= 0 && score.atsScore <= 100);
check('breakdown has 6 sections',    Object.keys(score.breakdown).length === 6);
check('breakdown sums to overall',   Math.abs(Object.values(score.breakdown).reduce((a,b)=>a+b,0) - score.overall) <= 1);
check('label is string',             typeof score.label === 'string');
check('topDeductions is array',      Array.isArray(score.topDeductions));
check('maxBreakdown sums to 100',    Object.values(score.maxBreakdown).reduce((a,b)=>a+b,0) === 100);
check('contact score <= weight',     score.breakdown.contact <= 10);
check('projects score <= weight',    score.breakdown.projects <= 25);
check('skills score <= weight',      score.breakdown.skills <= 20);

console.log('\n⚠️  Top Issues:');
score.topDeductions.slice(0, 5).forEach(d => console.log(`   ${d.points}pts: ${d.reason}`));

console.log('\n' + '─'.repeat(40));
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed === 0) console.log('🎉 Rule Engine tests passed!\n');
else { console.log('⚠️  Some tests failed.\n'); process.exit(1); }
