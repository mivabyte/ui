# Farbpalette für Mivabyte

Stand: 2. Oktober 2026. Kurze explorative Literaturrecherche für die bestehende UI, keine systematische Übersichtsarbeit.

## Entscheidung

Exakt **#06B6D4** führt die visuelle Identität. Apricot ist der warme Gegenpol für sekundäre Aktionen und ergänzende Inhalte. Auswahlzustände bleiben in der Cyan-Familie; Blau gehört zur Informationsrolle. Die Forschung begründet Kontrast, Kontextprüfung und konsistente Rollen. Die konkrete Markenwirkung ist eine Designentscheidung.

| Familie | Markenanker | Verwendung                                         |
| ------- | ----------- | -------------------------------------------------- |
| Cyan    | `#06B6D4`   | Hauptaktionen, Fokus, Links und Auswahl            |
| Apricot | `#FDBA74`   | Sekundäre Aktionen und ergänzender Planungskontext |
| Amber   | `#F59E0B`   | Warnungen mit verständlichem Text und Symbol       |
| Emerald | `#10B981`   | Erfolg und positive Entwicklung                    |
| Coral   | `#F43F5E`   | Fehler und destruktive Aktionen                    |
| Azure   | `#3B82F6`   | Information und Verarbeitung                       |

Markenanker sind keine universell geeigneten Textfarben. Komponenten verwenden diese semantischen Kombinationen:

| Rolle                   | Hell: Text / Fläche   | Dunkel: Text / Fläche |
| ----------------------- | --------------------- | --------------------- |
| Hauptaktion             | `#FFFFFF` / `#0E7490` | `#121212` / `#06B6D4` |
| Sekundäre Aktion        | `#9A3412` / `#FFEDD5` | `#FED7AA` / `#4A2816` |
| Sekundäre Aktion, Hover | `#9A3412` / `#FED7AA` | `#FED7AA` / `#62351D` |
| Auswahl                 | `#155E75` / `#CFFAFE` | `#A5F3FC` / `#083344` |
| Erfolg                  | `#047857` / `#ECFDF5` | `#34D399` / `#102C23` |
| Warnung                 | `#B45309` / `#FFFBEB` | `#FBBF24` / `#33250F` |
| Fehler, dezente Fläche  | `#BE123C` / `#FFF1F2` | `#FB7185` / `#3B1826` |
| Information             | `#1D4ED8` / `#EFF6FF` | `#93C5FD` / `#172B49` |
| Inhalt                  | `#0F172A` / `#F8FAFC` | `#FAFAFA` / `#121212` |
| Karte                   | `#0F172A` / `#FFFFFF` | `#FAFAFA` / `#1C1C1C` |

Links verwenden `#0E7490` auf hellen Flächen und `#06B6D4` auf dunklen. Die Konturen gefüllter Buttons entsprechen ihrer Fläche. Helle Hauptaktionen verwenden dunkles Cyan (`#0E7490`) mit weißer Beschriftung; der Hover-Zustand verwendet `#155E75`. Outline-Buttons verwenden neutrale Konturen (`#8C8C8C` / `#878787`). Apricot wird nicht als Warnsignal eingesetzt: Warnungen verwenden die eigene Amber-Rolle und eine ausdrückliche Zustandsbeschreibung. In Diagrammen ergänzt eine gestrichelte Apricot-Linie die durchgezogene Cyan-Linie; Beschriftung und Linienmuster bleiben auch ohne Farberkennung verständlich.

Die Verteilung gehört zur Palette: Eine gemeinsame Kennzahlenfläche ersetzt konkurrierende Statistik-Karten. Kleine farbige Symbole, numerische Fortschrittsanzeigen und konsistente Auswahlflächen geben Orientierung. Hervorgehobene Karten behalten eine neutrale Inhaltsfläche mit Cyan-Kontur. Marketing und Anwendung teilen dieselben Farbrollen. Große Flächen verwenden keine zusätzlichen gesättigten Blautöne.

Die dunklen Inhaltsflächen verwenden seit 8. Oktober 2026 neutrale Grautöne: `#121212` für den Hintergrund, `#181818` für Abschnitte, `#1C1C1C` für Karten, `#292929` für erhöhte und `#333333` für interaktive Flächen. Die helle Palette und die semantischen Akzentfarben bleiben unverändert.

