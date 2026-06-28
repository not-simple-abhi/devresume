/**
 * aiClient.js
 *
 * Calls AI models via OpenRouter (https://openrouter.ai)
 * OpenRouter is OpenAI-API compatible — same request format,
 * works with 200+ models including free Gemini models.
 *
 * Model used: google/gemini-2.0-flash-exp:free (free tier on OpenRouter)
 */

import { extractJsonFromText } from '../utils/responseFormatter.js';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Free Gemma 4 31B model on OpenRouter
const MODEL = 'nvidia/nemotron-3-super-120b-a12b:free';

/**
 * callAI(systemPrompt, userPrompt)
 *
 * Sends a prompt to the AI via OpenRouter and returns parsed JSON.
 * Includes retry logic for 429 rate limit errors.
 *
 * @param {string} systemPrompt - Role/instructions for the AI
 * @param {string} userPrompt   - The actual content to analyze
 * @returns {object} Parsed JSON response
 */
export const callAI = async (systemPrompt, userPrompt, retries = 3) => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set in your .env file');
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://devresume.app',
        'X-Title': 'devresume',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userPrompt   },
        ],
        temperature: 0.3,
        max_tokens: 2048,
      }),
    });

    // If rate limited, wait and retry
    if (response.status === 429) {
      if (attempt < retries) {
        const waitSeconds = attempt * 15; // 15s, 30s, 45s
        console.log(`[AI] Rate limited. Waiting ${waitSeconds}s before retry ${attempt}/${retries}...`);
        await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));
        continue;
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error ${response.status}: ${errorText}`);
    }

    const json = await response.json();
    const text = json?.choices?.[0]?.message?.content ?? '';

    if (!text) {
      throw new Error('OpenRouter returned an empty response');
    }

    return extractJsonFromText(text);
  }

  throw new Error('AI request failed after multiple retries due to rate limiting. Try again in a minute.');
};
