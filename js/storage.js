/* GuildenHeim — js/storage.js */
const STORAGE_KEY = 'forgebook_discoveries_v1';
const DM_ACCESS_CODE = 'test123'; // Convenience UI lock only; static-site visitors can inspect this.
const MATERIAL_KEY='guildenheim_material_attributes_v1';
const CRAFTER_KEY='guildenheim_crafter_xp_v1';
const CRAFT_HISTORY_KEY='guildenheim_craft_history_v1';
function localJSON(key,fallback){try{return JSON.parse(localStorage.getItem(key))||fallback}catch{return fallback}}
function localSave(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
const materialAttributes=localJSON(MATERIAL_KEY,{});
const crafterXP=localJSON(CRAFTER_KEY,{});
const craftHistory=localJSON(CRAFT_HISTORY_KEY,{});
function rating(id,key){const n=Number(materialAttributes[id]?.[key]);return Number.isFinite(n)&&n>=0&&n<=10?n:materialDefaults[id][key]}
function xpForLevel(level){return [0,20,50,90,140,200][level]||0}
function levelForXP(xp){let level=0;for(let n=1;n<=5;n++)if(xp>=xpForLevel(n))level=n;return level}
