# shadcn Baseline Specification

## Source of truth

- **Catalog:** `config/components.mjs` (65 component slugs)
- **Source modules:** `src/components/ui/`
- **Style entry point:** `src/styles.css` → `@mivabyte/ui/styles.css`
- **Release checks:** registry, contracts, Storybook coverage, package linting, packed consumer builds, and API extraction

## Runtime baseline

`@mivabyte/ui` follows the official shadcn component approach:

- React 19 and Tailwind CSS 4;
- Radix primitives where the corresponding shadcn component uses them;
- Vaul for Drawer;
- Sonner for Toast; and
- the standard specialist packages required by upstream-style Calendar, Carousel, Chart, Command, Data Table, Input OTP, Resizable, and Questionnaire components.

Exact pinned dependency versions live in `package.json` and `package-lock.json`; they are checked by the package and consumer gates.

## Distribution policy

Only the official component registry and its styles are public. The root barrel must agree with its declaration output and must not leak internal hooks or library helpers. Previous proprietary providers, shell contracts, theme/density helpers, custom layout extensions, and legacy stylesheet subpaths are excluded.
