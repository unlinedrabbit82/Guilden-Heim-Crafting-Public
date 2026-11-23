/* Forgebook v0.1 — original homebrew reference rules, not an official D&D rules engine. */
const STORAGE_KEY = 'forgebook_discoveries_v1';
const materials = {
  steel:{name:'Steel',mass:1,integrity:4,description:'durable, reliable metal'},
  iron:{name:'Iron',mass:1.15,integrity:3,description:'heavy, workable metal'},
  mithral:{name:'Mithral',mass:.6,integrity:4,description:'lightweight fantasy metal'},
  adamantine:{name:'Adamantine',mass:1.4,integrity:5,description:'exceptionally hard fantasy metal'},
  oak:{name:'Oak',mass:.65,integrity:3,description:'sturdy hardwood'},
  ash:{name:'Ash',mass:.55,integrity:3,description:'flexible hardwood'},
  bone:{name:'Bone',mass:.7,integrity:2,description:'brittle organic material'}
};
const heads = {
  blade:{name:'Sword blade',type:'slashing',mass:3,length:3,integrity:4,mount:'tang',glyph:'⚔',shapes:['straight','curved','broad','narrow']},
  dagger:{name:'Short blade',type:'piercing',mass:1,length:1,integrity:3,mount:'tang',glyph:'🗡',shapes:['straight','curved','narrow']},
  spear:{name:'Spearpoint',type:'piercing',mass:1.5,length:1,integrity:4,mount:'socket',glyph:'♢',shapes:['narrow','leaf','barbed']},
  hammer:{name:'Hammerhead',type:'bludgeoning',mass:4,length:1,integrity:5,mount:'socket',glyph:'⚒',shapes:['flat','flanged','spiked']},
  axe:{name:'Axehead',type:'slashing',mass:3.5,length:1.5,integrity:4,mount:'socket',glyph:'🪓',shapes:['broad','crescent','hooked']}
};
const handles = {
  grip:{name:'One-handed grip',mass:1,length:2,integrity:3,hands:1},
  short:{name:'Short grip',mass:.6,length:1,integrity:3,hands:1},
  pole:{name:'Long shaft',mass:2.2,length:5,integrity:3,hands:2},
  haft:{name:'Reinforced haft',mass:1.8,length:3,integrity:4,hands:2}
};
const recipes = [
  {id:'longsword',name:'Longsword',kind:'Martial melee weapon',head:'blade',handle:'grip',shape:'straight',headSize:'medium',handleSize:'medium',headMaterial:'steel',handleMaterial:'oak',pommel:'iron',mount:'tang',damage:'1d8',type:'Slashing',properties:['Versatile (1d10)'],description:'A balanced blade with a sturdy grip, made according to a dependable smithing blueprint.'},
  {id:'dagger',name:'Dagger',kind:'Simple melee weapon',head:'dagger',handle:'short',shape:'narrow',headSize:'small',handleSize:'short',headMaterial:'steel',handleMaterial:'oak',pommel:'none',mount:'tang',damage:'1d4',type:'Piercing',properties:['Finesse','Light','Thrown (20/60)'],description:'A compact, precise blade for close quarters.'},
  {id:'spear',name:'Spear',kind:'Simple melee weapon',head:'spear',handle:'pole',shape:'narrow',headSize:'small',handleSize:'long',headMaterial:'iron',handleMaterial:'ash',pommel:'none',mount:'socket',damage:'1d6',type:'Piercing',properties:['Thrown (20/60)','Versatile (1d8)'],description:'A narrow point firmly mounted to a long wooden shaft.'},
  {id:'warhammer',name:'Warhammer',kind:'Martial melee weapon',head:'hammer',handle:'haft',shape:'flat',headSize:'medium',handleSize:'medium',headMaterial:'steel',handleMaterial:'oak',pommel:'none',mount:'socket',damage:'1d8',type:'Bludgeoning',properties:['Versatile (1d10)'],description:'A weighty striking head supported by a reinforced haft.'}
];
const $ = id => document.getElementById(id);
const fields = ['headSelect','headMaterial','headSize','headShape','handleSelect','handleMaterial','handleSize','mountSelect','pommelSelect','qualitySelect'];
const sizeMultiplier={short:.65,small:.75,medium:1,long:1.4,large:1.55};
const format = n => Number(n.toFixed(1)).toString();
let mode='recipe', selected='longsword', discovered=[];

