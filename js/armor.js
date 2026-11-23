/* GuildenHeim v0.9 Armor / Shields.
 * DEV: Official 2014 values are in data/armor.js; NEVER derive official AC
 * bonuses from material scores or workmanship. Crafting is homebrew.
 */
const armor$=id=>document.getElementById(id);
const ARMOR_SAVE_KEY='guildenheim_armor_discoveries_v1';
let armorSelected='leather',armorExperiment=false,armorDiscoveryId=null,armorDiscoveryName='',armorSuccessKey=null;
const armorQualityUnits={crude:0,standard:0,fine:1,masterwork:2};
function armorDiscoveries(){const entries=localJSON(ARMOR_SAVE_KEY,[]);return Array.isArray(entries)?entries:[];}
function armorDiscovery(){return armorDiscoveries().find(entry=>entry.id===armorDiscoveryId);}
function armorOptions(id,entries){const el=armor$(id);el.replaceChildren(...entries.map(([key,label])=>{const o=document.createElement('option');o.value=key;o.textContent=label;return o;}));}
function armorBuild(){return {shell:armor$('armorShell').value,material:armor$('armorMaterial').value,lining:armor$('armorLining').value,fastening:armor$('armorFastening').value,reinforcement:armor$('armorReinforcement').value,quality:armor$('armorQuality').value,notes:armor$('armorNotes').value.trim()};}
function armorRecipe(){return armorRecipes.find(item=>item.id===armorSelected);}
function armorMatches(b,entry){return !!entry&&['shell','material','lining','fastening','reinforcement','quality','notes'].every(k=>(b[k]||'')===(entry.build?.[k]||''));}
function armorExact(b){const r=armorRecipe();return !armorExperiment&&!!r&&['shell','material','lining','fastening','reinforcement'].every(k=>r[k]===b[k]);}
function armorAssessment(b,level=0){
  const shell=armorShells[b.shell],reasons=[];
  if(!shell)throw new Error(`Unknown armor shell: ${b.shell}`);
  const chosenMaterial=materials[b.material];
  const compatible=shell.materials.includes(b.material);
  if(!compatible)reasons.push(`${chosenMaterial?.name||'Unknown material'} does not suit ${shell.name.toLowerCase()} without a custom DM-approved construction.`);
  if(b.shell==='plate'&&b.fastening==='straps')reasons.push('Articulated plates need proper joints and reinforced fasteners.');
  if(['chain_mail','splint','plate'].includes(b.shell)&&b.lining==='none')reasons.push('Heavy equipment needs a protective lining for extended wear.');
  if(b.shell==='shield'&&b.fastening==='rivets')reasons.push('A shield also needs a usable handgrip, which the DM should confirm.');
  const invalid=!compatible;
  const status=invalid?'invalid':reasons.length?'conditional':'valid';
  const materialCosts={};
  const add=(key,n)=>{if(n>0)materialCosts[key]=(materialCosts[key]||0)+n;};
  add(b.material,shell.units);
  add(b.lining==='none'?b.material:b.lining,armorLinings[b.lining].units);
  add(b.fastening==='straps'?'leather':'iron',armorFastenings[b.fastening].units);
  add(b.reinforcement==='none'?b.material:b.material,armorReinforcements[b.reinforcement].units);
  add(b.material,armorQualityUnits[b.quality]||0);
  const ingredients=Object.entries(materialCosts).map(([id,base])=>({id,base,quantity:Math.max(1,Math.ceil(base*(1-.05*level)))}));
  const units=ingredients.reduce((sum,item)=>sum+item.quantity,0),base=Object.values(materialCosts).reduce((sum,n)=>sum+n,0);
  const mass=Number((base*materials[b.material].mass).toFixed(1));
  const coverage={padded:2,leather:2,studded:2,hide:3,chain_shirt:3,scale:4,breastplate:3,half_plate:4,ring_mail:4,chain_mail:5,splint:5,plate:5,shield:2}[b.shell];
  const structural=Math.min(5,Math.max(1,materials[b.material].integrity+(b.reinforcement==='joints'?1:b.reinforcement==='edges'?1:0)+(b.quality==='masterwork'?1:0)-(status==='conditional'?1:0)-(invalid?2:0)));
  const mobility=Math.min(5,Math.max(1,6-coverage+(b.material==='mithral'?1:0)-(status==='invalid'?2:0)));
  return {status,reasons:reasons.length?reasons:['Shell, lining, and fasteners are plausible under the simplified compatibility rules.'],ingredients,units,base,mass,coverage,structural,mobility};
}
function armorReference(b){return armorExact(b)?armorRecipe():armorRecipes.find(item=>item.shell===b.shell)||armorRecipes[0];}
function armorOutcome(b,a,level,difficulty){
  const entry=armorDiscovery(),matching=armorMatches(b,entry),mastered=matching&&entry?.stage==='mastered'&&entry.approved;
  const experimental=!armorExact(b)&&!(matching&&entry.approved);
  const complexity=Math.max(0,(experimental?2:0)+(a.status==='conditional'?2:0)+(b.quality==='fine'?1:b.quality==='masterwork'?2:0)+Math.max(-1,difficulty)+rating(b.material,'workability')-(mastered?1:0));
  const chance=a.status==='invalid'?0:Math.max(5,Math.min(95,70+level*6-complexity*10-(b.quality==='crude'?5:0)+(mastered?5:0)));
  const time=calculateCraftingTime({size:armorShells[b.shell].size,complexity,skill:level,mastered});
  return {chance,time,ingredients:armorAssessment(b,level).ingredients};
}
function armorACDescription(recipe){
  if(recipe.category==='Shield')return '+2 AC (added to worn armor)';
  if(recipe.dexCap===null)return `${recipe.baseAC} + Dex modifier`;
  if(recipe.dexCap===0)return `${recipe.baseAC}`;
  return `${recipe.baseAC} + Dex modifier (max ${recipe.dexCap})`;
}
function armorACValue(recipe,dex){
  if(recipe.category==='Shield')return '+2 AC';
  return String(recipe.baseAC+(recipe.dexCap===0?0:recipe.dexCap===null?dex:Math.min(dex,recipe.dexCap)));
}
function armorKey(b){return JSON.stringify([b,armor$('armorSkill').value,armor$('armorDifficulty').value]);}
function armorInvalidate(){armorSuccessKey=null;document.body.classList.remove('evaluated');armor$('armorMessage').textContent='';}
function armorList(){
  armor$('armorRecipeList').replaceChildren(...armorRecipes.map(recipe=>{
    const button=document.createElement('button');button.type='button';button.className='recipe-button'+(!armorExperiment&&armorSelected===recipe.id?' active':'');
    const icon=document.createElement('span');icon.className='recipe-icon';icon.textContent=recipe.category==='Shield'?'⬟':'⬡';
    const wrapper=document.createElement('span'),title=document.createElement('strong'),detail=document.createElement('small');title.textContent=recipe.name;detail.textContent=recipe.category+' · '+armorACDescription(recipe);wrapper.append(title,detail);button.append(icon,wrapper);
    button.addEventListener('click',()=>armorChoose(recipe.id));return button;
  }));
  const saved=armorDiscoveries();armor$('armorDiscoveryCount').textContent=saved.length;
  armor$('armorDiscoveryList').replaceChildren(...saved.map(entry=>{
    const btn=document.createElement('button');btn.type='button';btn.className='recipe-button'+(armorDiscoveryId===entry.id?' active':'');
    const title=document.createElement('span');const strong=document.createElement('strong');strong.textContent=entry.name;const detail=document.createElement('small');detail.textContent=entry.stage||'prototype';title.append(strong,detail);btn.append(title);
    btn.addEventListener('click',()=>{
      const b=entry.build||{};if(!armorShells[b.shell]||!materials[b.material]||!armorLinings[b.lining]||!armorFastenings[b.fastening]||!armorReinforcements[b.reinforcement])return;
      armorExperiment=true;armorDiscoveryId=entry.id;armorDiscoveryName=entry.name;
      for(const [id,v] of [['armorShell',b.shell],['armorMaterial',b.material],['armorLining',b.lining],['armorFastening',b.fastening],['armorReinforcement',b.reinforcement],['armorQuality',b.quality]])armor$(id).value=v;
      armor$('armorNotes').value=b.notes||'';armorInvalidate();armorRender();
    });return btn;
  }));
}
function armorChoose(id){
  const recipe=armorRecipes.find(r=>r.id===id);if(!recipe)return;
  armorSelected=id;armorExperiment=false;armorDiscoveryId=null;armorDiscoveryName='';
  for(const [key,val] of [['armorShell',recipe.shell],['armorMaterial',recipe.material],['armorLining',recipe.lining],['armorFastening',recipe.fastening],['armorReinforcement',recipe.reinforcement],['armorQuality','standard']]){
    const select=armor$(key);select.value=val;
    if(select.value!==val)throw new Error(`Armor blueprint ${id} requires missing option ${key}=${val}. Verify the data files were uploaded together.`);
  }
  armor$('armorNotes').value='';armorInvalidate();armorRender();
}
function armorRender(){
  const b=armorBuild(),a=armorAssessment(b),reference=armorReference(b),exact=armorExact(b),entry=armorDiscovery();
  const level=Number(armor$('armorSkill').value||0),difficulty=Number(armor$('armorDifficulty').value||0),result=armorOutcome(b,a,level,difficulty);
  armor$('armorBreadcrumb').textContent=(armorExperiment?'EXPERIMENT':reference.name).toUpperCase();
  armor$('armorTitle').textContent=armorExperiment?(armorDiscoveryName||'Experimental armor design'):`${reference.name} blueprint`;
  armor$('armorModeBadge').textContent=exact?'KNOWN RECIPE':'PROVISIONAL BUILD';
  armor$('armorValidity').className=a.status;
  armor$('armorValidity').textContent=({valid:'✓ Valid construction',conditional:'! Conditionally valid — DM review required',invalid:'× Invalid assembly'})[a.status];
  armor$('armorMaterialList').replaceChildren(...a.ingredients.map(row=>{const li=document.createElement('li');li.textContent=`${materials[row.id].name}: ${row.base} unit${row.base===1?'':'s'}`;return li;}));
  armorList();
  armor$('armorMass').textContent=`${a.mass} units`;armor$('armorCoverage').textContent=`${a.coverage} / 5`;
  armor$('armorIntegrity').textContent=`${a.structural} / 5`;armor$('armorMobility').textContent=`${a.mobility} / 5`;
  armor$('armorCompatibility').className=a.status;armor$('armorCompatibility').textContent=({valid:'✓ Construction looks viable',conditional:'! Requires DM review',invalid:'× Incompatible as assembled'})[a.status];
  const reasons=[...a.reasons,exact?`Matching 2014 blueprint: ${reference.name}.`:`Nearest 2014 armor reference: ${reference.name}. AC remains unapproved for this custom design.`];
  if(entry)reasons.push(`Discovery stage: ${entry.stage||'prototype'}. ${entry.approved?'DM approved.':'Awaiting DM approval.'}`);
  armor$('armorReasons').replaceChildren(...reasons.map(s=>{const li=document.createElement('li');li.textContent=s;return li;}));
  const units=result.ingredients.reduce((sum,r)=>sum+r.quantity,0);
  armor$('armorCost').textContent=`${units} units`;armor$('armorChance').textContent=`${result.chance}%`;armor$('armorTime').textContent=result.time.label;
  armor$('armorDice').textContent=result.chance===0?'No roll for an invalid assembly.':`Roll 1d100: succeed on 01–${String(result.chance).padStart(2,'0')}; d20 approximation: ${Math.round(result.chance/5)===0?'no successful faces':`roll ${21-Math.round(result.chance/5)}–20`} (${Math.round(result.chance/5)*5}%).`;
  const dex=Math.max(-5,Math.min(10,Math.trunc(Number(armor$('armorDex').value)||0)));
  armor$('armorAC').textContent=exact?armorACDescription(reference):`${armorACDescription(reference)}*`;
  armor$('armorACExample').textContent=exact?`At Dex modifier ${dex>=0?'+':''}${dex}: ${armorACValue(reference,dex)}.${reference.category==='Shield'?' Add the shield bonus to existing AC.':''}`:'* Reference formula only — custom armor AC requires the DM to decide.';
  armor$('armorStrength').textContent=exact?(reference.strength?`Str ${reference.strength}`:'None'):(reference.strength?`Str ${reference.strength}*`:'None*');
  armor$('armorStealth').textContent=exact?(reference.stealth?'Disadvantage':'None'):(reference.stealth?'Disadvantage*':'None*');
  const donDoff={Light:['1 minute','1 minute'],Medium:['5 minutes','1 minute'],Heavy:['10 minutes','5 minutes'],Shield:['1 action','1 action']}[reference.category];
  armor$('armorDon').textContent=donDoff[0]+(exact?'':'*');
  armor$('armorDoff').textContent=donDoff[1]+(exact?'':'*');
  const approved=exact||(entry?.approved&&armorMatches(b,entry));
  renderEquipmentCard(armor$('armorItemCard'),{
    glyph:reference.category==='Shield'?'⬟':'⬡',category:exact?`${reference.category.toUpperCase()} ${reference.category==='Shield'?'':'ARMOR'}`:approved?'DM-APPROVED HOMEBREW ARMOR':'PROVISIONAL HOMEBREW ARMOR',
    name:exact?reference.name:(armorDiscoveryName||`${materials[b.material].name} ${armorShells[b.shell].name}`),
    properties:exact?[reference.category==='Shield'?'Shield bonus +2 AC':reference.category+' armor',reference.stealth?'Stealth disadvantage':'No stealth penalty']:[`Closest reference: ${reference.name}*`],
    market:exact?`2014 market price: ${reference.marketCost} · Official weight: ${reference.weightLb} lb.`:`Comparison only: ${reference.name} · ${reference.marketCost} · ${reference.weightLb} lb.`,
    description:`${materials[b.material].name} ${armorShells[b.shell].name.toLowerCase()} with ${armorLinings[b.lining].name.toLowerCase()}, ${armorFastenings[b.fastening].name.toLowerCase()}, and ${armorReinforcements[b.reinforcement].name.toLowerCase()}.${b.notes?' Notes: '+b.notes:''}`,
    ruling:exact?`Matches the 2014 equipment baseline. ${reference.strength?`If the wearer has less than Strength ${reference.strength}, heavy armor normally reduces speed by 10 feet. `:''}Armor proficiency still applies. Crafting material costs, time, and success are homebrew.`:approved?'This recipe is DM-approved, but material changes do not automatically alter official AC.':'* Armor Class and other equipment statistics are only a reference until the DM approves this design.'
  });
  armor$('armorAttempt').disabled=a.status==='invalid';
  armor$('armorSave').disabled=a.status==='invalid'||armorSuccessKey!==armorKey(b);
  const stage=entry?.stage||'prototype';
  armor$('armorAdvance').disabled=!entry||stage==='mastered'||!armorMatches(b,entry);
  armor$('armorAdvance').textContent=entry?`Advance: ${stage==='mastered'?'Mastered':stage==='prototype'?'Prototype → Established':stage==='established'?'Established → Mastered':'Experimental → Prototype'}`:'Advance recipe stage';
}
function armorExport(){
  const b=armorBuild(),a=armorAssessment(b);const body={format:'guildenheim-armor-design',version:1,blueprint:armorExperiment?'Experiment':armorRecipe().name,components:b,baseMaterialUnits:a.base,validity:a.status};
  const blob=new Blob([JSON.stringify(body,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='guildenheim-armor-player-design.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function armorGenerate(){
  if(!document.body.classList.contains('dm-mode'))return;
  if(armor$('armorSkill').value===''||armor$('armorDifficulty').value===''){alert('Enter skill and difficulty first.');return;}
  if(!Number.isInteger(Number(armor$('armorDex').value))||Number(armor$('armorDex').value)<-5||Number(armor$('armorDex').value)>10){alert('Dexterity modifier must be a whole number from -5 to 10.');return;}
  armorSuccessKey=null;document.body.classList.add('evaluated');armorRender();armor$('armorMessage').textContent='DM evaluation generated. Attempt crafting to record a discovery.';
}
function armorAttempt(){
  if(!document.body.classList.contains('dm-mode')||!document.body.classList.contains('evaluated'))return;
  const b=armorBuild(),a=armorAssessment(b);if(a.status==='invalid')return;
  const result=armorOutcome(b,a,Number(armor$('armorSkill').value),Number(armor$('armorDifficulty').value));
  const roll=1+Math.floor(Math.random()*100),success=roll<=result.chance;
  armorSuccessKey=success?armorKey(b):null;armorRender();
  armor$('armorMessage').textContent=`${success?'Success':'Failure'}: rolled ${roll} against ${result.chance}%. Crafting time: ${result.time.label}. The DM decides whether a failed attempt consumes materials.`;
}
function armorSave(){
  if(!document.body.classList.contains('dm-mode')||!document.body.classList.contains('evaluated'))return;
  const b=armorBuild();if(armorSuccessKey!==armorKey(b))return;
  const text=prompt('Name this discovered armor recipe:',`${materials[b.material].name} ${armorShells[b.shell].name}`);if(text===null)return;
  const name=text.trim().slice(0,70);if(!name)return;
  const before=armorDiscoveries(),entry=armorDiscovery(),same=armorMatches(b,entry);
  const id=same?entry.id:`armor_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
  const record={id,name,build:b,stage:same?(entry.stage||'prototype'):'prototype',approved:same?!!entry.approved:false,createdAt:same?entry.createdAt:new Date().toISOString()};
  const updated=same?before.map(item=>item.id===id?record:item):[...before,record];
  if(!localSave(ARMOR_SAVE_KEY,updated.slice(-200))){armor$('armorMessage').textContent='Could not save discovery. Export the player design as a backup.';return;}
  armorDiscoveryId=id;armorDiscoveryName=name;armorExperiment=true;armorSuccessKey=null;armorRender();armor$('armorMessage').textContent=`Saved ${name} as ${record.stage}. Export DM recipes to back it up.`;
}
function armorAdvance(){
  if(!document.body.classList.contains('dm-mode'))return;
  const entry=armorDiscovery();if(!armorMatches(armorBuild(),entry))return;
  const stages=['experimental','prototype','established','mastered'],i=stages.indexOf(entry.stage||'prototype');if(i<0||i>=stages.length-1)return;
  const next=stages[i+1];if(!confirm(`DM approval: advance ${entry.name} to ${next}?`))return;
  if(!localSave(ARMOR_SAVE_KEY,armorDiscoveries().map(r=>r.id===entry.id?{...r,stage:next,approved:['established','mastered'].includes(next)}:r))){armor$('armorMessage').textContent='Could not save approval.';return;}
  armorInvalidate();armorRender();armor$('armorMessage').textContent=`Advanced to ${next}. Generate another DM evaluation before the next attempt.`;
}
function initArmor(){
  armorOptions('armorShell',Object.entries(armorShells).map(([id,v])=>[id,v.name]));
  armorOptions('armorMaterial',Object.entries(materials).map(([id,v])=>[id,v.name]));
  armorOptions('armorLining',Object.entries(armorLinings).map(([id,v])=>[id,v.name]));
  armorOptions('armorFastening',Object.entries(armorFastenings).map(([id,v])=>[id,v.name]));
  armorOptions('armorReinforcement',Object.entries(armorReinforcements).map(([id,v])=>[id,v.name]));
  ['armorShell','armorMaterial','armorLining','armorFastening','armorReinforcement','armorQuality','armorSkill','armorDifficulty','armorDex'].forEach(id=>armor$(id).addEventListener('change',()=>{armorInvalidate();armorRender()}));
  armor$('armorNotes').addEventListener('input',()=>{armorSuccessKey=null;armorRender()});
  armor$('armorExperimentButton').addEventListener('click',()=>{armorExperiment=true;armorDiscoveryId=null;armorDiscoveryName='';armorInvalidate();armorRender()});
  armor$('armorExport').addEventListener('click',armorExport);
  armor$('armorGenerate').addEventListener('click',armorGenerate);
  armor$('armorAttempt').addEventListener('click',armorAttempt);
  armor$('armorSave').addEventListener('click',armorSave);
  armor$('armorAdvance').addEventListener('click',armorAdvance);
  armorChoose('leather');
}
initArmor();
