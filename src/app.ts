import express, { Express } from 'express';
import path from 'path';
import { healthRouter } from './routes/health';
import { indexRouter } from './routes/index';
import { legalRouter } from './routes/legal';

export function createApp(): Express {
  const app = express();
  app.use(healthRouter);
  app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));
  app.use(legalRouter);
  app.use(indexRouter);
  return app;
}
