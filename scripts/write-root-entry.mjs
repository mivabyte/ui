import fs from "node:fs"
import path from "node:path"

const dist = path.resolve(process.cwd(), "dist")

if (!fs.existsSync(dist)) {
  throw new Error(
    "dist/ does not exist — run the package build before generating the root entry"
  )
}

const componentDir = path.join(dist, "components", "ui")
const esmModules = fs
  .readdirSync(componentDir)
  .filter((name) => name.endsWith(".js") && !name.endsWith(".js.map"))
  .map((name) => `./components/ui/${name}`)
  .sort()

// `sonner` and `toast` both export a component named `Toaster`. A bare
// `export *` from both makes the name an ambiguous star export, which ESM
// silently drops (while CommonJS last-write-wins) — so the root entry would
// resolve to `undefined` at runtime in ESM only. Emit an explicit alias for
// these modules instead of a wildcard re-export.
//
// Keep this map in sync with `src/index.ts`, which is the typed source of
// truth for the public surface, and assert below that no undeclared collision
// has crept in.
const rootExportAliases = {
  "./components/ui/sonner.js": { Toaster: "SonnerToaster" },
}

if (fs.existsSync(path.join(dist, "lib", "utils.js"))) {
  esmModules.push("./lib/utils.js")
}

if (esmModules.length === 0) {
  throw new Error("No built public modules found in dist/")
}

// ---------------------------------------------------------------------------
// Export-name scraping
// ---------------------------------------------------------------------------

// Export names are scraped out of built JavaScript with a regex and then
// spliced verbatim into generated code (`exports.<name> = mod.<name>` in
// dist/index.cjs, `export { <name> } from "..."` in dist/index.js). ES2022
// permits arbitrary string module-namespace names — `export { x as "a; foo()" }`
// is legal — so a scraped name is not automatically a safe token. Only plain
// identifiers may be spliced; anything else is rejected before it can reach the
// published bundle.
const IDENTIFIER_PATTERN = /^[A-Za-z0-9_$]+$/

function assertSpliceableIdentifier(name, modulePath, role) {
  if (IDENTIFIER_PATTERN.test(name)) return
  throw new Error(
    `Refusing to generate the root entry: ${modulePath} ${role} ${JSON.stringify(
      name
    )} is not a valid JavaScript identifier. Only /^[A-Za-z0-9_$]+$/ can be ` +
      `spliced into dist/index.js and dist/index.cjs.`
  )
}

// Two constructs are deliberately unsupported and are detected rather than
// silently ignored, because the scraper below is a text heuristic over bundled
// output and would otherwise produce a wrong public surface without any signal:
//
// 1. `export * from "..."` (including `export * as ns from "..."`). The scraper
//    can only see names spelled out in the file, so names inherited through a
//    star re-export are invisible to it. That makes the collision check blind:
//    two modules could each re-export the same name transitively, the star
//    export in dist/index.js would then be ambiguous, and ESM would silently
//    drop it — precisely the failure `rootExportAliases` exists to prevent.
//    (Note that `export *` never re-exports `default` either.)
//
// 2. `default`, in any of its three spellings — `export default X`,
//    `export { X as default }` and `export { default } from "..."`. Because
//    `export *` deliberately does not forward `default`, such a module would
//    publish `default` from dist/index.cjs (`Object.assign` copies every key)
//    but not from dist/index.js — an ESM/CommonJS divergence in the published
//    surface — and `default` has no canonical owner among the public modules
//    anyway.
//
// Neither is used today: tsup bundles every public module into a self-contained
// file with a single explicit `export { ... }` statement. Failing loudly costs
// nothing today and prevents a silently wrong surface tomorrow. If one ever
// appears, re-export it explicitly from `src/index.ts` and, if the name
// collides, declare it in `rootExportAliases`.
const STAR_EXPORT_PATTERN = /^[ \t]*export\s*\*/m
// One anchored pass over every export form the bundler can emit:
// `export default ...`, `export { ... }`, and
// `export const|let|var|function|class|async function <name>`. Anchoring to the
// start of a line is deliberate — it keeps the scan from matching the word
// `export` inside a string literal or a comment in bundled dependency code.
const EXPORT_PATTERN =
  /^[ \t]*export\s*(?:default\b|\{([^}]*)\}|(?:const|let|var|function|class|async\s+function)\s+([A-Za-z0-9_$]+))/gm

// Parses the body of an `export { ... }` clause into the names it publishes.
// `a`, `a as b` and `type a as b` all publish the rightmost identifier, which
// is also the one that ends up in the module namespace.
function parseSpecifierList(body) {
  return body
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) =>
      entry
        .split(/\s+as\s+/)
        .at(-1)
        .trim()
    )
    .map((name) => name.replace(/^type\s+/, ""))
}

