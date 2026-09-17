# @mivabyte/ui

Shared Mivabyte design tokens and React UI primitives for websites, portals, and product surfaces. 66 component modules built on Radix/shadcn primitives, with a shared Midnight/Cyan/Azure visual system.

## Installation

Applications install `@mivabyte/ui` directly as a pre-built, tree-shakeable package from npm. You do not need to copy and paste code via the shadcn CLI:

```bash
npm install @mivabyte/ui
```

## Quick start

```tsx
import { Button } from "@mivabyte/ui/button"
import { Toaster } from "@mivabyte/ui/toast"
import "@mivabyte/ui/styles.css"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <Toaster />
    </div>
  )
}
```

Apply `.dark` to `<html>` for dark mode and `data-density="compact"` to deliberate dense desktop regions. Root mode also themes body portals. See the design contract below for scoped previews.

Frequently used modules can bypass the root barrel using clean subpath imports:

```tsx
import { Button } from "@mivabyte/ui/button"
import { Card } from "@mivabyte/ui/card"
import { Field } from "@mivabyte/ui/field"
import { Input } from "@mivabyte/ui/input"
import { DataTable } from "@mivabyte/ui/data-table"
import { ChartContainer } from "@mivabyte/ui/chart"
```

- For the complete API catalog and usage examples for all 66 component modules, see [`docs/components.md`](docs/components.md).
- For upstream parity tracking against shadcn/ui, see [`docs/upstream/component-parity.md`](docs/upstream/component-parity.md).
- For migrating from prior Mivabyte releases, see [`docs/migration/shadcn-compatible-release.md`](docs/migration/shadcn-compatible-release.md).
- The authoritative public module and stylesheet catalog is generated from the component registry and package export map in [`docs/generated/exports.md`](docs/generated/exports.md). Do not maintain a second export inventory in this README.

## Component documentation

Storybook is the canonical interactive usage surface. Every entry in `config/components.mjs` must have a matching story; CI enforces registry-to-story coverage.

```bash
npm run storybook
```

TypeScript and API Extractor remain the public API contract. Storybook documents usage and composition; it does not maintain a second hand-written prop schema.

## Styling and themes

Import `@mivabyte/ui/styles.css` once for the canonical aggregate stylesheet. It contains the self-hosted Onest variable font, Tailwind utilities, tokens, themes, and component styles.

The aggregate stylesheet is the only public CSS entry. `src/tokens.css` owns tokens internally; `src/system.css` owns foundation and composition recipes. Both are compiled into `styles.css`, with self-hosted fonts copied into the package. There are no public `tokens.css` or `themes.css` exports.

Use `.dark` on `<html>` for the dark palette; remove it for light mode. `.light` supports explicit light preview regions. `data-density="comfortable"` is the default; `compact` reduces default controls to 32px on desktop. Coarse pointers retain 44px targets. The historical `data-mivabyte-theme` attribute does not select additional palettes.

Read [DESIGN.md](DESIGN.md) for the visual contract and [the audit, plan and migration guide](docs/design-system-evolution.md) for evidence and adoption guidance. Storybook's **Design System** group demonstrates foundations, a marketing website and an interactive application using the same components.

```tsx
<section className="ui-section" data-tone="gradient">
  <Container className="ui-stack">
    <Eyebrow>Designed for everyday work</Eyebrow>
    <Heading variant="display">Clarity at every layer.</Heading>
    <Text variant="lead">A coherent foundation for your next product.</Text>
    <Button size="lg">Get started</Button>
  </Container>
</section>
```

Card variants: `default`, `surface`, `outline`, `elevated`, `interactive`, `accent`, `highlighted`, `glass`. Interactive cards contain an actual link or button. `highlighted` is reserved for a selected/recommended item. Statistics and features compose Card with Text/Heading/Badge; they do not need separate variants. Buttons add `subtle` and `accent`; badges add `success`, `warning`, `info`, `accent`. Section tones are `muted`, `accent`, `gradient`, `grid`, or the default canvas.

## Design tokens

The package owns shared color, layout, typography, shape, focus, density, shadow, and motion contracts. Prefer semantic tokens over application-local copies.

Common groups include:

- layout: `--page-gutter`, `--section-space`, `--layout-gap`, `--content-stack`
- surfaces/text: `--background`, `--foreground`, `--surface`, `--surface-elevated`, `--card`, `--popover`
- actions: `--primary`, `--secondary`, `--accent`, `--destructive`, `--success`, `--warning`
- controls: `--muted`, `--border`, `--border-strong`, `--input`, `--ring`, `--overlay`
- motion/elevation: `--elevation-*`, `--motion-duration-*`, `--motion-easing-*`
- sidebar: `--sidebar*`
- shape: `--shape-*`
- spacing/density: Tailwind’s 4px scale, `--panel-padding`, `--control-height`
- typography: `--type-*`, `--font-heading`, `--font-sans`

Tailwind exposes the maintained semantic color utilities such as `bg-surface`, `bg-surface-elevated`, `border-border-strong`, and `bg-overlay`. Keep foreground/background overrides at WCAG AA contrast.

