/* GuildenHeim v0.6 crafting techniques — homebrew reference values. */
/* DEV: Each technique ID must remain unique. `integrity` / `handling` are
 * direct reference score changes; `complexity` affects the success chance,
 * `hours` adds crafting time, and `materials` adds abstract unit requirements.
 * Use {headMaterial:1} to add one unit of the selected head material.
 * Technique tags are emitted by classifyWeapon() as `technique:<id>`.
 */
const craftingTechniques = {
  none:{name:'Standard construction',description:'No specialized technique.',integrity:0,handling:0,complexity:0,hours:0,materials:{}},
  tempering:{name:'Tempering',description:'Heat treatment improves structural resilience.',integrity:1,handling:0,complexity:1,hours:4,materials:{}},
  reinforcement:{name:'Reinforcement',description:'Extra supports strengthen a weak build or joint.',integrity:2,handling:0,complexity:1,hours:4,materials:{iron:2}},
  precision:{name:'Precision forging',description:'Careful manufacture improves handling consistency.',integrity:0,handling:1,complexity:2,hours:4,materials:{}},
  balancing:{name:'Weight balancing',description:'Redistribution of weight improves control.',integrity:0,handling:1,complexity:1,hours:4,materials:{}},
  lamination:{name:'Lamination',description:'Bonded layers strengthen the head at higher complexity.',integrity:1,handling:0,complexity:2,hours:6,materials:{headMaterial:1}},
  specialized_mount:{name:'Specialized mounting',description:'An adapter allows unconventional head-to-handle connections.',integrity:0,handling:0,complexity:2,hours:6,materials:{iron:2}}
};
