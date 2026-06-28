/**
 * gemini.test.js  (now tests OpenRouter)
 *
 * Quick test to verify OpenRouter API is working.
 * Run with:  node test/gemini.test.js
 */

import dotenv from 'dotenv';
dotenv.config();

import { callAI } from '../src/config/aiClient.js';

console.log('\n🔍 Testing OpenRouter API connection...\n');

const key = process.env.OPENROUTER_API_KEY;

if (!key) {
  console.error('❌ OPENROUTER_API_KEY is not set in your .env file');
  process.exit(1);
}

console.log('✅ OPENROUTER_API_KEY found in .env\n');

try {
  console.log('📡 Sending test prompt via OpenRouter...');

  const result = await callAI(
    'You are a helpful assistant. Always respond with valid JSON only.',
    'Return a JSON object with one field: { "status": "ok" }'
  );

  console.log('✅ OpenRouter responded successfully!');
  console.log('   Response:', JSON.stringify(result));
  console.log('\n🎉 OpenRouter is working. You can now run npm run dev\n');

} catch (err) {
  console.error('❌ OpenRouter API call failed:', err.message);

  if (err.message.includes('401')) {
    console.error('\n   → Invalid API key. Check your OPENROUTER_API_KEY in .env');
  } else if (err.message.includes('429')) {
    console.error('\n   → Rate limit hit. Wait a minute and try again.');
  } else if (err.message.includes('402')) {
    console.error('\n   → No credits. Add credits at openrouter.ai/credits');
  }

  process.exit(1);
}
