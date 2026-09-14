# @mivama/ui

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
  - Extract global element resets into `@mivama/ui/reset.css`.
  - Add `React.forwardRef` and explicit `displayName` across core primitives.
  - Introduce `FieldContext` for automated accessible form field wiring.
  - Eliminate global DOM `MutationObserver` on `document.documentElement`.
  - Remove stacking context trapping (`isolate`) from `MivabyteProvider`.
  - Add Phase 2 primitives: `DropdownMenu`, `Popover`, `Accordion`, `Collapsible`, `Avatar`, `Table`, and `Toast` (with `Toaster` and `toast` helper).

## 3.0.1

### Patch Changes

- 79a97f0: Point the published package metadata and release identity checks at the canonical `mivama-digital/ui` repository so npm provenance and Trusted Publishing use the current repository identity.
- 0df1398: Isolate ScrollLayer reveal and parallax effects with anonymous view timelines so repeated and nested ScrollScene compositions cannot resolve to one shared global named timeline.
