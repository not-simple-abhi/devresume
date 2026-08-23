import rateLimit from 'express-rate-limit';

// ─── Shared error formatter ───────────────────────────────────────────────────
const handler = (req, res, _next, options) => {
  res.status(options.statusCode).json({
    success: false,
    message: options.message,
    retryAfter: Math.ceil(options.windowMs / 1000 / 60), // minutes
  });
};

// ─── Global fallback — every route ───────────────────────────────────────────
// 200 requests per 15 minutes per IP — stops basic flood attacks
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,   // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
  handler,
});

// ─── Auth routes — brute force protection ────────────────────────────────────
// 10 attempts per 15 minutes per IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts from this IP. Please wait 15 minutes before trying again.',
  handler,
  skipSuccessfulRequests: true, // only count failed attempts
});

// ─── Resume analysis — most expensive endpoint ───────────────────────────────
// 5 analyses per hour per IP (guest or logged-in)
// Protects OpenRouter credits and DB writes
export const analyzeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Analysis limit reached. You can analyze up to 5 resumes per hour. Please try again later.',
  handler,
});

// ─── Company analysis — also hits AI ─────────────────────────────────────────
// 10 requests per hour per IP
export const companyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Company analysis limit reached. You can run up to 10 analyses per hour.',
  handler,
});

// ─── Resume parse — lightweight but file upload ───────────────────────────────
// 20 requests per 15 minutes per IP
export const parseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many parse requests. Please slow down.',
  handler,
});
