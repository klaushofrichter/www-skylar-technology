# www-skylar-technology

[![Release](https://img.shields.io/github/v/release/klaushofrichter/www-skylar-technology?label=release&color=blue)](https://github.com/klaushofrichter/www-skylar-technology/releases)
[![Production PR checks](https://github.com/klaushofrichter/www-skylar-technology/actions/workflows/production-checks.yml/badge.svg)](https://github.com/klaushofrichter/www-skylar-technology/actions/workflows/production-checks.yml)
[![Build and publish image](https://github.com/klaushofrichter/www-skylar-technology/actions/workflows/build-push.yml/badge.svg)](https://github.com/klaushofrichter/www-skylar-technology/actions/workflows/build-push.yml)
[![Deploy production](https://github.com/klaushofrichter/www-skylar-technology/actions/workflows/deploy-production.yml/badge.svg)](https://github.com/klaushofrichter/www-skylar-technology/actions/workflows/deploy-production.yml)
[![Dependabot](https://img.shields.io/badge/dependabot-enabled-025E8C?logo=dependabot&logoColor=white)](https://github.com/klaushofrichter/www-skylar-technology/security/dependabot)

<!-- The release badge tracks the newest tag, which a successful production
     deploy cuts (see "Versioning and releases"). Since the smoke test now runs
     before the tag rather than after it, a tag means the build answered on the
     public URL - but GET /health is still what reports the running version.

     The three workflow badges are live status. The Dependabot one is static -
     GitHub publishes no endpoint for alert status on a repo, so it asserts
     that alerts, security updates, and .github/dependabot.yml are all in place
     rather than checking them. If Dependabot is ever turned off, this badge
     will not notice. -->

Homepage for Skylar Technology LLC, served at
[www.skylar.technology](https://www.skylar.technology) — a single static
welcome page ("Welcome to Skylar Technology LLC"), served by a minimal
Express/TypeScript app and deployed as a Knative Service on a self-hosted
k3s cluster.

It's intentionally the simplest possible version of this pattern: no
database, no persistent state, no external API calls — just a page and a
health check, built to prove out and reuse the same repo/CI/cluster
structure as [`www-klaushofrichter`](https://github.com/klaushofrichter/www-klaushofrichter),
Klaus Hofrichter's personal homepage.

## API

- `GET /` — the homepage: the Skylar Technology logo above "Welcome to
  Skylar Technology LLC".
- `GET /health` — returns `{"status": "ok", "service": "www-skylar-technology"}`
- `/assets/*` — static asset serving; `assets/skylar-256x256.png` is used
  both as the page's favicon and the logo shown on the homepage.
- Anything else — status 404 with the site's own "Page not found" page
  (`src/views/notFound.ts`, `noindex`) and a link home.

## Development

```bash
npm install
npm test
npm run dev
```

`npm run dev` starts the server on `http://localhost:8080` via `tsx`
(no build step needed). `npm test` runs the Vitest/Supertest unit tests.

## End-to-end tests (browsers, accessibility, speed)

The Playwright suite in `e2e/` follows kube-setup's "public web pages"
baseline (`docs/cluster-deployment-requirements.md`, §4). It runs every test
in four browsers: desktop Chromium, an Android phone (Pixel 7), an iPhone
(WebKit) and desktop Firefox.

- `e2e/site.spec.ts` walks the site: every page, every same-site link
  followed (new pages are covered automatically), the footer and back links,
  the project links opening a new tab, keyboard order with a visible focus
  ring, no sideways scrolling on a phone, and no console errors.
- `e2e/a11y.spec.ts` runs axe-core with the WCAG 2.2 AA tags on `/`, `/terms`,
  `/privacy` and the 404 page, zero violations, plus a contrast pass axe skips on its own
  (`e2e/helpers.ts`, `audit()`: text over a gradient is checked against each
  colour stop, and any other undecided contrast fails).
- `e2e/quality.spec.ts` checks layout shift (< 0.02), that the logo holds its
  box before it loads, the phone byte budget, and the pages without
  JavaScript.

`npm run build && npm run test:e2e` starts the built server, runs the suite
and stops it again; set `BASE_URL` to test something already running instead.

In CI (`e2e`, required by `production`) the suite runs against the Docker
image the commit builds, then `scripts/lighthouse-gate.sh` runs Lighthouse on
a phone profile three times: performance ≥ 90 on the median run;
accessibility, best practices and SEO 100 in every run. A test that passes
only on its retry fails the job (`failOnFlakyTests`).

After every production deploy and once a day, `.github/workflows/live-check.yml`
runs the read-only `@live` tests and the Lighthouse gate against
https://www.skylar.technology and checks that `/health` and the footer name
the newest release. It adds to the deploy's own `curl` smoke test of `/health`
and `/`; it does not replace it.

## Deployment

Builds and pushes to `ghcr.io/klaushofrichter/www-skylar-technology` via
GitHub Actions on push to `main` (`.github/workflows/build-push.yml`).
Deploying to production happens on merge to the `production` branch, via
an in-cluster self-hosted GitHub Actions runner
(`.github/workflows/deploy-production.yml`) — see `klaushofrichter/kube-setup`'s
`docs/self-hosted-runner-cicd-pattern.md` for the full design, and its
`manifests/www-skylar-technology/` and `manifests/www-skylar-technology-runner/`
for this service's cluster manifests (Knative Service, DomainMapping,
dedicated runner namespace/RBAC).

See `CLAUDE.md` for the fuller history of how this repo and its cluster
wiring came together.
