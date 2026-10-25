# Separate campus map page

Direction: supplied map reference, using the existing XMUM colors and type. ENERGY 1 / RHYTHM 1 / MOTION 1. The map is the focal point; floating panels separate destination controls and route information from the map.

- Hard gate PASS: production build passes; browser checks cover working links, destination selection, reloads, keyboard search, route reset, zoom, mobile navigation, collapsed details and map failure recovery. Sample data remains explicitly labelled. Contrast checks pass in both themes; widths 320–1440px have no horizontal overflow.
- Purpose gate PASS: existing navigation icons describe their actions. Panel shadows distinguish controls from map content. The full window canvas gives the route space; the sidebar groups destination search and selection. No new imagery or decorative effects.
- Liveliness PASS: the supplied planner composition guides the layout, with existing orange route emphasis and lettered destination markers. Spacing separates the destination panel, map controls and route summary.
- Craftsmanship PASS: homepage actions open `/map`; office links preserve the selected office in both directions; destination URLs survive reload. Vercel rewrites support direct requests to `/map` and `/map/`. Browser checks report no runtime errors.

Evidence: `.hallmark/map-page-checks.json`, `.hallmark/browser-tools/map-page-check.mjs`, and `.hallmark/shots/map-page-{desktop,mobile}.png`.

Verification limit: the browser test serves the installed Leaflet library for the CDN request because external loading was unavailable. Live map tile delivery was not verified; the existing text fallback was tested.
