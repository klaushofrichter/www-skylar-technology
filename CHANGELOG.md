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

- The site is now checked to kube-setup's "public web pages" baseline: every
  page is walked in four browsers (desktop Chrome and Firefox, an Android
  phone, an iPhone), audited for WCAG 2.2 AA accessibility, and scored by
  Lighthouse on a phone before each release, and again on the live site after
  each release and daily. No visible change: the site already met it.

