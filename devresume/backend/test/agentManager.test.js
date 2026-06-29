/**
 * agentManager.test.js
 *
 * Tests the agentManager orchestrator and its sub-agents.
 * Mocks the global fetch API to simulate OpenRouter responses without making network requests.
 * Run with: node test/agentManager.test.js
 */

import { orchestrate } from '../src/ai/orchestrator/agentManager.js';
import { analyzeResume } from '../src/intelligence/resumeAnalyzer.js';
import { calculateScore } from '../src/ruleEngine/calculateScore.js';
import { buildFinalReport } from '../src/ai/aggregator/aggregatorAgent.js';
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
// MOCK RESPONSES FOR AGENTS (Sprint 3 format)
// ─────────────────────────────────────────────

const mockAtsResponse = {
  score_explanation: 'Your resume has good formatting and details.',
  ats_issues: ['Add more keywords'],
  keyword_recommendations: ["Add 'Redis' to skills"],
  formatting_recommendations: [],
  quick_wins: ['easiest change to boost ATS score immediately']
};

const mockRecruiterResponse = {
  summary: 'Solid backend engineer candidate.',
  strengths: ['Clear experience descriptions'],
  weaknesses: ['Missing impact metrics'],
  standout_points: ['Sprinklr Intern'],
  red_flags: [],
  interview_readiness: 'good'
};

const mockGrammarResponse = {
  errors: [{ type: 'spelling', text: 'teh', suggestion: 'the' }],
  writing_suggestions: ['Fix spelling error "teh"'],
  tone: 'professional',
  tense_consistent: true,
  overall_writing_quality: 'good'
};

const mockSkillsResponse = {
  missing_skills: [{ skill: 'Redis', reason: 'High demand', priority: 'high' }],
  learning_roadmap: ['Learn Redis commands'],
  quick_wins: ['Add Redis to resume'],
  long_term_goals: ['Master system design']
};

const mockProjectsResponse = {
  project_suggestions: ['Describe project impact'],
  recommended_projects: ['Build a scaling caching layer'],
  quick_wins: ['Add GitHub link to your projects']
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

    // Run pipeline steps (Sprint 3 style)
    const analysis = analyzeResume(mockResume);
    const scores = calculateScore(analysis);
    const aiReport = await orchestrate(mockResume, analysis, scores);
    const result = buildFinalReport(mockResume, analysis, scores, aiReport);

    // Assert fetch was called exactly 5 times (one for each agent)
    assert(callCount === 5, `Expected fetch to be called 5 times, but got ${callCount}`);

    // Verify consolidated report fields
    assert(result.deterministicAnalysis !== undefined, 'Should include deterministicAnalysis');
    assert(result.aiAnalysis !== undefined, 'Should include aiAnalysis');

    // Verify deterministic parts driven by the Rule Engine
    assert(result.deterministicAnalysis.overall > 0, `Expected overall score > 0, got ${result.deterministicAnalysis.overall}`);
    assert(result.deterministicAnalysis.atsScore > 0, `Expected ATS score > 0, got ${result.deterministicAnalysis.atsScore}`);
    
    // Verify AI analysis parts mapped from sub-agent outputs
    assert(result.aiAnalysis.ats.scoreExplanation === 'Your resume has good formatting and details.', 'Should include ATS explanation');
    assert(result.aiAnalysis.recruiter.summary === 'Solid backend engineer candidate.', 'Should include recruiter summary');
    assert(result.aiAnalysis.grammar.writingQuality === 'good', 'Should include grammar writing quality');
    assert(result.aiAnalysis.skills.learningRoadmap[0] === 'Learn Redis commands', 'Should include skills roadmap');
    assert(result.aiAnalysis.projects.suggestions[0] === 'Describe project impact', 'Should include project suggestions');

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
