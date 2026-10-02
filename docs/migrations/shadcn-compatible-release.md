# Migrating to the shadcn-compatible distribution

Version 27 is a breaking re-baseline of `@mivabyte/ui` onto the current official shadcn/ui component catalog.

## Install and import

```bash
npm install @mivabyte/ui
```

```tsx
import { Button } from "@mivabyte/ui/button"
import { Dialog, DialogContent } from "@mivabyte/ui/dialog"
import { Toast, toast } from "@mivabyte/ui/toast"
import "@mivabyte/ui/styles.css"
```

The root barrel is also available, but component subpaths are preferred for explicit dependency boundaries. Note that both `sonner` and `toast` export a `Toaster`; the root barrel keeps the canonical name for the Base UI toast host and exposes the sonner wrapper as `SonnerToaster`.

## Removed APIs

Remove imports for the old provider, shell/theme or density helpers, custom layout extensions, legacy form barrel, and historical `reset.css`, `tokens.css`, and `themes.css` stylesheet subpaths. They are not part of the version 27 public contract.

Two components published as official shadcn/ui modules were removed because they are not part of the upstream catalog:

- `@mivabyte/ui/container` — `Container` does not exist in shadcn/ui at all. Replace it with a plain element carrying the equivalent layout utilities, e.g. `className="mx-auto w-full min-w-0 max-w-[var(--content-width)] px-[var(--page-gutter)]"`.
- `@mivabyte/ui/kbd-group` — upstream exports `KbdGroup` from its `kbd` module, not as a standalone `kbd-group` component. This package publishes only `Kbd`, so `KbdGroup` is not available here. Group `Kbd` elements with a plain element, e.g. `<div className="inline-flex items-center gap-1">`.

The root-barrel exports `Container`, `containerVariants`, `ContainerProps`, `KbdGroup`, and `KbdGroupPropsInternal` are gone as well.

The toast manager is no longer a callable function with `.success`/`.error` helpers. It is now the upstream Base UI manager:

```diff
-toast("Saved")
-toast.error("Failed")
+toast.add({ title: "Saved" })
+toast.add({ type: "error", title: "Failed" })
```

It also exposes `close`, `update`, and `promise`. Mount `<Toaster />` once near the app root. `@base-ui/react` is added as a runtime dependency for this component; `sonner` remains available separately as `@mivabyte/ui/sonner`.

Use standard shadcn composition with semantic HTML, the component modules above, and Tailwind utility classes instead.

## Runtime baseline

Interactive primitives use the official shadcn stack: Radix primitives where applicable, Vaul for Drawer, Base UI for Toast (with a separate Sonner `Toaster`), `react-hook-form` for Form, and the standard specialist dependencies for components such as Calendar, Carousel, Chart, and Command. Base UI is scoped to the toast component only.

`DataTable` is generic over `TData` and does not depend on TanStack Table, so no table dependency is installed for you.

The package supports React 19 consumers. Its packed tarball is tested against Vite React 19, Next App Router, and server-side rendering.

## Runtime requirements

Node.js 22 or newer. `engines.node` moved from `>=20` to `>=22`: the previous bound advertised a runtime the verification matrix never tested, and Node 20 has been end-of-life since April 2026.

## Dependencies you now own

Version 27 no longer installs packages this library never imports. If you compose the affected components, declare them yourself:

```diff
   "dependencies": {
     "@mivabyte/ui": "^27.0.0",
+    "@hookform/resolvers": "^5.9.1",
+    "zod": "^3.25.76",
   }
```

`zod` and `@hookform/resolvers` are optional peers used by your own resolver wiring, and `@tanstack/react-table` is an optional peer for consumers who compose `DataTable` with a TanStack table instance. Everything the components themselves render stays a direct dependency, including `@types/lodash`, which `recharts` v2 needs in order for its own type declarations to resolve in a consumer's `tsc` run.

## Component inventory

The release exposes exactly 66 component modules. Consult [`../components.md`](../components.md) for the current list; `config/components.mjs` is the checked source of truth.
