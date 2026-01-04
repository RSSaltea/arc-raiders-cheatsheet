# ARC Raiders Cheat Sheet (Interactive) — GitHub Pages

This repo is scaffolded for **GitHub Pages** and includes:
- Mobile-first UI (dark, ARC-ish vibe)
- Search + filter + sort
- JSON data source at `docs/data/items.json`

## Quick start (deploy to GitHub Pages)

1. Create a new repo on GitHub (e.g. `arc-raiders-cheatsheet`).
2. Copy the contents of this folder into the repo.
3. In GitHub: **Settings → Pages**
   - **Source:** Deploy from a branch
   - **Branch:** `main` (or `master`)
   - **Folder:** `/docs`
4. Your site will be live at: `https://<your-user>.github.io/<repo-name>/`

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
