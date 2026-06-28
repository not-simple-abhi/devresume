export const formatSuccessResponse = (data, message = 'Success') => ({
  success: true,
  message,
  data,
});

export const formatErrorResponse = (message, errors = null) => ({
  success: false,
  message,
  ...(errors && { errors }),
});

/**
 * extractJsonFromText(text)
 *
 * Tries to parse JSON from an AI response that may include
 * markdown fences, extra explanation text, etc.
 *
 * Handles:
 *   - Pure JSON strings
 *   - ```json ... ``` fenced blocks
 *   - JSON embedded somewhere in a text response
 */
export const extractJsonFromText = (text) => {
  if (!text || typeof text !== 'string') {
    throw new Error('AI returned empty or non-string response');
  }

  const trimmed = text.trim();

  // 1. Try direct parse first (cleanest case)
  try {
    return JSON.parse(trimmed);
  } catch {
    // not pure JSON, keep trying
  }

  // 2. Extract from ```json ... ``` or ``` ... ``` fenced block
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      // fence content wasn't valid JSON, keep trying
    }
  }

  // 3. Find the outermost { ... } using bracket counting
  //    This correctly handles nested objects unlike a simple regex
  const firstBrace = trimmed.indexOf('{');
  if (firstBrace !== -1) {
    let depth = 0;
    let lastClose = -1;

    for (let i = firstBrace; i < trimmed.length; i++) {
      if (trimmed[i] === '{') depth++;
      else if (trimmed[i] === '}') {
        depth--;
        if (depth === 0) {
          lastClose = i;
          break;
        }
      }
    }

    if (lastClose !== -1) {
      try {
        return JSON.parse(trimmed.substring(firstBrace, lastClose + 1));
      } catch {
        // still couldn't parse
      }
    }
  }

  // 4. Nothing worked — log the response for debugging
  console.error('[extractJsonFromText] Could not parse AI response:');
  console.error(trimmed.substring(0, 500)); // log first 500 chars

  throw new Error('Could not extract JSON from AI response');
};
