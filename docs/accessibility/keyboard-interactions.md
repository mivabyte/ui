# Keyboard interaction contracts

This matrix is the maintainer contract for high-risk interactive primitives. It documents expected behavior; automated tests remain the enforcement mechanism.

| Component  | Tab / focus entry                                 | Enter / Space                             | Escape                                 | Arrow keys                       | Focus restore           | Browser coverage                                    |
| ---------- | ------------------------------------------------- | ----------------------------------------- | -------------------------------------- | -------------------------------- | ----------------------- | --------------------------------------------------- |
| Dialog     | Trigger and modal focus cycle                     | Trigger activates                         | Closes                                 | Not primary navigation           | Returns to trigger      | Chromium, Firefox, WebKit                           |
| Sheet      | Trigger and modal focus cycle                     | Trigger activates                         | Closes                                 | Not primary navigation           | Returns to trigger      | Chromium, Firefox, WebKit                           |
| Tooltip    | Trigger remains keyboard reachable                | Trigger semantics remain native           | Dismisses when applicable              | Not primary navigation           | Trigger retains focus   | Chromium, Firefox, WebKit                           |
| Sidebar    | Trigger reachable; content follows document order | Trigger toggles                           | Mobile sheet closes                    | Component-specific controls only | Mobile trigger restored | Chromium, Firefox, WebKit                           |
| Tabs       | Active/selected tab is reachable                  | Activates according to component contract | Not a close interaction                | Moves between tabs               | Stays within tablist    | Runtime plus browser coverage when behavior changes |
| Pagination | Links remain native links                         | Native link activation                    | Not applicable                         | Browser-native                   | Browser-native          | Runtime semantic coverage                           |
| Toast      | Focus never moves to a toast (live region)        | Not a primary activation surface          | Dismisses the active toast via Base UI | Not primary navigation           | Focus is left untouched | Runtime semantics for region/role/live-region/close |

## Toast is a live region, not an overlay

`@mivabyte/ui/toast` is the upstream Base UI implementation and differs from every other row in this matrix: it is deliberately **not** a focus-managed surface. Its verified contract:

- the viewport is `role="region"`, `aria-live="polite"`, `aria-atomic="false"`, labelled `Notifications`;
- each toast root is `role="dialog"` so assistive technology can navigate into it on demand rather than having focus forced into it;
- mounting or dismissing a toast never moves focus, so a keyboard user is not interrupted mid-task;
- the close control is a real focusable `<button>` (`tabindex="0"`) labelled `Close toast`, reachable in normal tab order.

Because focus never enters the toast, there is no focus restore to assert and no focus trap to test. Announcements are verified at the runtime layer rather than in the browser: the live-region semantics are deterministic, while swipe and transition internals belong to Base UI and are not visual-regression material. When the base changes, re-run the `Toast` block in `tests/runtime/sidebar-and-hooks.test.tsx`, which pins all four properties above.

## Test placement

Use runtime tests for semantic role, accessible name, ARIA state, and deterministic interactions. Use Playwright for focus trapping, focus restoration, Escape behavior, real keyboard navigation, responsive overlays, RTL, forced colors, and media-query behavior.

Visual regression should cover only states where a rendering change would not be detected by semantic or interaction tests, such as focus visibility, open overlays, collapsed navigation, theme/density combinations, and selected high-risk states.

## Regression rule

When an accessibility bug is fixed, add the regression test at the lowest reliable layer and update this matrix only when the intended interaction contract itself changes. Do not add duplicate tests solely to increase test count.
