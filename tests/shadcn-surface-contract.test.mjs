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
  "context-menu",
  "data-table",
  "date-picker",
  "dialog",
  "direction",
  "drawer",
  "dropdown-menu",
  "empty",
  "field",
  "form",
  "hover-card",
  "input",
  "input-group",
  "input-otp",
  "item",
  "kbd",
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
  "sonner",
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

test("Base UI is a runtime dependency, scoped to the toast component", async () => {
  const packageJson = await readJson("package.json")
  // Upstream shadcn/ui implements `toast` on Base UI. That parity port is
  // deliberate, so the dependency is required rather than forbidden.
  //
  // It must be a RUNTIME dependency: `dist/components/ui/toast.js` imports it
  // and the published package ships `dist` only, so a devDependency would give
  // every consumer an unresolved-module error. Asserting against a merged map
  // would hide exactly that regression.
  const baseUiRange = packageJson.dependencies?.["@base-ui/react"]
  assert.equal(typeof baseUiRange, "string")
  assert.match(baseUiRange, /^\^1\./)
  assert.equal(packageJson.devDependencies?.["@base-ui/react"], undefined)
  assert.equal(packageJson.peerDependencies?.["@base-ui/react"], undefined)

  // Walk all of src/ recursively. A Base UI import in src/hooks or src/lib must
  // be visible too, and a nested component directory must not escape the scan.
  const walk = async (dir) => {
    const found = []
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        found.push(...(await walk(full)))
      } else if (/\.tsx?$/.test(entry.name)) {
        found.push(full)
      }
    }
    return found
  }
  const entries = await Promise.all(
    (await walk(path.join(root, "src"))).map(async (file) => ({
      file: path.relative(path.join(root, "src"), file),
      source: await readFile(file, "utf8"),
    }))
  )

  // Base UI stays opt-in: only the upstream `toast` port may reach for it.
  const baseUiConsumers = entries
    .filter(({ source }) => /@base-ui\/react/.test(source))
    .map(({ file }) => file)
  assert.deepEqual(baseUiConsumers, [
    path.join("components", "ui", "toast.tsx"),
  ])

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

test("the built root entry keeps colliding export names resolvable", async () => {
  // `sonner` and `toast` both publish a `Toaster`. A wildcard re-export from
  // both makes the name an ambiguous star export, which ESM silently drops
  // (CommonJS would last-write-wins instead), so the two module systems would
  // disagree. The generated root entry must alias the sonner wrapper.
  const esm = await import("../dist/index.js")
  // Node's CJS named-export detection does not see `Object.assign(exports, ...)`
  // spreads, so read the CommonJS surface off the default interop export.
  const cjs = (await import("../dist/index.cjs")).default

  // Both must resolve in both module systems, and the two Toasters must be
  // genuinely different components (base-ui vs sonner). The ESM and CJS
  // builds are separate compilations, so identities are not shared across them.
  for (const surface of [esm, cjs]) {
    assert.equal(typeof surface.Toaster, "function")
    assert.equal(typeof surface.SonnerToaster, "function")
    assert.notEqual(surface.Toaster, surface.SonnerToaster)
  }
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
