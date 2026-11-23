/* GuildenHeim — data/components.js */
/* DEV: Add a head to `heads` with `type`, `mass`, `length`, `integrity`,
 * `mount`, `glyph`, and `shapes`. Add handles to `handles` with mass/length,
 * integrity and hands. A new head also needs matching recipe definitions
 * (recipes.js) if you want it available as a standard blueprint.
 * Keep mount values compatible with the options in js/app.js.
 */
const heads = {
  blade:{name:'Sword blade',type:'slashing',mass:3,length:3,integrity:4,mount:'tang',glyph:'⚔',shapes:['straight','curved','broad','narrow']},
  dagger:{name:'Short blade',type:'piercing',mass:1,length:1,integrity:3,mount:'tang',glyph:'🗡',shapes:['straight','curved','narrow']},
  spear:{name:'Spearpoint',type:'piercing',mass:1.5,length:1,integrity:4,mount:'socket',glyph:'♢',shapes:['narrow','leaf','barbed']},
  hammer:{name:'Hammerhead',type:'bludgeoning',mass:4,length:1,integrity:5,mount:'socket',glyph:'⚒',shapes:['flat','flanged','spiked']},
  axe:{name:'Axehead',type:'slashing',mass:3.5,length:1.5,integrity:4,mount:'socket',glyph:'🪓',shapes:['broad','crescent','hooked']},
  mace:{name:'Mace head',type:'bludgeoning',mass:2.5,length:1,integrity:4,mount:'socket',glyph:'✣',shapes:['round','flanged','spiked']},
  poleblade:{name:'Socketed pole blade',type:'slashing',mass:3,length:2,integrity:4,mount:'socket',glyph:'⚔',shapes:['curved','broad','hooked']},
  staff:{name:'Staff end',type:'bludgeoning',mass:.5,length:1,integrity:3,mount:'socket',glyph:'⌁',shapes:['round','reinforced']}
  ,flail:{name:'Chain-linked striking head',type:'bludgeoning',mass:2.5,length:1.5,integrity:3,mount:'socket',glyph:'✣',shapes:['round','spiked']}
  ,pick:{name:'Piercing pick head',type:'piercing',mass:2.5,length:1.5,integrity:4,mount:'socket',glyph:'⚒',shapes:['narrow','spiked']}
  ,whip:{name:'Flexible lash',type:'slashing',mass:1,length:3,integrity:3,mount:'lashing',glyph:'〰',shapes:['braided','barbed']}
};
const handles = {
  grip:{name:'One-handed grip',mass:1,length:2,integrity:3,hands:1},
  short:{name:'Short grip',mass:.6,length:1,integrity:3,hands:1},
  pole:{name:'Long shaft',mass:2.2,length:5,integrity:3,hands:2},
  haft:{name:'Reinforced haft',mass:1.8,length:3,integrity:4,hands:2},
  great:{name:'Two-handed hilt',mass:1.5,length:3,integrity:4,hands:2}
  ,flexible:{name:'Flexible grip',mass:.5,length:1,integrity:3,hands:1}
};
const sizeMultiplier={short:.65,small:.75,medium:1,long:1.4,large:1.55};
/* DEV: Component descriptions appear in contextual help automatically. */
const headDescriptions={
  blade:'A versatile forged blade. Its shape and length influence the closest standard sword reference.',
  dagger:'A compact blade suited to smaller piercing or cutting designs.',
  spear:'A pointed head designed for mounting on a shaft. Commonly suited to thrusting weapons.',
  hammer:'A solid striking head intended to deliver bludgeoning force.',
  axe:'A weighted cutting head. Its mass affects leverage and handling.',
  mace:'A compact striking head with blunt, flanged, or spiked forms.',
  poleblade:'A long blade mounted on a pole, suitable for experimental reach weapons.',
  staff:'A simple wooden or reinforced striking end used in clubs and staves.',
  flail:'A flexible chain-linked striking head. The connection introduces handling considerations.',
  pick:'A narrow pointed head intended to concentrate force into a piercing strike.',
  whip:'A flexible lash designed for extended reach rather than heavy impact.'
};
const handleDescriptions={
  grip:'A balanced one-handed grip, suited to many swords and compact striking weapons.',
  short:'A short grip for small weapons, with less room for leverage or counterweights.',
  pole:'A long shaft that extends the weapon, often creating a two-handed construction.',
  haft:'A reinforced handle intended to support heavier striking heads.',
  great:'A long two-handed hilt used with large blades and heavy weapons.',
  flexible:'A compact handle suitable for a flexible lash.'
};
for(const [id,item] of Object.entries(heads))item.description=headDescriptions[id];
for(const [id,item] of Object.entries(handles))item.description=handleDescriptions[id];
