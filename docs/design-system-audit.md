# Designsystem-Prüfung — 8. Oktober 2026

Die 82 veröffentlichten Storybook-Beispiele wurden in Light und Dark geprüft und ihre Screenshots nebeneinander gesichtet. Zusätzlich wurden geöffnete Overlays, Formularzustände und Tastaturbedienung geprüft. Die gefundenen Darstellungs- und Zustandsfehler sind im gemeinsamen Paket korrigiert.

## Korrekturen

| Befund                                                                     | Änderung                                                                                                                              |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Schattenklassen überdeckten den Fokusrahmen                                | Der gemeinsame `ui-focus`-Zustand liegt in derselben CSS-Schicht wie Utilities und bleibt sichtbar.                                   |
| Fehlerrahmen und Read-only-Flächen wurden durch Grundfarben überdeckt      | Zustandsselektoren für `aria-invalid` und `readonly` gewinnen gegenüber den Grundfarben. InputGroup zeigt auch Fehler seiner Eingabe. |
| NativeSelect hatte abweichende Höhe und Oberfläche                         | NativeSelect verwendet die gemeinsamen Control-, Dichte-, Surface- und Fokusrollen.                                                   |
| Outline-Toggles hatten kräftigere Konturen als Buttons                     | Beide verwenden die dedizierte neutrale Outline-Rolle. Erhöhter Kontrast verstärkt diese Konturen.                                    |
| Tooltips erschienen wie farbige Hauptaktionen                              | Tooltips verwenden die neutrale Popover-Fläche, Textfarbe, Kontur und Elevation.                                                      |
| Menü-Tastenkürzel waren durch Deckkraft zu schwach                         | DropdownMenuShortcut verwendet die lesbare sekundäre Textfarbe.                                                                       |
| Custom ScrollArea war mit Tastatur nicht erreichbar                        | Beide Scrollbar-Modi haben einen fokussierbaren Viewport.                                                                             |
| Command-Separator war ein unzulässiges Kind im Listbox-Zugänglichkeitsbaum | Der dekorative Separator ist für Assistenztechnik verborgen. Die bisher deaktivierte Axe-Regel im Runtime-Test ist wieder aktiv.      |
| Combobox und einige Beispiele hatten keine zugängliche Bezeichnung         | Combobox hat einen stabilen Trigger-Namen; Select-, NativeSelect-, OTP- und Progress-Beispiele sind beschriftet.                      |
| Storybook-Beispiele liefen auf schmalen Viewports über                     | Preview-Container begrenzen ihre Breite; NavigationMenu kann umbrechen und begrenzt den Dropdown-Viewport.                            |
| Lautstärke-Thumb war als Ziel zu klein                                     | Die Bedienfläche ist 24px groß; der sichtbare Punkt bleibt klein.                                                                     |

Die zuvor vorgenommenen Palettenkorrekturen bleiben bestehen: neutrale dunkle Flächen, lesbare Cyan-Hauptaktionen und zur Füllfarbe passende Buttonrahmen.

## Verifikation

| Prüfung                                  | Ergebnis                                                                                                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vollständiger Storybook-Scan in Chromium | 82 Stories × 2 Themes, keine verbleibenden Axe-A/AA-Befunde, keine Laufzeitfehler und kein dauerhafter horizontaler Überlauf bei 375, 768 und 1440px.               |
| Visuelle Sichtung                        | 164 Screenshots in Light/Dark-Paaren sowie geöffnete Overlay-Screenshots geprüft.                                                                                   |
| Kompositionen und MediaPlayer            | 57 Browserchecks bestanden, verteilt auf Chromium, Firefox und WebKit. Enthalten Reflow, semantische Kontraste, Tastatur, Dichte, RTL und Medieninteraktionen.      |
| Formularzustände                         | 6 Browserchecks bestanden: Fehlerfarben einschließlich Hover, Read-only, Disabled, Fokus und erhöhte Kontraste.                                                     |
| Geöffnete Overlays                       | 6 Browserchecks bestanden, jeweils mit Dialog, Sheet, Drawer, DropdownMenu, Popover, Tooltip und HoverCard. Farben, Accessibility und Escape/Fokusrückkehr geprüft. |
| Gepackter Consumer                       | 62 E2E-Tests bestanden; 127 Tests durch bestehende Browser-/Plattformbedingungen übersprungen. Snapshot-Vergleiche waren mit `--ignore-snapshots` deaktiviert.      |
| Runtime                                  | 140 Tests bestanden.                                                                                                                                                |
| `npm run verify`                         | Erfolgreich, einschließlich Lint, Format, Registry, Typecheck, Build, Verträgen, Package-/API-Prüfung und Coverage.                                                 |
| Storybook                                | Typecheck und Produktionsbuild erfolgreich.                                                                                                                         |

Der modale Radix-Dropdown verbirgt seinen Triggerbaum mit `aria-hidden`, während er Tastaturfokus im Menü hält. Der Overlay-Test prüft deshalb für diesen Fall die Tab-Begrenzung separat und scannt mit Axe das aktive Menü. Die übrigen Overlay-Checks scannen das ganze Dokument. Es wurden keine Axe-Regeln pauschal deaktiviert.

Für die Abschlussprüfung wurde das gebaute Storybook mit Vite Preview verwendet, um Reloads des Entwicklungsservers auszuschließen und Video-Range-Requests zu unterstützen. Firefox wendet die emulierte erhöhte Kontraststufe nach Navigation zuverlässig auf CSS an; der Test lädt die Seite nach dem Wechsel neu.

## Reproduktion

```sh
npm run storybook:build
npx vite preview --host 127.0.0.1 --port 6008 --outDir storybook-static
```

In einem zweiten Terminal:

```sh
STORYBOOK_URL=http://127.0.0.1:6008 npm run test:design
npm run verify
```

## Grenzen und Ergebnis

**Visuelle Regression: INCONCLUSIVE.** Die bestehenden Bildbaselines gehören Chromium/Linux; auf diesem macOS-Rechner wurde kein automatischer Pixelvergleich gegen diese Baselines behauptet. Die aktuellen Bilder wurden visuell gesichtet. Ein vollständiger manueller Screenreader-Durchgang und eine Nutzerstudie waren nicht Teil dieser Prüfung; ein sauberer Axe-Lauf ist kein Beweis vollständiger WCAG-Konformität.

Im beschriebenen Umfang bleiben keine offenen Befunde. Die Änderungen und Changesets liegen lokal vor; eine neue Paketversion wurde noch nicht veröffentlicht.
