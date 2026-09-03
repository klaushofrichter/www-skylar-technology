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

- The Playwright suite now runs in PR checks, on GitHub's runners, instead of
  in the deploy — so a browser-level regression is caught before the merge
  rather than once it is already live. The deploy's smoke test keeps its curl
  checks and the evidence it writes into the release.

- Upgraded TypeScript 5 -> 7, which required migrating `tsconfig.json` off the
  removed `moduleResolution: node`.
- `test/` and `e2e/` are now typechecked. They never were: the build compiles
  `src` alone, and vitest and playwright strip types without checking them.

- Upgraded to Express 5, clearing the last three advisories (`qs`, reachable
  through `express` and `body-parser`). `npm audit` now reports zero
  vulnerabilities at every severity.
- Added coverage for routing fall-through — unknown paths, missing assets,
  `HEAD`, and bracketed query strings — none of which was tested before.

- Applied the dependency-security baseline: Dependabot alerts, security
  updates and `.github/dependabot.yml` (npm, github-actions, docker), plus
  `npm audit --audit-level=high` in the required `test` check.
- Fixed PR checks not running on pull requests to `main`, which is where
  Dependabot opens its PRs — dependency bumps were previously merged there
  untested.
- Upgraded vitest 2 -> 4, clearing a critical and a high advisory in the
  vite/esbuild chain.
- Standardised the runtime on Node 26 across both Dockerfile stages, all three
  workflows, and `@types/node` (which had drifted six majors behind).
- The production smoke test now runs *before* the release is tagged, and the
  release notes carry what it observed under "Verified at release".
