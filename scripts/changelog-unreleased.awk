# Prints the notes curated under "## [Unreleased]" in CHANGELOG.md, without
# blank lines: the text the release step prepends to a release's notes, and
# exactly the lines changelog-clear-published.awk later removes again.
#
#   awk -f scripts/changelog-unreleased.awk CHANGELOG.md
#
# Run by deploy-production.yml; tested by test/changelog.test.ts.
/^## \[Unreleased\]/ { grab = 1; next }
grab && /^## \[/ { exit }
grab && !/^[[:space:]]*$/ { print }
