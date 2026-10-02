// Resolves every `uses:` SHA pin in the GitHub Actions workflows against the real
// GitHub tags API and records the result in `etc/action-pins.json`.
//
// Why this exists: a workflow can only state its action version in a trailing
// comment (`# v7.0.1`). That comment is human-editable text, so a check that
// reads the comment proves nothing — `actions/checkout@<real v4 SHA> # v7.0.0`
// passes every comment-based assertion. This script turns the comment into a
// verifiable claim by resolving the pinned SHA to the tags that actually point
// at it, so `scripts/audit-source.mjs` can compare the two offline.
//
// Usage:
//   node scripts/sync-action-pins.mjs           # rewrite etc/action-pins.json
//   node scripts/sync-action-pins.mjs --check   # fail if the file is stale
//
// `--check` fails closed: any network or API error exits non-zero rather than
// silently accepting an unresolved pin.
import assert from "node:assert/strict"
import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const workflowRoot = path.join(root, ".github", "workflows")
const pinsPath = path.join(root, "etc", "action-pins.json")
const checkOnly = process.argv.includes("--check")

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const headers = {
  accept: "application/vnd.github+json",
  "user-agent": "mivabyte-ui-action-pin-audit",
  ...(GITHUB_TOKEN ? { authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
}

// A pinned commit is the same SHA whether it is annotated or lightweight, and
// `/tags` reports the dereferenced commit, so it matches `/git/ref/tags/{tag}`.
// Memoised per repository. `github/codeql-action/init` and `.../analyze` share
// one repo, and this repository already has an action with 589 tags, so a
// per-action refetch is both slow and unnecessary.
const tagsCache = new Map()

async function tagsFor(owner, repo) {
  const cacheKey = `${owner}/${repo}`
  const cached = tagsCache.get(cacheKey)
  if (cached) return cached

  const found = []
  // Paginate until a short page arrives rather than capping the page count.
  // `github/codeql-action` already has 589 tags, so any fixed cap would silently
  // stop resolving the pinned SHA once enough newer tags accumulate, and the
  // audit would fail for a reason unrelated to this repository.
  for (let page = 1; ; page += 1) {
    const url = `https://api.github.com/repos/${owner}/${repo}/tags?per_page=100&page=${page}`
    const response = await fetch(url, { headers })
    if (!response.ok) {
      throw new Error(
        `GitHub API request failed for ${cacheKey}: ${response.status} ${response.statusText}`
      )
    }
    const batch = await response.json()
    if (!Array.isArray(batch)) {
      throw new Error(`Unexpected API response for ${cacheKey}`)
    }
    found.push(...batch)
    if (batch.length < 100) break
  }

  tagsCache.set(cacheKey, found)
  return found
}

async function resolvePin(action, sha) {
  const [owner, repo] = action.split("/")
  if (!repo) {
    throw new Error(`Unexpected action reference shape: ${action}`)
  }

  const tags = await tagsFor(owner, repo)
  // Annotations are ordered newest-first by the API; keep the highest semantic
  // version so the recorded version is the one a reader would expect.
  const matching = tags.filter((tag) => tag.commit?.sha === sha)
  if (matching.length === 0) {
    throw new Error(
      `No published tag of ${owner}/${repo} points at ${sha}. The pin is either fabricated, or the tag was deleted/moved.`
    )
  }

  const versions = matching
    .map((tag) => tag.name.replace(/^v/, ""))
    .filter((name) => /^\d+\.\d+\.\d+/.test(name))
    .sort((a, b) => {
      const pa = a.split(".").map(Number)
      const pb = b.split(".").map(Number)
      for (let i = 0; i < 3; i += 1) {
        if (pa[i] !== pb[i]) return pa[i] - pb[i]
      }
      return 0
    })

  if (versions.length === 0) {
    throw new Error(
      `${action}@${sha} matches tag(s) ${matching
        .map((tag) => tag.name)
        .join(", ")}, none of which is a semver tag`
    )
  }

  return {
    // Deliberately the LOWEST matching semver tag, not the highest. A repo that
    // publishes `v7.0.0` on top of an old v4 commit would otherwise let a
    // genuinely-old action pass the major floor. The lowest tag is the weakest
    // claim upstream makes about that commit, so requiring the comment to match
    // it fails closed.
    version: versions[0],
    tags: matching.map((tag) => tag.name).sort(),
  }
}

const workflowFiles = (await readdirSorted(workflowRoot)).filter((file) =>
  /\.ya?ml$/.test(file)
)

async function readdirSorted(directory) {
  const { readdir } = await import("node:fs/promises")
  return (await readdir(directory)).sort()
}

const pins = {}
for (const file of workflowFiles) {
  const workflow = await readFile(path.join(workflowRoot, file), "utf8")
  const references = [
    ...workflow.matchAll(
      /uses:[ \t]+([^\s@#]+)[ \t]*@([0-9a-f]{40})[ \t]*#[ \t]*v?[ \t]*(\d+)/g
    ),
  ]

  for (const [, action, sha, declaredMajor] of references) {
    if (action.startsWith("./") || action.startsWith("../")) continue

    const resolved = await resolvePin(action, sha)
    const resolvedMajor = Number(resolved.version.split(".")[0])

    assert.equal(
      resolvedMajor,
      Number(declaredMajor),
      `${file}: ${action}@${sha} is tag v${resolved.version} (major ${resolvedMajor}) but the workflow comment claims v${declaredMajor}`
    )

    const existing = pins[action]
    // Two steps can legitimately reference the same action at the same SHA
    // (`github/codeql-action/init` and `.../analyze`, for example). They must
    // agree: a silent last-write-wins here would drop the first pin from the
    // record and let a downgrade in one step go unnoticed.
    if (existing && existing.sha !== sha) {
      throw new Error(
        `${action} is referenced at two different SHAs: ${existing.sha} and ${sha}. Update every reference in one commit so the pin file stays a single source of truth.`
      )
    }

    pins[action] = { sha, version: resolved.version, tags: resolved.tags }
  }
}

// Prettier owns the formatting of this file (it runs in `format:check`), so emit
// Prettier's canonical style here. Emitting `JSON.stringify(..., null, 2)` would
// make `--check` fail forever on the arrays, because Prettier collapses short
// arrays onto one line.
const entries = Object.entries(pins).map(([action, pin]) => {
  const tags =
    pin.tags.length <= 4
      ? `[${pin.tags.map((tag) => JSON.stringify(tag)).join(", ")}]`
      : `[\n${pin.tags.map((tag) => `    ${JSON.stringify(tag)}`).join(",\n")}\n  ]`
  return `  ${JSON.stringify(action)}: {\n    "sha": ${JSON.stringify(pin.sha)},\n    "version": ${JSON.stringify(pin.version)},\n    "tags": ${tags}\n  }`
})
const generated = `{\n${entries.join(",\n")}\n}\n`

if (checkOnly) {
  const existing = await readFile(pinsPath, "utf8").catch(() => null)
  assert.notEqual(
    existing,
    null,
    "etc/action-pins.json is missing. Run `node scripts/sync-action-pins.mjs`."
  )
  assert.equal(
    existing,
    generated,
    "etc/action-pins.json is out of date. Run `node scripts/sync-action-pins.mjs` and commit the result."
  )
  console.log(
    `Action pins verified against the GitHub API (${Object.keys(pins).length} actions)`
  )
} else {
  await writeFile(pinsPath, generated)
  console.log(
    `Wrote etc/action-pins.json for ${Object.keys(pins).length} actions`
  )
}
