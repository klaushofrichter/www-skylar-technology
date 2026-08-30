import { availability, bio, contact, engagements, links, services } from '../content';
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

  const linkItems = links
    .map((l) => `<a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.label}</a>`)
    .join('');

  const body = `
    <header class="hero">
      <img src="/assets/skylar-256x256.png" alt="Skylar Technology LLC logo" />
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
