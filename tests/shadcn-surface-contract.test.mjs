import assert from "node:assert/strict"
import { access, readdir, readFile } from "node:fs/promises"
import path from "node:path"
import test from "node:test"

import { officialShadcnComponentSlugs } from "../config/components.mjs"
import { readJson, readRoot } from "./lib/source.mjs"

const expectedSlugs = [
  "accordion",
  "alert",
  "alert-dialog",
  "aspect-ratio",
  "attachment",
  "avatar",
  "badge",
  "breadcrumb",
  "bubble",
  "button",
  "button-group",
  "calendar",
  "card",
  "carousel",
  "chart",
  "checkbox",
  "collapsible",
  "combobox",
  "command",
  "container",
  "context-menu",
  "data-table",
  "date-picker",
  "dialog",
  "direction",
  "drawer",
  "dropdown-menu",
  "empty",
  "field",
  "hover-card",
  "input",
  "input-group",
  "input-otp",
  "item",
  "kbd",
  "kbd-group",
  "label",
  "marker",
  "menubar",
  "message",
  "message-scroller",
  "native-select",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "questionnaire",
  "radio-group",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "slider",
  "spinner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toast",
  "toggle",
  "toggle-group",
  "tooltip",
  "typography",
]

const root = path.resolve(import.meta.dirname, "..")

test("the package exposes exactly the official shadcn component surface", async () => {
  assert.equal(expectedSlugs.length, 66)
  assert.deepEqual([...officialShadcnComponentSlugs], expectedSlugs)

  const sourceSlugs = (await readdir(path.join(root, "src/components/ui")))
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => file.slice(0, -".tsx".length))
    .sort()
  assert.deepEqual(sourceSlugs, [...expectedSlugs].sort())

  const [packageJson, barrel] = await Promise.all([
    readJson("package.json"),
    readRoot("src/index.ts"),
  ])
  const componentSubpaths = Object.entries(packageJson.exports)
    .filter(
      ([key, value]) =>
        key.startsWith("./") &&
        !key.startsWith("./hooks/") &&
        typeof value === "object"
    )
    .map(([key]) => key.slice(2))
    .sort()
  assert.deepEqual(componentSubpaths, [...expectedSlugs].sort())

  for (const slug of expectedSlugs) {
    const exportMap = packageJson.exports[`./${slug}`]
    assert.equal(exportMap.default, `./dist/components/ui/${slug}.js`)
    assert.equal(exportMap.import.types, `./dist/components/ui/${slug}.d.ts`)
    assert.equal(exportMap.import.default, `./dist/components/ui/${slug}.js`)
    assert.equal(exportMap.require.types, `./dist/components/ui/${slug}.d.cts`)
    assert.equal(exportMap.require.default, `./dist/components/ui/${slug}.cjs`)
    assert.match(
      barrel,
      new RegExp(`from ["']\\./components/ui/${slug}["']`),
      `${slug} is absent from the root barrel`
    )
  }

  assert.equal(packageJson.exports["./styles.css"], "./dist/styles.css")
  assert.equal(packageJson.exports["./tokens.css"], undefined)
  assert.equal(packageJson.exports["./themes.css"], undefined)
  assert.equal(packageJson.exports["./provider"], undefined)
  assert.equal(packageJson.exports["./forms"], undefined)
})

test("the source and package are Radix/shadcn-only, without Base UI", async () => {
  const packageJson = await readJson("package.json")
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.peerDependencies,
  }
  assert.equal(dependencies["@base-ui/react"], undefined)

  const sourceFiles = (
    await readdir(path.join(root, "src/components/ui"))
  ).filter((file) => file.endsWith(".tsx"))
  const source = await Promise.all(
    sourceFiles.map((file) =>
      readFile(path.join(root, "src/components/ui", file), "utf8")
    )
  )
  assert.doesNotMatch(source.join("\n"), /@base-ui\/react/)

  const styles = await readRoot("src/styles.css")
  assert.match(styles, /@import "tailwindcss"/)
  assert.match(styles, /@import "\.\/tokens\.css"/)
  const tokens = await readRoot("src/tokens.css")
  assert.match(tokens, /:root/)
  assert.match(tokens, /\.dark/)
})

test("legacy Mivabyte shell helpers are absent from the build source", async () => {
  for (const file of ["shell-attributes.ts", "shell-contract.ts"]) {
    await assert.rejects(
      access(path.join(root, "src/lib", file)),
      { code: "ENOENT" },
      `${file} must not be published through the all-source build`
    )
  }
})

test("the package and lockfile publish the same version", async () => {
  const [packageJson, lockfile] = await Promise.all([
    readJson("package.json"),
    readJson("package-lock.json"),
  ])
  assert.equal(lockfile.version, packageJson.version)
  assert.equal(lockfile.packages[""].version, packageJson.version)
})

test("the built root runtime exports only declared public values", async () => {
  const declaration = await readFile(path.join(root, "dist/index.d.ts"), "utf8")
  const declaredValues = new Set(
    [...declaration.matchAll(/export\s*\{([^}]+)\}\s*from/g)].flatMap((match) =>
      match[1]
        .split(",")
        .map((part) => part.trim())
        .filter((part) => !part.startsWith("type "))
        .map((part) => part.split(/\s+as\s+/).at(-1))
    )
  )
  const runtimeValues = Object.keys(await import("../dist/index.js"))
  const runtimeOnly = runtimeValues.filter(
    (value) => !declaredValues.has(value)
  )

  assert.deepEqual(runtimeOnly, [])
})
