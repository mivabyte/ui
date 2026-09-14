# @mivabyte/ui Component Catalog

`@mivabyte/ui` is a centrally installable shadcn/ui distribution. The authoritative component inventory is `config/components.mjs`; release checks require the source directory, package subpaths, Storybook coverage, and generated exports to match it exactly.

## Setup

```bash
npm install @mivabyte/ui
```

```tsx
import { Button } from "@mivabyte/ui/button"
import { Toast } from "@mivabyte/ui/toast"
import "@mivabyte/ui/styles.css"

export function App() {
  return (
    <>
      <Button>Continue</Button>
      <Toast />
    </>
  )
}
```

Root imports are supported; component subpaths give the clearest dependency boundary and are verified for ESM and CommonJS consumers.

## Official catalog — 65 modules

`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `attachment`, `avatar`, `badge`, `breadcrumb`, `bubble`, `button`, `button-group`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `combobox`, `command`, `context-menu`, `data-table`, `date-picker`, `dialog`, `direction`, `drawer`, `dropdown-menu`, `empty`, `field`, `hover-card`, `input`, `input-group`, `input-otp`, `item`, `kbd`, `kbd-group`, `label`, `marker`, `menubar`, `message`, `message-scroller`, `native-select`, `navigation-menu`, `pagination`, `popover`, `progress`, `questionnaire`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `spinner`, `switch`, `table`, `tabs`, `textarea`, `toast`, `toggle`, `toggle-group`, `tooltip`, `typography`.

For the generated export inventory, see [`docs/generated/exports.md`](generated/exports.md).
