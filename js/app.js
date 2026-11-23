/* GuildenHeim — js/app.js */
const $ = id => document.getElementById(id);
const fields = ['headSelect','headMaterial','headSize','headShape','handleSelect','handleMaterial','handleSize','mountSelect','pommelSelect','qualitySelect'];
const format = n => Number(n.toFixed(1)).toString();
let mode='recipe', selected='longsword', discovered=[], successfulAttemptKey=null;
function currentAttemptKey(){return JSON.stringify({build:getBuild(),skill:Number($('skillLevel').value)})}
function createDMTools(){
  const host=document.querySelector('.workshop .dm-only');
  const section=document.createElement('section');
  section.className='panel';section.style.cssText='margin-top:18px;padding:18px;';
  section.innerHTML=`
    <div style="font-weight:700;color:var(--gold);margin-bottom:12px">DM crafting reference</div>
    <div class="dm-result" id="ingredientSection"><strong>Required material units</strong><ul id="ingredientList" style="color:var(--muted);font-size:14px;line-height:1.8"></ul><p style="font-size:12px;color:var(--muted)">The DM handles supply and payment. No player inventory is stored or deducted.</p></div>
    <div style="border-top:1px solid var(--line);padding-top:14px;margin-top:15px"><strong>Material database</strong><p style="font-size:12px;color:var(--muted)">Edit campaign ratings; changes are saved in this browser.</p>
      <label for="materialEditorSelect" style="display:block;margin:12px 0 6px">Material</label><select id="materialEditorSelect"></select>
      <div id="materialEditorFields" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:12px 0"></div>
      <button id="saveMaterial" class="outline full">Save material ratings</button><div id="materialEditorStatus" role="status" style="font-size:12px;color:var(--green);margin-top:8px"></div>
    </div>
    <div style="border-top:1px solid var(--line);padding-top:14px;margin-top:18px"><strong>Crafting experience</strong><p style="font-size:12px;color:var(--muted)">Track progress for each character. Repeating known recipes awards less XP.</p>
      <label for="crafterName" style="display:block;margin:10px 0 6px">Crafter name</label><input id="crafterName" type="text" maxlength="60" placeholder="Character name" style="width:100%;padding:10px;background:#122128;color:var(--text);border:1px solid var(--line);border-radius:6px" />
      <p id="crafterProgress" style="font-size:13px;color:var(--gold2)" aria-live="polite"></p>
    </div>`;
  host.append(section);
  options('materialEditorSelect',Object.entries(materials).map(([id,m])=>[id,m.name]));
  const updateEditor=()=>{
    const id=$('materialEditorSelect').value,area=$('materialEditorFields');area.replaceChildren();
    for(const key of ['hardness','toughness','flexibility','magic','workability']){
      const container=document.createElement('label');container.style.cssText='display:block;color:var(--muted);font-size:12px';container.textContent=key[0].toUpperCase()+key.slice(1);
      const input=document.createElement('input');input.type='number';input.min='0';input.max='10';input.step='1';input.value=rating(id,key);input.dataset.rating=key;
      input.style.cssText='display:block;width:100%;margin-top:5px;padding:8px;border-radius:5px;border:1px solid var(--line);background:#14252b;color:var(--text)';
      container.append(input);area.append(container);
    }
  };
  $('materialEditorSelect').addEventListener('change',updateEditor);
  $('saveMaterial').addEventListener('click',()=>{
    const id=$('materialEditorSelect').value,values={};
    for(const input of $('materialEditorFields').querySelectorAll('input')){
      const n=Number(input.value);if(!Number.isInteger(n)||n<0||n>10){$('materialEditorStatus').textContent='All ratings must be whole numbers from 0 to 10.';return}values[input.dataset.rating]=n;
    }
    materialAttributes[id]=values;
    $('materialEditorStatus').textContent=localSave(MATERIAL_KEY,materialAttributes)?'Material ratings saved.':'Could not save in this browser.';
    invalidateEvaluation();render();
  });
  $('crafterName').addEventListener('input',renderCrafterProgress);
  updateEditor();renderCrafterProgress();
}
function renderCrafterProgress(){
  const name=$('crafterName')?.value.trim();if(!name){$('crafterProgress').textContent='Enter a character name to track crafting XP.';return}
  const xp=Number(crafterXP[name]||0),level=levelForXP(xp);
  $('crafterProgress').textContent=`${xp} XP · Suggested skill ${level}/5${level<5?` · Next level at ${xpForLevel(level+1)} XP`: ' · Mastered'}`;
}
function renderIngredients(ingredients){
  const list=$('ingredientList');if(!list)return;
  list.replaceChildren(...ingredients.map(item=>{const li=document.createElement('li');li.textContent=`${materials[item.id].name}: ${item.quantity} unit${item.quantity!==1?'s':''}${item.quantity<item.base?` (skill saved ${item.base-item.quantity})`:''}`;return li}));
}
function createPlayerEstimate(){
  // Older GuildenHeim pages may not yet include the player notes added in v0.4.
  let notes=document.querySelector('.workshop .player-notes');
  if(!notes){
    notes=document.createElement('section');notes.className='panel player-notes';
    notes.style.cssText='margin-top:18px;padding:18px';
    const label=document.createElement('label');label.htmlFor='notesInput';label.textContent='Design notes';
    const textarea=document.getElementById('notesInput')||document.createElement('textarea');
    textarea.id='notesInput';textarea.rows=4;textarea.placeholder='Describe your proposed design...';
    textarea.style.cssText='display:block;width:100%;min-height:100px;margin-top:12px;padding:10px;background:#122128;color:#f0ede2;border:1px solid #405158;border-radius:6px';
    notes.append(label,textarea);document.querySelector('.workshop .component-grid').insertAdjacentElement('afterend',notes);
  }
  const section=document.createElement('section');
  section.className='panel';
  section.style.cssText='margin-top:18px;padding:18px;';
  section.innerHTML=`
    <div style="font-weight:700;font-family:Cinzel,serif;margin-bottom:8px">Design feasibility and material estimate</div>
    <p style="color:var(--muted);font-size:13px;line-height:1.5;margin:0 0 12px">Base material units before crafting skill reductions. Final crafting requirements are determined by the DM.</p>
    <div id="playerValidity" role="status" aria-live="polite" style="font-weight:700;font-size:14px;margin-bottom:10px"></div>
    <ul id="playerIngredients" style="font-size:14px;line-height:1.8;color:var(--text);padding-left:20px;margin:0 0 10px"></ul>
    <p id="playerEstimateNote" style="font-size:12px;color:var(--muted);line-height:1.5;margin:0"></p>`;
  notes.insertAdjacentElement('afterend',section);
}
function createTechniqueControl(){
  const section=document.createElement('section');
  section.className='panel';section.style.cssText='margin-top:18px;padding:18px';
  const label=document.createElement('label');label.htmlFor='techniqueSelect';label.textContent='Crafting technique';
  label.style.cssText='display:block;font-family:Cinzel,serif;font-weight:600;margin-bottom:10px';
  const select=document.createElement('select');select.id='techniqueSelect';
  const detail=document.createElement('p');detail.id='techniqueDescription';detail.style.cssText='font-size:13px;line-height:1.5;color:var(--muted);margin:10px 0 0';
  section.append(label,select,detail);
  document.querySelector('.workshop .component-grid').insertAdjacentElement('afterend',section);
  options('techniqueSelect',Object.entries(craftingTechniques).map(([id,t])=>[id,t.name]));
  select.addEventListener('change',()=>{invalidateEvaluation();render()});
}
function renderPlayerEstimate(build,assessment){
  const status={valid:'✓ Valid construction',conditional:'! Conditionally valid — DM review required',invalid:'× Invalid as assembled'};
  if(!$('playerValidity'))return;
  $('playerValidity').textContent=status[assessment.status];
  $('playerValidity').className=assessment.status;
  const list=$('playerIngredients');
  list.replaceChildren(...requiredMaterials(build,0).map(item=>{
    const li=document.createElement('li');
    li.textContent=`${materials[item.id].name}: ${item.quantity} unit${item.quantity===1?'':'s'}`;
    return li;
  }));
  $('playerEstimateNote').textContent=assessment.status==='invalid'
    ?'The components need modification before they can be crafted. Material quantities are only a planning reference.'
    :assessment.status==='conditional'
      ?'This design may need reinforcement, an adapter, or other changes. The DM makes the final ruling.'
      :'The components pass the provisional compatibility checks. This is not a guarantee of crafting success.';
}

