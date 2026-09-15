import { readFileSync, readdirSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import * as publicApi from "../../src/index"

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

describe("official shadcn component surface", () => {
  it("contains exactly the official component set in source and public subpaths", () => {
    const sourceComponents = readdirSync(componentDirectory)
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => file.replace(/\.tsx$/, ""))
      .sort()
    const packageComponents = Object.keys(packageJson.exports)
      .filter((subpath) => subpath.startsWith("./"))
      .map((subpath) => subpath.slice(2))
      .filter((subpath) => officialComponents.includes(subpath))
      .sort()

    expect(sourceComponents).toEqual([...officialComponents].sort())
    expect(packageComponents).toEqual([...officialComponents].sort())
  })

  it("keeps every official component in the root barrel without Base UI", () => {
    const rootComponentPaths = new Set(
      [...rootBarrel.matchAll(/from "\.\/components\/ui\/([^"\n]+)"/g)].map(
        (match) => match[1]
      )
    )
    const sourceText = readdirSync(componentDirectory)
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => readFileSync(path.join(componentDirectory, file), "utf8"))
      .join("\n")

    expect([...rootComponentPaths].sort()).toEqual(
      [...officialComponents].sort()
    )
    expect(sourceText).not.toContain("@base-ui/react")
    expect(publicApi).toEqual(
      expect.objectContaining({
        Button: expect.anything(),
        DirectionProvider: expect.anything(),
        Toast: expect.anything(),
      })
    )
  })
})
