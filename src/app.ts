import compression from 'compression';
import express, { Express, Request, Response } from 'express';
import path from 'path';
import { healthRouter } from './routes/health';
import { indexRouter } from './routes/index';
import { legalRouter } from './routes/legal';
import { renderNotFound } from './views/notFound';

/** One year, in milliseconds — the max-age for hashed/versioned static assets. */
const ASSET_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

export function createApp(): Express {
  const app = express();
  // Nothing good comes of advertising the server stack.
  app.disable('x-powered-by');
  // The pages are server-rendered HTML with inlined CSS, so gzip is the single
  // biggest transfer win available (~8 KiB -> ~2.5 KiB on the home page).
  app.use(compression());
  app.use(healthRouter);
  app.use(
    '/assets',
    express.static(path.join(__dirname, '..', 'assets'), {
      // Asset filenames carry their dimensions and are replaced, never mutated,
      // so repeat visitors can hold them without revalidating.
      maxAge: ASSET_MAX_AGE_MS,
      immutable: true,
    })
  );
  app.use(legalRouter);
  app.use(indexRouter);
  // Last: anything no route above answered (a missing asset included) gets
  // the site's own 404 page rather than Express's bare "Cannot GET".
  app.use((_req: Request, res: Response) => {
    res.status(404).type('html').send(renderNotFound());
  });
  return app;
}
