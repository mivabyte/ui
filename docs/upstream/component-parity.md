# Component Parity Ledger

`@mivabyte/ui` publishes exactly the 65 official component slugs in `config/components.mjs`:

`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `attachment`, `avatar`, `badge`, `breadcrumb`, `bubble`, `button`, `button-group`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `combobox`, `command`, `context-menu`, `data-table`, `date-picker`, `dialog`, `direction`, `drawer`, `dropdown-menu`, `empty`, `field`, `hover-card`, `input`, `input-group`, `input-otp`, `item`, `kbd`, `kbd-group`, `label`, `marker`, `menubar`, `message`, `message-scroller`, `native-select`, `navigation-menu`, `pagination`, `popover`, `progress`, `questionnaire`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `spinner`, `switch`, `table`, `tabs`, `textarea`, `toast`, `toggle`, `toggle-group`, `tooltip`, `typography`.

## Enforced parity

Release validation verifies all of the following against that registry:

- one `src/components/ui/<slug>.tsx` source module per slug;
- one typed ESM and CommonJS package subpath per slug;
- one root-barrel re-export per slug;
- one Storybook story per slug;
- no extra component source modules; and
- no Base UI dependency or proprietary root runtime export.

The tests and registry checks are authoritative; this document intentionally does not duplicate an unverified per-component implementation ledger.
