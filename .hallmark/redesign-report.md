# XMUM Navigate redesign verification

Completed 2026-10-24. Local React/Vite implementation; no deployment or backend changes.

The page uses the supplied `design.md` for colours, Figtree, surface hierarchy, radii and controls. The landing-page brief supplies the product scope and sample content. Its standalone HTML packaging and alternate visual instructions do not replace the existing framework or the chosen system.

## Results

- PASS: `npm.cmd run build` completed successfully.
- PASS: 103 browser checks, zero failures and zero JavaScript runtime errors. See [browser-checks.json](browser-checks.json).
- PASS: Hallmark static and render sweep, zero open Floor failures, zero unresolved Reflex findings, zero warnings. See [redesign-lint.json](redesign-lint.json).
- PASS: responsive inspection at 320, 360, 375, 414, 560, 640, 768, 800, 1024, 1280, 1440 and 1920 pixels.
- PASS: light and dark interface text checked numerically against WCAG AA. Mobile interactive targets measured at least 48px.
- PASS: desktop and phone screenshots reviewed in-thread. Map controls and markers no longer sit under the route summary; floor-plan labels were enlarged for phones.

## Interaction record

The browser record lists each tested interaction individually, including repetitions in both themes.

- PASS: system theme preference selects the initial theme; the manual toggle changes the root theme.
- PASS: Find an office focuses the office-filtered combobox.
- PASS: Arrow keys select a suggestion; Enter updates the route and office detail; Escape closes suggestions.
- PASS: clicking an autocomplete option selects its destination.
- PASS: empty search gives a recovery hint; clear and Reset remove the selected route.
- PASS: all three quick destinations select a sample route.
- PASS: all five map markers work with Enter in both themes.
- PASS: zoom in and out change the map and disable at their limits; reset map view restores the campus framing.
- PASS: all four offices update the building, floor, floor plan, written directions and route.
- PASS: the office route action and Open the map move focus to the map result.
- PASS: all three event types produce the appropriate sample recommendation; the venue and canteen location actions select their routes.
- PASS: all header, feature, footer and wordmark anchors reach existing targets.
- PASS: mobile navigation opens, closes, follows an anchor and closes with Escape while restoring focus.
- PASS: the mobile route sheet expands and collapses by button.
- PASS: copying the page link writes the actual URL; blocked clipboard access reveals and selects a visible link.
- PASS: the skip link works, Tab reaches the footer without a trap, and keyboard-focused controls have visible outlines.
- PASS: reduced motion disables transitions; the 200% zoom equivalent has no page overflow.
- PASS: blocked map scripts and failed map tiles produce a useful fallback; destination lookup remains usable.

## Design reasons

- Colour: supplied navy establishes structure; orange identifies the selected destination and sample route; gold marks the office on its floor plan.
- Typography: supplied Figtree is used for headings, labels and controls; large headings introduce a task while smaller labels describe sample information.
- Layout: search and map share the opening workbench; an independent office example makes building-to-floor guidance visible without hiding it inside a popup.
- Surfaces: map controls use the supplied floating-surface shadow; ordinary content stays flat, and office details use a tonal surface.
- Spacing: the 4px scale groups controls closely and gives office lookup and the directories more separation.
- Radius: pill controls, 12px fields and 16px surfaces distinguish actions from containers; the phone route sheet has larger top corners.
- Icons: existing Lucide icons identify walking, buildings, maps and food with one consistent stroke language; they support actual tasks.
- Directory composition: the compact four-link index provides equal access to the four product areas; the working map and office example receive the most space.
- Motion: ENERGY 2 / RHYTHM 3 / MOTION 1. Hover and press feedback only, with no decorative movement and a reduced-motion override.
- Identity: lettered campus markers, a connecting route and the matching floor plan repeat the wayfinding idea throughout the experience.

## Anti Slop delivery gate

Each line records the rule and the evidence used for its PASS.

