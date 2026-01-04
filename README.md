# ARC Raiders Cheat Sheet (Interactive) — GitHub Pages

## WIP Project
This is far from complete so if you come across it, do not expect it to be the go-to.

This repo is scaffolded for **GitHub Pages** and includes:
- Mobile-first UI (dark, ARC-ish vibe)
- Search + filter + sort
- JSON data source at `docs/data/items.json`

## Editing data

- Data lives in `docs/data/items.json`
- Each item is:
  ```json
    {
      "name": "Crude Explosives",
      "sellValue": 270,
      "recycleDelta": "-44%",
      "sections": ["Workshop Upgrades"],
      "categories": [ "Refiner Components", "Explosive Components", "Gear Components" ]
    },
  ```

## Notes

The initial `items.json` was generated from the PDF infographic via automated extraction, so a few entries may need cleanup.