function safeRead(){try{const data=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');return Array.isArray(data)?data.filter(x=>x&&typeof x.id==='string'&&x.build&&typeof x.build==='object').slice(0,200):[]}catch{return []}}
function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(discovered));return true}catch{return false}}
function options(id,values){const el=$(id);el.replaceChildren(...values.map(([value,label])=>{const option=document.createElement('option');option.value=value;option.textContent=label;return option}))}
function materialChoices(id){options(id,Object.entries(materials).map(([k,v])=>[k,v.name]))}
function chooseRecipe(id){const entry=recipes.find(r=>r.id===id)||discovered.find(r=>r.id===id);if(!entry)return;selected=id;mode='recipe';successfulAttemptKey=null;invalidateEvaluation();setMode();loadBuild(entry.build||entry);render()}
function setMode(){$('recipeMode').classList.toggle('selected',mode==='recipe');$('experimentMode').classList.toggle('selected',mode==='experiment');$('modeBadge').textContent=mode==='recipe'?'KNOWN RECIPE':'EXPERIMENTAL BUILD';$('craftSubtitle').textContent=mode==='recipe'?'Customize a familiar recipe with your own materials and parts.':'Try an unconventional combination; the system suggests a ruling for your DM.'}
function loadBuild(r){$('headSelect').value=r.head;$('handleSelect').value=r.handle;$('headMaterial').value=r.headMaterial;$('handleMaterial').value=r.handleMaterial;$('headSize').value=r.headSize||'medium';$('handleSize').value=r.handleSize||'medium';$('mountSelect').value=r.mount||heads[r.head].mount;$('pommelSelect').value=r.pommel||'none';$('qualitySelect').value=r.quality||'standard';$('techniqueSelect').value=craftingTechniques[r.technique]?r.technique:'none';updateShapes(r.shape);$('notesInput').value=r.notes||''}
function updateShapes(preferred){const list=heads[$('headSelect').value].shapes;const current=preferred||$('headShape').value;options('headShape',list.map(s=>[s,s[0].toUpperCase()+s.slice(1)]));$('headShape').value=list.includes(current)?current:list[0]}
function getBuild(){return {head:$('headSelect').value,handle:$('handleSelect').value,headMaterial:$('headMaterial').value,handleMaterial:$('handleMaterial').value,headSize:$('headSize').value,handleSize:$('handleSize').value,shape:$('headShape').value,mount:$('mountSelect').value,pommel:$('pommelSelect').value,quality:$('qualitySelect').value,technique:$('techniqueSelect').value,notes:$('notesInput').value.trim()}}
function isDefault(b,r){return ['head','handle','headMaterial','handleMaterial','headSize','handleSize','shape','mount','pommel'].every(k=>(b[k]||'none')===(r[k]||'none'))&&(b.technique||'none')===(r.technique||'none')}
function renderRecipeList(){const list=$('recipeList');list.replaceChildren();[...recipes,...discovered].forEach(r=>{const btn=document.createElement('button');btn.className='recipe-button'+(mode==='recipe'&&selected===r.id?' active':'');const ico=document.createElement('span');ico.className='recipe-icon';ico.textContent=heads[(r.build||r).head]?.glyph||'⚔';const info=document.createElement('span');const title=document.createElement('strong');title.textContent=r.name;const subtitle=document.createElement('small');subtitle.textContent=r.build?(r.stage||'prototype').replace(/^./,c=>c.toUpperCase()):'Standard blueprint';info.append(title,subtitle);btn.append(ico,info);btn.addEventListener('click',()=>chooseRecipe(r.id));list.append(btn)});$('recipeCount').textContent=recipes.length+discovered.length}
function createDiscoveryControls(){
  const button=document.createElement('button');button.id='advanceDiscovery';button.className='outline full';
  button.style.marginTop='8px';button.textContent='Advance recipe stage';
  $('saveButton').insertAdjacentElement('afterend',button);
  button.addEventListener('click',()=>{
    if(!document.body.classList.contains('dm-mode'))return;
    const recipe=discovered.find(r=>r.id===selected);if(!recipe)return;
    const stages=['experimental','prototype','established','mastered'];
    const current=stages.indexOf(recipe.stage||'prototype');
    if(current===stages.length-1)return;
    const next=stages[current+1];
    if(!window.confirm(`DM approval: advance ${recipe.name} from ${recipe.stage||'prototype'} to ${next}?`))return;
    recipe.stage=next;recipe.approved=['established','mastered'].includes(next);
    if(!persist()){$('saveMessage').textContent='Unable to save recipe stage.';return}
    invalidateEvaluation();$('saveMessage').textContent=`Recipe advanced to ${next}. Reevaluate for updated crafting requirements.`;render();
  });
}
function render(){
  const b=getBuild(),a=assess(b),base=recipes.find(r=>r.id===selected)||discovered.find(r=>r.id===selected),exact=mode==='recipe'&&base&&isDefault(b,base.build||base);
  $('techniqueDescription').textContent=(craftingTechniques[b.technique]||craftingTechniques.none).description;
  renderPlayerEstimate(b,a);
  const classification=classifyWeapon(b,a),closest=classification.reference;
  const reference=exact?base:closest,stage=base?.stage||'experimental',provisional=!exact||(!!base?.build&&!base.approved);
  const skill=skillOutcome(a,b,provisional||mode==='experiment',exact?stage:'experimental');
  renderIngredients(skill.ingredients);
  $('costStat').textContent=`${skill.cost} units`;
  $('chanceStat').textContent=`${skill.chance}%`;
  $('timeStat').textContent=`${skill.hours} h`;
  const d20SuccessFaces=Math.round(skill.chance/5);
  const d20Approximation=d20SuccessFaces===0?'No successful faces on a d20':`roll ${21-d20SuccessFaces}–20 on a d20`;
  $('diceRecommendation').textContent=skill.chance===0
    ?'Dice recommendation: This build is incompatible; no crafting roll is allowed.'
    :`Dice recommendation: Roll 1d100. Success on 01–${String(skill.chance).padStart(2,'0')}. Alternatively, ${d20Approximation} (approximately ${d20SuccessFaces*5}%, rounded to the nearest 5%).`;
  const name=exact?base.name:`${materials[b.headMaterial].name} ${classification.classification}`;
  $('breadcrumbName').textContent=mode==='recipe'?(base?.name||'RECIPE').toUpperCase():'EXPERIMENT';
  $('craftTitle').textContent=mode==='recipe'?'The crafting table':'The experimental forge';
  $('headLabel').textContent=heads[b.head].type==='bludgeoning'?'Striking head':'Blade / head';
  $('massStat').textContent=`${format(a.mass)} units`;$('lengthStat').textContent=`${format(a.length)} units`;$('integrityStat').textContent=`${a.structural} / 5`;$('handlingStat').textContent=`${a.handling} / 5`;
  const statusText={valid:'✓ Construction looks viable',conditional:'! Requires DM review',invalid:'× Incompatible as assembled'};
  $('compatibility').className=a.status;$('compatibility').textContent=statusText[a.status];const reasons=$('reasonList');reasons.replaceChildren(...a.reasons.map(s=>{const li=document.createElement('li');li.textContent=s;return li}));
  const tagLine=document.createElement('li');tagLine.textContent=`Component tags: ${classification.tags.join(', ')}`;reasons.append(tagLine);
  const recommendationLine=document.createElement('li');recommendationLine.textContent=exact&&!provisional?`Established recipe properties: ${reference.properties.join(', ')||'None'}`:`Suggested properties (not granted): ${classification.recommendations.join(', ')||'None'}`;reasons.append(recommendationLine);
  $('weaponGlyph').textContent=heads[b.head].glyph;$('categoryLabel').textContent=provisional?'PROVISIONAL HOMEBREW ITEM':reference.kind.toUpperCase();$('itemName').textContent=name;$('damageStat').textContent=reference.damage;$('damageTypeStat').textContent=exact?reference.type:classification.type;
  const pills=$('propertyPills');pills.replaceChildren(...(exact&&!provisional?reference.properties:classification.recommendations).map(s=>{const span=document.createElement('span');span.textContent=s;return span}));
  $('itemDescription').textContent=exact?reference.description:`A ${b.shape} ${heads[b.head].name.toLowerCase()} with a ${handles[b.handle].name.toLowerCase()}, constructed from ${materials[b.headMaterial].name.toLowerCase()} and ${materials[b.handleMaterial].name.toLowerCase()}.`;
  $('rulingText').textContent=a.status==='invalid'?'Fix the incompatible mount before treating the item as usable. '+`Closest reference: ${closest.name}.`:provisional?`Classified as ${classification.classification}. Closest baseline: ${closest.name} (${closest.damage} ${closest.type.toLowerCase()}). Properties shown are suggestions only; the DM must approve the final result.`:'Matches the saved blueprint. Standard recipe statistics apply; abstract physical scores are only a crafting reference.';
  $('attemptButton').disabled=a.status==='invalid';
  $('saveButton').disabled=a.status==='invalid'||successfulAttemptKey!==currentAttemptKey();
  $('saveButton').textContent=exact&&base?.build?'Update discovered recipe':'Save as discovered recipe';renderRecipeList();
  $('advanceDiscovery').disabled=!base?.build||!exact||stage==='mastered';
  $('advanceDiscovery').textContent=base?.build?`Advance: ${stage==='mastered'?'Mastered':stage==='experimental'?'Experimental → Prototype':stage==='prototype'?'Prototype → Established':'Established → Mastered'}`:'Advance recipe stage';
}
function makeExperiment(){mode='experiment';selected='';successfulAttemptKey=null;invalidateEvaluation();setMode();$('saveMessage').textContent='';render()}
function invalidateEvaluation(){document.body.classList.remove('evaluated');successfulAttemptKey=null}
function toggleDM(){
  if(document.body.classList.contains('dm-mode')){
    document.body.classList.remove('dm-mode','evaluated');$('dmToggle').textContent='DM review';$('dmToggle').setAttribute('aria-pressed','false');$('skillLevel').value='';$('difficultyLevel').value='';successfulAttemptKey=null;return;
  }
  const code=window.prompt('GuildenHeim DM access code:');
  if(code===null)return;
  if(code!==DM_ACCESS_CODE){window.alert('Incorrect DM access code.');return}
  document.body.classList.add('dm-mode');$('dmToggle').textContent='Exit DM review';$('dmToggle').setAttribute('aria-pressed','true');
}
function generateDMResult(){
  if($('skillLevel').value===''||$('difficultyLevel').value===''){window.alert('Enter the crafter skill level and DM difficulty first.');return}
  document.body.classList.add('evaluated');successfulAttemptKey=null;$('saveMessage').textContent='DM result generated. Roll an attempt to discover the recipe.';render();
}
function attemptCraft(){
  if(!document.body.classList.contains('dm-mode')||!document.body.classList.contains('evaluated'))return;
  const b=getBuild(),a=assess(b);if(a.status==='invalid')return;
  const base=recipes.find(r=>r.id===selected)||discovered.find(r=>r.id===selected);
  const exact=mode==='recipe'&&base&&isDefault(b,base.build||base);
  const experimental=!exact||(!!base?.build&&!base.approved);
  const stats=skillOutcome(a,b,experimental,exact?(base?.stage||'experimental'):'experimental');
  const roll=Math.floor(Math.random()*100)+1,success=roll<=stats.chance;
  successfulAttemptKey=success?currentAttemptKey():null;
  let experience='';
  const name=$('crafterName').value.trim();
  if(name){
    const identity=`${name}::${b.head}::${b.handle}::${b.shape}::${b.headMaterial}::${b.handleMaterial}`;
    const repetitions=Number(craftHistory[identity]||0);
    const earned=success?(experimental?8:repetitions?1:4):1;
    crafterXP[name]=Number(crafterXP[name]||0)+earned;
    if(success)craftHistory[identity]=repetitions+1;
    localSave(CRAFTER_KEY,crafterXP);localSave(CRAFT_HISTORY_KEY,craftHistory);renderCrafterProgress();
    experience=` ${name} earned ${earned} crafting XP.`;
  }
  $('saveMessage').textContent=success
    ?`Success! Rolled ${roll} against ${stats.chance}%. ${experimental?'Discovery may be recorded.':'Crafting succeeded; you may record a variant.'} ${stats.cost} material units; ${stats.hours} hours.${experience}`
    :`Attempt failed (rolled ${roll}; needed ${stats.chance} or less). The DM decides if materials are consumed.${experience}`;
  render();
}
function save(){
  const b=getBuild(),a=assess(b);
  if(a.status==='invalid'||successfulAttemptKey!==currentAttemptKey())return;
  const classified=classifyWeapon(b,a);
  const suggested=`${materials[b.headMaterial].name} ${classified.classification}`;
  const raw=window.prompt('Name this discovered recipe:',suggested);if(raw===null)return;
  const name=raw.trim().slice(0,70);if(!name){$('saveMessage').textContent='A recipe needs a name.';return}
  const prev=discovered.find(r=>r.id===selected),closest=classified.reference;
  const sameBlueprint=!!prev&&isDefault(b,prev.build);
  const item={
    id:prev?.id||`custom_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
    name,kind:'Discovered homebrew weapon',damage:prev?.damage||closest.damage,
    type:prev?.type||classified.type,
    properties:prev?.properties||classified.recommendations,
    description:`Experimental recipe referencing ${closest.name}; DM approval required.`,
    build:b,stage:sameBlueprint?(prev.stage||'prototype'):'prototype',
    approved:sameBlueprint?!!prev.approved:false,
    createdAt:prev?.createdAt||new Date().toISOString()
  };
  if(prev)discovered=discovered.map(r=>r.id===prev.id?item:r);else discovered.push(item);
  if(!persist()){$('saveMessage').textContent='Browser storage unavailable. Export your recipes to keep this design.';return}
  selected=item.id;mode='recipe';successfulAttemptKey=null;setMode();
  $('saveMessage').textContent='Saved locally as a provisional discovery. Export to back it up.';render();
}
function exportData(){const blob=new Blob([JSON.stringify({app:'guildenheim',version:2,discoveries:discovered},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='guildenheim-recipes.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function exportPlayerDesign(){
  const build=getBuild();
  const chosenRecipe=recipes.find(r=>r.id===selected)||discovered.find(r=>r.id===selected);
  const proposal={
    format:'guildenheim-player-design',version:1,
    recipe:mode==='recipe'?(chosenRecipe?.name||'Custom design'):'Experimental design',
    components:{
      head:{form:build.head,material:build.headMaterial,size:build.headSize,shape:build.shape},
      handle:{form:build.handle,material:build.handleMaterial,size:build.handleSize,mount:build.mount},
      counterweight:{type:build.pommel}
    },
    workmanship:build.quality,
    technique:build.technique,
    designNotes:build.notes
  };
  const blob=new Blob([JSON.stringify(proposal,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download='guildenheim-player-design.json';link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function importData(file){if(!file)return;try{if(file.size>1024*1024)throw Error('File exceeds 1 MB');const data=JSON.parse(await file.text());
  if(data.format==='guildenheim-player-design'){
    const c=data.components||{},h=c.head||{},g=c.handle||{},p=c.counterweight||{};
    if(!heads[h.form]||!handles[g.form]||!materials[h.material]||!materials[g.material]||!heads[h.form].shapes.includes(h.shape)||!['small','medium','large'].includes(h.size)||!['short','medium','long'].includes(g.size)||!['tang','socket','lashing'].includes(g.mount)||!['none','iron','heavy'].includes(p.type)||!['crude','standard','fine','masterwork'].includes(data.workmanship))throw Error('Invalid player design components');
    mode='experiment';selected='';invalidateEvaluation();setMode();
    loadBuild({head:h.form,headMaterial:h.material,headSize:h.size,shape:h.shape,handle:g.form,handleMaterial:g.material,handleSize:g.size,mount:g.mount,pommel:p.type,quality:data.workmanship,technique:craftingTechniques[data.technique]?data.technique:'none',notes:typeof data.designNotes==='string'?data.designNotes.slice(0,3000):''});
    render();$('saveMessage').textContent='Player design loaded. Enter DM inputs to evaluate it.';return;
  }
  if(!['forgebook','guildenheim'].includes(data.app)||!Array.isArray(data.discoveries))throw Error('Not a GuildenHeim export');
  const clean=data.discoveries.slice(0,200).filter(r=>
    r&&typeof r.name==='string'&&r.name.length<=70&&r.build&&
    heads[r.build.head]&&handles[r.build.handle]&&materials[r.build.headMaterial]&&materials[r.build.handleMaterial]&&
    heads[r.build.head].shapes.includes(r.build.shape)&&
    ['tang','socket','lashing'].includes(r.build.mount)&&
    ['short','small','medium','long','large'].includes(r.build.headSize)&&
    ['short','small','medium','long','large'].includes(r.build.handleSize)
  ).map((r,i)=>{
    const stage=['experimental','prototype','established','mastered'].includes(r.stage)?r.stage:'prototype';
    return {id:`import_${Date.now()}_${i}`,name:r.name,kind:'Discovered homebrew weapon',
      damage:typeof r.damage==='string'?r.damage.slice(0,30):'DM ruling',
      type:typeof r.type==='string'?r.type.slice(0,30):'DM ruling',
      properties:Array.isArray(r.properties)?r.properties.filter(v=>typeof v==='string').slice(0,8):[],
      description:'Imported homebrew recipe; review before using.',
      build:{...r.build,technique:craftingTechniques[r.build.technique]?r.build.technique:'none'},
      stage,approved:['established','mastered'].includes(stage),createdAt:new Date().toISOString()};
  });
  discovered=[...discovered,...clean].slice(0,200);
  if(!persist())throw Error('Local storage unavailable');
  render();$('saveMessage').textContent=`Imported ${clean.length} recipes.`;
}catch(e){alert(`Could not import: ${e.message}`)}finally{$('importFile').value=''}}
function init(){
  const diceRecommendation=document.createElement('p');
  diceRecommendation.id='diceRecommendation';
  diceRecommendation.className='skill-note dm-result';
  diceRecommendation.setAttribute('aria-live','polite');
  $('generateButton').insertAdjacentElement('afterend',diceRecommendation);
  options('headSelect',Object.entries(heads).map(([k,v])=>[k,v.name]));
  options('handleSelect',Object.entries(handles).map(([k,v])=>[k,v.name]));
  materialChoices('headMaterial');materialChoices('handleMaterial');
  options('headSize',[['small','Small'],['medium','Medium'],['large','Large']]);
  options('handleSize',[['short','Short'],['medium','Medium'],['long','Long']]);
  options('mountSelect',[['tang','Tang and receptacle'],['socket','Socket fitting'],['lashing','Improvised lashing']]);
  options('pommelSelect',[['none','None'],['iron','Small iron pommel'],['heavy','Heavy counterweight']]);
  options('qualitySelect',[['crude','Crude'],['standard','Standard'],['fine','Fine'],['masterwork','Masterwork']]);
  discovered=safeRead();
  fields.forEach(id=>$(id).addEventListener('change',()=>{
    if(id==='headSelect'){updateShapes();$('mountSelect').value=heads[$('headSelect').value].mount}
    invalidateEvaluation();$('saveMessage').textContent='';render();
  }));
  $('notesInput').addEventListener('input',()=>{successfulAttemptKey=null;render()});
  $('skillLevel').addEventListener('change',()=>{invalidateEvaluation();$('saveMessage').textContent='';render()});
  $('difficultyLevel').addEventListener('change',()=>{invalidateEvaluation();$('saveMessage').textContent='';render()});
  $('dmToggle').addEventListener('click',toggleDM);
  $('generateButton').addEventListener('click',generateDMResult);
  $('recipeMode').addEventListener('click',()=>chooseRecipe(selected&&([...recipes,...discovered].some(r=>r.id===selected))?selected:'longsword'));
  $('experimentMode').addEventListener('click',makeExperiment);
  $('newExperiment').addEventListener('click',makeExperiment);
  $('attemptButton').addEventListener('click',attemptCraft);
  $('saveButton').addEventListener('click',save);
  $('exportButton').addEventListener('click',exportData);
  if(!$('playerExportButton')){
    const button=document.createElement('button');button.id='playerExportButton';button.className='outline tiny';button.textContent='Export design';
    document.querySelector('.top-right').insertBefore(button,$('dmToggle'));
  }
  $('playerExportButton').addEventListener('click',exportPlayerDesign);
  $('importButton').addEventListener('click',()=>$('importFile').click());
  $('importFile').addEventListener('change',e=>importData(e.target.files[0]));
  createTechniqueControl();
  createPlayerEstimate();
  createDMTools();
  createDiscoveryControls();
  chooseRecipe('longsword');
}
init();
