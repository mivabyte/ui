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
- `@mivabyte/ui/kbd-group` — upstream exports `KbdGroup` from its `kbd` module, not as a standalone `kbd-group` component. Import it from `@mivabyte/ui/kbd` alongside `Kbd`.

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

Interactive primitives use the official shadcn stack: Radix primitives where applicable, Vaul for Drawer, Base UI for Toast (with a separate Sonner `Toaster`), `react-hook-form` for Form, and the standard specialist dependencies for components such as Calendar, Carousel, Chart, Command, and Data Table. Base UI is scoped to the toast component only.

The package supports React 19 consumers. Its packed tarball is tested against Vite React 19, Next App Router, and server-side rendering.

## Component inventory

The release exposes exactly 66 component modules. Consult [`../components.md`](../components.md) for the current list; `config/components.mjs` is the checked source of truth.
