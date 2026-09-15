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

if (fs.existsSync(path.join(dist, "lib", "utils.js"))) {
  esmModules.push("./lib/utils.js")
}

if (esmModules.length === 0) {
  throw new Error("No built public modules found in dist/")
}

const esm = [
  ...esmModules.map((modulePath) => `export * from "${modulePath}";`),
  "",
].join("\n")
const cjs = [
  ...esmModules.map(
    (modulePath) =>
      `Object.assign(exports, require("${modulePath.replace(/\.js$/, ".cjs")}"));`
  ),
  "",
].join("\n")

fs.writeFileSync(path.join(dist, "index.js"), esm)
fs.writeFileSync(path.join(dist, "index.cjs"), cjs)
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
