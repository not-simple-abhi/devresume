/**
 * agentManager.test.js
 *
 * Tests the agentManager orchestrator and its sub-agents.
 * Mocks the global fetch API to simulate OpenRouter responses without making network requests.
 * Run with: node test/agentManager.test.js
 */

import { orchestrate } from '../src/ai/orchestrator/agentManager.js';
import dotenv from 'dotenv';

// Ensure we have some fake environment variables set
dotenv.config();
process.env.OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'fake-key-for-testing';

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
    console.log(`     → ${err.stack || err.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// ─────────────────────────────────────────────
// MOCK RESPONSES FOR AGENTS
// ─────────────────────────────────────────────

const mockAtsResponse = {
  score: 85,
  issues: ['Add more keywords'],
  recommendations: ['Add Redis to skills'],
  keywords_found: ['JavaScript', 'React'],
  formatting_issues: []
};

const mockRecruiterResponse = {
  strengths: ['Clear experience descriptions'],
  weaknesses: ['Missing impact metrics'],
  impact_score: 80,
  standout_points: ['Sprinklr Intern'],
  red_flags: []
};

const mockGrammarResponse = {
  errors: [{ type: 'spelling', text: 'teh', suggestion: 'the' }],
  suggestions: ['Fix spelling error "teh"'],
  clarity_score: 90,
  tone: 'professional',
  consistency_issues: []
};

const mockSkillsResponse = {
  current_skills: {
    technical: ['JavaScript', 'React'],
    soft: [],
    tools: []
  },
  missing_skills: [{ skill: 'Redis', reason: 'High demand', priority: 'high' }],
  skill_relevance_score: 88,
  trending_skills_to_add: []
};

const mockProjectsResponse = {
  project_strengths: ['Solid fullstack project'],
  project_suggestions: ['Describe project impact'],
  portfolio_score: 75,
  recommended_projects: []
};

const responsesInOrder = [
  mockAtsResponse,
  mockRecruiterResponse,
  mockGrammarResponse,
  mockSkillsResponse,
  mockProjectsResponse
];

// ─────────────────────────────────────────────
// MOCK FETCH IMPLEMENTATION
// ─────────────────────────────────────────────

let callCount = 0;
const originalFetch = globalThis.fetch;

function setupMockFetch() {
  callCount = 0;
  globalThis.fetch = async (url, options) => {
    const mockData = responsesInOrder[callCount];
    callCount++;

    return {
      ok: true,
      status: 200,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify(mockData)
            }
          }
        ]
      })
    };
  };
}

function restoreFetch() {
  globalThis.fetch = originalFetch;
}

// ─────────────────────────────────────────────
// TESTS
// ─────────────────────────────────────────────

console.log('\n📋 Suite: agentManager.js Orchestration\n');

await testAsync('orchestrates all agents and aggregates results correctly', async () => {
  setupMockFetch();
  
  try {
    const mockResume = {
      name: 'Abhinav Sharma',
      email: 'abhinav@gmail.com',
      phone: '+91-9876543210',
      linkedin: 'https://linkedin.com/in/abhinavsharma',
      github: 'https://github.com/abhinavsharma',
      education: ['B.Tech in Computer Science - DTU, 2024'],
      skills: ['JavaScript', 'React'],
      experience: ['Sprinklr Intern'],
      projects: ['devresume'],
      achievements: ['Smart India Hackathon']
    };

    const result = await orchestrate(mockResume);

    // Assert fetch was called exactly 5 times (one for each agent)
    assert(callCount === 5, `Expected fetch to be called 5 times, but got ${callCount}`);

    // Verify aggregated score calculation (average of 85, 80, 90, 88, 75 = 83.6 => rounded to 84)
    assert(result.summary.overallScore === 84, `Expected overall score 84, got ${result.summary.overallScore}`);
    
    // Verify specific fields mapped from sub-agent outputs
    assert(result.atsScore === 85, `Expected ATS score 85, got ${result.atsScore}`);
    assert(result.detailedScores.recruiter === 80, `Expected recruiter detailed score 80, got ${result.detailedScores.recruiter}`);
    assert(result.detailedScores.grammar === 90, `Expected grammar detailed score 90, got ${result.detailedScores.grammar}`);
    assert(result.detailedScores.skills === 88, `Expected skills detailed score 88, got ${result.detailedScores.skills}`);
    assert(result.detailedScores.projects === 75, `Expected projects detailed score 75, got ${result.detailedScores.projects}`);
    
    // Verify mapped arrays
    assert(result.strengths.includes('Clear experience descriptions'), 'Should include recruiter strengths');
    assert(result.weaknesses.includes('Missing impact metrics'), 'Should include recruiter weaknesses');
    assert(result.missingSkills[0].skill === 'Redis', 'Should include missing skills from skills agent');
    assert(result.grammarSuggestions[0].issue === 'teh', 'Should map grammar errors to suggestions');
    assert(result.projectSuggestions.includes('Describe project impact'), 'Should map project suggestions');

  } finally {
    restoreFetch();
  }
});

// ─────────────────────────────────────────────
// RESULTS
// ─────────────────────────────────────────────

console.log('\n' + '─'.repeat(40));
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('🎉 All Agent Manager tests passed!\n');
} else {
  console.log('⚠️  Some Agent Manager tests failed. Check errors above.\n');
  process.exit(1);
}
