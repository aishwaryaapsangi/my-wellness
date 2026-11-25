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
 assert.equal(RECOMP_EXERCISES.length,20);
 assert.equal(exercisesForSession('Lower A').length,4);
 assert.equal(exercisesForSession('Upper A + Core').length,5);
 assert.equal(exercisesForSession('Lower B').length,5);
 assert.equal(exercisesForSession('Upper B + Core').length,6);
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
