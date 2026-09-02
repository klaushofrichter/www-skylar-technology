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

## Development

```bash
npm install
npm test
npm run dev
```

`npm run dev` starts the server on `http://localhost:8080` via `tsx`
(no build step needed). `npm test` runs the Vitest/Supertest unit tests.

## End-to-end smoke test

`e2e/smoke.spec.ts` (Playwright) checks the home page and `/health` against
a running instance. Run it locally against `npm run dev`/Docker with
`BASE_URL=http://localhost:8080 npm run test:e2e`. The deploy workflow runs
it against `https://www.skylar.technology` right after every production
rollout, as the actual smoke test that gates a deploy as successful.

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
