# Visual system audit and implementation plan

## Evidence and diagnosis

Inspected the package at b9251a8, its Storybook examples, Vite/Next fixtures, sibling website homepage/service components, and ui-showcase index. Consumer files are evidence, not a second implementation target. Existing production content and dependencies remain consumer-owned.

| Area        | Verified cause                                                                                                                                                                   | Package change / composition guidance                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Color       | Cyan/Azure brand primitives exist, but few semantic accent levels and no success/warning/info surface roles. Same primary in both themes gives insufficient white text contrast. | Theme-specific action pairs; subtle/muted/strong accent roles; semantic status/data palette.                    |
| Hierarchy   | Card's variant prop only writes a data attribute; all variants look the same.                                                                                                    | Real tonal/elevated/interactive/highlighted surfaces.                                                           |
| Typography  | Heading display/page/section/title map mostly to h2 styling; Text signal is ordinary body copy. Bundled Onest is never loaded.                                                   | Restore distinct fluid visual roles and numerical typography; ship/load existing fonts.                         |
| Surfaces    | Card and popover share a dark fill. Surface tokens promised in README are absent. `tokens.css` is not imported and defines a conflicting radius.                                 | Consolidate tokens; layered fills, inner highlights, ambient/overlay shadows.                                   |
| Spacing     | Controls are 28–40px despite the README claiming 44px. Hero locally uses only 8–16px vertical padding.                                                                           | Density contract and coarse-pointer target guard; section rhythm tokens.                                        |
| Components  | Tabs variants also inert; secondary hover is an opacity mix. Buttons loading doesn't set aria-busy.                                                                              | Purposeful button/tab/badge variants, accessible state feedback.                                                |
| Layout      | Website repeatedly applies `border-0 shadow-none`, tight hero spacing, and repeated equal card grids; showcase uses background-colored tiles separated by lines.                 | Add website/app compositions demonstrating asymmetry, section tones, dominant content, useful product evidence. |
| Interaction | Many one-pixel focus rings, transparent fields, weak input borders. Link-rendered loading buttons are not reliably inert.                                                        | Visible offset focus, semantic input boundaries and suppressed disabled link activation.                        |
| Motion      | No motion tokens or reduced-motion rules despite documentation claims; `animate-in` classes lack their animation stylesheet.                                                     | Import existing animation dependency; unify durations/easing and reduced-motion escape hatch.                   |

These are not solved by saturating more UI. Typography and layout must carry the hierarchy even in grayscale.

## Research informing the direction

