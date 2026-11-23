/* GuildenHeim — data/recipes.js */
/* DEV: Add normal weapons with standardRecipe(...) below. Every recipe should
 * use an existing head/handle/shape/size; the generator validates its parts.
 * Standard damage and properties are reference statistics, not calculated
 * bonuses. Avoid altering IDs once players have saved discoveries.
 */
const recipes = [
  {id:'longsword',name:'Longsword',kind:'Martial melee weapon',head:'blade',handle:'grip',shape:'straight',headSize:'medium',handleSize:'medium',headMaterial:'steel',handleMaterial:'oak',pommel:'iron',mount:'tang',damage:'1d8',type:'Slashing',properties:['Versatile (1d10)'],description:'A balanced blade with a sturdy grip, made according to a dependable smithing blueprint.'},
  {id:'dagger',name:'Dagger',kind:'Simple melee weapon',head:'dagger',handle:'short',shape:'narrow',headSize:'small',handleSize:'short',headMaterial:'steel',handleMaterial:'oak',pommel:'none',mount:'tang',damage:'1d4',type:'Piercing',properties:['Finesse','Light','Thrown (20/60)'],description:'A compact, precise blade for close quarters.'},
  {id:'spear',name:'Spear',kind:'Simple melee weapon',head:'spear',handle:'pole',shape:'narrow',headSize:'small',handleSize:'long',headMaterial:'iron',handleMaterial:'ash',pommel:'none',mount:'socket',damage:'1d6',type:'Piercing',properties:['Thrown (20/60)','Versatile (1d8)'],description:'A narrow point firmly mounted to a long wooden shaft.'},
  {id:'warhammer',name:'Warhammer',kind:'Martial melee weapon',head:'hammer',handle:'haft',shape:'flat',headSize:'medium',handleSize:'medium',headMaterial:'steel',handleMaterial:'oak',pommel:'none',mount:'socket',damage:'1d8',type:'Bludgeoning',properties:['Versatile (1d10)'],description:'A weighty striking head supported by a reinforced haft.'}
];
function standardRecipe(id,name,head,handle,shape,headSize,handleSize,damage,type,properties,options={}){
  const metal=['staff'].includes(head)?'ash':'steel';
  return {id,name,kind:options.kind||'Martial melee weapon',head,handle,shape,headSize,handleSize,
    headMaterial:options.headMaterial||metal,handleMaterial:options.handleMaterial||'oak',
    pommel:options.pommel||'none',mount:heads[head].mount,damage,type,properties,
    description:`Standard ${name.toLowerCase()} blueprint; designed for repeatable mundane crafting.`};
}
recipes.push(
  standardRecipe('shortsword','Shortsword','blade','short','straight','small','short','1d6','Piercing',['Finesse','Light']),
  standardRecipe('greatsword','Greatsword','blade','great','broad','large','long','2d6','Slashing',['Heavy','Two-Handed']),
  standardRecipe('rapier','Rapier','blade','grip','narrow','medium','medium','1d8','Piercing',['Finesse']),
  standardRecipe('scimitar','Scimitar','blade','grip','curved','small','medium','1d6','Slashing',['Finesse','Light']),
  standardRecipe('handaxe','Handaxe','axe','short','broad','small','short','1d6','Slashing',['Light','Thrown (20/60)'],{kind:'Simple melee weapon'}),
  standardRecipe('battleaxe','Battleaxe','axe','grip','broad','medium','medium','1d8','Slashing',['Versatile (1d10)']),
  standardRecipe('greataxe','Greataxe','axe','haft','broad','large','long','1d12','Slashing',['Heavy','Two-Handed']),
  standardRecipe('mace','Mace','mace','grip','round','medium','medium','1d6','Bludgeoning',[],{kind:'Simple melee weapon'}),
  standardRecipe('maul','Maul','hammer','great','flat','large','long','2d6','Bludgeoning',['Heavy','Two-Handed']),
  standardRecipe('pike','Pike','spear','pole','narrow','medium','long','1d10','Piercing',['Heavy','Reach','Two-Handed']),
  standardRecipe('glaive','Glaive','poleblade','pole','curved','medium','long','1d10','Slashing',['Heavy','Reach','Two-Handed']),
  standardRecipe('halberd','Halberd','poleblade','pole','hooked','large','long','1d10','Slashing',['Heavy','Reach','Two-Handed']),
  standardRecipe('quarterstaff','Quarterstaff','staff','pole','round','small','medium','1d6','Bludgeoning',['Versatile (1d8)'],{kind:'Simple melee weapon',headMaterial:'oak'}),
  standardRecipe('club','Club','staff','short','round','medium','short','1d4','Bludgeoning',['Light'],{kind:'Simple melee weapon',headMaterial:'oak'}),
  standardRecipe('javelin','Javelin','spear','haft','narrow','small','long','1d6','Piercing',['Thrown (30/120)'],{kind:'Simple melee weapon'})
);
