/* GuildenHeim v0.9: campaign-scale crafting durations, NOT official 2014 rules.
 * DEV: Change baseline seconds here to rebalance campaign pacing globally.
 * A turn/round is approximately six seconds in D&D 5e combat. Instant-scale
 * results assume prepared materials and assembly, not raw ore smelting.
 */
const craftingTimeBases={tiny:6,small:60,medium:7200,large:43200,massive:86400};
function calculateCraftingTime({size='medium',complexity=0,skill=0,mastered=false}){
  const base=craftingTimeBases[size]||craftingTimeBases.medium;
  const multiplier=(1+Math.max(0,complexity)*.18)*(1-Math.min(5,Math.max(0,skill))*.10)*(mastered?.9:1);
  const seconds=Math.max(6,Math.min(86400,Math.ceil(base*multiplier/6)*6));
  let label;
  if(seconds<=6)label='1 turn (6 seconds)';
  else if(seconds<=60)label=`${Math.ceil(seconds/6)} rounds (${seconds} seconds)`;
  else if(seconds<3600)label=`${Math.ceil(seconds/60)} minutes`;
  else label=`${Number((seconds/3600).toFixed(1))} hours`;
  return {seconds,label};
}
