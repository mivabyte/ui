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

- **📦 Zero Copy-Paste Required**: Shipped as a fully compiled, tree-shakeable npm package (`@mivabyte/ui`) with dual ESM and CommonJS exports and bundled TypeScript declarations.
- **🎨 Midnight, Cyan & Azure Visual System**: A cohesive, distinctive color language engineered with semantic HSL channels. Features rich deep navy dark surfaces, energetic cyan highlights, and crisp azure daylight actions.
- **⚡ 66 Production-Ready Component Primitives**: Built on battle-tested Radix UI and `@shadcn/react` foundations, from buttons and responsive dialogs to TanStack data tables and Recharts visualizations.
- **🎯 Precise Subpath Imports**: Fine-grained subpath exports (`@mivabyte/ui/button`, `@mivabyte/ui/card`, `@mivabyte/ui/dialog`) guarantee minimal bundle footprints and prevent barrel file bloat.
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

> **Peer Dependency Requirement**: `@mivabyte/ui` requires `react >= 19.0.0` and `react-dom >= 19.0.0`.

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
import { Toaster } from "@mivabyte/ui/toast"

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

          <Button className="w-full" size="default">
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

Subpath imports bypass root barrel files, ensuring optimal tree-shaking, fast bundler startup, and minimal production bundle sizes:

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

> **Authoritative Export Catalog**: For the complete machine-verified subpath and module inventory, consult [`docs/generated/exports.md`](docs/generated/exports.md).

---

## Component Catalog

`@mivabyte/ui` contains **66 component modules**, grouped into logical architectural families:

