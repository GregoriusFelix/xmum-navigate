# Dedicated campus map section

Updated 2026-10-25 to follow the supplied map reference.

- The map has its own section below the introduction, with a minimum desktop height of 740px and a capped container for large screens.
- A floating destination panel holds search, office filtering and selectable sample buildings. Map controls stay on the right, and the sample route summary floats along the bottom.
- Phone layouts stack destination search above the map and provide an expandable route-details sheet.
- Map framing accounts for the floating sidebar and summary. Sample labels and the existing navy/Figtree visual system remain in place.

Verification: production build PASS; 109 browser checks PASS, zero failures and zero JavaScript runtime errors. The checks cover twelve viewport widths, both themes, numerical text contrast, keyboard access, all five new destination rows, existing search/routes, map controls, clipboard behaviour and map-load failures. See `browser-checks.json` for individual results.

The final framing adjustment adds clearance above the bottom summary and removes redundant marker-name labels; destination names remain in the sidebar, accessible marker labels and route summary.
