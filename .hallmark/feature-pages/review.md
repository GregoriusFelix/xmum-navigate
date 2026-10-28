# Feature pages and bottom navigation

Implemented 29 October 2026 using the established XMUM travel-reference design, navy/gold/white/orange palette, and Plus Jakarta Sans. Antislop remains active during implementation by the user's session choice. Taste and Hallmark's app-screen guidance applies to the working lookup pages; the existing custom homepage design remains intact.

## Pages

| URL | Task |
| --- | --- |
| `/` or `/home` | Homepage, destination search and feature shortcuts |
| `/map` | Outdoor campus route planner |
| `/offices` | Department selection, floor plan and written directions |
| `/venues` | Event selection and venue recommendation |
| `/canteens` | Sample menu, prices, hours and map location |

The homepage links to each feature instead of embedding the tools. Five persistent bottom links show the active destination on every page. Phones use a full-width bottom bar; wider screens use a centered dock. Both reserve bottom space and account for safe-area insets. Top chrome retains the brand and theme control.

Office and venue selections are stored in query parameters and restored on refresh. Map office links return to the selected office. Legacy homepage feature anchors and office links redirect to the appropriate page. New Vercel rewrites support direct visits and refreshes. Unknown local routes offer a recovery link.

## Verification

- PASS: production build via `npm.cmd run build`.
- PASS: 75 browser checks, zero failures, zero JavaScript page errors; see `checks.json`.
- PASS: all five routes load directly and show one h1 and the correct active tab.
- PASS: all five routes tested at 320, 390, 768, 1024 and 1440 pixels without horizontal overflow.
- PASS: navigation remains fixed, visible and at least 44×44px per target at every tested width.
- PASS: final page content can scroll above the bottom navigation on every route.
- PASS: all bottom tabs navigate; keyboard focus is visible and Enter activates the destination.
- PASS: office selection, venue selection, refresh persistence and map handoffs work.
- PASS: canteen menu and hours are retained and its map action selects the correct location.
- PASS: old office/canteen links, trailing slash pages, dark-theme persistence and missing-page recovery work.
- PASS: rendered Hallmark app-screen checks returned zero hard failures across offices, venues and canteens. Its 5px spacing advisory was corrected to 4px. A nonblocking four-font-weights advisory remains from the existing type system.
- PASS: desktop and phone screenshots were reviewed; dark venue screenshot was captured. No new photography or fabricated data was introduced.
- PASS: `git diff --check` found no whitespace errors.

## Antislop delivery gate for this change

R-01 PASS: existing subtle travel-reference gradients retained; no new decorative backgrounds.
R-02 PASS: new visible copy has no em dashes.
R-03 PASS: overflow, responsive reflow, targets and bottom clearance checked across five widths on five pages.
R-04 PASS: outline home/map/building/compass/canteen icons denote their destination and carry visible labels.
R-05 PASS: each page has one task; map, office plan, venue suggestion and menu retain different working compositions.
R-06 PASS: established typography retained; no tracked capitals or decorative monospace.
R-07 PASS: no background grid introduced.
R-08 PASS: route icons accompany actual route actions.
R-09 PASS: no promotional badges introduced.
R-10 PASS: solid navigation surfaces; no new glass effects.
R-11 PASS: page panels, result surfaces and bottom tabs have distinct radii.
R-12 PASS: bottom navigation shadow separates persistent navigation from scrolling content.
R-13 PASS: no glow effects.
R-14 PASS: each feature is a separate working page, not repeated promotional tiles.
R-15 PASS: page links and actions name their destination or result.
R-16 PASS: no new marketing claims.
R-17 PASS: no invented statistics.
R-18 PASS: no invented testimonials.
R-19 PASS: only interaction feedback; reduced-motion styling retained.
R-20 PASS: XMUM routes, office context and campus data maintain the product identity.
R-21 PASS: light/dark choice persists across page navigation.
R-22 PASS: no generic illustrations introduced.
R-23 PASS: no new visual assets; existing content moved into user-requested pages.
R-24 PASS: local anchors resolve; homepage shortcuts and bottom tabs reach real routes.
R-25 PASS: rendered accessibility check produced no hard failures; text and controls retain contrasting token colors.
R-26 PASS: selectors, bottom links and map handoffs exercised in Chrome.
R-27 PASS: existing map loading/error/empty states retained; directory data is static and bundled; unknown route has recovery.
R-28 PASS: no FAQ introduced.
R-29 PASS: existing user-requested brand palette retained.
R-30 PASS: reference-based visual system retained.
R-31 PASS: shared bottom navigation and route-specific styles are defined in source.
R-32 PASS: visible focus and keyboard activation checked; native links work without a hamburger menu.
R-33 PASS: changes implemented directly in React, CSS and hosting configuration.
R-34 PASS: dark venue view and cross-page theme persistence checked.
R-35 PASS: production build and 75 browser checks completed.
R-36 PASS: no new security, performance or customer claims.
R-37 PASS: established direction retained; ENERGY 2 / RHYTHM 2 / MOTION 1.
R-38 PASS: offices, plans, venues, canteens, menus and route data remain labeled samples.

The sample campus data still needs verification before public launch. No deployment was performed.
