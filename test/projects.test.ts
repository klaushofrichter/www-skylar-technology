import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { projects } from '../src/content';

const expected = [
  {
    title: 'Games',
    repoUrl: 'https://github.com/klaushofrichter/games-service',
    siteUrl: 'https://games.skylar.technology',
  },
  { title: 'Cams', repoUrl: 'https://github.com/klaushofrichter/cams', siteUrl: 'https://cams.skylar.technology' },
  { title: 'Art', repoUrl: 'https://github.com/klaushofrichter/art', siteUrl: 'https://art.klaushofrichter.net' },
];

function projectsSection(html: string): string {
  const match = html.match(/<section class="projects">[\s\S]*?<\/section>/);
  expect(match, 'projects section is rendered').not.toBeNull();
  return match![0];
}

describe('Example Open Source Projects', () => {
  it('lists the three projects, in order, with their repo and site URLs', () => {
    expect(projects.map(({ title, repoUrl, siteUrl }) => ({ title, repoUrl, siteUrl }))).toEqual(expected);
  });

  it('renders the section after Engagement and before Contact', async () => {
    const { text } = await request(createApp()).get('/');
    const engagement = text.indexOf('<section class="engagement">');
    const projectsAt = text.indexOf('<section class="projects">');
    const contact = text.indexOf('<section class="contact">');

    expect(engagement).toBeGreaterThan(-1);
    expect(projectsAt).toBeGreaterThan(engagement);
    expect(contact).toBeGreaterThan(projectsAt);
    expect(projectsSection(text)).toContain('<h2>Example Open Source Projects</h2>');
  });

  it('renders one card per project with a description', async () => {
    const section = projectsSection((await request(createApp()).get('/')).text);
    const cards = section.match(/<div class="card">[\s\S]*?<\/div>\s*<\/div>/g) ?? [];

    expect(cards).toHaveLength(3);
    cards.forEach((card, i) => {
      expect(card).toContain(`<h3>${expected[i].title}</h3>`);
      expect(card).toMatch(/<p>[^<]{10,}<\/p>/);
    });
  });

  it('links each card to its GitHub repo and its site, opening safely in a new tab', async () => {
    const section = projectsSection((await request(createApp()).get('/')).text);
    const anchors = section.match(/<a [^>]*>[^<]*<\/a>/g) ?? [];

    expect(anchors).toHaveLength(6);
    for (const a of anchors) {
      expect(a).toContain('target="_blank"');
      expect(a).toContain('rel="noopener noreferrer"');
    }
    for (const p of expected) {
      expect(section).toContain(`href="${p.repoUrl}"`);
      expect(section).toContain(`aria-label="GitHub: ${p.title} source">GitHub</a>`);
      expect(section).toContain(`href="${p.siteUrl}" target="_blank" rel="noopener noreferrer">${new URL(p.siteUrl).host}</a>`);
    }
  });
});
