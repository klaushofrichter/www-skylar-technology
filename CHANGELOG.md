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

- Updated `proxy-addr` (used by Express) from 2.0.7 to 2.0.8 for
  GHSA-jqcg-44mw-7w3h, a critical IP-spoofing advisory published
  2026-10-05. This site was not exposed: the flaw needs `trust proxy`
  configured with an IPv6-mapped subnet, and the app sets no `trust proxy`
  and never reads `req.ip`. The update clears the audit gate, which the
  advisory had turned red on `main`.

