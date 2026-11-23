/* GuildenHeim — data/components.js */
const heads = {
  blade:{name:'Sword blade',type:'slashing',mass:3,length:3,integrity:4,mount:'tang',glyph:'⚔',shapes:['straight','curved','broad','narrow']},
  dagger:{name:'Short blade',type:'piercing',mass:1,length:1,integrity:3,mount:'tang',glyph:'🗡',shapes:['straight','curved','narrow']},
  spear:{name:'Spearpoint',type:'piercing',mass:1.5,length:1,integrity:4,mount:'socket',glyph:'♢',shapes:['narrow','leaf','barbed']},
  hammer:{name:'Hammerhead',type:'bludgeoning',mass:4,length:1,integrity:5,mount:'socket',glyph:'⚒',shapes:['flat','flanged','spiked']},
  axe:{name:'Axehead',type:'slashing',mass:3.5,length:1.5,integrity:4,mount:'socket',glyph:'🪓',shapes:['broad','crescent','hooked']},
  mace:{name:'Mace head',type:'bludgeoning',mass:2.5,length:1,integrity:4,mount:'socket',glyph:'✣',shapes:['round','flanged','spiked']},
  poleblade:{name:'Socketed pole blade',type:'slashing',mass:3,length:2,integrity:4,mount:'socket',glyph:'⚔',shapes:['curved','broad','hooked']},
  staff:{name:'Staff end',type:'bludgeoning',mass:.5,length:1,integrity:3,mount:'socket',glyph:'⌁',shapes:['round','reinforced']}
};
const handles = {
  grip:{name:'One-handed grip',mass:1,length:2,integrity:3,hands:1},
  short:{name:'Short grip',mass:.6,length:1,integrity:3,hands:1},
  pole:{name:'Long shaft',mass:2.2,length:5,integrity:3,hands:2},
  haft:{name:'Reinforced haft',mass:1.8,length:3,integrity:4,hands:2},
  great:{name:'Two-handed hilt',mass:1.5,length:3,integrity:4,hands:2}
};
const sizeMultiplier={short:.65,small:.75,medium:1,long:1.4,large:1.55};
