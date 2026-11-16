export const STORE_KEY='bloomandbalance-v2';
export const EMPTY={completion:{},custom:{},optional:{},moods:{},notes:{},hydration:{},approvedSupplements:[],socialEvents:[]};
export function loadState(){try{const o=JSON.parse(localStorage.getItem(STORE_KEY));if(o && typeof o==='object')return {...EMPTY,...o};}catch{}return {...EMPTY}}
export function saveState(s){try{localStorage.setItem(STORE_KEY,JSON.stringify(s))}catch{}}
export function exportState(s){return JSON.stringify({app:'bloom-and-balance',version:2,exportedAt:new Date().toISOString(),data:s},null,2)}
export function importState(text){const raw=JSON.parse(text);if(raw?.app!=='bloom-and-balance'||raw?.version!==2||!raw?.data||typeof raw.data!=='object')throw new Error('Please choose a Bloom & Balance v2 backup.');return {...EMPTY,...raw.data}}
