# Component Parity Ledger

`@mivabyte/ui` publishes exactly the 66 slugs registered in `config/components.mjs` and nothing else:

`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `attachment`, `avatar`, `badge`, `breadcrumb`, `bubble`, `button`, `button-group`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `combobox`, `command`, `context-menu`, `data-table`, `date-picker`, `dialog`, `direction`, `drawer`, `dropdown-menu`, `empty`, `field`, `form`, `hover-card`, `input`, `input-group`, `input-otp`, `item`, `kbd`, `label`, `marker`, `menubar`, `message`, `message-scroller`, `native-select`, `navigation-menu`, `pagination`, `popover`, `progress`, `questionnaire`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `spinner`, `switch`, `table`, `tabs`, `textarea`, `toast`, `toggle`, `toggle-group`, `tooltip`, `typography`.

### Relationship to the upstream catalog

Of these 66, 62 match the upstream base registry one-for-one. Four are package additions rather than upstream base components: `data-table`, `date-picker`, and `typography` (upstream uses these only inside block/example compositions, or not at all), and `form` (upstream ships it at `apps/v4/registry/new-york-v4/ui/form.tsx`, outside the `bases/base/ui/` path that `scripts/sync-upstream.mjs` scans). See [`shadcn-baseline.md`](shadcn-baseline.md) for the pinned upstream SHA.

## Enforced parity

Release validation verifies all of the following against that registry:

- one `src/components/ui/<slug>.tsx` source module per slug;
- one typed ESM and CommonJS package subpath per slug;
- one root-barrel re-export per slug;
- one Storybook story per slug;
- no extra component source modules; and
- no proprietary root runtime export.

### Base UI

Every component is Radix-based except `toast`. Upstream shadcn/ui implements
`toast` on Base UI, and this package ports it faithfully, so `@base-ui/react`
is a declared runtime dependency. The contract tests pin that scope: only
`src/components/ui/toast.tsx` may import `@base-ui/react`, and any future use
must be deliberate rather than incidental.

### Deliberate visual adaptations

Two local adaptations are intentional and should not be "corrected" back to
upstream:

- **`ToastClose` uses `size="icon-xs"` instead of upstream's `size="icon-sm"`.**
  Upstream resolves `icon-sm` through a `cn-button-size-icon-sm` theme token, so
  it carries no single pixel value that can be copied. This package's Button
  scale has no `icon-sm` at all, and its `icon-xs` is `h-7 w-7` (28px). Adding
  an `icon-sm` token would change the shared Button scale for every consumer to
  chase a theme-derived value.
- **`calendar.tsx` uses the local elevation/radius scale** rather than upstream's
  `cn-toast`/`cn-calendar` theme classes, which have no local equivalent.

### Calendar day-button focus fix

`CalendarDayButton` attaches its `ref` to `Button` before calling
`ref.current?.focus()`. Upstream declares the `ref` and the focus effect but
never attaches the ref to any element, so its `modifiers.focused` focus call is
dead code and keyboard focus never moves to the focused day. Attaching the ref
fixes that and is safe because the custom `DayButton` fully replaces the
react-day-picker default, so only one focus effect runs.

### Root barrel aliasing

`sonner` and `toast` each export a component named `Toaster`. The root barrel
reserves the canonical `Toaster` name for the upstream base-ui implementation
and re-exports the sonner wrapper as `SonnerToaster`. Both remain available
under their own subpaths (`@mivabyte/ui/toast`, `@mivabyte/ui/sonner`), which is
the recommended import path.

The tests and registry checks are authoritative; this document intentionally does not duplicate an unverified per-component implementation ledger.