function safeRead(){try{const data=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');return Array.isArray(data)?data.filter(x=>x&&typeof x.id==='string'&&x.build&&typeof x.build==='object').slice(0,200):[]}catch{return []}}
function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(discovered));return true}catch{return false}}
function options(id,values){const el=$(id);el.replaceChildren(...values.map(([value,label])=>{const option=document.createElement('option');option.value=value;option.textContent=label;return option}))}
function materialChoices(id){options(id,Object.entries(materials).map(([k,v])=>[k,v.name]))}
function chooseRecipe(id){const entry=recipes.find(r=>r.id===id)||discovered.find(r=>r.id===id);if(!entry)return;selected=id;mode='recipe';setMode();loadBuild(entry.build||entry);render()}
function setMode(){$('recipeMode').classList.toggle('selected',mode==='recipe');$('experimentMode').classList.toggle('selected',mode==='experiment');$('modeBadge').textContent=mode==='recipe'?'KNOWN RECIPE':'EXPERIMENTAL BUILD';$('craftSubtitle').textContent=mode==='recipe'?'Customize a familiar recipe with your own materials and parts.':'Try an unconventional combination; the system suggests a ruling for your DM.'}
function loadBuild(r){$('headSelect').value=r.head;$('handleSelect').value=r.handle;$('headMaterial').value=r.headMaterial;$('handleMaterial').value=r.handleMaterial;$('headSize').value=r.headSize||'medium';$('handleSize').value=r.handleSize||'medium';$('mountSelect').value=r.mount||heads[r.head].mount;$('pommelSelect').value=r.pommel||'none';$('qualitySelect').value=r.quality||'standard';updateShapes(r.shape);$('notesInput').value=r.notes||''}
function updateShapes(preferred){const list=heads[$('headSelect').value].shapes;const current=preferred||$('headShape').value;options('headShape',list.map(s=>[s,s[0].toUpperCase()+s.slice(1)]));$('headShape').value=list.includes(current)?current:list[0]}
function getBuild(){return {head:$('headSelect').value,handle:$('handleSelect').value,headMaterial:$('headMaterial').value,handleMaterial:$('handleMaterial').value,headSize:$('headSize').value,handleSize:$('handleSize').value,shape:$('headShape').value,mount:$('mountSelect').value,pommel:$('pommelSelect').value,quality:$('qualitySelect').value,notes:$('notesInput').value.trim()}}
function isDefault(b,r){return ['head','handle','headMaterial','handleMaterial','headSize','handleSize','shape','mount','pommel'].every(k=>(b[k]||'none')===(r[k]||'none'))}
function assess(b){
  const h=heads[b.head],gr=handles[b.handle],hm=materials[b.headMaterial],gm=materials[b.handleMaterial];
  const headMass=h.mass*hm.mass*(sizeMultiplier[b.headSize]||1),handleMass=gr.mass*gm.mass*(sizeMultiplier[b.handleSize]||1),pommelMass=b.pommel==='none'?0:b.pommel==='heavy'?1.6:.7;
  const mass=headMass+handleMass+pommelMass;
  const length=h.length*(sizeMultiplier[b.headSize]||1)+gr.length*(sizeMultiplier[b.handleSize]||1)-.5;
  const conn=b.mount===h.mount?4:b.mount==='lashing'?2:1;
  const structural=Math.min(h.integrity,hm.integrity,gr.integrity,gm.integrity,conn);
  const leverage=headMass/(handleMass+pommelMass+.25);
  let handling=leverage>3?2:leverage>1.9?3:leverage>.75?4:3;
  if(b.handle==='pole'&&b.head==='hammer')handling-=1;
  if(b.pommel==='heavy')handling=Math.min(5,handling+1);
  handling=Math.max(1,Math.min(5,handling));
  let status='valid';const reasons=[];
  if(b.mount!==h.mount){status=b.mount==='lashing'?'conditional':'invalid';reasons.push(b.mount==='lashing'?'Improvised lashings need a successful mounting check and reinforcement.':'The head attachment does not match the selected mount. Add a suitable adapter or change the mount.')}
  if(structural<=2){if(status==='valid')status='conditional';reasons.push('A weak material or connection may need reinforcement before use.')}
  if(leverage>3.1){if(status==='valid')status='conditional';reasons.push('The head is heavy relative to the grip; expect awkward handling or a reinforced haft.')}
  if(b.handle==='pole'&&['blade','dagger'].includes(b.head)){if(status==='valid')status='conditional';reasons.push('A blade mounted on a pole is a new polearm design; compare it with a glaive and secure the mounting.')}
  if(b.headMaterial==='oak'||b.headMaterial==='ash'){if(status==='valid')status='conditional';reasons.push('A wooden striking head needs DM review for durability and performance.')}
  if(b.handleMaterial==='bone'){if(status==='valid')status='conditional';reasons.push('A bone grip is brittle and may need reinforcement.')}
  if(!reasons.length)reasons.push('Connection and support are plausible under the simplified reference rules.');
  if(b.quality==='masterwork')reasons.push('Masterwork describes craftsmanship; it does not automatically grant an attack or damage bonus.');
  return {mass,length,structural,handling,status,reasons};
}
function renderRecipeList(){const list=$('recipeList');list.replaceChildren();[...recipes,...discovered].forEach(r=>{const btn=document.createElement('button');btn.className='recipe-button'+(mode==='recipe'&&selected===r.id?' active':'');const ico=document.createElement('span');ico.className='recipe-icon';ico.textContent=heads[(r.build||r).head]?.glyph||'⚔';const info=document.createElement('span');const title=document.createElement('strong');title.textContent=r.name;const subtitle=document.createElement('small');subtitle.textContent=r.build?'Discovered recipe':'Standard blueprint';info.append(title,subtitle);btn.append(ico,info);btn.addEventListener('click',()=>chooseRecipe(r.id));list.append(btn)});$('recipeCount').textContent=recipes.length+discovered.length}
function render(){
  const b=getBuild(),a=assess(b),base=recipes.find(r=>r.id===selected)||discovered.find(r=>r.id===selected),exact=mode==='recipe'&&base&&isDefault(b,base.build||base);
  const closest=recipes.find(r=>r.head===b.head&&r.handle===b.handle)||recipes.find(r=>r.head===b.head)||recipes[0];
  const reference=exact?base:closest, provisional=!exact;
  const name=exact?base.name:`${materials[b.headMaterial].name} ${heads[b.head].name}${b.handle==='pole'&&b.head==='blade'?' Polearm':''}`;
  $('breadcrumbName').textContent=mode==='recipe'?(base?.name||'RECIPE').toUpperCase():'EXPERIMENT';
  $('craftTitle').textContent=mode==='recipe'?'The crafting table':'The experimental forge';
  $('headLabel').textContent=heads[b.head].type==='bludgeoning'?'Striking head':'Blade / head';
  $('massStat').textContent=`${format(a.mass)} units`;$('lengthStat').textContent=`${format(a.length)} units`;$('integrityStat').textContent=`${a.structural} / 5`;$('handlingStat').textContent=`${a.handling} / 5`;
  const statusText={valid:'✓ Construction looks viable',conditional:'! Requires DM review',invalid:'× Incompatible as assembled'};
  $('compatibility').className=a.status;$('compatibility').textContent=statusText[a.status];const reasons=$('reasonList');reasons.replaceChildren(...a.reasons.map(s=>{const li=document.createElement('li');li.textContent=s;return li}));
  $('weaponGlyph').textContent=heads[b.head].glyph;$('categoryLabel').textContent=provisional?'PROVISIONAL HOMEBREW ITEM':reference.kind.toUpperCase();$('itemName').textContent=name;$('damageStat').textContent=reference.damage;$('damageTypeStat').textContent=reference.type;
  const pills=$('propertyPills');pills.replaceChildren(...reference.properties.map(s=>{const span=document.createElement('span');span.textContent=s;return span}));
  $('itemDescription').textContent=exact?reference.description:`A ${b.shape} ${heads[b.head].name.toLowerCase()} with a ${handles[b.handle].name.toLowerCase()}, constructed from ${materials[b.headMaterial].name.toLowerCase()} and ${materials[b.handleMaterial].name.toLowerCase()}.`;
  $('rulingText').textContent=a.status==='invalid'?'Fix the incompatible mount before treating the item as usable. '+`Closest reference: ${closest.name}.`:provisional?`Suggested starting point: ${closest.name} (${closest.damage} ${closest.type.toLowerCase()}). These are comparison statistics, not a granted bonus; the DM must approve the final properties.`:'Matches the saved blueprint. Standard recipe statistics apply; abstract physical scores are only a crafting reference.';
  $('saveButton').disabled=a.status==='invalid';$('saveButton').textContent=exact&&base?.build?'Update discovered recipe':'Save as discovered recipe';renderRecipeList();
}
function makeExperiment(){mode='experiment';selected='';setMode();$('saveMessage').textContent='';render()}
function save(){const b=getBuild(),a=assess(b);if(a.status==='invalid')return;const suggested=`${materials[b.headMaterial].name} ${heads[b.head].name}`;const raw=window.prompt('Name this discovered recipe:',suggested);if(raw===null)return;const name=raw.trim().slice(0,70);if(!name){$('saveMessage').textContent='A recipe needs a name.';return}const prev=discovered.find(r=>r.id===selected);const closest=recipes.find(r=>r.head===b.head&&r.handle===b.handle)||recipes.find(r=>r.head===b.head)||recipes[0];const item={id:prev?.id||`custom_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,name,kind:'Discovered homebrew weapon',damage:prev?.damage||closest.damage,type:prev?.type||closest.type,properties:prev?.properties||closest.properties,description:`Player-developed recipe based on the ${closest.name}. Review with the DM.`,build:b,approved:false,createdAt:prev?.createdAt||new Date().toISOString()};if(prev)discovered=discovered.map(r=>r.id===prev.id?item:r);else discovered.push(item);if(!persist()){$('saveMessage').textContent='Browser storage unavailable. Export your recipes to keep this design.';return}selected=item.id;mode='recipe';setMode();$('saveMessage').textContent='Saved locally as a provisional discovery. Export to back it up.';render()}
function exportData(){const blob=new Blob([JSON.stringify({app:'forgebook',version:1,discoveries:discovered},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='forgebook-recipes.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
async function importData(file){if(!file)return;try{if(file.size>1024*1024)throw Error('File exceeds 1 MB');const data=JSON.parse(await file.text());if(data.app!=='forgebook'||!Array.isArray(data.discoveries))throw Error('Not a Forgebook export');const clean=data.discoveries.slice(0,200).filter(r=>r&&typeof r.name==='string'&&r.name.length<=70&&r.build&&heads[r.build.head]&&handles[r.build.handle]&&materials[r.build.headMaterial]&&materials[r.build.handleMaterial]&&heads[r.build.head].shapes.includes(r.build.shape)&&['tang','socket','lashing'].includes(r.build.mount)&&['short','small','medium','long','large'].includes(r.build.headSize)&&['short','small','medium','long','large'].includes(r.build.handleSize)).map((r,i)=>({id:`import_${Date.now()}_${i}`,name:r.name,kind:'Discovered homebrew weapon',damage:typeof r.damage==='string'?r.damage.slice(0,30):'DM ruling',type:typeof r.type==='string'?r.type.slice(0,30):'DM ruling',properties:Array.isArray(r.properties)?r.properties.filter(v=>typeof v==='string').slice(0,8):[],description:'Imported homebrew recipe; review before using.',build:r.build,approved:false,createdAt:new Date().toISOString()}));discovered=[...discovered,...clean].slice(0,200);if(!persist())throw Error('Local storage unavailable');render();$('saveMessage').textContent=`Imported ${clean.length} recipes.`}catch(e){alert(`Could not import: ${e.message}`)}finally{$('importFile').value=''}}
function init(){options('headSelect',Object.entries(heads).map(([k,v])=>[k,v.name]));options('handleSelect',Object.entries(handles).map(([k,v])=>[k,v.name]));materialChoices('headMaterial');materialChoices('handleMaterial');options('headSize',[['small','Small'],['medium','Medium'],['large','Large']]);options('handleSize',[['short','Short'],['medium','Medium'],['long','Long']]);options('mountSelect',[['tang','Tang and receptacle'],['socket','Socket fitting'],['lashing','Improvised lashing']]);options('pommelSelect',[['none','None'],['iron','Small iron pommel'],['heavy','Heavy counterweight']]);options('qualitySelect',[['crude','Crude'],['standard','Standard'],['fine','Fine'],['masterwork','Masterwork']]);discovered=safeRead();fields.forEach(id=>$(id).addEventListener('change',()=>{if(id==='headSelect'){updateShapes();$('mountSelect').value=heads[$('headSelect').value].mount} $('saveMessage').textContent='';render()}));$('recipeMode').addEventListener('click',()=>chooseRecipe(selected&&([...recipes,...discovered].some(r=>r.id===selected))?selected:'longsword'));$('experimentMode').addEventListener('click',makeExperiment);$('newExperiment').addEventListener('click',makeExperiment);$('saveButton').addEventListener('click',save);$('exportButton').addEventListener('click',exportData);$('importButton').addEventListener('click',()=>$('importFile').click());$('importFile').addEventListener('change',e=>importData(e.target.files[0]));chooseRecipe('longsword')}
init();
