import path from "node:path"

import { preparePackageSource } from "./lib/package-source.mjs"
import { runCommand } from "./lib/process.mjs"

const root = path.resolve(import.meta.dirname, "..")

// `attw --pack .` shells out to a bare `npm pack`, which runs the full lifecycle
// including `prepare`. Our `prepare` script is `npm run build`, and `build`
// starts with `rm -rf dist`. When this runs inside `verify:core` — after
// `build` has already produced a good `dist` — attw silently deletes and
// regenerates it, so the following `api:check` can analyse a half-written
// declaration tree and fail with:
//
//   Internal Error: getSourceFile() failed to locate "dist/components/ui/*.d.ts"
//
// Pack with `--ignore-scripts` so the artifact is built once, by `build`, and
// attw only analyses it. Keep the same attw arguments as before so the type
// contract checked here is unchanged.
const source = await preparePackageSource({
  root,
  artifacts: path.join(root, ".artifacts", "package-types"),
  ignoreScripts: true,
})

try {
  await runCommand(
    "npx",
    [
      "--no-install",
      "attw",
      source.spec,
      "--profile",
      "node16",
      "--exclude-entrypoints",
      "styles.css",
      "--ignore-rules",
      "cjs-resolves-to-esm",
      "false-esm",
    ],
    { cwd: root }
  )
} finally {
  await source.cleanup()
}
