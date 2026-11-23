/* D&D 5e (2014) baseline weapon catalog: all 37 standard weapons.
 * SOURCE: https://www.dndbeyond.com/sources/dnd/basic-rules-2014/equipment
 * DEV: cost is a string in official coin denominations; weight is pounds,
 * with null representing the source table's dash (e.g. sling).
 * Crafting costs are SEPARATE abstract material units, not these shop prices.
 */
const weaponStats2014={
  club:['1 sp',2],dagger:['2 gp',1],greatclub:['2 sp',10],handaxe:['5 gp',2],javelin:['5 sp',2],light_hammer:['2 gp',2],mace:['5 gp',4],quarterstaff:['2 sp',4],sickle:['1 gp',2],spear:['1 gp',3],
  light_crossbow:['25 gp',5],dart:['5 cp',.25],shortbow:['25 gp',2],sling:['1 sp',null],
  battleaxe:['10 gp',4],flail:['10 gp',2],glaive:['20 gp',6],greataxe:['30 gp',7],greatsword:['50 gp',6],halberd:['20 gp',6],lance:['10 gp',6],longsword:['15 gp',3],maul:['10 gp',10],morningstar:['15 gp',4],pike:['5 gp',18],rapier:['25 gp',2],scimitar:['25 gp',3],shortsword:['10 gp',2],trident:['5 gp',4],war_pick:['5 gp',2],warhammer:['15 gp',2],whip:['2 gp',3],
  blowgun:['10 gp',1],hand_crossbow:['75 gp',3],heavy_crossbow:['50 gp',18],longbow:['50 gp',2],net:['1 gp',3]
};
// Decorate existing melee recipes without changing their crafting schemas.
for(const recipe of recipes){
  const official=weaponStats2014[recipe.id];
  if(official){recipe.marketCost=official[0];recipe.weightLb=official[1];}
}
