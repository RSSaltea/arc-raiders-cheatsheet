# ARC Raiders Cheat Sheet (Interactive) — GitHub Pages

## WIP Project
Keep in mind this might not have everything.

## Discord
Coming soon

## This repo is scaffolded for **GitHub Pages** and includes:
- Mobile-first UI (dark, ARC-ish vibe)
- Search + filter + sort
- JSON data source at `docs/data/items.json`

## Editing data

- Data lives in `docs/data/items.json`
- Each item is:
  ```json
    {
      "name": "Magnetic Accelerator",
      "sellValue": 5000,
      "recycleDelta": null,
      "sections": ["High-Tier Components"],
      "categories": null,
      "icon": "icons/Magnetic_Accelerator.png",
      "rarity": "Epic"
    },
  ```

## Notes

The initial `items.json` was generated from the PDF infographic via automated extraction, so a few entries may need cleanup.
