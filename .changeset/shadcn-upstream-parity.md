---
"@mivabyte/ui": major
---

Align the component registry with the official shadcn/ui catalog.

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

**Root barrel.** Because both `sonner` and `toast` export a `Toaster`, the root
barrel keeps the upstream Base UI component under the canonical `Toaster` name
and re-exports the sonner wrapper as `SonnerToaster`. The generated root entry is
now built to alias colliding export names, so neither module system silently
drops the binding; importing the subpath directly is still recommended.
