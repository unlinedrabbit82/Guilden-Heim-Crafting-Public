/* Run with: node tests/smoke.js
 * No packages or web browser required. Check data schemas and time/AC basics.
 * DEV: Add assertions when editing recipe formats or balancing formulas.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const base=path.resolve(__dirname,'..');
const values={armorShell:'',armorMaterial:'',armorLining:'',armorFastening:'',armorReinforcement:'',armorQuality:'standard',armorNotes:'',armorSkill:'0',armorDifficulty:'0',armorDex:'0'};
const ctx=vm.createContext({
  document:{getElementById(id){return {get value(){return values[id]},set value(v){values[id]=v}}}},
  localJSON:()=>[],rating:()=>0
});
const load=(file)=>vm.runInContext(fs.readFileSync(path.join(base,file),'utf8'),ctx,{filename:file});
for(const name of ['materials','components','recipes','weapon-stats','ranged','armor','properties'])load(`data/${name}.js`);
load('js/crafting-time.js');
// armor.js initializes DOM controls; skip that final call for pure function tests.
vm.runInContext(fs.readFileSync(path.join(base,'js/armor.js'),'utf8').replace(/initArmor\(\);\s*$/,''),ctx);
const evalInContext=source=>vm.runInContext(source,ctx);
assert.equal(evalInContext('recipes.length'),28);
assert.equal(evalInContext('rangedRecipes.length'),9);
assert.equal(evalInContext('armorRecipes.length'),13);
assert.equal(evalInContext('Object.keys(weaponStats2014).length'),37);
assert.equal(evalInContext('weaponProperties2014.length'),11);
const everyRecipeValid=evalInContext(`recipes.every(r=>heads[r.head]&&handles[r.handle]&&heads[r.head].shapes.includes(r.shape)&&r.mount===heads[r.head].mount)
  && rangedRecipes.every(r=>rangedParts.frames[r.frame].mechanisms.includes(r.mechanism)&&rangedParts.frames[r.frame].materials.includes(r.material))
  && armorRecipes.every(r=>armorShells[r.shell].materials.includes(r.material))`);
assert.equal(everyRecipeValid,true,'Every standard blueprint has compatible components');
for(const [size,label] of [['tiny','1 turn (6 seconds)'],['medium','2 hours'],['large','12 hours'],['massive','24 hours']]){
  assert.equal(evalInContext(`calculateCraftingTime({size:'${size}',complexity:0,skill:0}).label`),label);
}
for(const [recipe,dex,ac] of [['leather',3,'14'],['hide',5,'14'],['plate',-3,'18'],['shield',0,'+2 AC']]){
  assert.equal(evalInContext(`armorACValue(armorRecipes.find(r=>r.id==='${recipe}'),${dex})`),ac);
}
for(const item of evalInContext('armorRecipes.map(r=>({...r}))')){
  Object.assign(values,{armorShell:item.shell,armorMaterial:item.material,armorLining:item.lining,armorFastening:item.fastening,armorReinforcement:item.reinforcement});
  assert.equal(evalInContext(`armorSelected='${item.id}';armorExact(armorBuild())`),true,`${item.id} is exact`);
  assert.equal(evalInContext('armorAssessment(armorBuild()).status'),'valid',`${item.id} is valid`);
}
console.log('GuildenHeim v0.9 smoke checks passed: 37 weapons, 13 armor items, AC, compatibility, time tiers.');
// v0.9.1 regression: older cached materials.js didn't contain these entries.
// The armor catalog should repair only missing material definitions at load.
const legacy=vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(base,'data/materials.js'),'utf8'),legacy);
vm.runInContext("delete materials.leather;delete materials.cloth;delete materials.hide;delete materialDefaults.leather;delete materialDefaults.cloth;delete materialDefaults.hide",legacy);
vm.runInContext(fs.readFileSync(path.join(base,'data/armor.js'),'utf8'),legacy);
assert.equal(vm.runInContext('materials.leather.name',legacy),'Leather');
assert.equal(vm.runInContext('materials.cloth.name',legacy),'Cloth');
assert.equal(vm.runInContext('materials.hide.name',legacy),'Rawhide');
console.log('GuildenHeim v0.9.1 cache-compatibility regression passed.');