## Evidenz und Grenzen

| Quelle / Evidenzart                                                                                                                                                                         | Untersuchung oder Regel                                                                                                                                                                                                                                   | Relevanz und Grenze                                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Schloss & Palmer (2011)](https://link.springer.com/article/10.3758/s13414-010-0027-0), begutachtete Primärstudie; DOI `10.3758/s13414-010-0027-0`, PMID `21264737`                         | Vier Bewertungsaufgaben mit denselben 48 Personen: Präferenz, Harmonie, Ähnlichkeit und Vordergrundpräferenz. Ähnliche Farbtöne steigerten durchschnittlich Paarharmonie und Paarpräferenz; stärkerer Farbtonkontrast steigerte die Vordergrundpräferenz. | „Harmonisch“, „gefällt“ und „hebt sich ab“ sind verschiedene Ziele. Der Hintergrund zählt. Gemessene Farbflächen, keine Produktnutzung oder Untersuchung unserer exakten Palette.                                                              |
| [Szafir (2018)](https://danielleszafir.com/colordiff_vis2017.pdf), begutachtete Primärstudie; DOI `10.1109/TVCG.2017.2744359`, [PMID `28866544`](https://pubmed.ncbi.nlm.nih.gov/28866544/) | Drei Online-Experimente mit Punkten, Balken und Linien; insgesamt 461 rekrutierte Personen. Größe und Form beeinflussten die Erkennbarkeit von Farbunterschieden.                                                                                         | Farben an echten kleinen Markierungen prüfen. Graue Ablenkmarkierungen und vereinfachte Aufgaben begrenzen die Übertragbarkeit. Personen mit gemeldeter Farbsehschwäche wurden ausgeschlossen: kein Beleg für Barrierefreiheit dieser Palette. |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/), normative Anforderungen, keine Präferenzstudie                                                                                                   | SC 1.4.3: regulärer Text mindestens 4,5:1, großer Text 3:1. SC 1.4.11: wesentliche visuelle Kontroll- und Grafikmerkmale 3:1 zu angrenzenden Farben. SC 1.4.1: Bedeutung nicht ausschließlich durch Farbe vermitteln.                                     | Lesbare Text-/Flächenpaare, erkennbare Kontrollen und zusätzliche Beschriftung, Symbole oder Linienmuster. Einzelne bestandene Kontrastchecks beweisen keine vollständige WCAG-Konformität eines Produkts.                                     |
| [Material Web: Color](https://material-web.dev/theming/color/), offizielle Designsystem-Anleitung                                                                                           | Farben werden Rollen wie Primary, Secondary, Tertiary, Error und Neutral zugeordnet; Inhaltsfarben erhalten passende Kontrastpaare in hellen und dunklen Themen.                                                                                          | Begründet unsere semantische Token-Struktur, nicht die Überlegenheit bestimmter Hex-Werte.                                                                                                                                                     |
| [Nielsen Norman Group: Similarity Principle (2020)](https://www.nngroup.com/articles/gestalt-similarity/), UX-Praxisempfehlung                                                              | Konsistente Farbzuordnung unterstützt die Gruppierung ähnlicher Funktionen; Linkfarben und Hauptaktionsfarben sollen konsistent verwendet werden.                                                                                                         | Anlass, sekundäre Aktionen zurückhaltender zu gestalten und dekorative Überschriften vom Link-Stil zu trennen. Keine kontrollierte Prüfung unserer Palette.                                                                                    |

Damit ist die Basis für Lesbarkeit konkret überprüfbar. Die wahrnehmungsbezogenen Befunde sind auf unsere UI nur begrenzt übertragbar; die ästhetische Eignung der exakten Akzentfarben bleibt eine Hypothese für unsere Zielgruppe. Aus den Quellen folgen keine garantierte Conversion-Steigerung, universellen Farbemotionen oder nachgewiesene optimale Cyan-Apricot-Kombination.

## Eigene Kontrastmessungen

Berechnet aus sRGB mit der relativen Luminanz und Kontrastformel aus WCAG 2.2. Werte auf zwei Stellen gerundet; Schwellen werden vor der Rundung geprüft.

| Text / Fläche         | Kontrast | Entscheidung                         |
| --------------------- | -------: | ------------------------------------ |
| `#FFFFFF` / `#0E7490` |   5,36:1 | Beschriftung der Hauptaktion hell    |
| `#FFFFFF` / `#06B6D4` |   2,43:1 | Ungeeignet für Button-Beschriftungen |
| `#0E7490` / `#FFFFFF` |   5,36:1 | Link auf hellen Karten               |
| `#06B6D4` / `#1C1C1C` |   7,02:1 | Link auf dunklen Karten              |
| `#9A3412` / `#FFEDD5` |   6,38:1 | Sekundäre Aktion hell                |
| `#9A3412` / `#FED7AA` |   5,40:1 | Sekundäre Aktion hell, Hover         |
| `#FED7AA` / `#4A2816` |   9,66:1 | Sekundäre Aktion dunkel              |
| `#FED7AA` / `#62351D` |   7,58:1 | Sekundäre Aktion dunkel, Hover       |

Die Browserprüfungen in `tests/design/system.spec.ts` kontrollieren berechnete Farben sowie semantische Kontrastpaare. Beispielseiten werden in hellen und dunklen Themen, responsiv und mit automatisierten Accessibility-Prüfungen geprüft. Charts behalten Beschriftungen und unterschiedliche Linienmuster. Diese Prüfungen ersetzen keine Nutzerstudie zur Erkennbarkeit kleiner Diagramme oder zur Markenpräferenz.

## Rechercheprotokoll

Frage: Welche Wahrnehmungsbefunde und überprüfbaren UI-Anforderungen helfen, um die festgelegte Hauptfarbe `#06B6D4` eine mehrfarbige Palette zu entwickeln?

Aufgenommen wurden zugängliche Primärstudien zu Farbkombinationen bzw. Farbdifferenzierung sowie die aktuellen offiziellen Accessibility- und Designsystem-Quellen. Keine Datumsbeschränkung bei Grundlagenstudien; englischsprachige Quellen. Ausgeschlossen wurden allgemeine Marketingbehauptungen über Farbemotionen, Suchtreffer ohne geprüften Inhalt und themenfremde Arbeiten. Primärstudien, Standards und Praxisempfehlungen wurden getrennt bewertet. Mehrfachfundstellen derselben Studie sind jeweils ein Eintrag, ohne behauptete vollständige Trefferzählung.

| Datum      | Zugang                                  | Exakte Abfrage / Prüfung                                                                                    | Verwendeter Beleg                                           |
| ---------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 2026-10-02 | Websuche; Verlag; PubMed-Metadaten      | `"Aesthetic response to color combinations" preference harmony similarity Schloss Palmer`                   | Schloss & Palmer; Volltext beim Verlag geprüft              |
| 2026-10-02 | Websuche; Autoren-PDF; PubMed-Metadaten | `"Modeling Color Difference for Visualization Design" Szafir`                                               | Szafir; Methoden und Einschränkungen im Autoren-PDF geprüft |
| 2026-10-02 | Direkter offizieller Abruf              | `https://www.w3.org/TR/WCAG22/` und WAI Understanding für Contrast Minimum, Non-text Contrast, Use of Color | WCAG-Anforderungen und Erläuterungen                        |
| 2026-10-02 | Direkter offizieller Abruf              | `https://material-web.dev/theming/color/`                                                                   | Farbrollen und kontrastierende Inhaltsfarben                |
| 2026-10-02 | Direkter Abruf beim Autor/Institut      | `https://www.nngroup.com/articles/gestalt-similarity/`                                                      | Konsistente funktionale Farbzuordnung                       |

Als nächster empirischer Schritt eignet sich ein Vergleich mit echten Nutzern: Hauptaktion finden, Status ohne Farbnamen erkennen, kleine Diagrammserien unterscheiden und Markenwirkung bewerten. Dabei Aufgabenzeit und Fehler getrennt vom ästhetischen Gefallen messen. Ein solcher Test wurde hier nicht durchgeführt.
