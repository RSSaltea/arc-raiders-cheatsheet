# ARC Raiders Cheat Sheet (Interactive) — GitHub Pages

This repo is scaffolded for **GitHub Pages** and includes:
- Mobile-first UI (dark, ARC-ish vibe)
- Search + filter + sort
- JSON data source at `docs/data/items.json`

## Editing data

- Data lives in `docs/data/items.json`
- Each item is:
  ```json
  {
    "name": "Cooling Coil",
    "sellValue": 1000,
    "recycleDelta": "+6%",
    "section": "High-Priority Components",
    "category": "Chemicals"
  }
  ```

## Notes

The initial `items.json` was generated from your PDF infographic via automated extraction, so a few entries may need cleanup.
If you want, we can tighten the extraction rules and add fields like:
- stack size
- rarity
- “best choice” / “recycles into” / “crafts into”
