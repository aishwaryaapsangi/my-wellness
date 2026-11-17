import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeIntention,setIntentionForDate,addIntentionTodo,changeIntentionTodo,removeIntentionTodo} from '../src/dailyIntentions.js';
import {EMPTY,exportState,importState} from '../src/storage.js';

test('old wellness backups default to an empty intentions area',()=>{
 assert.deepEqual(normalizeIntention(undefined),{feeling:'',intention:'',notes:'',todos:[]});
 const oldBackup={app:'bloom-and-balance',version:2,data:{notes:{'2026-11-16':'evening reflection'},completion:{'2026-11-16':{a:true}}}};
 const loaded=importState(JSON.stringify(oldBackup));
 assert.deepEqual(loaded.intentions,{});
 assert.equal(loaded.notes['2026-11-16'],'evening reflection');
 assert.equal(loaded.completion['2026-11-16'].a,true);
});
test('morning intentions and freewriting are independent for each day',()=>{
 let all={};
 all=setIntentionForDate(all,'2026-11-16',{feeling:'Confident, focused',intention:'Finish the task and be kind to myself'});
 all=setIntentionForDate(all,'2026-11-17',{feeling:'Rested',notes:'Call the family'});
 assert.equal(all['2026-11-16'].intention,'Finish the task and be kind to myself');
 assert.equal(all['2026-11-17'].intention,'');
 assert.equal(all['2026-11-17'].notes,'Call the family');
});
test('custom to-dos can be added, checked, edited and removed without changing another date',()=>{
 let all=setIntentionForDate({},'2026-11-16',{intention:'Be present'});
 all=addIntentionTodo(all,'2026-11-16','  Call Bonnie  ','personal-1');
 all=addIntentionTodo(all,'2026-11-17','Walk outside','personal-2');
 all=addIntentionTodo(all,'2026-11-16','  ','empty');
 assert.equal(all['2026-11-16'].todos.length,1);
 assert.deepEqual(all['2026-11-16'].todos[0],{id:'personal-1',text:'Call Bonnie',done:false});
 all=changeIntentionTodo(all,'2026-11-16','personal-1',{done:true,text:'Text Bonnie'});
 assert.equal(all['2026-11-16'].todos[0].done,true);
 assert.equal(all['2026-11-16'].todos[0].text,'Text Bonnie');
 assert.equal(all['2026-11-17'].todos[0].done,false);
 all=removeIntentionTodo(all,'2026-11-16','personal-1');
 assert.equal(all['2026-11-16'].todos.length,0);
 assert.equal(all['2026-11-16'].intention,'Be present');
});
test('existing JSON backup includes intentions and continues to preserve other state',()=>{
 const data={...EMPTY,notes:{'2026-11-16':'Old reflection'},intentions:{
  '2026-11-16':{feeling:'Grounded',intention:'A good beginning',notes:'Remember water',todos:[{id:'x',text:'Buy flowers',done:true}]}
 }};
 const restored=importState(exportState(data));
 assert.deepEqual(restored.intentions,data.intentions);
 assert.equal(restored.notes['2026-11-16'],'Old reflection');
 assert.deepEqual(restored.custom,{});
});