- R-01 PASS: supplied brand palette; no gradients or glows in the page composition.
- R-02 PASS: source scan found no em dashes or marketing filler.
- R-03 PASS: twelve viewport widths, mobile target measurement and zoom-equivalent checks.
- R-04 PASS: walking, map, building and canteen icons identify the corresponding tasks.
- R-05 PASS: workbench, compact index, office demonstration, directory rows, guidance and visitor sharing use distinct compositions.
- R-06 PASS: Figtree comes directly from the supplied design system.
- R-07 PASS: no decorative background grids or patterns.
- R-08 PASS: chevrons indicate selectable destinations and navigation; button actions use relevant map or walking icons.
- R-09 PASS: sample labels identify demonstration data; no promotional status badges.
- R-10 PASS: no glassmorphism or backdrop blur.
- R-11 PASS: fields, surfaces, buttons and the phone sheet use the supplied radius hierarchy.
- R-12 PASS: shadow separates map controls and summaries from the map; ordinary sections do not float.
- R-13 PASS: no glow effects.
- R-14 PASS: map and office lookup dominate; supporting features are links and directory rows rather than equal promotional cards.
- R-15 PASS: actions say Open the map, Find an office, Show outdoor sample route and Copy page link.
- R-16 PASS: copy describes campus tasks without invented marketing benefits.
- R-17 PASS: distances, times, floors and prices are explicitly sample data; no usage figures.
- R-18 PASS: no testimonials or fictional people.
- R-19 PASS: quiet control feedback only; reduced motion disables transitions.
- R-20 PASS: campus wayfinding connects the opening map, office plan and directory destinations.
- R-21 PASS: OS preference and manual light/dark choices work.
- R-22 PASS: no generic illustrations; the floor plan is a labelled diagram of the requested sample office system.
- R-23 PASS: text wordmark only; supplied page scope and sample material; no invented identity assets.
- R-24 PASS: every internal navigation target exists and was followed in the browser.
- R-25 PASS: rendered interface text passes numerical contrast checks in both themes.
- R-26 PASS: browser checks exercise all control families, including individual destination and office selections.
- R-27 PASS: loading, empty search, cleared route, script failure and tile failure states exist and were checked.
- R-28 PASS: no generic FAQ.
- R-29 PASS: supplied navy, orange and gold, with neutral light/dark surfaces.
- R-30 PASS: composition follows campus lookup tasks and the owner's system.
- R-31 PASS: major design choices and their purposes are recorded above.
- R-32 PASS: Tab walkthrough, combobox keys, marker activation, menu Escape, skip link and visible focus were checked.
- R-33 PASS: features were authored in their source files; no source-rewriting helper scripts.
- R-34 PASS: both themes passed interaction and text-contrast checks.
- R-35 PASS: production build, rendered screenshots and 103 recorded browser checks.
- R-36 PASS: no invented security, performance, popularity or official-service claims.
- R-37 PASS: supplied design direction loaded; ENERGY 2 / RHYTHM 3 / MOTION 1 declared before implementation.
- R-38 PASS: sample destinations, office layouts, recommendations, menus and prices are visibly labelled.

Liveliness PASS: one main map/search focal point, varied section compositions, structural whitespace, restrained orange, repeated wayfinding motif and declared design read.

Craftsmanship PASS: interaction and error-state evidence is in the browser record; the page keeps to the stated product capabilities without fabricated proof.

Hallmark exceptions are recorded in the stylesheet: supplied white surfaces; a compact workbench rather than a stretched viewport; tighter spacing around connected controls; short supporting walking instructions. The sweep reports 13 waived occurrences across these declared rules, with no open findings.

## Material and remaining placeholders

No photo or image-replacement slots were introduced. The map and floor plan are working sample UI.

Before replacing the demonstration with actual campus information, verify the campus centre, bounds, buildings, surveyed paths, office floors, written directions, menu information and contact email. `frontend/src/campus.js` groups the sample destination data and documents the coordinate verification step. The current centre is the brief's placeholder `[2.833, 101.705]`; routes and walking figures are illustrative, not surveyed directions.

Screenshots: `shots/redesign-light-desktop.png`, `shots/redesign-dark-mobile.png`, and the five `shots/127.0.0.1-5173-*` render captures.
