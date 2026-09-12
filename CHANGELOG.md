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

- Re-running a deploy that already released no longer mints a second tag for
  the same commit. The version counts the day's releases, so a re-run counted
  its own and produced a fresh number for a build that was already out. The
  version step now asks whether this exact commit already has a release and
  reuses it, leaving the tag step to skip as it already knows how to. (The
  earlier stray v2026.08.28 tags had a different cause — tagging before the
  smoke test — which was fixed by reordering those steps.)
- A release now clears the notes it published from `Unreleased`. Nothing did
  before, so the next release republished them as if they were new; it had to
  be fixed by hand on three releases running. Only the lines actually published
  are removed, so a note merged while the deploy is running survives.

- The deploy no longer fails when another repo pushes to `kube-setup` at the
  same moment. Every repo on the cluster deploys by pushing to that one shared
  repo, so its `main` can move between our clone and our push — which is what
  killed the first attempt at v2026.09.12.1. The manifest update now re-derives
  itself against fresh upstream and retries, and still fails loudly (before
  `kubectl apply`) if it cannot push at all.
