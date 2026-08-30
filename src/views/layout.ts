import { siteUrl } from '../content';
import { appVersion } from '../version';

export interface PageMeta {
  description: string;
  /** Site-relative path, e.g. "/" or "/terms", used to build the canonical/og:url. */
  path: string;
}

export function pageShell(title: string, bodyHtml: string, meta: PageMeta): string {
  const url = siteUrl + meta.path;
  const imageUrl = `${siteUrl}/assets/skylar-256x256.png`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${meta.description}" />
  <link rel="canonical" href="${url}" />
  <link rel="icon" type="image/png" href="/assets/skylar-256x256.png" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Skylar Technology LLC" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${meta.description}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="256" />
  <meta property="og:image:height" content="256" />

  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${meta.description}" />
  <meta name="twitter:image" content="${imageUrl}" />
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
    header.hero picture {
      display: block;
      margin-bottom: 1.25rem;
    }
    header.hero img {
      width: 96px;
      height: 96px;
      display: block;
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
    .legal h2 {
      text-transform: none;
      letter-spacing: normal;
      font-size: 1.2rem;
      color: var(--text);
      margin-top: 2rem;
    }
    .legal h2:first-of-type { margin-top: 0; }
    .legal p, .legal li {
      color: #e2e8f0;
      font-size: 0.95rem;
    }
    .legal ul { padding-left: 1.2rem; }
    .legal .updated {
      color: var(--text-muted);
      font-size: 0.85rem;
      margin-bottom: 2.5rem;
    }
    .back-link {
      display: inline-block;
      margin-bottom: 2.5rem;
      color: var(--accent);
      text-decoration: none;
      font-size: 0.9rem;
    }
    .back-link:hover { text-decoration: underline; }
    footer {
      text-align: center;
      color: var(--text-muted);
      font-size: 0.78rem;
      padding: 0 1.5rem 2.5rem;
    }
    footer a {
      color: var(--text-muted);
      text-decoration: none;
    }
    footer a:hover { color: var(--accent); }
    @media (max-width: 560px) {
      .cards { grid-template-columns: 1fr; }
      .pills { flex-direction: column; }
    }
  </style>
</head>
<body>
  <main>
    ${bodyHtml}
  </main>
  <footer>
    Skylar Technology LLC &middot; a registered LLC in the State of Texas &middot; v${appVersion()}
    &middot; <a href="/terms">Terms of Service</a> &middot; <a href="/privacy">Privacy Policy</a>
  </footer>
</body>
</html>
`;
}
