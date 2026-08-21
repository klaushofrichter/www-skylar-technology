# CLAUDE.md

Operational context for working in this repo.

## What this is

Skylar Technology LLC's homepage — a minimal Express/TypeScript app that
serves a single static welcome page ("Welcome to Skylar Technology LLC")
plus a `/health` check. No database, no persistent state, no external
calls. Deployed as a Knative Service on the `kube-setup`-managed k3s
cluster (see `../kube-setup/CLAUDE.md` for cluster-wide context).

## How we got here

Built 2026-08-20 by cloning the structure of `../www-klaushofrichter`
(Klaus Hofrichter's personal homepage, itself the template for this
repo/CI/cluster deployment pattern), trimmed down to just a static page:

1. **App scaffold** — copied `www-klaushofrichter`'s layout (Express +
   TypeScript, `tsc` build, Vitest/Supertest unit tests, Playwright
   `e2e/smoke.spec.ts`, multi-stage `Dockerfile`), stripped of everything
   specific to that site (no images, no cron refresh, no `cheerio`).
   Verified locally: unit tests, `npm run dev`, and a full Docker
   build/run before anything was pushed anywhere.
2. **Repo creation** — `gh repo create klaushofrichter/www-skylar-technology
   --public`, with an MIT `LICENSE` (matching `www-klaushofrichter`), `main`
   (unprotected) and `production` (protected: required `test` + `codeql`
   status checks, no force-push/deletion) branches, and the same three
   workflows (`build-push.yml`, `production-checks.yml`,
   `deploy-production.yml`).
3. **Cluster wiring, in two passes**:
   - First pass (same session, `kube-setup` repo): the user added the
     namespace, DomainMapping, and dedicated self-hosted-runner
     Deployment/RBAC/NetworkPolicy for `www-skylar-technology`, following
     the exact pattern already used for `www.klaushofrichter.net`. No
     `ksvc` existed yet since the app repo didn't exist yet either — the
     DomainMapping was `NotReady`/`ResolveFailed` and the runner pod was
     `CreateContainerConfigError` (missing `runner-pat` Secret), both
     expected at that point.
   - Second pass (once the app repo existed and the user supplied PATs
     in `.env`): fixed a naming mismatch in `deploy-production.yml`
     (originally scaffolded against a shorter `skylar` name; the actual
     kube-setup resources are all `www-skylar-technology`), added the
     initial `www-skylar-technology-ksvc.yaml` manifest to `kube-setup`
     (placeholder `:latest` tag so the deploy workflow's `sed` step has a
     line to update), applied it to the cluster, created the `runner-pat`
     Secret from the user-supplied PAT, and set the `KUBE_SETUP_DEPLOY_TOKEN`
     GitHub Actions secret on this repo. Opened a real PR `main` →
     `production`, let both required checks pass, merged it, and watched
     `deploy-production.yml` run end-to-end on the (now-healthy) in-cluster
     runner: build, push, manifest update, rollout, and the Playwright
     smoke test against `https://www.skylar.technology` — all green on
     the first real deploy.

`www.skylar.technology`'s DNS was moved off Squarespace to point at this
cluster as part of this work; the apex `skylar.technology` domain was
unaffected and is not this cluster's concern.

## Branches

- `main` — normal development, unprotected. Push here builds and pushes
  `ghcr.io/klaushofrichter/www-skylar-technology:latest` +
  `:<sha>` via `.github/workflows/build-push.yml`, but does **not** deploy.
- `production` — protected, PR-only from `main`, requires the `test` and
  `codeql` status checks. Merging here triggers
  `.github/workflows/deploy-production.yml` on the in-cluster self-hosted
  runner, which builds/pushes the image, updates the cluster manifest, and
  applies it.

## Cluster-side manifests

Live in `klaushofrichter/kube-setup`: `manifests/www-skylar-technology/`
(the Knative Service + DomainMapping for `www.skylar.technology`) and
`manifests/www-skylar-technology-runner/` (this repo's dedicated
self-hosted runner — its own namespace/ServiceAccount/RBAC).

## Secrets

- `runner-pat` — a Kubernetes Secret in the `www-skylar-technology-runner`
  namespace (key `token`), used by the self-hosted runner pod to register
  itself against this GitHub repo. Not in this repo; lives only in the
  cluster.
- `KUBE_SETUP_DEPLOY_TOKEN` — a GitHub Actions secret on this repo, used by
  `deploy-production.yml` to clone/push manifest updates into the private
  `kube-setup` repo.

Both were seeded from PATs the user placed in a local (gitignored) `.env`
in this repo — that file is a working scratch spot for tokens in transit,
not a secret store; nothing in it is ever committed.
