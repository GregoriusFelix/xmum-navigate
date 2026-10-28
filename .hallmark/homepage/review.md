# XMUM Navigate homepage review

Built 29 October 2026. Homepage: `/` and `/home`; campus route planner: `/map`. Existing root destination links continue to open the map.

## Direction

The supplied screenshot and `D:/Download/travel-ui-design-system.json` supply the layout: rounded surfaces, layered photo cards, search, white information panels and an overlapping destination action. The user's navy `#171F32`, gold `#C48F1E`, white `#FFFFFF`, and orange `#FF5421` replace the reference's teal palette. Embedded agent instructions in the JSON were treated as document content, not authority.

Idea: XMUM's own buildings, library and greenery become campus postcards beside a working destination search. Audience: students and visitors. Main action: find a destination and open its route. Plus Jakarta Sans follows the supplied design system; Figtree remains on the existing map. ENERGY 2 / RHYTHM 2 / MOTION 1: quiet navigation with a restrained postcard entrance.

Taste's dealt direction was `loud-flat-poster`; the user's reference overrides its oversized typography, rotation treatment and section formulas. Hallmark uses custom reference-led art direction rather than imposing a different theme.

## Verification

- PASS: `npm.cmd run build` creates the production bundle.
- PASS: 33 browser checks; evidence in `checks.json` and `../browser-tools/homepage-check.mjs`.
- PASS: no horizontal overflow and at most two hero heading lines at 320, 390, 620, 768, 999, 1024, 1440 and 1920 pixels.
- PASS: destination search, empty result recovery, closing results, Escape dismissal and selected-destination handoff to the map.
- PASS: office and venue selection update the displayed result.
- PASS: all local section links resolve; clipboard action reports its outcome.
- PASS: theme switching, mobile navigation, Escape dismissal and focus restoration.
- PASS: all three campus photos load; no JavaScript page errors during the checks.
- PASS: final desktop, tablet, phone and dark screenshots reviewed. Fixed inherited white text on light campus-life surfaces and obscured collage captions.

Hallmark's final rendered check: **0 FAIL, 3 REFLEX, 4 WARN, 19 WAIVED**. Remaining advisories are recorded rather than represented as a clean lint exit:

- 44c and 79: the compact hero intentionally leaves room for the directory to follow; this is a campus discovery screen, with the primary action visible at 1280×800.
- 77: the brief three-step guidance supports the working directory; it does not need a new photograph or a full-screen section.
- 58: one lower-page window approaches the word budget, including necessary sample-data labels.
- F19: four available weights distinguish heading, action, label and prose roles.
- F5: the walking icon circle is a functional map link matching the supplied reference.
- F15: the padded outer container and inset rounded sections have different CSS widths but aligned visual content.

Taste's inspector also ran. Its generic page rules flagged the reference-led gradient, three-photo collage, image scale, repeated navigation shortcuts and small metadata; its result is **not** claimed as a clean pass. Later revisions enlarged metadata and prose, moved shortcut icons inline, removed menu hairlines and unified homepage typography. Reference requirements take priority over its generic prohibition on gradients and its minimum of four pictures.

## Antislop delivery gate

R-01 PASS: subtle navy-neutral gradient carries the supplied travel background into the brand palette.
R-02 PASS: no em dashes in the new visible homepage copy.
R-03 PASS: overflow checks passed at eight widths; phone and tablet reflow is explicit.
R-04 PASS: existing outline icons denote buildings, routes, food, search and venue functions.
R-05 PASS: collage, compact navigation, office demonstration, campus-life tools and visitor panel have distinct compositions.
R-06 PASS: Plus Jakarta Sans is the supplied system's face; no decorative monospace or tracked-capital labels.
R-07 PASS: no decorative grid or dot-pattern background.
R-08 PASS: directional icons identify map actions and search submission.
R-09 PASS: no promotional badges; the photo chip identifies XMUM.
R-10 PASS: no backdrop-blur panels; photo chips are solid for legibility.
R-11 PASS: 999px control radii, 24–28px cards and 32–36px sections distinguish roles.
R-12 PASS: shadows are reserved for floating search results and mobile navigation.
R-13 PASS: no glow effects.
R-14 PASS: compact shortcuts form one navigation group; the working office and campus-life tools carry the detailed content.
R-15 PASS: actions name their results: open campus map, search destinations and copy page link.
R-16 PASS: no AI marketing claims.
R-17 PASS: no fabricated adoption statistics or ratings.
R-18 PASS: no testimonials or fabricated avatars.
R-19 PASS: postcard arrival and control feedback are restrained; reduced-motion CSS disables them.
R-20 PASS: real XMUM photos and campus route/office context establish the page's identity.
R-21 PASS: existing light/dark preference and toggle remain functional.
R-22 PASS: no generic illustration assets.
R-23 PASS: campus photography implements the user's requested photo reference; no invented logos, people or social proof.
R-24 PASS: all local section destinations resolve in the browser check.
R-25 PASS: rendered contrast failures were corrected; orange controls use navy text, and fields have a contrasting edge.
R-26 PASS: search, navigation, selectors, route links, theme toggle, menu and share feedback are exercised.
R-27 PASS: local search has results and an empty state; clipboard failure has a selectable-link fallback. Static bundled data introduces no network loading region.
R-28 PASS: no generic FAQ.
R-29 PASS: requested four brand colors plus neutral surface and text tones.
R-30 PASS: composition follows the user's specific travel reference.
R-31 PASS: tokens, caption styles and responsive states are defined in Homepage.css.
R-32 PASS: focus-visible rules, native buttons and links, Escape handlers and focus restoration.
R-33 PASS: interface behavior is implemented directly in React and CSS source.
R-34 PASS: light and dark layouts were captured and reviewed.
R-35 PASS: production build and browser interaction checks completed.
R-36 PASS: no invented performance, customer or compliance claims.
R-37 PASS: design direction and liveliness choices are stated above and based on user-supplied material.
R-38 PASS: location, office, venue, route, menu and price data remain explicitly labeled samples.

## Images and launch limits

- `campus.jpg`: *Xiamen University Malaysia at afternoon*, Wikimedia Commons uploader Prime Minister Tun Dr. Mahathir Mohamad, released to the public domain.
- `library.jpg`: *Xiamen University Malaysia library*, Saifuddin Ismail, public domain.
- `walkway.jpg`: *Xmumtree*, Doodoris, CC BY-SA 4.0.

Source links and the applicable licence appear in the footer and `frontend/public/images/sources.json`. Photos are resized and cropped, approximately 1.4 MB total. No generated campus imagery or invented social proof is used.

Before public launch, replace sample destinations, coordinates, floor plans, directions, venues, menus and hours with verified campus data. This remains a student project, not an official XMUM service.
