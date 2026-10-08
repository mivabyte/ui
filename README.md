# @mivabyte/ui

<div align="center">

[![Version](https://img.shields.io/npm/v/@mivabyte/ui?color=0ea5e9&label=version)](https://www.npmjs.com/package/@mivabyte/ui)
[![CI Verification](https://github.com/mivabyte/ui/actions/workflows/verify.yml/badge.svg?branch=main)](https://github.com/mivabyte/ui/actions/workflows/verify.yml)
[![Browser Tests](https://github.com/mivabyte/ui/actions/workflows/browser.yml/badge.svg?branch=main)](https://github.com/mivabyte/ui/actions/workflows/browser.yml)
[![Consumer Tests](https://github.com/mivabyte/ui/actions/workflows/consumer.yml/badge.svg?branch=main)](https://github.com/mivabyte/ui/actions/workflows/consumer.yml)
[![CodeQL](https://github.com/mivabyte/ui/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/mivabyte/ui/actions/workflows/codeql.yml)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![A11y WCAG AA](https://img.shields.io/badge/A11y-WCAG%202.1%20AA-success.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**The production-grade React 19 UI component system and semantic design tokens for high-craft applications, dashboards, and marketing surfaces.**

[Quick Start](#quick-start) •
[Component Catalog](#component-catalog) •
[Design System](#design-system-and-tokens) •
[Accessibility](#accessibility--motion) •
[Storybook](https://github.com/mivabyte/ui) •
[Documentation](docs/components.md)

</div>

---

## Highlights

- **📦 Zero Copy-Paste Required**: Shipped as a fully compiled npm package (`@mivabyte/ui`) with dual ESM and CommonJS exports and bundled TypeScript declarations.
- **🎨 Charcoal, Cyan & Apricot Visual System**: Semantic HSL channels combine neutral charcoal dark surfaces, cool off-white light surfaces, cyan primary actions, and warm Apricot secondary actions.
- **⚡ 67 Production-Ready Component Modules**: Built on battle-tested Radix UI and Base UI primitives, from buttons and responsive dialogs to headless data tables and Recharts visualizations.
- **🎯 Precise Subpath Imports**: Fine-grained subpath exports (`@mivabyte/ui/button`, `@mivabyte/ui/card`, `@mivabyte/ui/dialog`) bypass the root barrel, so the dependency graph stays explicit per component.
- **♿ WCAG 2.1 AA Compliance Built-In**: Fully tested with Axe Core across all components. Keyboard traps, accessible dialog lifecycles, ARIA roles, and high-contrast focus outlines work out of the box.
- **📏 Adaptive Density Scaling**: Seamlessly switch between spacious touch-friendly `comfortable` mode and information-dense `compact` desktop mode via `data-density`.
- **🔤 Self-Hosted Typography**: The Onest variable font is self-hosted and compiled directly into `@mivabyte/ui/styles.css` with zero external Google Fonts network dependencies.
- **🚀 Native React 19 & Next.js App Router**: Zero runtime CSS-in-JS overhead; fully compatible with React Server Components (RSC), Next.js 15+, Vite, and modern bundlers.

---

## Installation

Install `@mivabyte/ui` and its peer dependencies into your project:

```bash
# npm
npm install @mivabyte/ui

# pnpm
pnpm add @mivabyte/ui

# yarn
yarn add @mivabyte/ui

# bun
bun add @mivabyte/ui
```

Requires **Node.js >= 22** and `react >= 19.0.0` / `react-dom >= 19.0.0`.

`zod`, `@hookform/resolvers`, and `@tanstack/react-table` are optional peers, not
bundled dependencies: this package never imports them, so install them yourself
only if you wire a schema resolver or compose `DataTable` with a TanStack table
instance.

---

## Quick start

### 1. Import Global Styles

Import `@mivabyte/ui/styles.css` once at your application root (e.g. `app/layout.tsx`, `src/main.tsx`, or `_app.tsx`). It bundles Tailwind CSS utilities, self-hosted Onest variable fonts, and core design tokens:

```tsx
// app/layout.tsx (Next.js App Router) or src/main.tsx (Vite)
import "@mivabyte/ui/styles.css"
```

### 2. Compose Your Application

```tsx
import * as React from "react"
import { Button } from "@mivabyte/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@mivabyte/ui/card"
import { Field, FieldDescription, FieldLabel } from "@mivabyte/ui/field"
import { Input } from "@mivabyte/ui/input"
import { Toaster, toast } from "@mivabyte/ui/toast"

export function ProjectSetup() {
  const [name, setName] = React.useState("")

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-background text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
          <CardDescription>
            Configure your workspace deployment settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel htmlFor="project-name">Project name</FieldLabel>
            <Input
              id="project-name"
              placeholder="e.g. Apollo Telemetry"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <FieldDescription>
              Unique identifier used in API routing and logs.
            </FieldDescription>
          </Field>

          <Button
            className="w-full"
            size="default"
            onClick={() => toast.add({ title: "Workspace deployed" })}
          >
            Deploy workspace
          </Button>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}
```

---

## Import Architecture

`@mivabyte/ui` provides dual export paths to support both granular bundle optimization and rapid prototyping.

### Subpath Imports (Recommended)

Subpath imports bypass the root barrel file, so only the modules you reference enter the build:

```tsx
import { Button } from "@mivabyte/ui/button"
import { Card, CardContent, CardHeader } from "@mivabyte/ui/card"
import { DataTable } from "@mivabyte/ui/data-table"
import { Dialog, DialogContent, DialogTrigger } from "@mivabyte/ui/dialog"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@mivabyte/ui/field"
import { Input } from "@mivabyte/ui/input"
import { ChartContainer, ChartTooltip } from "@mivabyte/ui/chart"
import { Sidebar, SidebarTrigger } from "@mivabyte/ui/sidebar"
```

### Root Barrel Import

For rapid prototyping or small script bundles, all components and utilities are also accessible from the package root:

```tsx
import { Badge, Button, Card, Dialog, Input, Tabs, Tooltip } from "@mivabyte/ui"
```

Both `sonner` and `toast` ship a component named `Toaster`, so the root barrel
keeps the canonical `Toaster` name for the Base UI toast host and re-exports the
sonner wrapper as `SonnerToaster`:

```tsx
import { SonnerToaster, Toaster } from "@mivabyte/ui"
```

`<SonnerToaster />` is the theme-aware wrapper around sonner: it reads the active
theme through `next-themes` (falling back to `system` when no theme provider is
present) and maps the token variables onto sonner's own options. Import it from
`@mivabyte/ui/sonner` when you want an unambiguous reference.

> **Authoritative Export Catalog**: For the complete machine-verified subpath and module inventory, consult [`docs/generated/exports.md`](docs/generated/exports.md).

---

## Component Catalog

`@mivabyte/ui` contains **67 component modules**, grouped into logical architectural families:

| Category                   | Primitives & Modules                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| :------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actions & Triggers**     | [`Button`](docs/components.md#button), [`ButtonGroup`](docs/components.md#button-group), [`Toggle`](docs/components.md#toggle), [`ToggleGroup`](docs/components.md#toggle-group)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Forms & User Input**     | [`Field`](docs/components.md#field), [`Form`](docs/components.md#form), [`Input`](docs/components.md#input), [`InputGroup`](docs/components.md#input-group), [`InputOTP`](docs/components.md#input-otp), [`Textarea`](docs/components.md#textarea), [`Checkbox`](docs/components.md#checkbox), [`RadioGroup`](docs/components.md#radio-group), [`Select`](docs/components.md#select), [`NativeSelect`](docs/components.md#native-select), [`Switch`](docs/components.md#switch), [`Slider`](docs/components.md#slider), [`DatePicker`](docs/components.md#date-picker), [`Calendar`](docs/components.md#calendar), [`Combobox`](docs/components.md#combobox), [`Questionnaire`](docs/components.md#questionnaire) |
| **Overlays & Dialogs**     | [`Dialog`](docs/components.md#dialog), [`AlertDialog`](docs/components.md#alert-dialog), [`Sheet`](docs/components.md#sheet), [`Drawer`](docs/components.md#drawer), [`Popover`](docs/components.md#popover), [`Tooltip`](docs/components.md#tooltip), [`HoverCard`](docs/components.md#hover-card), [`ContextMenu`](docs/components.md#context-menu), [`DropdownMenu`](docs/components.md#dropdown-menu), [`Command`](docs/components.md#command)                                                                                                                                                                                                                                                                |
| **Navigation**             | [`NavigationMenu`](docs/components.md#navigation-menu), [`Breadcrumb`](docs/components.md#breadcrumb), [`Pagination`](docs/components.md#pagination), [`Tabs`](docs/components.md#tabs), [`Menubar`](docs/components.md#menubar), [`Sidebar`](docs/components.md#sidebar), [`Direction`](docs/components.md#direction)                                                                                                                                                                                                                                                                                                                                                                                            |
| **Layout & Structure**     | [`Card`](docs/components.md#card), [`Separator`](docs/components.md#separator), [`Resizable`](docs/components.md#resizable), [`ScrollArea`](docs/components.md#scroll-area), [`AspectRatio`](docs/components.md#aspect-ratio), [`Collapsible`](docs/components.md#collapsible), [`Accordion`](docs/components.md#accordion)                                                                                                                                                                                                                                                                                                                                                                                       |
| **Data Display & Content** | [`DataTable`](docs/components.md#data-table), [`Table`](docs/components.md#table), [`Badge`](docs/components.md#badge), [`Avatar`](docs/components.md#avatar), [`Skeleton`](docs/components.md#skeleton), [`Empty`](docs/components.md#empty), [`Item`](docs/components.md#item), [`Bubble`](docs/components.md#bubble), [`Attachment`](docs/components.md#attachment), [`Marker`](docs/components.md#marker), [`Message`](docs/components.md#message), [`MessageScroller`](docs/components.md#message-scroller), [`Carousel`](docs/components.md#carousel), [`Kbd`](docs/components.md#kbd)                                                                                                                      |
| **Typography**             | [`Heading`](docs/components.md#typography), [`Text`](docs/components.md#typography), [`Eyebrow`](docs/components.md#typography), [`Label`](docs/components.md#label)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Feedback & Status**      | [`Alert`](docs/components.md#alert), [`Progress`](docs/components.md#progress), [`Spinner`](docs/components.md#spinner), [`Toast`](docs/components.md#toast) (`Toaster`, `toast`), [`Sonner`](docs/components.md#sonner) (`Toaster`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Data Visualization**     | [`Chart`](docs/components.md#chart) (`ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

The Mivabyte [`MediaPlayer`](docs/components.md#media-player) adds native video playback with themed controls and automatic pause outside the viewport.

Every link above opens that component's entry in [`docs/components.md`](docs/components.md), the per-slug inventory of import subpaths, runtime exports, and exported types. Props, variants, and runtime behavior are documented in Storybook rather than duplicated here; [`docs/generated/exports.md`](docs/generated/exports.md) is the machine-verified subpath and artifact map.

---

## Design System and Tokens

The Mivabyte design system balances technical precision with warm human typography and deliberate visual depth. Read [DESIGN.md](DESIGN.md) for the complete design contract.

### Cyan-led Multicolor Palette

Brand Cyan remains `#06B6D4`. Light primary actions use dark Cyan (`#0E7490`) with white labels; dark primary actions use brand Cyan with charcoal labels (`#121212`). Links and essential control strokes use a separate `--link` role: dark Cyan (`#0E7490`) on light surfaces and exact brand Cyan on dark surfaces. Use `text-link` for links and readable cyan text; `bg-primary text-primary-foreground` for filled actions.

Cyan stays the main color. Apricot identifies secondary actions; Cyan tints identify selections; Amber marks attention, Emerald success, Coral errors, and Azure information. Each family has readable light/dark shades rather than making every component cyan.

The [research rationale and measured contrasts](docs/palette-research.md) explain the evidence behind these roles. Secondary buttons use warm Apricot surfaces (`#FFEDD5` / `#4A2816`) with readable text and borders. Cyan tints (`#CFFAFE` / `#083344`) identify selection. Highlighted cards keep a neutral content surface with a Cyan border. Use `text-secondary-strong` for warm supporting emphasis and `text-accent-strong` for Cyan emphasis.

| Family  | Brand color | UI role                                            |
| ------- | ----------- | -------------------------------------------------- |
| Cyan    | `#06B6D4`   | Primary actions, links, focus, selected navigation |
| Apricot | `#FDBA74`   | Secondary actions and supporting context           |
| Amber   | `#F59E0B`   | Warnings and attention                             |
| Emerald | `#10B981`   | Success and positive trends                        |
| Coral   | `#F43F5E`   | Errors and destructive actions                     |
| Azure   | `#3B82F6`   | Information and processing                         |

| Role           | Light mode | Dark mode |
| -------------- | ---------- | --------- |
| Primary fill   | `#0E7490`  | `#06B6D4` |
| Background     | `#F8FAFC`  | `#121212` |
| Cards          | `#FFFFFF`  | `#1C1C1C` |
| Main text      | `#0F172A`  | `#FAFAFA` |
| Secondary text | `#475569`  | `#A6A6A6` |
| Borders        | `#CBD5E1`  | `#3D3D3D` |
| Links          | `#0E7490`  | `#06B6D4` |

`--brand-cyan-500`, `--mivabyte-main`, `--mivabyte-cyan`, and `--mivabyte-cyan-dark` resolve to exact `#06B6D4`. The existing HSL-channel convention preserves these hex colors at full precision. Filled button borders match their fill, and checked switches use the primary foreground color. Outline buttons use `--button-outline-border`; inputs retain `--input` boundaries. Focus rings, slider/progress fills, and radio indicators use readable cyan strokes.

Dark sections use `#181818`, elevated surfaces use `#292929`, and interactive surfaces use `#333333`. Legacy `--mivabyte-midnight` primitives retain their brand colors; use semantic surface tokens for themed UI.

To enable dark mode, toggle the `.dark` class on the `<html>` or `<body>` element:

```html
<html class="dark">
  <!-- Themed automatically -->
</html>
```

### Surface Elevation Hierarchy

Elevation in Mivabyte UI is communicated via structured tonal layers rather than exaggerated shadows:

```
Canvas (--background)
  └── Section Layer (--section)
        └── Card / Surface Layer (--surface)
              └── Floating / Elevated Layer (--surface-elevated, --popover)
                    └── Interactive Highlight (--surface-interactive)
```

### Density Control

Mivabyte UI supports contextual interface density via the `data-density` attribute:

- `data-density="comfortable"` _(Default)_: 44px control height, spacious touch padding, fluid reading rhythms.
- `data-density="compact"`: 32px control height on desktop, tight information hierarchy designed for data grids and dense operator consoles.

```tsx
{
  /* Dense workspace region */
}
;<div data-density="compact" className="space-y-2">
  <Input placeholder="Filter records..." />
  <Button size="compact">Search</Button>
</div>
```

> **Touch Target Safety**: When viewed on touch devices or coarse pointers, Mivabyte UI automatically retains accessible 44px minimum target areas even in `compact` density mode.

### Typography System

The visual role of text is strictly separated from the underlying semantic HTML element:

```tsx
import { Heading, Text, Eyebrow } from "@mivabyte/ui/typography"

;<section className="space-y-3">
  <Eyebrow>Platform Architecture</Eyebrow>
  <Heading variant="display" render={<h1 />}>
    Engineered for mission-critical velocity.
  </Heading>
  <Text variant="lead">
    High-craft components with zero-compromise accessibility.
  </Text>
</section>
```

- **Heading Variants**: `display`, `statement`, `page`, `section`, `title`, `card`, `signal`.
- **Text Variants**: `lead`, `body`, `muted`, `code`.

---

## Forms & Validation

Form composition uses semantic helper primitives that manage labels, helper descriptions, and error announcements while leaving DOM identifiers and binding under consumer control:

```tsx
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@mivabyte/ui/field"
import { Input } from "@mivabyte/ui/input"

;<Field>
  <FieldLabel htmlFor="email">Work Email</FieldLabel>
  <Input
    id="email"
    type="email"
    aria-describedby="email-desc"
    placeholder="alex@mivabyte.com"
  />
  <FieldDescription id="email-desc">
    We will never share your email with third parties.
  </FieldDescription>
  {/* <FieldError>Invalid email address</FieldError> */}
</Field>
```

Compatible with `react-hook-form`, `zod`, `Formik`, or standard HTML form submissions.

For `react-hook-form` specifically, the official `Form` primitives wire field
state, generated ids, and validation messages together:

```tsx
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@mivabyte/ui/form"
import { Input } from "@mivabyte/ui/input"

export function EmailForm() {
  const form = useForm<{ email: string }>({
    defaultValues: { email: "" },
  })

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            <FormDescription>We never share your email.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  )
}
```

`react-hook-form` is a dependency of this package, but add it to your own
`package.json` so your app resolves it directly.

---

## Accessibility & Motion

- **A11y Standards**: Strict WCAG 2.1 Level AA compliance across all components, validated with automated Axe Core integration tests.
- **Keyboard Navigation**: Native keyboard orchestration across all complex families (Arrow navigation in Menubars, Dropdowns, and Tabs; Escape key dismissal for Overlays; Tab cycling with focus trapping in Dialogs and Sheets).
- **Reduced Motion**: All animations and transitions automatically respect user preferences via `@media (prefers-reduced-motion: reduce)`. Essential loading indicators (such as `Skeleton` and `Spinner`) retain visible state without animated pulsation.
- **High-Contrast & Forced Colors**: Tested and hardened against Windows High Contrast mode and browser forced-colors environments. Focus rings use double-offset styling for clear visibility over any surface.

---

## Interactive Storybook

Storybook provides an interactive sandbox for inspecting all 67 components, their token foundations, and complete full-page compositions (marketing websites and administrative dashboards).

```bash
# Start local Storybook development server
npm run storybook
```

CI strictly verifies that every registered component in `config/components.mjs` has a corresponding Storybook story with zero orphan primitives.

---

## Development & Testing

Mivabyte UI maintains an exhaustive verification suite with zero tolerance for broken types, missing exports, or accessibility failures.

### Local Verification

```bash
# Clean dependency installation (avoids executing arbitrary lifecycle scripts)
npm ci --ignore-scripts

# Run the complete verification suite
npm run verify
```

The canonical `npm run verify` command runs:

1. **`lint`**: ESLint rules across all source, story, test, and script files.
2. **`format:check`**: Prettier code style validation.
3. **`audit:source`**: Security audit forbidding unsafe code generation patterns.
4. **`registry:check`**: Validates consistency between component catalog, source, and exports.
5. **`storybook:check`**: Verifies 100% story coverage across all components.
6. **`typecheck`**: TypeScript check with strict compiler configurations.
7. **`build`**: Builds ESM and CJS bundles (`tsup`), compiles CSS (`tailwindcss`), and emits declaration files.
8. **`test:contracts`**: Verifies package export contracts and upstream baseline guarantees.
9. **`pack:check`**: Builds a dry-run tarball and validates packed package contents.
10. **`package:lint`**: Runs `publint` (package export health) and `attw` (Are The Types Wrong).
11. **`api:check`**: Validates public surface against Microsoft API Extractor contract report.
12. **`test:coverage`**: Executes Vitest unit tests with v8 code coverage reporting.

### End-to-End & Design Testing

```bash
# Run Playwright E2E browser tests across Chromium, Firefox, WebKit
npm run test:e2e

# Run Playwright design, accessibility, and composition tests
npm run test:design
```

---

## Releases & Governance

- **Changeset-Driven**: All releases are declared using [Changesets](https://github.com/changesets/changesets). Every user-facing feature or fix includes a changeset markdown file.
- **Semantic Versioning**: The published version follows semver (`MAJOR.MINOR.PATCH`), bumped by Changesets from the highest pending intent. The release workflow rejects any version containing `-` under the `latest` dist-tag, so a `-N` prerelease suffix can only ship on `next`; the current major line is therefore plain semver. See [`docs/maintainers/releases.md`](docs/maintainers/releases.md).
- **Cryptographic Provenance**: Published directly through GitHub Actions with OpenID Connect (OIDC) token exchange, npm provenance attestations, and zero static token storage.
- **Registry Release Probe**: Post-publish CI job pulls the newly released package from npm and executes integration smoke tests in clean Vite and Next.js consumer fixtures.

See [`docs/maintainers/releases.md`](docs/maintainers/releases.md) for maintainer publishing procedures.

---

## Documentation Directory

| Document                                                                                           | Purpose                                                                             |
| :------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| **[`DESIGN.md`](DESIGN.md)**                                                                       | Canonical design contract, color philosophy, typography, and motion specifications  |
| **[`docs/components.md`](docs/components.md)**                                                     | Per-component catalog: import subpath, runtime exports, and exported types per slug |
| **[`docs/generated/exports.md`](docs/generated/exports.md)**                                       | Machine-generated authoritative package export and subpath map                      |
| **[`docs/upstream/component-parity.md`](docs/upstream/component-parity.md)**                       | Parity tracking against upstream shadcn/ui primitives                               |
| **[`docs/accessibility/keyboard-interactions.md`](docs/accessibility/keyboard-interactions.md)**   | Keyboard interaction and focus management specification                             |
| **[`docs/maintainers/releases.md`](docs/maintainers/releases.md)**                                 | Release workflow and publishing procedures                                          |
| **[`docs/migrations/shadcn-compatible-release.md`](docs/migrations/shadcn-compatible-release.md)** | Migration guide from legacy versions to the pure Radix/shadcn distribution          |

---

## License

MIT © [Mivabyte](https://github.com/mivabyte)
