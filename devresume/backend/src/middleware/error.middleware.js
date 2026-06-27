import multer from 'multer';

export const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err.message);

  // ── Multer errors (file upload issues) ───────────────────────
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.',
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Only PDF and DOCX files are allowed.',
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
  }

  // ── File type rejected by fileFilter ─────────────────────────
  if (err.message && err.message.includes('Only PDF and DOCX')) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // ── Resume parsing errors ─────────────────────────────────────
  if (err.message && err.message.includes('Could not extract readable text')) {
    return res.status(422).json({
      success: false,
      message: err.message,
    });
  }

  if (err.message && err.message.includes('Unsupported file format')) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // ── Prisma errors ─────────────────────────────────────────────
  if (err.code === 'P2002') {
    return res.status(409).json({ success: false, message: 'Resource already exists' });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }

  // ── Auth errors ───────────────────────────────────────────────
  if (err.statusCode === 401) {
    return res.status(401).json({ success: false, message: err.message });
  }

  if (err.statusCode === 404) {
    return res.status(404).json({ success: false, message: err.message });
  }

  // ── Generic fallback ──────────────────────────────────────────
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
