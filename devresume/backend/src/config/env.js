import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  geminiApiKey: process.env.GEMINI_API_KEY,
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'),
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
};

// GEMINI_API_KEY is optional at startup; agents will error if it's missing when used.
const requiredEnvVars = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'DATABASE_URL'];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});
