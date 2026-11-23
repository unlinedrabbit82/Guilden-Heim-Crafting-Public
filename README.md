# Forgebook — D&D Procedural Crafting Workbench

A **static, GitHub Pages-ready** prototype of a tabletop recipe-first crafting system. Players can choose known weapon blueprints, swap materials and parts, assess compatibility, experiment with unusual builds, and save discoveries in their browser.

## Run locally

Open `index.html` directly in a browser (or serve this directory with any static file server). No npm, framework build, database, or API key is needed.

## Publish on GitHub Pages

1. Create a GitHub repository and upload `index.html`, `styles.css`, and `script.js` to its root.
2. In repository **Settings → Pages → Build and deployment**, choose **Deploy from a branch**.
3. Choose branch `main` and folder `/ (root)`; save.
4. Wait for GitHub Pages to provide your published URL. Both repository project URLs and custom domains work because all asset paths are relative.

You may also commit the entire folder's contents as the repository root; the `README.md` is optional for deployment.

## Current scope

- Four starting recipes: Longsword, Dagger, Spear, Warhammer.
- Heads, handles, materials, shapes, size, mount, pommel, workmanship.
- Simplified mass, length, integrity, and handling reference scores.
- Valid / conditional / incompatible construction feedback.
- Experimental builds use the nearest existing item as a **provisional** stat reference.
- Save custom discoveries in browser `localStorage`, with JSON export/import for backups.

## Limitations and next steps

- It is **not** a full rules simulator; DM approval is required for nonstandard builds.
- Discovered recipes are provisional; there is no DM approval screen, crafting inventory/cost system, accounts, or shared cloud sync yet.
- Local browser storage is device- and browser-specific. Use Export regularly.
- The numeric physical attributes are illustrative homebrew reference values, not accurate physics or official D&D rules.
- Add recipe editing and approval, crafting materials/costs, and an equipment catalog before expanding to magic or armor.

This is an unofficial fan-made homebrew tool and is not affiliated with Wizards of the Coast.
