import express, { Express } from 'express';
import { healthRouter } from './routes/health';
import { indexRouter } from './routes/index';

export function createApp(): Express {
  const app = express();
  app.use(healthRouter);
  app.use(indexRouter);
  return app;
}
