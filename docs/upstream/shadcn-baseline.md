# shadcn Baseline Specification

## Pinned upstream reference

- **Upstream Repository:** `https://github.com/shadcn-ui/ui`
- **Pinned Git SHA:** `5c7072da672b0048bc6771e3204063a2537df91a`
- **Reference Date:** 2026-09-06

`npm run sync:upstream` (and the scheduled Sync Upstream workflow) reads this pinned SHA and diffs the upstream base registry at it against the current upstream ref. It never advances the pin on its own; advancing it is a reviewed, manual step after intended upstream changes are integrated.

At that SHA the upstream base registry (`apps/v4/registry/bases/base/ui/`) holds 62 distributable components. `@mivabyte/ui` publishes 66 slugs: those 62 plus four modules the package adds on top of that path — `data-table`, `date-picker`, and `typography`, which upstream only uses inside block/example compositions or not at all, and `form`, which upstream ships at `apps/v4/registry/new-york-v4/ui/form.tsx` rather than under `bases/base/ui/`. Upstream's base path contains neither `container` nor `kbd-group`, which is why this package no longer publishes them.

## Source of truth

- **Catalog:** `config/components.mjs` (66 shadcn-compatible slugs plus the Mivabyte `media-player` module)
- **Source modules:** `src/components/ui/`
- **Style entry point:** `src/styles.css` → `@mivabyte/ui/styles.css`
- **Release checks:** registry, contracts, Storybook coverage, package linting, packed consumer builds, and API extraction

## Runtime baseline

`@mivabyte/ui` follows the official shadcn component approach:

- React 19 and Tailwind CSS 4;
- Radix primitives where the corresponding shadcn component uses them (Base UI is scoped to the Toast component only);
- Vaul for Drawer;
- Base UI for Toast, with a separate Sonner `Toaster` published alongside it;
- `react-hook-form` for Form; and
- the standard specialist packages required by upstream-style Calendar, Carousel, Chart, Command, Data Table, Input OTP, Resizable, and Questionnaire components.

Exact pinned dependency versions live in `package.json` and `package-lock.json`; they are checked by the package and consumer gates.

## Distribution policy

Only registered components and their styles are public. The registry distinguishes shadcn-compatible components from Mivabyte additions such as `media-player`. The root barrel must agree with its declaration output and must not leak internal hooks or library helpers. Previous proprietary providers, shell contracts, theme/density helpers, custom layout extensions, and legacy stylesheet subpaths are excluded.
