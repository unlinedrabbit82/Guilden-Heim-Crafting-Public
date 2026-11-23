/* GuildenHeim — js/engine.js */
function requiredMaterials(b,skillLevel){
  const raw={};
  const add=(id,quantity)=>{raw[id]=(raw[id]||0)+Math.max(1,Math.ceil(quantity))};
  add(b.headMaterial,heads[b.head].mass*(sizeMultiplier[b.headSize]||1));
  add(b.handleMaterial,handles[b.handle].mass*(sizeMultiplier[b.handleSize]||1));
  if(b.pommel!=='none')add('iron',b.pommel==='heavy'?2:1);
  const technique=craftingTechniques[b.technique]||craftingTechniques.none;
  for(const [key,units] of Object.entries(technique.materials))add(key==='headMaterial'?b.headMaterial:key,units);
  return Object.entries(raw).map(([id,base])=>({id,base,quantity:Math.max(1,Math.ceil(base*(1-.05*skillLevel)))}));
}
function skillOutcome(a,b,experimental,recipeStage='experimental'){
  const level=Number($('skillLevel').value);
  const ingredients=requiredMaterials(b,level);
  const dmDifficulty=Number($('difficultyLevel').value);
  const materialDifficulty=Math.max(rating(b.headMaterial,'workability'),rating(b.handleMaterial,'workability'));
  const technique=craftingTechniques[b.technique]||craftingTechniques.none;
  const mastered=recipeStage==='mastered';
  const complexity=Math.max(0,(experimental?2:0)+(a.status==='conditional'?2:0)+(b.quality==='masterwork'?2:b.quality==='fine'?1:0)+dmDifficulty+materialDifficulty+technique.complexity-(mastered?1:0));
  const cost=ingredients.reduce((total,item)=>total+item.quantity,0);
  const chance=a.status==='invalid'?0:Math.max(5,Math.min(95,70+level*6-complexity*10-(b.quality==='crude'?5:0)+(mastered?5:0)));
  const hours=Math.max(1,Math.ceil((8+complexity*4+a.mass*2+technique.hours)*(1-.08*level)*(mastered?.9:1)));
  return {cost,chance,hours,ingredients,complexity,materialDifficulty};
}
function assess(b){
  const h=heads[b.head],gr=handles[b.handle],hm=materials[b.headMaterial],gm=materials[b.handleMaterial];
  const technique=craftingTechniques[b.technique]||craftingTechniques.none;
  const headMass=h.mass*hm.mass*(sizeMultiplier[b.headSize]||1),handleMass=gr.mass*gm.mass*(sizeMultiplier[b.handleSize]||1),pommelMass=b.pommel==='none'?0:b.pommel==='heavy'?1.6:.7;
  const mass=headMass+handleMass+pommelMass;
  const length=h.length*(sizeMultiplier[b.headSize]||1)+gr.length*(sizeMultiplier[b.handleSize]||1)-.5;
  const adapted=b.mount!==h.mount&&b.technique==='specialized_mount';
  const conn=b.mount===h.mount?4:b.mount==='lashing'?2:1;
  const structural=Math.min(5,Math.min(h.integrity,hm.integrity,gr.integrity,gm.integrity,conn)+technique.integrity+(adapted?2:0));
  const leverage=headMass/(handleMass+pommelMass+.25);
  let handling=leverage>3?2:leverage>1.9?3:leverage>.75?4:3;
  if(b.handle==='pole'&&b.head==='hammer')handling-=1;
  if(b.pommel==='heavy')handling=Math.min(5,handling+1);
  handling+=technique.handling;
  handling=Math.max(1,Math.min(5,handling));
  let status='valid';const reasons=[];
  if(b.mount!==h.mount){status=adapted||b.mount==='lashing'?'conditional':'invalid';reasons.push(adapted?'Specialized mounting provides an adapter; the DM must approve the unusual connection.':b.mount==='lashing'?'Improvised lashings need a successful mounting check and reinforcement.':'The head attachment does not match the selected mount. Add a suitable adapter or change the mount.')}
  if(structural<=2){if(status==='valid')status='conditional';reasons.push('A weak material or connection may need reinforcement before use.')}
  if(leverage>6){if(status==='valid')status='conditional';reasons.push('The head is heavy relative to the grip; expect awkward handling or a reinforced haft.')}
  if(b.handle==='pole'&&['blade','dagger'].includes(b.head)){if(status==='valid')status='conditional';reasons.push('A blade mounted on a pole is a new polearm design; compare it with a glaive and secure the mounting.')}
  if(b.head!=='staff'&&(b.headMaterial==='oak'||b.headMaterial==='ash')){if(status==='valid')status='conditional';reasons.push('A wooden striking head needs DM review for durability and performance.')}
  if(b.handleMaterial==='bone'){if(status==='valid')status='conditional';reasons.push('A bone grip is brittle and may need reinforcement.')}
  if(!reasons.length)reasons.push('Connection and support are plausible under the simplified reference rules.');
  if(b.quality==='masterwork')reasons.push('Masterwork describes craftsmanship; it does not automatically grant an attack or damage bonus.');
  if(b.technique&&b.technique!=='none')reasons.push(`${technique.name}: ${technique.description}`);
  return {mass,length,structural,handling,status,reasons};
}
/* Developer note: these tags are the shared vocabulary for interactions.js.
 * When adding a shape/material/technique rule, emit its tag here first.
 * Don't grant combat bonuses in this function: only recommend DM-reviewed effects.
 */
