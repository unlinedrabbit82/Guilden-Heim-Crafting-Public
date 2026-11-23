/* GuildenHeim v0.9.2 — contextual field help.
 * DEV: Component descriptions live beside data definitions; fixed option
 * descriptions and metric explanations are below. All text uses textContent,
 * never executable HTML. Help can be hovered, clicked, focused, or dismissed.
 */
const helpFixed={
  sizes:{small:'A compact component requiring fewer abstract materials.',medium:'A standard-sized component used in many established recipes.',large:'An oversized component with increased leverage, mass, and material cost.',short:'A shorter segment that reduces length and material needs.',long:'An extended segment that increases length and materials.'},
  shapes:{straight:'A straight profile used by conventional blades and shafts.',curved:'An arcing cutting profile. It does not automatically grant special combat effects.',broad:'A wide profile that emphasizes cutting area over a narrow point.',narrow:'A narrow profile suited to concentrated piercing designs.',leaf:'A leaf-shaped spear point with a wider central section.',barbed:'A pointed profile with projecting hooks; exact effects require DM approval.',flat:'A flat striking surface designed for blunt impact.',flanged:'Raised ridges concentrate impact across smaller contact points.',spiked:'Projections create a concentrated striking or piercing surface.',crescent:'A curved cutting edge typical of some axe designs.',hooked:'A hooked edge suited to experimental gripping or polearm designs.',round:'A rounded striking or support shape.',reinforced:'Additional structural reinforcement, usually requiring extra fabrication.',braided:'A woven flexible form that distributes tension.'},
  mounts:{tang:'A narrow extension of the head fitted into a grip or hilt.',socket:'A hollow fitting attaches a head around a supporting shaft.',lashing:'Bindings hold the components together; this often requires DM review.'},
  pommels:{none:'No counterweight is installed.',iron:'A small iron counterweight helps balance some grip designs.',heavy:'A larger counterweight changes handling and raises total material cost.'},
  quality:{crude:'Rough assembly. Easier to produce, but may reduce crafting reliability.',standard:'Ordinary craftsmanship; the baseline for most familiar recipes.',fine:'Greater care raises complexity and may improve the finished construction.',masterwork:'Exceptional workmanship requiring greater effort. It does not automatically grant attack, damage, or AC bonuses.'},
  skill:{'0':'Untrained crafter; no proficiency-based crafting savings.','1':'Apprentice crafter; small improvements to cost, time, and success.','2':'Journeyman; growing familiarity with workshop techniques.','3':'Skilled; substantial practical crafting experience.','4':'Expert; efficient and dependable work.','5':'Master; maximum current homebrew crafting proficiency.'},
  difficulty:{'-1':'Easy task or well-prepared working conditions.','0':'Normal workshop conditions and an ordinary recipe.','1':'Hard task requiring unusual accuracy or challenging construction.','2':'Extreme task with severe complexity or special constraints.'}
};
const helpFields={
  headSelect:{title:'Primary component',text:v=>heads[v]?.description},
  headMaterial:{title:'Head material',text:materialText},
  headSize:{title:'Head size',text:v=>helpFixed.sizes[v]},
  headShape:{title:'Head shape',text:v=>helpFixed.shapes[v]},
  handleSelect:{title:'Handle component',text:v=>handles[v]?.description},
  handleMaterial:{title:'Handle material',text:materialText},
  handleSize:{title:'Handle size',text:v=>helpFixed.sizes[v]},
  mountSelect:{title:'Attachment method',text:v=>helpFixed.mounts[v]},
  pommelSelect:{title:'Counterweight',text:v=>helpFixed.pommels[v]},
  qualitySelect:{title:'Workmanship',text:v=>helpFixed.quality[v]},
  techniqueSelect:{title:'Crafting technique',text:v=>craftingTechniques[v]?.description},
  skillLevel:{title:'Crafter skill',text:v=>helpFixed.skill[v]},
  difficultyLevel:{title:'DM difficulty',text:v=>helpFixed.difficulty[v]},
  materialEditorSelect:{title:'Material ratings',text:materialText},
  rangedFrame:{title:'Ranged frame',text:v=>rangedParts.frames[v]?.description},
  rangedMaterial:{title:'Main material',text:materialText},
  rangedMechanism:{title:'Propulsion mechanism',text:v=>rangedParts.mechanisms[v]?.description},
  rangedGrip:{title:'Grip or stock',text:v=>rangedParts.grips[v]?.description},
  rangedQuality:{title:'Workmanship',text:v=>helpFixed.quality[v]},
  rangedSkill:{title:'Crafter skill',text:v=>helpFixed.skill[v]},
  rangedDifficulty:{title:'DM difficulty',text:v=>helpFixed.difficulty[v]},
  armorShell:{title:'Armor shell',text:v=>armorShells[v]?.description},
  armorMaterial:{title:'Primary material',text:materialText},
  armorLining:{title:'Lining',text:v=>armorLinings[v]?.description},
  armorFastening:{title:'Fastening',text:v=>armorFastenings[v]?.description},
  armorReinforcement:{title:'Reinforcement',text:v=>armorReinforcements[v]?.description},
  armorQuality:{title:'Workmanship',text:v=>helpFixed.quality[v]},
  armorSkill:{title:'Crafter skill',text:v=>helpFixed.skill[v]},
  armorDifficulty:{title:'DM difficulty',text:v=>helpFixed.difficulty[v]},
  armorDex:{title:'Dexterity modifier',text:()=>"The wearer's Dexterity modifier is used only for an example 2014 Armor Class calculation; it doesn't change crafting skill."}
};
function materialText(id){
  const m=materials[id];if(!m)return 'Choose a known material.';
  return `${m.help||m.description} Reference mass ×${m.mass}, integrity ${m.integrity}/5. Workability ${rating(id,'workability')}/10 (homebrew).`;
}
const helpMetrics={
  massStat:'Homebrew mass score computed from parts, size, material multipliers, and counterweights. Not the official equipment weight in pounds.',
  lengthStat:'Abstract overall length reference. It does not automatically grant the Reach weapon property.',
  integrityStat:'Homebrew structural rating from component durability and joints. It is not a hit-point or Armor Class bonus.',
  handlingStat:'Homebrew control score influenced by leverage and counterweights; not a bonus to attack rolls.',
  costStat:'Adjusted abstract material units after crafter skill. This is not a gold-piece market price.',
  chanceStat:'Homebrew success probability for the DM-approved crafting attempt.',
  timeStat:'Estimated in-game crafting duration after complexity and skill adjustments. Very short results assume prepared components.',
  rangedMass:'Abstract ranged-assembly mass, not 2014 pounds.',
  rangedLength:'Abstract ranged-assembly length, not automatic weapon range.',
  rangedIntegrity:'Homebrew durability reference. It does not add weapon damage.',
  rangedHandling:'Homebrew handling reference used for DM assessment.',
  rangedCost:'Abstract material-unit cost after crafter proficiency, separate from official market price.',
  rangedChance:'Homebrew success chance for a ranged crafting attempt.',
  rangedTime:'In-game crafting estimate; prepared parts are assumed for quick work.',
  armorMass:'Homebrew material mass reference, separate from the official armor weight.',
  armorCoverage:'Abstract coverage score from 1–5. It does not directly determine official AC.',
  armorIntegrity:'Homebrew armor construction strength, not additional Armor Class.',
  armorMobility:'Abstract freedom-of-movement score, not an official movement-speed modifier.',
  armorCost:'Abstract material units adjusted for crafting skill.',
  armorChance:'Homebrew chance for the DM to resolve the crafting attempt.',
  armorTime:'Estimated crafting time from item size, complexity, and skill.',
  armorAC:'Official 2014 AC formula for matching recipes; an experiment displays only a comparison.',
  armorStrength:'Some heavy armor reduces speed if the wearer does not meet this requirement.',
  armorStealth:'Whether the standard armor imposes disadvantage on Dexterity (Stealth) checks.'
};
const materialRatingHelp={
  hardness:'Homebrew resistance to surface deformation. It is not a direct bonus to damage or Armor Class.',
  toughness:'Homebrew resistance to cracking or breaking under stress.',
  flexibility:'Homebrew ability to bend without breaking; useful when judging bows and other flexible parts.',
  magic:'Homebrew magical affinity used by some discovery tags. It is not a 2014 spellcasting statistic.',
  workability:'Homebrew crafting difficulty; higher values make the material more challenging to work with.'
};
function createHelpControl(title,getDescription){
  const holder=document.createElement('span');holder.className='help-holder';
  const button=document.createElement('button');button.type='button';button.className='help-button';button.setAttribute('aria-label',`Explain ${title}`);button.setAttribute('aria-expanded','false');button.textContent='?';
  const content=document.createElement('span');content.className='help-tooltip';content.setAttribute('role','tooltip');
  const heading=document.createElement('strong');heading.textContent=title;
  const description=document.createElement('span');description.className='help-description';
  content.append(heading,description);holder.append(button,content);
  const refresh=()=>{description.textContent=getDescription()||'This option is a campaign reference; the DM determines its final effect.';};
  holder.addEventListener('mouseenter',refresh);
  holder.addEventListener('focusin',refresh);
  button.addEventListener('click',event=>{
    event.preventDefault();event.stopPropagation();
    const open=holder.classList.contains('open');
    document.querySelectorAll('.help-holder.open').forEach(el=>{el.classList.remove('open');el.querySelector('button')?.setAttribute('aria-expanded','false');});
    if(!open){refresh();holder.classList.add('open');button.setAttribute('aria-expanded','true');}
  });
  return {holder,refresh};
}
function installHelp(){
  // Controls may be built dynamically by app.js. This file loads after init().
  for(const [id,rule] of Object.entries(helpFields)){
    const input=document.getElementById(id);if(!input)continue;
    const label=document.querySelector(`label[for="${id}"]`)||input.closest('label');
    if(!label||label.dataset.hasHelp)continue;
    label.dataset.hasHelp='true';label.classList.add('has-tooltip');
    const {holder,refresh}=createHelpControl(rule.title,()=>rule.text(input.value));
    label.insertAdjacentElement('afterend',holder);
    input.addEventListener('change',refresh);
  }
  // Key output metrics also receive help, but no popups obscure the results.
  for(const [id,description] of Object.entries(helpMetrics)){
    const value=document.getElementById(id);if(!value)continue;
    const label=value.parentElement?.querySelector('span,small');if(!label||label.querySelector('.help-holder'))continue;
    const {holder}=createHelpControl(label.textContent.trim(),()=>description);
    label.append(holder);label.classList.add('metric-help-label');
  }
  installMaterialRatingHelp();
  document.addEventListener('click',event=>{
    if(event.target.closest('.help-holder'))return;
    document.querySelectorAll('.help-holder.open').forEach(holder=>{holder.classList.remove('open');const button=holder.querySelector('button');button?.setAttribute('aria-expanded','false');button?.blur();});
  });
  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape')return;
    document.querySelectorAll('.help-holder.open').forEach(holder=>{holder.classList.remove('open');const button=holder.querySelector('button');button?.setAttribute('aria-expanded','false');button?.blur();});
  });
}
function installMaterialRatingHelp(){
  const area=document.getElementById('materialEditorFields');if(!area)return;
  for(const input of area.querySelectorAll('input[data-rating]')){
    const label=input.closest('label'),key=input.dataset.rating;
    if(!label||label.dataset.hasHelp||!materialRatingHelp[key])continue;
    label.dataset.hasHelp='true';
    const {holder}=createHelpControl(key[0].toUpperCase()+key.slice(1),()=>materialRatingHelp[key]);
    label.insertBefore(holder,input);
  }
}
installHelp();
