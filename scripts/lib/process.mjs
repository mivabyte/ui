import { execFile } from "node:child_process"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)
const defaultMaxBuffer = 16 * 1024 * 1024

export async function runCommand(
  command,
  args,
  { cwd, env = {}, maxBuffer = defaultMaxBuffer, echo = true } = {}
) {
  try {
    const result = await execFileAsync(command, args, {
      cwd,
      env: { ...process.env, ...env },
      encoding: "utf8",
      maxBuffer,
    })

    if (echo && result.stdout) process.stdout.write(result.stdout)
    if (echo && result.stderr) process.stderr.write(result.stderr)

    return result
  } catch (error) {
    if (error.stdout) process.stdout.write(error.stdout)
    if (error.stderr) process.stderr.write(error.stderr)
    throw error
  }
}

export function runNpm(args, options = {}) {
  // npm propagates its own CLI config into lifecycle scripts as `npm_config_*`
  // environment variables. `npm publish --dry-run` therefore runs
  // `prepublishOnly` - this repository's full `npm run verify` gate - with
  // `npm_config_dry_run=true` in the environment.
  //
  // A dry-run npm invocation still reports a tarball filename while writing no
  // file, so every nested `npm pack`, `npm install` and `npm ci` below would
  // fail afterwards with ENOENT on a path that does not exist. That also
  // applies to third-party tools that shell out to npm themselves, such as
  // publint and attw, so the fix has to apply to the whole child environment
  // rather than to individual call sites.
  //
  // These helpers exist to materialise real tarballs and `node_modules` trees,
  // so dry-run is disabled for every child npm call. A caller that genuinely
  // wants a dry-run child can still set it explicitly through `env`.
  return runCommand("npm", args, {
    ...options,
    env: { npm_config_dry_run: "false", ...options.env },
  })
}