function classifyWeapon(build,assessment){
  const tags=new Set([
    heads[build.head].type,build.head,build.shape,`${build.headSize}-head`,
    build.handle,`${build.handleSize}-grip`,build.headMaterial,build.handleMaterial
  ]);
  tags.add(`technique:${build.technique||'none'}`);
  // A narrow sword blade functions as piercing even though its broad head family is slashing.
  if(build.head==='blade'&&build.shape==='narrow')tags.add('piercing');
  if(['pole','haft','great'].includes(build.handle))tags.add('two-handed-grip');
  if(build.handle==='pole'&&build.handleSize==='long')tags.add('long-reach');
  if(build.headSize==='large')tags.add('oversized-head');
  if(assessment.mass>=7)tags.add('heavy-build');
  if(assessment.handling>=4)tags.add('controlled');
  if(rating(build.headMaterial,'magic')>=7)tags.add('arcane-affinity');
  if(rating(build.headMaterial,'flexibility')>=7)tags.add('flexible-head-material');
  const score=r=>
    (r.head===build.head?14:0)+(r.handle===build.handle?9:0)+
    (r.shape===build.shape?5:0)+(r.headSize===build.headSize?3:0)+
    (r.handleSize===build.handleSize?2:0);
  const ranked=[...recipes].sort((a,b)=>score(b)-score(a));
  const reference=ranked[0];
  let classification=reference.name;
  if(build.handle==='pole'&&build.head==='axe')classification='Poleaxe-like weapon';
  else if(build.handle==='pole'&&build.head==='blade')classification='Improvised poleblade';
  else if(build.handle==='pole'&&build.head==='poleblade')classification=build.shape==='hooked'?'Halberd-like polearm':'Glaive-like polearm';
  else if(build.head==='spear'&&build.handle==='short')classification='Short spear';
  else if(build.head==='hammer'&&build.handle==='short')classification='Short hammer';
  else if(build.head==='blade'&&build.handle==='great')classification='Greatsword-like weapon';
  const recommendations=[];
  if(tags.has('long-reach')&&['spear','poleblade','axe','hammer'].includes(build.head))recommendations.push('Reach');
  if(tags.has('two-handed-grip')&&build.handle!=='haft')recommendations.push('Two-Handed');
  if(tags.has('heavy-build')||tags.has('oversized-head'))recommendations.push('Heavy');
  if(tags.has('controlled')&&['blade','dagger'].includes(build.head)&&build.headSize!=='large')recommendations.push('Finesse');
  if(build.handle==='short'&&assessment.mass<4)recommendations.push('Light');
  if(build.handle==='grip'&&assessment.mass<7)recommendations.push('Versatile (DM review)');
  const type=build.head==='blade'&&build.shape==='narrow'?'Piercing':
    heads[build.head].type[0].toUpperCase()+heads[build.head].type.slice(1);
  return {classification,reference,type,tags:[...tags],recommendations:[...new Set(recommendations)]};
}
/* Add/remove interactions in data/interactions.js. Matching is set inclusion:
 * every required tag must appear, but additional component tags are allowed.
 * This makes discoveries reusable across different weapon materials and recipes.
 */
function matchingInteractions(classification){
  const available=new Set(classification.tags);
  return interactionRules.filter(rule=>rule.requiredTags.every(tag=>available.has(tag)));
}