function collectExportNames(modulePath, source) {
  if (STAR_EXPORT_PATTERN.test(source)) {
    throw new Error(
      `Refusing to generate the root entry: ${modulePath} re-exports via ` +
        `\`export *\`, whose inherited names cannot be read reliably from ` +
        `built output. Re-export the names explicitly from src/index.ts and ` +
        `declare any collision in rootExportAliases.`
    )
  }

  const names = new Set()
  for (const match of source.matchAll(EXPORT_PATTERN)) {
    if (match[1] !== undefined) {
      for (const name of parseSpecifierList(match[1])) {
        names.add(name)
      }
    } else if (match[2] !== undefined) {
      names.add(match[2])
    } else {
      // `export default ...` publishes exactly one name: `default`.
      names.add("default")
    }
  }

  // `default` is rejected by name rather than by pattern so that all three of
  // its spellings are covered: `export default X`, `export { X as default }`
  // and `export { default } from "..."`.
  if (names.has("default")) {
    throw new Error(
      `Refusing to generate the root entry: ${modulePath} publishes a default ` +
        `export, which \`export *\` would not forward to dist/index.js even ` +
        `though dist/index.cjs would publish it. Re-export the value under a ` +
        `named export from src/index.ts.`
    )
  }

  // A module whose exports the scraper cannot see at all would make the
  // collision check below silently blind, so treat it as a hard failure rather
  // than emitting an entry that is missing names. This is the safety net for a
  // future change to the bundler's output shape.
  if (names.size === 0) {
    throw new Error(
      `Refusing to generate the root entry: no export names could be read from ` +
        `${modulePath}. The export scraper in scripts/write-root-entry.mjs ` +
        `assumes statements of the form \`export { ... }\` on their own line.`
    )
  }

  return names
}

// Collect every export name each built module publishes, so a duplicated name
// can be detected before the entry is written.
const moduleExports = new Map()
const owners = new Map()
for (const modulePath of esmModules) {
  const source = fs.readFileSync(path.join(dist, modulePath), "utf8")
  const names = collectExportNames(modulePath, source)
  for (const name of names) {
    assertSpliceableIdentifier(name, modulePath, "publishes the export name")
    owners.set(name, [...(owners.get(name) ?? []), modulePath])
  }
  moduleExports.set(modulePath, names)
}

for (const [modulePath, aliases] of Object.entries(rootExportAliases)) {
  if (!moduleExports.has(modulePath)) {
    throw new Error(
      `rootExportAliases declares an entry for ${modulePath}, but that module ` +
        `is not part of the built public surface.`
    )
  }
  for (const [name, alias] of Object.entries(aliases)) {
    if (!moduleExports.get(modulePath).has(name)) {
      throw new Error(
        `rootExportAliases aliases ${name} for ${modulePath}, but that module ` +
          `does not publish it.`
      )
    }
    assertSpliceableIdentifier(alias, modulePath, "declares the alias")
  }
}

// ---------------------------------------------------------------------------
// Entry generation
// ---------------------------------------------------------------------------

// An aliased module must be re-exported by explicit name. A wildcard would
// still publish the bare name and keep the star export ambiguous, so the
// alias would never resolve.
const esmLines = esmModules.map((modulePath) => {
  const specifier = JSON.stringify(modulePath)
  const aliases = rootExportAliases[modulePath]
  if (!aliases) {
    return `export * from ${specifier};`
  }
  const specifiers = [
    ...[...moduleExports.get(modulePath)].filter((name) => !(name in aliases)),
    ...Object.entries(aliases).map(([name, alias]) => `${name} as ${alias}`),
  ]
  // An explicit clause with no specifiers is the only correct output when every
  // name of a module is aliased away: falling back to a wildcard here would
  // re-publish the bare names and make the star export ambiguous again.
  return `export { ${specifiers.join(", ")} } from ${specifier};`
})
const esm = [...esmLines, ""].join("\n")

const cjsLines = esmModules.map((modulePath) => {
  const specifier = JSON.stringify(modulePath.replace(/\.js$/, ".cjs"))
  const aliases = rootExportAliases[modulePath]
  if (!aliases) {
    return `Object.assign(exports, require(${specifier}));`
  }
  // A wildcard assign would publish the bare name too, so name each export and
  // apply the alias explicitly.
  const assignments = [
    ...[...moduleExports.get(modulePath)]
      .filter((name) => !(name in aliases))
      .map((name) => `exports.${name} = mod.${name};`),
    ...Object.entries(aliases).map(
      ([name, alias]) => `exports.${alias} = mod.${name};`
    ),
  ]
  return [`const mod = require(${specifier});`, ...assignments].join("\n")
})
const cjs = [...cjsLines, ""].join("\n")

// ---------------------------------------------------------------------------
// Validation — everything above must pass before a single byte is written
// ---------------------------------------------------------------------------

// Fail loudly rather than ship a binding that ESM silently drops: any
// duplicated export name must be aliased in every module that publishes it.
const aliasedPairs = new Set()
for (const [modulePath, aliases] of Object.entries(rootExportAliases)) {
  for (const name of Object.keys(aliases)) {
    aliasedPairs.add(`${modulePath}::${name}`)
  }
}

const collisions = [...owners.entries()]
  .filter(
    ([name, modulePaths]) =>
      modulePaths.length > 1 &&
      // Exactly one module may keep the canonical bare name; every other owner
      // must alias it away, otherwise the star export stays ambiguous.
      modulePaths.filter((owner) => !aliasedPairs.has(`${owner}::${name}`))
        .length > 1
  )
  .map(([name, modulePaths]) => ({ name, modulePaths }))

