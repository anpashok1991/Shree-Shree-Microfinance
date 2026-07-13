import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { config } from './config';
import { connectDatabase } from './config/prisma';
import { logger } from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import routes from './routes';
import { seedAdmin } from './seeds/seed';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: config.cors.origin }));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', {
  stream: { write: (message: string) => logger.info(message.trim()) },
}));
app.use('/api', apiLimiter);

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Shree Shree Microfinance API is running', timestamp: new Date().toISOString() });
});

app.use('/api', routes);

app.use(errorHandler);

async function start() {
  try {
    await connectDatabase();
    await seedAdmin();
    
    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
      console.log(`\n  🏦 Shree Shree Microfinance API`);
      console.log(`  ➜ Server: http://localhost:${config.port}`);
      console.log(`  ➜ Health: http://localhost:${config.port}/api/health\n`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;
