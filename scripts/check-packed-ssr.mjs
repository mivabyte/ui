import { writeFile } from "node:fs/promises"
import path from "node:path"

import { getModuleImportSpecifiers } from "./lib/package-exports.mjs"
import { prepareIsolatedPackageConsumer } from "./lib/isolated-package-consumer.mjs"
import { runCommand } from "./lib/process.mjs"

const root = path.resolve(import.meta.dirname, "..")
const consumer = await prepareIsolatedPackageConsumer({
  root,
  tempPrefix: "mivabyte-ui-ssr-",
})

try {
  const importSpecifiers = getModuleImportSpecifiers(consumer.installedPackage)
  const checkFile = path.join(consumer.workspace, "ssr-check.mjs")
  await writeFile(
    checkFile,
    `import * as React from "react";\n` +
      `import { renderToStaticMarkup } from "react-dom/server";\n` +
      `const specifiers = ${JSON.stringify(importSpecifiers)};\n` +
      `for (const specifier of specifiers) {\n` +
      `  const namespace = await import(specifier);\n` +
      `  if (Object.keys(namespace).length === 0) throw new Error(\`Empty module: \${specifier}\`);\n` +
      `}\n` +
      `const card = await import("@mivabyte/ui/card");\n` +
      `const button = await import("@mivabyte/ui/button");\n` +
      `const badge = await import("@mivabyte/ui/badge");\n` +
      `const tree = React.createElement(\n` +
      `  "main",\n` +
      `  null,\n` +
      `  React.createElement(card.Card, null, React.createElement("div", null, "SSR card")),\n` +
      `  React.createElement(button.Button, null, "SSR button"),\n` +
      `  React.createElement(badge.Badge, null, "SSR badge")\n` +
      `);\n` +
      `const html = renderToStaticMarkup(tree);\n` +
      `for (const text of ["SSR card", "SSR button", "SSR badge"]) {\n` +
      `  if (!html.includes(text)) throw new Error(\`Missing SSR output: \${text}\`);\n` +
      `}\n` +
      `console.log(\`Imported \${specifiers.length} ESM entry points and rendered SSR markup\`);\n`
  )

  await runCommand(process.execPath, [checkFile], consumer.commandOptions)
  console.log(`SSR consumer passed with ${consumer.packageLabel}`)
} finally {
  await consumer.cleanup()
}
