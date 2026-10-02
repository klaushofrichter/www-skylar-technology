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

- The server now shuts down when asked. In the container, node runs as
  process 1, which ignores any signal it has no handler for — so on every
  deploy the old pod ignored Kubernetes' stop signal, sat out the full
  300-second grace period, and was then force-killed. It now closes its
  connections and exits on SIGTERM; measured, a container stop went from the
  whole grace period to under a second.
- The browser test now checks that the legal pages' "back" link actually leads
  home. It previously clicked onward without looking, and since every page
  shares the same footer, a broken back link would still have passed.

