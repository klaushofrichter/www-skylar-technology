# Removes from CHANGELOG.md's "## [Unreleased]" section the lines a release
# published, and nothing else. main can gain a new note while a deploy is
# running, and clearing the whole section would delete it before it was ever
# released. Blank lines are tidied so the section stays readable.
#
#   awk -f scripts/changelog-clear-published.awk published.md CHANGELOG.md
#
# published.md is changelog-unreleased.awk's output at release time.
# Run by deploy-production.yml; tested by test/changelog.test.ts.
function flush(   i, blank) {
  print ""
  blank = 0; emitted = 0
  for (i = 0; i < n; i++) {
    if (length(buf[i]) == 0) { if (emitted) blank = 1; continue }
    if (blank) print ""
    print buf[i]
    emitted = 1; blank = 0
  }
}
NR == FNR { if (length($0)) published[$0] = 1; next }
!inside && /^## \[Unreleased\]/ { print; inside = 1; n = 0; next }
inside && /^## \[/ { flush(); if (emitted) print ""; inside = 0; print; next }
inside { if (!($0 in published)) buf[n++] = $0; next }
{ print }
END { if (inside) flush() }
