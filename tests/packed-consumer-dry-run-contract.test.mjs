import assert from "node:assert/strict"
import { access, mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

import { readJson, readRoot } from "./lib/source.mjs"

// `npm publish --dry-run` runs `prepublishOnly`, which is this repository's
// full `npm run verify` gate. npm propagates its CLI config into lifecycle
// scripts as `npm_config_*` variables, so `npm_config_dry_run=true` reaches the
// release helpers.
//
// A dry-run npm invocation still prints a tarball filename while writing no
// file. Every nested `npm pack`, `npm install` and `npm ci` would then fail
// afterwards with ENOENT on a path that does not exist. The same applies to
// third-party tools that shell out to npm themselves - publint and attw both
// pack internally - so the guard has to live in the shared `runNpm` helper
// rather than at individual call sites.

const root = fileURLToPath(new URL("..", import.meta.url))

test("runNpm disables dry-run for every child npm invocation", async () => {
  const source = await readRoot("scripts/lib/process.mjs")

  assert.match(source, /export function runNpm/)
  assert.match(
    source,
    /env:\s*\{\s*npm_config_dry_run:\s*"false",\s*\.\.\.options\.env\s*\}/
  )
})

test("prepublishOnly runs the release gate without an inherited dry-run", async () => {
  const pkg = await readJson("package.json")

  assert.equal(
    pkg.scripts.prepublishOnly,
    "node scripts/without-dry-run.mjs npm run verify"
  )

  const wrapper = await readRoot("scripts/without-dry-run.mjs")
  assert.match(wrapper, /delete env\.npm_config_dry_run/)
  assert.match(wrapper, /delete env\.NPM_CONFIG_DRY_RUN/)
  assert.match(wrapper, /process\.argv\.slice\(2\)/)
})

test("no release helper passes --dry-run to npm", async () => {
  for (const script of [
    "scripts/lib/package-source.mjs",
    "scripts/lib/isolated-package-consumer.mjs",
    "scripts/lib/app-consumer.mjs",
  ]) {
    const source = await readRoot(script)
    assert.doesNotMatch(
      source,
      /--dry-run/,
      `${script} must not work around the shared guard locally`
    )
  }
})

test("packing under an inherited npm_config_dry_run still writes a real tarball", async (t) => {
  if (process.env.MIVABYTE_PACKAGE_SPEC) {
    t.diagnostic(
      "MIVABYTE_PACKAGE_SPEC is set; the registry spec is used instead"
    )
    return
  }

  const { preparePackageSource } =
    await import("../scripts/lib/package-source.mjs")
  const workspace = await mkdtemp(path.join(tmpdir(), "mivabyte-ui-dryrun-"))
  const previous = process.env.npm_config_dry_run
  let packed

  t.after(async () => {
    if (previous === undefined) delete process.env.npm_config_dry_run
    else process.env.npm_config_dry_run = previous
    await packed?.cleanup?.()
    await rm(workspace, { recursive: true, force: true })
  })

  // Reproduces the environment `prepublishOnly` inherits under
  // `npm publish --dry-run`.
  process.env.npm_config_dry_run = "true"
  packed = await preparePackageSource({
    root,
    artifacts: path.join(workspace, "artifacts"),
    ignoreScripts: true,
  })

  assert.match(packed.spec, /\.tgz$/)
  await access(packed.spec)
})
