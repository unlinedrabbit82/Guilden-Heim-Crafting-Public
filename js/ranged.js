/* GuildenHeim v0.8 — ranged workbench.
 * All crafting formulas are homebrew. Official damage/range/properties live
 * in data/ranged.js and official market values in data/weapon-stats.js.
 * DEV: edit rangedParts for abstract unit costs and matching mechanism rules.
 */
const ranged$=id=>document.getElementById(id);
const RANGED_SAVE_KEY='guildenheim_ranged_discoveries_v1';
let rangedSelected='shortbow',rangedExperiment=false,rangedSuccessKey=null;
let rangedDiscoveryName='';
let rangedDiscoveryId=null;
function rangedDiscovered(){
  const stored=localJSON(RANGED_SAVE_KEY,[]);
  return Array.isArray(stored)?stored:[];
}
function rangedCurrentDiscovery(){return rangedDiscovered().find(entry=>entry.id===rangedDiscoveryId);}
function rangedOptions(id,entries){
  const select=ranged$(id);select.replaceChildren(...entries.map(([value,label])=>{
    const o=document.createElement('option');o.value=value;o.textContent=label;return o;
  }));
}
function rangedBuild(){return {
  frame:ranged$('rangedFrame').value,material:ranged$('rangedMaterial').value,
  mechanism:ranged$('rangedMechanism').value,grip:ranged$('rangedGrip').value,
  quality:ranged$('rangedQuality').value,notes:ranged$('rangedNotes').value.trim()
}}
function rangedRecipe(){return rangedRecipes.find(r=>r.id===rangedSelected)}
function rangedExact(b){const r=rangedRecipe();return !rangedExperiment&&r&&['frame','material','mechanism','grip'].every(key=>r[key]===b[key]);}
function rangedAssessment(b,level=0){
  const frame=rangedParts.frames[b.frame],mechanism=rangedParts.mechanisms[b.mechanism],grip=rangedParts.grips[b.grip];
  const reasons=[];
  if(!frame.mechanisms.includes(b.mechanism))reasons.push(`${frame.name} cannot use ${mechanism.name} as its launch mechanism.`);
  if(!frame.materials.includes(b.material))reasons.push(`${materials[b.material].name} is unsuitable for this frame without DM-designed adaptations.`);
  if(b.frame==='crossbow'&&b.grip==='short'&&!rangedExact(b))reasons.push('A nonstandard compact crossbow requires DM review of trigger leverage and assembly.');
  if(b.frame==='bow'&&b.grip==='short')reasons.push('A short bow grip may need reinforcement.');
  const invalid=reasons.some(s=>s.includes('cannot')||s.includes('unsuitable'));
  const conditional=!invalid&&reasons.length>0;
  const base=frame.units+mechanism.units+grip.units+(b.quality==='masterwork'?2:b.quality==='fine'?1:0);
  const units=Math.max(1,Math.ceil(base*(1-.05*level)));
  // Abstract, playtest-only physical profile. These scores are NOT official
  // 2014 weight, armor class, damage modifiers, or attack roll bonuses.
  const mass=Number((base*materials[b.material].mass).toFixed(1));
  const lengths={bow:3,crossbow:2.5,tube:2,sling:1.5,dart:1,net:3};
  const length=Number((lengths[b.frame]+({short:0,standard:.5,long:1.5})[b.grip]).toFixed(1));
  const structural=Math.max(1,Math.min(5,Math.min(materials[b.material].integrity,3)+(b.quality==='fine'?1:b.quality==='masterwork'?2:0)-(conditional?1:0)-(invalid?2:0)));
  const handling=Math.max(1,Math.min(5,3+(b.grip==='standard'?1:0)-(b.grip==='long'&&b.frame==='dart'?1:0)-(invalid?2:0)-(conditional?1:0)));
  return {status:invalid?'invalid':conditional?'conditional':'valid',reasons:reasons.length?reasons:['Frame, propulsion, and grip are compatible under the simplified crafting reference.'],base,units,mass,length,structural,handling};
}
function rangedResolved(b,a){
  const exact=rangedExact(b);
  const reference=exact?rangedRecipe():rangedRecipes.find(r=>r.frame===b.frame)||rangedRecipes[0];
  return {reference,exact,provisional:!exact};
}
function rangedOutcome(b,a,level,difficulty){
  const {provisional}=rangedResolved(b,a);
  const discovery=rangedCurrentDiscovery(),matching=!!discovery&&rangedMatchesDiscovery(b,discovery);
  const stage=discovery?.stage||'prototype',mastered=matching&&stage==='mastered'&&!!discovery?.approved;
  const unapproved=provisional&&!(matching&&discovery?.approved);
  const complexity=Math.max(0,(unapproved?2:0)+(a.status==='conditional'?2:0)+(b.quality==='masterwork'?2:b.quality==='fine'?1:0)+Math.max(0,difficulty)+rating(b.material,'workability')-(mastered?1:0));
  const chance=a.status==='invalid'?0:Math.max(5,Math.min(95,70+6*level-10*complexity-(b.quality==='crude'?5:0)+(mastered?5:0)));
  const hours=Math.max(1,Math.ceil((8+complexity*4+a.mass*2)*(1-.08*level)*(mastered?.9:1)));
  return {chance,hours,units:rangedAssessment(b,level).units};
}
function rangedInvalidate(){rangedSuccessKey=null;document.body.classList.remove('evaluated');ranged$('rangedMessage').textContent='';}
function rangedKey(b){return JSON.stringify([b,ranged$('rangedSkill').value,ranged$('rangedDifficulty').value]);}
function rangedList(){
  const host=ranged$('rangedRecipeList');host.replaceChildren(...rangedRecipes.map(recipe=>{
    const btn=document.createElement('button');btn.type='button';btn.className='recipe-button'+(!rangedExperiment&&rangedSelected===recipe.id?' active':'');
    const icon=document.createElement('span');icon.className='recipe-icon';icon.textContent=rangedParts.frames[recipe.frame].icon;
    const info=document.createElement('span');const title=document.createElement('strong');title.textContent=recipe.name;
    const subtitle=document.createElement('small');subtitle.textContent=recipe.tier+' ranged · '+recipe.damage+' '+recipe.type.toLowerCase();
    info.append(title,subtitle);btn.append(icon,info);btn.addEventListener('click',()=>rangedChoose(recipe.id));return btn;
  }));
  const discoveries=rangedDiscovered();
  ranged$('rangedDiscoveryCount').textContent=discoveries.length;
  const target=ranged$('rangedDiscoveryList');
  target.replaceChildren(...discoveries.map(item=>{
    const button=document.createElement('button');button.type='button';button.className='recipe-button'+(rangedDiscoveryId===item.id?' active':'');
    const name=document.createElement('strong');name.textContent=item.name;
    const status=document.createElement('small');status.textContent=item.stage||'prototype';
    const wrap=document.createElement('span');wrap.append(name,status);button.append(wrap);
    button.addEventListener('click',()=>{
      const b=item.build||{};
      if(!rangedParts.frames[b.frame]||!rangedParts.mechanisms[b.mechanism]||!rangedParts.grips[b.grip]||!materials[b.material])return;
      rangedExperiment=true;rangedDiscoveryName=item.name;rangedDiscoveryId=item.id;
      for(const [key,value] of [['rangedFrame',b.frame],['rangedMaterial',b.material],['rangedMechanism',b.mechanism],['rangedGrip',b.grip],['rangedQuality',b.quality]])ranged$(key).value=value;
      ranged$('rangedNotes').value=b.notes||'';rangedInvalidate();rangedRender();
    });return button;
  }));
}
function rangedChoose(id){
  const recipe=rangedRecipes.find(r=>r.id===id);if(!recipe)return;
  rangedSelected=id;rangedExperiment=false;rangedDiscoveryName='';rangedDiscoveryId=null;
  ranged$('rangedFrame').value=recipe.frame;ranged$('rangedMaterial').value=recipe.material;
  ranged$('rangedMechanism').value=recipe.mechanism;ranged$('rangedGrip').value=recipe.grip;
  ranged$('rangedQuality').value='standard';ranged$('rangedNotes').value='';
  rangedInvalidate();rangedRender();
}
function rangedRender(){
  const b=rangedBuild(),a=rangedAssessment(b),{reference,exact}=rangedResolved(b,a);
  ranged$('rangedBreadcrumb').textContent=(rangedExperiment?'EXPERIMENT':reference.name).toUpperCase();
  ranged$('rangedTitle').textContent=rangedExperiment?(rangedDiscoveryName||'Experimental ranged design'):reference.name+' blueprint';
  ranged$('rangedModeBadge').textContent=exact?'KNOWN RECIPE':'PROVISIONAL BUILD';
  ranged$('rangedValidity').textContent=({valid:'✓ Valid component assembly',conditional:'! Conditionally valid — DM review required',invalid:'× Invalid component assembly'})[a.status];
  ranged$('rangedValidity').className=a.status;
  const materialList=ranged$('rangedMaterialList');materialList.replaceChildren();
  const li=document.createElement('li');li.textContent=`${materials[b.material].name}: ${a.base} abstract unit${a.base===1?'':'s'}`;materialList.append(li);
  if(a.reasons.length){const note=document.createElement('li');note.textContent=a.reasons.join(' ');materialList.append(note);}
  rangedList();
  const level=Number(ranged$('rangedSkill').value||0),difficulty=Number(ranged$('rangedDifficulty').value||0);
  const result=rangedOutcome(b,a,level,difficulty);
  const discovery=rangedCurrentDiscovery();
  const stage=discovery?.stage||'experimental';
  ranged$('rangedMass').textContent=`${a.mass} units`;
  ranged$('rangedLength').textContent=`${a.length} units`;
  ranged$('rangedIntegrity').textContent=`${a.structural} / 5`;
  ranged$('rangedHandling').textContent=`${a.handling} / 5`;
  const statusLabel={valid:'✓ Construction looks viable',conditional:'! Requires DM review',invalid:'× Incompatible as assembled'};
  ranged$('rangedCompatibility').className=a.status;
  ranged$('rangedCompatibility').textContent=statusLabel[a.status];
  const reasons=[...a.reasons];
  reasons.push(exact?`Standard blueprint: ${reference.name}.`:`Closest weapon reference: ${reference.name}. Suggested properties are not automatically granted.`);
  if(discovery)reasons.push(`Discovery stage: ${stage}. ${discovery.approved?'DM-approved for campaign use.':'Awaiting DM approval.'}`);
  ranged$('rangedReasons').replaceChildren(...reasons.map(reason=>{const li=document.createElement('li');li.textContent=reason;return li;}));
  ranged$('rangedCost').textContent=`${result.units} units`;
  ranged$('rangedChance').textContent=`${result.chance}%`;
  ranged$('rangedTime').textContent=`${result.hours} h`;
  ranged$('rangedDice').textContent=result.chance===0?'No roll: this assembly is incompatible.':`Roll 1d100: success on 01–${String(result.chance).padStart(2,'0')}. d20 approximation: roll ${21-Math.round(result.chance/5)}–20 (${Math.round(result.chance/5)*5}%).`;
  const isApproved=exact||!!discovery?.approved;
  const referenceExplanation=a.status==='invalid'?'Fix incompatible parts before treating this as usable.':exact?'Matches a 2014 weapon blueprint. Crafting success, cost, and physical scores are homebrew.':isApproved?'This discovered design has been approved by the DM. Its combat statistics still require a specific campaign ruling.':'This experimental design uses the nearest standard weapon as a baseline reference; shown damage and properties are NOT granted until the DM rules on the finished item.';
  const netRule=exact&&reference.id==='net'?'Net special: A hit can restrain a Large-or-smaller target. Escape requires an action and DC 10 Strength check; 5 slashing damage against AC 10 also destroys the net. Only one net attack per action, bonus action, or reaction.':'';
  renderEquipmentCard(ranged$('rangedItemCard'),{
    glyph:rangedParts.frames[b.frame].icon,
    category:exact?`${reference.tier.toUpperCase()} RANGED WEAPON`:isApproved?'DM-APPROVED HOMEBREW RANGED':'PROVISIONAL HOMEBREW RANGED',
    name:exact?reference.name:(rangedDiscoveryName||`${materials[b.material].name} ${rangedParts.frames[b.frame].name}`),
    damage:exact?reference.damage:`${reference.damage}*`,damageType:reference.type,
    properties:exact?reference.properties:reference.properties.map(p=>`${p}*`),
    market:exact?`2014 market price: ${reference.marketCost} · Official weight: ${reference.weightLb===null?'—':`${reference.weightLb} lb`}. (Crafting units are separate.)`:`Closest official reference: ${reference.name} · ${reference.marketCost} · ${reference.weightLb===null?'—':`${reference.weightLb} lb`}. These are not validated custom-item values.`,
    description:`${materials[b.material].name} ${rangedParts.frames[b.frame].name.toLowerCase()} with ${rangedParts.mechanisms[b.mechanism].name.toLowerCase()} and a ${rangedParts.grips[b.grip].name.toLowerCase()}. ${b.notes?'Notes: '+b.notes:''}`,
    ruling:[referenceExplanation,netRule].filter(Boolean).join(' ')
  });
  ranged$('rangedAmmunition').textContent=exact?reference.ammunition:`${reference.ammunition} (reference)`;
  ranged$('rangedRange').textContent=exact?`${reference.range.join('/')} ft`:`${reference.range.join('/')} ft*`;
  ranged$('rangedRuling').textContent=exact?'2014 baseline statistics shown above.':`* Suggested comparison statistics only. DM must approve damage, properties, and range before use.${discovery?` Stage: ${stage}.`:''}`;
  ranged$('rangedAttempt').disabled=a.status==='invalid';
  ranged$('rangedSave').disabled=a.status==='invalid'||rangedSuccessKey!==rangedKey(b);
  ranged$('rangedAdvance').disabled=!discovery||!rangedDiscoveryId||stage==='mastered'||!rangedMatchesDiscovery(b,discovery);
  ranged$('rangedAdvance').textContent=discovery?`Advance: ${stage==='mastered'?'Mastered':stage==='experimental'?'Experimental → Prototype':stage==='prototype'?'Prototype → Established':'Established → Mastered'}`:'Advance recipe stage';
}
function rangedMatchesDiscovery(b,entry){return !!entry&&['frame','material','mechanism','grip','quality','notes'].every(key=>(b[key]||'')===(entry.build?.[key]||''));}
function rangedExport(){
  const b=rangedBuild(),a=rangedAssessment(b);const proposal={format:'guildenheim-ranged-design',version:1,blueprint:rangedExperiment?'Experiment':rangedRecipe()?.name,components:b,baseMaterialUnits:a.base,validity:a.status};
  const blob=new Blob([JSON.stringify(proposal,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download='guildenheim-ranged-player-design.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function rangedGenerate(){
  if(!document.body.classList.contains('dm-mode'))return;
  if(ranged$('rangedSkill').value===''||ranged$('rangedDifficulty').value===''){alert('Choose crafter skill level and DM difficulty.');return;}
  rangedSuccessKey=null;document.body.classList.add('evaluated');rangedRender();
  ranged$('rangedMessage').textContent='Evaluation generated; roll a crafting attempt to record a discovery.';
}
function rangedAttempt(){
  if(!document.body.classList.contains('dm-mode')||!document.body.classList.contains('evaluated'))return;
  const b=rangedBuild(),a=rangedAssessment(b);if(a.status==='invalid')return;
  const r=rangedOutcome(b,a,Number(ranged$('rangedSkill').value),Number(ranged$('rangedDifficulty').value));
  const roll=1+Math.floor(Math.random()*100),success=roll<=r.chance;
  rangedSuccessKey=success?rangedKey(b):null;
  rangedRender();ranged$('rangedMessage').textContent=`${success?'Success':'Failure'}: rolled ${roll} against ${r.chance}%. ${r.units} abstract material units, ${r.hours} crafting hours. DM decides whether failed attempts consume materials.`;
}
function rangedSave(){
  if(!document.body.classList.contains('dm-mode')||!document.body.classList.contains('evaluated'))return;
  const b=rangedBuild();if(rangedSuccessKey!==rangedKey(b))return;
  const name=prompt('Name this ranged discovery:',`Custom ${rangedResolved(b,rangedAssessment(b)).reference.name}`);
  if(name===null)return;const clean=name.trim().slice(0,70);if(!clean)return;
  const list=rangedDiscovered(),existing=rangedCurrentDiscovery(),updating=rangedMatchesDiscovery(b,existing);
  const id=updating?existing.id:`ranged_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
  const record={id,name:clean,build:b,stage:updating?(existing.stage||'prototype'):'prototype',approved:updating?!!existing.approved:false,createdAt:updating?existing.createdAt:new Date().toISOString()};
  const updated=updating?list.map(item=>item.id===id?record:item):[...list,record];
  if(!localSave(RANGED_SAVE_KEY,updated.slice(-200))){ranged$('rangedMessage').textContent='Storage failed; export the design for a backup.';return;}
  rangedDiscoveryId=id;rangedDiscoveryName=clean;rangedExperiment=true;
  rangedSuccessKey=null;rangedRender();ranged$('rangedMessage').textContent=`Saved ${clean} (${record.stage}). ${record.approved?'Approved for this campaign.':'DM approval is still required.'} Export recipes to back up.`;
}
function rangedAdvance(){
  if(!document.body.classList.contains('dm-mode'))return;
  const b=rangedBuild(),entry=rangedCurrentDiscovery();
  if(!rangedMatchesDiscovery(b,entry))return;
  const stages=['experimental','prototype','established','mastered'];
  const current=stages.indexOf(entry.stage||'prototype');if(current<0||current===stages.length-1)return;
  const next=stages[current+1];
  if(!confirm(`DM approval: advance ${entry.name} to ${next}?`))return;
  const list=rangedDiscovered().map(item=>item.id===entry.id?{...item,stage:next,approved:['established','mastered'].includes(next)}:item);
  if(!localSave(RANGED_SAVE_KEY,list)){ranged$('rangedMessage').textContent='Could not save discovery stage.';return;}
  rangedInvalidate();rangedRender();ranged$('rangedMessage').textContent=`Recipe advanced to ${next}. Generate a new DM evaluation before the next attempt.`;
}
function initRanged(){
  rangedOptions('rangedFrame',Object.entries(rangedParts.frames).map(([id,v])=>[id,v.name]));
  rangedOptions('rangedMaterial',Object.entries(materials).map(([id,v])=>[id,v.name]));
  rangedOptions('rangedMechanism',Object.entries(rangedParts.mechanisms).map(([id,v])=>[id,v.name]));
  rangedOptions('rangedGrip',Object.entries(rangedParts.grips).map(([id,v])=>[id,v.name]));
  ['rangedFrame','rangedMaterial','rangedMechanism','rangedGrip','rangedQuality','rangedSkill','rangedDifficulty'].forEach(id=>ranged$(id).addEventListener('change',()=>{rangedInvalidate();rangedRender()}));
  ranged$('rangedNotes').addEventListener('input',()=>{rangedSuccessKey=null;rangedRender()});
  ranged$('rangedExperimentButton').addEventListener('click',()=>{rangedExperiment=true;rangedDiscoveryName='';rangedDiscoveryId=null;rangedInvalidate();rangedRender()});
  ranged$('rangedExport').addEventListener('click',rangedExport);
  ranged$('rangedGenerate').addEventListener('click',rangedGenerate);
  ranged$('rangedAttempt').addEventListener('click',rangedAttempt);
  ranged$('rangedSave').addEventListener('click',rangedSave);
  ranged$('rangedAdvance').addEventListener('click',rangedAdvance);
  rangedChoose('shortbow');
}
initRanged();
