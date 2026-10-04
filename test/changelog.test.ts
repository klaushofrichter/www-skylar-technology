import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

// The release step runs these awk scripts against CHANGELOG.md on the deploy
// runner. Before they were files they lived inline in deploy-production.yml,
// where the only way to exercise them was a real production release - and
// published notes were republished on three releases running before the
// clearing step existed.
const scripts = path.join(__dirname, '..', 'scripts');
const dir = mkdtempSync(path.join(tmpdir(), 'changelog-'));
let n = 0;
function file(text: string): string {
  const p = path.join(dir, `${n++}.md`);
  writeFileSync(p, text);
  return p;
}
function awk(script: string, ...files: string[]): string {
  return execFileSync('awk', ['-f', path.join(scripts, script), ...files], { encoding: 'utf8' });
}
const unreleased = (changelog: string) => awk('changelog-unreleased.awk', file(changelog));
const clear = (published: string, changelog: string) =>
  awk('changelog-clear-published.awk', file(published), file(changelog));

const CHANGELOG = `# Changelog

<!-- a comment that is not a note -->
## [Unreleased]

- First note,
  wrapped onto a second line.

- Second note.

## [v1.0.0]

- An archived note.
`;

describe('changelog-unreleased.awk', () => {
  it('prints the Unreleased notes without blank lines, and stops at the next section', () => {
    expect(unreleased(CHANGELOG)).toBe(
      '- First note,\n  wrapped onto a second line.\n- Second note.\n'
    );
  });

  it('treats whitespace-only lines as blank', () => {
    expect(unreleased('## [Unreleased]\n\n- a\n   \n\t\n- b\n')).toBe('- a\n- b\n');
  });

  it('prints nothing for an empty section or a missing one', () => {
    expect(unreleased('# C\n\n## [Unreleased]\n')).toBe('');
    expect(unreleased('# C\n\n- not under Unreleased\n')).toBe('');
  });
});

describe('changelog-clear-published.awk', () => {
  it('empties the section once everything in it is published, keeping what follows', () => {
    const published = unreleased(CHANGELOG);
    expect(clear(published, CHANGELOG)).toBe(`# Changelog

<!-- a comment that is not a note -->
## [Unreleased]

## [v1.0.0]

- An archived note.
`);
  });

  it('keeps a note merged while the deploy was running', () => {
    const published = unreleased(CHANGELOG);
    const mainNow = CHANGELOG.replace('- Second note.\n', '- Second note.\n\n- Merged mid-deploy.\n');
    expect(clear(published, mainNow)).toContain('## [Unreleased]\n\n- Merged mid-deploy.\n\n## [v1.0.0]');
    expect(clear(published, mainNow)).not.toContain('First note');
  });

  it('is idempotent, so a retried push re-derives the same file', () => {
    const published = unreleased(CHANGELOG);
    const once = clear(published, CHANGELOG);
    expect(clear(published, once)).toBe(once);
  });

  it('leaves an Unreleased section at the end of the file tidy', () => {
    const changelog = '# C\n\n## [Unreleased]\n\n- shipped\n\n- not yet\n';
    expect(clear('- shipped\n', changelog)).toBe('# C\n\n## [Unreleased]\n\n- not yet\n');
    expect(clear('- shipped\n- not yet\n', changelog)).toBe('# C\n\n## [Unreleased]\n\n');
  });
});
