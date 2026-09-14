import { readdir, readFile, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import { components } from "../config/components.mjs"

const root = process.cwd()
const writeMode = process.argv.includes("--write")
const packageJson = JSON.parse(
  await readFile(path.join(root, "package.json"), "utf8")
)
const errors = []

const findDuplicates = (values) =>
  new Set(values.filter((value, index) => values.indexOf(value) !== index))

const setDifference = (left, right) =>
  [...left].filter((value) => !right.has(value))

const validateModuleExport = (key, value) => {
  if (!value || typeof value !== "object") {
    errors.push(`Module export must define ESM and CommonJS branches: ${key}`)
    return
  }

  const esm = value.import
  const commonJs = value.require
  if (
    !esm ||
    typeof esm !== "object" ||
    typeof esm.types !== "string" ||
    typeof esm.default !== "string" ||
    !commonJs ||
    typeof commonJs !== "object" ||
    typeof commonJs.types !== "string" ||
    typeof commonJs.default !== "string" ||
    typeof value.default !== "string"
  ) {
    errors.push(`Incomplete package export contract: ${key}`)
    return
  }

  if (value.default !== esm.default) {
    errors.push(`ESM/default mismatch: ${key}`)
  }
  if (!esm.default.endsWith(".js") || !commonJs.default.endsWith(".cjs")) {
    errors.push(`Invalid ESM/CommonJS runtime targets: ${key}`)
  }
  if (!esm.types.endsWith(".d.ts") || !commonJs.types.endsWith(".d.cts")) {
    errors.push(`Invalid ESM/CommonJS type targets: ${key}`)
  }
}

for (const [label, values] of [
  ["component name", components.map(({ name }) => name)],
  ["component slug", components.map(({ slug }) => slug)],
  ["component source", components.map(({ source }) => source)],
]) {
  for (const duplicate of findDuplicates(values)) {
    errors.push(`Duplicate ${label}: ${duplicate}`)
  }
}

const rootExport = packageJson.exports?.["."]
validateModuleExport(".", rootExport)

for (const component of components) {
  const sourcePath = path.join(root, component.source)
  try {
    if (!(await stat(sourcePath)).isFile()) {
      errors.push(`Source is not a file: ${component.source}`)
    }
  } catch {
    errors.push(`Missing source file: ${component.source}`)
  }

  const exportKey = `./${component.slug}`
  validateModuleExport(exportKey, packageJson.exports?.[exportKey])
}

const uiFiles = new Set(
  (await readdir(path.join(root, "src/components/ui")))
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => `src/components/ui/${file}`)
)
const registeredUiFiles = new Set(
  components
    .map(({ source }) => source)
    .filter(
      (source) =>
        source.startsWith("src/components/ui/") && source.endsWith(".tsx")
    )
)

for (const source of setDifference(uiFiles, registeredUiFiles)) {
  errors.push(`Unregistered public UI source: ${source}`)
}
for (const source of setDifference(registeredUiFiles, uiFiles)) {
  errors.push(`Registry references unknown UI source: ${source}`)
}

const moduleExportSlugs = new Set(
  Object.entries(packageJson.exports ?? {})
    .filter(
      ([key, value]) =>
        key !== "." && !key.startsWith("./hooks/") && typeof value === "object"
    )
    .map(([key]) => key.slice(2))
)
const registeredSlugs = new Set(components.map(({ slug }) => slug))

for (const slug of setDifference(moduleExportSlugs, registeredSlugs)) {
  errors.push(`Unregistered module export: ./${slug}`)
}
for (const slug of setDifference(registeredSlugs, moduleExportSlugs)) {
  errors.push(`Registry slug has no module export: ./${slug}`)
}

const sorted = [...components].sort((a, b) => a.slug.localeCompare(b.slug))
const moduleSections = sorted.map(({ name, slug }) => {
  const packageExport = packageJson.exports[`./${slug}`]
  return `## \`@mivabyte/ui/${slug}\`

- Official component: ${name}
- Source: \`src/components/ui/${slug}.tsx\`
- ESM types: \`${packageExport.import.types}\`
- ESM runtime: \`${packageExport.import.default}\`
- CommonJS types: \`${packageExport.require.types}\`
- CommonJS runtime: \`${packageExport.require.default}\``
})

const stylesheetExports = Object.entries(packageJson.exports ?? {})
  .filter(([key, value]) => key !== "." && typeof value === "string")
  .sort(([left], [right]) => left.localeCompare(right))

const stylesheetLines = stylesheetExports.length
  ? stylesheetExports
      .map(
        ([key, target]) =>
          `- \`@mivabyte/ui/${key.slice(2)}\` → \`${target}\``
      )
      .join("\n")
  : "- None"

const generated = `# Package exports

This file is generated from \`config/components.mjs\` and \`package.json\`. Do not edit it manually.

The registry is the authoritative inventory of the official shadcn/ui component subpaths. Package export validation fails when the source, registry, or \`package.json\` disagree.

## Root barrel

- Import: \`@mivabyte/ui\`
- ESM types: \`${rootExport?.import?.types ?? "missing"}\`
- ESM runtime: \`${rootExport?.import?.default ?? "missing"}\`
- CommonJS types: \`${rootExport?.require?.types ?? "missing"}\`
- CommonJS runtime: \`${rootExport?.require?.default ?? "missing"}\`

## Component and module subpaths

${moduleSections.join("\n\n")}

## Stylesheet exports

${stylesheetLines}
`
const docsPath = path.join(root, "docs/generated/exports.md")

if (writeMode) {
  await writeFile(docsPath, generated)
} else {
  let existing = ""
  try {
    existing = await readFile(docsPath, "utf8")
  } catch {
    errors.push(
      "Missing generated export documentation: docs/generated/exports.md"
    )
  }
  if (existing && existing !== generated) {
    errors.push(
      "Generated export documentation is stale. Run npm run registry:write."
    )
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"))
  process.exit(1)
}

console.log(
  `Validated ${components.length} registered module exports and ${stylesheetExports.length} stylesheet exports`
)