## Layout and typography

Use standard Tailwind flex/grid utilities and semantic HTML for layout structure.

Use `Heading`, `Text`, and `Eyebrow` for shared typography roles. The visual role is independent from the rendered element:

```tsx
<Heading render={<h1 />} variant="display">
  A clear proposition
</Heading>
<Text variant="lead">Supporting context for the page.</Text>
```

Use `tone="inherit"` when text should inherit the foreground color of a brand or instrument surface.

## Forms

`Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `Fieldset`, and `FieldLegend` provide semantic composition without taking control of consumer IDs.

Official form controls include `Input`, `Textarea`, `Checkbox`, `RadioGroup`, `Select`, `NativeSelect`, `Switch`, and `Slider`. Consumers retain full control of `htmlFor`, `aria-describedby`, and `aria-invalid`.

```tsx
<Field>
  <FieldLabel htmlFor="region">Region</FieldLabel>
  <NativeSelect id="region" aria-describedby="region-help">
    <option value="eu">Europe</option>
  </NativeSelect>
  <FieldDescription id="region-help">
    Used to route your enquiry.
  </FieldDescription>
</Field>
```

## Accessibility

Default Button, Input, Select and tab targets use the density contract. Compact sizes (`compact`, `sm`, `xs`, `icon-xs`) are reserved for intentionally dense desktop interfaces and should not be used for primary actions. Coarse-pointer overrides protect Button and tab targets. Other primitive families still require context-specific target-size review.

`Button` accepts `loading` to preserve dimensions, set `aria-busy`, and prevent repeated activation while work is pending.

Give `Switch` and `Progress` an accessible name with `aria-label` or `aria-labelledby`. Keep the actual link or button inside an `interactive` Card; the card variant is visual, not a replacement semantic control.

Built-in labels on Dialog, Sheet, Pagination, Breadcrumb, and Sidebar primitives are localizable through their public props.

Run `npm run test:design` for current composition reflow, semantic contrast, Axe, keyboard, reduced-motion, density and forced-colors checks across Chromium, Firefox and WebKit. Historical `tests/e2e` snapshots target an older consumer fixture and are not evidence for the current design.

## Motion

Transitions and animations use CSS tokens (`--motion-duration-*`, `--motion-easing-*`) with strict accessibility support. Media query `@media (prefers-reduced-motion: reduce)` automatically disables non-essential animations across all components.

Consumer-owned animation should respect reduced-motion preferences rather than relying only on the package fallback.

## Development

Install dependencies without lifecycle scripts and run the canonical verification pipeline:

```bash
npm ci --ignore-scripts
npm run verify
```

`npm run verify` includes linting, formatting, source/workflow audits, registry and Storybook coverage, type checking, package build, API checks, bundle budgets, runtime/contract coverage, packed-package validation, Publint, and Are The Types Wrong checks.

Browser compatibility is covered separately by Playwright across Chromium, Firefox, and WebKit. Consumer CI validates React 19, Vite, Next.js App Router, SSR imports, and tree shaking using the packed package contract. React >=19 is required.

## Registry sync

`config/components.mjs` is the canonical component inventory. `components.json` pins the official `base-nova` shadcn preset.

After adding or refreshing a component with the shadcn CLI, normalize imports and verify the repository:

```bash
npx shadcn@4.15.0 add button --overwrite
npm run sync:imports
npm run verify
```

Do not create a second component list for Storybook, documentation, or exports. Registry coverage and generated docs are derived from the canonical inventory/package map.

## Local packed consumer workflow

The consumer checks normally create the package archive themselves through the shared package-source helper. For an external consumer that deliberately vendors the current v3 archive, the equivalent manual flow is:

```bash
consumer=/absolute/path/to/consumer
mkdir -p "$consumer/vendor"
npm run verify
archive=$(npm pack --ignore-scripts --pack-destination "$consumer/vendor")
npm install --prefix "$consumer" "$consumer/vendor/$archive"
npm --prefix "$consumer" run verify
```

Commit the consumer manifest/lockfile and archive together. Do not maintain a second custom packaging script for a consumer; use npm pack or the repository's shared consumer runners.

During active development, a local consumer may reference the repository's packed archive via a `file:` dependency. Re-pack and reinstall after package changes.

## Releases

Changesets are the only release-intent/versioning format. Publishing has one canonical entrypoint: the OIDC-backed GitHub `Release` workflow. Do not publish from a feature branch or add a long-lived npm write-token fallback.

After a real publish, run the `Registry Release Probe` for the exact published version. It reuses the same Vite/Next/SSR/tree-shaking consumer logic against npm and verifies provenance/signatures.

Maintainer instructions live in [`docs/maintainers/releases.md`](docs/maintainers/releases.md).

## Migration history

Current usage belongs in this README and Storybook. Historical v3 upgrade guidance is kept separately in [`docs/migrations/v3.md`](docs/migrations/v3.md) so compatibility notes do not become recommended current architecture.
