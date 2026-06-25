import mammoth from 'mammoth';

export const parseDOCX = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return { text: result.value, messages: result.messages };
  } catch (error) {
    throw new Error(`Failed to parse DOCX: ${error.message}`);
  }
};
