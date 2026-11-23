# GuildenHeim — D&D Procedural Crafting Workbench

A **static, GitHub Pages-ready** prototype of GuildenHeim's tabletop recipe-first crafting system. Players can choose known weapon blueprints, swap materials and parts, assess compatibility, attempt crafting experiments, and save successful discoveries in their browser.

## Run locally

Open `index.html` directly in a browser (or serve this directory with any static file server). No npm, framework build, database, or API key is needed.

## Publish on GitHub Pages

1. Create a GitHub repository and upload `index.html`, `styles.css`, `skill.css`, and `script.js` to its root.
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
- Choose a crafting skill level from 0–5. Skill reduces required material units and crafting time while increasing the success chance.
- Attempt crafting or experimentation, then record successful results as discovered recipes.
- Player view displays components without revealing calculations, success rates, or final item cards.
- Players can export a **design proposal** containing only the recipe name, selected components, materials, sizes, shapes, mounting, workmanship, and their design notes. This file intentionally excludes computed stats, skill levels, odds, time, costs, and DM decisions.
- The DM can import a player's design proposal using **Import**, which preloads the component selections for private review.
- DM review uses a basic access-code prompt (`test123`). The DM must choose skill and difficulty, then explicitly generate the result.

**Security warning:** Because this is a static GitHub Pages site, the access code exists in public JavaScript. It hides the DM interface from casual play but cannot protect campaign secrets against someone who inspects the source. True secure authentication requires a backend or external identity service.

## Provisional skill formulas

These are **initial homebrew balancing values** to be tuned during GuildenHeim playtesting, not canonical campaign rules:

- Base material units = ceiling of abstract total component mass.
- Complexity = 2 for a variant/experiment, +2 for a conditional build, +1 for fine or +2 for masterwork, adjusted by DM difficulty (Easy −1, Standard 0, Hard +1, Extreme +2). Minimum 0.
- Material cost = ceiling(base material units × (1 − 0.05 × skill level)); minimum 1 unit.
- Success chance = clamp(70 + 6 × skill level − 10 × complexity, 5%, 95%). Incompatible builds have 0%.
- Crafting time = ceiling((8 + 4 × complexity + 2 × total mass) × (1 − 0.08 × skill level)) hours; minimum 1 hour.
- A success roll is a uniform d100 roll. For failures, the DM decides whether any materials are lost.

Skill does **not** automatically enhance item combat statistics. This separates craftsmanship from weapon power.

## Limitations and next steps

- It is **not** a full rules simulator; DM approval is required for nonstandard builds.
- Discovered recipes are provisional; there is no DM approval screen, inventory accounting, accounts, or shared cloud sync yet.
- Crafting material costs are in abstract units rather than currency or itemized ingredients.
- Local browser storage is device- and browser-specific. Use Export regularly.
- The numeric physical attributes are illustrative homebrew reference values, not accurate physics or official D&D rules.
- Add recipe editing and approval, crafting materials/costs, and an equipment catalog before expanding to magic or armor.

This is an unofficial fan-made homebrew tool and is not affiliated with Wizards of the Coast.
