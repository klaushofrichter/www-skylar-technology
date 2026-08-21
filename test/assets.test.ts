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
});
