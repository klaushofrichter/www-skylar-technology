import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

describe('GET /assets/skylar-256x256.png', () => {
  it('serves the logo image', async () => {
    const app = createApp();
    const response = await request(app).get('/assets/skylar-256x256.png');

    expect(response.status).toBe(200);
    expect(response.type).toBe('image/png');
  });

  it('lets clients cache the logo for a year', async () => {
    const app = createApp();
    const response = await request(app).get('/assets/skylar-256x256.png');

    expect(response.headers['cache-control']).toContain('max-age=31536000');
    expect(response.headers['cache-control']).toContain('immutable');
  });
});

describe('GET /assets/skylar-192x192.webp', () => {
  it('serves the WebP logo used by the <picture> source', async () => {
    const app = createApp();
    const response = await request(app).get('/assets/skylar-192x192.webp');

    expect(response.status).toBe(200);
    expect(response.type).toBe('image/webp');
  });
});
