# Mivabyte — Midnight / Cyan / Azure

## 0. Meta

```yaml
version: 1.0.0
framework:
  css: tailwind-v4
  component_library: radix-primitives
theme_modes: [light, dark]
dark_mode_strategy: class
```

This is the design contract; `src/tokens.css` is its executable source of truth, imported by `src/styles.css`. Retain the existing HSL-channel token convention and public stylesheet entry. Do not generate a competing theme file. The user has authorized the token and component evolution described here.

## 1. Brand Narrative & Philosophy

Precise technology, warm human typography, and quiet depth. Midnight anchors the canvas; Cyan signals attention in dark mode; Azure carries actions in light mode. Distinction comes from composition, tonal layers and type before decoration. Dense applications and spacious websites share the same components, with different layout rhythms. Most surfaces remain neutral. Use one highlighted object or section per visual group.

## 2. Color System

Semantic HSL channels are consumed as `hsl(var(--token))`. Chart, shadow and gradient tokens are complete CSS values. Keep brand primitives for identity assets; components consume roles.

| Role             | Token / Tailwind mapping                                           | Intent                                                       |
| ---------------- | ------------------------------------------------------------------ | ------------------------------------------------------------ |
| Canvas           | `--background` / `--color-background`                              | Cool off-white / Midnight                                    |
| Text             | `--foreground`, `--muted-foreground`                               | Strong headings, readable secondary copy                     |
| Section          | `--section`                                                        | Tonal separation without another border                      |
| Surface          | `--surface`, `--card`                                              | Content layer                                                |
| Raised           | `--surface-elevated`, `--popover`                                  | Floating and foreground content                              |
| Interactive      | `--surface-interactive`                                            | Hover and active spatial feedback                            |
| Action           | `--primary`, `--primary-hover`, `--primary-foreground`             | Azure + white / Cyan + Midnight                              |
| Quiet selection  | `--accent`, `--accent-foreground`                                  | Subtle tinted background with readable ink                   |
| Intensities      | `--accent-muted`, `--accent-strong`, `--accent-glow`               | Stronger tint, explicit border, rare highlight               |
| Secondary accent | `--info`, `--info-subtle`                                          | Azure informational content                                  |
| Feedback         | `--success`, `--warning`, `--destructive`, corresponding `-subtle` | Always accompany color with a label or icon                  |
| Boundaries       | `--border`, `--border-strong`, `--input`                           | Decorative division vs identifiable controls                 |
| Focus            | `--ring`                                                           | Visible against adjacent surfaces; double offset ring        |
| Data             | `--chart-1` through `--chart-5`                                    | Azure/Cyan, teal, violet, amber, rose; use labels/dashes too |

The generic skill's roles `--color-bg`, `--color-fg`, `--color-fg-muted`, `--color-focus-ring`, `--color-danger`, `--color-accent-hover` map to the existing background, foreground, muted-foreground, ring, destructive, primary-hover tokens; these are documentation mappings, not duplicate CSS aliases. `--color-surface`, `--color-border`, `--color-accent`, `--color-success` are Tailwind mappings.

Text pairs target 4.5:1; essential control boundaries and focus target 3:1. Decorative card borders need not reach 3:1. Bright brand Cyan is not small text on white. Accent/gradient sections retain foreground text, not white text on a bright gradient. Glass is opt-in with a sufficiently opaque base; never place important copy over unknown imagery.

## 3. Typography

Self-hosted Onest variable (existing licensed assets), system fallback, no network font dependency. Tailwind's `--text-xs`, `--text-sm`, `--text-base`, `--text-lg`, `--text-xl`, `--text-2xl`, `--text-3xl`, `--text-4xl` remain for application utilities. Semantic roles use `--type-display` (40–80px), `--type-statement` (36–64px), `--type-page` (28–40px), `--type-section` (24–32px), `--type-title` (20–24px), `--type-card` (18px), `--type-lead` (18–20px), and `--type-signal` (28–40px). Headlines use balanced wrapping and tight tracking; paragraphs use 1.6 leading and a reading measure. Statistics use tabular numerals. Visual role and semantic heading element remain independent.

## 4. Spacing

Keep Tailwind's 4px scale. `--page-gutter`: fluid 20–40px; `--section-space`: 56–112px; `--layout-gap`: 16–32px; `--panel-padding`: 24px (20px compact); `--control-height`: 44px (32px compact desktop). Compact is for deliberate desktop density; coarse pointers retain 44px primary targets. Use logical padding-inline and text-start for RTL.

