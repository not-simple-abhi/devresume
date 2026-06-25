import OpenAI from 'openai';
import { config } from './env.js';

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

export default openai;