- [Radix Colors scale roles](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale): distinguish application backgrounds, element states, borders, solid accents and readable text. Apply the role separation to our own palette, without importing another theme framework.
- [Carbon color usage](https://carbondesignsystem.com/elements/color/usage/): use explicit layers to communicate depth. Keep our existing HSL contract and a small explicit surface ladder.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/): test text and essential UI contrast, keyboard/focus, reflow and motion preferences. Automated scans are evidence, not full accessibility certification.

## Implementation sequence

1. Consolidate token ownership in src/tokens.css; import through the existing aggregate stylesheet; wire existing self-hosted fonts and animation dependency.
2. Improve existing Button, Card, Typography, input, tabs, badge, table, overlay and empty primitives; retain imports and established semantic APIs.
3. Add package-owned section/layout recipes plus Storybook foundations and composed website/dashboard examples. No new framework, duplicated palette or competing CSS export.
4. Verify semantic contrast and state behavior in real browsers at both modes and multiple widths; check reduced motion, forced colors, keyboard/dialog behavior and touch density. Run build, type, runtime, package and API checks.
5. Document migration and the exact validation outcome. Consumers adopt the released/packed package and remove redundant local overrides deliberately.

## Concrete before → after

```tsx
// Before: strips depth, sizes each page independently.
<Card className="border-0 shadow-none">
  <Typography variant="h2" className="text-xl font-bold">Delivery</Typography>
</Card>

// After: one semantic surface, real heading hierarchy.
<Card variant="elevated">
  <CardHeader>
    <Heading render={<h2 />} variant="card">Delivery</Heading>
    <CardDescription>From first release to dependable operation.</CardDescription>
  </CardHeader>
</Card>

// Website: shared section tone and spacing; utility layout remains composable.
<section className="ui-section" data-tone="gradient">
  <Container>
    <Eyebrow>Designed to move you forward</Eyebrow>
    <Heading variant="display">Technology with a clear purpose.</Heading>
    <Text variant="lead">One coherent system, from first visit to everyday work.</Text>
    <Button size="lg">Start a project</Button>
  </Container>
</section>

// Application: statistics are composition, not another Card variant.
<Card>
  <CardHeader>
    <CardDescription>Monthly active accounts</CardDescription>
    <Text variant="signal">2,846</Text>
    <Badge variant="success">Up 12.8%</Badge>
  </CardHeader>
</Card>
```

## Consumer migration

Import only `@mivabyte/ui/styles.css`. `.dark` on `<html>` themes body portals and native controls consistently. `.light` permits an explicit light preview. `data-density="compact"` belongs to intentional dense desktop regions. Product/editorial/portal attributes remain harmless metadata; they never selected working palettes in the audited source. README examples and unsupported tokens/themes CSS imports are corrected.

Preserved brand primitive names and HSL-channel semantic values avoid breaking existing `hsl(var(--...))` consumers. Keep existing component import paths, Card surface/outline aliases, and heading/text role names. Unknown Card/Tabs variant strings fall back to default styling for source compatibility.

Remove `border-0 shadow-none` from website feature/pricing/service cards when adopting default/elevated variants. Keep them where an intentionally borderless editorial block is desired. Replace manual headline sizes with Heading roles, wrapper spacing with ui-section, raw gradients with semantic section tone. Do not globally strip overrides: website photography, content and intentional compositions remain local. This task does not publish the package or change a running production website.

Do not introduce separate statistic/feature cards, new app shells or brand-specific chart libraries. Existing primitives plus documented recipes cover those jobs. Glass, grid and glow are optional tools with a narrow purpose, never defaults for dense data views.

## Implemented scope

The existing 66-module registry and CSS import path are unchanged. Tokens are consolidated in `src/tokens.css`; `src/styles.css` is the aggregate/Tailwind bridge; `src/system.css` supplies font faces, reusable composition classes, component surface recipes and accessibility fallbacks. There is no second palette or theme provider.

Implemented real Card variants; differentiated Heading/Text roles; semantic Button and Badge variants; field and table contrast; floating-surface elevation; working animation utilities and motion tokens; responsive Sidebar navigation with focus restoration; loading semantics for native and slotted buttons. Ordinary native button submit behavior remains compatible—forms should still declare type explicitly. Compact Card padding is token-driven. The default example application supports search, creating a project, notifications, tabs, empty states and a labeled chart.

Source/API checks remain intact. The source-theme contract now checks the imported token owner rather than requiring all declarations inline. Storybook composition stories live under `stories/design/`, leaving the registry's one-story-per-component contract intact. Calendar and Carousel embed Button, so their narrowly adjusted bundle ceilings account for the new action variants and loading semantics; no other budgets were increased.

## Remaining adoption boundaries

No npm release, dependency upgrade in the website, or production deployment is part of this working-tree change. The website must adopt the resulting package and review its explicit border/shadow/heading overrides; package defaults cannot override consumer utility classes intentionally. Its large empty hero scroll region is a website animation/layout issue and is not removed by a shared token change.

The current browser suite exercises these maintained compositions, not every state of all 66 primitives. The older `tests/e2e` fixture/snapshot suite targets a removed application shell and needs a separate fixture migration; those snapshots were neither replaced nor used to claim parity. The skill's generic shell validators also produced macOS awk parsing errors and do not understand shared CSS states, so their scores are not used as accessibility evidence. Real browser assertions and Axe provide the checks reported here.
