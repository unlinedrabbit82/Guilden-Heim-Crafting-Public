/* D&D 5e (2014) armor and shield baseline (13 entries). The 2014 AC, price,
 * weight, strength minimum, and stealth penalty are fixed reference values.
 * GuildenHeim construction parts and material units are invented mechanics.
 * SOURCE: https://www.dndbeyond.com/sources/dnd/basic-rules-2014/equipment
 * DEV: To add a new design, add a valid shell and a recipe below.
 */
/* Backward-compatibility guard: an outdated cached materials.js from v0.8.1
 * might not define these three v0.9 materials yet. The intended definitions
 * remain in data/materials.js; these only fill missing entries, not overwrite
 * campaign edits or newer catalog definitions. */
const armorMaterialFallbacks={
  leather:{name:'Leather',mass:.45,integrity:3,description:'prepared flexible hide',ratings:{hardness:2,toughness:4,flexibility:8,magic:1,workability:0}},
  cloth:{name:'Cloth',mass:.25,integrity:2,description:'woven padding and lining',ratings:{hardness:1,toughness:2,flexibility:9,magic:1,workability:0}},
  hide:{name:'Rawhide',mass:.65,integrity:3,description:'thick protective animal hide',ratings:{hardness:3,toughness:5,flexibility:6,magic:1,workability:0}}
};
for(const [id,definition] of Object.entries(armorMaterialFallbacks)){
  if(!materials[id])materials[id]={name:definition.name,mass:definition.mass,integrity:definition.integrity,description:definition.description};
  if(!materialDefaults[id])materialDefaults[id]={...definition.ratings};
}
const armorShells={
  padded:{name:'Quilted padding',units:3,size:'medium',materials:['cloth','leather','hide']},
  leather:{name:'Leather panels',units:4,size:'medium',materials:['leather','hide']},
  studded:{name:'Reinforced leather',units:5,size:'medium',materials:['leather','hide']},
  hide:{name:'Thick hide panels',units:5,size:'medium',materials:['hide','leather']},
  chain_shirt:{name:'Chain shirt links',units:7,size:'large',materials:['iron','steel','mithral']},
  scale:{name:'Overlapping scales',units:10,size:'large',materials:['iron','steel','mithral','adamantine']},
  breastplate:{name:'Fitted chest plate',units:7,size:'large',materials:['iron','steel','mithral','adamantine']},
  half_plate:{name:'Partial plate set',units:11,size:'large',materials:['iron','steel','mithral','adamantine']},
  ring_mail:{name:'Sewn reinforcing rings',units:8,size:'large',materials:['iron','steel','mithral']},
  chain_mail:{name:'Full chain assembly',units:14,size:'massive',materials:['iron','steel','mithral']},
  splint:{name:'Metal splint framework',units:15,size:'massive',materials:['iron','steel','mithral','adamantine']},
  plate:{name:'Articulated plate armor',units:20,size:'massive',materials:['iron','steel','mithral','adamantine']},
  shield:{name:'Shield body',units:4,size:'medium',materials:['oak','ash','iron','steel','mithral','adamantine']}
};
const armorLinings={none:{name:'No additional lining',units:0},cloth:{name:'Cloth lining',units:1},leather:{name:'Leather backing',units:2}};
const armorFastenings={straps:{name:'Leather straps',units:1},buckles:{name:'Buckles and straps',units:2},rivets:{name:'Riveted joints',units:3}};
const armorReinforcements={none:{name:'No reinforcement',units:0},edges:{name:'Reinforced edges',units:2},joints:{name:'Articulated joints',units:3}};
/* DEV: Armor help strings are used by the shared tooltip component. */
const armorShellDescriptions={
  padded:'Quilted fabric layers protect through padding and flexibility.',
  leather:'Shaped leather panels provide lightweight coverage without rigid metal.',
  studded:'Reinforced leather uses additional fittings and a stronger protective surface.',
  hide:'Thick hide emphasizes rugged protection at moderate mobility cost.',
  chain_shirt:'Interlocked rings cover the torso while allowing movement.',
  scale:'Overlapping plates spread impacts but can add bulk and noise.',
  breastplate:'A formed chest plate protects vital areas without covering every limb.',
  half_plate:'A collection of fitted plates protects much of the upper body.',
  ring_mail:'Metal rings attached to a backing provide basic heavy protection.',
  chain_mail:'A full linked-metal construction that requires extensive assembly.',
  splint:'Rigid metal strips supported by padding and joints.',
  plate:'A fitted system of articulated metal plates requiring complex assembly.',
  shield:'A handheld protective body that adds to existing Armor Class.'
};
for(const [id,item] of Object.entries(armorShells))item.description=armorShellDescriptions[id];
Object.assign(armorLinings.none,{description:'No extra comfort layer; some heavy builds may need padding.'});
Object.assign(armorLinings.cloth,{description:'Soft backing cushions rigid components and reduces discomfort.'});
Object.assign(armorLinings.leather,{description:'Durable flexible backing supports metal parts and fastening points.'});
Object.assign(armorFastenings.straps,{description:'Adjustable ties and straps provide a simple assembly method.'});
Object.assign(armorFastenings.buckles,{description:'Buckles add more secure adjustment and require extra hardware.'});
Object.assign(armorFastenings.rivets,{description:'Riveted connections hold parts firmly but are harder to adjust.'});
Object.assign(armorReinforcements.none,{description:'No additional protective material is added.'});
Object.assign(armorReinforcements.edges,{description:'Reinforced boundaries improve durability and use more material.'});
Object.assign(armorReinforcements.joints,{description:'Moving reinforced joints support complex protective assemblies.'});
// AC: base + min(Dex modifier, dexCap); dexCap=null means unlimited.
// Heavy armor uses dexCap=0 and ignores even negative Dex modifiers.
// Shields use a flat +2 bonus to the wearer's existing AC.
const armorRecipes=[
  {id:'padded',name:'Padded',category:'Light',shell:'padded',material:'cloth',lining:'cloth',fastening:'straps',reinforcement:'none',baseAC:11,dexCap:null,strength:0,stealth:true,weightLb:8,marketCost:'5 gp'},
  {id:'leather',name:'Leather',category:'Light',shell:'leather',material:'leather',lining:'cloth',fastening:'straps',reinforcement:'none',baseAC:11,dexCap:null,strength:0,stealth:false,weightLb:10,marketCost:'10 gp'},
  {id:'studded_leather',name:'Studded Leather',category:'Light',shell:'studded',material:'leather',lining:'cloth',fastening:'rivets',reinforcement:'edges',baseAC:12,dexCap:null,strength:0,stealth:false,weightLb:13,marketCost:'45 gp'},
  {id:'hide',name:'Hide',category:'Medium',shell:'hide',material:'hide',lining:'leather',fastening:'straps',reinforcement:'none',baseAC:12,dexCap:2,strength:0,stealth:false,weightLb:12,marketCost:'10 gp'},
  {id:'chain_shirt',name:'Chain Shirt',category:'Medium',shell:'chain_shirt',material:'steel',lining:'cloth',fastening:'buckles',reinforcement:'none',baseAC:13,dexCap:2,strength:0,stealth:false,weightLb:20,marketCost:'50 gp'},
  {id:'scale_mail',name:'Scale Mail',category:'Medium',shell:'scale',material:'steel',lining:'leather',fastening:'rivets',reinforcement:'edges',baseAC:14,dexCap:2,strength:0,stealth:true,weightLb:45,marketCost:'50 gp'},
  {id:'breastplate',name:'Breastplate',category:'Medium',shell:'breastplate',material:'steel',lining:'leather',fastening:'buckles',reinforcement:'none',baseAC:14,dexCap:2,strength:0,stealth:false,weightLb:20,marketCost:'400 gp'},
  {id:'half_plate',name:'Half Plate',category:'Medium',shell:'half_plate',material:'steel',lining:'leather',fastening:'rivets',reinforcement:'joints',baseAC:15,dexCap:2,strength:0,stealth:true,weightLb:40,marketCost:'750 gp'},
  {id:'ring_mail',name:'Ring Mail',category:'Heavy',shell:'ring_mail',material:'iron',lining:'cloth',fastening:'rivets',reinforcement:'none',baseAC:14,dexCap:0,strength:0,stealth:true,weightLb:40,marketCost:'30 gp'},
  {id:'chain_mail',name:'Chain Mail',category:'Heavy',shell:'chain_mail',material:'steel',lining:'cloth',fastening:'buckles',reinforcement:'joints',baseAC:16,dexCap:0,strength:13,stealth:true,weightLb:55,marketCost:'75 gp'},
  {id:'splint',name:'Splint',category:'Heavy',shell:'splint',material:'steel',lining:'leather',fastening:'rivets',reinforcement:'joints',baseAC:17,dexCap:0,strength:15,stealth:true,weightLb:60,marketCost:'200 gp'},
  {id:'plate',name:'Plate',category:'Heavy',shell:'plate',material:'steel',lining:'leather',fastening:'rivets',reinforcement:'joints',baseAC:18,dexCap:0,strength:15,stealth:true,weightLb:65,marketCost:'1,500 gp'},
  {id:'shield',name:'Shield',category:'Shield',shell:'shield',material:'oak',lining:'leather',fastening:'straps',reinforcement:'edges',baseAC:2,dexCap:0,strength:0,stealth:false,weightLb:6,marketCost:'10 gp'}
];
