# @mivabyte/ui

## 26.9.21-2

### Patch Changes

- Remove harsh inset highlight from elevation-surface token so surface elevations and cards do not render an artificial white top bevel.

## 26.9.21-1

### Major Changes

- 3abb3ec: Rebrand the public package from `@mivama-digital/ui` to `@mivabyte/ui`. Update
  all public import paths, theme attributes, CSS custom properties, package
  metadata, release tooling, fixtures, and documentation to use the Mivabyte
  identity.

### Minor Changes

- 6693983: Add the Container primitive and expanded typography, action, overlay, card, and tab APIs. Correct AspectRatio sizing, expose its props, make the Secondary button hover state visible while aligning it with the rest of the button variants, and include the shared token stylesheet in package builds.
- da3b6bb: Evolve the shared Midnight/Cyan/Azure visual system with semantic layered surfaces, accessible light/dark action and status colors, self-hosted Onest typography, density and motion tokens. Make Card and Tabs variants functional, add purposeful Button/Badge variants, improve loading links, table keyboard scrolling and sidebar focus restoration. Keep the aggregate stylesheet and existing component imports; add marketing/application Storybook compositions and browser contrast/reflow checks.

  Default typography, control sizes, colors and elevations change visually. Consumers should review local size and `border-0 shadow-none` overrides when adopting this release.

### Patch Changes

- Achieve 100% test coverage and 100% green test suite across all 66 public component modules with strict CI coverage thresholds.
- Fix `Progress` value prop forwarding to ensure `aria-valuenow` is rendered properly.
- Fix `Message` component to correctly render child content.
- 8dbe189: Add chart (--chart-1 to --chart-5) and sidebar design tokens in styles.css, ensure Calendar day cells maintain cell size in static mode, and allow DatePicker to pass through all Calendar props.
- 3abb3ec: Implement Mivabyte visual identity design system using Mivabyte Main (#0A8EC3), Midnight, Cyan, and Azure design tokens. Configure #0A8EC3 as the primary brand color for high WCAG AA contrast compliance. Update elevated overlay surfaces (Dialog, Sheet, Drawer, AlertDialog) to use popover semantic tokens for contrast separation against Midnight canvas.
- c4e5c71: Allow custom `top-*` utilities to override desktop Sidebar positioning by replacing `inset-y-0` with `top-0 bottom-0`.
- b028114: Fix Tailwind v4 arbitrary CSS variable resolution in Calendar, Sidebar, Select, Combobox, Popover, DropdownMenu, HoverCard, Menubar, Tooltip, and Chart components by wrapping variable names with var().
- a827c41: Update dependencies to latest stable semver-compatible releases.

## 26.9.9-1

### Patch Changes

- Export missing public symbols (`THEMES`, `PaginationLinkProps`, `SidebarContextProps`), add `engines.node` specification, and update repository URL to canonical git format.
- Complete official shadcn catalog distribution and clean packaging linting.

## 26.9.4

### Patch Changes

- ffe6628: Add core primitives and improve type safety and provider diagnostics:

  - Add `AlertDialog` primitive family (`AlertDialog`, `AlertDialogTrigger`, `AlertDialogPortal`, `AlertDialogOverlay`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel`) with provider portal integration and accessible dialog roles.
  - Add `Slider` interactive primitive with track, indicator, and thumb.
  - Add `ScrollArea` component with customized scrollbars and viewport.
  - Improve `toast` type safety with generic `ToastData` and typed action payloads, eliminating unsafe type assertions.
  - Add invariant diagnostic to `useMivabyteContext()` ensuring descriptive error messages when accessed outside `MivabyteProvider`.
  - Raise test coverage thresholds across statements, branches, functions, and lines.

- 263bf05: Modernize library architecture and implement Phase 2 core components:

  - Introduce dual ESM/CJS bundling with `tsup` targeting ES2022.
  - Decouple `tailwindcss` peer dependency and provide precompiled CSS.
  - Extract global element resets into `@mivabyte/ui/reset.css`.
  - Add `React.forwardRef` and explicit `displayName` across core primitives.
  - Introduce `FieldContext` for automated accessible form field wiring.
  - Eliminate global DOM `MutationObserver` on `document.documentElement`.
  - Remove stacking context trapping (`isolate`) from `MivabyteProvider`.
  - Add Phase 2 primitives: `DropdownMenu`, `Popover`, `Accordion`, `Collapsible`, `Avatar`, `Table`, and `Toast` (with `Toaster` and `toast` helper).

## 3.0.1

### Patch Changes

- 79a97f0: Point the published package metadata and release identity checks at the canonical `mivabyte/ui` repository so npm provenance and Trusted Publishing use the current repository identity.
- 0df1398: Isolate ScrollLayer reveal and parallax effects with anonymous view timelines so repeated and nested ScrollScene compositions cannot resolve to one shared global named timeline.
