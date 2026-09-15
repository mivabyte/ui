import assert from "node:assert/strict"
import { access, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import {
  getModuleExportSubpaths,
  getModuleImportSpecifiers,
} from "./lib/package-exports.mjs"
import { prepareIsolatedPackageConsumer } from "./lib/isolated-package-consumer.mjs"
import { runCommand } from "./lib/process.mjs"

const root = path.resolve(import.meta.dirname, "..")
const rootPkg = JSON.parse(
  await readFile(path.join(root, "package.json"), "utf8")
)
const consumer = await prepareIsolatedPackageConsumer({
  root,
  tempPrefix: "mivabyte-ui-pack-",
  ignorePackScripts: true,
  additionalPackages: [
    `@types/react@${rootPkg.devDependencies?.["@types/react"] || "19"}`,
    `@types/react-dom@${rootPkg.devDependencies?.["@types/react-dom"] || "19"}`,
  ],
})

try {
  const { installedPackage, packageDir, workspace, commandOptions } = consumer
  const moduleSubpaths = getModuleExportSubpaths(installedPackage)
  const importSpecifiers = getModuleImportSpecifiers(installedPackage)

  const checkFile = path.join(workspace, "check.mjs")
  await writeFile(
    checkFile,
    `const specifiers = ${JSON.stringify(importSpecifiers)};\n` +
      "for (const specifier of specifiers) {\n" +
      "  const namespace = await import(specifier);\n" +
      "  if (Object.keys(namespace).length === 0) throw new Error(`Empty ESM module: ${specifier}`);\n" +
      "}\n" +
      "console.log(`Imported ${specifiers.length} public module entry points via ESM`);\n"
  )
  await runCommand(process.execPath, [checkFile], commandOptions)

  const checkCjsFile = path.join(workspace, "check.cjs")
  await writeFile(
    checkCjsFile,
    `const specifiers = ${JSON.stringify(importSpecifiers)};\n` +
      "for (const specifier of specifiers) {\n" +
      "  const mod = require(specifier);\n" +
      "  if (!mod || Object.keys(mod).length === 0) throw new Error(`Empty CJS module: ${specifier}`);\n" +
      "}\n" +
      "console.log(`Required ${specifiers.length} public module entry points via CJS`);\n"
  )
  await runCommand(process.execPath, [checkCjsFile], commandOptions)

  // Regression guard: TypeScript typecheck in a temp Node16/NodeNext consumer project with no @/* path mapping
  const tsconfigFile = path.join(workspace, "tsconfig.json")
  await writeFile(
    tsconfigFile,
    JSON.stringify(
      {
        compilerOptions: {
          module: "NodeNext",
          moduleResolution: "NodeNext",
          target: "ES2022",
          strict: true,
          noEmit: true,
          skipLibCheck: false,
          jsx: "react-jsx",
        },
        include: ["check-types.ts", "check-types.cts"],
      },
      null,
      2
    )
  )

  const checkTypesEsm = path.join(workspace, "check-types.ts")
  await writeFile(
    checkTypesEsm,
    [
      'import * as React from "react";',
      'import * as Root from "@mivabyte/ui";',
      'import { Button } from "@mivabyte/ui";',
      'import { Calendar } from "@mivabyte/ui/calendar";',
      'import { Carousel, CarouselNext, CarouselPrevious } from "@mivabyte/ui/carousel";',
      'import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@mivabyte/ui/chart";',
      'import { Field, FieldLabel } from "@mivabyte/ui/field";',
      'import { Sidebar, SidebarTrigger } from "@mivabyte/ui/sidebar";',
      "",
      "export type RootModule = typeof Root;",
      "export type ButtonComponent = typeof Button;",
      "export type CalendarComponent = typeof Calendar;",
      "export type CarouselComponent = typeof Carousel;",
      "export type CarouselNextComponent = typeof CarouselNext;",
      "export type CarouselPrevComponent = typeof CarouselPrevious;",
      "export type ChartContainerComponent = typeof ChartContainer;",
      "export type ChartTooltipComponent = typeof ChartTooltip;",
      "export type ChartTooltipContentComponent = typeof ChartTooltipContent;",
      "export type FieldComponent = typeof Field;",
      "export type FieldLabelComponent = typeof FieldLabel;",
      "export type SidebarComponent = typeof Sidebar;",
      "export type SidebarTriggerComponent = typeof SidebarTrigger;",
    ].join("\n")
  )

  const checkTypesCjs = path.join(workspace, "check-types.cts")
  await writeFile(
    checkTypesCjs,
    [
      'import * as React from "react";',
      'import * as Root from "@mivabyte/ui";',
      'import { Button } from "@mivabyte/ui";',
      'import { Calendar } from "@mivabyte/ui/calendar";',
      'import { Carousel, CarouselNext, CarouselPrevious } from "@mivabyte/ui/carousel";',
      'import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@mivabyte/ui/chart";',
      'import { Field, FieldLabel } from "@mivabyte/ui/field";',
      'import { Sidebar, SidebarTrigger } from "@mivabyte/ui/sidebar";',
      "",
      "export type CjsRootModule = typeof Root;",
      "export type CjsButtonComponent = typeof Button;",
      "export type CjsCalendarComponent = typeof Calendar;",
      "export type CjsCarouselComponent = typeof Carousel;",
      "export type CjsCarouselNextComponent = typeof CarouselNext;",
      "export type CjsCarouselPrevComponent = typeof CarouselPrevious;",
      "export type CjsChartContainerComponent = typeof ChartContainer;",
      "export type CjsChartTooltipComponent = typeof ChartTooltip;",
      "export type CjsChartTooltipContentComponent = typeof ChartTooltipContent;",
      "export type CjsFieldComponent = typeof Field;",
      "export type CjsFieldLabelComponent = typeof FieldLabel;",
      "export type CjsSidebarComponent = typeof Sidebar;",
      "export type CjsSidebarTriggerComponent = typeof SidebarTrigger;",
    ].join("\n")
  )

  const tscBin = path.join(root, "node_modules", "typescript", "bin", "tsc")
  await runCommand(
    process.execPath,
    [tscBin, "-p", tsconfigFile],
    commandOptions
  )
  console.log(
    "Successfully typechecked root, calendar, carousel, chart, field, and sidebar via TypeScript (NodeNext resolution)"
  )

  const declarationChecks = [
    "dist/index.d.ts",
    "dist/index.d.cts",
    "dist/components/ui/calendar.d.ts",
    "dist/components/ui/calendar.d.cts",
    "dist/components/ui/carousel.d.ts",
    "dist/components/ui/carousel.d.cts",
    "dist/components/ui/chart.d.ts",
    "dist/components/ui/chart.d.cts",
    "dist/components/ui/field.d.ts",
    "dist/components/ui/field.d.cts",
    "dist/components/ui/sidebar.d.ts",
    "dist/components/ui/sidebar.d.cts",
  ]
  for (const relPath of declarationChecks) {
    const full = path.join(packageDir, relPath)
    const content = await readFile(full, "utf8")
    assert(
      !content.includes("@/"),
      `Found unrewritten internal alias "@/" in ${relPath}`
    )
    assert(
      !content.includes("recharts/types/"),
      `Found deep recharts import "recharts/types/" in ${relPath}`
    )
    if (relPath.endsWith(".d.cts")) {
      assert(
        !content.includes("sourceMappingURL"),
        `Found sourceMappingURL comment in CommonJS declaration ${relPath}`
      )
    }
  }

  assert.deepEqual(installedPackage.sideEffects, ["**/*.css"])
  for (const stylesheet of ["styles.css"]) {
    assert.equal(
      installedPackage.exports[`./${stylesheet}`],
      `./dist/${stylesheet}`
    )
    await access(path.join(packageDir, "dist", stylesheet))
  }

  for (const [subpath, target] of Object.entries(installedPackage.exports)) {
    if (typeof target === "string") continue

    const esm = target.import
    const commonJs = target.require
    assert.equal(typeof esm, "object", `${subpath} is missing ESM export`)
    assert.equal(typeof commonJs, "object", `${subpath} is missing CJS export`)
    assert.equal(typeof esm.types, "string", `${subpath} is missing ESM types`)
    assert.equal(
      typeof esm.default,
      "string",
      `${subpath} is missing ESM runtime`
    )
    assert.equal(
      typeof commonJs.types,
      "string",
      `${subpath} is missing CommonJS types`
    )
    assert.equal(
      typeof commonJs.default,
      "string",
      `${subpath} is missing CommonJS runtime`
    )
    assert.equal(target.default, esm.default, `${subpath} default/ESM mismatch`)
    await access(path.join(packageDir, esm.default))
    await access(path.join(packageDir, commonJs.default))
    await access(path.join(packageDir, esm.types))
    await access(path.join(packageDir, commonJs.types))
  }

  console.log(
    `Validated packed ${installedPackage.name}@${installedPackage.version} with ${moduleSubpaths.length} module exports using ${consumer.packageLabel}`
  )
} finally {
  await consumer.cleanup()
}
