# CLAUDE.md

Operational context for working in this repo.

## What this is

Skylar Technology LLC's homepage — a minimal Express/TypeScript app that
serves a single static welcome page. Modeled on `../www-klaushofrichter`'s
structure and deploy pipeline, intended to run as a Knative Service on the
`kube-setup`-managed k3s cluster (see `../kube-setup/CLAUDE.md` for
cluster-wide context).

## Branches

- `main` — normal development, unprotected. Push here builds and pushes
  `ghcr.io/klaushofrichter/www-skylar-technology:latest` +
  `:<sha>` via `.github/workflows/build-push.yml`, but does **not** deploy.
- `production` — protected, PR-only from `main`. Merging here triggers
  `.github/workflows/deploy-production.yml` on an in-cluster self-hosted
  runner, which builds/pushes the image, updates the cluster manifest, and
  applies it.

## Cluster-side manifests

Live in `klaushofrichter/kube-setup`: `manifests/www-skylar-technology/`
(the Knative Service + DomainMapping for `www.skylar.technology`) and
`manifests/www-skylar-technology-runner/` (this repo's dedicated
self-hosted runner — its own namespace/ServiceAccount/RBAC).
