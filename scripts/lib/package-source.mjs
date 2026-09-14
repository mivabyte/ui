import { mkdir, rm } from "node:fs/promises"
import path from "node:path"

import { runNpm } from "./process.mjs"

export async function preparePackageSource({
  root,
  artifacts,
  ignoreScripts = false,
}) {
  await rm(artifacts, { recursive: true, force: true })

  const registrySpec = process.env.MIVABYTE_PACKAGE_SPEC?.trim()
  if (registrySpec) {
    return {
      spec: registrySpec,
      label: registrySpec,
      cleanup: async () => {},
    }
  }

  await mkdir(artifacts, { recursive: true })
  const packArgs = ["pack"]
  if (ignoreScripts) packArgs.push("--ignore-scripts")
  packArgs.push("--json", "--pack-destination", artifacts)

  const { stdout } = await runNpm(packArgs, { cwd: root, echo: false })
  const cleanStdout = stdout.replace(/\u001b\[[0-9;]*[a-zA-Z]/g, "")
  const jsonMatch = cleanStdout.match(/\[\s*\{[\s\S]*"filename":[\s\S]*\}\s*\]/)
  const jsonStart = cleanStdout.indexOf("[")
  const jsonEnd = cleanStdout.lastIndexOf("]")
  const [packed] = JSON.parse(
    jsonMatch
      ? jsonMatch[0]
      : jsonStart !== -1 && jsonEnd !== -1
        ? cleanStdout.slice(jsonStart, jsonEnd + 1)
        : cleanStdout
  )
  const tarball = path.join(artifacts, packed.filename)

  return {
    spec: tarball,
    label: packed.filename,
    cleanup: () => rm(artifacts, { recursive: true, force: true }),
  }
}