## 5. Radius

One 10px base `--radius`, controls `--shape-control` 8px, surfaces `--shape-surface` 12px, panels `--shape-panel` 16px. `--radius-md`, `--radius-lg`, `--radius-full` remain Tailwind shapes. Avoid pillifying every action or mixing unrelated shapes.

## 6. Elevation

Canvas → section → surface → elevated → interactive → focused. `--shadow-surface` is a tiny ambient shadow plus inner highlight; `--shadow-elevated` adds separation; `--shadow-overlay` is reserved for dialogs and floating surfaces. `--gradient-surface` adds a restrained light edge; `--gradient-accent` washes a section; `--shadow-accent` is for one selected/highlighted item. `--overlay` dims context. Keep z-index limited to sticky navigation 20 and floating overlays 50 (existing convention).

## 7. Motion

- fast (duration): 120ms — hover/press.
- base (duration): 180ms — menus, tooltips.
- slow (duration): 240ms — dialogs, sections.
- out (cubicBezier): (0.16, 1, 0.3, 1).
- in (cubicBezier): (0.4, 0, 1, 1).

Executable names are `--motion-duration-fast`, `--motion-duration-base`, `--motion-duration-slow`, `--motion-easing-out`, `--motion-easing-in`. Animate opacity/transform for entrances; short color transitions communicate states. No default page reveal, parallax or looping glow. `prefers-reduced-motion: reduce` disables nonessential transitions and animations including legacy utilities. Skeletons remain visibly present when motion is disabled. Hover lift is limited to hover-capable fine pointers.

## 8. Component State Matrix

| Family            | Required states                                                                                                         |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Button / link     | hover, active, focus-visible, disabled, loading/aria-busy; suppress disabled link activation                            |
| Card              | default, elevated, interactive (real link/button inside), accent, glass, highlighted; existing surface/outline retained |
| Field             | default, hover, focus-visible, disabled, readonly, aria-invalid with associated error                                   |
| Navigation / tabs | default, hover, selected with weight/background, focus-visible; preserve primitive keyboard behavior                    |
| Overlay           | open/closed, focus trap, Escape, focus restoration, scrollable small viewport                                           |
| Data / feedback   | labeled status, tabular values, non-color series distinction, empty/loading/error copy                                  |

Keyboard focus uses a double offset ring plus forced-colors outline. Under `forced-colors: active`, respect system colors and expose real control borders. Increased contrast strengthens essential boundaries. Never make a div into a keyboard trap to get an interactive card appearance.

## 9. Layout

Use semantic section markup with package-owned `ui-section` and `data-tone="muted|accent|gradient|grid"`. Compose Container, Heading, Text and Card. This avoids a new shell/component API and keeps the existing 66 module registry stable.

Marketing: asymmetric hero with real product evidence, generous section rhythm, readable measures, alternating section tones, one prominent CTA. Features and case studies use interactive cards with actual links; pricing highlights only the recommended plan; testimonials use semantic blockquotes; blog/article content uses the reading Container. No decorative illustration is required when a useful product preview can explain the offer.

Applications: Sidebar + topbar + page heading/actions + statistics + main table/chart + activity. Stable neutral surfaces, tighter spacing, labeled icons, clear selection. Settings/auth/onboarding use elevated forms; command/search/dialog/drawer share popover elevation; filters and tabs use quiet accent selection; empty states explain the next action. Charts need visible labels, accessible summary and distinguishable line/marker patterns.

Validate at 320, 375, 428, 768, 1024, 1280, 1440 and 1920px; light/dark, compact/comfortable, reduced motion and forced colors. Mobile stacks rather than shrinking desktop columns. Menus and dialogs inherit mode by setting `.dark` on documentElement; subtree consumers must provide a themed portal container where supported.

## 10. Agent / Consumer Rules

Use existing package exports and semantic tokens, never local palette copies. Do not add named variants for content types (statistic/feature) when composition suffices. User className overrides remain intentional escape hatches; remove redundant `border-0 shadow-none` in a consumer only after reviewing the specific design. `data-mivabyte-theme` is historical metadata, not three independently implemented palettes. Do not promise unsupported themes or lower-level CSS exports.

The canonical interactive reference is Storybook `Design System/Foundations` and `Design System/Compositions`. Source audit, examples, migration notes and rollout plan live in `docs/design-system-evolution.md`.
