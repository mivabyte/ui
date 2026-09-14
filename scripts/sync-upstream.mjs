#!/usr/bin/env node
/**
 * Detect shadcn/ui base-registry changes and prepare a reviewable sync proposal.
 *
 * This script deliberately does not write component source. @mivabyte/ui carries
 * package-local import paths and theme tokens, so blindly replacing source from
 * upstream can produce a syntactically valid but broken package. A scheduled
 * GitHub Action writes only a draft PR containing the exact upstream delta.
 *
 * Usage:
 *   node scripts/sync-upstream.mjs [--target <git-ref>] [--write-proposal]
 *
 * Environment:
 *   GITHUB_TOKEN or GH_TOKEN may be supplied to avoid anonymous GitHub API
 *   rate limits. Neither token is logged or written to disk.
 */

import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { fileURLToPath, pathToFileURL } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const shadcnRepository = "shadcn-ui/ui"
const baseRegistryPath = "apps/v4/registry/bases/base/ui/"
const baselineFile = path.join(root, "docs/upstream/shadcn-baseline.md")
const proposalFile = path.join(root, "docs/upstream/pending-sync.md")
const registryFile = path.join(root, "config/components.mjs")

function usage() {
  return [
    "Usage: node scripts/sync-upstream.mjs [--target <git-ref>] [--write-proposal]",
    "",
    "Options:",
    "  --target <git-ref>    Upstream ref to compare with the pinned baseline (default: main).",
    "  --write-proposal       Update docs/upstream/pending-sync.md for a draft PR.",
    "  --help                 Show this help text.",
  ].join("\n")
}

export function parseArgs(args) {
  const result = { target: "main", writeProposal: false, help: false }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (arg === "--help") {
      result.help = true
    } else if (arg === "--write-proposal") {
      result.writeProposal = true
    } else if (arg === "--target") {
      const target = args[index + 1]
      if (!target || target.startsWith("--")) {
        throw new Error("--target requires a Git ref")
      }
      result.target = target
      index += 1
    } else if (arg.startsWith("--target=")) {
      const target = arg.slice("--target=".length)
      if (!target) throw new Error("--target requires a Git ref")
      result.target = target
    } else {
      throw new Error(`Unknown argument: ${arg}`)
    }
  }

  return result
}

export function parsePinnedSha(content) {
  const match = content.match(/\*\*Pinned Git SHA:\*\*\s*`([0-9a-f]{40})`/i)
  if (!match) {
    throw new Error(
      "Could not find a 40-character pinned Git SHA in shadcn-baseline.md"
    )
  }
  return match[1].toLowerCase()
}

function readPinnedSha() {
  return parsePinnedSha(fs.readFileSync(baselineFile, "utf8"))
}

function githubHeaders() {
  const headers = ["-H", "Accept: application/vnd.github+json"]
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  if (token) headers.push("-H", `Authorization: Bearer ${token}`)
  return headers
}

function githubApi(pathname) {
  const url = `https://api.github.com/repos/${shadcnRepository}${pathname}`
  let output

  try {
    output = execFileSync(
      "curl",
      [
        "--silent",
        "--show-error",
        "--location",
        "--fail-with-body",
        "--retry",
        "3",
        "--retry-all-errors",
        "--connect-timeout",
        "10",
        "--max-time",
        "60",
        ...githubHeaders(),
        url,
      ],
      { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 }
    )
  } catch (error) {
    const detail = error.stderr?.toString().trim() || error.message
    throw new Error(`GitHub API request failed for ${pathname}: ${detail}`)
  }

  try {
    return JSON.parse(output)
  } catch {
    throw new Error(`GitHub API returned invalid JSON for ${pathname}`)
  }
}

function resolveCommit(ref) {
  const commit = githubApi(`/commits/${encodeURIComponent(ref)}`)
  if (!/^[0-9a-f]{40}$/i.test(commit.sha || "")) {
    throw new Error(`GitHub API did not resolve ${ref} to a commit SHA`)
  }
  return commit.sha.toLowerCase()
}

function fetchTree(sha) {
  const response = githubApi(`/git/trees/${sha}?recursive=1`)
  if (!Array.isArray(response.tree)) {
    throw new Error(`GitHub API returned no recursive tree for ${sha}`)
  }
  if (response.truncated) {
    throw new Error(
      `GitHub API tree for ${sha} was truncated; refusing incomplete comparison`
    )
  }
  return response.tree
}

export function baseRegistryEntries(tree) {
  return tree
    .filter(
      (entry) =>
        entry.type === "blob" &&
        entry.path.startsWith(baseRegistryPath) &&
        entry.path.endsWith(".tsx") &&
        !entry.path.includes("/examples/")
    )
    .map((entry) => ({
      name: path.basename(entry.path, ".tsx"),
      path: entry.path,
      sha: entry.sha,
    }))
    .sort((left, right) => left.name.localeCompare(right.name))
}

