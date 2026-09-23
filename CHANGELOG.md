# Changelog

Versions are **generated at deploy time**, not carried in the sources: a merge
into `production` is tagged `vYYYY.MM.DD.N`, where `N` counts that day's
releases. Nothing needs bumping and nothing can be forgotten.

Each release's notes are assembled from the commits since the previous one,
preceded by anything curated under Unreleased below. The full history lives on
the [releases page](https://github.com/klaushofrichter/www-skylar-technology/releases);
this file is where notes are written *before* a release, not an archive of them.

<!-- Anything written under Unreleased is prepended to the next release's
     notes. Keep prose out of it unless you mean it to be published. -->
## [Unreleased]

- Node is now pinned to an exact release (26.10.0) in both Dockerfile stages,
  instead of the floating `node:26-alpine`. The floating tag let every build
  pick up whatever Node 26 was newest that day — v26.8.2 became v26.10.0 in
  v2026.09.23.1 without appearing in any change. A new Node release now arrives
  as a Dependabot PR, and CI reads the version from the Dockerfile, so that PR
  is tested on exactly the Node it will ship.

