import { pageShell } from './layout';

// The site's own 404, in place of Express's bare "Cannot GET" (which had no
// lang, no styling and no way back): it looks like the legal pages, in the
// same shell and footer, and offers a way home. Modelled on
// www-klaushofrichter's src/views/notFound.ts.
export function renderNotFound(): string {
  const body = `
    <a class="back-link" href="/">&larr; Back to Skylar Technology LLC</a>
    <section class="legal">
      <h1>Page not found</h1>
      <p>There is nothing at this address.</p>
    </section>`;

  return pageShell('Page not found — Skylar Technology LLC', body, {
    description: 'There is nothing at this address.',
    path: '/',
    noindex: true,
  });
}
