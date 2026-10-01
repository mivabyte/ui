import assert from "node:assert/strict"
import test from "node:test"

import { readJson, readRoot } from "./lib/source.mjs"

test("verification uses one canonical core pipeline and cancels stale runs", async () => {
  const [packageJson, workflow] = await Promise.all([
    readJson("package.json"),
    readRoot(".github/workflows/verify.yml"),
  ])
  const scripts = packageJson.scripts

  // Exact set AND order. Containment matching would let a step be silently
  // added or reordered, which is precisely the drift this test exists to stop.
  const asSteps = (script) => script.split(" && ")
  assert.deepEqual(asSteps(scripts.verify), [
    "npm run lint",
    "npm run verify:core",
    "npm run api:check",
    "npm run test:coverage",
  ])
  assert.deepEqual(asSteps(scripts["verify:core"]), [
    "npm run format:check",
    "npm run audit:source",
    "npm run registry:check",
    "npm run storybook:check",
    "npm run typecheck",
    "npm run build",
    "npm run test:contracts",
    "npm run pack:check",
    "npm run package:lint",
  ])
  assert.equal(scripts["verify:package"], undefined)
  assert.equal(scripts["lint:node"], undefined)

  assert.match(workflow, /concurrency:/)
  assert.match(workflow, /cancel-in-progress: true/)
})
