# GuildenHeim — GitHub Pages Edition

**Version 0.8.1.** Static, client-side D&D crafting workbench. It contains all 37 standard 2014 weapons (28 melee, 9 ranged) as blueprints, matching parchment-style result cards, base material estimates, DM-only crafting evaluations, local discoveries, and a 2014 weapon-property reference. Armor and magic remain placeholders.

## Folder layout

```text
guildenheim/
├── index.html              # Web page and inputs
├── css/
│   ├── styles.css          # Main layout and colors
│   ├── categories.css      # Top crafting tabs and property reference
│   ├── ranged.css          # Ranged crafting interface
│   ├── item-card.css       # Shared parchment card appearance
│   ├── skill.css           # Skill panel styling
│   ├── dm.css              # Player/DM visibility
│   └── player.css          # Player notes styling
├── data/
│   ├── materials.js        # Material definitions and ratings
│   ├── components.js       # Heads, handles, size factors
│   ├── recipes.js          # 28 melee weapon blueprints
│   ├── weapon-stats.js     # Official 2014 cost and weight table
│   ├── ranged.js           # 9 ranged blueprints and component templates
│   ├── properties.js       # All 11 2014 weapon properties, explained
│   ├── techniques.js       # Crafting technique rules
│   └── interactions.js     # Reusable, tag-based discoveries
└── js/
    ├── storage.js          # Local saves and XP state
    ├── engine.js           # Cost, compatibility, classification
    ├── item-card.js        # Reusable parchment result renderer
    ├── app.js              # Melee UI, shared navigation, exports
    └── ranged.js           # Ranged UI, evaluations, discoveries
```

The JavaScript files are **classic deferred scripts** loaded in the order shown in `index.html`. Do not reorder them without refactoring dependencies. This avoids a build tool or package manager and works on GitHub Pages.

## GitHub Pages setup

1. Extract this ZIP.
2. Upload the **contents** of the extracted `guildenheim-v081` directory to the root of your GitHub repository. Preserve the `css`, `data`, and `js` folder names.
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
| Standard 2014 prices and weights | `data/weapon-stats.js` |
| Ranged blueprint statistics and components | `data/ranged.js` |
| Ranged crafting mechanics and save logic | `js/ranged.js` |
| Shared item output fields and parchment rendering | `js/item-card.js` |
| Shared card visuals, ranged-specific details | `css/item-card.css` |
| 2014 weapon properties and explanations | `data/properties.js` |
| Melee/Ranged/Armor/Magic category descriptions | `js/app.js` → `craftingCategories` |
| Navbar and placeholder appearance | `css/categories.css` |
| Crafting technique bonuses and costs | `data/techniques.js` |
| Emergent interaction candidates | `data/interactions.js` |
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

## v0.7 — interaction discovery

- The crafting engine emits tags such as `slashing`, `curved`, `long-reach`, `mithral`, and `technique:balancing`.
- Interaction rules in `data/interactions.js` match when **every required tag** is present. Extra tags are allowed.
- The DM result screen displays matching candidate interactions and their proposed effects.
- The DM must explicitly approve an interaction. Approval is saved under a separate browser-local key and is reusable across any later build that meets the rule.
- Matching a rule never automatically grants a combat bonus or changes official weapon statistics.

## v0.7.5 — crafting categories and 2014 weapon properties

- A top navbar contains **Melee, Ranged, Armor, and Magic**. Melee opens the existing working crafting system; the other tabs contain clearly labeled example components and planned functionality, **not functional crafting generators yet**.
- The sidebar now contains an expandable **2014 weapon properties** reference, available to players and DMs, with all eleven property headings: Ammunition, Finesse, Heavy, Light, Loading, Range, Reach, Special, Thrown, Two-Handed, and Versatile.
- These explanations are informational. They do not modify crafting probability or enforce attack mechanics. Some existing weapon recipe property labels include numerical ranges or versatile damage as part of a string.
- To add a category, first implement its recipe/component definitions and generation logic, then replace the placeholder entry under `craftingCategories` in `js/app.js` with a real category view. Update `data/properties.js` if your table uses a different rules edition.
- This version's historical note applied to v0.7.5. Version 0.8 now contains 37 standard weapon entries.

