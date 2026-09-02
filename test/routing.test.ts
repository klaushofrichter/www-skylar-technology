import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

// Default-handler behaviour rather than behaviour of our own routes. None of
// this was covered when the repo moved from Express 4 to 5, which is exactly
// the kind of thing a major changes quietly: every route here is a literal
// path, so path-to-regexp v8 could not bite, but the fall-through cases could.
describe('routing fall-through', () => {
  it('404s an unknown path without serving the home page', async () => {
    const app = createApp();
    const response = await request(app).get('/nope');

    expect(response.status).toBe(404);
    // A catch-all that accidentally matched everything would return the real
    // page with a 404 status, which the status assertion alone would miss.
    expect(response.text).not.toContain('Welcome to Skylar Technology LLC');
  });

  it('404s a missing asset rather than falling through to the page', async () => {
    const app = createApp();
    const response = await request(app).get('/assets/does-not-exist.png');

    expect(response.status).toBe(404);
    expect(response.text).not.toContain('Welcome to Skylar Technology LLC');
  });

  it('404s a method with no route, rather than erroring', async () => {
    const app = createApp();
    const response = await request(app).post('/');

    expect(response.status).toBe(404);
  });

  it('answers HEAD / with the same headers as GET and no body', async () => {
    const app = createApp();
    const response = await request(app).head('/');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
    expect(response.text).toBeUndefined();
  });

  it('serves the page unharmed by bracketed query strings', async () => {
    // qs parses these; the advisories that pushed this repo to Express 5 were
    // both in that parser, so it is worth a shot that actually exercises it.
    const app = createApp();
    const response = await request(app).get('/?a[]=1&a[]=2&b[c][d]=3');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Welcome to Skylar Technology LLC');
  });
});