if (collisions.length > 0) {
  throw new Error(
    `Ambiguous root exports would be dropped by ESM. Add an entry to ` +
      `rootExportAliases in scripts/write-root-entry.mjs for: ` +
      collisions
        .map(
          ({ name, modulePaths }) => `${name} (from ${modulePaths.join(", ")})`
        )
        .join("; ") +
      `.`
  )
}

// Both entries are generated only after every check above has passed, so a
// failure never leaves a half-written or wrong barrel behind. Each write goes to
// a dot-prefixed temporary name and is renamed into place, so even an interrupt
// cannot truncate a previously valid entry (and npm never packs dotfiles).
function writeEntry(fileName, contents) {
  const target = path.join(dist, fileName)
  const temporary = path.join(dist, `.${fileName}.tmp`)
  fs.writeFileSync(temporary, contents)
  fs.renameSync(temporary, target)
}

writeEntry("index.js", esm)
writeEntry("index.cjs", cjs)
console.log(`Wrote lazy root entries for ${esmModules.length} public modules`)

function resolveSpecifier(specifier, declaringFilePath, distDir, extension) {
  // 1. Transform internal alias "@/*" specifiers
  if (specifier === "@" || specifier.startsWith("@/")) {
    const subpath = specifier === "@" ? "" : specifier.slice(2)
    const targetPath = path.resolve(distDir, subpath)
    let resolvedTarget = targetPath
    try {
      if (
        fs.existsSync(resolvedTarget) &&
        fs.statSync(resolvedTarget).isDirectory()
      ) {
        resolvedTarget = path.join(resolvedTarget, "index")
      }
    } catch {}

    const declaringDir = path.dirname(declaringFilePath)
    let relativePath = path.relative(declaringDir, resolvedTarget)
    relativePath = relativePath.split(path.sep).join("/")
    if (!relativePath.startsWith(".")) {
      relativePath = "./" + relativePath
    }

    const currentExt = path.posix.extname(relativePath)
    if (currentExt) {
      if (currentExt === ".js" && extension === ".cjs") {
        return relativePath.slice(0, -3) + ".cjs"
      }
      return relativePath
    }
    return relativePath + extension
  }

  // 2. Relative specifiers ("./*" or "../*")
  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    const declaringDir = path.dirname(declaringFilePath)
    const targetPath = path.resolve(declaringDir, specifier)
    try {
      if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
        specifier = specifier.endsWith("/")
          ? specifier + "index"
          : specifier + "/index"
      }
    } catch {}

    const currentExt = path.posix.extname(specifier)
    if (!currentExt) {
      return specifier + extension
    }
    if (currentExt === ".js" && extension === ".cjs") {
      return specifier.slice(0, -3) + ".cjs"
    }
    return specifier
  }

  // 3. Bare / external specifiers (preserved as is)
  return specifier
}

function rewriteDeclarationSpecifiers(
  content,
  declaringFilePath,
  distDir,
  extension
) {
  const rewrite = (specifier) =>
    resolveSpecifier(specifier, declaringFilePath, distDir, extension)

  return content
    .replace(
      /(\bfrom\s*)(['"])(\S+?)\2/g,
      (_, prefix, quote, specifier) =>
        `${prefix}${quote}${rewrite(specifier)}${quote}`
    )
    .replace(
      /(\bimport\s*\(\s*)(['"])(\S+?)\2(\s*\))/g,
      (_, open, quote, specifier, close) =>
        `${open}${quote}${rewrite(specifier)}${quote}${close}`
    )
    .replace(
      /(\bimport\s+)(['"])(\S+?)\2/g,
      (_, open, quote, specifier) =>
        `${open}${quote}${rewrite(specifier)}${quote}`
    )
}

function stripSourceMappingURL(content) {
  const stripped = content
    .replace(/\r?\n?\/\/[#@] sourceMappingURL=[^\r\n]*/g, "")
    .replace(/\r?\n?\/\*# sourceMappingURL=.*?\*\//g, "")
    .trimEnd()
  return stripped ? stripped + "\n" : ""
}

function processDeclarations(dir) {
  let count = 0
  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      count += processDeclarations(fullPath)
    } else if (entry.name.endsWith(".d.ts")) {
      const originalText = fs.readFileSync(fullPath, "utf8")
      const esmText = rewriteDeclarationSpecifiers(
        originalText,
        fullPath,
        dist,
        ".js"
      )
      fs.writeFileSync(fullPath, esmText)

      const cjsText = stripSourceMappingURL(
        rewriteDeclarationSpecifiers(originalText, fullPath, dist, ".cjs")
      )
      const ctsPath = fullPath.replace(/\.d\.ts$/, ".d.cts")
      fs.writeFileSync(ctsPath, cjsText)

      count++
    }
  }
  return count
}

const declarationCount = processDeclarations(dist)
console.log(
  `Processed ${declarationCount} declaration files and emitted CommonJS counterparts (.d.cts)`
)
