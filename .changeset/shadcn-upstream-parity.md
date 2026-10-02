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
     "@mivabyte/ui": "^27.0.0",
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
