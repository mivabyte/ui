import { spawn } from "node:child_process"

// `npm publish --dry-run` runs this package's `prepublishOnly` script, which is
// the full release verification gate. npm exports its CLI config to lifecycle
// scripts as `npm_config_*` environment variables, so every nested command in
// that gate inherits `npm_config_dry_run=true`.
//
// Most tools ignore that variable, but the ones that shell out to npm inherit
// it and then behave differently from a real run: `npm pack` prints a tarball
// filename without writing the file, and `npm install` reports success without
// creating `node_modules`. Release tooling depends on both actually producing
// those artifacts, so publint and attw fail with ENOENT on paths that were never
// written.
//
// Rather than teaching each nested tool to defend itself, this wrapper runs the
// real gate with the inherited dry-run flag removed. It does not change what
// the outer `npm publish --dry-run` does: it still publishes nothing, because
// npm itself decides that before it runs this script.
//
// Usage: node scripts/without-dry-run.mjs <command> [args...]

const [command, ...args] = process.argv.slice(2)

if (!command) {
  console.error("Usage: node scripts/without-dry-run.mjs <command> [args...]")
  process.exit(1)
}

const env = { ...process.env }
delete env.npm_config_dry_run
delete env.NPM_CONFIG_DRY_RUN

const child = spawn(command, args, { env, stdio: "inherit", shell: false })

child.on("error", (error) => {
  console.error(`Failed to run \`${command}\`: ${error.message}`)
  process.exit(1)
})

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code ?? 1)
})
