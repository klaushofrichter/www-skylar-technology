import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

describe('GET /terms', () => {
  it('returns 200 with the terms of service page', async () => {
    const app = createApp();
    const response = await request(app).get('/terms');

    expect(response.status).toBe(200);
    expect(response.type).toBe('text/html');
    expect(response.text).toContain('Terms of Service');
  });
});

describe('GET /privacy', () => {
  it('returns 200 with the privacy policy page', async () => {
    const app = createApp();
    const response = await request(app).get('/privacy');

    expect(response.status).toBe(200);
    expect(response.type).toBe('text/html');
    expect(response.text).toContain('Privacy Policy');
  });
});
