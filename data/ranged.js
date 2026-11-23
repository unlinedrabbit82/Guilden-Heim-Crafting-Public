/* GuildenHeim ranged component recipes — D&D 5e 2014 damage/properties.
 * DEV: Add a new ranged recipe using existing frame, propulsion, grip IDs.
 * Edit component unit costs below; they are HOMEbrew abstract units.
 */
const rangedParts={
  frames:{bow:{name:'Flexible bow limbs',units:2,materials:['oak','ash','bone','mithral'],mechanisms:['string'],icon:'🏹'},crossbow:{name:'Crossbow stock and prod',units:4,materials:['oak','ash','iron','steel','mithral'],mechanisms:['trigger'],icon:'➶'},tube:{name:'Blowgun tube',units:2,materials:['oak','ash','bone','iron','steel'],mechanisms:['breath'],icon:'◎'},sling:{name:'Sling pouch',units:1,materials:['oak','ash','bone'],mechanisms:['cord'],icon:'◌'},dart:{name:'Thrown projectile',units:1,materials:['oak','ash','bone','iron','steel','mithral'],mechanisms:['hand'],icon:'➤'},net:{name:'Woven net',units:3,materials:['oak','ash'],mechanisms:['hand'],icon:'▦'}},
  mechanisms:{string:{name:'Bowstring',units:1},trigger:{name:'Trigger + string',units:2},breath:{name:'Breath-driven tube',units:1},cord:{name:'Braided sling cords',units:1},hand:{name:'Hand-thrown',units:0}},
  grips:{short:{name:'Compact grip',units:1},standard:{name:'Standard grip',units:2},long:{name:'Extended grip / stock',units:3}}
};
const rangedRecipes=[
  {id:'light_crossbow',name:'Light Crossbow',tier:'Simple',frame:'crossbow',mechanism:'trigger',grip:'standard',material:'oak',damage:'1d8',type:'Piercing',properties:['Ammunition (80/320)','Loading','Two-Handed'],ammunition:'Bolts',range:[80,320]},
  {id:'dart',name:'Dart',tier:'Simple',frame:'dart',mechanism:'hand',grip:'short',material:'iron',damage:'1d4',type:'Piercing',properties:['Finesse','Thrown (20/60)'],ammunition:'Self',range:[20,60]},
  {id:'shortbow',name:'Shortbow',tier:'Simple',frame:'bow',mechanism:'string',grip:'standard',material:'ash',damage:'1d6',type:'Piercing',properties:['Ammunition (80/320)','Two-Handed'],ammunition:'Arrows',range:[80,320]},
  {id:'sling',name:'Sling',tier:'Simple',frame:'sling',mechanism:'cord',grip:'short',material:'oak',damage:'1d4',type:'Bludgeoning',properties:['Ammunition (30/120)'],ammunition:'Sling bullets',range:[30,120]},
  {id:'blowgun',name:'Blowgun',tier:'Martial',frame:'tube',mechanism:'breath',grip:'standard',material:'ash',damage:'1',type:'Piercing',properties:['Ammunition (25/100)','Loading'],ammunition:'Blowgun needles',range:[25,100]},
  {id:'hand_crossbow',name:'Hand Crossbow',tier:'Martial',frame:'crossbow',mechanism:'trigger',grip:'short',material:'oak',damage:'1d6',type:'Piercing',properties:['Ammunition (30/120)','Light','Loading'],ammunition:'Bolts',range:[30,120]},
  {id:'heavy_crossbow',name:'Heavy Crossbow',tier:'Martial',frame:'crossbow',mechanism:'trigger',grip:'long',material:'steel',damage:'1d10',type:'Piercing',properties:['Ammunition (100/400)','Heavy','Loading','Two-Handed'],ammunition:'Bolts',range:[100,400]},
  {id:'longbow',name:'Longbow',tier:'Martial',frame:'bow',mechanism:'string',grip:'long',material:'ash',damage:'1d8',type:'Piercing',properties:['Ammunition (150/600)','Heavy','Two-Handed'],ammunition:'Arrows',range:[150,600]},
  {id:'net',name:'Net',tier:'Martial',frame:'net',mechanism:'hand',grip:'short',material:'ash',damage:'—',type:'Special',properties:['Special','Thrown (5/15)'],ammunition:'Self',range:[5,15]}
];
for(const recipe of rangedRecipes){
  const [marketCost,weightLb]=weaponStats2014[recipe.id];
  recipe.marketCost=marketCost;recipe.weightLb=weightLb;
}
