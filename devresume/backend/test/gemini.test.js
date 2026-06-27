/**
 * gemini.test.js
 *
 * Quick test to verify Gemini API is working.
 * Run with:  node test/gemini.test.js
 *
 * Make sure GEMINI_API_KEY is set in your .env first.
 */

import dotenv from 'dotenv';
dotenv.config();

import { callAI } from '../src/config/aiClient.js';

console.log('\n🔍 Testing Gemini API connection...\n');

const key = process.env.GEMINI_API_KEY;

if (!key || key === 'your-gemini-api-key-here') {
  console.error('❌ GEMINI_API_KEY is not set in your .env file');
  console.error('   Get a free key at: https://aistudio.google.com');
  process.exit(1);
}

console.log('✅ GEMINI_API_KEY found in .env\n');

try {
  console.log('📡 Sending test prompt to Gemini...');

  const result = await callAI(
    'You are a helpful assistant. Always respond with valid JSON only.',
    'Return a JSON object with one field: { "status": "ok" }'
  );

  console.log('✅ Gemini responded successfully!');
  console.log('   Response:', JSON.stringify(result));
  console.log('\n🎉 Gemini is working. You can now run npm run dev\n');

} catch (err) {
  console.error('❌ Gemini API call failed:', err.message);

  if (err.message.includes('API_KEY_INVALID') || err.message.includes('400')) {
    console.error('\n   → Your API key is invalid. Double-check it at https://aistudio.google.com');
  } else if (err.message.includes('429')) {
    console.error('\n   → Rate limit hit. Wait a minute and try again.');
  } else if (err.message.includes('not set')) {
    console.error('\n   → Add GEMINI_API_KEY=your-key to your .env file');
  }

  process.exit(1);
}
