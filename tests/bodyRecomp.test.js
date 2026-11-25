import test from 'node:test';
import assert from 'node:assert/strict';
import {RECOMP_START,RECOMP_END,RECOMP_EXERCISES,RECOMP_RECIPES,RECOMP_GROCERIES,allRecompDays,buildRecompDay,exercisesForSession} from '../src/bodyRecompData.js';

test('eight-week program has 56 continuous dated days',()=>{
 const days=allRecompDays();
 assert.equal(days.length,56);
 assert.equal(days[0].date,RECOMP_START);
 assert.equal(days.at(-1).date,RECOMP_END);
 assert.deepEqual([...new Set(days.map(x=>x.date))].length,56);
 assert.equal(days[0].week,1);
 assert.equal(days.at(-1).week,8);
});

test('exercise prescriptions match the workbook by session',()=>{
 assert.equal(RECOMP_EXERCISES.length,22);
 assert.equal(exercisesForSession('Lower A').length,4);
 assert.equal(exercisesForSession('Upper A + Core').length,5);
 assert.equal(exercisesForSession('Lower B').length,5);
 assert.equal(exercisesForSession('Upper B + Core').length,7);
 assert.equal(exercisesForSession('Abs + Core').length,4);
 const raised=RECOMP_EXERCISES.find(x=>x.name.includes('straight-leg'));
 assert.equal(raised.startingWeight,5);
 assert.equal(raised.sets,3);
});

test('meal rotation repeats every two weeks while preserving the week number',()=>{
 assert.equal(buildRecompDay('2026-11-26').breakfast,buildRecompDay('2026-12-10').breakfast);
 assert.equal(buildRecompDay('2026-11-26').week,1);
 assert.equal(buildRecompDay('2026-12-10').week,3);
 assert.equal(buildRecompDay('2026-12-25').session,'Upper A + Core');
 assert.match(buildRecompDay('2026-12-25').note,/Holiday/);
 assert.equal(buildRecompDay('2026-11-24'),null);
 assert.equal(buildRecompDay('2027-01-20'),null);
});

test('recipe and grocery libraries are complete and have unique ids',()=>{
 assert.equal(RECOMP_RECIPES.length,14);
 assert.equal(new Set(RECOMP_RECIPES.map(x=>x.id)).size,14);
 assert.equal(RECOMP_GROCERIES.length,9);
 assert.ok(RECOMP_RECIPES.some(x=>x.name.includes('khichdi')));
});

test('November 25 high-school reunion has an abs session, not rest',()=>{
 const d=buildRecompDay('2026-11-25');
 assert.equal(d.session,'Abs + Core');
 assert.match(d.note,/reunion/i);
 assert.equal(exercisesForSession(d.session).length,4);
 const names=exercisesForSession(d.session).map(x=>x.name.toLowerCase());
 assert.ok(names.some(x=>x.includes('captain')));
 assert.ok(names.some(x=>x.includes('russian twist')));
 assert.ok(names.some(x=>x.includes('rainbow')));
 assert.equal(buildRecompDay('2026-11-26').session,'Lower A');
});
