# @mivabyte/ui

## 26.10.2

- b0b8841: Render the `Badge` `info` variant neutral instead of blue-tinted.
  `variant="info"` used `bg-info-subtle text-info`. Once the badge carries more
  than a single word — a status phrase, a sentence fragment inside a paragraph —
  the tinted pill reads as a link or a button rather than as a quiet inline
  label. It now uses `bg-muted text-foreground`, which stays distinguishable
  from `secondary` in both themes because `muted` is lighter and `foreground` is
  darker. Measured contrast improves from 5.29:1 to 15.37:1 in light and from
  8.38:1 to 14.05:1 in dark. No other component used `bg-info-subtle`, so the
  change is limited to this variant. The variant name is unchanged; renaming it
  would be a breaking public API change.

### Minor Changes (includes breaking removals)

- 0243f0d: Align the component registry with the official shadcn/ui catalog.

  **This release ships breaking removals under a minor version.** `26.10.2`
  carries the removals described below while staying inside the `26.x` range, so
  `^26.9.0` and `^26.9.21` consumers resolve it automatically and must migrate in
  the same install. Pin to `26.10.2` deliberately and follow the migration guide
  in `docs/migrations/shadcn-compatible-release.md` rather than letting the range
  pull it in.

  **Breaking removals.** `container` and `kbd-group` were published here as
  separate top-level components, which does not match how upstream shadcn/ui
  organises them: `container` does not exist in shadcn/ui at all, and upstream
  exports `KbdGroup` from its `kbd` module rather than as a standalone
  `kbd-group` component. Both subpaths are removed, along with their
  package subpaths (`@mivabyte/ui/container`, `@mivabyte/ui/kbd-group`) and root
  barrel exports (`Container`, `containerVariants`, `ContainerProps`,
  `KbdGroup`, `KbdGroupPropsInternal`).

  If you depended on `Container` for page-width layout, replace it with a plain
  element carrying the equivalent utilities:

  ```diff
  -<Container className="ui-stack py-12">
  +<div className="mx-auto w-full min-w-0 max-w-[var(--content-width)] px-[var(--page-gutter)] ui-stack py-12">
     ...
  -</Container>
  +</div>
  ```

  **Additions.** Two missing upstream components are now published:

  - `form` — React Hook Form primitives (`Form`, `FormField`, `FormItem`,
    `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, `useFormField`).
    Available at `@mivabyte/ui/form`.
  - `sonner` — the theme-aware `Toaster` wrapper. Available at
    `@mivabyte/ui/sonner`.

  **Replacement.** `toast` was already a published slug; its implementation is
  replaced with the real upstream Base UI version (`Toaster`, `Toast`,
  `ToastAction`, `ToastClose`, `ToastContent`, `ToastDescription`, `ToastPortal`,
  `ToastProvider`, `ToastTitle`, `ToastViewport`, `createToastManager`, `toast`,
  `useToastManager`) instead of a two-line alias of the sonner `Toaster`.

  **Dependency.** `@base-ui/react` is added as a runtime dependency, because
  upstream implements `toast` on Base UI. It is scoped to `toast` only; every
  other component remains Radix-based, and the contract tests enforce that.

  **Behavioral change for `toast` consumers.** The toast manager is no longer a
  callable function with `.success`/`.error` helpers. It is a Base UI manager:

  ```diff
  -toast("Saved")
  -toast.error("Failed")
  +toast.add({ title: "Saved" })
  +toast.add({ type: "error", title: "Failed" })
  ```

  The manager also exposes `close`, `update`, and `promise`. `<Toaster />` must be
  mounted once near the app root, and `toast` subpath imports that referenced
  `Toaster` now resolve correctly.

  **`calendar` now matches the upstream shadcn/ui state.** The local variant had
  drifted and is replaced by the current upstream implementation. Notable
  behavior changes:

  - `locale` is accepted and threaded through to `DayButton`, so `data-day` uses
    the supplied locale instead of the browser default.
  - `CalendarDayButton` gains an optional `locale` prop.
  - Range start/end use `bg-muted` with an overlapping `::after` edge, and today
    uses `bg-muted`, replacing the previous `bg-accent` treatment.
  - Day cells size with `h-full w-full` and the left edge only rounds when the
    week-number column is hidden; with `showWeekNumber` the second cell rounds
    instead, fixing a wrong rounded corner.
  - Cell metrics are overridable per instance via `--cell-size` and
    `--cell-radius`, defaulting to `--spacing(8)` and `--radius-lg`.

  **Verification changes.** The bundle-size budget check and the packed
  tree-shaking check are removed, along with the shared bundle-size helper:

  - `scripts/check-bundle-budgets.mjs` — per-module size budgets.
  - `scripts/check-packed-tree-shaking.mjs` — built a real Vite app to assert the
    root barrel stays tree-shakeable.
  - `scripts/lib/bundle-size.mjs` — shared helper, now unused.

  `bundle:check` is no longer part of `verify:core`, the Tree Shaking job is gone
  from the consumer workflow, and the release probe no longer runs it. This means
  nothing now fails the build if a future change makes the root barrel
  non-tree-shakeable or inflates a module; `pack:check`, `publint`, and `attw`
  still validate the published artifact.

  **Runtime requirements.** `engines.node` moves from `>=20` to `>=22`. The
  published package never imported anything that requires Node 22, but the
  previous bound advertised support for a runtime that CI never tested: the
  verification matrix covers Node 22 and 24 only. Node 20 also reached end of life
  in April 2026, so the old bound promised unpatched security updates.

  **Dependency surface.** Three packages that this library neither imports nor
  needs were installed for every consumer:

  - Removed: `@shadcn/react`, `date-fns`.
  - Moved to optional `peerDependencies`: `zod`, `@hookform/resolvers`,
    `@tanstack/react-table`.

  `data-table` is generic over `TData` and `form` is plain React Hook Form, so
  neither pulls in TanStack Table or a validation library.

  `date-fns` stays resolvable without being declared here: `react-day-picker`
  depends on it directly (`^4.1.0`), so every consumer installs it transitively.
  `@base-ui/react` additionally declares it as a peer, which that transitive copy
  satisfies. This was verified by typechecking the packed tarball without
  `date-fns` present.

  Consumers that wire resolvers or a TanStack table themselves must now install
  them directly:

  ```diff
     "dependencies": {
       "@mivabyte/ui": "^26.10.2",
  +    "@hookform/resolvers": "^5.9.1",
  +    "zod": "^3.25.76",
     }
  ```

  Install `@tanstack/react-table` only if you compose `DataTable` with a TanStack
  table instance.

  **Release plumbing hardening.** No consumer-facing API change, but the workflows
  that build and publish this package were audited and several defects fixed:

  - `id-token: write` was granted at workflow level in `release.yml`. It is now
    scoped to the `publish` job, which is the only job that exchanges an OIDC
    token for an npm publish grant.
  - Five steps interpolated a value straight into a `run:` body, which makes that
    value shell code. `release.yml`, `registry-release-probe.yml`,
    `sync-upstream.yml`, `consumer.yml`, `policy.yml` and `browser.yml` now pass
    those values through `env:`.
  - `sync-upstream.yml` still pinned `actions/checkout` and `actions/setup-node`
    at v4 while every other workflow used v7. All pins are now consistent with
    their latest major, and `peter-evans/create-pull-request` moved from v7 to
    v8.
  - New `Actions Security` workflow runs zizmor at the `pedantic` persona, because
    the `regular` default does not report `excessive-permissions`. Verified with a
    probe workflow: `permissions: write-all` produces zero findings under
    `regular`. The repository reports zero findings under all three personas.
  - New `Dependency Review` workflow blocks pull requests that introduce a
    moderate-or-higher advisory, which `npm audit` cannot distinguish from the
    advisories this repository has already accepted.
  - Node.js is read from `.nvmrc` in every workflow instead of being repeated as a
    literal, and Playwright browsers are cached per matrix leg. The cache key
    includes the browser name because `actions/cache` is write-once, so a shared
    key would leave two of the three parallel legs uncached. `verify.yml` keeps a
    literal `node-version: [22, 24]` on purpose: that matrix is the compatibility
    claim, so it must not collapse onto the single `.nvmrc` version.

  **Action pinning is now verifiable.** `scripts/audit-source.mjs` previously
  checked only that a `uses:` reference was a 40-character SHA. That is
  immutability, not identity: `actions/checkout@<real v4 SHA> # v7.0.0` satisfied
  it. The audit now resolves each pinned SHA to the tags that actually point at it
  via `scripts/sync-action-pins.mjs`, records the result in
  `etc/action-pins.json`, and fails on three conditions the old check missed: a
  comment that disagrees with the resolved tag, a `uses:` reference for an action
  that is not in the pin file, and a `docker://` or unpinned reference. It also
  validates each `actions/checkout` step individually instead of counting markers
  per file, so `persist-credentials: false` on one step can no longer mask a
  checkout that persists credentials. `etc/action-pins.json` is re-resolved against
  the GitHub API in CI, which fails closed on network or rate-limit errors.

  **Root barrel.** Because both `sonner` and `toast` export a `Toaster`, the root
  barrel keeps the upstream Base UI component under the canonical `Toaster` name
  and re-exports the sonner wrapper as `SonnerToaster`. The generated root entry is
  now built to alias colliding export names, so neither module system silently
  drops the binding; importing the subpath directly is still recommended.

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