| Category                   | Primitives & Modules                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| :------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actions & Triggers**     | [`Button`](docs/components.md#button), [`ButtonGroup`](docs/components.md#button-group), [`Toggle`](docs/components.md#toggle), [`ToggleGroup`](docs/components.md#toggle-group)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Forms & User Input**     | [`Input`](docs/components.md#input), [`InputGroup`](docs/components.md#input-group), [`InputOTP`](docs/components.md#input-otp), [`Textarea`](docs/components.md#textarea), [`Checkbox`](docs/components.md#checkbox), [`RadioGroup`](docs/components.md#radio-group), [`Select`](docs/components.md#select), [`NativeSelect`](docs/components.md#native-select), [`Switch`](docs/components.md#switch), [`Slider`](docs/components.md#slider), [`DatePicker`](docs/components.md#date-picker), [`Calendar`](docs/components.md#calendar), [`Field`](docs/components.md#field), [`Combobox`](docs/components.md#combobox), [`Questionnaire`](docs/components.md#questionnaire) |
| **Overlays & Dialogs**     | [`Dialog`](docs/components.md#dialog), [`AlertDialog`](docs/components.md#alert-dialog), [`Sheet`](docs/components.md#sheet), [`Drawer`](docs/components.md#drawer), [`Popover`](docs/components.md#popover), [`Tooltip`](docs/components.md#tooltip), [`HoverCard`](docs/components.md#hover-card), [`ContextMenu`](docs/components.md#context-menu), [`DropdownMenu`](docs/components.md#dropdown-menu), [`Command`](docs/components.md#command)                                                                                                                                                                                                                             |
| **Navigation**             | [`NavigationMenu`](docs/components.md#navigation-menu), [`Breadcrumb`](docs/components.md#breadcrumb), [`Pagination`](docs/components.md#pagination), [`Tabs`](docs/components.md#tabs), [`Menubar`](docs/components.md#menubar), [`Sidebar`](docs/components.md#sidebar), [`Direction`](docs/components.md#direction)                                                                                                                                                                                                                                                                                                                                                         |
| **Layout & Structure**     | [`Container`](docs/components.md#container), [`Card`](docs/components.md#card), [`Separator`](docs/components.md#separator), [`Resizable`](docs/components.md#resizable), [`ScrollArea`](docs/components.md#scroll-area), [`AspectRatio`](docs/components.md#aspect-ratio), [`Collapsible`](docs/components.md#collapsible), [`Accordion`](docs/components.md#accordion)                                                                                                                                                                                                                                                                                                       |
| **Data Display & Content** | [`DataTable`](docs/components.md#data-table), [`Table`](docs/components.md#table), [`Badge`](docs/components.md#badge), [`Avatar`](docs/components.md#avatar), [`Skeleton`](docs/components.md#skeleton), [`Empty`](docs/components.md#empty), [`Item`](docs/components.md#item), [`Bubble`](docs/components.md#bubble), [`Attachment`](docs/components.md#attachment), [`Marker`](docs/components.md#marker), [`Message`](docs/components.md#message), [`MessageScroller`](docs/components.md#message-scroller), [`Carousel`](docs/components.md#carousel), [`Kbd`](docs/components.md#kbd), [`KbdGroup`](docs/components.md#kbd-group)                                       |
| **Typography**             | [`Heading`](docs/components.md#typography), [`Text`](docs/components.md#typography), [`Eyebrow`](docs/components.md#typography), [`Label`](docs/components.md#label)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Feedback & Status**      | [`Alert`](docs/components.md#alert), [`Progress`](docs/components.md#progress), [`Spinner`](docs/components.md#spinner), [`Toast`](docs/components.md#toast) (`Toaster`, `toast`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Data Visualization**     | [`Chart`](docs/components.md#chart) (`ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

For comprehensive API signatures, props interfaces, and code examples for every component, refer to [`docs/components.md`](docs/components.md).

---

## Design System and Tokens

The Mivabyte design system balances technical precision with warm human typography and deliberate visual depth. Read [DESIGN.md](DESIGN.md) for the complete design contract.

### The Midnight, Cyan & Azure Palette

- **Light Mode (`:root` / `.light`)**: A clean, cool canvas (`--background: 202 68% 97%`) anchored by an Azure action tone (`--primary: 198 92% 31%`), providing high clarity without harsh starkness.
- **Dark Mode (`.dark`)**: A rich Midnight navy canvas (`--background: 218 63% 6%`) illuminated by vibrant Cyan accents (`--primary: 188 86% 53%` and `--accent: 194 57% 17%`).

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

---

## Accessibility & Motion

- **A11y Standards**: Strict WCAG 2.1 Level AA compliance across all components, validated with automated Axe Core integration tests.
- **Keyboard Navigation**: Native keyboard orchestration across all complex families (Arrow navigation in Menubars, Dropdowns, and Tabs; Escape key dismissal for Overlays; Tab cycling with focus trapping in Dialogs and Sheets).
- **Reduced Motion**: All animations and transitions automatically respect user preferences via `@media (prefers-reduced-motion: reduce)`. Essential loading indicators (such as `Skeleton` and `Spinner`) retain visible state without animated pulsation.
- **High-Contrast & Forced Colors**: Tested and hardened against Windows High Contrast mode and browser forced-colors environments. Focus rings use double-offset styling for clear visibility over any surface.

---

## Interactive Storybook

Storybook provides an interactive sandbox for inspecting all 66 components, their token foundations, and complete full-page compositions (marketing websites and administrative dashboards).

```bash
# Start local Storybook development server
npm run storybook
```

CI strictly verifies that every registered component in `config/components.mjs` has a corresponding Storybook story with zero orphan primitives.

---

## Development & Testing

Mivabyte UI maintains an exhaustive verification suite with zero tolerance for broken types, missing exports, bundle regressions, or accessibility failures.

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
8. **`bundle:check`**: Enforces strict bundle budgets on all distribution targets.
9. **`test:contracts`**: Verifies package export contracts and upstream baseline guarantees.
10. **`pack:check`**: Builds a dry-run tarball and validates packed package contents.
11. **`package:lint`**: Runs `publint` (package export health) and `attw` (Are The Types Wrong).
12. **`api:check`**: Validates public surface against Microsoft API Extractor contract report.
13. **`test:coverage`**: Executes Vitest unit tests with v8 code coverage reporting.

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
- **Calendar Versioning (CalVer)**: Releases follow the format `YY.M.D-patch` (e.g. `26.9.10-1`).
- **Cryptographic Provenance**: Published directly through GitHub Actions with OpenID Connect (OIDC) token exchange, npm provenance attestations, and zero static token storage.
- **Registry Release Probe**: Post-publish CI job pulls the newly released package from npm and executes integration smoke tests in clean Vite and Next.js consumer fixtures.

See [`docs/maintainers/releases.md`](docs/maintainers/releases.md) for maintainer publishing procedures.

---

## Documentation Directory

| Document                                                                                         | Purpose                                                                            |
| :----------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| **[`DESIGN.md`](DESIGN.md)**                                                                     | Canonical design contract, color philosophy, typography, and motion specifications |
| **[`docs/components.md`](docs/components.md)**                                                   | Complete component catalog, API signatures, and usage patterns                     |
| **[`docs/generated/exports.md`](docs/generated/exports.md)**                                     | Machine-generated authoritative package export and subpath map                     |
| **[`docs/upstream/component-parity.md`](docs/upstream/component-parity.md)**                     | Parity tracking against upstream shadcn/ui primitives                              |
| **[`docs/accessibility/keyboard-interactions.md`](docs/accessibility/keyboard-interactions.md)** | Keyboard interaction and focus management specification                            |
| **[`docs/maintainers/releases.md`](docs/maintainers/releases.md)**                               | Release workflow and publishing procedures                                         |
| **[`docs/migration/shadcn-compatible-release.md`](docs/migration/shadcn-compatible-release.md)** | Migration guide from legacy versions to the pure Radix/shadcn distribution         |

---

## License

MIT © [Mivabyte](https://github.com/mivabyte)
