import assert from "node:assert/strict"
import test from "node:test"

import { readJson, readRoot } from "./lib/source.mjs"

const workflow = await readRoot(".github/workflows/release.yml")
const packageJson = await readJson("package.json")

test("release workflow is manual, authenticated, and GitHub-hosted", () => {
  assert.match(workflow, /on:\n  workflow_dispatch:/)
  assert.doesNotMatch(workflow, /\n  push:/)
  assert.doesNotMatch(workflow, /\n  pull_request:/)

  assert.match(workflow, /contents: read/)
  assert.match(workflow, /id-token: write/)
  assert.match(workflow, /runs-on: ubuntu-latest/)
  assert.match(workflow, /environment: npm/)
  assert.match(workflow, /persist-credentials: false/)
  assert.match(workflow, /package-manager-cache: false/)

  assert.match(workflow, /npm install --global npm@11\.18\.0/)
  assert.match(workflow, /npm ci --ignore-scripts/)
  assert.match(workflow, /npm publish --access public --tag/)
  // The publish gate is still the full verify pipeline. It runs through a
  // wrapper so an inherited `npm_config_dry_run` - which `npm publish --dry-run`
  // exports into this lifecycle script - cannot make the nested npm calls in
  // publint and attw skip writing their tarballs.
  assert.equal(
    packageJson.scripts?.prepublishOnly,
    "node scripts/without-dry-run.mjs npm run verify"
  )
  assert.equal(packageJson.scripts?.["release:publish"], undefined)
  assert.doesNotMatch(workflow, /run: npm run verify/)

  assert.doesNotMatch(workflow, /NODE_AUTH_TOKEN/)
  assert.doesNotMatch(workflow, /secrets\.NPM_TOKEN/)
})

test("release workflow requires provenance-capable repository visibility", () => {
  assert.match(workflow, /github\.event\.repository\.visibility/)
  assert.match(workflow, /REPOSITORY_VISIBILITY !== "public"/)
  assert.match(workflow, /requires npm provenance/)
})

test("release workflow reserves the matching Git tag before publishing", () => {
  const tagCheckIndex = workflow.indexOf("git ls-remote --tags origin")
  const publishIndex = workflow.indexOf(
    'run: npm publish --access public --tag "$NPM_TAG"'
  )

  assert.ok(tagCheckIndex >= 0, "release workflow must check the Git tag")
  assert.ok(
    tagCheckIndex < publishIndex,
    "Git tag conflicts must fail before npm publish"
  )
  assert.match(
    workflow,
    /release versions must map to one immutable source revision/
  )
})

// The probe argument must arrive through `env:` rather than `${{ }}` expansion
// inside `run:`, because an interpolated `inputs.version` is shell code.
const PROBE_STEP = 'node scripts/check-registry-release.mjs "$VERSION"'

test("release workflow verifies the exact published version after publish", () => {
  const publishIndex = workflow.indexOf(
    'run: npm publish --access public --tag "$NPM_TAG"'
  )
  const probeIndex = workflow.indexOf(PROBE_STEP)

  assert.ok(publishIndex >= 0, "release workflow must publish through npm")
  assert.ok(probeIndex > publishIndex, "registry probe must run after publish")
})

test("release workflow passes the requested version through the environment", () => {
  const stepIndex = workflow.indexOf(
    "- name: Verify exact published registry release"
  )
  assert.ok(
    stepIndex >= 0,
    "release workflow must verify the published release"
  )

  const step = workflow.slice(
    stepIndex,
    workflow.indexOf("- name:", stepIndex + 10)
  )
  assert.match(step, /VERSION: \$\{\{ inputs\.version \}\}/)
  assert.doesNotMatch(
    step,
    /\$\{\{[^}]*\}\}[^\n]*check-registry-release|check-registry-release[^\n]*\$\{\{/,
    "the probe argument must not be a template expansion inside run:"
  )
})

test("GitHub release synchronization runs only after verified publishing", () => {
  const probeIndex = workflow.indexOf(PROBE_STEP)
  const syncJobIndex = workflow.indexOf("\n  github-release:")
  const publishJob = workflow.slice(0, syncJobIndex)
  const syncJob = workflow.slice(syncJobIndex)

  assert.ok(
    syncJobIndex > probeIndex,
    "GitHub release job must be declared after the registry probe"
  )
  assert.match(syncJob, /needs: publish/)
  assert.match(syncJob, /permissions:\n      contents: write/)
  assert.doesNotMatch(publishJob, /contents: write/)
  assert.match(syncJob, /release_tag="v\$\{VERSION\}"/)
  assert.match(syncJob, /release create "\$release_tag"/)
  assert.match(syncJob, /--target "\$GITHUB_SHA"/)
  assert.match(syncJob, /--generate-notes/)
  assert.match(syncJob, /args\+=\(--prerelease\)/)
})

test("release workflow validates the canonical package repository", () => {
  assert.deepEqual(packageJson.repository, {
    type: "git",
    url: "git+https://github.com/mivabyte/ui.git",
  })
  assert.equal(packageJson.bugs?.url, "https://github.com/mivabyte/ui/issues")
  assert.equal(packageJson.homepage, "https://github.com/mivabyte/ui#readme")
  assert.match(workflow, /GITHUB_SERVER_URL/)
  assert.match(workflow, /GITHUB_REPOSITORY/)
  assert.doesNotMatch(workflow, /mivabyte\/mivabyte-ui/)
})
