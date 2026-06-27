/**
 * gemini.js
 *
 * Calls Google Gemini API using plain fetch — no SDK needed.
 * Uses the correct v1beta endpoint with gemini-1.5-flash (free tier).
 *
 * Free tier limits (as of 2025):
 *   - 15 requests/minute
 *   - 1 million tokens/day
 *   - No credit card required
 */

const MODEL = 'gemini-2.0-flash';

/**
 * generateContent(prompt)
 *
 * Sends a text prompt to Gemini and returns the response text.
 * Returns an object shaped like { response: { text: () => string } }
 * so aiClient.js works without changes.
 *
 * @param {string} prompt - The full prompt text
 * @returns {{ response: { text: () => string } }}
 */
export const geminiModel = {
  async generateContent(prompt) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in your .env file');
    }

    // Correct Gemini REST API endpoint
    const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    // Handle API errors
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${errorBody}`);
    }

    const json = await response.json();

    // Extract text from Gemini response structure
    // Shape: { candidates: [{ content: { parts: [{ text: "..." }] } }] }
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (!text) {
      throw new Error('Gemini returned an empty response');
    }

    // Return in the same shape aiClient.js expects
    return {
      response: {
        text: () => text,
      },
    };
  },
};
