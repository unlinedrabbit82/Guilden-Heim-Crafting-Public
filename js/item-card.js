/* Shared GuildenHeim parchment item renderer.
 * DEV: Both melee and ranged pass their item data through this helper.
 * Future armor/magic categories can reuse [data-item-*] markup and this
 * function without duplicating presentation logic or any combat formulas.
 * Only pass DM-approved stats as definite; provisional values must be labeled.
 */
function renderEquipmentCard(root,item){
  if(!root)return;
  const fields={glyph:'weaponGlyph',category:'categoryLabel',name:'itemName',damage:'damageStat',damageType:'damageTypeStat',description:'itemDescription',ruling:'rulingText',market:'meleeOfficialStats'};
  for(const [field,legacyId] of Object.entries(fields)){
    const node=root.querySelector(`[data-item-${field.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())}]`)||root.querySelector(`#${legacyId}`);
    if(node)node.textContent=item[field]||'—';
  }
  const pills=root.querySelector('[data-item-properties]')||root.querySelector('#propertyPills');
  if(pills)pills.replaceChildren(...(item.properties||[]).map(property=>{
    const span=document.createElement('span');span.textContent=property;return span;
  }));
}
