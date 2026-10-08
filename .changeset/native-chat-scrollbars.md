---
"@mivabyte/ui": minor
---

Add `scrollbar="native"` and `viewportRef` to ScrollArea. MessageScroller now
defaults to browser-managed scrollbars to avoid delayed JavaScript thumb updates
in busy chats. Use `scrollbar="custom"` for the previous Radix behavior, and
`viewportRef` instead of querying `data-radix-scroll-area-viewport` for native
scroll position access.
