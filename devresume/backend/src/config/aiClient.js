import { extractJsonFromText } from '../utils/responseFormatter.js';

// ─── Provider configs ─────────────────────────────────────────────────────────
const PROVIDERS = [
  {
    name:    'Groq',
    url:     'https://api.groq.com/openai/v1/chat/completions',
    apiKey:  () => process.env.GROQ_API_KEY,
    model:   'openai/gpt-oss-120b',
    maxTokens: 4096,
  },
  {
    name:    'OpenRouter (Nvidia Nemotron Ultra)',
    url:     'https://openrouter.ai/api/v1/chat/completions',
    apiKey:  () => process.env.OPENROUTER_API_KEY,
    model:   'nvidia/nemotron-3-ultra-550b-a55b',
    maxTokens: 4096,
    extraHeaders: {
      'HTTP-Referer': 'https://devresume.app',
      'X-Title':      'devresume',
    },
  },
];

// ─── Single provider call (no retry) ─────────────────────────────────────────
async function callProvider(provider, systemPrompt, userPrompt) {
  const apiKey = provider.apiKey();
  if (!apiKey) throw new Error(`${provider.name}: API key not set in .env`);

  const response = await fetch(provider.url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type':  'application/json',
      ...(provider.extraHeaders ?? {}),
    },
    body: JSON.stringify({
      model:       provider.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt   },
      ],
      temperature: 0.3,
      max_tokens:  provider.maxTokens,
    }),
  });

  // 429 = rate limited, 401/403 = key issue — both should trigger fallback
  if (response.status === 429 || response.status === 401 || response.status === 403) {
    const body = await response.text();
    const err  = new Error(`${provider.name} returned ${response.status}: ${body}`);
    err.shouldFallback = true;
    throw err;
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${provider.name} API error ${response.status}: ${body}`);
  }

  const json = await response.json();
  const text = json?.choices?.[0]?.message?.content ?? '';

  if (!text) throw new Error(`${provider.name} returned an empty response`);

  return extractJsonFromText(text);
}

// ─── Main export — tries Groq first, falls back to OpenRouter ─────────────────
export const callAI = async (systemPrompt, userPrompt, retries = 2) => {
  for (const provider of PROVIDERS) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`[AI] Using ${provider.name} (attempt ${attempt}/${retries})...`);
        const result = await callProvider(provider, systemPrompt, userPrompt);
        console.log(`[AI] ✓ ${provider.name} succeeded`);
        return result;
      } catch (err) {
        const isLast = attempt === retries;

        if (err.shouldFallback) {
          // Rate limit / auth error — no point retrying same provider
          console.warn(`[AI] ${provider.name} limit/auth error — switching provider`);
          break;
        }

        if (isLast) {
          console.warn(`[AI] ${provider.name} failed after ${retries} attempts: ${err.message}`);
          break; // try next provider
        }

        // Transient error — wait and retry same provider
        const wait = attempt * 10;
        console.warn(`[AI] ${provider.name} error, retrying in ${wait}s...`);
        await new Promise((r) => setTimeout(r, wait * 1000));
      }
    }
  }

  throw new Error('All AI providers failed. Please try again in a moment.');
};
