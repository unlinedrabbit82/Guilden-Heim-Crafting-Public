/* GuildenHeim — data/materials.js */
/* DEV: To add a material, add the same unique ID in BOTH `materials` and
 * `materialDefaults` below. `mass` multiplies component mass (1 = baseline);
 * `integrity` is a 1–5 structural score. Workability in materialDefaults
 * increases crafting difficulty. Keep all values modest and playtest them.
 * The selectors automatically list new materials; no HTML edit is needed.
 */
const materials = {
  steel:{name:'Steel',mass:1,integrity:4,description:'durable, reliable metal'},
  iron:{name:'Iron',mass:1.15,integrity:3,description:'heavy, workable metal'},
  mithral:{name:'Mithral',mass:.6,integrity:4,description:'lightweight fantasy metal'},
  adamantine:{name:'Adamantine',mass:1.4,integrity:5,description:'exceptionally hard fantasy metal'},
  oak:{name:'Oak',mass:.65,integrity:3,description:'sturdy hardwood'},
  ash:{name:'Ash',mass:.55,integrity:3,description:'flexible hardwood'},
  bone:{name:'Bone',mass:.7,integrity:2,description:'brittle organic material'}
};
// Editable homebrew material ratings. Stored locally on the DM's browser.
const materialDefaults={
  steel:{hardness:7,toughness:7,flexibility:5,magic:2,workability:1},
  iron:{hardness:5,toughness:5,flexibility:4,magic:2,workability:0},
  mithral:{hardness:8,toughness:7,flexibility:7,magic:8,workability:2},
  adamantine:{hardness:10,toughness:9,flexibility:3,magic:6,workability:3},
  oak:{hardness:3,toughness:5,flexibility:6,magic:3,workability:0},
  ash:{hardness:3,toughness:5,flexibility:8,magic:4,workability:0},
  bone:{hardness:4,toughness:3,flexibility:2,magic:5,workability:1}
};
