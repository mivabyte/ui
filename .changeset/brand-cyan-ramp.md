---
"@mivabyte/ui": patch
---

Align the primary colour family on one measured cyan ramp.

The cyan family had drifted apart. The brand primitive `--mivabyte-cyan-dark`
is `#06B6D4`, but no component consumed it, while the light theme used
`--primary: 198 92% 31%` (`#066c98`, hue 198) and the dark theme used
`188 86% 53%` (`#20d3ee`). Two hues for one brand, plus a brand primitive that
nothing read.

Tokens now carry a single `--brand-cyan-*` ramp at hue 188, with step 500 as the
`#06B6D4` brand anchor. `--mivabyte-cyan-dark` points at that step, so the
anchor has exactly one definition and can no longer drift away from the role
tokens.

Measured WCAG contrast, computed from the token values before and after:

| pair                                              | before  | after   |
| ------------------------------------------------- | ------- | ------- |
| light `--primary-foreground` on `--primary`       | 5.82:1  | 6.62:1  |
| light `--primary-foreground` on `--primary-hover` | 7.90:1  | 8.46:1  |
| light `--accent-foreground` on `--accent`         | 6.84:1  | 7.19:1  |
| light `--accent-foreground` on `--accent-muted`   | 6.00:1  | 6.31:1  |
| light `--info` on `--info-subtle`                 | 5.29:1  | 6.09:1  |
| dark `--primary-foreground` on `--primary`        | 10.77:1 | 11.66:1 |
| dark `--primary-foreground` on `--primary-hover`  | 12.50:1 | 13.45:1 |
| dark `--info` on `--info-subtle`                  | 8.38:1  | 8.75:1  |

Every pair improves. `--accent-foreground` needed an extra step down to 21%
lightness: hue 188 is lighter than the previous hue 198 at equal HSL
lightness, so a straight swap would have dropped that pair from 6.84:1 to
5.69:1.

Step 500 stays decorative on purpose. The brand colour is only 2.33:1 on the
light canvas, so it cannot carry text or a control fill there; readable roles
therefore sit at step 700 in light and step 400 in dark.

Changed in both themes: `--primary`, `--primary-hover`, `--ring`,
`--accent-foreground`, `--accent-strong`, `--info`, `--info-subtle` and
`--chart-1`. No component API changed.

Visual regression baselines are chromium-on-linux only and are intentionally not
regenerated here. Regenerate them on Linux before merging; expect the
`visual` and `visual-states` suites to fail until then.