## v0.8 — complete 2014 weapon list + ranged crafting

- Added nine missing melee weapons: Greatclub, Light Hammer, Sickle, Flail, Lance, Morningstar, Trident, War Pick, and Whip. Total: **28 melee recipes**.
- Added **9 ranged recipes**: Light Crossbow, Dart, Shortbow, Sling, Blowgun, Hand Crossbow, Heavy Crossbow, Longbow, and Net. All contain 2014 damage, type, range, properties, market price, and weight.
- **Ranged tab is functional**. It provides frame, material, propulsion, grip, workmanship, compatibility checks, and player-visible base material costs. Known blueprints match the 2014 equipment table; changed parts become homebrew designs requiring DM review.
- DM review uses craft skill levels 0–5 and difficulty, displays success %, hours, adjusted material units, recommended dice, and weapon statistics. Successful d100 attempts can be saved locally as provisional ranged discoveries.
- Player **Export player design** creates `guildenheim-ranged-player-design.json`; the DM can use the top **Import** button to load this proposal. DM **Export recipes** and **Import** now include ranged discovery backups.
- No player inventory, no automatic material spending, and no automatic magical enhancements. Armor and Magic tabs remain future categories.
- **The official market price (gp/sp/cp) is not the GuildenHeim crafting cost.** Crafting continues to use homebrew abstract material units and proficiency adjustments.
- The 2014 rules include special rules for lances and nets. The property and special rules are reference text for the DM; GuildenHeim does not implement attack rolls, character sheets, ammunition tracking, or full combat simulation.
- Source for official baselines: https://www.dndbeyond.com/sources/dnd/basic-rules-2014/equipment

## v0.8.1 — unified melee/ranged output and discovery flow

- **Both melee and ranged results now use the same parchment item card** via `renderEquipmentCard()` in `js/item-card.js`.
- Cards display identity and classification; damage and damage type; properties; official 2014 market price and weight for exact blueprints; a design description and DM ruling. The ranged card additionally displays ammunition and normal/long range. For custom designs, baseline stats are explicitly marked as reference-only until approved by the DM.
- Ranged DM evaluation also uses the same **physical profile** (abstract mass, length, integrity 1–5, handling 1–5), **workshop compatibility assessment**, **abstract crafting units**, **success %**, **hours**, and **d100/d20 advice** layout as melee.
- Ranged discoveries can be saved, reopened, and advanced through **Prototype → Established → Mastered** with DM confirmation. A mastered ranged recipe gains the same provisional reliability and time improvements used for melee. Its stage is included in ranged export/import backups.
- An existing ranged discovery only gains stage bonuses when the currently selected parts still match that saved design. Modified designs must be evaluated again.
- Lance and net have specialized 2014 rule summaries in their item-card rulings.
- **Still homebrew:** Procedural physical profile scores, crafting success rates, material costs, and discovery bonuses are not official 2014 combat statistics. No combat automation, inventory, ammunition tracking, or server-side authentication is included.

### Developer notes: shared card output

1. `renderEquipmentCard(root,item)` accepts `glyph`, `category`, `name`, `damage`, `damageType`, `properties`, `market`, `description`, and `ruling`.
2. The two current callers are `render()` in `js/app.js` (melee) and `rangedRender()` in `js/ranged.js` (ranged).
3. New item categories can reuse the parchment HTML markup's `data-item-*` fields and the helper. Add category-specific statistic blocks (e.g., AC or attunement) separately, but preserve the common identity and ruling fields.
4. Edit `css/item-card.css` for shared parchment additions; the original common parchment styles remain in `css/styles.css`.
5. **Never present procedurally recommended damage/properties as official** unless an exact 2014 baseline or DM ruling establishes them. Use the provisional labels for generated variants.

