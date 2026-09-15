import assert from "node:assert/strict"
import test from "node:test"

import { readJson, readRoot } from "./lib/source.mjs"

const repositoryUrl = "https://github.com/mivabyte/ui"

test("published package metadata points at the canonical repository", async () => {
  const packageJson = await readJson("package.json")

  assert.equal(packageJson.repository?.url, `git+${repositoryUrl}.git`)
  assert.equal(packageJson.bugs?.url, `${repositoryUrl}/issues`)
  assert.equal(packageJson.homepage, `${repositoryUrl}#readme`)
})

test("release identity follows the current GitHub repository", async () => {
  const [workflow, releaseDocs] = await Promise.all([
    readRoot(".github/workflows/release.yml"),
    readRoot("docs/maintainers/releases.md"),
  ])

  assert.match(workflow, /GITHUB_SERVER_URL/)
  assert.match(workflow, /GITHUB_REPOSITORY/)
  assert.doesNotMatch(workflow, /mivabyte\/mivabyte-ui/)
  assert.match(releaseDocs, /mivabyte\/ui/)
  assert.doesNotMatch(releaseDocs, /mivabyte\/mivabyte-ui/)
})
