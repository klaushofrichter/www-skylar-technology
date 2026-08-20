# www-skylar-technology

Homepage for Skylar Technology LLC, served at
[www.skylar.technology](https://www.skylar.technology) — a single static
welcome page.

## API

- `GET /` — the homepage: "Welcome to Skylar Technology LLC".
- `GET /health` — returns `{"status": "ok", "service": "www-skylar-technology"}`

## Development

```bash
npm install
npm test
npm run dev
```

## End-to-end smoke test

`e2e/smoke.spec.ts` (Playwright) checks the home page and `/health` against
a running instance. Run it locally against `npm run dev`/Docker with
`BASE_URL=http://localhost:8080 npm run test:e2e`. The deploy workflow runs
it against `https://www.skylar.technology` right after every production
rollout, as the actual smoke test that gates a deploy as successful.

## Deployment

Builds and pushes to `ghcr.io/klaushofrichter/www-skylar-technology` via
GitHub Actions on push to `main`. Deploying to production happens on merge
to the `production` branch, via an in-cluster self-hosted GitHub Actions
runner — see `klaushofrichter/kube-setup`'s
`docs/self-hosted-runner-cicd-pattern.md` for the full design, and its
`manifests/www-skylar-technology/` and `manifests/www-skylar-technology-runner/`
for this service's cluster manifests.