### Developer notes: ranged recipes

1. Add frames, mechanisms, or grips under `rangedParts` in `data/ranged.js`. Every frame lists permitted materials and propulsion mechanisms.
2. Add a `rangedRecipes` entry with a unique ID, `frame`, `mechanism`, `grip`, `material`, `damage`, `type`, `properties`, `ammunition`, and `range`.
3. Add the matching official catalog ID and `[market price, weight lb]` pair to `data/weapon-stats.js`. For **homebrew weapons**, create a different catalog and do not label their prices as official.
4. Tune `rangedAssessment()` and `rangedOutcome()` in `js/ranged.js` for homebrew units, compatibility, success chance, and time. These are intentionally independent of melee construction rules.
5. Keep export formats compatible when extending the save schema. `RANGED_SAVE_KEY` is stable for browser-local discovery backups.

## Developer guide — editing GuildenHeim manually

The site uses ordinary deferred JavaScript scripts, not npm or a build system. After editing, upload changed files with the **same folder paths** to GitHub Pages. Hard-refresh the live page to clear old cached scripts.

### Add a new material

1. In `data/materials.js`, add a new entry to the `materials` object with a unique key, `name`, `mass`, `integrity`, and `description`.
2. Add that **same key** to `materialDefaults`, with `hardness`, `toughness`, `flexibility`, `magic`, and `workability`.
3. Example: `silverwood:{name:'Silverwood',mass:0.7,integrity:3,description:'Enchanted timber'}`.
4. Its rating entry might be `silverwood:{hardness:4,toughness:6,flexibility:8,magic:7,workability:2}`.
5. Add any special interaction rules referencing `silverwood` to `data/interactions.js`.

### Add a component or standard weapon

1. In `data/components.js`, add a weapon head or handle entry with the required shape, mount, mass, length, and integrity attributes.
2. The new component appears in the selectors automatically.
3. In `data/recipes.js`, add a `standardRecipe(...)` with a unique `id`. Keep the damage dice comparable to your chosen D&D edition.
4. Test its default build to make sure it is `Valid` and generates the expected baseline damage and weapon properties.

### Create a procedural interaction

Add an object to `interactionRules` in `data/interactions.js`:

```javascript
{
  id: 'silverwood_lunge',
  name: 'Silverwood Lunge',
  requiredTags: ['silverwood', 'piercing', 'long-reach'],
  discoveryDifficulty: 3,
  effect: 'May allow a precise extended lunge.'
}
```

**Make sure every required tag is actually emitted in `classifyWeapon()` in `js/engine.js`.** For instance, the engine already emits the selected material ID, weapon shape, and `technique:<id>` tag. New concepts such as `hollow-core` need an additional tag emission rule. If no build can emit one of the required tags, the interaction will never match.

This design intentionally does not interpret `effect` as executable code. The DM approves the proposed ability, then determines its exact tabletop mechanics.

### Adjust balancing values

- `js/engine.js` → `requiredMaterials()`: base quantities and proficiency savings (currently 5% per skill level).
- `js/engine.js` → `skillOutcome()`: complexity, success chance, and crafting time formulas.
- `js/engine.js` → `assess()`: integrity, handling, and compatibility thresholds.
- `data/techniques.js`: extra costs, time, difficulty, handling, and integrity from crafting techniques.
- `js/app.js` → `attemptCraft()`: XP rewards and d100 roll resolution.
- `js/app.js` → `createDiscoveryControls()`: recipe approval stages.

### Back up before changing definitions

Use the DM **Export recipes** feature to back up discovered recipes. Existing saves are stored in browser `localStorage`; changing recipe IDs or storage keys can make old saves harder to reuse. Backups are also advisable before changing material and interaction definitions.

### Important security note

`test123` is in `js/storage.js` and can be found by viewing the site's public source. GitHub Pages alone cannot securely restrict DM-only secrets. Use a server-backed authentication system if you ever need genuine access control.
