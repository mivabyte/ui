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

The root barrel is also available, but component subpaths are preferred for explicit boundaries and independently verified tree-shaking.

## Removed APIs

Remove imports for the old provider, shell/theme or density helpers, custom layout extensions, legacy form barrel, and historical `reset.css`, `tokens.css`, and `themes.css` stylesheet subpaths. They are not part of the version 27 public contract.

Use standard shadcn composition with semantic HTML, the component modules above, and Tailwind utility classes instead.

## Runtime baseline

Interactive primitives use the official shadcn stack: Radix primitives where applicable, Vaul for Drawer, Sonner for Toast, and the standard specialist dependencies for components such as Calendar, Carousel, Chart, Command, and Data Table.

The package supports React 19 consumers. Its packed tarball is tested against Vite React 19, Next App Router, server-side rendering, and a direct-versus-root tree-shaking check.

## Component inventory

The release exposes exactly 65 component modules. Consult [`../components.md`](../components.md) for the current list; `config/components.mjs` is the checked source of truth.
