/* GuildenHeim developer guide — adding a discovery rule:
 * 1. Give the entry a unique id.
 * 2. Use requiredTags that the engine actually emits (inspect classifyWeapon()).
 * 3. Keep the effect descriptive. Matching is a CANDIDATE, not an automatic bonus.
 * 4. discoveryDifficulty is informational for the DM (1 easy → 5 very hard).
 * Change these values to suit the campaign, and playtest any actual abilities.
 */
const interactionRules = [
  {id:'crescent_sweep',name:'Crescent Sweep',requiredTags:['curved','slashing','long-reach'],discoveryDifficulty:3,effect:'May enable a limited sweeping maneuver.'},
  {id:'thunder_impact',name:'Reinforced Impact',requiredTags:['hammer','technique:reinforcement'],discoveryDifficulty:2,effect:'May support a specialized impact or knockback maneuver.'},
  {id:'needle_point',name:'Needlepoint',requiredTags:['narrow','piercing','technique:precision'],discoveryDifficulty:2,effect:'May support a situational precision-piercing technique.'},
  {id:'mithral_balance',name:'Mithral Poise',requiredTags:['mithral','technique:balancing'],discoveryDifficulty:2,effect:'May make demanding movement or control techniques practical.'},
  {id:'adamantine_bracing',name:'Adamantine Bracing',requiredTags:['adamantine','technique:reinforcement'],discoveryDifficulty:3,effect:'May resist damage to a heavily stressed component.'},
  {id:'barbed_lunge',name:'Barbed Lunge',requiredTags:['spear','barbed','long-reach'],discoveryDifficulty:3,effect:'May enable a specialized snagging or control technique.'},
  {id:'hooked_reach',name:'Hooked Reach',requiredTags:['hooked','long-reach'],discoveryDifficulty:2,effect:'May support a hooking or disarming maneuver.'},
  {id:'layered_edge',name:'Layered Edge',requiredTags:['slashing','technique:lamination'],discoveryDifficulty:3,effect:'May improve reliability under repeated cutting impacts.'}
];
