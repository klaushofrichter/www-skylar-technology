import { Router, Request, Response } from 'express';
import { renderPrivacyPage, renderTermsPage } from '../views/legal';

export const legalRouter = Router();

legalRouter.get('/terms', (_req: Request, res: Response) => {
  res.status(200).type('html').send(renderTermsPage());
});

legalRouter.get('/privacy', (_req: Request, res: Response) => {
  res.status(200).type('html').send(renderPrivacyPage());
});
