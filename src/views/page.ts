import { availability, bio, contact, engagements, links, projects, services } from '../content';
import { pageShell } from './layout';

export function renderPage(): string {
  const serviceCards = services
    .map(
      (s) => `
        <div class="card">
          <h3>${s.title}</h3>
          <p>${s.description}</p>
        </div>`
    )
    .join('');

  const engagementItems = engagements
    .map(
      (e) => `
        <div class="pill">
          <strong>${e.title}</strong>
          <span>${e.description}</span>
        </div>`
    )
    .join('');

  // The visible "GitHub" text is ambiguous out of context (three cards share
  // it), so its accessible name adds the project; it still starts with the
  // visible words, as WCAG's label-in-name asks. The site link's host name
  // already says where it goes.
  const projectCards = projects
    .map(
      (p) => `
        <div class="card">
          <h3>${p.title}</h3>
          <p>${p.description}</p>
          <div class="card-links">
            <a href="${p.repoUrl}" target="_blank" rel="noopener noreferrer" aria-label="GitHub: ${p.title} source">GitHub</a>
            <a href="${p.siteUrl}" target="_blank" rel="noopener noreferrer">${new URL(p.siteUrl).host}</a>
          </div>
        </div>`
    )
    .join('');

  const linkItems = links
    .map((l) => `<a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.label}</a>`)
    .join('');

  const body = `
    <header class="hero">
      <picture>
        <source srcset="/assets/skylar-192x192.webp" type="image/webp" />
        <img
          src="/assets/skylar-256x256.png"
          alt="Skylar Technology LLC logo"
          width="96"
          height="96"
        />
      </picture>
      <h1>Welcome to Skylar Technology LLC</h1>
      <p class="tagline">AI-native software engineering leadership &amp; transformation</p>
    </header>

    <section class="about">
      <h2>About</h2>
      ${bio.map((p) => `<p>${p}</p>`).join('')}
    </section>

    <section class="services">
      <h2>Services</h2>
      <div class="cards">${serviceCards}</div>
    </section>

    <section class="engagement">
      <h2>Engagement</h2>
      <div class="pills">${engagementItems}</div>
      <p class="availability">${availability}</p>
    </section>

    <section class="projects">
      <h2>Example Open Source Projects</h2>
      <div class="cards">${projectCards}</div>
    </section>

    <section class="contact">
      <h2>Contact</h2>
      <a class="contact-email" href="mailto:${contact.email}">${contact.email}</a>
      <div class="links">${linkItems}</div>
    </section>`;

  return pageShell('Skylar Technology LLC', body, {
    description: 'AI-native software engineering leadership &amp; transformation.',
    path: '/',
  });
}
