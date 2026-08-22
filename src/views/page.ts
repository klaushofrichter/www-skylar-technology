import { availability, bio, contact, engagements, links, services } from '../content';

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

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Skylar Technology LLC</title>
  <link rel="icon" type="image/png" href="/assets/skylar-256x256.png" />
  <style>
    :root {
      --bg: #0f172a;
      --bg-card: #17223a;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #5eead4;
      --border: #263349;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
    }
    main {
      max-width: 1440px;
      margin: 0 auto;
      padding: 4rem 1.5rem 3rem;
    }
    header.hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 3.5rem;
    }
    header.hero img {
      width: 96px;
      height: 96px;
      margin-bottom: 1.25rem;
    }
    h1 {
      font-size: 1.9rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
    }
    .tagline {
      color: var(--text-muted);
      font-size: 1.05rem;
      margin: 0;
    }
    section {
      margin-bottom: 3rem;
    }
    section h2 {
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--accent);
      margin: 0 0 1.1rem;
    }
    .about p {
      color: #e2e8f0;
      margin: 0 0 0.9rem;
    }
    .about p:last-child { margin-bottom: 0; }
    .cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.9rem;
    }
    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1.1rem;
    }
    .card h3 {
      font-size: 0.95rem;
      margin: 0 0 0.4rem;
    }
    .card p {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin: 0;
    }
    .pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.7rem;
      margin-bottom: 0.9rem;
    }
    .pill {
      flex: 1 1 160px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 0.9rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .pill strong { font-size: 0.9rem; }
    .pill span { font-size: 0.8rem; color: var(--text-muted); }
    .availability {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin: 0;
    }
    .contact-email {
      font-size: 1.05rem;
      color: var(--text);
      text-decoration: none;
      border-bottom: 1px solid var(--accent);
    }
    .contact-email:hover { color: var(--accent); }
    .links {
      display: flex;
      gap: 1.25rem;
      margin-top: 0.9rem;
    }
    .links a {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.9rem;
    }
    .links a:hover { color: var(--accent); }
    footer {
      text-align: center;
      color: var(--text-muted);
      font-size: 0.78rem;
      padding: 0 1.5rem 2.5rem;
    }
    @media (max-width: 560px) {
      .cards { grid-template-columns: 1fr; }
      .pills { flex-direction: column; }
    }
  </style>
</head>
<body>
  <main>
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
    </section>
  </main>
  <footer>Skylar Technology LLC &middot; a registered LLC in the State of Texas</footer>
</body>
</html>
`;
}
