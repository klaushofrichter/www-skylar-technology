import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { repoUrl } from '../src/content';

describe('footer version link', () => {
  it('links the version string to the public repository', async () => {
    const app = createApp();
    const response = await request(app).get('/');

    expect(response.text).toContain(`href="${repoUrl}"`);
    // The version has to be inside the anchor, not merely somewhere on the
    // page - the point of the link is that the version itself is clickable.
    expect(response.text).toMatch(
      new RegExp(`<a[^>]*href="${repoUrl}"[^>]*>v[\\w.]+</a>`)
    );
  });

  it('renders the link on the legal pages too, which share the shell', async () => {
    const app = createApp();

    for (const path of ['/terms', '/privacy']) {
      const response = await request(app).get(path);
      expect(response.text).toContain(`href="${repoUrl}"`);
    }
  });
});
