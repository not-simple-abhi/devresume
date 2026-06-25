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
  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) return JSON.parse(jsonMatch[1]);

    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) return JSON.parse(objectMatch[0]);

    throw new Error('Could not extract JSON from AI response');
  }
};
