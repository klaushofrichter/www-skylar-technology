import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

describe('GET /', () => {
  it('returns 200 with the welcome page', async () => {
    const app = createApp();
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.type).toBe('text/html');
    expect(response.text).toContain('Welcome to Skylar Technology LLC');
    expect(response.text).toContain('/assets/skylar-256x256.png');
  });

  it('offers the WebP logo ahead of the PNG fallback', async () => {
    const app = createApp();
    const response = await request(app).get('/');

    expect(response.text).toContain('srcset="/assets/skylar-192x192.webp"');
    expect(response.text).toContain('type="image/webp"');
  });

  it('gzips the page when the client accepts it', async () => {
    const app = createApp();
    const response = await request(app)
      .get('/')
      .set('Accept-Encoding', 'gzip')
      .buffer(true);

    expect(response.headers['content-encoding']).toBe('gzip');
  });

  it('does not advertise the server stack', async () => {
    const app = createApp();
    const response = await request(app).get('/');

    expect(response.headers['x-powered-by']).toBeUndefined();
  });
});
