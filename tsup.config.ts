import { defineConfig } from "tsup"
import fs from "node:fs"
import path from "node:path"

function collectEntries(dir: string, base = ""): Record<string, string> {
  const entries: Record<string, string> = {}
  if (!fs.existsSync(dir)) return entries

  const items = fs
    .readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))

  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    const relPath = base ? path.join(base, item.name) : item.name
    if (item.isDirectory()) {
      if (item.name === "fonts") continue
      Object.assign(entries, collectEntries(fullPath, relPath))
    } else if (
      /\.(ts|tsx)$/.test(item.name) &&
      !item.name.includes(".test.") &&
      !item.name.includes(".stories.")
    ) {
      const entryKey = relPath.replace(/\.(ts|tsx)$/, "")
      entries[entryKey] = fullPath
    }
  }
  return entries
}

const rawEntries = collectEntries(path.resolve(process.cwd(), "src"))
const allEntries: Record<string, string> = Object.keys(rawEntries)
  .sort()
  .reduce(
    (acc, key) => {
      acc[key] = rawEntries[key]
      return acc
    },
    {} as Record<string, string>
  )

const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf8")
) as { dependencies?: Record<string, string> }
const runtimeExternal = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
  ...Object.keys(packageJson.dependencies ?? {}),
]

export default defineConfig({
  entry: allEntries,
  format: ["esm", "cjs"],
  dts: false,
  sourcemap: true,
  clean: false,
  target: "es2022",
  external: runtimeExternal,
  treeshake: true,
  splitting: false,
  bundle: true,
  tsconfig: "tsconfig.build.json",
})
