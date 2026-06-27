import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { config } from './config/env.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import reviewRoutes from './routes/review.routes.js';
import compareRoutes from './routes/compare.routes.js';
import companyRoutes from './routes/company.routes.js';
import resumeRoutes from './routes/resume.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure temp upload directory exists
if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

app.get('/', (req, res) => {
  res.json({
    message: 'devresume API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      resume: '/api/resume',
      review: '/api/review',
      compare: '/api/compare',
      company: '/api/company',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/company', companyRoutes);

app.use(errorMiddleware);

export default app;
