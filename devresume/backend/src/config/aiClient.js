/**
 * aiClient.js
 *
 * Single place to call the AI model.
 * Swap provider here without touching any agent.
 *
 * Current provider: Google Gemini (free tier)
 * To switch providers: adjust `callAI()` implementation below.
 */

import { geminiModel } from './gemini.js';
import { extractJsonFromText } from '../utils/responseFormatter.js';

/**
 * callAI(systemPrompt, userPrompt)
 *
 * Sends a prompt to the AI and returns parsed JSON.
 *
 * @param {string} systemPrompt - Role/instructions for the AI
 * @param {string} userPrompt   - The actual content to analyze
 * @returns {object} Parsed JSON response from AI
 */
export const callAI = async (systemPrompt, userPrompt) => {
  // Combine system + user prompt for Gemini
  // (Gemini doesn't have a separate system role in basic API)
  const fullPrompt = `${systemPrompt}\n\n${userPrompt}\n\nRespond with valid JSON only.`;

  const result = await geminiModel.generateContent(fullPrompt);
  const text = result.response.text();

  return extractJsonFromText(text);
};
