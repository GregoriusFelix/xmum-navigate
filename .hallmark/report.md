# XMUM Navigate: map design-system restyle

Date: 24 October 2026. Hallmark restyle with Anti Slop during mode, explicitly requested by the user.

## Source of truth

- Visual system: C:/Users/gfcat/Downloads/design-map.md.
- Product content: D:/Felix/University/@FYP/.MD File/XMUM-Navigate-Landing-Page-Prompt.md.
- Existing React/Vite implementation, section order, IDs, search, marker selection, sample routes, office floor plans, zoom/reset, carousel, theme and sharing were preserved. The brief was used for content and scope; this task does not replace the project with the brief's standalone HTML implementation.

## Design choices

- Adopt reference A's cream header, opaque white surfaces, olive primary actions, blue route and brown destination markers. The blue route is a separate map information role, not a second decorative action colour.
- Borrow only reference B's compact address controls, circular controls and stacked mobile-sheet structure. No driver, live-trip data, ETA updates, moving location marker, advertisements or car imagery were introduced.
- Keep the overall landing-page layout. Replace the travel-style campus illustration with a labelled sample map diagram in the same hero and visitor visual slots.
- On desktop, float the existing search/route panel over the map. Below 1024px, render the map before the sheet in the DOM, so keyboard order matches visual order and sample controls do not sit behind the floating panel.
- Use a Figtree/system fallback stack without downloading a font. Body copy remains readable; the supplied reference's sentence case replaces the previous uppercase labels and redundant eyebrows.
- Retain flat feature cards, three workflow steps, visitor guidance and link sharing because they come from the campus brief. The instructions are explicitly outdoor routes plus written office directions.
- ENERGY 2 / RHYTHM 2 / MOTION 1: a map-led focal point, distinct existing sections, quiet interaction feedback, and no looping or decorative entrance effects.

## Files

- frontend/src/Home.jsx: map diagram, reusable MapPanel, responsive DOM placement, copy cleanup. All sample data and actions preserved.
- frontend/src/Home.css: consolidated the previous layered stylesheet into the new tokens, surfaces, floating controls, responsive layouts and dark theme.
- frontend/index.html: cream browser theme colour and punctuation in the page title.
- .hallmark/browser-tools/check.mjs: verification for the map colours and the narrow-screen closing action.

## Verification

- 51 Chrome checks passed with zero JavaScript exceptions. See browser-checks.json for the individual recorded checks.
- Widths: 320, 360, 375, 560, 768, 900, 1024, 1280, 1440 and 1920px. No horizontal body overflow. Narrow carousel cards retain readable widths.
- Search: shortcut focuses the input; ArrowDown/Enter selects an office and shows its floor plan and directions; Escape and Tab close suggestions; an empty search explains recovery.
- Maps: all five sample markers select routes; zoom limits disable correctly; reset clears the route and zoom. Water colour is checked separately from the blue route.
- Mobile menu: opens, closes on anchor selection, and closes on Escape with focus restored. Carousel moves in both directions and disables its previous arrow at the start.
- Both light and dark themes tested, including mobile overflow. Clipboard denial exposes a copyable field, and success is announced. Reduced motion switches off smooth scrolling.
- Production build and git diff --check passed.
- Anti Slop contrast-check.py: white/olive 6.28:1; muted/page 5.80:1; muted/dark 8.69:1; dark/active olive 7.76:1; map ink/water 5.34:1; white/brown 6.33:1.
- Hallmark's browser render ran and wrote five final responsive screenshots in shots/. Chrome required execution outside the sandbox.
- In-thread visual review caught and fixed a broad CSS selector colouring the lake as a route. Hallmark caught a wrapping closing-action label at 320px; the label is now Open sample map and has an automated regression check.

## Copy changes

- Removed the old uppercase eyebrow labels; section headings carry the content directly.
- Browser note now says Use your browser without a download or account.
- Map caption now says Sample walking route, with an explicit illustrative-data limitation.
- Sharing action now says Copy page link; closing action says Open sample map.
- Empty route guidance now says Choose your sample destination. All sample and student-project disclaimers remain.

## Hallmark findings

The final raw verdict is included below rather than represented as a clean mechanical pass. One Floor finding is the static copy parser matching JSX callback/conditional syntax as repeated rebuttal prose; its quoted evidence begins with a question mark and whitespace, not a visible sentence. The page's visible copy was reviewed separately.

Remaining Reflex/Finish findings concern retained white floating surfaces, equal feature tracks and steps requested by the existing layout, interaction target sizes, reference-driven pills/circles, optical spacing, and existing feature artwork. These are not hidden as zero findings. The user's supplied visual system and instruction to preserve layout take precedence over conflicting house-style preferences. The campus diagrams are labelled illustrative data, not real campus imagery.

Raw Hallmark summary: {"fails": 1, "reflex": 20, "warns": 5, "waived": 0, "rejected": 0, "answered": 0, "dismissed": 0, "notes": 3, "files": 2, "render": "ran"}.

Anti Slop per-item delivery evidence: ../anti-slop/delivery-map-2026-10-24.md.

Final desktop and mobile captures: desktop-polished.png and mobile-polished.png; they show the light theme after interaction checks. Default-state captures are in shots/.
