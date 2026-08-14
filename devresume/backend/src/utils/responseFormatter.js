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


export const extractJsonFromText = (text) => {
  if (!text || typeof text !== 'string') {
    throw new Error('AI returned empty or non-string response');
  }

  const trimmed = text.trim();

  
  try {
    return JSON.parse(trimmed);
  } catch {
    
  }

  
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      
    }
  }

  
  
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
        
      }
    }
  }

  
  console.error('[extractJsonFromText] Could not parse AI response:');
  console.error(trimmed.substring(0, 500)); 

  throw new Error('Could not extract JSON from AI response');
};