export function buildReport({
  baselineSha,
  targetSha,
  baselineTree,
  targetTree,
  trackedSlugs,
}) {
  const baselineEntries = new Map(
    baseRegistryEntries(baselineTree).map((entry) => [entry.name, entry])
  )
  const targetEntries = new Map(
    baseRegistryEntries(targetTree).map((entry) => [entry.name, entry])
  )
  const changes = []

  for (const name of new Set([
    ...baselineEntries.keys(),
    ...targetEntries.keys(),
  ])) {
    const baseline = baselineEntries.get(name)
    const target = targetEntries.get(name)
    if (baseline?.sha === target?.sha) continue

    changes.push({
      name,
      status: baseline ? (target ? "changed" : "removed") : "added",
      tracked: trackedSlugs.has(name),
      baselinePath: baseline?.path ?? null,
      baselineBlobSha: baseline?.sha ?? null,
      targetPath: target?.path ?? null,
      targetBlobSha: target?.sha ?? null,
    })
  }

  changes.sort((left, right) => left.name.localeCompare(right.name))

  return {
    baselineSha,
    targetSha,
    baselineComponents: baselineEntries.size,
    targetComponents: targetEntries.size,
    trackedComponents: trackedSlugs.size,
    changes,
    trackedChanges: changes.filter((change) => change.tracked),
    untrackedChanges: changes.filter((change) => !change.tracked),
  }
}

function rawUrl(sha, sourcePath) {
  return sourcePath
    ? `https://github.com/${shadcnRepository}/blob/${sha}/${sourcePath}`
    : "—"
}

export function renderProposal(report) {
  const lines = [
    "# Pending shadcn/ui Upstream Sync",
    "",
    "> Generated by `npm run sync:upstream` / the scheduled Sync Upstream workflow. Do not edit manually.",
    "",
    "## Review boundary",
    "",
    "This is a **draft-only detection proposal**. It intentionally does not overwrite `src/components/ui` or update the baseline pin. `@mivabyte/ui` uses package-local imports and Mivabyte theme tokens, so every source change must be reviewed, adapted, and pass the full package verification before the pinned SHA is advanced.",
    "",
    "- Baseline SHA: `" + report.baselineSha + "`",
    "- Candidate SHA: `" + report.targetSha + "`",
    "- Base-registry components: " +
      report.baselineComponents +
      " → " +
      report.targetComponents,
    "- Changed base-registry components: " + report.changes.length,
    "- Changes in the @mivabyte/ui 64-component catalog: " +
      report.trackedChanges.length,
    "",
  ]

  if (report.changes.length === 0) {
    lines.push("No upstream base-registry component changes were detected.", "")
    return lines.join("\n")
  }

  lines.push(
    "## Component delta",
    "",
    "| Component | Status | In package catalog | Baseline source | Candidate source |",
    "| --- | --- | --- | --- | --- |"
  )

  for (const change of report.changes) {
    lines.push(
      `| ${change.name} | ${change.status} | ${change.tracked ? "yes" : "no"} | ${rawUrl(report.baselineSha, change.baselinePath)} | ${rawUrl(report.targetSha, change.targetPath)} |`
    )
  }

  lines.push(
    "",
    "## Required merge checklist",
    "",
    "- [ ] Review every tracked component source diff against the candidate SHA.",
    "- [ ] Apply only reviewed changes using package-local imports and existing theme tokens.",
    "- [ ] Update `docs/upstream/shadcn-baseline.md` to the candidate SHA only after all intended changes are integrated.",
    "- [ ] Update parity documentation and add an appropriate changeset if the published package changes.",
    "- [ ] Run `npm run verify` and inspect the packed package before merge.",
    "- [ ] Keep this PR draft until the above checks pass; merging never publishes a release.",
    ""
  )

  return lines.join("\n")
}

async function trackedComponentSlugs() {
  const module = await import(
    `${pathToFileURL(registryFile).href}?sync=${Date.now()}`
  )
  if (!Array.isArray(module.components)) {
    throw new Error("config/components.mjs does not export a components array")
  }

  return new Set(
    module.components
      .map((component) => component.slug)
      .filter((slug) => typeof slug === "string")
  )
}

function writeProposal(content) {
  fs.mkdirSync(path.dirname(proposalFile), { recursive: true })
  const current = fs.existsSync(proposalFile)
    ? fs.readFileSync(proposalFile, "utf8")
    : null
  if (current === content) {
    console.log(
      `[sync] Proposal is already current: ${path.relative(root, proposalFile)}`
    )
    return
  }
  fs.writeFileSync(proposalFile, content)
  console.log(`[sync] Proposal written: ${path.relative(root, proposalFile)}`)
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    console.log(usage())
    return
  }

  const baselineSha = readPinnedSha()
  const targetSha = resolveCommit(options.target)
  const trackedSlugs = await trackedComponentSlugs()
  const report = buildReport({
    baselineSha,
    targetSha,
    baselineTree: fetchTree(baselineSha),
    targetTree: fetchTree(targetSha),
    trackedSlugs,
  })

  console.log(`[sync] Baseline SHA: ${report.baselineSha}`)
  console.log(`[sync] Candidate SHA: ${report.targetSha}`)
  console.log(
    `[sync] Base registry: ${report.baselineComponents} → ${report.targetComponents}`
  )
  console.log(
    `[sync] Changes: ${report.changes.length} (${report.trackedChanges.length} in package catalog)`
  )
  for (const change of report.changes) {
    console.log(
      `  ${change.tracked ? "[catalog]" : "[upstream]"} ${change.status}: ${change.name}`
    )
  }

  if (options.writeProposal) {
    writeProposal(renderProposal(report))
  }
}

const invokedDirectly =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (invokedDirectly) {
  main().catch((error) => {
    console.error(`[sync] ERROR: ${error.message}`)
    process.exitCode = 2
  })
}
