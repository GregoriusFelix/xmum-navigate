# Anti Slop delivery: map design system

Mode: during, selected by the user. Visual source: `C:/Users/gfcat/Downloads/design-map.md`. Content source: the XMUM Navigate landing-page brief. ENERGY 2 / RHYTHM 2 / MOTION 1.

Evidence: 51 recorded Chrome checks in `.hallmark/browser-checks.json`, source inspection, final desktop/mobile screenshot review, the supplied contrast checker, a successful production build, and `git diff --check`.

## Hard gates

- R-02 PASS: new UI copy and page title use commas, full stops and sentence case rather than em dashes.
- R-03 PASS: browser measured no horizontal page overflow at 320, 360, 375, 560, 768, 900, 1024, 1280, 1440 and 1920px; cards remain readable and the closing action fits one line at 320px.
- R-17 PASS: no invented users, ratings or accuracy numbers. Existing demonstration distances and walking times remain labelled sample routes.
- R-18 PASS: no testimonials, identities or customer logos were added.
- R-23 PASS: the requested map design is implemented as explicitly labelled schematic diagrams; no real campus map, logo, staff photo or changed navigation structure was invented.
- R-24 PASS: all navigation anchors resolve to the existing Features, Try it, How it works and For visitors sections.
- R-25 PASS: text/olive 6.28:1, muted/light 5.80:1, muted/dark 8.69:1, dark/active olive 7.76:1, map text/water 5.34:1 and text/brown 6.33:1 in contrast-check.py. Disabled map text was darkened after review.
- R-26 PASS: all five destination pins, four feature shortcuts, search, directions, zoom/reset, carousel, menu, theme and copy controls retain their tested behaviour.
- R-27 PASS: empty route guidance, no-results recovery, selected-route details and clipboard-denied fallback work. The demonstration reads synchronous local data and has no asynchronous data-fetch loading state.
- R-28 PASS: no generic FAQ exists.
- R-32 PASS: ArrowDown/Enter office selection, Escape/Tab search dismissal, menu Escape and focus restoration passed. Search has combobox/listbox semantics and visible focus; mobile DOM order follows map then sheet.
- R-33 PASS: UI changes were implemented directly in source patches, not source-rewriting helper scripts.
- R-34 PASS: theme toggle and mobile layout checks pass in both light and dark modes; map palette remains legible and is not inverted.
- R-35 PASS: production build passed; 51 browser checks recorded zero JavaScript exceptions. Individual exercised controls and results are in browser-checks.json.
- R-36 PASS: no fabricated safety, compliance, security, speed or accuracy claim was introduced.
- R-37 PASS: design-map.md supplies explicit direction; reference A provides the palette and reference B provides mobile structural patterns. The design read was declared before implementation.
- R-38 PASS: sample names, diagrams and routes remain visibly labelled; no live driver, vehicle, ETA, occupancy or location tracking was copied from the reference.

## Purpose gates

- R-01 PASS: cream and olive come from the outdoor reference; blue encodes the route and brown encodes destinations. A single quiet hero wash separates the readable panel from the map.
- R-04 PASS: retained line icons correspond to campus buildings, walking, food, search and directions, matching the map reference's outline controls.
- R-06 PASS: Figtree/system fallback follows the reference's humanist sans approximation without remote font requests; old uppercase labels and eyebrows were removed.
- R-07 PASS: contour lines are confined to the illustrative map, reflecting the outdoor map reference rather than a decorative page background grid.
- R-08 PASS: arrows indicate actual section/destination navigation and carousel movement; state controls retain specific icons.
- R-09 PASS: the Interactive sample label explains the demo's status; no invented status or decorative live dot.
- R-10 PASS: opaque surfaces rather than backdrop blur or glass.
- R-12 PASS: shadows separate floating panels and controls from the map; normal content and feature cards stay flat.
- R-13 PASS: no glow.
- R-14 PASS: the four brief-defined campus capabilities keep equal cards as requested; the working route demo receives the larger visual emphasis.
- R-19 PASS: motion is interaction feedback only; reduced-motion scrolling is verified and no loops were added.
- R-22 PASS: route diagrams use the page's sample buildings and a visible illustration limitation; existing feature diagrams remain related to navigation, offices, venues and food.

## Liveliness

- PASS: ENERGY 2 is expressed through the map-led hero and olive primary actions.
- PASS: RHYTHM 2 preserves the distinct hero, feature row, floating demo panel, steps and visitor section.
- PASS: MOTION 1 uses short hover/press feedback and no staged reveal or looping motion.
- PASS: hero headline and sample route are the first-screen focal points; the primary action fits 1280x800.
- PASS: section spacing follows the existing page hierarchy; desktop map controls have room around the floating panel.
- PASS: olive is the action colour, blue is route information and brown distinguishes destinations.
- PASS: floating rounded panels, address pills and the map-to-sheet transformation repeat the new map identity.
- PASS: explicit direction and dials were declared before generation.

## Craftsmanship and quality locks

- C-1 PASS: palette, panels, type and mobile structure have documented reference-driven purposes.
- C-2 PASS: all control families retain recorded browser behaviour; no new dead control was added.
- C-3 PASS: sections serve the brief's four campus tasks, demonstration, instructions and first-time visitor guidance.
- C-4 PASS: empty, selected, copy-error, theme and narrow-screen states were exercised; 16px search input and 48px control targets retained.
- C-5 PASS: sample limitations and the student-project disclaimer remain explicit.
- R-05 PASS: preserved the requested page layout, with map-specific presentation rather than adding pricing, dashboards, testimonials or logo walls.
- R-11 PASS: pills serve actions/address controls; panels and sheets use 20-28px radii; map icon controls use circles.
- R-15 PASS: Open the map, Find an office, Copy page link and Open sample map name their actual actions.
- R-16 PASS: no AI marketing buzzwords introduced.
- R-20 PASS: building destinations, walking routes and office floors keep the design specific to a campus companion.
- R-21 PASS: system theme followed by an in-memory manual toggle; no forced dark default.
- R-29 PASS: the UI follows the reference's cream/olive system; blue route and brown markers have distinct information roles in the map layer.
- R-30 PASS: the user supplied map references; no unrelated software-product identity was copied.
- R-31 PASS: major choices, content limits, tests and Hallmark's unfiltered compatibility findings are recorded in `.hallmark/report.md`.
