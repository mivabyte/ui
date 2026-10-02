// Contract tests for the workflow security audit.
//
// The audit exists to stop a specific, previously-exploited failure mode: a
// pinned action SHA that is not the version its comment claims. These tests pin
// that behaviour so a future refactor cannot quietly reopen it.
//
// Each negative case runs the audit inside a throwaway copy of its inputs
// rather than by mutating a tracked workflow, so an interrupted run can never
// leave a versioned file corrupted.
import assert from "node:assert/strict"
import { execFile } from "node:child_process"
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { test } from "node:test"
import { promisify } from "node:util"

const run = promisify(execFile)
const root = path.resolve(import.meta.dirname, "..")
const auditScript = path.join(root, "scripts", "audit-source.mjs")

// A checkout step that satisfies every rule, used as the positive control.
const VALID_CHECKOUT = `      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false
`

const auditSource = await readFile(auditScript, "utf8")
const pinsJson = await readFile(
  path.join(root, "etc", "action-pins.json"),
  "utf8"
)
const verifyYaml = await readFile(
  path.join(root, ".github", "workflows", "verify.yml"),
  "utf8"
)

// The audit resolves `.github/workflows` and `etc/action-pins.json` relative to
// its own file location, so a negative case runs in a throwaway directory.
async function auditWithSteps(steps) {
  const workspace = await mkdtemp(path.join(tmpdir(), "mivabyte-ui-audit-"))
  try {
    await mkdir(path.join(workspace, ".github", "workflows"), {
      recursive: true,
    })
    await mkdir(path.join(workspace, "etc"), { recursive: true })
    await mkdir(path.join(workspace, "scripts"), { recursive: true })
    await mkdir(path.join(workspace, "src"), { recursive: true })
    await writeFile(path.join(workspace, "etc", "action-pins.json"), pinsJson)
    await writeFile(
      path.join(workspace, "scripts", "audit-source.mjs"),
      auditSource
    )
    // The audit separately asserts verify.yml uses `npm ci --ignore-scripts`,
    // so copy it to satisfy that unrelated requirement.
    await writeFile(
      path.join(workspace, ".github", "workflows", "verify.yml"),
      verifyYaml
    )
    await writeFile(
      path.join(workspace, ".github", "workflows", "probe.yml"),
      `name: probe
on:
  workflow_dispatch:
permissions:
  contents: read
jobs:
  probe:
    runs-on: ubuntu-latest
    steps:
${steps}`
    )

    try {
      const { stdout } = await run(
        "node",
        [path.join(workspace, "scripts", "audit-source.mjs")],
        { cwd: workspace }
      )
      return { ok: true, output: stdout }
    } catch (error) {
      return {
        ok: false,
        output: `${error.stdout ?? ""}${error.stderr ?? ""}`,
      }
    }
  } finally {
    await rm(workspace, { recursive: true, force: true })
  }
}

async function auditRepository() {
  try {
    const { stdout } = await run("node", [auditScript], { cwd: root })
    return { ok: true, output: stdout }
  } catch (error) {
    return { ok: false, output: `${error.stdout ?? ""}${error.stderr ?? ""}` }
  }
}

test("the unmodified repository passes the workflow audit", async () => {
  const result = await auditRepository()
  assert.equal(
    result.ok,
    true,
    `expected a clean audit, got:\n${result.output}`
  )
})

test("a valid checkout step is accepted", async () => {
  const result = await auditWithSteps(VALID_CHECKOUT)
  assert.equal(result.ok, true, result.output)
})

test("an older-major SHA with a lying version comment is rejected", async () => {
  // The real actions/checkout v4.2.2 commit, mislabelled as v7.0.0. This is the
  // bypass that a comment-only check cannot see.
  const result = await auditWithSteps(
    `      - uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v7.0.0
        with:
          persist-credentials: false
`
  )
  assert.equal(result.ok, false, "an older SHA must not pass")
  assert.match(result.output, /action-pins\.json/)
})

test("a tampered SHA is rejected", async () => {
  const result = await auditWithSteps(
    `      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b0 # v7.0.1
        with:
          persist-credentials: false
`
  )
  assert.equal(result.ok, false, "one changed hex digit must not pass")
})

test("a missing version comment is rejected", async () => {
  const result = await auditWithSteps(
    `      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1
        with:
          persist-credentials: false
`
  )
  assert.equal(result.ok, false)
  assert.match(result.output, /must state its version/)
})

test("a container image reference is rejected", async () => {
  const result = await auditWithSteps(
    `      - uses: docker://attacker/evil:latest
        with:
          persist-credentials: false
`
  )
  assert.equal(result.ok, false, "docker:// must not be invisible")
  assert.match(result.output, /immutable full commit SHA/)
})

test("an action absent from the pin file is rejected", async () => {
  const result = await auditWithSteps(
    `${VALID_CHECKOUT}      - uses: evil/unknown-action@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa # v1.0.0
`
  )
  assert.equal(result.ok, false, "the allowlist must fail closed")
  assert.match(result.output, /not listed/)
})

test("a branch or tag reference is rejected", async () => {
  const result = await auditWithSteps(
    `      - uses: actions/checkout@v7.0.1
        with:
          persist-credentials: false
`
  )
  assert.equal(result.ok, false, "a tag must not be accepted in place of a SHA")
})

test("a checkout step without persist-credentials is rejected", async () => {
  const result = await auditWithSteps(
    `      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          fetch-depth: 0
`
  )
  assert.equal(result.ok, false)
  assert.match(result.output, /persist-credentials/)
})

test("a commented-out persist-credentials line is rejected", async () => {
  const result = await auditWithSteps(
    `      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          # persist-credentials: false
`
  )
  assert.equal(result.ok, false, "a comment must not satisfy the requirement")
})

test("persist-credentials on a later step does not cover an earlier one", async () => {
  const result = await auditWithSteps(
    `      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          fetch-depth: 0
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false
`
  )
  assert.equal(
    result.ok,
    false,
    "the requirement is per-step and must not be satisfiable by another step"
  )
})

test("the committed pin file records a SHA and semver for every action", async () => {
  const pins = JSON.parse(
    await readFile(path.join(root, "etc", "action-pins.json"), "utf8")
  )
  for (const [action, pin] of Object.entries(pins)) {
    assert.match(pin.sha, /^[0-9a-f]{40}$/, `${action} needs a full commit SHA`)
    assert.match(pin.version, /^\d+\.\d+\.\d+/, `${action} needs a semver tag`)
  }
})
