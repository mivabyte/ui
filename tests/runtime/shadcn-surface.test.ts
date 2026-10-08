import { readFileSync, readdirSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import * as publicApi from "../../src/index"
import * as sonnerExports from "../../src/components/ui/sonner"
import * as toastExports from "../../src/components/ui/toast"

const repo = process.cwd()
const componentDirectory = path.join(repo, "src", "components", "ui")
const packageJson = JSON.parse(
  readFileSync(path.join(repo, "package.json"), "utf8")
)
const rootBarrel = readFileSync(path.join(repo, "src", "index.ts"), "utf8")

const officialComponents = [
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

const publicComponents = [...officialComponents, "media-player"]

describe("official shadcn components and Mivabyte additions", () => {
  it("contains exactly the official component set in source and public subpaths", () => {
    const sourceComponents = readdirSync(componentDirectory)
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => file.replace(/\.tsx$/, ""))
      .sort()
    const packageComponents = Object.keys(packageJson.exports)
      .filter((subpath) => subpath.startsWith("./"))
      .map((subpath) => subpath.slice(2))
      .filter((subpath) => publicComponents.includes(subpath))
      .sort()

    expect(sourceComponents).toEqual([...publicComponents].sort())
    expect(packageComponents).toEqual([...publicComponents].sort())
  })

  it("keeps every official component in the root barrel", () => {
    const rootComponentPaths = new Set(
      [...rootBarrel.matchAll(/from "\.\/components\/ui\/([^"\n]+)"/g)].map(
        (match) => match[1]
      )
    )

    expect([...rootComponentPaths].sort()).toEqual([...publicComponents].sort())
    expect(publicApi).toEqual(
      expect.objectContaining({
        Button: expect.anything(),
        MediaPlayer: expect.anything(),
        DirectionProvider: expect.anything(),
        Form: expect.anything(),
        Toaster: expect.anything(),
        Toast: expect.anything(),
      })
    )
  })

  it("resolves the canonical Toaster to base-ui and aliases sonner's", () => {
    // `sonner` and `toast` both export a `Toaster`. Assert identity, not mere
    // existence: a swap between the two would leave every `expect.anything()`
    // check above satisfied.
    expect(publicApi.Toaster).toBe(toastExports.Toaster)
    expect(publicApi.SonnerToaster).toBe(sonnerExports.Toaster)
    expect(publicApi.SonnerToaster).not.toBe(publicApi.Toaster)
  })

  it("confines Base UI to the upstream toast port", () => {
    // Walk all of src/ recursively so a Base UI import in src/hooks or
    // src/lib, or a nested component directory, cannot escape the scan.
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) return walk(full)
        return /\.tsx?$/.test(entry.name) ? [full] : []
      })

    const baseUiConsumers = walk(path.join(repo, "src"))
      .filter((file) => readFileSync(file, "utf8").includes("@base-ui/react"))
      .map((file) => path.relative(path.join(repo, "src"), file))

    expect(baseUiConsumers).toEqual([
      path.join("components", "ui", "toast.tsx"),
    ])
  })
})
