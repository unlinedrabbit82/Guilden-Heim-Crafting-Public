# GuildenHeim — GitHub Pages Edition

Static, client-side D&D crafting workbench. It has 19 melee recipes, configurable components, base material estimates, DM-only review, discovery exports, and crafting XP.

## Folder layout

```text
guildenheim/
├── index.html              # Web page and inputs
├── css/
│   ├── styles.css          # Main layout and colors
│   ├── skill.css           # Skill panel styling
│   ├── dm.css              # Player/DM visibility
│   └── player.css          # Player notes styling
├── data/
│   ├── materials.js        # Material definitions and ratings
│   ├── components.js       # Heads, handles, size factors
│   ├── recipes.js          # 19 standard weapon blueprints
│   └── techniques.js       # Crafting technique rules
└── js/
    ├── storage.js          # Local saves and XP state
    ├── engine.js           # Cost, compatibility, classification
    └── app.js              # Interface, exports, DM review
```

The six JavaScript files are **classic deferred scripts** loaded in the order shown in `index.html`. Do not reorder them without refactoring dependencies. This avoids a build tool or package manager and works on GitHub Pages.

## GitHub Pages setup

1. Extract this ZIP.
2. Upload the **contents** of the extracted `guildenheim-organized` directory to the root of your GitHub repository. Preserve the `css`, `data`, and `js` folder names.
3. Under GitHub repository Settings → Pages, publish `main` from `/ (root)`.
4. Hard refresh after deployment to clear cached old files.

This is a **complete replacement**, not a ZIP containing only changed files. Older flat `script.js` and root-level CSS files are no longer referenced by `index.html` and can be removed from the published repository after verifying the new version.

## Security and limitations

- The site does not require npm packages or third-party JavaScript libraries. The Google Fonts CSS import is optional presentation styling.
- JavaScript must be enabled for interactive crafting and design export; users who disable all JS will see a notice.
- The DM passcode `test123` is a **client-side convenience lock**, not secure authentication. Anyone who views JavaScript source can read it; do not store sensitive campaign secrets in the website.
- Imported design JSON is checked against known component and material values, and imported text is displayed as text rather than executable HTML.
- Saved recipes, material edits, and crafting XP use browser-local storage. They are not shared between players or devices automatically; export as needed.
- Material units, difficulty formulas, and weapon-property suggestions are homebrew reference values. DM approval remains necessary.

## Where to make changes

| Want to edit | File |
|---|---|
| Material types | `data/materials.js` |
| Weapon heads and handles | `data/components.js` |
| Standard recipes | `data/recipes.js` |
| Crafting technique bonuses and costs | `data/techniques.js` |
| Compatibility and generated stats | `js/engine.js` |
| Buttons, forms, or export logic | `js/app.js` |
| Colors and layout | `css/styles.css` |

## v0.6 crafting techniques and discoveries

- Players can choose **Standard construction, Tempering, Reinforcement, Precision forging, Weight balancing, Lamination, or Specialized mounting**.
- Technique effects are reflected in the player-visible base material estimate and compatibility status; the DM sees proficiency-adjusted costs, difficulty, time, handling and integrity.
- Specialized mounting changes incompatible joints into **conditional** constructions requiring DM approval, rather than automatically validating every connection.
- Successful experimental crafting may be saved as a **Prototype**.
- A DM can advance saved discoveries from **Prototype → Established → Mastered** using the DM review screen. Previously saved discoveries without a stage are treated as Prototypes.
- Mastered recipes have a provisional reliability/efficiency improvement (+5 percentage points to crafting success, 10% faster, and 1 less complexity). These are homebrew defaults for playtesting.
- The DM must explicitly approve each stage advancement. No inventory is tracked.
